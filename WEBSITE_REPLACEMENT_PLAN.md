# Nima Jafari — interactive portfolio replacement plan

Prepared October 5, 2026. Status: approved; implementation in progress on `feat/interactive-portfolio`.

## Implementation status

Baseline: `494e5606a6287fd1a65532eb2c773f163ec3f189`. Original files and baseline screenshots are preserved outside the deployed tree. No production settings have changed.

| Stage | Status | Evidence / remaining work |
| --- | --- | --- |
| 1. Preserve baseline | Complete | Starting commit recorded; original files saved in `/tmp/nima-portfolio-original`; existing five-size screenshots retained. |
| 2. Confirm content | Complete | Existing roles, dates and scoped research metrics retained; rendering check verifies every project repository and publication link. Availability wording kept conservative. |
| 3. Static build | Complete | Vite production build passes; essential content is present without JavaScript. |
| 4. Visual foundation | Verified in Chromium | Desktop 1920, laptop 1366, tablet 768, phone 390 and 412 px screenshots inspected; tablet copy/scene overlap corrected. |
| 5. Media | Integrated | Four new Higgsfield Nano Banana Pro 2K images: software, robotics, ML hardware, AI product. User-authorized budget: 8 credits; 4 × 2 used, balance 0. Responsive 800/1400px WebPs: about 16–52 KB each. Prompts/job IDs recorded in `scripts/editorial-assets.json`; originals in Downloads. |
| 6. Scene | Photographic + live modes implemented | Cinematic view uses generated concept imagery; Enter 3D explicitly loads custom geometry. Detailed laptop, machined assemblies, HDR studio reflections, grain, shadows and drag rotation. No Spline dependency/branding. Generated images are clearly labeled and are not project screenshots. |
| 7. Scene integration | Verified in Chromium | Topic switches, inspection, replay, pause, idle/offscreen suspension, failed-load fallback and reduced-motion teardown pass. |
| 8. Motion | Implemented | Bounded scroll/pointer movement; physical robot pickup uses tested inverse kinematics. No continuous idle render loop. |
| 9. Mobile | Emulation verified | Poster first, touch-accessible opt-in, all four live scenes checked at phone size; 320px and landscape layouts have no horizontal overflow. Physical devices pending. |
| 10. Accessibility / SEO | Partially verified | No-JS content, resume destinations, reduced motion, semantic headings and fallback verified. Comprehensive assistive-technology audit remains pending. |
| 11. QA / performance | Local checks pass | Three node tests and production build pass. About 2.8 KB gzip initial JS, 150 KB deferred scene, 44.5 KB deferred motion; 1.62 MB HDR lighting loads only on explicit 3D entry. Local interaction/layout checks pass; earlier timing numbers are historical, not a current production/mobile-network benchmark. |
| 12. Deployment | Not performed | Live Pages settings and production site remain unchanged. Cross-browser/device checks and deployment verification remain outstanding. |

Progress notes are updated with each implementation milestone; statuses describe verified work, not intended work.

## 1. The direction

Build **Engineering Workbench**: a cinematic, tactile, interactive exhibit of Nima's work in robotics, machine learning, research, and AI product engineering. Four inspectable stations span software, AI products, machine learning, and robotics; software is the arrival scene. Visitors can inspect it, replay a short assembly animation, and follow its controls into real projects and publications.

The experience should feel like entering an engineer's carefully curated studio. Deep blue, warm ivory, brushed brass, deliberate typography, and believable lighting connect it to the existing painterly identity. The surrounding portfolio stays quiet, legible, and specific to Nima.

The first release is one complete portfolio with one shared 3D scene. It includes selected work, research, employment, education, honors, a personal introduction, resume access, and contact. It does not require an account, a backend, or a new hosting provider.

### What visitors should understand

| Time | Visitor takeaway | How the design delivers it |
| --- | --- | --- |
| First 3 seconds | This is Nima Jafari, a software engineer working in ML, robotics, and AI systems. | Name, direct role statement, real portrait, Resume and Selected work links; text appears before 3D loads. |
| First 15 seconds | He has concrete research and product experience, including robotics simulation and a founding engineering role. | A compact work introduction, three strong project previews, and visible research/experience navigation. |
| First minute | I understand his contribution, technical depth, employment history, and how to contact him. | Readable project stories, publication links, experience timeline, downloadable resume, and direct email. |

Suggested hero copy, subject to editorial review:

> Nima Jafari
>
> I build intelligent systems that move from research into useful software.
>
> Software engineering, machine learning, and robotics simulation. Based in Austin, Texas.

Use the existing availability statement only after confirming that it remains current. Avoid invented client logos, employer affiliations, testimonials, and outcome metrics.

## 2. Existing site and preservation decisions

The repository is a plain HTML/CSS/JavaScript portfolio. There is no React, Next.js, Astro, TypeScript, Tailwind, package manifest, or animation dependency. `content.js` supplies `window.PORTFOLIO`; `main.js` renders content and manages interactions; `styles.css` holds custom styling. The current fonts are Trebuchet MS and Arial. GitHub Pages currently serves `main` at the repository root using its legacy branch deployment.

The site has nine horizontally arranged panels: Home, About, Work, Projects, Skills, Resume, Honors, Links, and Machines. It has a distinctive blue/gold art influence, a real headshot, useful professional detail, optional jazz, and existing paper/repository links. Its Canvas effects are not a real-time 3D portfolio.

The earlier visual audit found that the laptop composition pushes key introduction content below the first screen, and the mobile header partially clips Resume. The main technical weaknesses are a large interaction script, runtime-only content rendering, nested scrolling, third-party music startup behavior, and uneven reduced-motion coverage. Those findings are a baseline, not measured Core Web Vitals scores.

| Preserve | Replace or simplify |
| --- | --- |
| Nima's identity, real portrait, verified experience and links | Horizontal panel navigation and nested scrolling |
| Blue/gold palette and restrained painterly character | Heavy displacement/glow filters and unrelated decorative effects |
| GitHub Pages and static delivery | Browser-only rendering of essential content |
| Existing resume URL, publication URLs, project repositories | Giant lists before the visitor understands the strongest work |
| Personal interests and optional music as personality | Autoplay attempts and music initialization before explicit play |
| `content.js` as the editorial source | Monolithic rendering and effect logic, split only along real responsibilities |

