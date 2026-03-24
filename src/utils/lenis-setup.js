import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export function initLenis() {
  const lenis = new Lenis({
    duration: 1.6,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.5,
  });

  // CRITICAL: use gsap.ticker NOT rAF directly
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Feed Lenis scroll to ScrollTrigger
  lenis.on("scroll", ScrollTrigger.update);

  // Dock scroll anchors must use lenis.scrollTo, not native anchor
  document.querySelectorAll(".footer__nav a, .hero__cta").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      if (targetId && targetId !== '#') {
        const target = document.querySelector(targetId);
        if (target) {
          lenis.scrollTo(target, { 
            offset: -90, 
            duration: 1.8, 
            easing: (t) => 1 - Math.pow(1 - t, 4) 
          });
        }
      }
    });
  });

  return lenis;
}
