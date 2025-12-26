

window.PORTFOLIO = {
  meta: {
    name: "Nima Jafari",
    location: "Los Angeles, CA",
    email: "mohammadnimajafari@yahoo.com",
    githubUser: "NimaJafariComp",

    resumeUrl: "assets/Nima_Jafari_Resume_2025_public.pdf",

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
    title: "Full-Stack Software Dev • Researcher • ML Engineer",
    subtitle: "I build intelligent systems that are intuitive, scale efficiently, and hold up under load.",
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
      { label: "Resume/CV", icon: "⇩", href: "assets/Nima_Jafari_Resume_2025_public.pdf" },
      { label: "Email", icon: "✉", action: "copyEmail" },
    ],
    featuredPublication: {
      heading: "Publications, data papers, and presentation notes",
      items: [
        {
          label: "arXiv Preprint",
          title: "From Data to Concepts via Wiring Diagrams (arXiv:2511.20138)",
          href: "https://arxiv.org/pdf/2511.20138.pdf",
          desc: "Introduces quasi-skeleton wiring diagrams—formal graphs connecting sequential data to abstract concepts via DAGs/Hasse diagrams. Algorithms extract diagrams from agent trajectories to summarize RL strategies, spanning category theory, clustering, symbolic reasoning, and RL behavior understanding."
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
      "I’m a builder & researcher focused on AI systems, reinforcement learning, multi‑agent dynamics, and full‑stack engineering.",
      "My work spans theoretical ML → production deployment. I care about robustness, strategy discovery, and turning research into products people actually use."
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
      { k: "Education", v: "B.S. Computer Science (2026) — California State University, Northridge (CSUN)" },
      { k: "Research", v: "Math & AI research assistant (NSF / AFOSR / DARPA funded work)" },
      { k: "Languages", v: "English, Farsi; plus Georgian & German" },
    ],
  },

  work: {
    title: "Research & Work",
    items: [
      {
        role: "Research Assistant (Math & Artificial Intelligence)",
        org: "University Corporation, CSUN",
        when: "Jan 2023 — Present",
        bullets: [
          "Co‑authored / contributed to funded proposals and projects in machine learning; 1 preprint on arXiv with additional works in progress.",
          "Built custom robotics environments with reproducible simulation + data logging; developed benchmarking scripts.",
          "Designed an RL → symbolic pipeline: dependency matrices + custom Hasse‑diagram clustering to discover winning strategies; tested robustness under controlled corruption.",
          "Presented work at CSUN events and external program reviews (including AFOSR)."
        ],
        links: [
          { label: "arXiv:2511.20138", href: "https://arxiv.org/abs/2511.20138" }
        ]
      },
      {
        role: "Co‑founder (Full‑Stack Development)",
        org: "ZafriAI",
        when: "Aug 2025 — Present",
        bullets: [
          "Prototyping full‑stack AI apps; exploring sponsorship/commercialization strategies."
        ],
        links: [
          { label: "GitHub", href: "https://github.com/ZafriAI" }
        ]
      },
      {
        role: "Robotics Intern",
        org: "MISAN Robotic Foundation",
        when: "Jun 2020 — Jun 2021",
        bullets: [
          "Contributed to intelligent firefighting and emergency robotics concepts; built foundations in coding + mechatronic assembly."
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
    note: "A selection of personal and collaborative projects showcasing my skills in machine learning, full-stack development, and automation.",
    items: [
      {
        name: "Strategy Mining in Custom RL Environments",
        badge: "Research",
        desc: "OpenAI‑Gym‑style robotics tasks; PPO agents; reproducible simulation + logging; custom Hasse clustering to discover strategies.",
        tags: ["Python", "PyTorch", "Stable‑Baselines3", "Jupyter"],
        links: [
          { kind: "github", href: "https://github.com/NimaJafariComp/Strategy-Mining-in-Custom-RL-Environments-Dual-Path-Discovery-and-Robust-Graph-Clustering?tab=readme-ov-file", title: "Repo" },
        ],
      },
      {
        name: "CycleKindAI",
        badge: "LLM + Privacy",
        desc: "Hybrid RAG pipeline with FastAPI, Neo4j, Postgres, local LLM via Ollama/APIs, Redis/MinIO, Docker Compose. Citation‑first + consent‑forward flows.",
        tags: ["FastAPI", "Neo4j", "Postgres", "RAG", "Docker", "Redis", "MinIO"],
        links: [
          { kind: "github", href: "https://github.com/ZafriAI/CycleKindAI", title: "Repo" },
        ],
      },
      {
        name: "CareerLift",
        badge: "Full‑Stack",
        desc: "End‑to‑end platform: FastAPI + LangChain + Playwright + Neo4j + Next.js/React + Electron + Docker Compose.",
        tags: ["FastAPI", "Next.js", "React", "TypeScript", "LangChain", "Playwright", "Neo4j", "Electron"],
        links: [
          { kind: "github", href: "https://github.com/NimaJafariComp", title: "GitHub" },
        ],
      },
      {
        name: "JobApplyX",
        badge: "Automation",
        desc: "MV3 extension + Node/Express backend with SQLite + Ollama. Parses job descriptions, answers screening Qs, generates cover letter PDFs.",
        tags: ["JavaScript", "Node.js", "Express", "SQLite", "Ollama", "MV3"],
        links: [
          { kind: "github", href: "https://github.com/NimaJafariComp/JobApplyX", title: "Repo" },
        ],
      },
      {
        name: "Weather Forecasting (TensorFlow)",
        badge: "ML",
        desc: "Keras ANN notebooks for training/inference on historical weather data.",
        tags: ["TensorFlow/Keras", "Python", "Notebooks"],
        links: [
          { kind: "github", href: "https://github.com/NimaJafariComp/weather-forecasting-project", title: "Repo" },
        ],
      },
      {
        name: "J.E.N.I Car Rental Application",
        badge: "Team Project",
        desc: "Multi‑service app; DB schema + backend services; AWS RDS integration; remote tunneling for dev.",
        tags: ["SQL", "Backend", "AWS RDS", "HTML/CSS"],
        links: [
          { kind: "github", href: "https://github.com/NimaJafariComp/J.E.N.I-Car-Rental-Application", title: "Repo" },
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
          "Python", "Java", "C++", "JavaScript", "TypeScript", "HTML/CSS", "SQL",
          "PyTorch", "TensorFlow/Keras", "scikit‑learn", "NumPy", "Pandas", "Jupyter",
          "FastAPI", "Node.js/Express", "Next.js", "React", "Tailwind CSS", "Electron", "Playwright"
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
          "Reproducibility & Responsible AI"
        ]
      }, 
      {
        name: "Databases & Infrastructure",
        tone: "cypress",
        items: [
          "PostgreSQL", "MySQL", "SQLite", "Neo4j", "Redis", "MinIO", "Docker", "Docker Compose", "Alembic", "REST APIs"
        ]
      },
      {
        name: "Engineering & Tooling",
        tone: "ember",
        items: [
          "Git", "pytest", "CI/CD (GitHub Actions)", "Linux + Bash", "Observability (logs/metrics)", "Security basics (auth, OWASP)",
          "Performance profiling", "Testing strategy", "API design", "Data structures & algorithms", "System design", "Debugging", "Documentation"
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
    title: "CV",
    subtitle: "Embedded CV (PDF) with one-click download.",
  },

  honors: {
    title: "Honors, Leadership & Service",
    honors: [
      "CSUN Computer Science & Engineering Department Scholarships (Guerrera Endowed 2023; Engineering Merit 2024; Trustee Steven G. Stepanek Endowed 2025).",
      "Iranian American Women’s Foundation (IAWF) scholarship awardee (2024, 2025); active mentee and volunteer.",
      "Dean’s List, awarded to students above 3.8 GPA (2023, 2024, ongoing)."
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
      { label: "Resume/CV (PDF)", href: "assets/Nima_Jafari_Resume_2025_public.pdf", icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/><path d="M4.5 4a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7zM4 6.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm.5 2a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4z"/></svg>` },
      { label: "From Data to Concepts via Wiring Diagrams (arXiv:2511.20138)", href: "https://arxiv.org/pdf/2511.20138.pdf", icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2h12v12H2V2zm1 1v10h10V3H3zm1 1h8v1H4V4zm0 2h8v1H4V6zm0 2h6v1H4V8zm0 2h8v1H4v-1z"/></svg>` },
      { label: "Game Version 2: RL Strategy Mining (DOI 10.5281/zenodo.17315846)", href: "https://doi.org/10.5281/zenodo.17315846", icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2h12v12H2V2zm1 1v10h10V3H3zm1 1h8v1H4V4zm0 2h8v1H4V6zm0 2h6v1H4V8zm0 2h8v1H4v-1z"/></svg>` },
      { label: "Game Version 3: RL Strategy Mining (DOI 10.5281/zenodo.17315753)", href: "https://doi.org/10.5281/zenodo.17315753", icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2h12v12H2V2zm1 1v10h10V3H3zm1 1h8v1H4V4zm0 2h8v1H4V6zm0 2h6v1H4V8zm0 2h8v1H4v-1z"/></svg>` },
    ],
  }
};