Keep the current resume at `assets/resume_sweV2.pdf` unless an updated, approved PDF replaces it. Do not delete `Resume_NEW.pdf` or other assets without checking their references. The general technology-history Machines section leaves the main navigation; its content can remain in the repository without occupying the professional journey.

## 3. Three creative directions considered

| Direction | Composition and interaction | 3D rationale | Cost / difficulty | Main risk |
| --- | --- | --- | --- | --- |
| **Robotics Workbench — recommended** | Asymmetric studio composition, tactile materials, bounded camera movement, project-linked controls | An articulated mechanism and assembly action express Nima's robotics and systems work | Medium / medium-high | A stock robot or overly elaborate simulation could overshadow the portfolio. |
| **Research Atlas** | Spacious technical diagrams, research evidence, explorable graphs, typographic transitions | Optional spatial wiring-diagram exploration; mostly SVG/HTML | Low-medium / medium | Dense notation can make the site feel academic before visitors understand the work. |
| **Cinematic Field Journal** | Large project imagery, film-like chapter cuts, personal portraits, editorial narratives | Mainly pre-rendered media rather than real-time rendering | Medium / medium | Atmospheric footage can feel impressive but disconnected from engineering evidence. |

Workbench best fits the request for a memorable 3D experience and the actual content. Borrow Atlas's clear evidence presentation and Journal's restrained pacing, while keeping Workbench's own composition.

## 4. Page structure and content hierarchy

Use a vertically scrolling homepage with anchors: `#home`, `#projects`, `#research`, `#experience`, `#about`, `#resume`, and `#contact`. Preserve useful old hashes through small aliases where possible, including `#work`, `#cv`, and `#honors`.

Desktop navigation: Nima Jafari, Work, Research, Experience, Contact, and a clearly visible Resume link. About and additional work remain reachable in the page. Mobile uses the brand, Resume, and a compact accessible menu; the menu must not cover the resume action.

### Homepage sequence

1. **Introduction and workbench.** Text on the left, scene on the right. Name, role, location, Selected work and Resume actions. A restrained real portrait supports recognition. The scene receives the visual emphasis without hiding the introduction.
2. **Workbench exploration.** Three HTML controls—Robotics, AI products, Research—highlight related scene objects and navigate to the corresponding work. An optional Replay assembly control runs a short authored movement.
3. **Selected work.** Three expanded stories, followed by a quieter additional-project list. Proposed leads: robotics simulation study, Strategy Mining/Hasse clustering, and CareerLift. CycleKindAI and AgenticAI provide additional evidence of AI product engineering. Final ordering depends on available screenshots and publishable evidence.
4. **Research.** Two arXiv preprints and two Zenodo supplements with accurate publication-type labels, contribution summaries, and paper/data links. Use a real explanatory diagram where available.
5. **Experience.** Machine Learning Engineer appointment, Driftless founding role, SideShift contract, and MISAN robotics work. Preserve dates and distinguish part-time, contract, and founding roles. Explain grant support without implying direct employment by a funding agency.
6. **About, education, honors.** A real portrait, brief personal introduction, CSUN degree and GPA, selected verified honors, leadership, and interests. Present skill groups beside the work that demonstrates them rather than as a wall of badges.
7. **Resume and contact.** An HTML summary, Open PDF and Download PDF links, professional links, and a working `mailto:` action. PDF embedding is optional and loaded only on request.

Every project story follows the same useful structure: problem, Nima's contribution, technical approach, evidence/result with scope, and code/paper/demo links. Use real screenshots, diagrams, or openly shareable artifacts. Represent confidential work with an approved description rather than fabricated screenshots.

The robotics figures in current content—29/30 nominal trials and 60/60 safe stops in observation-fault trials—must retain their frozen-study scope. The 125 successful RL episodes and recovered strategies are separate research evidence. Do not merge them into a general success-rate claim.

For launch, project details can expand inline with native `<details>` elements and stable project IDs. This keeps direct links, keyboard access, and ordinary scrolling functional without introducing a router or modal system. Standalone case-study pages are optional when enough material exists to justify them.

## 5. Visual system

| Token | Starting value | Use |
| --- | --- | --- |
| Midnight | `#091321` | Main page and scene background |
| Workbench blue | `#142B43` | Surfaces and structural depth |
| Ultramarine | `#3157A5` | Selected states and subtle accent surfaces |
| Warm ivory | `#F4F1E8` | Primary text and ceramic scene material |
| Brass | `#C4A66B` | Accent text, active indicators, key details |
| Slate | `#ADBCCD` | Secondary readable text |

These are starting tokens; verify every actual text/background pairing rather than assuming the palette is accessible. Use brass for small, purposeful emphasis. Texture belongs primarily on the workbench materials, with a very faint static background texture if needed.

