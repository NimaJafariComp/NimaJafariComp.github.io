import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

export async function createWorkbench(mount, { compact = false, onFailure, onInspectChange }) {
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
  renderer.setClearColor(0x091321, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.setAttribute("aria-hidden", "true");
  renderer.domElement.tabIndex = -1;
  mount.append(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x091321, 11, 25);
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
  const desktopMaterial = new THREE.MeshStandardMaterial({color:0x0b1420,roughness:0.86,metalness:0.12});
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
  box([18,0.3,70],[0,-0.2,-24],desktopMaterial,scene);
  benchBox([1.1, 0.12, 0.85], [-0.4, 0.07, 0]);
  benchBox([0.8, 0.16, 0.58], [-0.4, 0.19, 0]);
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
    [-0.4, 0.38, 0],
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
  box([0.35, 0.39, 0.012], [0, 0.33, 0.045], materials.detail, product, 0.016);
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
    const material = new THREE.MeshBasicMaterial({ map: texture }); labelMaterials.push(material);
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
  const screenCanvas=document.createElement('canvas');screenCanvas.width=1536;screenCanvas.height=900;
  const screen=screenCanvas.getContext('2d');
  screen.fillStyle='#111b25';screen.fillRect(0,0,1536,900);
  screen.fillStyle='#1d2934';screen.fillRect(0,0,1536,64);screen.fillRect(0,64,252,790);
  screen.fillStyle='#c1a373';screen.font='500 25px monospace';screen.fillText('NIMA JAFARI  /  ENGINEERING',32,42);
  screen.fillStyle='#9dafbe';screen.font='22px monospace';
  ['EXPLORER','','career-lift/','  app/','  services/','  models/','','strategy-mining/','pocket-pilot/','wiring-diagram-sdk/'].forEach((v,i)=>screen.fillText(v,26,116+i*40));
  screen.fillStyle='#d7dfe5';screen.font='32px monospace';screen.fillText('From an idea to a working system.',304,150);
  const code=[['# Full-stack · ML · AI · Robotics','#758898'],['','#fff'],['class EngineeringPractice:','#a9c6c2'],['    def build(self, idea):','#c7b593'],['        system = self.design(idea)','#b1bcc5'],['        evidence = self.evaluate(system)','#b1bcc5'],['        return self.ship(system, evidence)','#b1bcc5']];
  screen.font='25px monospace';code.forEach(([line,color],i)=>{screen.fillStyle=color;screen.fillText(line,310,226+i*48)});
  screen.fillStyle='#0c131c';screen.fillRect(274,636,1238,176);screen.fillStyle='#8da89c';screen.font='24px monospace';screen.fillText('SELECTED WORK',308,680);screen.fillStyle='#cbd1d6';screen.fillText('CareerLift  /  PocketPilot  /  GhostD',308,727);screen.fillStyle='#718797';screen.fillText('Explore the projects below for source and research.',308,774);
  screen.fillStyle='#1c313b';screen.fillRect(0,850,1536,50);screen.fillStyle='#adc4c8';screen.font='22px monospace';screen.fillText('Austin, Texas                                        SOFTWARE ENGINEERING',26,883);
  const screenTexture=new THREE.CanvasTexture(screenCanvas);screenTexture.colorSpace=THREE.SRGBColorSpace;screenTexture.anisotropy=renderer.capabilities.getMaxAnisotropy();textures.push(screenTexture);
  const screenMaterial=new THREE.MeshPhysicalMaterial({map:screenTexture,emissiveMap:screenTexture,emissive:0xffffff,emissiveIntensity:0.45,roughness:0.22,metalness:0,clearcoat:0.8,clearcoatRoughness:0.1});labelMaterials.push(screenMaterial);
  mesh(new THREE.PlaneGeometry(3.86,2.26),screenMaterial,lid,[0,1.28,0.057]);
  cylinder(0.032,0.012,[0,2.50,0.056],materials.dark,lid,'z');
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
    label([['ENCODE','LEARN','EVALUATE'][i]],1.4,0.18,[0,0,0.86],layer);
    for(let j=0;j<6;j++) box([0.045,0.025,0.42],[-0.61+j*0.24,0.12,0.57],materials.brass,layer,0.005);
  }
  const boardMaterial = new THREE.MeshStandardMaterial({color:0x16302c,roughness:0.58,metalness:0.25});materials.board=boardMaterial;
  const circuit=box([2.0,0.045,2.7],[-1.30,0.055,0],boardMaterial,ml,0.012);
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
  label(['PocketPilot','','Transactions.','Budgets.','','Financial context.'],1.33,2.4,[0.72,1.37,-0.06],ai);
  box([0.38,0.065,0.02],[0.72,2.51,-0.045],materials.dark,ai,0.025);
  for(let i=0;i<3;i++) {
    const card=new THREE.Group();card.position.set(-1.42+i*0.18,1.0+i*0.07,-0.35+i*0.24);ai.add(card);layers.products.push(card);
    box([1.3,1.7,0.009],[0,0,0],materials.ivory,card,0.004);
    label([['QUESTION','CONTEXT','SOURCES'][i],'','Qdrant retrieval','Ollama inference','Financial context'],1.22,1.58,[0,0,0.006],card,true);
  }
  box([1.05,0.23,0.7],[-0.85,0.15,1.02],materials.brass,ai);
  const basePositions = new Map(Object.values(layers).flat().map(layer => [layer, layer.position.clone()]));
  const topics = ['software', 'products', 'research', 'robotics'];
  topics.forEach((name, index) => { stations[name].position.z = -16 * index; });
  let journey = false;
  let topic = 'software', inspected = false, explode = 0, transition = 1;
  for (const [name, group] of Object.entries(stations)) group.visible = name === topic;

  let disposed = false;
  let paused = false;
  let visible = true;
  let frameId = 0;
  let lastTime = 0;
  let replayTime = -1;
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
    transition = Math.min(1, transition + dt / 1.1);
    const path = journeyPose(currentProgress);
    if (journey) topic = topics[path.chapter];
    const inspection = inspected ? 1 : journey ? path.inspection : 0;
    explode += (inspection - explode) * damping;
    const distance = journey ? path.distance : topics.indexOf(topic);
    for (const [index, name] of topics.entries()) {
      stations[name].visible = Math.abs(index - distance) < 0.85;
      stations[name].rotation.y = orbit + currentX * 0.13;
    }
    if (replayTime >= 0) { replayTime += dt; if (replayTime > 5.15) replayTime = -1; }
    const clamp = v => Math.max(0, Math.min(1, v));
    const cycle = Math.max(0, replayTime);
    if (topic === 'robotics') {
      const pose = robotPose(journey && replayTime < 0 ? path.local * 5.15 : replayTime);
      shoulder.rotation.z = pose.shoulder;
      elbow.rotation.z = pose.elbow;
      wrist.rotation.z = pose.wrist;
      fingerLeft.position.x = -0.12 + pose.grip * 0.025;
      fingerRight.position.x = 0.12 - pose.grip * 0.025;
      part.position.y = pose.partY;
      for(const joint of [shoulder,elbow]) joint.children[1].position.z=explode*0.42;
    } else {
      layers[topic].forEach((layer,i)=>{
        layer.position.copy(basePositions.get(layer));
        if(topic==='products') layer.position.x+=explode*(i-1)*0.42+(replayTime>=0?Math.sin(Math.PI*clamp((cycle-i*0.4)/1.2))*0.18:0);
        else layer.position.y+=explode*(topic==='software' ? (i===0 ? 0.95 : 0.4) : i*0.72)+(topic==='research'&&replayTime>=0?Math.sin(Math.PI*clamp((cycle-i*0.65)/1.5))*0.2:0);
      });
      if(topic==='software') { signalMaterial.emissiveIntensity = replayTime >= 0 ? 0.5 + Math.sin(cycle * 5) ** 2 : 0.4; lid.rotation.x = -0.16 - explode * 0.2; }
    }
    stage.rotation.x = 0;
    const push = journey ? path.inspection : 0;
    cameraPosition.set(2.6 - push * 1.5 + currentX * 0.15,
      3.0 + (journey ? Math.sin(path.flight * Math.PI) * 2.5 : 0) + currentY * 0.12,
      7.5 - distance * 16 - push * 1.25);
    lookAt.set(0, 1.0 + explode * 0.25, -distance * 16);
    key.position.set(-3, 7, 3 - distance * 16);
    key.target.position.set(0, 0, -distance * 16);
    key.target.updateMatrixWorld();
    camera.position.copy(cameraPosition);
    camera.lookAt(lookAt);
    const before = performance.now();
    renderer.render(scene, camera);
    const duration = performance.now() - before;
    frames++;
    mount.dataset.frames = String(frames);
    mount.dataset.topic = topic;
    mount.dataset.progress = currentProgress.toFixed(3);
    mount.dataset.inspected = String(inspected);
    mount.dataset.replay = String(replayTime >= 0);
    mount.dataset.drawCalls = String(renderer.info.render.calls);
    mount.dataset.triangles = String(renderer.info.render.triangles);
    if (frames > 20 && duration > 45) slowFrames++;
    else slowFrames = Math.max(0, slowFrames - 1);
    if (slowFrames > 20) {
      onFailure();
      return;
    }
    if (
      replayTime >= 0 || transition < 1 || Math.abs(explode - inspection) > 0.001 ||
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
    camera.zoom = Math.min(1, camera.aspect / 1.05) * (compact ? 0.88 : 1);
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
    setProgress(value) {
      journey = true;
      progress = Math.max(0, Math.min(1, value));
      requestRender();
    },
    setTopic(value) {
      if (!stations[value]) return;
      journey = false;
      if (topic === value) { requestRender(); return; }
      topic = value; transition = 0; replayTime = 0;
      for(const [name, group] of Object.entries(stations)) group.visible = name === topic;
      requestRender();
    },
    setInspected(value) { inspected = value; requestRender(); },
    replay() {
      if (!paused) {
        replayTime = 0;
        lastTime = 0;
        requestRender();
      }
    },
    cancelReplay() {
      replayTime = -1;
      part.position.y = 0.38;
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

// Two-link inverse kinematics keeps the gripper aligned with the lifted part.
export function robotPose(time) {
  const ease = value => { const t = Math.max(0, Math.min(1, value)); return t * t * (3 - 2 * t); };
  const cycle = Math.max(0, time);
  const down = time >= 0 ? ease(cycle / 0.9) : 0;
  const lift = time >= 0 ? ease((cycle - 1.25) / 0.8) * (1 - ease((cycle - 3.1) / 0.8)) * 0.55 : 0;
  const home = ease((cycle - 4.35) / 0.8);
  const y = (1.45 + (0.78 - 1.45) * down + lift) * (1 - home) + 1.45 * home;
  const rx = -0.4 - 1.18, ry = y - 0.68;
  const elbow = Math.acos(Math.max(-1, Math.min(1, (rx * rx + ry * ry - 1.45 ** 2 - 1.2 ** 2) / (2 * 1.45 * 1.2))));
  const shoulder = Math.atan2(ry, rx) - Math.atan2(1.2 * Math.sin(elbow), 1.45 + 1.2 * Math.cos(elbow)) - Math.PI / 2;
  return { shoulder, elbow, wrist: Math.PI - shoulder - elbow, partY: 0.38 + lift,
    grip: time >= 0 ? ease((cycle - 0.9) / 0.35) * (1 - ease((cycle - 3.9) / 0.45)) : 0 };
}

// Four pauses for inspecting the work, connected by continuous forward camera travel.
export function journeyPose(progress) {
  const position = Math.max(0, Math.min(1, progress)) * 4;
  const chapter = Math.min(3, Math.floor(position));
  const local = position - chapter;
  const t = chapter === 3 ? 0 : Math.max(0, (local - 0.55) / 0.45);
  const flight = t * t * (3 - 2 * t);
  return { chapter, local, flight, distance: chapter + flight,
    inspection: Math.sin(Math.min(1, local / 0.55) * Math.PI) * 0.8 };
}
