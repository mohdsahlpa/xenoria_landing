import gsap from "gsap";
import '../styles/sections/speakers.css';

export function initSpeakers() {
  const speakers = document.getElementById("speakers");
  if (!speakers) return;

  const speakersData = [
    { name: "Dr. Jane Doe", role: "AI Researcher, ISRO", bio: "Pioneering work in autonomous spacecraft navigation and deep space exploration protocols.", img: "https://i.pravatar.cc/150?u=jane" },
    { name: "John Smith", role: "CTO, TechNova", bio: "Leading innovation in sustainable energy solutions and next-gen fusion reactor design.", img: "https://i.pravatar.cc/150?u=john" },
    { name: "Alice Wang", role: "Quantum Engineer", bio: "Expert in superconducting qubits, quantum error correction, and entanglement distribution.", img: "https://i.pravatar.cc/150?u=alice" }
  ];

  speakers.innerHTML = `
    <div class="speakers__container">
      <div class="section-header">
        <p class="section-label">MINDS :: FROM_THE_COSMOS</p>
        <h2 id="speakers-heading">Speakers</h2>
      </div>
      <div class="speakers__grid" role="list">
        ${speakersData.map(speaker => `
          <article class="speaker-card" role="listitem" aria-label="Speaker: ${speaker.name}">
            <div class="speaker-card__inner">
              <div class="speaker-card__front">
                <div class="speaker-card__avatar" aria-hidden="true">
                  <img src="${speaker.img}" alt="${speaker.name}" width="160" height="160" loading="lazy" />
                </div>
                <h3 class="speaker-card__name">${speaker.name}</h3>
                <p class="speaker-card__role">${speaker.role}</p>
              </div>
              <div class="speaker-card__back" aria-hidden="true">
                <p>${speaker.bio}</p>
                <div class="speaker-card__social">
                  <a href="#" class="speaker-card__social-link">X_TWTR</a>
                  <a href="#" class="speaker-card__social-link">LN_KDIN</a>
                </div>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  `;

  // GSAP Reveal
  gsap.from(".speaker-card", {
    scrollTrigger: {
      trigger: ".speakers__grid",
      start: "top 85%"
    },
    opacity: 0,
    y: 50,
    rotateX: 10,
    stagger: 0.15,
    duration: 1,
    ease: "power2.out"
  });
}
