import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

export async function createWorkbench(mount, { compact = false, onFailure, onInspectChange, onTopicChange }) {
  const response = await fetch("/assets/lighting/studio-small-09-1k.hdr", { signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error("Studio lighting could not load");
  const hdr = new HDRLoader().parse(await response.arrayBuffer());
  const source = new THREE.DataTexture(hdr.data, hdr.width, hdr.height, THREE.RGBAFormat, hdr.type);
  source.mapping = THREE.EquirectangularReflectionMapping;
  source.flipY = true;
  source.colorSpace = THREE.LinearSRGBColorSpace;
  source.minFilter = source.magFilter = THREE.LinearFilter;
  source.needsUpdate = true;
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, compact ? 1.5 : 1.75));
  renderer.setClearColor(0x030507, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.setAttribute("aria-hidden", "true");
  renderer.domElement.tabIndex = -1;
  mount.append(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x030507, 11, 25);
  const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 40);
  const environment = new THREE.PMREMGenerator(renderer);
  const environmentMap = environment.fromEquirectangular(source);
  scene.environment = environmentMap.texture;
  scene.environmentIntensity = 0.65;
  scene.environmentRotation.y = 0.6;
  source.dispose();
  environment.dispose();

  const materials = {
    ivory: new THREE.MeshStandardMaterial({
      color: 0xc4bba6,
      metalness: 0.08,
      roughness: 0.38,
    }),
    brass: new THREE.MeshStandardMaterial({
      color: 0x8c7759,
      metalness: 0.8,
      roughness: 0.29,
    }),
    blue: new THREE.MeshStandardMaterial({
      color: 0x131e2a,
      metalness: 0.3,
      roughness: 0.7,
    }),
    dark: new THREE.MeshStandardMaterial({
      color: 0x101923,
      metalness: 0.5,
      roughness: 0.45,
    }),
    titanium: new THREE.MeshStandardMaterial({ color: 0x59616a, metalness: 0.92, roughness: 0.3 }),
    detail: new THREE.MeshStandardMaterial({
      color: 0x637b8b,
      metalness: 0.7,
      roughness: 0.35,
    }),
  };
  scene.add(new THREE.HemisphereLight(0xc1d6ef, 0x172437, 0.12));
  const key = new THREE.DirectionalLight(0xffecd9, 2.8);
  key.position.set(-3, 7, 3);
  key.castShadow = true;
  key.shadow.mapSize.setScalar(compact ? 1024 : 2048);
  Object.assign(key.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: 0.5, far: 18 });
  key.shadow.normalBias = 0.012;
  key.shadow.bias = -0.0001;
  key.shadow.radius = 3;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xa4bdd5, 0.45);
  fill.position.set(4, 2, -3);
  scene.add(fill);

  const stage = new THREE.Group();
  scene.add(stage);
  const root = new THREE.Group();
  stage.add(root);
  const textures = [];
  // Fine-scale roughness and bump variation keeps close-up metal from reading as plastic.
  const grainData = new Uint8Array(128 * 128 * 4);
  let seed = 739;
  for(let i=0;i<128*128;i++) {
    seed = (Math.imul(seed,1664525)+1013904223) >>> 0;
    const value = 170 + (seed >>> 27);
    grainData.set([value,value,value,255],i*4);
  }
  const grain = new THREE.DataTexture(grainData,128,128);
  grain.wrapS=grain.wrapT=THREE.RepeatWrapping; grain.repeat.set(18,70);grain.needsUpdate=true;textures.push(grain);
  for(const material of [materials.titanium,materials.brass,materials.ivory]) {
    material.roughnessMap=grain;material.bumpMap=grain;material.bumpScale=0.0012;
  }
  const desktopMaterial = new THREE.ShadowMaterial({color:0x000000,opacity:0.3,fog:false});
  materials.desktop = desktopMaterial;
  const labelMaterials = [];
  const geometries = new Set();
  function mesh(geometry, material, parent = root, position = [0, 0, 0]) {
    geometries.add(geometry);
    const object = new THREE.Mesh(geometry, material);
    object.castShadow = true;
    object.receiveShadow = true;
    object.position.set(...position);
    parent.add(object);
    return object;
  }
  function box(size, position, material, parent = root, radius = 0.016) {
    return mesh(
      new RoundedBoxGeometry(...size, 3, Math.min(radius, ...size.map(v => v / 3))),
      material,
      parent,
      position,
    );
  }
  function cylinder(
    radius,
    length,
    position,
    material,
    parent = root,
    axis = "y",
  ) {
    const object = mesh(
      new THREE.CylinderGeometry(radius, radius, length, compact ? 20 : 28),
      material,
      parent,
      position,
    );
    if (axis === "z") object.rotation.x = Math.PI / 2;
    return object;
  }

  // Bake the static bench into two materials; the articulated joints remain separate.
  const benchParts = [];
  function benchBox(size, position) {
    const geometry = new RoundedBoxGeometry(...size, 2, 0.04);
    geometry.translate(...position);
    benchParts.push(geometry);
  }
  box([18,0.3,70],[0,-0.2,-24],desktopMaterial,scene).castShadow = false;
  benchBox([1.7, 0.12, 0.85], [-0.3, 0.07, 0]);
  for (const x of [robotPickupX, robotDropX]) {
    benchBox([0.56, 0.16, 0.58], [x, 0.19, 0]);
  }
  mesh(mergeGeometries(benchParts), materials.blue);
  benchParts.forEach((geometry) => geometry.dispose());

  const shadowCanvas = document.createElement("canvas");
  shadowCanvas.width = shadowCanvas.height = 128;
  const context = shadowCanvas.getContext("2d");
  const gradient = context.createRadialGradient(64, 64, 2, 64, 64, 64);
  gradient.addColorStop(0, "rgba(0,0,0,.65)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
  const shadowMaterial = new THREE.MeshBasicMaterial({
    map: shadowTexture,
    transparent: true,
    depthWrite: false,
  });
  const shadow = mesh(
    new THREE.PlaneGeometry(2.8, 2.4),
    shadowMaterial,
    root,
    [0.7, 0.006, 0.1],
  );
  shadow.rotation.x = -Math.PI / 2;

  const robot = new THREE.Group();
  robot.position.set(1.18, 0, 0);
  root.add(robot);
  cylinder(0.47, 0.15, [0, 0.08, 0], materials.ivory, robot);
  cylinder(0.34, 0.5, [0, 0.4, 0], materials.ivory, robot);
  cylinder(0.345, 0.045, [0, 0.35, 0], materials.brass, robot);
  const shoulder = new THREE.Group();
  shoulder.position.y = 0.68;
  robot.add(shoulder);
  cylinder(0.29, 0.44, [0, 0, 0], materials.ivory, shoulder, "z");
  cylinder(0.2, 0.46, [0, 0, 0], materials.brass, shoulder, "z");
  box([0.34, 1.35, 0.3], [0, 0.69, 0], materials.ivory, shoulder, 0.13);
  box([0.15, 0.8, 0.017], [0, 0.67, 0.16], materials.brass, shoulder, 0.008);
  const elbow = new THREE.Group();
  elbow.position.y = 1.45;
  shoulder.add(elbow);
  cylinder(0.24, 0.4, [0, 0, 0], materials.ivory, elbow, "z");
  cylinder(0.145, 0.42, [0, 0, 0], materials.brass, elbow, "z");
  box([0.27, 1.06, 0.25], [0, 0.58, 0], materials.ivory, elbow, 0.12);
  box([0.13, 0.6, 0.017], [0, 0.56, 0.135], materials.brass, elbow, 0.008);
  const wrist = new THREE.Group();
  wrist.position.y = 1.2;
  elbow.add(wrist);
  cylinder(0.15, 0.25, [0, 0.075, 0], materials.brass, wrist);
  box([0.3, 0.13, 0.2], [0, 0.24, 0], materials.dark, wrist, 0.04);
  const fingerLeft = box(
    [0.055, 0.22, 0.075],
    [-0.1, 0.4, 0],
    materials.brass,
    wrist,
    0.012,
  );
  const fingerRight = box(
    [0.055, 0.22, 0.075],
    [0.1, 0.4, 0],
    materials.brass,
    wrist,
    0.012,
  );
  const part = box(
    [0.19, 0.19, 0.19],
    [robotPickupX, robotPartY, 0],
    materials.brass,
    root,
    0.018,
  );

  // A physical wiring diagram and a small product artifact connect the scene to the work.
  const research = new THREE.Group();
  research.position.set(-1.72, 0.02, -0.35);
  root.add(research);
  cylinder(0.42, 0.065, [0, 0.02, 0], materials.dark, research);
  const points = [
    [0, 0.2, 0],
    [-0.25, 0.55, 0],
    [0.25, 0.55, 0],
    [0, 0.9, 0],
  ];
  const nodeGeometry = new THREE.SphereGeometry(0.045, 12, 8);
  geometries.add(nodeGeometry);
  const nodes = new THREE.InstancedMesh(
    nodeGeometry,
    materials.brass,
    points.length,
  );
  const matrix = new THREE.Matrix4();
  points.forEach((point, index) =>
    nodes.setMatrixAt(index, matrix.makeTranslation(...point)),
  );
  research.add(nodes);
  const edgePositions = [];
  [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
  ].forEach(([from, to]) => edgePositions.push(...points[from], ...points[to]));
  const edgeGeometry = new THREE.BufferGeometry();
  edgeGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(edgePositions, 3),
  );
  geometries.add(edgeGeometry);
  const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xa9b4ad });
  research.add(new THREE.LineSegments(edgeGeometry, edgeMaterial));
  const product = new THREE.Group();
  product.position.set(1.8, 0.12, 0.75);
  product.rotation.set(-0.15, -0.2, 0);
  root.add(product);
  box([0.46, 0.58, 0.075], [0, 0.3, 0], materials.dark, product, 0.045);
  label(['PLC', 'I/O READY'], 0.35, 0.39, [0, 0.33, 0.046], product);
  for (const [x, text] of [[robotPickupX, 'PICK'], [robotDropX, 'PLACE']]) {
    label([text], 0.38, 0.096, [x, 0.185, 0.293], root);
  }
  const components = new THREE.Group();
  root.add(components);
  cylinder(0.16, 0.12, [-1.6, 0.06, 0.8], materials.brass, components);
  cylinder(0.1, 0.2, [-1.05, 0.1, 0.85], materials.dark, components);

  cylinder(0.51,0.06,[0,-0.02,0],materials.titanium,robot);
  const fastenerGeometry = new THREE.CylinderGeometry(0.016,0.016,0.012,12);geometries.add(fastenerGeometry);
  function bolts(parent, radius, z, count = 8) {
    const screws = new THREE.InstancedMesh(fastenerGeometry,materials.dark,count);
    const dummy = new THREE.Object3D();
    for(let i=0;i<count;i++) { const angle=i/count*Math.PI*2;dummy.position.set(Math.cos(angle)*radius,Math.sin(angle)*radius,z);dummy.rotation.x=Math.PI/2;dummy.updateMatrix();screws.setMatrixAt(i,dummy.matrix); }
    screws.castShadow=true;parent.add(screws);
  }
  bolts(shoulder,0.235,0.237);bolts(elbow,0.19,0.219);
  for(const [joint,length] of [[shoulder,1.35],[elbow,1.06]]) {
    cylinder(0.115,0.012,[0,0,0.248],materials.titanium,joint,'z');
    const cable = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.18,0,-0.1),new THREE.Vector3(-0.23,length*0.45,-0.1),new THREE.Vector3(-0.16,length,-0.08)]);
    mesh(new THREE.TubeGeometry(cable,18,0.027,8,false),materials.dark,joint);
  }
  for(let i=0;i<3;i++) cylinder(0.18-i*0.016,0.028,[0,0.05+i*0.05,0],materials.titanium,wrist);

  const stations = { robotics: root };
  const layers = { software: [], research: [], products: [] };
  function station(name) {
    const group = new THREE.Group();
    stage.add(group); stations[name] = group;
    const contact = new THREE.Mesh(shadow.geometry, shadowMaterial);
    contact.rotation.x = -Math.PI / 2; contact.position.set(0, -0.015, 0); contact.scale.setScalar(1.5); group.add(contact);
    return group;
  }
  function label(lines, width, height, position, parent, light = false) {
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = Math.round(512 * height / width);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = light ? '#ddd8c9' : '#142737'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = light ? '#142737' : '#ddd8c9'; ctx.font = '500 28px monospace';
    lines.forEach((line, i) => ctx.fillText(line, 30, 48 + i * 45));
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
    textures.push(texture);
    const material = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }); labelMaterials.push(material);
    return mesh(new THREE.PlaneGeometry(width, height), material, parent, position);
  }
  // Full-size laptop: the software is the focal point, with hardware revealed on inspection.
  const software = station('software');
  const chassis = new THREE.Group(); software.add(chassis);
  box([4.15,0.12,2.7],[0,0.09,0],materials.titanium,chassis,0.045);
  box([3.95,0.025,2.5],[0,0.02,0],materials.dark,chassis);
  for(const x of [-1.7,1.7]) for(const z of [-1,1]) cylinder(0.10,0.08,[x,-0.01,z],materials.dark,chassis);
  const deck = new THREE.Group(); deck.position.y=0.16; software.add(deck); layers.software.push(deck);
  box([3.5,0.018,1.3],[0,0,-0.4],materials.dark,deck,0.05);
  const keyGeometry = new RoundedBoxGeometry(0.195,0.035,0.19,2,0.012); geometries.add(keyGeometry);
  const keys = new THREE.InstancedMesh(keyGeometry,materials.dark,70);keys.castShadow=true; keys.receiveShadow=true; deck.add(keys);
  const keyMatrix = new THREE.Matrix4();
  for(let row=0;row<5;row++) for(let col=0;col<14;col++) keys.setMatrixAt(row*14+col,keyMatrix.makeTranslation(-1.56+col*0.24,0.033,-0.89+row*0.235));
  box([1.13,0.033,0.16],[0,0.035,0.26],materials.dark,deck,0.015);
  box([1.44,0.008,0.64],[0,0.001,0.79],materials.titanium,deck,0.035);
  const grilleGeometry = new THREE.BoxGeometry(0.052,0.003,0.011);geometries.add(grilleGeometry);
  const grille = new THREE.InstancedMesh(grilleGeometry,materials.dark,34);deck.add(grille);
  for(let side=0;side<2;side++) for(let i=0;i<17;i++) grille.setMatrixAt(side*17+i,keyMatrix.makeTranslation(side?1.91:-1.91,0.011,-0.91+i*0.066));
  for(let i=0;i<3;i++) box([0.012,0.032,0.17],[-2.077,0.09,-0.75+i*0.35],materials.dark,chassis,0.008);
  const lid = new THREE.Group(); lid.position.set(0,0.16,-1.21); lid.rotation.x=-0.16;software.add(lid);
  box([4.14,2.55,0.07],[0,1.28,0],materials.titanium,lid,0.05);
  box([4.02,2.43,0.02],[0,1.28,0.045],materials.dark,lid,0.045);
  function display(parent, width, height, position, draw) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = Math.round(canvas.width * height / width);
    const context = canvas.getContext('2d');
    const rect = (x, y, w, h, color) => {
      context.fillStyle = color;
      context.fillRect(x, y, w, h);
    };
    const text = (value, x, y, size, color) => {
      context.fillStyle = color;
      context.font = `500 ${size}px monospace`;
      context.fillText(value, x, y);
    };
    rect(0, 0, canvas.width, canvas.height, '#0c1620');
    draw(rect, text, context, canvas.height);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    textures.push(texture);
    const material = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
    labelMaterials.push(material);
    return mesh(new THREE.PlaneGeometry(width, height), material, parent, position);
  }
  display(lid, 3.86, 2.26, [0, 1.28, 0.057], (rect, text) => {
    rect(0, 0, 1024, 56, '#192936');
    rect(0, 56, 214, 544, '#11202b');
    rect(213, 56, 2, 544, '#283b48');
    text('WORKSPACE', 26, 35, 17, '#dabd85');
    text('src / agent / runner.ts', 244, 35, 17, '#a6bbc7');
    text('EXPLORER', 26, 100, 15, '#829aa9');
    ['src/', '  agent/', '    runner.ts', '    schema.ts', 'tests/', '  runner.test.ts'].forEach((line, i) => {
      if (i === 2) rect(14, 169, 190, 33, '#214044');
      text(line, 25, 128 + i * 32, 15, i === 2 ? '#dceee7' : '#a6bbc7');
    });
    text('runner.ts', 252, 105, 22, '#e1eced');
    rect(244, 126, 742, 1, '#344553');
    const lines = [
      ['export async function run(task: Task) {', '#9ebef0'],
      ['  const plan = await planner.propose(task);', '#c3d6dc'],
      ['  const steps = PlanSchema.parse(plan);', '#d6bc86'],
      ['  const result = await tools.execute(steps);', '#c3d6dc'],
      ['  return review(result);', '#9ed4c5'],
      ['}', '#9ebef0'],
    ];
    lines.forEach(([line, color], i) => {
      text(String(i + 1), 254, 170 + i * 47, 16, '#6d8795');
      text(line, 302, 170 + i * 47, 21, color);
    });
    rect(244, 475, 742, 85, '#152831');
    text('VERIFICATION', 270, 509, 16, '#d6bc86');
    text('Schema validation  /  Tool execution  /  Result review', 270, 541, 18, '#acc9c5');
  });
  const stepMarker = mesh(
    new THREE.PlaneGeometry(0.024, 0.135),
    new THREE.MeshBasicMaterial({ color: 0xefd49e, toneMapped: false }),
    lid, [-1.03, 1.6, 0.060],
  );
  labelMaterials.push(stepMarker.material);
  const hinge=cylinder(0.07,3.6,[0,0.16,-1.20],materials.titanium,software);hinge.rotation.z=Math.PI/2;
  const board = new THREE.Group(); board.position.y=0.11;software.add(board);layers.software.push(board);
  box([2.9,0.018,1.1],[0,0,-0.35],materials.blue,board);
  box([0.5,0.035,0.5],[-0.5,0.025,-0.35],materials.titanium,board);
  for(let i=0;i<8;i++) box([0.17,0.025,0.3],[0.1+i*0.15,0.021,-0.35],materials.dark,board,0.004);
  const signalMaterial=new THREE.MeshStandardMaterial({color:0x739a86,emissive:0x739a86,emissiveIntensity:0.4});labelMaterials.push(signalMaterial);
  const signal=mesh(new THREE.SphereGeometry(0.012,12,8),signalMaterial,software,[1.91,0.095,1.356]);
  const ml = station('research');
  for(let i=0;i<3;i++) {
    const layer=new THREE.Group();layer.position.set(0.45,0.20+i*0.24,0);ml.add(layer);layers.research.push(layer);
    box([1.9,0.15,1.7],[0,0,0],i===1?materials.brass:materials.titanium,layer);
    box([1.28,0.04,1.1],[0,0.105,0],materials.blue,layer,0.015);
    label([["01 / EMBEDDINGS", "02 / INFERENCE", "03 / EVALUATION"][i]],1.5,0.18,[0,0,0.86],layer);
    if (i === 2) {
      const instrument = new THREE.Group();
      instrument.position.set(0, 0.34, 0);
      instrument.rotation.x = -Math.PI / 2 + 0.42;
      layer.add(instrument);
      box([1.23, 1.04, 0.04], [0, 0, 0], materials.titanium, instrument, 0.015);
      display(instrument, 1.15, 0.97, [0, 0, 0.022], (rect, text, context) => {
        text('EVALUATION TRACE', 77, 101, 47, '#dabd85');
        for (let y = 201; y < 730; y += 128) rect(77, y, 870, 3, '#263f4a');
        const trace = [[77, 650], [208, 600], [340, 621], [472, 430], [605, 475], [736, 320], [946, 258]];
        context.strokeStyle = '#8fd0bc';
        context.lineWidth = 12;
        context.beginPath();
        trace.forEach(([x, y], index) => index === 0 ? context.moveTo(x, y) : context.lineTo(x, y));
        context.stroke();
        trace.forEach(([x, y]) => rect(x - 9, y - 9, 18, 18, '#f0d5a3'));
      });
    }
    for(let j=0;j<6;j++) box([0.045,0.025,0.42],[-0.61+j*0.24,0.12,0.57],materials.brass,layer,0.005);
  }
  const boardMaterial = new THREE.MeshStandardMaterial({color:0x16302c,roughness:0.58,metalness:0.25});materials.board=boardMaterial;
  box([1.65,0.045,2.7],[-1.475,0.055,0],boardMaterial,ml,0.012);
  for(let i=0;i<6;i++) {
    box([0.45,0.05,0.27],[-1.65+(i%2)*0.64,0.105,-0.8+Math.floor(i/2)*0.72],materials.dark,ml,0.009);
    for(let j=0;j<4;j++) box([0.04,0.009,0.03],[-1.84+(i%2)*0.64+j*0.11,0.09,-0.99+Math.floor(i/2)*0.72],materials.brass,ml,0.002);
  }
  for(let i=0;i<16;i++) box([0.009,0.003,1.84],[-2.16+i*0.025,0.082,0],materials.brass,ml,0.001);
  for(const x of [-0.40,1.30]) for(const z of [-0.7,0.7]) cylinder(0.035,0.7,[x,0.3,z],materials.brass,ml);
  // Batch fixed circuit details; the three inspectable layers stay articulated.
  const circuitBatches = new Map();
  for (const child of [...ml.children]) {
    if (!child.isMesh || child.material === shadowMaterial) continue;
    child.updateMatrix();
    const geometry = (child.geometry.index ? child.geometry.toNonIndexed() : child.geometry.clone()).applyMatrix4(child.matrix);
    if (!circuitBatches.has(child.material)) circuitBatches.set(child.material, []);
    circuitBatches.get(child.material).push(geometry);
    ml.remove(child);
  }
  for (const [material, parts] of circuitBatches) {
    mesh(mergeGeometries(parts), material, ml);
    parts.forEach(part => part.dispose());
  }
  const ai = station('products');
  box([1.5,2.65,0.16],[0.72,1.37,-0.15],materials.titanium,ai,0.055);
  box([1.33,2.4,0.01],[0.72,1.37,-0.06],materials.dark,ai,0.01);
  display(ai, 1.32, 2.37, [0.72, 1.37, -0.051], (rect, text, context, height) => {
    rect(0, 0, 1024, 150, '#182b39');
    text('AGENT CONSOLE', 72, 95, 45, '#dabd85');
    text('Run trace', 72, 308, 90, '#e3eeed');
    const steps = [
      ['CONTEXT', 'Retrieve evidence'],
      ['EXECUTION', 'Call a scoped tool'],
      ['REVIEW', 'Validate the result'],
    ];
    context.strokeStyle = '#617e89';
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(116, 523);
    context.lineTo(116, 1353);
    context.stroke();
    steps.forEach(([title, description], i) => {
      const y = 422 + i * 400;
      rect(180, y, 770, 264, '#152832');
      rect(180, y + 263, 770, 2, '#2c4653');
      text(title, 231, y + 96, 51, '#e0eae9');
      text(description, 231, y + 192, 36, '#abc1c7');
      rect(97, y + 103, 38, 38, '#456169');
    });
    rect(0, height - 156, 1024, 156, '#172a36');
    text('TRACE / CONTEXT TO REVIEW', 72, height - 62, 37, '#8bb8bd');
  });
  const runIndicator = mesh(
    new THREE.PlaneGeometry(0.047, 0.047),
    new THREE.MeshBasicMaterial({ color: 0xf1cf94, toneMapped: false }),
    ai, [0.21, 1.84, -0.048],
  );
  labelMaterials.push(runIndicator.material);
  box([0.25,0.036,0.022],[0.72,2.625,-0.045],materials.dark,ai,0.015);
  cylinder(0.019,0.014,[0.87,2.625,-0.042],materials.detail,ai,'z');
  box([0.025,0.26,0.07],[1.477,1.93,-0.14],materials.titanium,ai,0.009);
  const agentCards = [
    ['01 / CONTEXT', 'Retrieve evidence'],
    ['02 / EXECUTION', 'Call a scoped tool'],
    ['03 / REVIEW', 'Check the result'],
  ];
  agentCards.forEach((lines, index) => {
    const card = new THREE.Group();
    card.position.set(-1.08 - index * 0.11, 1.62 - index * 0.35, -0.31 + index * 0.16);
    ai.add(card);
    layers.products.push(card);
    box([1.72,0.49,0.065],[0,0,0],materials.titanium,card,0.021);
    label(lines,1.61,0.407,[0,0,0.034],card);
    box([0.02,0.4,0.01],[-0.78,0,0.039],materials.brass,card,0.003);
  });
  box([1.78,0.076,1.14],[-1.24,0.05,0.02],materials.dark,ai,0.03);
  const basePositions = new Map(Object.values(layers).flat().map(layer => [layer, layer.position.clone()]));
  const topics = ['software', 'products', 'research', 'robotics'];
  const spacing = 10.5;
  topics.forEach((name, index) => { stations[name].position.z = -spacing * index; });
  let journey = false;
  let topic = 'software', inspected = false, explode = 0;
  for (const [name, group] of Object.entries(stations)) group.visible = name === topic;

  let disposed = false;
  let paused = false;
  let visible = true;
  let frameId = 0;
  let lastTime = 0;
  let replayTime = -1;
  let pendingReplay;
  let replayAt = 0;
  let progress = 0;
  let currentProgress = 0;
  let dragStart = null, orbit = 0;
  let pointerX = 0;
  let pointerY = 0;
  let currentX = 0;
  let currentY = 0;
  let slowFrames = 0;
  let frames = 0;
  let rect = mount.getBoundingClientRect();
  const lookAt = new THREE.Vector3(0, 1.0, 0);
  const cameraPosition = new THREE.Vector3();

  function requestRender() {
    if (!disposed && visible && !document.hidden && !paused && !frameId)
      frameId = requestAnimationFrame(render);
  }
  function render(time) {
    frameId = 0;
    if (disposed || paused || !visible || document.hidden) return;
    const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
    lastTime = time;
    const damping = 1 - Math.exp(-dt * 9);
    currentX += (pointerX - currentX) * damping;
    currentY += (pointerY - currentY) * damping;
    currentProgress += (progress - currentProgress) * damping;
    const path = journeyPose(currentProgress);
    const distance = journey ? path.distance : topics.indexOf(topic);
    const nextTopic = topics[Math.round(distance)];
    if (topic !== nextTopic) {
      topic = nextTopic;
      inspected = false;
      onTopicChange?.(topic);
    }
    const inspection = inspected ? 1 : journey ? path.inspection : 0;
    explode += (inspection - explode) * damping;
    for (const [index, name] of topics.entries()) {
      stations[name].visible = Math.abs(index - distance) < 0.92;
      stations[name].rotation.y = orbit + currentX * 0.11;
    }

    if (pendingReplay === topic && Math.abs(currentProgress - progress) < 0.015) {
      replayTime = 0;
      pendingReplay = undefined;
    }
    const duration = topic === 'robotics' ? robotDuration : 2.6;
    if (replayTime >= 0) replayTime = Math.min(duration, replayTime + dt);
    const scrollPhase = journey && topic === topics[path.chapter] ? path.action : 0;
    const phase = replayTime >= 0 ? replayTime / duration : pendingReplay === topic ? 0 : scrollPhase;

    if (stations.robotics.visible) {
      const pose = robotPose(topic === 'robotics' ? phase * robotDuration : 0);
      shoulder.rotation.z = pose.shoulder;
      elbow.rotation.z = pose.elbow;
      wrist.rotation.z = pose.wrist;
      fingerLeft.position.x = -0.12 + pose.grip * 0.025;
      fingerRight.position.x = 0.12 - pose.grip * 0.025;
      part.position.set(pose.partX, pose.partY, 0);
      for (const joint of [shoulder, elbow]) joint.children[1].position.z = (topic === 'robotics' ? explode : 0) * 0.28;
    }
    for (const [name, groupLayers] of Object.entries(layers)) {
      if (!stations[name].visible) continue;
      const action = name === topic ? phase : 0;
      const detail = name === topic ? explode : 0;
      groupLayers.forEach((layer, index) => {
        layer.position.copy(basePositions.get(layer));
        if (name === 'products') {
          const reveal = smoothStep((action - index * 0.15) / 0.38);
          layer.position.x -= (0.08 + index * 0.02) * reveal + index * detail * 0.04;
          layer.position.y += (1 - index) * (reveal * 0.26 + detail * 0.08);
          layer.position.z += reveal * 0.13;
          layer.rotation.y = 0.15 - reveal * 0.2;
        } else if (name === 'research') {
          const separation = smoothStep((action - index * 0.14) / 0.45);
          layer.position.y += index * (separation * 0.33 + detail * 0.27);
        } else {
          layer.position.y += (inspected ? detail : 0) * (index === 0 ? 0.37 : 0.15);
        }
      });
      if (name === 'software') {
        const step = smoothStep((action - 0.26) / 0.09) + smoothStep((action - 0.59) / 0.09);
        stepMarker.position.y = 1.28 + (300 - (256 + step * 47)) * 2.26 / 600;
        signalMaterial.emissiveIntensity = 0.4 + smoothStep((action - 0.65) / 0.35) * 1.2;
        lid.rotation.x = -0.16 - smoothStep(action * 2) * 0.09 - detail * 0.11;
      }
      if (name === 'products') {
        const step = smoothStep((action - 0.26) / 0.10) + smoothStep((action - 0.60) / 0.10);
        runIndicator.position.y = 1.37 + 2.37 / 2 - (544 + 400 * step) * 1.32 / 1024;
      }
    }

    const push = journey ? path.inspection : 0;
    const lift = journey ? Math.sin(path.flight * Math.PI) : 0;
    const researchView = smoothStep(1 - Math.abs(distance - 2));
    cameraPosition.set(
      2.4 - push * 1.65 + currentX * 0.15,
      2.85 - push * 0.55 + lift + researchView * 0.45 + currentY * 0.12,
      7.65 - distance * spacing - push * 0.65,
    );
    lookAt.set(0, 1.03 + push * 0.2, -distance * spacing);
    key.position.set(-3, 7, 3 - distance * spacing);
    key.target.position.set(0, 0, -distance * spacing);
    key.target.updateMatrixWorld();
    camera.position.copy(cameraPosition);
    camera.lookAt(lookAt);
    const before = performance.now();
    renderer.render(scene, camera);
    const renderDuration = performance.now() - before;
    frames++;
    mount.dataset.frames = String(frames);
    mount.dataset.topic = topic;
    mount.dataset.progress = currentProgress.toFixed(3);
    mount.dataset.inspected = String(inspected);
    mount.dataset.replay = String(replayTime >= 0 && replayTime < duration);
    mount.dataset.drawCalls = String(renderer.info.render.calls);
    mount.dataset.triangles = String(renderer.info.render.triangles);
    if (frames > 20 && renderDuration > 45) slowFrames++;
    else slowFrames = Math.max(0, slowFrames - 1);
    if (slowFrames > 20) {
      onFailure();
      return;
    }
    if (
      (replayTime >= 0 && replayTime < duration) || Math.abs(explode - inspection) > 0.001 ||
      Math.abs(currentX - pointerX) > 0.001 ||
      Math.abs(currentY - pointerY) > 0.001 ||
      Math.abs(currentProgress - progress) > 0.001
    )
      requestRender();
  }
  function resize() {
    rect = mount.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1 || disposed) return;
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.zoom = Math.min(1, camera.aspect / 1.05) * (compact ? 0.98 : 1);
    camera.updateProjectionMatrix();
    // A paused scene still gets one correctly sized frame without restarting motion.
    if (paused) renderer.render(scene, camera);
    else requestRender();
  }
  function pointerMove(event) {
    if (dragStart) {
      const dx = event.clientX - dragStart.x;
      if (Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(event.clientY - dragStart.y)) {
        orbit = THREE.MathUtils.clamp(dragStart.orbit + dx * 0.003, -0.65, 0.65);
        requestRender();
      }
      return;
    }
    if (event.pointerType !== "mouse" || compact) return;
    rect = mount.getBoundingClientRect();
    pointerX = Math.max(
      -1,
      Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1),
    );
    pointerY = Math.max(
      -1,
      Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1),
    );
    requestRender();
  }
  function startDrag(event) {
    if (event.button !== 0) return;
    dragStart = { x: event.clientX, y: event.clientY, orbit };
    renderer.domElement.setPointerCapture(event.pointerId);
  }
  function endDrag(event) {
    if (event.type === 'pointerup' && dragStart && Math.hypot(event.clientX - dragStart.x, event.clientY - dragStart.y) < 6) {
      rect = mount.getBoundingClientRect();
      const pointer = new THREE.Vector2((event.clientX - rect.left) / rect.width * 2 - 1, 1 - (event.clientY - rect.top) / rect.height * 2);
      const ray = new THREE.Raycaster();
      ray.setFromCamera(pointer, camera);
      const hit = ray.intersectObject(stations[topic], true).find(item => item.object.material !== shadowMaterial);
      if (hit) { inspected = !inspected; onInspectChange?.(inspected); requestRender(); }
    }
    dragStart = null;
  }
  function resetPointer() {
    pointerX = pointerY = 0;
    requestRender();
  }
  function visibilityChange() {
    lastTime = 0;
    requestRender();
  }
  function contextLost(event) {
    event.preventDefault();
    if (!disposed) onFailure();
  }
  renderer.domElement.addEventListener("webglcontextlost", contextLost);
  renderer.domElement.addEventListener('pointerdown', startDrag);
  renderer.domElement.addEventListener('pointerup', endDrag);
  renderer.domElement.addEventListener('pointercancel', endDrag);
  mount.addEventListener("pointermove", pointerMove);
  mount.addEventListener("pointerleave", resetPointer);
  document.addEventListener("visibilitychange", visibilityChange);
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    mount.dataset.visible = String(visible && !document.hidden);
    lastTime = 0;
    if (!visible && frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    }
    requestRender();
  });
  observer.observe(mount);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(mount);
  resize();
  // Render before exposing the canvas, so initialization errors keep the poster visible.
  cancelAnimationFrame(frameId);
  frameId = 0;
  render(performance.now());

  return {
    getTopic: () => topic,
    setProgress(value) {
      journey = true;
      const nextProgress = Math.max(0, Math.min(1, value));
      if ((pendingReplay || replayTime >= 0) && Math.abs(replayAt - nextProgress) > 0.012) {
        replayTime = -1;
        pendingReplay = undefined;
      }
      progress = nextProgress;
      requestRender();
    },
    setTopic(value) {
      if (!stations[value]) return;
      journey = false;
      if (topic === value) { requestRender(); return; }
      topic = value;
      inspected = false;
      replayTime = 0;
      for(const [name, group] of Object.entries(stations)) group.visible = name === topic;
      requestRender();
    },
    setInspected(value) { inspected = value; requestRender(); },
    replay(value) {
      replayAt = progress;
      pendingReplay = value;
      requestRender();
    },
    cancelReplay() {
      pendingReplay = undefined;
      replayTime = -1;
      requestRender();
    },
    setPaused(value) {
      paused = value;
      mount.dataset.paused = String(value);
      if (paused && frameId) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      }
      lastTime = 0;
      requestRender();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(frameId);
      observer.disconnect();
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', startDrag);
      renderer.domElement.removeEventListener('pointerup', endDrag);
      renderer.domElement.removeEventListener('pointercancel', endDrag);
      mount.removeEventListener("pointermove", pointerMove);
      mount.removeEventListener("pointerleave", resetPointer);
      document.removeEventListener("visibilitychange", visibilityChange);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      geometries.forEach((geometry) => geometry.dispose());
      Object.values(materials).forEach((material) => material.dispose());
      textures.forEach(texture => texture.dispose());
      labelMaterials.forEach(material => material.dispose());
      edgeMaterial.dispose();
      shadowMaterial.dispose();
      shadowTexture.dispose();
      environmentMap.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}

