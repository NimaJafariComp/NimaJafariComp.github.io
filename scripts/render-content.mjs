import { portfolio } from "../content.js";

export function escapeHtml(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );
}

export function safeHref(value) {
  const url = String(value ?? "").trim();
  if (
    /^(https:\/\/|mailto:|#[\w-]+$|\/?assets\/)/.test(url) &&
    !/[\u0000-\u0020\\]/.test(url)
  ) {
    return escapeHtml(url);
  }
  throw new Error(`Unsupported portfolio URL: ${url}`);
}

const arrow =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="1.5"/></svg>';
const down =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v14m-5-5 5 5 5-5M4 20h16" stroke="currentColor" stroke-width="1.5"/></svg>';
const slug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const tags = (items) =>
  `<ul class="tags" aria-label="Technologies">${items.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")}</ul>`;
const links = (items) =>
  items
    .map(
      (link) =>
        `<a class="text-link" href="${safeHref(link.href)}">${escapeHtml(link.title || link.label)} ${arrow}</a>`,
    )
    .join("");

function projectCard({ id, name, category, description, tech, story, projectLinks }) {
  return `<article class="project" id="${id}">
    <div class="project__heading"><p class="eyebrow">${escapeHtml(category)}</p><h3>${escapeHtml(name)}</h3><div class="project__links">${links(projectLinks)}</div></div>
    <div class="project__body"><p>${escapeHtml(description)}</p>
    ${tags(tech)}<dl class="project__facts">${story.filter(([, body]) => body !== description).map(([title, body]) => `<div><dt>${escapeHtml(title)}</dt><dd>${escapeHtml(body)}</dd></div>`).join("")}</dl></div>
  </article>`;
}

export function renderPortfolio() {
  const p = portfolio;
  const research = p.projects.items[0];
  const career = p.projects.items.find((item) => item.name === "CareerLift");
  const agent = p.projects.items.find((item) => item.name === "AgenticAI");
  const existingProjects = [
    {
      id: "project-robotics",
      name: "Wiring Diagram SDK",
      category: "SDK · Kernel design",
      kind: "robotics",
      description:
        "Designed the kernel for the Wiring Diagram SDK, using NVIDIA Isaac Sim as a test environment for concept validation and evaluation.",
      tech: ["Python", "Kernel design", "Wiring diagrams", "NVIDIA Isaac Sim"],
      story: [
        ["Kernel design & validation", p.work.items[0].bullets[0]],
        ["Evidence, within scope", p.work.items[0].bullets[1]],
        ["Reproducibility", p.work.items[0].bullets[2]],
      ],
      projectLinks: [{ title: "Related experience", href: "#experience" }],
    },
    {
      id: "project-strategy",
      name: "StrategyMining",
      category: "Research · Reinforcement learning",
      kind: "research",
      description: research.desc,
      tech: ["PPO", "PyTorch", "Hasse diagrams"],
      story: [
        [
          "The question",
          "How can successful agent behavior be organized into understandable strategies rather than a collection of opaque traces?",
        ],
        ["My contribution", p.work.items[0].bullets[4]],
        [
          "Method",
          "Custom game environments, trained PPO agents, and Hasse-diagram clustering, with DBSCAN and hierarchical clustering comparisons.",
        ],
      ],
      projectLinks: [
        research.links[0],
        { title: "Preprint", href: "https://arxiv.org/abs/2511.20138" },
      ],
    },
    {
      id: "project-careerlift",
      name: "CareerLift",
      category: "Product engineering · CareerLift",
      kind: "product",
      description: career.desc,
      tech: ["React", "React Native", "FastAPI"],
      story: [
        [
          "The problem",
          "Bring job discovery, resume matching, and interview preparation into a connected web and mobile experience.",
        ],
        ["My contribution", career.desc],
        [
          "The system",
          "React web and React Native mobile clients supported by backend services for parsing, matching, and coaching. The repository documents the implementation.",
        ],
      ],
      projectLinks: career.links,
    },
    {
      id: "project-agenticai",
      name: "AgenticAI",
      category: "AI engineering · AgenticAI",
      kind: "ai",
      description: agent.desc,
      tech: ["Python", "FastAPI", "Pydantic", "Ollama"],
      story: [
        ["The workflow", agent.desc],
        ["The boundary", "A deterministic policy engine makes policy decisions; the language model gathers missing information and explains the outcome."],
      ],
      projectLinks: agent.links,
    },
  ];
  const featured = [
    ["PocketPilot", "project-pocketpilot", "product", [
      ["Full stack", "React web and Expo mobile clients share domain models and services, backed by Firebase and Rust HTTP services."],
      ["Retrieval", "Dense embeddings and sparse keyword vectors are stored in Qdrant. Merchant names, dates, and amounts receive explicit keyword boosts; unchanged records are skipped during re-indexing."],
    ]],
    ["CareerLift", "project-careerlift", "product", existingProjects.find(project => project.id === "project-careerlift").story],
    ["ReelMeListing", "project-reelmelisting", "product", [
      ["Studio", "React and FastAPI handle photo uploads, job records, quality reports, and vertical reel assembly with FFmpeg."],
      ["Generated media", "Optional image-editing and ComfyUI/LTX workflows produce candidates for human review. Video generation requires a separately configured CUDA workflow; the browser handles planning and deterministic assembly."],
    ]],
    ["GhostD", "project-ghostd", "ai", [
      ["Context", "Captured lifecycle events are normalized into a local SQLite ledger. Compiled context retains source-event references and a specific revision."],
      ["Interfaces", "Terminal commands, a VS Code extension, and a read-only MCP server expose that context without modifying the original agent conversation."],
    ]],
    ["Hasse Clustering", "project-hasse-clustering", "research", [
      ["Engine", "Extracts partial-order patterns from event sequences, including repeated events, and groups sequences by the patterns they support."],
      ["Browser app", "Runs the canonical Python engine in a Web Worker through Pyodide. Input and computation stay in the browser; the deployment serves static assets."],
    ]],
  ].map(([name, id, kind, story]) => {
    const project = p.projects.items.find(item => item.name === name);
    return { id, name, kind, story, category: project.badge, description: project.desc,
      tech: project.tags, projectLinks: project.links };
  });
  const supportingProjects = existingProjects.filter(project => project.id !== "project-careerlift");
  const featuredNames = new Set(featured.map(project => project.name));
  const otherProjects = p.projects.items.filter(
    item => !featuredNames.has(item.name) && item !== research && item !== agent,
  );
  const professionalLinks = [
    { label: "GitHub", href: `https://github.com/${p.meta.githubUser}` },
    {
      label: "LinkedIn",
      href: p.contact.socials.find((item) => item.label === "LinkedIn")?.href,
    },
  ].filter((item) => item.href);
  const personalLinks = p.contact.socials.filter((item) =>
    ["Instagram", "Spotify", "USTA"].includes(item.label),
  );

  return `<a class="skip-link" href="#main">Skip to content</a>
    <header class="header"><a class="brand" href="#home" aria-label="Nima Jafari home"><span class="brand__symbol" aria-hidden="true">n<span>.</span></span><span>Nima Jafari</span></a>
      <nav class="desktop-nav" aria-label="Main navigation"><a href="#about">About</a><a href="#experience">Experience</a><a href="#projects">Work</a><a href="#research">Research</a><a href="#contact">Contact</a></nav>
      <div class="header__actions"><a class="button button--small" href="${safeHref(p.meta.resumeUrl)}">Resume ${down}</a><details class="mobile-menu"><summary aria-label="Navigation menu"><span></span><span></span></summary><nav aria-label="Mobile navigation"><a href="#about">About</a><a href="#experience">Experience</a><a href="#projects">Work</a><a href="#research">Research</a><a href="#contact">Contact</a></nav></details></div>
    </header>
    <main id="main">
      <section class="hero" id="home" aria-labelledby="hero-title">

        <div class="hero__content"><p class="eyebrow hero__role"><span class="status-dot" aria-hidden="true"></span>Software · AI · Machine learning · Robotics</p>
          <h1 id="hero-title">Nima<br><span>Jafari.</span></h1>
          <p class="hero__description">I’m a software engineer in Austin, Texas. My work spans web and mobile applications, AI systems, machine learning research, and robotics.</p>
          <div class="hero__actions"><a class="button button--primary" href="#projects">Explore my work ${arrow}</a><a class="text-link" href="mailto:${escapeHtml(p.meta.email)}">Let's talk ${arrow}</a></div>
          <div class="hero__identity"><img src="/assets/headshot.webp" width="46" height="46" alt="Nima Jafari"><div><strong>Nima Jafari</strong><span>Austin, Texas <span aria-hidden="true">·</span> Research & product engineering</span></div></div>
        </div>
        <div class="journey-stage">
        <div class="hero__visual" id="workbench"><picture class="scene-poster"><source media="(max-width: 767px)" srcset="/assets/editorial/software-800.webp"><img src="/assets/editorial/software-1400.webp" width="1400" height="781" alt="" fetchpriority="high"></picture><div class="scene-mount"></div><div class="scene-shade"></div></div>
        <div class="journey-caption" hidden><p class="eyebrow" id="journey-label"></p><h2 id="journey-title"></h2><p id="journey-description"></p><a class="text-link" id="journey-link" href="#projects">Project details ${arrow}</a></div>
        <div class="journey-progress" aria-hidden="true"><span></span></div>
        <div class="workbench-controls"><div class="workbench-topics" aria-label="Explore areas of work"><a class="topic is-active" href="#project-careerlift" data-topic="software">Software</a><a class="topic" href="#project-pocketpilot" data-topic="products">AI engineering</a><a class="topic" href="#project-hasse-clustering" data-topic="research">ML & research</a><a class="topic" href="#project-robotics" data-topic="robotics">Robotics</a></div></div>
        </div>
      </section>

      <section class="section about-section" id="about" aria-labelledby="about-title"><div class="about-portrait"><img src="/assets/headshot.webp" width="400" height="400" alt="Portrait of Nima Jafari" loading="lazy"><p>Austin, Texas <span aria-hidden="true">↗</span></p></div><div class="about-copy"><h2 id="about-title">About me</h2>${p.about.body.map((text) => `<p>${escapeHtml(text)}</p>`).join("")}<div class="education"><p class="eyebrow">Education</p><h3>B.S. Computer Science</h3><p>California State University, Northridge<br>May 2026 <span aria-hidden="true">·</span> 3.98 / 4.00 GPA</p></div><details class="about-details" id="honors"><summary>Honors, leadership & life outside code <span aria-hidden="true">+</span></summary><div><ul>${p.honors.honors.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>${p.honors.leadership.map((item) => `<h4>${escapeHtml(item.title)}</h4><p>${escapeHtml(item.note)}</p>`).join("")}<div class="personal-links">${links(personalLinks)}</div></div></details><details class="about-details" id="skills"><summary>Tools I work with <span aria-hidden="true">+</span></summary><div>${p.skills.groups.map((group) => `<h4>${escapeHtml(group.name)}</h4><p>${escapeHtml(group.items.join(" · "))}</p>`).join("")}</div></details></div></section>

      <section class="section experience-section" id="experience" aria-labelledby="experience-title"><div class="section-heading"><div><h2 id="experience-title">Experience</h2></div></div>
        <div class="timeline">${p.work.items
          .map(
            (item, index) =>
              `<article class="experience"><div class="experience__when"><span class="timeline-point" aria-hidden="true"></span>${escapeHtml(item.when)}</div><div class="experience__content"><p class="eyebrow">${escapeHtml(item.org)}</p><h3>${escapeHtml(item.role)}</h3><p class="experience__meta">${escapeHtml(item.meta)}</p><p>${escapeHtml(item.bullets[0])}</p>${
                item.bullets.length > 1
                  ? `<details><summary>More about this role <span aria-hidden="true">+</span></summary><ul>${item.bullets
                      .slice(1)
                      .map((bullet) => `<li>${escapeHtml(bullet)}</li>`)
                      .join("")}</ul></details>`
                  : ""
              }</div></article>`,
          )
          .join("")}</div>
      </section>

      <section class="section work-section" id="projects" aria-labelledby="work-title"><span id="work" class="anchor-alias"></span>
        <div class="section-heading"><div><h2 id="work-title">Selected projects</h2></div></div>
        <div class="project-grid">${featured.map(projectCard).join("")}</div>
        <details class="more-work"><summary>More projects <span>${otherProjects.length + supportingProjects.length} projects <span aria-hidden="true">+</span></span></summary><div class="project-grid">${supportingProjects.map(projectCard).join("")}</div><div class="project-list">${otherProjects.map((item) => `<article id="project-${slug(item.name)}"><div><p class="eyebrow">${escapeHtml(item.badge)}</p><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.desc)}</p>${tags(item.tags)}</div><div class="project-list__links">${links(item.links)}</div></article>`).join("")}</div></details>
      </section>

      <section class="section research-section" id="research" aria-labelledby="research-title"><div class="section-heading"><div><h2 id="research-title">Research & publications</h2></div><p>Reinforcement learning, motion analysis, and the structure hidden inside sequential data.</p></div>
        <div class="publications">${p.hero.featuredPublication.items.map((item, index) => `<article class="publication"><span class="publication__number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span><div><p class="eyebrow">${escapeHtml(item.label)}</p><h3><a href="${safeHref(item.href)}">${escapeHtml(item.title)} ${arrow}</a></h3><p>${escapeHtml(item.desc)}</p></div></article>`).join("")}</div>
      </section>

      <section class="section resume-section" id="resume" aria-labelledby="resume-title"><span id="cv" class="anchor-alias"></span><div><h2 id="resume-title">Resume</h2><p>Engineering roles, research, education, and technical skills in one place.</p></div><div class="resume-actions"><a class="button button--primary" href="${safeHref(p.meta.resumeUrl)}">Open resume ${arrow}</a><a class="text-link" href="${safeHref(p.meta.resumeUrl)}" download>Download PDF ${down}</a></div></section>

      <section class="section contact-section" id="contact" aria-labelledby="contact-title"><h2 id="contact-title">Contact</h2><a class="contact-email" href="mailto:${escapeHtml(p.meta.email)}">${escapeHtml(p.meta.email)} ${arrow}</a><div class="contact-links">${links(professionalLinks)}</div></section>
    </main>
    <footer class="footer"><a class="brand" href="#home">Nima Jafari <span aria-hidden="true">↗</span></a><p>Thoughtfully built. Always curious.</p><span>© ${new Date().getUTCFullYear()} Nima Jafari</span></footer>
    <script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "Person", name: p.meta.name, url: "https://nimajafaricomp.github.io/", jobTitle: "Software Engineer", sameAs: professionalLinks.map((link) => link.href) }).replace(/</g, "\\u003c")}</script>`;
}
