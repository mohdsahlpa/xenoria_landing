import gsap from "gsap";

export function initA11y() {
  // Handle reduced motion
  const mm = gsap.matchMedia();
  
  mm.add("(prefers-reduced-motion: reduce)", () => {
    // Disable all ScrollTrigger scrubs
    gsap.globalTimeline.clear();
    // Potentially disable Three.js loop or slow it down
    window.REDUCED_MOTION = true;
  });

  // Focus visible styles are already in layout.css
  
  // Skip link handling (standard HTML anchor works, but good to ensure focus)
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      const target = document.querySelector(skipLink.getAttribute('href'));
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }
}
