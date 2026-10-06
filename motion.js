import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const chapters = [
  ["software", "Software engineering", "CareerLift", "Web and mobile applications built with React, React Native, and FastAPI.", "#project-careerlift"],
  ["products", "Retrieval-augmented generation", "PocketPilot", "Hybrid retrieval over financial records with Rust, Qdrant, and local Ollama inference.", "#project-pocketpilot"],
  ["research", "Machine learning & research", "Hasse Clustering", "A Python clustering engine running in the browser through Pyodide and Web Workers.", "#project-hasse-clustering"],
  ["robotics", "Robotics", "Robot manipulation", "Tabletop manipulation experiments in NVIDIA Isaac Sim.", "#project-robotics"],
];

export function setupMotion(scene, onTopic) {
  const media = gsap.matchMedia();
  let trigger;
  const hero = document.querySelector(".hero");
  const caption = hero.querySelector(".journey-caption");
  const intro = hero.querySelector(".hero__content");
  media.add({
    desktop: "(min-width: 1051px) and (min-height: 650px)",
    motion: "(prefers-reduced-motion: no-preference)",
  }, (context) => {
    if (!context.conditions.motion) return;
    const desktop = context.conditions.desktop;
    const stage = hero.querySelector(".journey-stage");
    const fitStage = () => hero.style.setProperty("--studio-header", `${document.querySelector(".header").offsetHeight}px`);
    fitStage();
    hero.classList.add("is-journey");
    caption.hidden = false;
    hero.classList.toggle("is-mobile-journey", !desktop);
    caption.inert = desktop;
    let previous = -1;
    const update = ({ progress }) => {
        scene.setProgress(progress);
        const index = Math.min(3, Math.floor(progress * 4));
        const inIntro = desktop && progress < 0.06;
        if (desktop) {
          intro.style.opacity = inIntro ? String(Math.min(1, (0.06 - progress) / 0.02)) : "0";
          intro.inert = !inIntro;
        }
        caption.style.opacity = inIntro ? "0" : "1";
        caption.inert = inIntro;
        hero.style.setProperty("--journey-progress", progress);
        if (index !== previous) {
          previous = index;
          const [topic, label, title, description, href] = chapters[index];
          hero.querySelector("#journey-label").textContent = label;
          hero.querySelector("#journey-title").textContent = title;
          hero.querySelector("#journey-description").textContent = description;
          hero.querySelector("#journey-link").href = href;
          onTopic(topic);
        }
    };
    trigger = ScrollTrigger.create({
      trigger: desktop ? hero : stage,
      start: desktop ? "top top" : () => `top ${document.querySelector(".header").offsetHeight}px`,
      end: () => `+=${(desktop ? innerHeight : stage.offsetHeight) * (desktop ? 3.5 : 3)}`,
      pin: true, pinSpacing: true, invalidateOnRefresh: true, onRefreshInit: fitStage, onUpdate: update,
    });
    update(trigger);

    return () => {
      trigger = undefined;
      hero.classList.remove("is-journey", "is-mobile-journey");
      intro.style.opacity = "";
      intro.inert = false;
      caption.hidden = true;
      scene.setTopic(chapters[Math.max(0, previous)][0]);
    };
  });
  return {
    revert: () => media.revert(),
    selectTopic(topic) {
      if (!trigger) { scene.setTopic(topic); return; }
      const index = chapters.findIndex(chapter => chapter[0] === topic);
      if (index < 0) return;
      window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * (index / 4 + 0.025), behavior: "instant" });
    },
  };
}
