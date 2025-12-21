/* =========================================================
   Editable content lives here.
   Update this file to personalize the site without touching JS.
   ========================================================= */

window.PORTFOLIO = {
  meta: {
    name: "Nima Jafari",
    location: "Los Angeles, CA",
    email: "mohammadnimajafari@yahoo.com",
    githubUser: "NimaJafariComp",

    // Public CV (phone removed). Replace with your own file if you want.
    resumeUrl: "assets/Nima_Jafari_Resume_2025_public.pdf",

    // Headshot (placeholder included). Replace this file with your real photo.
    headshotUrl: "assets/headshot.png",

    // Safety: don't show phone publicly.
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
    title: "Software Developer • Researcher • ML Engineer",
    subtitle: "I build intelligent systems that look good, scale cleanly, and hold up under pressure.",
    highlightStats: [
      { label: "CS @ CSUN", value: "2026" },
      { label: "GPA", value: "3.98 / 4.00" },
      { label: "Focus", value: "RL + Full‑Stack" },
    ],
    quote: {
      text: "",
      note: "",
    },
    ctas: [
      { label: "Email", icon: "✉", action: "copyEmail" },
      { label: "Machines Timeline", icon: "✶", action: "jumpMachines" },
      { label: "CV", icon: "⇩", action: "jumpCV" },
    ],
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
      "Full‑stack ML apps (Next.js / FastAPI)",
      "Automation (extensions, scraping, pipelines)",
    ],
    quickFacts: [
      { k: "Education", v: "B.S. Computer Science — California State University, Northridge (CSUN)" },
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
    title: "Rise of Machines",
    subtitle: "Major milestones as glowing constellations in a static layout.",
    tip: "Scroll inside this panel. Click a node to pin details.",
    items: [
      { year: 1945, title: "ENIAC", subtitle: "One of the first electronic general‑purpose computers", desc: "The idea of computation becomes a machine." },
      { year: 1947, title: "The Transistor", subtitle: "The heartbeat of modern tech", desc: "From vacuum tubes to scalable electronics." },
      { year: 1956, title: "Birth of AI", subtitle: "Dartmouth Conference", desc: "The field gets its name — and its ambition." },
      { year: 1969, title: "ARPANET", subtitle: "The first breath of the Internet", desc: "Packet‑switched networking connects distant machines." },
      { year: 1973, title: "Mobile Phone", subtitle: "The first handheld call", desc: "Computing begins to leave the desk." },
      { year: 1983, title: "TCP/IP", subtitle: "The Internet speaks one language", desc: "A protocol stack that scales globally." },
      { year: 1991, title: "SIM Card + WWW", subtitle: "Identity goes mobile • The Web opens", desc: "Phones get identity; the world gets hyperlinks." },
      { year: 1997, title: "Wi‑Fi + Deep Blue", subtitle: "Unshackled from cables • AI beats a Grandmaster", desc: "Wireless convenience — and symbolic AI history." },
      { year: 2007, title: "The iPhone", subtitle: "The pocket computer era", desc: "A computer becomes the default personal device." },
      { year: 2017, title: "Transformers", subtitle: "Attention changes everything", desc: "Sequence modeling becomes parallel, scalable, expressive." },
      { year: 2022, title: "Generative AI", subtitle: "ChatGPT • Stable Diffusion", desc: "Models begin to generate: text, images, code — culture shifts." },
    ],
  },

  projects: {
    title: "Featured Projects",
    note: "Hover for tilt + glow. Click ↗ to open links.",
    items: [
      {
        name: "Strategy Mining in Custom RL Environments",
        badge: "Research",
        desc: "OpenAI‑Gym‑style robotics tasks; PPO agents; reproducible simulation + logging; custom Hasse clustering to discover strategies.",
        tags: ["Python", "PyTorch", "Stable‑Baselines3", "Jupyter"],
        links: [
          { kind: "link", href: "https://arxiv.org/abs/2511.20138", title: "Paper" },
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
    note: "Everything I use across projects + a clean set of industry essentials for SWE / AI / Data Science.",
    groups: [
      {
        name: "Core (from projects + CV)",
        tone: "accent",
        items: [
          "Python", "Java", "C++", "JavaScript", "TypeScript", "HTML/CSS", "SQL",
          "PyTorch", "TensorFlow/Keras", "scikit‑learn", "NumPy", "Pandas", "Jupyter",
          "Reinforcement Learning (PPO, SB3)", "RAG", "LangChain",
          "FastAPI", "Node.js/Express", "Next.js", "React", "Tailwind CSS", "Electron", "Playwright",
          "PostgreSQL", "MySQL", "SQLite", "Neo4j", "Redis", "MinIO",
          "Docker", "Docker Compose", "Alembic", "Git", "pytest", "REST APIs", "PDFKit",
        ]
      },
      {
        name: "Software Engineer essentials",
        items: [
          "Data structures & algorithms", "System design", "API design", "Testing strategy", "Debugging",
          "CI/CD (GitHub Actions)", "Linux + Bash", "Observability (logs/metrics)",
          "Security basics (auth, OWASP)", "Performance profiling", "Documentation"
        ]
      },
      {
        name: "AI Engineer essentials",
        items: [
          "Experiment tracking", "Model evaluation", "Prompt + tool orchestration", "Vector search",
          "Deployment patterns", "Latency/cost tradeoffs", "Reproducibility", "Responsible AI"
        ]
      },
      {
        name: "Data Scientist essentials",
        items: [
          "Statistics", "Feature engineering", "Data cleaning", "EDA", "Visualization",
          "Forecasting", "A/B testing basics", "Storytelling with data"
        ]
      }
    ],
  },

  cv: {
    title: "CV",
    subtitle: "Embedded PDF + one-click download (public version, phone removed).",
  },

  honors: {
    title: "Honors, Leadership & Service",
    honors: [
      "CSUN Computer Science & Engineering Department Scholarships (Guerrera Endowed 2023; Engineering Merit 2024; Trustee Steven G. Stepanek Endowed 2025).",
      "Iranian American Women’s Foundation (IAWF) scholarship awardee (2024, 2025); active mentee and volunteer.",
      "Dean’s List (multiple terms, ongoing)."
    ],
    leadership: [
      { title: "Alpha Lambda Delta Honor Society (Co‑founder)", when: "2023 — Present", note: "Treasurer (2024 academic year)." },
      { title: "CSUN Hiking Club (Co‑founder)", when: "2023 — Present", note: "Organized weekend hikes; grew membership to ~40 active participants." },
      { title: "Community Engagement", when: "Ongoing", note: "Volunteer with American Red Cross (LA fire) + local community organizations; tennis team member; music/worship band involvement." },
    ],
  },

  contact: {
    title: "Links",
    note: "Find me across the web.",
    socials: [
      { label: "GitHub", href: "https://github.com/NimaJafariComp" },
      { label: "arXiv", href: "https://arxiv.org/abs/2511.20138" },
      { label: "Instagram", href: "https://www.instagram.com/nima_nick_jafari?igsh=NTc4MTIwNjQ2YQ%3D%3D&utm_source=qr" },
      { label: "Spotify", href: "https://open.spotify.com/user/31bzlxmfgtlstf2kacrsl5ziusdq?si=-dg6fMTIQHC_GWPDSQmxDQ" },
      { label: "USTA", href: "https://www.usta.com/en/home/play/player-search/profile.html#uaid=2019407241&tab=tournaments" },
      { label: "Email", href: "mailto:mohammadnimajafari@yahoo.com" },
      { label: "CV (PDF)", href: "assets/Nima_Jafari_Resume_2025_public.pdf" },
    ],
  }
};
