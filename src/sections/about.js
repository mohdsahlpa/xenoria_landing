import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import '../styles/sections/about.css';

export function initAbout() {
  const about = document.getElementById("about");
  if (!about) return;

  about.innerHTML = `
    <div class="about__container">
      <div class="about__text">
        <span class="about__label reveal-holo">PROTOCOL :: ABOUT_THE_FEST</span>
        <h2 id="about-heading" class="reveal-holo">Where Curiosity<br>Meets <em>Cosmos</em></h2>
        <p class="reveal-holo">Xenoria is the annual technical extravaganza of the College of Engineering, bringing together the brightest minds across engineering, design, and science for three days of competitions, workshops, and innovation.</p>
      </div>

      <div class="about__stats" role="list">
        <div class="about__stat reveal-holo" role="listitem">
          <span class="about__stat-number" data-target="48">0</span>
          <span class="about__stat-label">Cosmic Events</span>
        </div>
        <div class="about__stat reveal-holo" role="listitem">
          <span class="about__stat-number" data-target="12">0</span>
          <span class="about__stat-label">Years of Orbit</span>
        </div>
        <div class="about__stat reveal-holo" role="listitem">
          <span class="about__stat-number" data-target="5000">0</span>
          <span class="about__stat-label">Participants</span>
        </div>
      </div>
    </div>
  `;

  // --- Initial State (Hidden in the void) ---
  gsap.set(".reveal-holo", {
    opacity: 0,
    z: -400,
    filter: "blur(30px)",
    scale: 0.7
  });

  // --- The Projection Timeline ---
  const projectionTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#about",
      start: "top 95%",
      end: "top 20%",
      scrub: 1.2,
    }
  });

  projectionTl
    .to(".reveal-holo", {
      opacity: 1,
      z: 0,
      scale: 1,
      filter: "blur(0px)",
      stagger: 0.08,
      duration: 2,
      ease: "power2.out"
    });

  // --- Realistic Electric Fault (Sparks & Glitch) ---
  const triggerShortCircuit = () => {
    const elements = document.querySelectorAll(".reveal-holo");

    // Create a burst of flickering
    const burstTl = gsap.timeline({
      onComplete: () => {
        // Clear classes after burst
        elements.forEach(el => {
          el.classList.remove("is-sparking", "is-glitching");
          el.style.setProperty('--glitch-x', '0px');
        });
        // Random delay until next fault
        setTimeout(triggerShortCircuit, Math.random() * 3000 + 500);
      }
    });

    const flickerCount = Math.floor(Math.random() * 4) + 2;

    for (let i = 0; i < flickerCount; i++) {
      const isExtreme = Math.random() > 0.7;

      burstTl
        .to(elements, {
          opacity: () => Math.random() * 0.5 + 0.2,
          duration: 0.05,
          onStart: () => {
            if (isExtreme) {
              elements.forEach(el => {
                el.classList.add("is-sparking", "is-glitching");
                const glitchX = (Math.random() - 0.5) * 10;
                el.style.setProperty('--glitch-x', `${glitchX}px`);
              });
            }
          }
        })
        .to(elements, {
          opacity: 1,
          duration: 0.03,
          onStart: () => {
            elements.forEach(el => {
              el.classList.remove("is-sparking");
              el.style.setProperty('--glitch-x', '0px');
            });
          }
        }, "+=0.02");
    }
  };

  // Start the electrical fault loop when in view
  ScrollTrigger.create({
    trigger: "#about",
    start: "top 80%",
    onEnter: () => triggerShortCircuit(),
  });

  // --- Counter Logic ---
  document.querySelectorAll(".about__stat-number").forEach(el => {
    const target = parseInt(el.getAttribute("data-target"));
    
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      onEnter: () => {
        gsap.to(el, {
          innerText: target,
          duration: 3,
          snap: { innerText: 1 },
          ease: "power2.out",
          onUpdate: function() {
            if (target >= 1000) {
              const val = Math.floor(this.targets()[0].innerText);
              el.innerText = val.toLocaleString() + "+";
            }
          }
        });
      },
      once: true
    });
  });
}
