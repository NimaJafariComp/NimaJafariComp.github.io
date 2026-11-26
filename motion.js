import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const chapters = [
  ["software", "Software engineering", "Development Console", "Typed code, schema validation, and tests for the decisions that matter.", "#project-driftless"],
  ["products", "AI engineering", "Agent Orchestration", "Retrieve context, run scoped tools, and verify each result in a traceable workflow.", "#project-agenticai"],
  ["research", "ML & research", "Model Evaluation", "From embeddings and inference to evaluating model behavior against evidence.", "#project-hasse-clustering"],
  ["robotics", "Robotics simulation", "Robotics Workcell", "A controlled pick-and-place sequence with coordinated joints and precise release.", "#project-robotics"],
];

export function setupMotion(scene, onTopic) {
  const media = gsap.matchMedia();
  let trigger;
  let showTopic;
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
    let previous;
    let entrance;
    showTopic = (topic) => {
      if (topic === previous) return;
      const chapter = chapters.find(([key]) => key === topic);
      if (!chapter) return;
      const [, label, title, description, href] = chapter;
      hero.querySelector("#journey-label").textContent = label;
      hero.querySelector("#journey-title").textContent = title;
      hero.querySelector("#journey-description").textContent = description;
      const projectLink = hero.querySelector("#journey-link");
      projectLink.href = href;
      projectLink.setAttribute("aria-label", `See related work for ${label}`);
      onTopic(topic);
      entrance?.cancel();
      if (previous && !caption.inert && !caption.contains(document.activeElement)) {
        entrance = caption.animate(
          [{ transform: "translateY(7px)", opacity: 0.42 }, { transform: "translateY(0)", opacity: 1 }],
          { duration: 260, easing: "cubic-bezier(.2,.7,.3,1)" },
        );
      }
      previous = topic;
    };
    showTopic(scene.getTopic());
    const update = ({ progress }) => {
      scene.setProgress(progress);
      const introOpacity = desktop ? gsap.utils.clamp(0, 1, (0.075 - progress) / 0.035) : 0;
      if (desktop) {
        intro.style.opacity = String(introOpacity);
        intro.inert = introOpacity < 0.5 && !intro.contains(document.activeElement);
      }
      caption.style.opacity = String(1 - introOpacity);
      caption.inert = introOpacity >= 0.5;
      hero.style.setProperty("--journey-progress", progress);
    };
    trigger = ScrollTrigger.create({
      trigger: desktop ? hero : stage,
      start: () => `top ${document.querySelector(".header").offsetHeight}px`,
      end: () => `+=${(desktop ? hero.offsetHeight : stage.offsetHeight) * 2.8}`,
      pin: true, pinSpacing: true, invalidateOnRefresh: true, onRefreshInit: fitStage, onRefresh: update, onUpdate: update,
    });
    update(trigger);

    return () => {
      trigger = undefined;
      showTopic = undefined;
      entrance?.cancel();
      hero.classList.remove("is-journey", "is-mobile-journey");
      intro.style.opacity = "";
      intro.inert = false;
      caption.hidden = true;
      scene.setTopic(previous ?? "software");
    };
  });
  return {
    revert: () => media.revert(),
    showTopic: (topic) => showTopic?.(topic),
    selectTopic(topic) {
      if (!trigger) { scene.setTopic(topic); return; }
      const index = chapters.findIndex(chapter => chapter[0] === topic);
      if (index < 0) return;
      const landing = (index + 0.34) / chapters.length;
      window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * landing, behavior: "instant" });
      scene.setProgress(landing);
      scene.replay(topic);
    },
  };
}