Use **Space Grotesk** for display headings and **IBM Plex Sans** for body text; use the system monospace for metadata. Self-host only the required WOFF2 subsets and weights, preserve license files, and use `font-display: swap`. Font sources: [Space Grotesk](https://github.com/floriankarsten/space-grotesk), [IBM Plex](https://github.com/IBM/plex).

Starting type sizes: hero 64–88px on wide desktop and 36–48px on mobile; section headings 32–48px; body 17–18px with approximately 1.55 line height. Limit prose to about 65 characters per line. Use a 1200–1320px content width, 24–48px desktop gutters, and 20px mobile gutters. Adjust using actual copy and screenshots.

Use ordinary links, concise buttons, small border radii, fine dividers, and deliberate spacing. Keep the native cursor. Do not add global magnetic buttons, luminous gradients, glass panels, floating decorative objects, or animation to every element. Launch with one coherent color theme; additional themes would multiply lighting and contrast QA.

## 6. The 3D scene and interaction contract

### Scene graph

```text
WorkbenchRoot
├── Backdrop: curved midnight-blue surface
├── Bench: one platform with baked contact shadows
├── RobotAssembly
│   ├── Base
│   ├── Shoulder
│   ├── Elbow
│   ├── Wrist
│   └── Gripper
├── AssemblyTarget: small geometric component and fixture
├── ProductArtifact: understated physical representation of a product system
├── ResearchArtifact: compact wiring-diagram sculpture
└── CameraRig: arrival, inspection, and settled composition states
```

The hero robot is an illustrative mechanism, not a claim that this exact machine was built or used in Nima's research. Any replay is clearly described as an illustration. Do not run Isaac Sim, a physics engine, ML inference, or a live robot controller in the portfolio.

### Camera and lighting

Start with a perspective camera around a 35–45-degree field of view, a three-quarter view, and the complete assembly visible. Use a warm key light, low-intensity cool fill, and baked ambient/contact shading. Prefer material quality and composition over postprocessing. Lock free orbit, pan, and zoom by default so visitors cannot lose the intended view.

Design three named compositions: arrival overview; closer assembly inspection; settled work preview. Scroll advances the scene through these compositions only within the opening exhibit. Allow at most one additional viewport of pinned scroll on suitable desktop screens. On short laptop screens, use the unpinned composition to keep useful text visible.

### Controls

| Input | Response | Bounds |
| --- | --- | --- |
| Fine-pointer movement over scene | Slight perspective response | Approximately ±4 degrees yaw and ±2 degrees pitch; returns to rest on pointer exit |
| Robotics / AI products / Research control | Highlights the related artifact; Explore link goes to actual content | All controls are HTML buttons/links with visible labels and keyboard equivalents |
| Replay assembly | Gripper approaches, pauses, places a component, and settles | One approximately 2.4-second authored sequence per activation; replay never changes page position |
| Scroll through opening exhibit | Camera follows the three authored compositions | No page-wide camera flight or forced scrolling |
| Escape or Pause animation | Stops an active replay | Content and links remain usable |

Controls must remain useful while the scene loads or fails. With a static fallback, project controls navigate directly to their content; scene-specific replay controls are omitted. Do not leave disabled decorative controls that imply something is broken.

### Spline-first implementation, with a defined gate

Author the prototype in the official Spline desktop app through its MCP. Use a code export and `@splinetool/runtime` on a dedicated canvas, rather than an opaque iframe. Spline's vanilla Code API supports scene variables, object-property changes, transitions, and events; React is not required. [Spline Code API](https://docs.spline.design/exporting-your-scene/web/code-api-for-web).

Define an explicit scene contract: stable object names, an active-topic value, replay state, pointer offsets, and chapter progress. Confirm how each variable drives the exported scene; continuous camera control is a prototype requirement, not an assumed export capability. Keep DOM controls and all professional content outside the scene.

Use the export's Auto renderer where reliable, with WebGL fallback. Do not make WebGPU mandatory. Confirm touch page scrolling, export rights, watermark removal, and the required Spline plan before treating the prototype as the production asset. These settings and subscription limits are documented by [Spline](https://docs.spline.design/exporting-your-scene/play-settings).

**Production gate:** exported camera/interaction behavior, pause/resume, mobile input, visual fidelity, size, and browser performance must pass the budgets below. Measure the export, not just the editor preview. Follow the vendor's [scene optimization guidance](https://docs.spline.design/exporting-your-scene/how-to-optimize-your-scene).

If the gate fails after proportionate scene simplification, use **direct Three.js with the existing vanilla architecture**, recreating the simple mechanism from primitives or an optimized authored model. Do not assume a lossless Spline-to-Three.js conversion. Ship one renderer. No React migration or second active 3D engine is justified. A still-image fallback remains necessary with either renderer.

## 7. Higgsfield asset strategy

Higgsfield is installed and authenticated through the official MCP and CLI. One Nano Banana Pro concept image has already been generated and visually inspected. It cost 2 credits; the last verified balance was 8 credits. That balance is a snapshot, not a future spending allowance.

Existing concept: [Robotics Workbench PNG](/Users/nimajafari/Downloads/nima-portfolio-concepts/higgsfield-robotics-workbench-d8dd8f5e.png). The original is 2752 × 1536 and approximately 6.26 MB; it is a design reference, not a web-ready asset. Its prompt is saved beside it as a text file. Keep working originals outside the deployed asset folder.

Use the image to establish material, lighting, and composition. Rebuild the mechanism as real geometry for pointer response and replay. For the final fallback, capture the actual authored scene so the poster-to-canvas transition matches; the generated image can serve as the early design-stage poster.

Potential additional Higgsfield use is one short, silent atmospheric loop for a noninteractive project transition. It is optional and must justify its download cost. Do not use generated media as evidence of Nima's actual research, a fictional product screenshot, or a substitute for the real portrait.

For each generation: specify the asset and model, obtain a cost estimate, check the current balance, keep within an explicitly agreed credit budget, generate once, inspect the result, and record its prompt/model/job ID. Do not purchase credits or upgrade subscriptions as part of implementation. Automated Higgsfield generations deduct credits even when a web plan offers Unlimited access. [Higgsfield credit behavior](https://higgsfield.ai/creator-hub/help-center/integrations/what-is-higgsfield-mcp).

**Rendering tradeoff:** use real-time 3D where visitor input changes the mechanism or viewpoint. Use a compressed still for reduced motion and low-power fallback. Use video only where a fixed camera shot delivers the intended moment. Do not download both a hero video and a full hero scene by default.

## 8. Motion system

Use one motion vocabulary: calm acceleration, controlled arrival, and a stable resting state. DOM controls use CSS; coordinated scene/scroll sequences use GSAP and ScrollTrigger. Do not add Motion or Lenis alongside them.

| Element or event | Rule |
| --- | --- |
| Page entry | Text is visible immediately; a restrained 350–500ms opacity/position enhancement may follow. No splash screen or loader that blocks content. |
| Typography | Animate a heading as one unit, at most 12px travel. No character scrambling, typewriter, or per-letter stagger. |
| Navigation | 150–180ms color/underline change; focus is immediate and visible. Anchor navigation remains native. |
| Buttons and links | 120–180ms feedback; small icon movement or color change, with no magnetic tracking. |
| Project previews | At most 3px elevation or 1.02 image scale over 180–220ms, only for hover-capable pointers. |
| Project details | Native disclosure; retain focus and expose expanded state. Optional brief opacity transition, never a camera flight. |
| Section entry | Selective 300–450ms grouped reveal, no more than 12px travel; reveal once. Essential copy does not start hidden without JS. |
| Scroll camera | Map bounded exhibit progress to named scene compositions; use linear interpolation and approximately 0.25–0.4 seconds of smoothing. |
| Parallax | Only the scene's subtle pointer response. No global text/image parallax layers. |
| Assembly replay | Approximately 2.4 seconds, controlled ease-in-out, no idle looping. |
| Loading | Reserved poster area and a quiet status message after a short delay; no fake progress percentage. |
| Scene readiness | 200–300ms poster crossfade only after a successful rendered frame. |
| Section transition | Normal document flow, spacing, and tonal surface changes; no compulsory wipes or blackout. |

Shared easing: `cubic-bezier(0.22, 1, 0.36, 1)` for arrivals and `cubic-bezier(0.4, 0, 0.2, 1)` for reversible controls. Cap intentional DOM staggering at 60ms and only within a small related group. Scroll-driven progress uses linear mapping rather than replaying a new easing curve every frame.

Use media-query-aware setup and teardown, including changes while the page is open; [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/) provides grouped animation cleanup. One owner controls the camera; the pointer response adds a bounded offset rather than fighting the scroll timeline.

## 9. Desktop, mobile, and fallback behavior

| Mode | Layout | 3D / motion | Input |
| --- | --- | --- | --- |
| Wide desktop, ≥1200px | Text/scene split; expansive project composition | Full authored scene after first paint; bounded opening camera sequence | Pointer response, labeled controls, keyboard |
| Laptop/tablet, 768–1199px | Compact split or stacked layout based on height | Reduced scene area; no pinning on short viewports | Touch and keyboard work equally; hover is optional |
| Phone, <768px | Introduction and actions first, scene poster below; one-column project stories | Static scene poster by default; optional Load interactive scene button for a simplified variant | Native scrolling and tap controls; no gesture capture |
| Reduced motion | Same complete layout | Static poster; no autoplay replay, camera travel, parallax, or animated smooth scrolling | Ordinary links and controls |
| Save-data, failed renderer, or sustained low frame rate | Same content | Poster fallback; no repeated initialization attempts | Normal navigation remains available |

Do not rely on unavailable or inconsistent battery/device APIs. Use reduced-motion and save-data preferences where exposed, explicit opt-in on phones, and measured frame-time degradation. A compact screen alone is not proof of a weak GPU.

After mobile opt-in, target DPR 1–1.25, fewer objects, simpler lighting, and no postprocessing. Preserve vertical touch scrolling over the canvas and browser pinch zoom. Stop rendering when the scene is offscreen, the tab is hidden, or the user selects Pause; release resources on teardown. If the Spline export cannot reliably do this, it fails the production gate.

Reserve image/canvas aspect ratios, account for safe-area insets, use `svh` appropriately, and test landscape. Use at least 44px touch controls. The mobile poster needs its own crop and visible composition; shrinking the wide hero is insufficient.

## 10. Accessibility, content integrity, and SEO

Target WCAG 2.2 AA for the complete document. Provide a skip link, one H1, ordered heading levels, landmark navigation, real links, descriptive button names, and visible focus. Aim for at least 4.5:1 normal-text contrast and 3:1 large-text and control-boundary contrast. Never encode selected state only through color.

Keep all information in HTML. Treat the canvas as decorative when its meaning is fully duplicated by the accompanying text and controls. Provide informative alt text for real screenshots and the portrait; decorative textures use empty alt text. A generated robotics concept must be described as an illustration when presented as content.

Respect `prefers-reduced-motion` before scene loading and when it changes. The pause mechanism must stop visual motion, not only mute sound. Avoid blinking, flashes, focus traps, hidden keyboard targets, and keyboard shortcuts that override browser or form behavior. Native anchor targets account for the sticky header.

Music remains off by default. If retained, initialize the existing third-party player only after explicit Play; offer clear pause/mute controls and avoid loading it during the initial page visit. Keep it outside the primary professional navigation.

Build the essential content into delivered HTML: headings, project summaries, experience, research, resume and contact links must survive JavaScript failure. Add accurate title/description, canonical URL, Open Graph/Twitter image, favicon, and conservative Person structured data containing only verified public facts. Add a sitemap for actual indexable pages and keep published project links stable. The social preview image is a separate export with readable name and role, not the raw 3D render.

Preserve external publication/repository links and check for broken destinations. Escape content when rendering HTML and validate link protocols. Higgsfield credentials, OAuth tokens, and MCP configuration never enter source code, build artifacts, scene exports, or browser bundles.

## 11. Performance budget and decision gates

Budgets below are design targets, not claims about the unbuilt site. Measure compressed transferred bytes separately from decoded/GPU memory. Prefer simplification before compression tooling or additional packages.

| Item | Target | Gate or ceiling |
| --- | --- | --- |
| Initial application JavaScript | ≤80 KB compressed | ≤100 KB; no 3D runtime in the critical bundle |
| Initial HTML + CSS + JS + fonts + visible images | ≤450 KB compressed | ≤600 KB before deferred scene requests |
| Deferred 3D runtime including required workers/WASM | ≤1 MB compressed | ≤1.5 MB; measure the complete dependency payload |
| Scene/model payload, excluding runtime | ≤1.5 MB | ≤3 MB desktop; ≤1 MB opt-in mobile scene |
| GLB/GLTF if the Three.js fallback is used | ≤750 KB | ≤1.5 MB; evaluate Meshopt/Draco only when geometry warrants decoder cost |
| Texture dimensions | 512–1024px for most maps | One 2048px map at most; inspect decoded memory |
| Total texture downloads | ≤750 KB desktop | ≤300 KB mobile; KTX2/Basis only on a supported pipeline with a measured benefit |
| Geometry | ≤70,000 visible triangles desktop | ≤25,000 mobile; simplify curved surfaces first |
| Draw calls | ≤35 desktop | ≤20 mobile; profile actual renderer output |
| GPU resource memory | ≤128 MiB desktop | ≤64 MiB mobile target; account for render targets and texture mipmaps |
| Device pixel ratio | 1–1.5 desktop | 1–1.25 mobile; do not automatically use native DPR 3 |
| Shaders/postprocessing | Basic lit materials; no postprocessing | No ray marching, multipass blur, SSAO, or depth-of-field at launch |
| Hero poster | ≤120 KB desktop | ≤80 KB phone; responsive AVIF/WebP with practical fallback |
| Other project images | ≤150 KB each | Appropriate `srcset`, dimensions, and lazy loading below the fold |
| Fonts, total | ≤100 KB WOFF2 | ≤120 KB; reduce subsets/weights if needed |
| Optional video | 4–6 seconds, ≤2 MB desktop | ≤1 MB mobile if used; silent MP4/WebM, poster first, no initial preload |
| Core Web Vitals | LCP ≤2.5s; INP ≤200ms; CLS ≤0.1 | Evaluate under stated test conditions and later field data when available |
| Scene frame time | Aim for 60fps desktop and ≥30fps mobile | Degrade quality or fall back after sustained frame-time failure |

Core Web Vitals targets follow [Google's guidance](https://web.dev/articles/vitals). Lab traces cannot establish a real-user percentile or guarantee performance on every device.

Load order: semantic HTML and critical CSS → appropriately sized poster and fonts → lightweight controls → dynamic scene import on eligible devices → scene asset → first frame → poster transition. Defer optional project media, PDF previews, and audio independently. Never hide the page behind scene readiness.

Use one canvas, stop invisible rendering, reserve layout dimensions, and avoid per-frame layout reads or DOM rebuilding. Do not retry failed scene loading indefinitely. A temporary GPU failure should produce a stable poster rather than an error page.

## 12. Exact stack and tool decisions

Preserve vanilla HTML, CSS, and JavaScript. Add Vite as a build tool after approval because pinned runtime dependencies, dynamic imports, asset hashing, and a reproducible static build now have concrete value. This is not a framework migration.

| Technology | Classification | Purpose and decision | Alternative |
| --- | --- | --- | --- |
| Semantic HTML + custom CSS + vanilla JS modules | Core | Content, design tokens, interaction; fits the existing architecture | Framework only if future requirements justify it |
| Vite | Core build tool | Local development, dependency bundling, hashed assets and splitting | A hand-managed vendor bundle would add maintenance |
| CSS transitions/animations | Core | Buttons, navigation, selective DOM motion | Web Animations API for a narrowly justified sequence |
| GSAP + ScrollTrigger | Core for full desktop exhibit | One coordinated scene/scroll timeline | Native scroll plus discrete scene states if continuous movement is removed |
| Spline desktop + runtime | Experimental until prototype gate, then core if passed | Author and ship the signature scene | Direct Three.js |
| Three.js | Conditional fallback | Greater rendering and lifecycle control if Spline fails the gate | Do not ship alongside Spline |
| WebGL | Required compatibility path for 3D | Public-browser rendering support | Static poster when unavailable |
| WebGPU | Optional enhancement | Use through a proven renderer with fallback | Never a requirement to read the portfolio |
| GLSL/custom shaders | Rejected for launch | Standard materials cover the design | One later material experiment only with a narrative purpose |
| Postprocessing | Rejected for launch | Lighting and composition should carry the scene | Baked shading |
| React Three Fiber / Drei | Rejected for this architecture | Adding React just to wrap one scene is unnecessary | Spline vanilla runtime or Three.js |
| Motion / Framer Motion | Rejected | Would duplicate the selected motion stack | CSS and GSAP |
| Lenis | Rejected | Native scroll works and avoids touch/scroll ownership issues | Browser scrolling |
| View Transitions API | Optional later | A future multi-page case-study transition | Normal link navigation; no need for launch anchors |
| Theatre.js | Rejected | Three named compositions do not need a separate timeline editor | Spline states / GSAP |
| Figma | Optional authoring | Desktop/mobile compositions and design review | Direct layout prototype and screenshots |
| Figma Make | Rejected as site generator | A generated application would duplicate this repo | Figma for visual exploration only |
| 21st.dev | Reference only | Inspect interaction principles, not import a template aesthetic | Custom small components |
| shadcn/ui | Rejected | React components do not fit this vanilla site | Native controls |
| Tailwind CSS | Rejected for this replacement | Existing custom CSS and a small token system suffice | Maintain one CSS architecture |
| Blender | Optional | Model optimization, UVs, or baking if primitive authoring is insufficient | Spline primitives |
| Higgsfield | Core creative workflow, not a runtime dependency | Concept generation and selected supporting media | Actual scene captures for matching fallback assets |
| Other AI image/video services | Rejected for launch | Already have the selected provider; no need to multiply accounts | Reconsider only for a specific unsupported asset |
| Existing static content data | Core | Single editorial source, rendered at build time | Hand-authored HTML if duplication can be avoided |
| MDX / headless CMS | Rejected for launch | Current update volume does not justify a content platform | Git-based editing |
| AI-assisted content workflow | Optional, human-reviewed | Suggest concise descriptions from verified source material | No auto-published biographies or research claims |
| Codex | Core development tool | Repo work, scene/tool orchestration, QA | Existing editor workflow |
| Claude Code / Cursor | Optional substitutes | Equivalent development workflows, not additional production requirements | Use one primary agent/editor |
| GitHub integration + Pages | Core | Source history, review and static deployment | No hosting migration needed |
| Chrome DevTools MCP | Core QA tool | Screenshots, console/network inspection, performance traces | Actual Safari and physical-device checks remain necessary |

Pin tested versions in the lockfile during implementation; do not invent future versions or use floating CDN `latest` imports. There is currently no lint configuration: offer a small setup when implementation starts, without adding a broad tooling suite during planning.

### MCP versus project dependency

| Integration | Current status | Authorized role and access boundary |
| --- | --- | --- |
| Official Spline MCP | Desktop app installed, server registered; prior startup succeeded but no scene tools were exposed before sign-in | Sign in/open editor and verify tool listing; create/edit only the portfolio scene; no paid AI generation without an agreed budget |
| Official Figma MCP | Registered and authenticated | Work within a dedicated portfolio design file; no unrelated workspace changes |
| Official Higgsfield MCP + CLI | Installed/authenticated; actual concept generation succeeded | Check balance/cost, generate agreed assets, retrieve results; no billing upgrades, account changes, or unrelated uploads |
| GitHub | Existing authenticated access verified | Read repo and Pages settings; scoped commits/PRs for this site; existing access is broader than this task requires |
| Official Chrome DevTools MCP | Installed; successfully opened the portfolio in a smoke test | Isolated browser profile, telemetry/CrUX disabled; no personal signed-in browser profile |

Restart the agent client when new MCP servers need to load. Prefer these official integrations and their normal OAuth flows; do not add community proxies. Runtime libraries—Spline runtime, GSAP, or the conditional Three.js fallback—are normal project dependencies, not MCP servers. Keep MCPs in the development environment, never in the deployed portfolio. The [official Spline MCP documentation](https://docs.spline.design/generate/spline-mcp-server) describes its desktop requirement and client setup.

## 13. File structure and data flow

Keep the root files recognizable and add only the modules with a concrete responsibility:

```text
index.html                    semantic shell, navigation, document metadata
content.js                    exported editorial data, replacing window.PORTFOLIO
main.js                       lightweight controls and enhancement startup
styles.css                    tokens, layout, responsive styles, reduced motion
scene.js                      lazy scene loading, controls, lifecycle, fallback
motion.js                     shared GSAP timeline and breakpoint teardown
scripts/render-content.mjs    build-time semantic markup from content data
vite.config.js                build settings and HTML content transform
package.json / package-lock.json
public/assets/                preserved PDFs, optimized media, fonts, scene export
.github/workflows/            build checks and Pages deployment
```

The build-time HTML transform reads the exported content and inserts rendered markup into the shell without rewriting tracked source files. Use the same renderer in development and production. No browser hydration framework is necessary: JavaScript enhances already usable HTML.

Flow: approved content data → escaped semantic markup → Vite static output → GitHub Pages. Separately, viewport/preferences/input → lightweight controls → lazy scene controller → one renderer. GSAP may update scene progress; it does not own professional content or navigation.

Move existing deployed assets into the static public directory only when the build step is ready; retain their public `/assets/...` paths. Do not deploy authoring originals, the giant source concept PNG, or unreferenced media.

## 14. Incremental implementation sequence

All stages happen on an implementation branch after this direction is approved. The live site remains on its current deployment until the reviewed replacement is ready. Each stage ends with a functional preview; no giant rewrite commit.

| Stage | Work and affected files | Completion evidence |
| --- | --- | --- |
| 1. Preserve baseline | Record starting commit, screenshots, link inventory, Pages settings, and baseline network/trace; no feature edits | Existing site reproducible; rollback commit identified |
| 2. Confirm content | Curate `content.js`, reconcile resume and date/role wording, select publishable project evidence | No invented claims; all current professional destinations retained |
| 3. Establish static build | Add Vite/lockfile, semantic content renderer, build scripts; preserve asset URLs | Production build includes readable content and working resume/contact with JS disabled |
| 4. Build visual foundation | Replace horizontal shell in `index.html`, implement tokens/layout in `styles.css`, simplify `main.js` controls | Complete static desktop and mobile portfolio works before 3D |
| 5. Prepare media | Optimize existing Higgsfield concept for prototype; collect real project screenshots; self-host font subsets | Initial transfer budget and licensing inventory pass |
| 6. Prototype scene independently | Author one workbench through Spline MCP; prove named states, camera progress, replay and lifecycle | Export behaves correctly; budgets and watermark/license conditions measured; choose Spline or Three.js |
| 7. Integrate scene | Add `scene.js`, HTML controls, poster fallback state and lazy import; use a matching scene-capture poster | Loading failure, unsupported renderer and hidden-tab cases preserve the page |
| 8. Add motion | Add `motion.js` and the single coordinated exhibit timeline | No competing camera owners; normal scroll and anchor navigation work |
| 9. Design mobile variant | Optimize phone crop, scene opt-in and simplified scene if justified | Both phone sizes are attractive with no canvas loaded; touch scrolling never trapped |
| 10. Accessibility and SEO | Keyboard/reduced-motion/focus/contrast review; metadata and no-JS checks | Complete content and navigation without animation or renderer |
| 11. Performance and browser QA | Inspect production build, traces, five viewport classes, Safari/Firefox, slow network and failure modes | Budgets met or documented scope reduction applied; screenshots visually reviewed |
| 12. Deploy and verify | Add reviewed Pages workflow, switch source at cutover, deploy built `dist`, check live assets/anchors | Live visual smoke test passes; previous deployment can be restored |

Stage 7 uses a **poster** fallback; no loading text, controls, or scene layout should depend on the renderer being ready.

Approval of the implementation direction covers ordinary code and asset integration in these stages. Further paid media or subscription purchases need a concrete asset/cost decision. Do not deploy a partially verified replacement merely because the scene is visually impressive.

## 15. Validation and visual QA

Current baseline commands are `node --check main.js` and `node --check content.js`; both passed during this planning pass. There is no existing test/typecheck/build suite. Planned build commands are `npm ci`, `npm run build`, and `npm run preview`. Add only focused checks for actual breakage risks: content rendering/escaping, preserved link paths, and fallback lifecycle. Run lint/typecheck only if the approved setup provides them.

| Viewport | Dimensions | Focus |
| --- | --- | --- |
| Large desktop | 1920 × 1080 | Hero balance, scene lighting, maximum text width |
| Laptop | 1366 × 768 | Name/role/actions visible, sticky-header height, unpinned fallback |
| Tablet | 768 × 1024 | Stacked composition, touch/keyboard access, navigation |
| iPhone-sized | 390 × 844 | Resume visibility, poster crop, safe areas, native scrolling |
| Android-sized | 412 × 915 | Card density, readable body text, touch targets, loading |

Also check 320px width, landscape, 200% zoom, reduced motion, keyboard-only navigation, JavaScript disabled, scene requests blocked, and slow network loading.

For each primary viewport, capture and inspect the arrival state, project details, research/experience content, and contact/footer. On desktop also inspect every named camera composition and replay end state. Check clipping, z-index, text contrast, font swap, spacing, hover/focus differences, and layout stability during scene readiness.

Record a cold-load trace, warm-load trace, scene-interaction trace, and an offscreen/hidden-tab check. Measure loading bytes, LCP/CLS, relevant interaction latency, long tasks, scene frame time, and continuing GPU work. Browser emulation is useful but does not replace an actual Safari/iOS or Android device check. If a physical device is unavailable, record that limit explicitly.

Deployment uses the production output, not the dev server. For this user-site URL, Vite's base is `/`; a build-based Pages workflow replaces the current legacy branch deployment at cutover. Use official Pages actions with narrowly scoped workflow permissions. [Vite GitHub Pages deployment guide](https://vite.dev/guide/static-deploy.html#github-pages).

Because reverting code alone does not reverse a Pages source-setting change, retain a buildable known-good release for fast redeployment. A full return to the original site also restores the legacy `main`/root source setting.

## 16. Risks and launch criteria

| Risk | Response |
| --- | --- |
| Spline export is too large or hard to control | Enforce the prototype gate; simplify; use the agreed direct Three.js fallback if necessary |
| Spline license or watermark conflicts with the intended finish | Verify export entitlement before final authoring; no unexpected subscription purchase |
| Generated image cannot become an accurate interactive model | Treat it as art direction; author real geometry and capture the final scene for the poster |
| Cinematic movement distracts or causes discomfort | One bounded opening sequence, reduced-motion default fallback, pause and replay controls |
| Mobile heat/battery or Safari rendering problems | Poster first, explicit scene opt-in, reduced scene/DPR, stop invisible rendering |
| Resume or role information is stale | Reconcile against approved current information before publishing |
| Experience details or project artifacts are confidential | Publish only approved public descriptions and evidence |
| Pages cutover breaks assets or anchors | Test `dist` with preserved URLs, verify deployment settings, retain a known-good artifact |

The replacement is complete only when the scene has a clear purpose; the homepage communicates Nima's work within the intended time windows; resume/contact always work; content remains usable without JS/3D; keyboard and reduced-motion modes pass; mobile composition is intentionally designed; performance gates pass under recorded conditions; primary screenshots have been inspected; and the deployed build has been checked live.

**Current status:** implementation approved and underway on the feature branch. Production deployment remains unchanged until the build is verified.

### Implementation log

- Baseline preserved on `feat/interactive-portfolio`; live Pages deployment remains untouched.
- Static build and content preservation checks pass. Initial application JS is 2.21 KB gzip; deferred motion 44.53 KB; deferred Three.js scene 138.13 KB. The scene receives a build warning for its 552 KB uncompressed chunk, but remains far below the planned compressed runtime budget; it is already dynamically imported.
- Spline authoring unavailable because no editor bridge is connected; selected the approved direct Three.js path. No additional Higgsfield credits spent.
- Started five-size production-build screenshots and browser error/layout inspection.
- User correction: Spline is required for the final interactive experience; the Three.js workbench is a temporary prototype, not the final renderer.
- Spline MCP connection repaired: the short-lived diagnostic client closed before the editor connected. A persistent official-server session now reads the live empty 3D document successfully. Authoring the Spline scene and verifying export integration next.

- Authored and exported an original Spline scene using the official desktop MCP; verified actual pick-and-place motion, exploded inspection, pause, idle/offscreen rendering suspension, and reduced-motion fallback in Chromium. The direct Three.js prototype is superseded.
- Expanding the scene to four disciplines following user feedback: machined software service layers, an AI retrieval device and source cards, ML model layers, and the robotic assembly. Shared titanium, brass, ceramic, and blue finishes; no additional generated-media credits spent.

- User rejected Spline attribution and withdrew the Spline requirement. Removed the Spline runtime and exported scene from the website. Rebuilding the same four interactive disciplines directly in Three.js; no branding is hidden or stripped from a Spline export. Existing Spline authoring is retained outside the repository for recovery only. Higgsfield remains an art-direction tool, not the runtime.

- Custom Three.js replacement verified with zero uncaught browser errors. Desktop software scene: 42 draw calls / 10,410 triangles; robot scene: 25 draw calls / 5,806 triangles. No Spline network requests or runtime references remain in delivered source/assets. Node tests cover content escaping/link preservation and robot gripper/part alignment.
- Spline MCP configuration and desktop app are left installed but unused; no account changes or additional Higgsfield credit spending. Production remains untouched.

- Realism correction: previous live models were simplified primitives and did not match the photographic Higgsfield reference. Replaced the software stack with a detailed laptop; added studio HDR lighting, contact/cast shadows, finer geometry, material grain, mechanical fasteners and cabling. Software scene now ~62 draw calls / 68,790 rendered triangles including shadow pass; robot ~70 / 21,308. Fine laptop grille details are instanced.
- User authorized spending the remaining 8 Higgsfield credits. Exactly four Nano Banana Pro jobs at 2 credits each completed; account balance verified as 0. Assets cover all four disciplines and appear in cinematic hero topic views plus four featured project cards. No video generation, subscriptions, or further spend.
- Cinematic and live geometry modes are explicitly separate: generated photography is not misrepresented as real-time rendered geometry. Three.js, GSAP and 1K HDR lighting load only after Enter 3D. Visitors can switch back; reduced-motion/no-JS users retain imagery, content, resume and contact.
- Lighting asset: [Studio Small 09](https://polyhaven.com/a/studio_small_09), Sergej Majboroda / Poly Haven, CC0; license/source retained beside the HDR. The 1K asset is a deliberate quality/bandwidth tradeoff, loaded on demand.
- Final browser checks for this iteration: all four cinematic topic images switch; Enter 3D, drag rotation, laptop inspection, return to cinematic view and repeated entry pass. Keyboard activation/focus restoration and mobile menu Escape pass. Resume returns a valid PDF and contact remains a mailto link. Five viewport captures, 320px/landscape, no-JS, reduced motion and blocked-renderer fallback pass without overflow or uncaught errors. Detailed local results/screenshots remain in ignored `artifacts/qa`. Physical iOS/Android and non-Chromium browsers remain unverified; no production deployment performed.

### Interaction correction — October 6, 2026

- Latest user feedback supersedes the photo-first implementation above. The reference describes a continuous scroll-directed camera experience; a still-image hero with an optional model viewer did not satisfy that requirement.
- Live Three.js now loads automatically (except reduced motion or explicit data saving). Wide screens use a pinned, four-chapter camera journey through software, AI, ML/research and robotics. Camera movement, hardware separation and robot manipulation respond to page progression. Chapter links jump directly within that journey; project/resume/contact links bypass it.
- Objects support direct pointer/touch inspection plus drag orbit, with equivalent keyboard-operated controls. Smaller screens retain automatic live 3D and topic controls without the long pinned sequence. A still-view control disposes the renderer and removes pinning.
- Reused the existing Three.js/GSAP stack. No new runtime dependency, Spline embedding, generated video, or additional Higgsfield spending. Existing generated photographs remain supporting project imagery and fallback assets, not 3D models.
- Circuit detail batching reduces ML draw calls from 159 to 63. Settled chapter counts: software 62, AI 23, ML 63, robotics 70. Runtime remains demand-rendered and pauses offscreen; automatic loading now incurs the approximately 151 KB gzip renderer chunk and 1.6 MB HDR asset without a click. Previous photo-only Lighthouse timings do not describe this iteration.
- Status: interaction correction implemented locally; production unchanged. Model fidelity remains custom procedural geometry, not scanned/product-grade assets or the photorealistic generated video shown in the reference. Do not represent this as having reached that visual fidelity.
- Verification: four Node tests and production build pass. Chromium checks pass for native-scroll chapter progression, pause/frozen frames, direct mesh inspection, project bypass, five viewport widths, reduced-motion renderer/pin teardown, and resume retrieval. Chromium and WebKit both render live 3D with no uncaught errors, horizontal overflow, or axe WCAG A/AA findings in the checked desktop/mobile states. Screenshots inspected. Firefox automation stalled and was terminated; Firefox and physical-device verification are outstanding. Build retains the expected warning for the deferred Three.js chunk exceeding 500 KB uncompressed.

### Mobile scroll correction — October 6, 2026

- Removed the desktop-only scroll restriction. Mobile/tablet now have a dedicated pinned stage after the introduction, with all four chapters driven by native page scrolling in either direction. The stage reserves explicit pin spacing inside the flex layout, preventing project content from overlapping the renderer.
- Kept chapter text, touch controls, and model together; fitted stage height to the actual header and small viewport, adjusted camera framing, and added a landscape arrangement. Reduced-motion/still-view teardown removes pinning. This supersedes the earlier mobile variant without a scroll sequence.
- Verified 320×568, 390×844, 412×915, 768×1024 and 844×390 in Chromium and WebKit: chapter progression/reversal, controls within viewport, no horizontal overflow or project overlap, clean release into content, and reduced-motion cleanup. Inspected screenshots. A Chromium emulated native touch swipe over the canvas scrolls the page; phone-to-desktop resizing restores one desktop pin and working chapters. Four Node tests, production build and diff whitespace checks pass. Physical-phone testing remains unperformed; production deployment unchanged.

### Scene controls and copy cleanup — October 6, 2026

- Removed the still-view, replay, inspection, pause and load buttons, their event handlers, the scene-status footer, scroll instruction, and decorative annotation. Scroll/touch interaction and chapter navigation remain; reduced-motion and data-saving preferences still select the fallback automatically.
- Replaced slogan headings with Nima's name, project names and direct section labels. Chapter descriptions now identify the actual technologies and work. Used the freed mobile space for the model.
- Four Node tests, build and whitespace checks pass. Browser verification confirms the removed UI is absent, native touch scrolling still works over the canvas, and desktop chapter navigation still works after resizing. Mobile screenshot inspected; production unchanged.

### GitHub project selection — October 6, 2026

- Reviewed public GitHub repository metadata, READMEs and relevant source files. Featured selection now leads with PocketPilot, CycleKindAI, CareerLift, ReelMeListing, GhostD and Hasse Clustering. Robotics, StrategyMining and AgenticAI remain available under More projects with preserved deep links. Removed the weather notebook and older car-rental entry from the portfolio selection.
- Confirmed PocketPilot's dense/sparse retrieval and incremental indexing in `backend/rust/crates/common/src/rag.rs`; confirmed CycleKindAI's Neo4j vector retrieval, user context and returned sources in `ZafriAI/CycleKindAI/api/routes/rag.py`. GhostD's context compiler is presented as developer tooling, not RAG. Hasse's current browser implementation uses Pyodide in a Web Worker; linked its documented live demo. No private repository details or unsupported deployment/user-count claims added.
- Updated scene chapter destinations and labels to match the featured work. Four existing tests and build pass. Browser checks confirm six featured cards, no horizontal overflow at desktop/phone widths, removed older entries, and deep-link expansion of supporting projects. Screenshots inspected. These checks validate the portfolio, not the runtime behavior of the external projects. Production unchanged.

### Project presentation refinement — October 6, 2026

- Removed generated project images, image captions, decorative numbering and hidden detail panels. Selected projects now use aligned rows with a name/repository column and visible descriptions, technologies and implementation details. Mobile stacks the same information without large image blocks.
- Removed research/contact background gradients, reduced section-heading size and excess spacing, aligned sections to the page gutter, and limited content accents to muted text and standard links. The interactive hero remains intact.
- Four tests and production build pass; desktop/phone browser checks confirm all six projects, working supporting-project deep links and no horizontal overflow. Inspected updated screenshots at 1440px and 390px. Production remains unchanged.

### Production release — October 6, 2026

- User authorized committing, pushing and publishing the current site. Clean `npm ci`, four tests, production build and built-asset checks pass; npm audit reports no vulnerabilities. CycleKindAI is removed from content and scene references.
- Publishing through the checked-in GitHub Actions Pages workflow, which builds and uploads `dist` from `main`. Live deployment verification follows the push.
- Deployed application commit `1f56599` to https://nimajafaricomp.github.io/ through successful Actions run https://github.com/NimaJafariComp/NimaJafariComp.github.io/actions/runs/37419149546. Live browser verification passed: HTTP 200, current five-project selection, removed CycleKindAI/images, desktop/mobile WebGL and chapter navigation, no failed asset responses or uncaught errors, no mobile overflow, valid resume PDF and contact link. Live desktop/mobile screenshots inspected. Pages now uses Actions deployment. Physical-device testing remains outside this verification.
- Experience reordered directly after the hero, before Selected projects and Research; desktop and mobile navigation match. Added section-order assertions to existing content validation. Tests and build pass; user authorized redeployment.