const robotPickupX = -0.82;
const robotDropX = 0.22;
const robotPartY = 0.365;
const robotDuration = 5.4;

function smoothStep(value) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

// Keep the block attached through transfer and return the unloaded gripper to its start pose.
export function robotPose(time) {
  const approach = smoothStep(time / 0.85);
  const lift = smoothStep((time - 1.2) / 0.65);
  const transfer = smoothStep((time - 1.85) / 1.1);
  const lower = smoothStep((time - 2.95) / 0.65);
  const retreat = smoothStep((time - 3.95) / 0.55);
  const home = smoothStep((time - 4.5) / 0.9);
  const partX = robotPickupX + (robotDropX - robotPickupX) * transfer;
  const partY = robotPartY + 0.5 * lift * (1 - lower);
  const wristX = partX + (robotPickupX - robotDropX) * home;
  const wristY = partY + 0.4 + 0.62 * (1 - approach + retreat);
  const rx = wristX - 1.18;
  const ry = wristY - 0.68;
  const elbow = Math.acos(Math.max(-1, Math.min(1, (rx * rx + ry * ry - 1.45 ** 2 - 1.2 ** 2) / (2 * 1.45 * 1.2))));
  const shoulder = Math.atan2(ry, rx) - Math.atan2(1.2 * Math.sin(elbow), 1.45 + 1.2 * Math.cos(elbow)) - Math.PI / 2;
  return {
    shoulder, elbow, wrist: Math.PI - shoulder - elbow, partX, partY,
    grip: smoothStep((time - 0.85) / 0.35) * (1 - smoothStep((time - 3.6) / 0.35)),
  };
}

// Demonstrations finish before the camera leaves for the following station.
export function journeyPose(progress) {
  const position = Math.max(0, Math.min(1, progress)) * 4;
  const chapter = Math.min(3, Math.floor(position));
  const local = position - chapter;
  const actionEnd = chapter === 3 ? 0.92 : 0.63;
  const flight = chapter === 3 ? 0 : smoothStep((local - actionEnd) / (1 - actionEnd));
  return {
    chapter, flight, distance: chapter + flight,
    action: Math.max(0, Math.min(1, (local - 0.08) / (actionEnd - 0.08))),
    inspection: smoothStep(local / 0.34) * (1 - flight) * 0.62,
  };
}
