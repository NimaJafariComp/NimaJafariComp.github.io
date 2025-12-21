/* =========================================================
   Main interactive logic (Portfolio)
   ========================================================= */

(() => {
  const data = window.PORTFOLIO;
  if (!data) {
    console.error("Missing window.PORTFOLIO (content.js).");
    return;
  }

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const root = document.documentElement;
  const deck = $("#deck");
  const toastEl = $("#toast");
  const themeLabel = $("#themeLabel");
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  const state = {
    motionEnabled: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    vangoghBoost: false,
    theme: "night",
    pinnedMachine: null,
  };

  /* -----------------------------
     Small utils
     ----------------------------- */
  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("toast--show");
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => toastEl.classList.remove("toast--show"), 1500);
  }

  function clamp(v, a, b) {
    return Math.min(b, Math.max(a, v));
  }

  function prefersLight() {
    try {
      return window.matchMedia("(prefers-color-scheme: light)").matches;
    } catch {
      return false;
    }
  }

  /* -----------------------------
     Theme manager
     ----------------------------- */
  function setTheme(theme, { save = true, announce = true } = {}) {
    const t = (theme === "provence") ? "provence" : "night";
    state.theme = t;
    root.dataset.theme = t;

    const meta = data.themes?.[t];
    if (themeLabel && meta) themeLabel.textContent = meta.label;

    // Update theme button icon
    const btnTheme = $("#btnTheme");
    if (btnTheme && meta) {
      const icon = $(".btn__icon", btnTheme);
      if (icon) icon.textContent = meta.emoji;
      const lab = $(".btn__label", btnTheme);
      if (lab) lab.textContent = meta.label === "Starry Night" ? "Palette" : "Palette";
      btnTheme.setAttribute("aria-label", `Toggle theme (current: ${meta.label})`);
    }

    // Update browser UI color
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", t === "provence" ? "#f6f0d2" : "#0b1020");
    }

    if (save) {
      try { localStorage.setItem("theme", t); } catch {}
    }

    // Inform background
    sky?.setTheme?.(t);

    if (announce) {
      showToast(meta ? meta.label : (t === "provence" ? "Light" : "Dark"));
    }
  }

  function toggleTheme() {
    setTheme(state.theme === "night" ? "provence" : "night");
  }

  /* -----------------------------
     Motion manager
     ----------------------------- */
  function setMotion(enabled) {
    state.motionEnabled = !!enabled;
    root.style.setProperty("--motion", state.motionEnabled ? 1 : 0);
    const lab = $("#btnMotion .btn__label");
    if (lab) lab.textContent = state.motionEnabled ? "Motion" : "Still";

    if (state.motionEnabled) {
      sky?.start?.();
      nebula?.start?.();
      machinesFlight?.start?.();
      vinyl?.setVisualsEnabled?.(true);
    } else {
      sky?.stop?.(true);
      nebula?.stop?.(true);
      machinesFlight?.stop?.(true);
      vinyl?.setVisualsEnabled?.(false);
    }

    showToast(state.motionEnabled ? "Motion: on" : "Motion: off");
  }

  /* -----------------------------
     Sections + rendering
     ----------------------------- */
  function render() {
    renderHome($("#panel-home"));
    renderAbout($("#panel-about"));
    renderWork($("#panel-work"));
    renderMachines($("#panel-machines"));
    renderProjects($("#panel-projects"));
    renderSkills($("#panel-skills"));
    renderCV($("#panel-cv"));
    renderHonors($("#panel-honors"));
    renderContact($("#panel-contact"));
  }


  function renderHome(host) {
    if (!host) return;
    const m = data.meta;
    const hero = data.hero;

    const quoteHtml = (hero.quote && ((hero.quote.text || "").trim() || (hero.quote.note || "").trim())) ? `
          <div class="quote brush-card card-pad">
            <p class="p">${escapeHtml(hero.quote.text)}</p>
            <hr class="sep" />
            <p class="small">${escapeHtml(hero.quote.note)}</p>
          </div>` : "";

    host.innerHTML = `
      <div class="container grid grid--2">
        <div>
          <h1 class="h1">${escapeHtml(m.name)}</h1>
          <p class="kicker"><strong>${escapeHtml(hero.title)}</strong><br/>${escapeHtml(hero.subtitle)}</p>

          <div class="row">
            ${hero.highlightStats.map(s => `
              <span class="chip chip--accent"><span class="mono">${escapeHtml(s.value)}</span> ${escapeHtml(s.label)}</span>
            `).join("")}
          </div>

          ${quoteHtml}

          <div class="row">
            ${hero.ctas.map(btn => {
              if (btn.href) {
                return `<a class="btn btn--primary magnetic" href="${btn.href}" target="_blank" rel="noopener"><span class="btn__icon" aria-hidden="true">${escapeHtml(btn.icon)}</span><span class="btn__label">${escapeHtml(btn.label)}</span></a>`;
              }
              return `<button class="btn btn--primary magnetic" type="button" data-action="${btn.action}"><span class="btn__icon" aria-hidden="true">${escapeHtml(btn.icon)}</span><span class="btn__label">${escapeHtml(btn.label)}</span></button>`;
            }).join("")}
          </div>


        </div>

        <div>
          <div class="brush-card card-pad">
            <div class="sectionTitle">
              <div>
                <div class="h2" style="margin:0;">Portrait</div>
                <div class="small">Monochrome portrait — theme tint follows the sky.</div>
              </div>
              <button class="btn btn--ghost magnetic" type="button" data-action="toggleVangogh" title="Boost brush strokes (V)">
                <span class="btn__icon">🖌</span><span class="btn__label">Brush</span>
              </button>
            </div>

            <div class="portrait">
              <div class="portrait__img">
                <img src="${escapeHtml(m.headshotUrl)}" alt="Headshot" loading="lazy" />
              </div>
            </div>

            <hr class="sep" />

            <div class="grid grid--3" style="margin-top:10px;">
              <div class="brush-card card-pad" style="border-radius:16px;">
                <div class="small">Repos</div>
                <div class="h2 mono" id="ghRepos">—</div>
              </div>
              <div class="brush-card card-pad" style="border-radius:16px;">
                <div class="small">Followers</div>
                <div class="h2 mono" id="ghFollowers">—</div>
              </div>
              <div class="brush-card card-pad" style="border-radius:16px;">
                <div class="small">Following</div>
                <div class="h2 mono" id="ghFollowing">—</div>
              </div>
            </div>

            <div class="brush-card card-pad" style="border-radius:16px; margin-top:12px;">
              <div class="small">GitHub bio</div>
              <p class="p" id="ghBio">Loading…</p>
            </div>

            <div class="list" style="margin-top:14px;">
              <div class="item">
                <div class="item__dot"></div>
                <div class="item__body">
                  <p class="item__title">Location</p>
                  <p class="item__sub">${escapeHtml(m.location)}</p>
                </div>
              </div>

              <div class="item">
                <div class="item__dot"></div>
                <div class="item__body">
                  <p class="item__title">Email</p>
                  <p class="item__sub">
                    <button class="btn btn--ghost magnetic" type="button" data-action="copyEmail">
                      <span class="btn__icon">✉</span>
                      <span class="btn__label">${escapeHtml(m.email)}</span>
                    </button>
                  </p>
                </div>
              </div>
            </div>

            <div class="row" style="margin-top:14px;">
              <a class="btn btn--ghost magnetic" href="https://github.com/${escapeHtml(m.githubUser)}" target="_blank" rel="noopener"><span class="btn__icon">↗</span><span class="btn__label">Open GitHub</span></a>
              <button class="btn btn--ghost magnetic" type="button" data-action="jumpCV"><span class="btn__icon">⇩</span><span class="btn__label">Open CV</span></button>
            </div>
          </div>
        </div>
      </div>
    `;
  }


  function renderAbout(host) {
    if (!host) return;
    const a = data.about;

    host.innerHTML = `
      <div class="container grid grid--2">
        <div>
          <h2 class="h1" style="font-size:clamp(36px,5.2vw,56px);">About</h2>
          <p class="kicker">${a.body.map(p => escapeHtml(p)).join("<br/><br/>")}</p>

          <div class="row" style="margin-top: 18px;">
            ${a.interests.map(i => `<span class="chip">${escapeHtml(i)}</span>`).join("")}
          </div>
        </div>

        <div>
          <div class="brush-card card-pad">
            <div class="sectionTitle">
              <div>
                <div class="h2">Quick facts</div>
                <div class="small">The short version.</div>
              </div>
            </div>

            <hr class="sep" />

            <div class="list">
              ${a.quickFacts.map(f => `
                <div class="item">
                  <div class="item__dot"></div>
                  <div class="item__body">
                    <p class="item__title">${escapeHtml(f.k)}</p>
                    <p class="item__sub">${escapeHtml(f.v)}</p>
                  </div>
                </div>
              `).join("")}
            </div>

            <hr class="sep" />

            <div class="row">
              <button class="btn btn--ghost magnetic" type="button" data-action="toggleTheme"><span class="btn__icon">${escapeHtml(data.themes?.night?.emoji || "☾")}</span><span class="btn__label">Toggle theme</span></button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderWork(host) {
    if (!host) return;
    const w = data.work;

    host.innerHTML = `
      <div class="container">
        <div class="sectionTitle">
          <div>
            <h2 class="h1" style="font-size:clamp(34px,4.4vw,54px); margin:0;">${escapeHtml(w.title)}</h2>
            <div class="small">Research, building, shipping.</div>
          </div>
          <div class="sectionTitle__right small">Scroll → to drift to the next constellation</div>
        </div>

        <div class="stack" style="margin-top:16px;">
          ${w.items.map(it => `
            <article class="brush-card card-pad">
              <div class="workHead">
                <div>
                  <div class="h2" style="margin:0;">${escapeHtml(it.role)}</div>
                  <div class="small">${escapeHtml(it.org)} • <span class="mono">${escapeHtml(it.when)}</span></div>
                </div>
              </div>
              <hr class="sep"/>
              <ul class="bullets">
                ${it.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}
              </ul>
              ${it.links?.length ? `
                <div class="row" style="margin-top:12px;">
                  ${it.links.map(l => `<a class="btn btn--ghost magnetic" href="${escapeHtml(l.href)}" target="_blank" rel="noopener"><span class="btn__icon">↗</span><span class="btn__label">${escapeHtml(l.label)}</span></a>`).join("")}
                </div>
              ` : ""}
            </article>
          `).join("")}
        </div>
      </div>
    `;
  }


  function renderMachines(host) {
    if (!host) return;
    const t = data.machines;

    host.innerHTML = `
      <div class="container">
        <div class="sectionTitle">
          <div>
            <h2 class="h1" style="font-size:clamp(34px,4.4vw,54px); margin:0;">${escapeHtml(t.title)}</h2>
            <div class="small">${escapeHtml(t.subtitle)}</div>
          </div>
          <div class="sectionTitle__right">
            <span class="chip chip--accent">interactive timeline</span>
          </div>
        </div>

        <div class="flightIntro brush-card card-pad" style="margin-top:16px;">
          <div class="grid grid--2">
            <div>
              <div class="h2" style="margin-top:0;">Explore the timeline</div>
              <p class="p">Pan or drag the timeline, click a milestone for details.</p>
              <div class="row">
                <button class="btn btn--ghost magnetic" type="button" data-action="toggleTheme"><span class="btn__icon">${escapeHtml(data.themes?.night?.emoji || "☾")}</span><span class="btn__label">Switch theme</span></button>
              </div>
            </div>
            <div>
              <div class="brush-card card-pad" style="border-radius:18px;">
                <div class="small">Soundtrack</div>
                <div class="h2" style="margin:6px 0 0;">${escapeHtml(data.audio.title)}</div>
                <div class="small">${escapeHtml(data.audio.artist)} • ${escapeHtml(data.audio.note)}</div>
                <div class="row" style="margin-top:12px;">
                  <button class="btn btn--primary magnetic" type="button" data-action="toggleMusic"><span class="btn__icon">♪</span><span class="btn__label">Play / Pause</span></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="timelineStatic" id="timelineStatic" aria-label="Timeline">
          <div class="timelineStatic__inner brush-card" style="padding:20px; border-radius:18px;">
            <div class="timelineStatic__lead small">Major milestones — interactive timeline</div>
            <div class="timelineStatic__grid" id="timelineGrid">
              ${t.items.map(it => `
                <article class="timelineNode">
                  <div class="timelineNode__year mono">${escapeHtml(it.year)}</div>
                  <div class="timelineNode__title">${escapeHtml(it.title)}</div>
                  <div class="timelineNode__sub small">${escapeHtml(it.subtitle)}</div>
                  <p class="timelineNode__desc small">${escapeHtml(it.desc || "")}</p>
                </article>
              `).join("")}
            </div>
          </div>
        </div>

        <div class="brush-card card-pad" style="margin-top:16px;">
          <div class="sectionTitle">
            <div>
              <div class="h2" style="margin:0;">Milestones</div>
            </div>
          </div>

          <div class="milestoneList" id="milestoneGrid">
            ${t.items.map((it, i) => `
              <button class="milestone" type="button" data-milestone="${i}">
                <div class="milestone__year mono">${escapeHtml(it.year)}</div>
                <div class="milestone__title">${escapeHtml(it.title)}</div>
                <div class="milestone__sub small">${escapeHtml(it.subtitle)}</div>
              </button>
            `).join("")}
          </div>
        </div>
      </div>
    `;

    // -----------------------------
    // Timeline interactivity
    // -----------------------------
    const grid = host.querySelector('#timelineGrid');
    const nodeEls = Array.from(grid ? grid.querySelectorAll('.timelineNode') : []);
    const milestoneBtns = Array.from(host.querySelectorAll('.milestone'));

    // Create details panel
    let detailsEl = host.querySelector('.machinesDetails');
    if (!detailsEl) {
      detailsEl = document.createElement('div');
      detailsEl.className = 'machinesDetails';
      detailsEl.innerHTML = `
        <div class="machinesDetails__panel">
          <button class="machinesDetails__close btn btn--ghost" aria-label="Close">✕</button>
          <div class="machinesDetails__year"></div>
          <div class="machinesDetails__title"></div>
          <div class="machinesDetails__desc"></div>
        </div>
      `;
      host.appendChild(detailsEl);
    }

    const yearEl = detailsEl.querySelector('.machinesDetails__year');
    const titleEl = detailsEl.querySelector('.machinesDetails__title');
    const descEl = detailsEl.querySelector('.machinesDetails__desc');
    const closeBtn = detailsEl.querySelector('.machinesDetails__close');

    function centerNode(i) {
      const node = nodeEls[i];
      if (!node || !grid) return;
      const left = node.offsetLeft + node.offsetWidth / 2 - grid.clientWidth / 2;
      grid.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
      nodeEls.forEach(n => n.classList.toggle('is-active', n === node));
    }

    let _prevFocus = null;
    function pinNode(i) {
      const it = t.items[i];
      if (!it) return;
      nodeEls.forEach((n, idx) => n.classList.toggle('is-pinned', idx === i));
      yearEl.textContent = it.year;
      titleEl.textContent = it.title;
      descEl.textContent = it.desc || '';
      detailsEl.classList.add('is-open');
      detailsEl.setAttribute('aria-hidden', 'false');
      // move focus to close button for keyboard users, remember previous
      try { _prevFocus = document.activeElement; closeBtn?.focus(); } catch (e) {}
      history.replaceState(null, '', `#machines-${it.year}`);
      centerNode(i);
    }

    function unpin() {
      nodeEls.forEach(n => n.classList.remove('is-pinned'));
      detailsEl.classList.remove('is-open');
      detailsEl.setAttribute('aria-hidden', 'true');
      // restore focus
      try { if (_prevFocus && typeof _prevFocus.focus === 'function') _prevFocus.focus(); } catch (e) {}
      history.replaceState(null, '', ' ');
    }

    closeBtn?.addEventListener('click', (e) => { unpin(); e.preventDefault(); });

    // Close details on Escape and restore focus
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && detailsEl.classList.contains('is-open')) {
        unpin();
      }
    });

    // Click outside details to close (backdrop)
    let backdrop = detailsEl.querySelector('.machinesDetails__backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'machinesDetails__backdrop';
      detailsEl.insertBefore(backdrop, detailsEl.firstChild);
    }
    backdrop.addEventListener('click', () => unpin());

    // Make nodes keyboard-accessible and wire clicks
    nodeEls.forEach((n, i) => {
      n.setAttribute('tabindex', '0');
      n.setAttribute('role', 'button');
      n.dataset.idx = String(i);
      n.addEventListener('click', () => pinNode(i));
      n.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pinNode(i); }
        if (e.key === 'ArrowRight') { const nx = Math.min(nodeEls.length - 1, i + 1); nodeEls[nx].focus(); centerNode(nx); }
        if (e.key === 'ArrowLeft') { const nx = Math.max(0, i - 1); nodeEls[nx].focus(); centerNode(nx); }
      });
    });

    // Milestone quick buttons
    milestoneBtns.forEach(b => b.addEventListener('click', (e) => { const idx = Number(b.dataset.milestone); pinNode(idx); }));

    // Pointer drag-to-scroll
    let isDown = false; let startX = 0; let startScroll = 0;
    grid?.addEventListener('pointerdown', (e) => {
      isDown = true; grid.setPointerCapture(e.pointerId);
      startX = e.clientX; startScroll = grid.scrollLeft; grid.classList.add('is-dragging');
    });
    grid?.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      grid.scrollLeft = startScroll - dx;
    });
    grid?.addEventListener('pointerup', (e) => { isDown = false; try { grid.releasePointerCapture(e.pointerId); } catch{} grid.classList.remove('is-dragging'); });
    grid?.addEventListener('pointercancel', () => { isDown = false; grid.classList.remove('is-dragging'); });

    // Wheel to pan horizontally (and update center on scroll end)
    let _scrollTimer = null;
    grid?.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        e.preventDefault();
        grid.scrollLeft += e.deltaY;
      }
      if (_scrollTimer) clearTimeout(_scrollTimer);
      _scrollTimer = setTimeout(() => {
        // find the node nearest to center and set it active
        const center = grid.scrollLeft + grid.clientWidth / 2;
        let best = -1; let bestDist = Infinity;
        nodeEls.forEach((n, idx) => {
          const nodeCenter = n.offsetLeft + n.offsetWidth / 2;
          const d = Math.abs(nodeCenter - center);
          if (d < bestDist) { bestDist = d; best = idx; }
        });
        if (best >= 0) nodeEls.forEach((n, idx) => n.classList.toggle('is-active', idx === best));
      }, 140);
    }, { passive: false });

    // Deep link handler
    (function openFromHash() {
      const h = location.hash;
      if (!h) return;
      const m = h.match(/^#machines-(\d{3,4})$/);
      if (m) {
        const year = Number(m[1]);
        const idx = t.items.findIndex(x => x.year === year);
        if (idx >= 0) {
          // open after a short timeout so grid has measured
          setTimeout(() => { pinNode(idx); }, 220);
        }
      }
    })();

  }


  function renderProjects(host) {
    if (!host) return;
    const p = data.projects;

    host.innerHTML = `
      <div class="container">
        <div class="sectionTitle">
          <div>
            <h2 class="h1" style="font-size:clamp(34px,4.4vw,54px); margin:0;">${escapeHtml(p.title)}</h2>
            <div class="small">${escapeHtml(p.note)}</div>
          </div>
          <div class="sectionTitle__right">
            <span class="chip">tilt + glow</span>
            <span class="chip">magnetic buttons</span>
          </div>
        </div>

        <div class="cards" style="margin-top:16px;">
          ${p.items.map(pr => `
            <article class="card tilt brush-card" tabindex="0">
              <div class="card__top">
                <div>
                  <div class="card__title">${escapeHtml(pr.name)}</div>
                  <div class="card__badge">${escapeHtml(pr.badge)}</div>
                </div>
                <div class="card__links">
                  ${pr.links.map(l => {
                    const icon = l.kind === "github" ? "" : "↗";
                    return `<a class="btn btn--ghost magnetic" href="${escapeHtml(l.href)}" target="_blank" rel="noopener"><span class="btn__icon" aria-hidden="true">${escapeHtml(icon)}</span><span class="btn__label">${escapeHtml(l.title)}</span></a>`;
                  }).join("")}
                </div>
              </div>

              <p class="p">${escapeHtml(pr.desc)}</p>

              <div class="row" style="margin-top:12px;">
                ${pr.tags.map(t => `<span class="chip">${escapeHtml(t)}</span>`).join("")}
              </div>
            </article>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderSkills(host) {
    if (!host) return;
    const s = data.skills;

    host.innerHTML = `
      <div class="container">
        <div class="sectionTitle">
          <div>
            <h2 class="h1" style="font-size:clamp(34px,4.4vw,54px); margin:0;">${escapeHtml(s.title)}</h2>
            <div class="small">${escapeHtml(s.note)}</div>
          </div>
          <div class="sectionTitle__right">
            <span class="chip">static</span>
          </div>
        </div>

        <div class="grid grid--2" style="margin-top:16px;">
          <div>
            ${s.groups.map(g => `
              <div class="brush-card card-pad" style="margin-bottom:14px;">
                <div class="h2" style="margin:0;">${escapeHtml(g.name)}</div>
                <div class="row" style="margin-top:12px;">
                  ${g.items.map(it => `<span class="chip ${g.tone === "accent" ? "chip--accent" : ""}">${escapeHtml(it)}</span>`).join("")}
                </div>
              </div>
            `).join("")}
          </div>

          <div>
            <div class="brush-card card-pad" style="height:100%; min-height: 320px;">
              <div class="sectionTitle">
                <div>
                  <div class="h2" style="margin:0;">All skills</div>
                  <div class="small">Click a tag to copy it to clipboard.</div>
                </div>
              </div>
              <hr class="sep"/>
              <div class="skill-list" id="skillList" aria-label="All skills">
                ${s.groups.map(g => g.items.map(it => `<button class="chip skill-chip ${g.tone === "accent" ? "chip--accent" : ""}" type="button" data-action="copySkill" data-skill="${escapeHtml(it)}" title="Click to copy">${escapeHtml(it)}</button>`).join("")).join("")}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderCV(host) {
    if (!host) return;
    const c = data.cv;
    const m = data.meta;

    host.innerHTML = `
      <div class="container">
        <div class="sectionTitle">
          <div>
            <h2 class="h1" style="font-size:clamp(34px,4.4vw,54px); margin:0;">${escapeHtml(c.title)}</h2>
            <div class="small">${escapeHtml(c.subtitle)}</div>
          </div>
          <div class="sectionTitle__right">
            <a class="btn btn--primary magnetic" href="${escapeHtml(m.resumeUrl)}" download>
              <span class="btn__icon" aria-hidden="true">⇩</span>
              <span class="btn__label">Download</span>
            </a>
            <a class="btn btn--ghost magnetic" href="${escapeHtml(m.resumeUrl)}" target="_blank" rel="noopener">
              <span class="btn__icon" aria-hidden="true">↗</span>
              <span class="btn__label">Open</span>
            </a>
          </div>
        </div>

        <div class="brush-card card-pad" style="margin-top:16px;">
          <div class="small">Embedded PDF</div>
          <iframe class="pdfFrame" src="${escapeHtml(m.resumeUrl)}#view=FitH" title="Nima Jafari CV (PDF)"></iframe>
          <div class="small" style="margin-top:10px;">Public version has the phone number removed. If you want a different redaction, update the PDF in <span class="mono">assets/</span>.</div>
        </div>
      </div>
    `;
  }

  function renderHonors(host) {
    if (!host) return;
    const h = data.honors;

    host.innerHTML = `
      <div class="container grid grid--2">
        <div>
          <h2 class="h1" style="font-size:clamp(34px,4.4vw,54px);">${escapeHtml(h.title)}</h2>

          <div class="brush-card card-pad">
            <div class="h2" style="margin:0;">Honors</div>
            <hr class="sep"/>
            <ul class="bullets">
              ${h.honors.map(x => `<li>${escapeHtml(x)}</li>`).join("")}
            </ul>
          </div>
        </div>

        <div>
          <div class="brush-card card-pad">
            <div class="h2" style="margin:0;">Leadership & service</div>
            <hr class="sep"/>
            <div class="stack">
              ${h.leadership.map(it => `
                <div class="brush-card card-pad" style="border-radius:16px;">
                  <div class="h2" style="font-size:18px; margin:0;">${escapeHtml(it.title)}</div>
                  <div class="small"><span class="mono">${escapeHtml(it.when)}</span></div>
                  <div class="p" style="margin-top:8px;">${escapeHtml(it.note)}</div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderContact(host) {
    if (!host) return;
    const c = data.contact;

    host.innerHTML = `
      <div class="container grid grid--2">
        <div>
          <h2 class="h1" style="font-size:clamp(34px,4.4vw,54px);">${escapeHtml(c.title)}</h2>
          <p class="kicker">${escapeHtml(c.note)}</p>

          <div class="brush-card card-pad" style="margin-top:16px;">
            <div class="h2" style="margin:0;">Shortcut</div>
            <hr class="sep"/>
            <div class="row">
              <button class="btn btn--primary magnetic" type="button" data-action="copyEmail"><span class="btn__icon">✉</span><span class="btn__label">Copy email</span></button>
            </div>
          </div>
        </div>

        <div>
          <div class="brush-card card-pad">
            <div class="h2" style="margin:0;">Links</div>
            <hr class="sep"/>
            <div class="list">
              ${c.socials.map(s => `
                <div class="item">
                  <div class="item__dot"></div>
                  <div class="item__body">
                    <p class="item__title">${escapeHtml(s.label)}</p>
                    <p class="item__sub"><a href="${escapeHtml(s.href)}" target="_blank" rel="noopener">${escapeHtml(s.href)}</a></p>
                  </div>
                </div>
              `).join("")}
            </div>

            <hr class="sep"/>

            <div class="small">
              Keys: <span class="mono">M</span> music • <span class="mono">T</span> theme • <span class="mono">V</span> brush
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* -----------------------------
     Constellation nav + scrolling
     ----------------------------- */
  const sections = $$(".panel").map((p) => ({
    id: p.dataset.section,
    label: p.dataset.label || (p.dataset.section || "").replace(/^\w/, (m) => m.toUpperCase()),
    el: p
  }));

  function buildConstellationNav() {
    const dots = $("#constellationDots");
    if (!dots) return;

    dots.innerHTML = sections.map((s) => `
      <li>
        <button class="constellation__dot magnetic" type="button" data-jump="${escapeHtml(s.id)}" aria-label="${escapeHtml(s.label)}">
          <span class="constellation__label">${escapeHtml(s.label)}</span>
        </button>
      </li>
    `).join("");

    dots.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-jump]");
      if (!btn) return;
      jumpTo(btn.dataset.jump);
    });

    window.addEventListener("resize", drawLines);
    setTimeout(drawLines, 120);
  }

  function drawLines() {
    const svg = $("#constellationLines");
    const nav = $("#constellationNav");
    if (!svg || !nav) return;
    const buttons = $$("[data-jump]", nav);

    const navRect = nav.getBoundingClientRect();
    const pts = buttons.map((b) => {
      const r = b.getBoundingClientRect();
      return { x: (r.left + r.width / 2) - navRect.left, y: (r.top + r.height / 2) - navRect.top };
    });

    svg.setAttribute("viewBox", `0 0 ${navRect.width} ${navRect.height}`);
    svg.innerHTML = "";

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
      <linearGradient id="lineGrad" x1="0" y1="0" x2="${navRect.width}" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="rgba(255,255,255,.0)"/>
        <stop offset=".25" stop-color="rgba(255,255,255,.35)"/>
        <stop offset=".6" stop-color="rgba(255,255,255,.28)"/>
        <stop offset="1" stop-color="rgba(255,255,255,.0)"/>
      </linearGradient>
    `;
    svg.appendChild(defs);

    for (let i = 0; i < pts.length - 1; i++) {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", pts[i].x);
      line.setAttribute("y1", pts[i].y);
      line.setAttribute("x2", pts[i + 1].x);
      line.setAttribute("y2", pts[i + 1].y);
      line.setAttribute("stroke", "url(#lineGrad)");
      line.setAttribute("stroke-width", "2");
      line.setAttribute("stroke-linecap", "round");
      line.setAttribute("opacity", "0.65");
      svg.appendChild(line);
    }
  }

  function jumpTo(sectionId) {
    const idx = sections.findIndex(s => s.id === sectionId);
    if (idx < 0) return;
    const target = sections[idx].el;
    const left = target ? target.offsetLeft : idx * window.innerWidth;
    deck.scrollTo({ left, behavior: "smooth" });

    // Auto-collapse the vinyl player a short time after navigation (helps keep content visible)
    try { vinyl?.scheduleAutoCollapse?.(900); } catch (e) {}
  }

  function jumpRelative(delta) {
    const idx = getActiveIndex();
    const next = Math.max(0, Math.min(sections.length - 1, idx + delta));
    jumpTo(sections[next].id);
  }

  function getActiveIndex() {
    const left = deck.scrollLeft;
    return Math.round(left / deck.clientWidth);
  }

  // Wheel = vertical inside panel, but drift horizontally when at edges
  // To avoid accidental tab switches when the user reaches the bottom/top of a panel,
  // require a small accumulated extra scroll (threshold) before initiating horizontal drift
  const _wheelState = { el: null, acc: 0, dir: 0, threshold: 80 };

  deck.addEventListener("wheel", (e) => {
    const inner = e.target.closest(".panel__inner");
    if (!inner) {
      e.preventDefault();
      deck.scrollBy({ left: e.deltaY, behavior: "auto" });
      return;
    }

    const canScroll = inner.scrollHeight > inner.clientHeight + 2;
    const atTop = inner.scrollTop <= 0;
    const atBottom = inner.scrollTop + inner.clientHeight >= inner.scrollHeight - 1;
    const goingDown = e.deltaY > 0;

    const wantHorizontal = e.shiftKey || !canScroll || (goingDown && atBottom) || (!goingDown && atTop);

    if (!wantHorizontal) {
      // If the user is scrolling inside the content area, reset any accumulated state
      if (_wheelState.el === inner) { _wheelState.acc = 0; _wheelState.el = null; _wheelState.dir = 0; }
      return; // let inner scroll normally
    }

    // Candidate for horizontal drift
    e.preventDefault();

    // If the inner can't scroll at all, immediately drift horizontally
    if (!canScroll) {
      deck.scrollBy({ left: e.deltaY, behavior: "smooth" });
      return;
    }

    // If we are at the edge and the panel CAN scroll, require extra gesture (accumulation)
    const dir = goingDown ? 1 : -1;
    if (_wheelState.el !== inner || _wheelState.dir !== dir) {
      _wheelState.el = inner;
      _wheelState.dir = dir;
      _wheelState.acc = 0;
    }

    _wheelState.acc += Math.abs(e.deltaY);

    // If the accumulated delta is below the threshold, don't drift yet (but prevent default)
    if (_wheelState.acc < _wheelState.threshold) {
      // optional: small subtle hint could be shown here
      return;
    }

    // Otherwise perform a smooth horizontal drift and reset accumulator
    deck.scrollBy({ left: dir * Math.max(160, _wheelState.acc), behavior: "smooth" });
    _wheelState.acc = 0;
    _wheelState.el = null;
    _wheelState.dir = 0;

  }, { passive: false });

  // Reset accumulator if user scrolls the inner panel (we don't want stale accumulation)
  $$(".panel__inner").forEach(inner => {
    inner.addEventListener("scroll", () => {
      if (_wheelState.el === inner) {
        _wheelState.acc = 0; _wheelState.el = null; _wheelState.dir = 0;
      }
    });
  });

  // Highlight current nav dot
  const obs = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    const id = visible.target.dataset.section;
    const nav = $("#constellationNav");
    if (!nav) return;
    $$("[data-jump]", nav).forEach(btn =>
      btn.setAttribute("aria-current", btn.dataset.jump === id ? "true" : "false")
    );
  }, { root: deck, threshold: [0.55, 0.7] });

  $$(".panel").forEach(p => obs.observe(p));

  /* -----------------------------
     Actions
     ----------------------------- */
  async function copyEmail() {
    const email = data.meta.email;
    try {
      await navigator.clipboard.writeText(email);
      showToast("Email copied");
    } catch {
      showToast(email);
      window.prompt("Copy email:", email);
    }
  }

  async function copySkill(text) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      showToast(`Copied: ${text}`);
    } catch {
      showToast(text);
    }
  }

  function toggleVangogh() {
    state.vangoghBoost = !state.vangoghBoost;
    const disp = document.querySelector("#brush feDisplacementMap");
    if (disp) disp.setAttribute("scale", state.vangoghBoost ? "15" : "7");
    showToast(state.vangoghBoost ? "Brush: boosted" : "Brush: normal");
  }

  function attachActions() {
    document.body.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const act = btn.dataset.action;

      if (act === "copyEmail") return copyEmail();
      if (act === "copySkill") return copySkill(btn.dataset.skill || (btn.textContent || "").trim());
      if (act === "toggleMotion") return setMotion(!state.motionEnabled);
      if (act === "toggleVangogh") return toggleVangogh();
      if (act === "toggleTheme") return toggleTheme();
      if (act === "toggleMusic") return vinyl?.togglePlay?.();
      if (act === "jumpMachines") return jumpTo("machines");
      if (act === "jumpCV") return jumpTo("cv");
    });

    $("#btnMotion")?.addEventListener("click", () => setMotion(!state.motionEnabled));
    $("#btnTheme")?.addEventListener("click", toggleTheme);
    $("#btnCV")?.addEventListener("click", () => jumpTo("cv"));
    $("#btnMusic")?.addEventListener("click", () => vinyl?.togglePlay?.());
  }

  // Keyboard navigation + shortcuts
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") return jumpRelative(1);
    if (e.key === "ArrowLeft") return jumpRelative(-1);

    const k = e.key.toLowerCase();
    if (k === "v") return toggleVangogh();
    if (k === "t") return toggleTheme();
    if (k === "m") return vinyl?.togglePlay?.();
  });

  /* -----------------------------
     Magnetic buttons
     ----------------------------- */
  function attachMagnetic() {
    const strength = 0.22;
    const elems = $$(".magnetic");

    elems.forEach((el) => {
      const set = (x, y) => {
        el.style.setProperty("--magx", `${x}px`);
        el.style.setProperty("--magy", `${y}px`);
      };

      el.addEventListener("pointermove", (ev) => {
        const r = el.getBoundingClientRect();
        const dx = (ev.clientX - (r.left + r.width / 2)) * strength;
        const dy = (ev.clientY - (r.top + r.height / 2)) * strength;
        set(dx, dy);
      });

      el.addEventListener("pointerleave", () => set(0, 0));
      el.addEventListener("blur", () => set(0, 0));
    });
  }

  /* -----------------------------
     Tilt cards
     ----------------------------- */
  function attachTilt() {
    const cards = $$(".tilt");
    cards.forEach((card) => {
      card.addEventListener("pointermove", (ev) => {
        if (!state.motionEnabled) return;
        const r = card.getBoundingClientRect();
        const px = (ev.clientX - r.left) / r.width;
        const py = (ev.clientY - r.top) / r.height;
        const ry = (px - 0.5) * 10;
        const rx = -(py - 0.5) * 10;
        card.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
        card.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
        card.style.setProperty("--hx", `${(px * 100).toFixed(2)}%`);
        card.style.setProperty("--hy", `${(py * 100).toFixed(2)}%`);
      });

      const reset = () => {
        card.style.setProperty("--rx", `0deg`);
        card.style.setProperty("--ry", `0deg`);
        card.style.setProperty("--hx", `50%`);
        card.style.setProperty("--hy", `50%`);
      };

      card.addEventListener("pointerleave", reset);
      card.addEventListener("blur", reset);
    });
  }

  /* -----------------------------
     GitHub stats
     ----------------------------- */
  async function loadGitHubStats() {
    const user = data.meta.githubUser;
    if (!user) return;

    try {
      const res = await fetch(`https://api.github.com/users/${user}`, {
        headers: { "Accept": "application/vnd.github+json" }
      });
      if (!res.ok) throw new Error(`GitHub API ${res.status}`);
      const j = await res.json();

      const set = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = String(val);
      };

      set("ghRepos", j.public_repos);
      set("ghFollowers", j.followers);
      set("ghFollowing", j.following);
      set("ghBio", j.bio || "—");
    } catch (err) {
      console.warn("GitHub stats failed", err);
    }
  }

  /* Command palette removed */

  /* -----------------------------
     Van Gogh background (canvas)
     ----------------------------- */
  class VanGoghSky {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d", { alpha: true });
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.w = 0;
      this.h = 0;
      this.running = false;
      this.t = 0;

      this.pointer = { x: 0, y: 0, active: false };

      // Theme mixing: 0 = night, 1 = provence
      this.mix = 0;
      this.targetMix = 0;

      this.palNight = [
        [11, 42, 111],
        [20, 71, 166],
        [29, 111, 224],
        [255, 212, 90],
        [240, 185, 79],
        [255, 125, 74],
        [11, 43, 42],
      ];

      this.palDay = [
        [43, 60, 122],
        [47, 99, 182],
        [74, 163, 217],
        [246, 196, 79],
        [215, 154, 42],
        [232, 107, 58],
        [47, 107, 63],
      ];

      this.fillNight = [7, 9, 19];
      this.fillDay = [246, 240, 210];

      this.stars = [];
      this.particles = [];

      this.resize();
      this.seed();

      window.addEventListener("resize", () => {
        this.resize();
        this.seed();
      });

      window.addEventListener("pointermove", (e) => {
        this.pointer.x = e.clientX;
        this.pointer.y = e.clientY;
        this.pointer.active = true;
      });

      window.addEventListener("pointerleave", () => {
        this.pointer.active = false;
      });
    }

    setTheme(theme) {
      this.targetMix = (theme === "provence") ? 1 : 0;
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      this.w = Math.floor(rect.width * this.dpr);
      this.h = Math.floor(rect.height * this.dpr);
      this.canvas.width = this.w;
      this.canvas.height = this.h;
    }

    rand(a = 1) { return Math.random() * a; }

    lerp(a, b, t) { return a + (b - a) * t; }

    smooth(t) { return t * t * (3 - 2 * t); }

    mixRGB(a, b, t) {
      return [
        Math.round(this.lerp(a[0], b[0], t)),
        Math.round(this.lerp(a[1], b[1], t)),
        Math.round(this.lerp(a[2], b[2], t)),
      ];
    }

    color(i) {
      const a = this.palNight[i % this.palNight.length];
      const b = this.palDay[i % this.palDay.length];
      const c = this.mixRGB(a, b, this.mix);
      return c;
    }

    hash(ix, iy) {
      const s = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453123;
      return s - Math.floor(s);
    }

    noise2(x, y) {
      const ix = Math.floor(x), iy = Math.floor(y);
      const fx = x - ix, fy = y - iy;

      const a = this.hash(ix, iy);
      const b = this.hash(ix + 1, iy);
      const c = this.hash(ix, iy + 1);
      const d = this.hash(ix + 1, iy + 1);

      const u = this.smooth(fx);
      const v = this.smooth(fy);

      return this.lerp(this.lerp(a, b, u), this.lerp(c, d, u), v);
    }

    flowAngle(x, y, t) {
      const nx = x / this.w;
      const ny = y / this.h;

      // Swirl center shifts with theme
      const cx = nx - this.lerp(0.58, 0.42, this.mix);
      const cy = ny - this.lerp(0.35, 0.55, this.mix);
      const r = Math.sqrt(cx * cx + cy * cy) + 1e-6;

      const swirlStrength = this.lerp(5.2, 2.8, this.mix);
      const swirl = Math.atan2(cy, cx) + r * swirlStrength;

      const n = this.noise2(nx * 3.2 + t * 0.08, ny * 3.2 + t * 0.06);
      const noiseStrength = this.lerp(4.0, 2.4, this.mix);
      const drift = (n - 0.5) * noiseStrength;

      // Add a gentle "wind" direction in the Provence theme
      const wind = this.mix * (Math.sin(t * 0.12) * 0.6 + 0.2);

      return swirl + drift + wind;
    }

    seed() {
      const starCount = Math.floor((this.w * this.h) / (28000 * this.dpr));
      this.stars = Array.from({ length: Math.max(70, starCount) }, () => ({
        x: this.rand(this.w),
        y: this.rand(this.h),
        r: this.rand(1.6 * this.dpr) + 0.4 * this.dpr,
        tw: this.rand(1),
        a: this.rand(0.65) + 0.2,
      }));

      const pCount = Math.floor((this.w * this.h) / (20000 * this.dpr));
      this.particles = Array.from({ length: Math.max(320, pCount) }, () => this.makeParticle(true));

      // Initial paint wash
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.w, this.h);
      const fill = this.mixRGB(this.fillNight, this.fillDay, this.mix);
      ctx.fillStyle = `rgba(${fill[0]},${fill[1]},${fill[2]},1)`;
      ctx.fillRect(0, 0, this.w, this.h);
    }

    makeParticle(randomPos = false) {
      const x = randomPos ? this.rand(this.w) : this.pointer.x * this.dpr;
      const y = randomPos ? this.rand(this.h) : this.pointer.y * this.dpr;
      const depth = this.rand(1);
      return {
        x, y,
        px: x, py: y,
        depth,
        hue: Math.floor(this.rand(this.palNight.length)),
        life: 140 + this.rand(240),
      };
    }

    drawStars(ctx) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      const star = this.mixRGB([255, 212, 90], [255, 246, 210], this.mix);

      for (const s of this.stars) {
        const tw = 0.25 + 0.75 * Math.abs(Math.sin(this.t * 0.6 + s.tw * 6.28));
        const a = s.a * tw;
        ctx.fillStyle = `rgba(${star[0]},${star[1]},${star[2]},${a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * (0.8 + tw), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    step = () => {
      if (!this.running) return;

      // Smooth theme blending
      this.mix = this.lerp(this.mix, this.targetMix, 0.03);

      const ctx = this.ctx;

      // Slight fade for trails
      ctx.globalCompositeOperation = "source-over";
      const fill = this.mixRGB(this.fillNight, this.fillDay, this.mix);
      const fadeAlpha = this.lerp(0.10, 0.14, this.mix);
      ctx.fillStyle = `rgba(${fill[0]},${fill[1]},${fill[2]},${fadeAlpha})`;
      ctx.fillRect(0, 0, this.w, this.h);

      this.drawStars(ctx);

      // Paint strokes
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const ptrx = this.pointer.x * this.dpr;
      const ptry = this.pointer.y * this.dpr;

      for (const p of this.particles) {
        p.life -= 1;
        if (p.life <= 0 || p.x < -50 || p.x > this.w + 50 || p.y < -50 || p.y > this.h + 50) {
          Object.assign(p, this.makeParticle(true));
          continue;
        }

        p.px = p.x; p.py = p.y;

        const ang = this.flowAngle(p.x, p.y, this.t);
        const speed = (0.55 + p.depth * 1.35) * this.dpr;
        p.x += Math.cos(ang) * speed;
        p.y += Math.sin(ang) * speed;

        if (this.pointer.active) {
          const dx = p.x - ptrx;
          const dy = p.y - ptry;
          const dist = Math.sqrt(dx * dx + dy * dy) + 1e-6;
          const influence = Math.max(0, 1 - dist / (220 * this.dpr));
          p.x += (dx / dist) * influence * 0.8;
          p.y += (dy / dist) * influence * 0.8;
        }

        const c = this.color(p.hue);
        const alpha = this.lerp(0.06, 0.10, this.mix) + p.depth * 0.10;
        const lw = (0.7 + p.depth * this.lerp(2.4, 3.0, this.mix)) * this.dpr;

        ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${alpha})`;
        ctx.lineWidth = lw;

        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }

      this.t += 0.016;
      requestAnimationFrame(this.step);
    }

    start() {
      if (this.running) return;
      this.running = true;
      requestAnimationFrame(this.step);
    }

    stop(drawStatic = false) {
      this.running = false;
      if (drawStatic) {
        const ctx = this.ctx;
        ctx.globalCompositeOperation = "source-over";
        const fill = this.mixRGB(this.fillNight, this.fillDay, this.mix);
        ctx.fillStyle = `rgba(${fill[0]},${fill[1]},${fill[2]},1)`;
        ctx.fillRect(0, 0, this.w, this.h);
        this.drawStars(ctx);
      }
    }
  }

  const sky = new VanGoghSky($("#sky"));

  /* -----------------------------
     Skill nebula animation
     ----------------------------- */
  class SkillNebula {
    constructor() {
      this.stage = null;
      this.tags = [];
      this.pointer = { x: 0, y: 0, active: false };
      this.running = false;
      this.w = 0;
      this.h = 0;

      window.addEventListener("resize", () => this.measure());
    }

    mount(stage) {
      this.stage = stage;
      this.measure();
      this.makeTags();

      stage.addEventListener("pointermove", (e) => {
        const r = stage.getBoundingClientRect();
        this.pointer.x = e.clientX - r.left;
        this.pointer.y = e.clientY - r.top;
        this.pointer.active = true;
      });
      stage.addEventListener("pointerleave", () => this.pointer.active = false);

      stage.addEventListener("click", async (e) => {
        const tag = e.target.closest(".nebula__tag");
        if (!tag) return;
        const text = tag.textContent || "";
        try {
          await navigator.clipboard.writeText(text);
          showToast(`Copied: ${text}`);
        } catch {
          showToast(text);
        }
      });
    }

    measure() {
      if (!this.stage) return;
      const r = this.stage.getBoundingClientRect();
      this.w = r.width;
      this.h = r.height;
    }

    makeTags() {
      if (!this.stage) return;
      this.stage.innerHTML = "";

      const groups = data.skills.groups;
      const items = groups.flatMap(g => g.items.map(label => ({ label, group: g.name })));

      const count = Math.min(items.length, 110);
      const picked = items.slice(0, count);

      this.tags = picked.map((it) => {
        const el = document.createElement("div");
        el.className = "nebula__tag";
        el.textContent = it.label;
        el.title = it.group;
        this.stage.appendChild(el);

        return {
          el,
          x: Math.random() * this.w,
          y: Math.random() * this.h,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          mass: 0.8 + Math.random() * 1.8,
        };
      });

      this.shuffle(false);
    }

    shuffle(announce = true) {
      this.tags.forEach(t => {
        t.x = Math.random() * this.w;
        t.y = Math.random() * this.h;
        t.vx = (Math.random() - 0.5) * 1.2;
        t.vy = (Math.random() - 0.5) * 1.2;
        t.el.style.left = `${t.x}px`;
        t.el.style.top = `${t.y}px`;
      });
      if (announce) showToast("Nebula shuffled");
    }

    step = () => {
      if (!this.running || !this.stage) return;

      const friction = 0.985;
      const bounce = 0.9;

      for (const t of this.tags) {
        if (this.pointer.active) {
          const dx = t.x - this.pointer.x;
          const dy = t.y - this.pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
          const influence = Math.max(0, 1 - dist / 180);
          t.vx += (dx / dist) * influence * 0.35 / t.mass;
          t.vy += (dy / dist) * influence * 0.35 / t.mass;
        }

        t.x += t.vx;
        t.y += t.vy;
        t.vx *= friction;
        t.vy *= friction;

        if (t.x < 0) { t.x = 0; t.vx = Math.abs(t.vx) * bounce; }
        if (t.y < 0) { t.y = 0; t.vy = Math.abs(t.vy) * bounce; }
        if (t.x > this.w) { t.x = this.w; t.vx = -Math.abs(t.vx) * bounce; }
        if (t.y > this.h) { t.y = this.h; t.vy = -Math.abs(t.vy) * bounce; }

        t.el.style.left = `${t.x}px`;
        t.el.style.top = `${t.y}px`;
      }

      requestAnimationFrame(this.step);
    }

    start() {
      if (this.running) return;
      this.running = true;
      requestAnimationFrame(this.step);
    }

    stop() {
      this.running = false;
    }
  }

  const nebula = new SkillNebula();

  /* -----------------------------
     Machines flight (scroll-driven)
     ----------------------------- */
  class MachinesFlight {
    constructor({ panelInner, scrollEl, sceneEl, nodesEl, canvasEl, hud }) {
      this.panelInner = panelInner;
      this.scrollEl = scrollEl;
      this.sceneEl = sceneEl;
      this.nodesEl = nodesEl;
      this.canvas = canvasEl;
      this.ctx = canvasEl?.getContext?.("2d") || null;
      this.hud = hud;

      this.items = data.machines.items;

      this.nodes = [];
      this.running = false;
      this.lastActiveIndex = -1;
      this.pinned = null;

      this.pointer = { x: 0, y: 0, active: false };
      this.parallax = { x: 0, y: 0 };

      this.perspective = 1400;
      this.spacing = 520;
      this.totalDepth = this.spacing * (this.items.length); // because first node starts at -spacing

      this.onScroll = this.onScroll.bind(this);
      this.onResize = this.onResize.bind(this);

      this.anim = this.anim.bind(this);

      this.build();
      this.measure();

      this.panelInner?.addEventListener("scroll", this.onScroll, { passive: true });
      window.addEventListener("resize", this.onResize);

      this.sceneEl?.addEventListener("pointermove", (e) => {
        const r = this.sceneEl.getBoundingClientRect();
        this.pointer.x = e.clientX - r.left;
        this.pointer.y = e.clientY - r.top;
        this.pointer.active = true;
      });
      this.sceneEl?.addEventListener("pointerleave", () => this.pointer.active = false);

      // Milestone jump buttons
      const grid = $("#milestoneGrid");
      grid?.addEventListener("click", (e) => {
        const b = e.target.closest("[data-milestone]");
        if (!b) return;
        const idx = Number(b.dataset.milestone);
        this.scrollToIndex(idx);
      });

      // Unpin
      $("#flightUnpin")?.addEventListener("click", () => {
        this.pinned = null;
        showToast("Unpinned");
      });
    }

    seedRand(seed) {
      // Mulberry32
      let t = seed >>> 0;
      return () => {
        t += 0x6D2B79F5;
        let r = Math.imul(t ^ (t >>> 15), 1 | t);
        r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
      };
    }

    build() {
      if (!this.nodesEl) return;
      this.nodesEl.innerHTML = "";

      // Make the scroll path tall enough
      const vh = 180 + this.items.length * 30;
      if (this.scrollEl) this.scrollEl.style.height = `${vh}vh`;

      const baseW = 560;
      const baseH = 320;

      this.nodes = this.items.map((it, i) => {
        const rand = this.seedRand(it.year * 97 + i * 13);

        const x = (rand() - 0.5) * baseW * 1.15;
        const y = (rand() - 0.5) * baseH * 1.15;
        const z = -this.spacing * (i + 1);

        const el = document.createElement("button");
        el.className = "machineNode magnetic";
        el.type = "button";
        el.innerHTML = `
          <span class="machineNode__star" aria-hidden="true"></span>
          <span class="machineNode__card">
            <span class="machineNode__year mono">${escapeHtml(it.year)}</span>
            <span class="machineNode__title">${escapeHtml(it.title)}</span>
            <span class="machineNode__sub small">${escapeHtml(it.subtitle)}</span>
          </span>
        `;

        el.addEventListener("click", () => {
          this.pinned = i;
          this.updateHUD(i, { pinned: true });
          showToast(`Pinned: ${it.year}`);
        });

        this.nodesEl.appendChild(el);

        return { i, it, el, x, y, z };
      });

      // Draw initial transforms
      for (const n of this.nodes) {
        n.el.style.transform = `translate3d(${n.x}px, ${n.y}px, ${n.z}px) translate(-50%, -50%)`;
      }
    }

    measure() {
      if (!this.sceneEl || !this.canvas) return;
      const r = this.sceneEl.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = Math.floor(r.width * dpr);
      this.canvas.height = Math.floor(r.height * dpr);
      this.canvas.style.width = `${r.width}px`;
      this.canvas.style.height = `${r.height}px`;
      this.dpr = dpr;
      this.sceneW = r.width;
      this.sceneH = r.height;
    }

    onResize() {
      this.measure();
      this.onScroll();
    }

    getProgress() {
      if (!this.panelInner || !this.scrollEl) return 0;
      const start = this.scrollEl.offsetTop;
      const end = start + this.scrollEl.offsetHeight - this.panelInner.clientHeight;
      const p = (this.panelInner.scrollTop - start) / Math.max(1, (end - start));
      return clamp(p, 0, 1);
    }

    scrollToIndex(idx) {
      if (!this.panelInner || !this.scrollEl) return;
      const start = this.scrollEl.offsetTop;
      const end = start + this.scrollEl.offsetHeight - this.panelInner.clientHeight;

      // Where along the path does this node reach the camera?
      const targetZ = this.spacing * (idx + 1);
      const progress = clamp(targetZ / this.totalDepth, 0, 1);
      const targetScroll = start + progress * (end - start);

      this.panelInner.scrollTo({ top: targetScroll, behavior: "smooth" });
    }

    onScroll() {
      // Just request a frame
      if (this.running) return;
      // We'll rely on RAF loop when motion is on, but when motion is off we still update once
      this.updateOnce();
    }

    updateOnce() {
      const p = this.getProgress();
      this.applyProgress(p);
    }

    applyProgress(progress) {
      if (!this.nodesEl) return;

      const zTravel = progress * this.totalDepth;

      // Parallax drift
      if (this.pointer.active) {
        const tx = (this.pointer.x / this.sceneW - 0.5);
        const ty = (this.pointer.y / this.sceneH - 0.5);
        this.parallax.x = this.parallax.x + (tx - this.parallax.x) * 0.08;
        this.parallax.y = this.parallax.y + (ty - this.parallax.y) * 0.08;
      } else {
        this.parallax.x *= 0.92;
        this.parallax.y *= 0.92;
      }

      const px = this.parallax.x * 55;
      const py = this.parallax.y * 40;

      const rot = (this.parallax.x * 6);

      this.nodesEl.style.transform = `translate3d(${px}px, ${py}px, ${zTravel}px) rotateZ(${rot}deg)`;

      // Determine active (closest to camera plane)
      let best = 0;
      let bestAbs = Infinity;

      for (const n of this.nodes) {
        const ze = n.z + zTravel;
        const a = Math.abs(ze);
        if (a < bestAbs) { bestAbs = a; best = n.i; }

        // Fade nodes behind the camera
        const opacity = (ze > this.perspective - 120) ? 0 : clamp(1 - Math.max(0, ze) / 900, 0, 1);
        n.el.style.opacity = opacity.toFixed(3);
        n.el.style.pointerEvents = opacity < 0.1 ? "none" : "auto";
      }

      const active = (this.pinned != null) ? this.pinned : best;
      if (active !== this.lastActiveIndex) {
        this.lastActiveIndex = active;
        this.updateHUD(active, { pinned: this.pinned != null });
        // Update node classes
        for (const n of this.nodes) {
          n.el.classList.toggle("is-active", n.i === active);
          n.el.classList.toggle("is-pinned", this.pinned === n.i);
        }
      }

      this.drawLines(zTravel, active);
    }

    updateHUD(i, { pinned = false } = {}) {
      const it = this.items[i];
      if (!it) return;

      const y = $("#flightYear");
      const t = $("#flightTitle");
      const s = $("#flightSub");
      const d = $("#flightDesc");

      if (y) y.textContent = String(it.year);
      if (t) t.textContent = it.title;
      if (s) s.textContent = it.subtitle + (pinned ? "  •  pinned" : "");
      if (d) d.textContent = it.desc || "";
    }

    project(n, zTravel) {
      // Project node position to 2D for canvas lines
      const ze = n.z + zTravel;
      const P = this.perspective;
      const denom = (P - ze);
      if (denom <= 120) return null;
      const scale = P / denom;
      const x = (n.x + this.parallax.x * 55) * scale;
      const y = (n.y + this.parallax.y * 40) * scale;
      return {
        x: this.sceneW / 2 + x,
        y: this.sceneH / 2 + y,
        scale,
        ze,
      };
    }

    drawLines(zTravel, activeIndex) {
      if (!this.ctx || !this.canvas) return;
      const ctx = this.ctx;
      const dpr = this.dpr || 1;

      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.save();
      ctx.scale(dpr, dpr);

      // Soft background glow
      const grad = ctx.createRadialGradient(this.sceneW * 0.6, this.sceneH * 0.35, 40, this.sceneW * 0.6, this.sceneH * 0.35, this.sceneW * 0.9);
      grad.addColorStop(0, state.theme === "provence" ? "rgba(255,220,140,.22)" : "rgba(255,212,90,.18)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, this.sceneW, this.sceneH);

      // Project nodes
      const pts = this.nodes
        .map(n => ({ n, p: this.project(n, zTravel) }))
        .filter(o => o.p && o.p.ze < 900) // skip too close
        .sort((a,b) => a.p.ze - b.p.ze);

      // Lines: connect nearby indices like a constellation
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i];
        const b = pts[i + 1];
        if (Math.abs(a.n.i - b.n.i) > 2) continue;

        const alpha = 0.16 + 0.22 * clamp(1 - Math.abs(a.p.ze) / 1600, 0, 1);
        ctx.strokeStyle = state.theme === "provence"
          ? `rgba(43,60,122,${alpha})`
          : `rgba(255,212,90,${alpha})`;

        ctx.beginPath();
        ctx.moveTo(a.p.x, a.p.y);
        ctx.lineTo(b.p.x, b.p.y);
        ctx.stroke();
      }

      // Stars at points
      for (const o of pts) {
        const isActive = o.n.i === activeIndex;
        const r = (isActive ? 6.2 : 3.2) * clamp(o.p.scale, 0.8, 1.5);
        ctx.fillStyle = isActive
          ? (state.theme === "provence" ? "rgba(215,154,42,.95)" : "rgba(255,212,90,.95)")
          : (state.theme === "provence" ? "rgba(43,60,122,.55)" : "rgba(255,255,255,.40)");
        ctx.beginPath();
        ctx.arc(o.p.x, o.p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    anim() {
      if (!this.running) return;
      const p = this.getProgress();
      this.applyProgress(p);
      requestAnimationFrame(this.anim);
    }

    start() {
      if (this.running) return;
      this.running = true;
      requestAnimationFrame(this.anim);
    }

    stop(updateStatic = false) {
      this.running = false;
      if (updateStatic) this.updateOnce();
    }
  }

  let machinesFlight = null;

  /* -----------------------------
     Vinyl player (YouTube)
     ----------------------------- */
  class VinylPlayer {
    constructor({ rootEl, youtubeEl, diskEl, playBtn, muteBtn, volEl, collapseBtn, titleEl, subEl, labelEl, hintEl }) {
      this.rootEl = rootEl;
      this.youtubeEl = youtubeEl;
      this.diskEl = diskEl;
      this.playBtn = playBtn;
      this.muteBtn = muteBtn;
      this.volEl = volEl;
      this.collapseBtn = collapseBtn;
      this.titleEl = titleEl;
      this.subEl = subEl;
      this.labelEl = labelEl;
      this.hintEl = hintEl;

      this.player = null;
                     this.ready = false;
      this.playing = false;
      this.muted = false;
      this.visualsEnabled = true;

      this.videoId = data.audio.youtubeId;

      // UI text
      if (this.titleEl) this.titleEl.textContent = data.audio.title;
      if (this.subEl) this.subEl.textContent = `${data.audio.artist} • ${data.audio.note}`;
      if (this.labelEl) this.labelEl.textContent = data.audio.artist.split(" ")[0] || "Miles";

      // collapsed state
      const collapsed = this.readBool("vinylCollapsed", false);
      this.setCollapsed(collapsed, { save: false });

      this.playBtn?.addEventListener("click", () => this.togglePlay());
      this.muteBtn?.addEventListener("click", () => this.toggleMute());
      this.volEl?.addEventListener("input", () => this.setVolume(Number(this.volEl.value)));
      this.collapseBtn?.addEventListener("click", () => this.setCollapsed(!this.rootEl.classList.contains("vinyl--collapsed")));

      this.initYouTube();
    }

    readBool(key, fallback) {
      try {
        const v = localStorage.getItem(key);
        if (v === null) return fallback;
        return v === "1";
      } catch {
        return fallback;
      }
    }

    writeBool(key, val) {
      try { localStorage.setItem(key, val ? "1" : "0"); } catch {}
    }

    setCollapsed(collapsed, { save = true } = {}) {
      if (!this.rootEl) return;
      this.rootEl.classList.toggle("vinyl--collapsed", !!collapsed);
      if (save) this.writeBool("vinylCollapsed", !!collapsed);

      // If the user expanded, clear any scheduled auto-collapse
      if (!collapsed) this.clearAutoCollapse?.();

      // Update collapse button text and aria for better affordance
      if (this.collapseBtn) {
        if (collapsed) {
          this.collapseBtn.textContent = "▶"; // indicate expand
          this.collapseBtn.setAttribute("aria-label", "Expand music player");
        } else {
          this.collapseBtn.textContent = "—"; // compact collapse symbol
          this.collapseBtn.setAttribute("aria-label", "Collapse music player");
        }
      }
    }

    setVisualsEnabled(enabled) {
      this.visualsEnabled = !!enabled;
      if (!enabled) {
        this.rootEl?.classList.remove("is-playing");
      } else {
        this.rootEl?.classList.toggle("is-playing", this.playing);
      }
    }

    initYouTube() {
      if (!data.audio.enabled) return;

      // Already loaded?
      if (window.YT && window.YT.Player) {
        this.createPlayer();
        return;
      }

      // Load iframe API
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);

      // YouTube calls this global
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prev === "function") prev();
        this.createPlayer();
      };
    }

    createPlayer() {
      if (!this.youtubeEl) return;

      this.player = new window.YT.Player(this.youtubeEl, {
        height: "1",
        width: "1",
        videoId: this.videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            this.ready = true;
            // Use saved volume if available, otherwise start at 20%
            const hasSavedVol = (() => { try { return localStorage.getItem("vinylVol") !== null; } catch { return false; } })();
            const vol = hasSavedVol ? this.readVolume() : 20;
            if (this.volEl) this.volEl.value = String(vol);
            this.player.setVolume(vol);

            // First try to autoplay unmuted (some browsers may permit if volume is low).
            try {
              if (this.muted) { this.player.unMute(); this.muted = false; }
            } catch (e) {}

            this.player.playVideo();
            this.updateUI();

            // If not playing within a short window, fallback to muted autoplay and show unmute hint
            if (this._autoplayFallbackTimer) { clearTimeout(this._autoplayFallbackTimer); this._autoplayFallbackTimer = null; }
            this._autoplayFallbackTimer = setTimeout(() => {
              if (!this.playing) {
                try { this.player.mute(); this.muted = true; this.player.playVideo(); } catch (e) {}
                this.updateUI();

                // Show persistent unmute hint (reusing previous hint behavior)
                try { showToast("Tap anywhere or press M to enable audio"); } catch {}
                this._origHint = this.hintEl?.textContent;
                if (this.hintEl) this.hintEl.textContent = "Tap anywhere or press M to enable audio";
                this.rootEl?.classList.add("vinyl--unmute-hint");
                // auto-hide after 8s
                this._unmuteHintTimeout = setTimeout(() => {
                  if (this.hintEl && typeof this._origHint !== "undefined") this.hintEl.textContent = this._origHint || "Tip: press M to toggle music";
                  this.rootEl?.classList.remove("vinyl--unmute-hint");
                  this._unmuteHintTimeout = null;
                }, 8000);

                const onFirstGesture = () => {
                  try {
                    if (this.muted) { this.player.unMute(); this.muted = false; this.updateUI(); }
                    this.player.playVideo();
                    try { showToast("Audio enabled"); } catch {}
                  } catch (e) {}
                  if (this.hintEl && typeof this._origHint !== "undefined") this.hintEl.textContent = this._origHint || "Tip: press M to toggle music";
                  this.rootEl?.classList.remove("vinyl--unmute-hint");
                  if (this._unmuteHintTimeout) { clearTimeout(this._unmuteHintTimeout); this._unmuteHintTimeout = null; }

                  document.removeEventListener("pointerdown", onFirstGesture);
                  document.removeEventListener("keydown", onFirstGesture);
                };
                document.addEventListener("pointerdown", onFirstGesture, { once: true });
                document.addEventListener("keydown", onFirstGesture, { once: true });
              }
            }, 1200);

            // Ensure a second play attempt after a short delay
            setTimeout(() => {
              if (this.ready && this.player) {
                try { this.player.playVideo(); } catch (e) {}
              }
            }, 1000);
          },
          onStateChange: (ev) => {
            // 1 = playing, 2 = paused
            if (ev.data === window.YT.PlayerState.PLAYING) {
              this.playing = true;
              if (this._autoplayFallbackTimer) { clearTimeout(this._autoplayFallbackTimer); this._autoplayFallbackTimer = null; }
            } else if (ev.data === window.YT.PlayerState.PAUSED || ev.data === window.YT.PlayerState.ENDED) {
              this.playing = false;
            }
            this.updateUI();
          }
        }
      });
    }

    readVolume() {
      try {
        const v = Number(localStorage.getItem("vinylVol"));
        if (Number.isFinite(v)) return clamp(v, 0, 100);
        return 65;
      } catch {
        return 65;
      }
    }

    writeVolume(v) {
      try { localStorage.setItem("vinylVol", String(v)); } catch {}
    }

    setVolume(v) {
      const vol = clamp(Math.round(v), 0, 100);
      this.writeVolume(vol);
      if (this.ready && this.player) {
        this.player.setVolume(vol);
      }
    }

    toggleMute() {
      if (!this.ready || !this.player) {
        showToast("Music loading…");
        return;
      }
      this.muted = !this.muted;
      if (this.muted) this.player.mute();
      else {
        this.player.unMute();
        // Hide any unmute hint if present
        if (this.hintEl && typeof this._origHint !== "undefined") this.hintEl.textContent = this._origHint || "Tip: press M to toggle music";
        this.rootEl?.classList.remove("vinyl--unmute-hint");
        if (this._unmuteHintTimeout) { clearTimeout(this._unmuteHintTimeout); this._unmuteHintTimeout = null; }
      }
      this.updateUI();
    }

    togglePlay() {
      if (!this.ready || !this.player) {
        showToast("Music loading…");
        return;
      }
      if (this.playing) {
        this.player.pauseVideo();
      } else {
        this.player.playVideo();
      }
    }

    updateUI() {
      if (this.playBtn) this.playBtn.textContent = this.playing ? "❚❚" : "▶";
      if (this.muteBtn) this.muteBtn.textContent = this.muted ? "🔇" : "🔈";
      if (this.visualsEnabled) {
        this.rootEl?.classList.toggle("is-playing", this.playing);
      }
    }

    // Schedule auto-collapse after `delay` ms (useful for mobile or navigation-driven auto-hide)
    scheduleAutoCollapse(delay = 1500) {
      try {
        if (this._autoCollapseTimer) clearTimeout(this._autoCollapseTimer);
        this._autoCollapseTimer = setTimeout(() => {
          this.setCollapsed(true);
        }, delay);
      } catch (e) {}
    }

    clearAutoCollapse() {
      if (this._autoCollapseTimer) { clearTimeout(this._autoCollapseTimer); this._autoCollapseTimer = null; }
    }
  }

  let vinyl = null;

  /* -----------------------------
     Boot
     ----------------------------- */
  // Initial theme
  const savedTheme = (() => {
    try { return localStorage.getItem("theme"); } catch { return null; }
  })();
  setTheme(savedTheme || (prefersLight() ? "provence" : "night"), { save: false, announce: false });

  // Render
  render();
  buildConstellationNav();
  attachActions();
  attachMagnetic();
  attachTilt();
  loadGitHubStats();



  // Mount nebula


  // Mount machines flight
  const machinesInner = $("#panel-machines");
  const flightScroll = $("#flightScroll");
  const flightScene = $("#flightScene");
  const flightNodes = $("#flightNodes");
  const flightCanvas = $("#flightCanvas");
  const flightHUD = $("#flightHUD");

  if (machinesInner && flightScroll && flightScene && flightNodes && flightCanvas) {
    machinesFlight = new MachinesFlight({
      panelInner: machinesInner,
      scrollEl: flightScroll,
      sceneEl: flightScene,
      nodesEl: flightNodes,
      canvasEl: flightCanvas,
      hud: flightHUD,
    });
  }

  // Mount vinyl
  const vinylRoot = $("#vinyl");
  if (vinylRoot && data.audio?.enabled) {
    vinyl = new VinylPlayer({
      rootEl: vinylRoot,
      youtubeEl: $("#ytPlayer"),
      diskEl: $("#vinylDisk"),
      playBtn: $("#vinylPlay"),
      muteBtn: $("#vinylMute"),
      volEl: $("#vinylVol"),
      collapseBtn: $("#vinylCollapse"),
      titleEl: $("#vinylTitle"),
      subEl: $("#vinylSub"),
      labelEl: $("#vinylLabel"),
      hintEl: $("#vinylHint"),
    });

    // On mobile, auto-collapse after a short delay so the player doesn't obscure content
    try {
      if (window.innerWidth <= 520) {
        vinyl.scheduleAutoCollapse(1600);
      }
    } catch (e) {}
  }

  // Motion state
  setMotion(state.motionEnabled);

})();
