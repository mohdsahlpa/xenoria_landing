import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let countdownInterval = null;

export function initHero() {
  const hero = document.getElementById("hero");
  if (!hero) return;

  // Clear existing interval if it exists
  if (countdownInterval) clearInterval(countdownInterval);

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

  if (!document.getElementById("hero-styles")) {
    const style = document.createElement('style');
    style.id = "hero-styles";
    style.textContent = `
      #hero {
        padding: 0;
        overflow: visible;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100dvh;
      }
      .hero__content {
        position: relative;
        z-index: 2;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: clamp(1.5rem, 5dvh, 3.5rem);
        width: 100%;
        max-width: 800px;
        padding: 0 1.5rem;
        will-change: transform, opacity, filter;
      }
      .hero__eyebrow {
        font-family: var(--font-label);
        font-size: clamp(0.5rem, 2vw, 0.6rem);
        letter-spacing: 0.5em;
        color: var(--color-nebula-cyan);
        opacity: 0.7;
        text-transform: uppercase;
      }
      .hero__title {
        font-family: var(--font-hero);
        font-weight: 900;
        font-size: clamp(2rem, 10vw, 5rem);
        line-height: 1.1;
        letter-spacing: 0.15em;
        color: var(--color-text-primary);
        text-shadow: 0 0 40px rgba(0, 0, 0, 0.8);
      }
      .hero__word--accent {
        display: block;
        margin-top: 0.5rem;
        font-style: normal;
        color: transparent;
        -webkit-text-stroke: 1px var(--color-nebula-cyan);
        filter: drop-shadow(0 0 10px rgba(0, 229, 255, 0.4));
      }
      .hero__subtitle {
        font-family: var(--font-label);
        font-size: clamp(0.6rem, 2.5vw, 0.8rem);
        letter-spacing: 0.3em;
        color: var(--color-text-secondary);
        text-transform: uppercase;
        font-weight: 400;
        margin-top: -1rem;
      }
      .hero__countdown {
        display: flex;
        align-items: center;
        gap: clamp(1rem, 4vw, 2.5rem);
        padding: clamp(1.5rem, 5vh, 2.5rem) clamp(1rem, 5vw, 3.5rem);
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .countdown__item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.3rem;
      }
      .countdown__value {
        font-family: var(--font-hero);
        font-size: clamp(1.2rem, 5vw, 1.6rem);
        font-weight: 700;
        color: var(--color-text-primary);
        letter-spacing: 0.05em;
      }
      .countdown__label {
        font-family: var(--font-label);
        font-size: clamp(0.4rem, 1.5vw, 0.5rem);
        text-transform: uppercase;
        letter-spacing: 0.2em;
        color: var(--color-nebula-cyan);
        opacity: 0.6;
      }
      .countdown__divider {
        font-family: var(--font-label);
        font-size: clamp(0.8rem, 3vw, 1rem);
        color: rgba(255, 255, 255, 0.15);
        margin-top: -1.2rem;
      }
      .hero__meta {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        gap: clamp(1.5rem, 6vw, 4rem);
        font-family: var(--font-label);
        font-size: clamp(0.6rem, 2.5vw, 0.75rem);
        color: var(--color-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.2em;
        opacity: 0.8;
      }
      @media (max-width: 768px) {
        .hero__title { font-size: clamp(2.5rem, 15vw, 4rem); }
        .hero__countdown {
          gap: 1.5rem;
          padding: 1.5rem;
          width: 100%;
          justify-content: center;
        }
      }
      @media (max-width: 480px) {
        .hero__title { 
          font-size: clamp(2rem, 16vw, 2.8rem); 
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .hero__word { display: block; }
        .hero__word--accent { margin-top: 0; }
        .hero__meta {
          flex-direction: column;
          gap: 0.8rem;
          align-items: center;
          font-size: 0.65rem;
        }
        .hero__countdown {
          padding: 1rem 0.5rem;
          gap: 0.5rem;
        }
        .countdown__item { gap: 0.1rem; }
        .countdown__value { font-size: 1.1rem; }
        .countdown__label { font-size: 0.35rem; }
        .countdown__divider { display: none; }
        .hero__subtitle { font-size: 0.6rem; margin-top: -0.5rem; }
      }
      .hero__meta span {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .hero__scroll-indicator {
        position: absolute;
        bottom: 3rem;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        opacity: 0.4;
      }
      .hero__scroll-line {
        width: 1px;
        height: 50px;
        background: linear-gradient(to bottom, var(--color-nebula-cyan), transparent);
      }
      .hero__scroll-label {
        font-family: var(--font-label);
        font-size: 0.55rem;
        letter-spacing: 0.5em;
        color: var(--color-nebula-cyan);
      }
      .hologram-flicker {
        animation: flicker 4s infinite;
      }
      @keyframes flicker {
        0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; filter: drop-shadow(0 0 10px rgba(0, 229, 255, 0.4)); }
        20%, 24%, 55% { opacity: 0.7; filter: drop-shadow(0 0 3px rgba(0, 229, 255, 0.2)); }
      }
    `;
    document.head.appendChild(style);
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
