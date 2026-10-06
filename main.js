const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const mobile = matchMedia("(max-width: 767px)");
const workbench = document.querySelector("#workbench");
let scene;
let loading = false;
let generation = 0;
let motion;
let selectedTopic = "software";
let posterRequest = 0;
const poster = workbench.querySelector(".scene-poster");
const topicImages = { software: "software", products: "ai", research: "research", robotics: "robotics" };
async function updatePoster(topic) {
  const request = ++posterRequest;
  const asset = topicImages[topic];
  const image = new Image();
  image.src = `/assets/editorial/${asset}-${mobile.matches ? 800 : 1400}.webp`;
  try { await image.decode(); } catch { return; }
  if (request !== posterRequest) return;
  poster.querySelector("source").srcset = `/assets/editorial/${asset}-800.webp`;
  poster.querySelector("img").src = `/assets/editorial/${asset}-1400.webp`;
  if (!reducedMotion.matches && !scene) poster.animate([{ opacity: 0.35 }, { opacity: 1 }], { duration: 400 });
}

const menu = document.querySelector(".mobile-menu");
menu.addEventListener("click", (event) => {
  if (event.target.closest("a")) menu.open = false;
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    menu.open = false;
    scene?.cancelReplay();
  }
});
document.addEventListener("click", (event) => {
  if (!menu.contains(event.target)) menu.open = false;
});

document.querySelectorAll("a[data-topic]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    selectedTopic = link.dataset.topic;
    updatePoster(selectedTopic);
    document
      .querySelectorAll("a[data-topic]")
      .forEach((item) => item.classList.toggle("is-active", item === link));
    if (motion?.selectTopic) motion.selectTopic(selectedTopic);
    else scene?.setTopic(selectedTopic);
  });
});

// Deep links into native disclosures expose the requested content before scrolling.
function openHashTarget() {
  const target = document.getElementById(location.hash.slice(1));
  if (!target) return;
  for (
    let detail = target.closest("details");
    detail;
    detail = detail.parentElement.closest("details")
  ) {
    detail.open = true;
  }
  requestAnimationFrame(() => target.scrollIntoView());
}
if (location.hash) openHashTarget();
window.addEventListener("hashchange", openHashTarget);

const sections = document.querySelectorAll("main > section[id]");
const navigation = document.querySelectorAll(".desktop-nav a");
const navObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      navigation.forEach((link) => {
        if (link.hash === `#${entry.target.id}`)
          link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }
  },
  { rootMargin: "-15% 0px -60% 0px" },
);
sections.forEach((section) => navObserver.observe(section));

async function loadScene() {
  if (loading || scene || reducedMotion.matches) return;
  loading = true;
  const started = generation;
  try {
    const { createWorkbench } = await import("./scene.js");
    if (reducedMotion.matches || started !== generation) return;
    const nextScene = await createWorkbench(workbench.querySelector(".scene-mount"), {
      compact: mobile.matches,
      onFailure: showFallback,
    });
    if (started !== generation) { nextScene.dispose(); return; }
    scene = nextScene;
    scene.setTopic(selectedTopic);
    if (reducedMotion.matches) { showFallback(); applyPreferences(); return; }
    workbench.classList.add("is-ready");
    const { setupMotion } = await import("./motion.js");
    if (!reducedMotion.matches && scene) motion = setupMotion(scene, (topic) => {
      selectedTopic = topic;
      document.querySelectorAll("a[data-topic]").forEach(link => link.classList.toggle("is-active", link.dataset.topic === topic));
    });
    if (location.hash) openHashTarget();
  } catch (error) {
    console.warn("Workbench uses the static illustration:", error.message);
    showFallback();
  } finally {
    loading = false;
  }
}

function showFallback() {
  generation++;
  motion?.revert();
  motion = undefined;
  scene?.dispose();
  scene = undefined;
  workbench.classList.remove("is-ready");
}

function applyPreferences() {
  if (reducedMotion.matches) {
    showFallback();
    return;
  }
  if (!scene) {
    if (!navigator.connection?.saveData) loadScene();
  }
}
reducedMotion.addEventListener("change", applyPreferences);
mobile.addEventListener("change", () => {
  applyPreferences();
});
window.addEventListener("load", applyPreferences, { once: true });
window.addEventListener("pagehide", showFallback);
window.addEventListener("pageshow", (event) => { if (event.persisted) applyPreferences(); });

workbench.addEventListener("pointermove", (event) => {
  if (scene || reducedMotion.matches || event.pointerType !== "mouse") return;
  const rect = workbench.getBoundingClientRect();
  poster.style.setProperty("--photo-x", `${((event.clientX - rect.left) / rect.width - 0.5) * 12}px`);
  poster.style.setProperty("--photo-y", `${((event.clientY - rect.top) / rect.height - 0.5) * 8}px`);
});
workbench.addEventListener("pointerleave", () => { poster.style.setProperty("--photo-x", "0px"); poster.style.setProperty("--photo-y", "0px"); });
