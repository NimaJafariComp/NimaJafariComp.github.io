

export const portfolio = {
  meta: {
    name: "Nima Jafari",
    location: "Austin, TX",
    email: "mohammadnimajafari@yahoo.com",
    githubUser: "NimaJafariComp",

    resumeUrl: "assets/resume_sweV2.pdf",

    headshotUrl: "assets/headshot.png",

    showPhone: false,
  },

  themes: {
    night: {
      label: "Starry Night",
      emoji: "☾",
      hint: "Starry Night palette",
    },
    provence: {
      label: "Farmhouse in Provence",
      emoji: "☀",
      hint: "Warm daylight palette",
    },
  },

  audio: {
    enabled: true,
    youtubeId: "UhkYmAHaEiM",
    title: "It Never Entered My Mind",
    artist: "Miles Davis",
    note: "Workin’ sessions • 1956 (YouTube embed)",
  },

  hero: {
    title: "Software Engineer • Machine Learning & Robotics",
    subtitle: "I build simulation-based robotics, machine learning, and full-stack AI systems. I’m excited to develop new systems with mission-oriented teams, and open to full-time and contract-to-hire opportunities.",
    highlightStats: [
      { label: "B.S. Computer Science (CSUN)", value: "2026" },
      { label: "Dean’s List", value: "3.98 GPA" },
      { label: "Focus", value: "ML + Full‑Stack" },
    ],
    quote: {
      text: "",
      note: "",
    },
    ctas: [
      { label: "Resume/CV", icon: "⇩", href: "assets/resume_sweV2.pdf" },
      { label: "Email", icon: "✉", action: "copyEmail" },
    ],
    featuredPublication: {
      heading: "Publications, data papers, and presentation notes",
      items: [
        {
          label: "arXiv Preprint",
          title: "Wiring Diagram Extraction and Gluing (arXiv:2607.27598)",
          href: "https://arxiv.org/abs/2607.27598",
          desc: "Applies iterative Hasse clustering to figure-skating jump videos, using wiring diagrams to represent and classify temporal patterns in 3D motion data."
        },
        {
          label: "arXiv Preprint",
          title: "From Data to Concepts via Wiring Diagrams (arXiv:2511.20138)",
          href: "https://arxiv.org/abs/2511.20138",
          desc: "Designed two versions of a video game and trained PPO reinforcement-learning agents to play them. Hasse-clustering algorithms analyzed gameplay traces to recover winning strategies, with comparisons against DBSCAN and hierarchical clustering."
        },
        {
          label: "Zenodo DOI: 10.5281/zenodo.17315846",
          title: "Game Version 2: RL Strategy Mining",
          href: "https://doi.org/10.5281/zenodo.17315846",
          desc: "Technical supplement / data paper for the main research."
        },
        {
          label: "Zenodo DOI: 10.5281/zenodo.17315753",
          title: "Game Version 3: RL Strategy Mining",
          href: "https://doi.org/10.5281/zenodo.17315753",
          desc: "Further data paper for V3: dual-strategy discovery and symbolic analysis in the updated RL environment."
        }
      ],
    },
  },

  about: {
    title: "About",
    body: [
      "I build software across machine learning, robotics simulation, AI systems, and full-stack product development.",
      "My experience includes grant-supported machine learning projects, a pre-seed startup role, and end-to-end product engineering. I’m excited to build new systems with mission-oriented teams."
    ],
    interests: [
      "Reinforcement Learning (PPO, SB3)",
      "Multi‑Agent RL & Coordination",
      "Game Theory & Strategy Discovery",
      "Robust & Reliable ML",
      "RAG + Agentic Workflows",
      "Graph / Topological ML (Hasse diagrams)",
      "Vision AI",
      "Multi‑Agent Debate",
      "Full‑stack ML apps (Next.js / FastAPI)",
      "Automation (extensions, scraping, pipelines)",
    ],
    quickFacts: [
      { k: "Education", v: "B.S. Computer Science, May 2026; GPA 3.98/4.00 — California State University, Northridge (CSUN)" },
      { k: "Recent work", v: "Founding AI Engineer at Driftless; Machine Learning Engineer on contract projects; Full-Stack iOS Engineer at SideShift in New York City" },
      { k: "Project support", v: "DoW- and NSF-supported projects, including DARPA and AFOSR programs; appointment administered through University Corporation at CSUN" },
      { k: "Languages", v: "English, Farsi; plus Georgian & German" },
    ],
  },

  work: {
    title: "Experience",
    items: [
      {
        role: "Machine Learning Engineer",
        org: "Contract Projects",
        when: "Jan 2023 - Present",
        meta: "DoW- and NSF-supported projects, including DARPA and AFOSR programs; appointment administered through University Corporation at CSUN.",
        bullets: [
          "Designed the kernel for the Wiring Diagram SDK. Used a Franka Panda environment in NVIDIA Isaac Sim to validate concepts and test the kernel through planar pushing and guarded peg insertion, with structured observations, bounded execution, and auditable trial logs.",
          "Tested the SDK concepts in an Isaac Sim study comparing wiring-diagram planning with a symbolic baseline: 29/30 original nominal trials reached target, and all 60/60 missing or stale observation fault trials stopped safely.",
          "Created reproducible benchmark tooling with held-out task families, ordered trial records, raw evidence, and configuration hashes; results are reported within the frozen study scope.",
          "Developed a from-scratch multinomial linear next-action policy baseline with separate training, validation, and evaluation families; qualified legal proposals and safe-stop behavior without direct robot-dispatch authority.",
          "Developed Hasse-diagram clustering for sequential reinforcement-learning behavior, recovering two winning strategies across all 125 successful episodes and evaluating robustness against 10% data corruption.",
          "Separately trained and evaluated CNN-based figure-skating video classifiers, including transfer learning with a Kinetics-pretrained R(2+1)D-18, and tested pose models including YOLOv8-Pose, MediaPipe, Keypoint R-CNN, and OpenPose.",
          "Co-authored two arXiv preprints during this appointment and presented findings at CSUN, Stanford SRC 2026, and the AFOSR 2025 Computational Cognition & Machine Intelligence Program Review."
        ]
      },
      {
        role: "Founding AI Engineer",
        org: "Driftless",
        when: "Aug 2025 - Present",
        meta: "Equity-based, part-time role at a pre-seed startup",
        bullets: [
          "Helped build a multi-tenant SaaS product for human teams and AI agents to coordinate work through shared task management and agent execution workflows.",
          "Delivered features across the React client, Node.js/Express services, MongoDB data layer, and command-line agent tools, including task workflows, agent sessions, and organization-scoped access.",
          "Built interactive terminal experiences for agent runs with live task status, inbox handoffs, model/provider selection, onboarding, and resilient process lifecycle handling."
        ]
      },
      {
        role: "Full-Stack iOS Engineer (Contract)",
        org: "SideShift",
        when: "May 2026",
        meta: "New York City, NY",
        bullets: [
          "Shipped SwiftUI interface fixes and backend-supported web features; improved data access and caching to reduce unnecessary cloud database and API usage.",
          "Collaborated on product refinements related to subscription conversion and premium feature adoption."
        ],
      },
      {
        role: "Python Software Developer",
        org: "MISAN Robotic Foundation",
        when: "Jun 2020 - Jun 2021",
        meta: "Remote",
        bullets: [
          "Supported firefighting and emergency-response robotics through software development, hardware assembly, mechatronic integration, and prototype testing."
        ],
      }
    ],
  },

  machines: {
    title: "Evolution of Technology",
    subtitle: "A journey through pivotal moments that shaped our digital age.",
    tip: "Scroll to explore the full timeline",
    items: [
      { year: 1837, title: "Analytical Engine", subtitle: "Charles Babbage's mechanical computer concept", desc: "The blueprint for programmable computation — a century ahead of its time.", category: "Computing" },
      { year: 1936, title: "Turing Machine", subtitle: "Theoretical foundation of computation", desc: "Alan Turing defines what it means to compute, establishing the limits and possibilities of algorithms.", category: "Theory" },
      { year: 1945, title: "ENIAC", subtitle: "First general-purpose electronic computer", desc: "18,000 vacuum tubes bring the digital age to life — computation becomes tangible.", category: "Computing" },
      { year: 1947, title: "The Transistor", subtitle: "The atomic unit of modern electronics", desc: "Bell Labs engineers replace vacuum tubes with solid-state switching, enabling miniaturization.", category: "Hardware" },
      { year: 1956, title: "Dartmouth Conference", subtitle: "Birth of Artificial Intelligence", desc: "The field gets its name and founding vision: machines that think.", category: "AI" },
      { year: 1958, title: "Integrated Circuit", subtitle: "The microchip revolution begins", desc: "Jack Kilby demonstrates multiple transistors on a single chip — Moore's Law becomes inevitable.", category: "Hardware" },
      { year: 1969, title: "ARPANET", subtitle: "First packet-switched network", desc: "Four nodes connect UCLA, Stanford, UCSB, and Utah — the Internet's first breath.", category: "Networking" },
      { year: 1971, title: "Microprocessor", subtitle: "Intel 4004 — a computer on a chip", desc: "4-bit processor with 2,300 transistors brings computing to the masses.", category: "Hardware" },
      { year: 1973, title: "Mobile Phone Call", subtitle: "Motorola's portable cellular breakthrough", desc: "Martin Cooper makes the first handheld mobile call — untethering communication.", category: "Mobile" },
      { year: 1983, title: "TCP/IP Standard", subtitle: "The Internet speaks one language", desc: "Protocol stack unifies networks globally, enabling exponential growth.", category: "Networking" },
      { year: 1989, title: "World Wide Web", subtitle: "Tim Berners-Lee's information revolution", desc: "HTTP, HTML, and URLs transform the Internet into an accessible information space.", category: "Web" },
      { year: 1991, title: "Linux Kernel", subtitle: "Open-source operating system emerges", desc: "Linus Torvalds releases v0.01 — collaborative software development goes mainstream.", category: "Software" },
      { year: 1997, title: "Deep Blue vs Kasparov", subtitle: "AI defeats world chess champion", desc: "IBM's supercomputer wins the rematch, proving machines can master strategy.", category: "AI" },
      { year: 1998, title: "Google Founded", subtitle: "PageRank changes web search", desc: "Larry Page and Sergey Brin organize the world's information with algorithmic relevance.", category: "Web" },
      { year: 2004, title: "Facebook Launches", subtitle: "Social networking goes global", desc: "Connecting people becomes the dominant use case for the Internet.", category: "Social" },
      { year: 2007, title: "The iPhone", subtitle: "Multitouch smartphone era begins", desc: "Apple redefines mobile computing: a powerful computer in every pocket.", category: "Mobile" },
      { year: 2009, title: "Bitcoin", subtitle: "Decentralized digital currency", desc: "Satoshi Nakamoto's blockchain enables trustless peer-to-peer transactions.", category: "Crypto" },
      { year: 2012, title: "AlexNet", subtitle: "Deep learning proves its worth", desc: "Convolutional neural network crushes ImageNet competition, igniting the AI renaissance.", category: "AI" },
      { year: 2016, title: "AlphaGo", subtitle: "AI conquers the game of Go", desc: "DeepMind's reinforcement learning system defeats Lee Sedol, mastering intuition.", category: "AI" },
      { year: 2017, title: "Attention Mechanism", subtitle: "'Attention is All You Need'", desc: "Transformer architecture revolutionizes sequence modeling — foundation of modern AI.", category: "AI" },
      { year: 2020, title: "GPT-3", subtitle: "Large language models emerge", desc: "175 billion parameters demonstrate few-shot learning and language understanding at scale.", category: "AI" },
      { year: 2021, title: "GitHub Copilot", subtitle: "AI-assisted programming", desc: "Code generation becomes collaborative — developers partner with AI.", category: "AI" },
      { year: 2022, title: "ChatGPT & Stable Diffusion", subtitle: "Generative AI goes mainstream", desc: "Conversational AI and text-to-image synthesis reach millions — culture shifts overnight.", category: "AI" },
      { year: 2023, title: "GPT-4 & Multimodal AI", subtitle: "Vision meets language", desc: "Advanced reasoning across text, images, and code — AI becomes a creative partner.", category: "AI" },
      { year: 2024, title: "AI Agents", subtitle: "Autonomous systems take action", desc: "LLMs gain tools, memory, and agency — from assistants to active collaborators.", category: "AI" },
    ],
  },

  projects: {
    title: "Featured Projects",
    note: "A selection of personal and collaborative projects showcasing my skills in machine learning, full-stack development, automation, and AI product engineering.",
    items: [
      {
        name: "Strategy Mining in Custom RL Environments",
        badge: "Reinforcement Learning",
        desc: "Designed two versions of a video game, trained PPO agents to play them, and analyzed gameplay traces with Hasse-diagram clustering to recover the winning strategies.",
        tags: ["Python", "PyTorch", "Stable‑Baselines3", "Jupyter"],
        links: [
          { kind: "github", href: "https://github.com/NimaJafariComp/Strategy-Mining-in-Custom-RL-Environments-Dual-Path-Discovery-and-Robust-Graph-Clustering?tab=readme-ov-file", title: "Repo" },
        ],
      },
      {
        name: "GhostD",
        badge: "Developer tooling",
        desc: "A local TypeScript runtime that records developer-agent events in SQLite and compiles versioned context for side questions to Codex, Claude, or Gemini. Includes a CLI, a VS Code extension, and a read-only MCP server.",
        tags: ["TypeScript", "Node.js", "SQLite", "MCP", "VS Code"],
        links: [
          { kind: "github", href: "https://github.com/NimaJafariComp/GhostD", title: "Repo" },
        ],
      },
      {
        name: "CareerLift",
        badge: "Full-stack · Web & mobile",
        desc: "Designed and built a full-stack AI career platform spanning React web and React Native mobile experiences, with backend systems for resume parsing, job discovery, ATS-style matching, and mock interview coaching.",
        tags: ["React", "React Native", "TypeScript", "FastAPI", "Neo4j", "LangChain", "Electron"],
        links: [
          { kind: "github", href: "https://github.com/NimaJafariComp/CareerLift", title: "Repo" },
        ],
      },
      {
        name: "AgenticAI",
        badge: "Agentic Systems",
        desc: "An AI-assisted refund-support workflow with a Streamlit chat frontend and FastAPI backend. A deterministic policy engine validates customer and order ownership, evaluates policy, and keeps the LLM limited to missing-information prompts and customer-facing explanations.",
        tags: ["Python", "FastAPI", "Streamlit", "Pydantic", "SQLite", "Ollama", "OpenAI SDK", "Anthropic SDK", "pytest", "Ruff"],
        links: [
          { kind: "github", href: "https://github.com/NimaJafariComp/AgenticAI", title: "Repo" },
        ],
      },
      {
        name: "PocketPilot",
        badge: "Full-stack · Finance & RAG",
        desc: "Personal finance apps for web and mobile, with transactions, budgets, savings goals, and a Rust RAG service. Qdrant combines semantic and keyword retrieval over user-specific financial records, with local inference through Ollama.",
        tags: ["React", "React Native", "TypeScript", "Rust", "Firebase", "Qdrant", "Ollama"],
        links: [
          { kind: "github", href: "https://github.com/NimaJafariComp/PocketPilot", title: "Repo" },
          { kind: "demo", href: "https://pocketpilot-staging.web.app/signin", title: "Open app" },
        ],
      },
      {
        name: "JobApplyX",
        badge: "Automation",
        desc: "MV3 extension and Node/Express backend with SQLite and Ollama for parsing job descriptions, answering screening questions, and generating cover letter PDFs.",
        tags: ["JavaScript", "Node.js", "Express", "SQLite", "Ollama", "MV3"],
        links: [
          { kind: "github", href: "https://github.com/NimaJafariComp/JobApplyX", title: "Repo" },
        ],
      },
      {
        name: "Hasse Clustering",
        badge: "Clustering + RL",
        desc: "A Python engine and browser application for clustering ordered event sequences by Hasse-DAG patterns. The browser runs the engine in a Pyodide Web Worker, with CSV/JSON input, graph visualization, cluster exports, and cancellation.",
        tags: ["Python", "Pyodide", "Web Workers", "SVG", "Graph Clustering"],
        links: [
          { kind: "github", href: "https://github.com/NimaJafariComp/Hasse_clustering", title: "Repo" },
          { kind: "external", href: "https://hasse-clustering.pages.dev/", title: "Live demo" },
          { kind: "external", href: "https://arxiv.org/abs/2511.20138", title: "Paper" },
        ],
      },
      {
        name: "Figure-Skating Jump Analysis Pipeline",
        badge: "Computer Vision",
        desc: "Analyzed figure-skating jump videos with CNN classifiers and pose-estimation models, then applied interpretable Hasse-DAG clustering to motion-event sequences.",
        tags: ["CNN", "YOLOv8-Pose", "Computer Vision", "Hasse Clustering"],
        links: [
          { kind: "github", href: "https://github.com/NimaJafariComp/Figure-Skating-Jump-Analysis-Pipeline", title: "Repo" },
          { kind: "external", href: "https://arxiv.org/abs/2607.27598", title: "Paper" },
        ],
      },
      {
        name: "ReelMeListing",
        badge: "Full-stack · Media",
        desc: "Built a browser-based studio that turns property photos into reviewed vertical listing reels, with image-quality checks, optional AI image edits, and video-generation workflows.",
        tags: ["React", "FastAPI", "Python", "Computer Vision", "FFmpeg", "Video Generation"],
        links: [
          { kind: "github", href: "https://github.com/NimaJafariComp/ReelMeListing", title: "Repo" },
        ],
      },
    ],
  },

  skills: {
    title: "Skills",
    note: "Technologies and tools organized by category.",
    groups: [
      {
        name: "Languages & Frameworks",
        tone: "sun",
        items: [
          "Python", "Java", "C++", "JavaScript", "TypeScript", "Ruby", "Rust", "HTML/CSS", "SQL",
          "PyTorch", "TensorFlow/Keras", "scikit‑learn", "NumPy", "Pandas", "Jupyter",
          "FastAPI", "Node.js/Express", "Next.js", "React", "React Native", "Tailwind CSS", "Electron", "Playwright",
          "Swift", "SwiftUI", "Solid.js"
        ]
      },
      {
        name: "Machine Learning & Research",
        tone: "cobalt",
        items: [
          "Reinforcement Learning (PPO, A2C, DQN, SAC, TD3)",
          "Computer Vision (ViT, ResNet, EfficientNet, Faster R-CNN, YOLO, Swin Transformer)",
          "Vision libraries & tools (OpenCV, torchvision, Detectron2, albumentations)",
          "Transformers & Foundation Models (Hugging Face Transformers, BERT, ViT)",
          "Self-supervised learning (SimCLR, BYOL)",
          "Experiment tracking (Weights & Biases, MLflow)",
          "Model evaluation (mAP, IoU, FID, LPIPS)",
          "Vector search & retrieval", "Prompt & tool orchestration", "Deployment patterns (TorchServe, BentoML)",
          "Distributed training (DeepSpeed, PyTorch Lightning, Horovod)",
          "Simulation & environments (Gym, MuJoCo, PyBullet, Brax)",
          "Reproducibility & Responsible AI", "Supervised learning", "Time-series forecasting", "Graph-grounded retrieval",
          "LLM application pipelines", "Prompt engineering", "LLM output validation", "AI-generated code review & evaluation",
          "LangChain", "Ollama"
        ]
      }, 
      {
        name: "Databases & Infrastructure",
        tone: "cypress",
        items: [
          "PostgreSQL", "MySQL", "SQLite", "Neo4j", "Redis", "MinIO", "Docker", "Docker Compose", "Alembic", "REST APIs",
          "AWS (RDS, EC2, S3)", "Azure", "Qdrant", "Kubernetes", "Data pipelines", "Microservices", "Cloud deployment"
        ]
      },
      {
        name: "Engineering & Tooling",
        tone: "ember",
        items: [
          "Git", "pytest", "CI/CD (GitHub Actions)", "Linux + Bash", "Figma", "Observability (logs/metrics)", "Security basics (auth, OWASP)",
          "Performance profiling", "Testing strategy", "API design", "Data structures & algorithms", "System design", "Debugging", "Documentation",
          "GitHub", "Cursor", "Claude Code", "OpenAI Codex", "Assisted prototyping", "Code review"
        ]
      },
      {
        name: "Data & Analysis",
        tone: "azure",
        items: [
          "Statistics", "Feature engineering", "Data cleaning", "Exploratory Data Analysis (EDA)", "Visualization",
          "Forecasting", "A/B testing basics"
        ]
      }
    ],
  },

  cv: {
    title: "Resume",
    subtitle: "Embedded resume PDF with one-click download.",
  },

  honors: {
    title: "Honors, Leadership & Service",
    honors: [
      "CSUN Computer Science & Engineering Department Scholarships (Guerrera Endowed 2023; Engineering Merit 2024; Trustee Steven G. Stepanek Endowed 2025).",
      "Iranian American Women’s Foundation (IAWF) scholarship awardee (2024, 2025); active mentee and volunteer.",
      "Dean’s List each semester from Fall 2022 through graduation in May 2026."
    ],
    leadership: [
      { title: "Alpha Lambda Delta Honor Society (Co‑founder)", when: "2023 — Present", note: "Treasurer (2024): maintained financial records, budget reports, and funding requests to guide leadership decisions." },
      { title: "CSUN Hiking Club (Co‑founder)", when: "2023 — Present", note: "Organized weekend hikes; grew membership to ~40 active participants." },
      { title: "Community Engagement", when: "Ongoing", note: "Volunteer with American Red Cross (LA fire) + local orgs; coordinated supply drops and event staffing; tennis team member; music/worship band participation." },
    ],
  },

  contact: {
    title: "Links",
    note: "Find me across the web.",
    socials: [
      { label: "GitHub", href: "https://github.com/NimaJafariComp", icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>` },
      { label: "Instagram", href: "https://www.instagram.com/nima_nick_jafari?igsh=NTc4MTIwNjQ2YQ%3D%3D&utm_source=qr", icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/></svg>` },
      { label: "Spotify", href: "https://open.spotify.com/user/31bzlxmfgtlstf2kacrsl5ziusdq?si=-dg6fMTIQHC_GWPDSQmxDQ", icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.669 11.538a.498.498 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.771a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.687zm.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858zm.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288z"/></svg>` },
      { label: "USTA", href: "https://www.usta.com/en/home/play/player-search/profile.html#uaid=2019407241&tab=tournaments", icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="7" stroke="currentColor" fill="none" stroke-width="1.5"/><circle cx="8" cy="8" r="1.5"/><line x1="8" y1="2" x2="8" y2="5" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="11" x2="8" y2="14" stroke="currentColor" stroke-width="1.5"/><line x1="2" y1="8" x2="5" y2="8" stroke="currentColor" stroke-width="1.5"/><line x1="11" y1="8" x2="14" y2="8" stroke="currentColor" stroke-width="1.5"/></svg>` },
      { label: "Email", href: "mailto:mohammadnimajafari@yahoo.com", icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z"/></svg>` },
      { label: "Resume/CV (PDF)", href: "assets/resume_sweV2.pdf", icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/><path d="M4.5 4a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7zM4 6.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm.5 2a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0 1h-4z"/></svg>` },
      { label: "Wiring Diagram Extraction and Gluing (arXiv:2607.27598)", href: "https://arxiv.org/abs/2607.27598" },
      { label: "From Data to Concepts via Wiring Diagrams (arXiv:2511.20138)", href: "https://arxiv.org/pdf/2511.20138.pdf", icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2h12v12H2V2zm1 1v10h10V3H3zm1 1h8v1H4V4zm0 2h8v1H4V6zm0 2h6v1H4V8zm0 2h8v1H4v-1z"/></svg>` },
      { label: "Game Version 2: RL Strategy Mining (DOI 10.5281/zenodo.17315846)", href: "https://doi.org/10.5281/zenodo.17315846", icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2h12v12H2V2zm1 1v10h10V3H3zm1 1h8v1H4V4zm0 2h8v1H4V6zm0 2h6v1H4V8zm0 2h8v1H4v-1z"/></svg>` },
      { label: "Game Version 3: RL Strategy Mining (DOI 10.5281/zenodo.17315753)", href: "https://doi.org/10.5281/zenodo.17315753", icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2h12v12H2V2zm1 1v10h10V3H3zm1 1h8v1H4V4zm0 2h8v1H4V6zm0 2h6v1H4V8zm0 2h8v1H4v-1z"/></svg>` },
    ],
  }
};
