import gsap from "gsap";

export function initCursor() {
  if (window.matchMedia("(pointer: coarse)").matches) return; // skip cursor init on touch devices

  const ring = document.querySelector(".cursor__ring");
  const dot  = document.querySelector(".cursor__dot");
  const cursor = document.getElementById("cursor");

  if (!ring || !dot || !cursor) return;

  // Dot: snaps instantly (no lag)
  // Ring: lags behind with GSAP quickTo for butter-smooth trailing
  const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
  const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });
  const dotX  = gsap.quickTo(dot,  "x", { duration: 0.08, ease: "none" });
  const dotY  = gsap.quickTo(dot,  "y", { duration: 0.08, ease: "none" });

  window.addEventListener("mousemove", (e) => {
    ringX(e.clientX); ringY(e.clientY);
    dotX(e.clientX);  dotY(e.clientY);
  });

  // Context-sensitive states
  const addHoverListeners = () => {
    document.querySelectorAll("a, button, .event-card, [role=tab]").forEach(el => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-hovering"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-hovering"));
    });

    document.querySelectorAll("p, h1, h2, h3, h4, li").forEach(el => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-text"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-text"));
    });
  };

  addHoverListeners();
  
  // Re-add listeners if content changes (optional but good practice)
  const observer = new MutationObserver(addHoverListeners);
  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener("mousedown", () => cursor.classList.add("is-clicking"));
  window.addEventListener("mouseup",   () => cursor.classList.remove("is-clicking"));

  // Hide cursor when leaving window
  document.addEventListener("mouseleave", () => gsap.to(cursor, { opacity: 0, duration: 0.3 }));
  document.addEventListener("mouseenter", () => gsap.to(cursor, { opacity: 1, duration: 0.3 }));

  // Magnetic effect on CTA buttons - Only on desktop
  const initMagnetic = () => {
    if (window.innerWidth <= 992) return;
    
    document.querySelectorAll(".dock__cta, .cta__button, .hero__cta").forEach(el => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = (e.clientX - cx) * 0.35;
        const dy = (e.clientY - cy) * 0.35;
        gsap.to(el, { x: dx, y: dy, duration: 0.35, ease: "power2.out" });
      });
      el.addEventListener("mouseleave", () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
      });
    });
  };
  
  initMagnetic();
}
