import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let countdownInterval = null;

export function initHero() {
  const hero = document.getElementById("hero");
  if (!hero) return;

  // Clear existing interval if it exists
  if (countdownInterval) clearInterval(countdownInterval);

  // Only inject HTML if it's not already there (for client-side routing)
  if (!hero.querySelector('.hero__content')) {
    hero.innerHTML = `
      <div class="hero__content">
        <p class="hero__eyebrow" aria-label="Event label">COLLEGE OF ENGINEERING · XENORIA</p>
        <h1 class="hero__title">
          <span class="hero__word" aria-hidden="true">XENORIA</span>
          <span class="hero__word hero__word--accent" aria-hidden="true">2026</span>
          <span class="sr-only">XENORIA 2026</span>
        </h1>
        <p class="hero__subtitle">48 Events · 3 Days · One Universe</p>
        
        <div class="hero__countdown" aria-label="Time remaining to March 31">
          <div class="countdown__item">
            <span class="countdown__value" id="hero-days">00</span>
            <span class="countdown__label">Days</span>
          </div>
          <div class="countdown__divider">:</div>
          <div class="countdown__item">
            <span class="countdown__value" id="hero-hours">00</span>
            <span class="countdown__label">Hours</span>
          </div>
          <div class="countdown__divider">:</div>
          <div class="countdown__item">
            <span class="countdown__value" id="hero-mins">00</span>
            <span class="countdown__label">Mins</span>
          </div>
          <div class="countdown__divider">:</div>
          <div class="countdown__item">
            <span class="countdown__value" id="hero-secs">00</span>
            <span class="countdown__label">Secs</span>
          </div>
        </div>

        <div class="hero__meta">
          <span class="hero__date"><span aria-hidden="true">◈</span> March 31 – April 2, 2026</span>
        </div>
      </div>
      <div class="hero__scroll-indicator" aria-hidden="true">
        <span class="hero__scroll-line"></span>
        <span class="hero__scroll-label">SCROLL</span>
      </div>
    `;
  }

  gsap.set([".hero__eyebrow", ".hero__word", ".hero__subtitle", ".hero__countdown", ".hero__meta"], {
    opacity: 0,
    y: 30
  });

  // Countdown Logic - Set to March 31, 2026
  const targetDate = new Date("March 31, 2026 00:00:00").getTime();
  
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      clearInterval(countdownInterval);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const dEl = document.getElementById("hero-days");
    const hEl = document.getElementById("hero-hours");
    const mEl = document.getElementById("hero-mins");
    const sEl = document.getElementById("hero-secs");

    if (dEl) dEl.innerText = days.toString().padStart(2, '0');
    if (hEl) hEl.innerText = hours.toString().padStart(2, '0');
    if (mEl) mEl.innerText = minutes.toString().padStart(2, '0');
    if (sEl) sEl.innerText = seconds.toString().padStart(2, '0');
  }

  countdownInterval = setInterval(updateCountdown, 1000);
  updateCountdown();

  // Mousemove parallax - Only on desktop/pointer devices and large screens
  const isMobile = window.innerWidth <= 992;
  if (window.matchMedia("(pointer: fine)").matches && !isMobile) {
    window.addEventListener("mousemove", (e) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 30;
      const yPos = (clientY / window.innerHeight - 0.5) * 30;
      gsap.to(".hero__content", { x: xPos, y: yPos, duration: 1.5, ease: "power2.out" });
    });
  }

  gsap.to(".hero__content", {
    scrollTrigger: { 
      trigger: "#hero", 
      start: "top top", 
      end: "bottom top", 
      scrub: true 
    },
    opacity: 0, 
    scale: 1.2, 
    filter: "blur(20px)", 
    ease: "none"
  });

  gsap.to(".hero__scroll-indicator", {
    scrollTrigger: { 
      trigger: "#hero", 
      start: "top top", 
      end: "20% top", 
      scrub: true 
    },
    opacity: 0, 
    ease: "none"
  });
}

export function revealHero() {
  const heroTl = gsap.timeline();
  heroTl
    .to(".hero__eyebrow",  { opacity: 0.8, y: 0, duration: 1.2, ease: "power3.out" })
    .to(".hero__word",     { 
      opacity: 1, y: 0, stagger: 0.2, duration: 1.5, ease: "power4.out",
      onComplete: () => {
        const accent = document.querySelector(".hero__word--accent");
        if (accent) accent.classList.add("hologram-flicker");
      }
    }, "-=0.8")
    .to(".hero__subtitle", { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=1.2")
    .to(".hero__countdown", { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=1")
    .to(".hero__meta",     { opacity: 1, y: 0, stagger: 0.15, duration: 0.8 }, "-=0.8")
    .fromTo(".hero__scroll-line", 
      { scaleY: 0, transformOrigin: "top" }, 
      { scaleY: 1, duration: 1.5, ease: "power4.inOut" }, "-=1"
    );
}
