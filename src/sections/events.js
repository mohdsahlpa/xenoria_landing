import gsap from "gsap";
import eventsData from "../data/events.json";
import '../styles/sections/events.css';

export function initEvents() {
  const events = document.getElementById("events");
  if (!events) return;

  const categories = ["All", "CS", "ECE", "EEE", "MECH", "CIVIL"];
  
  const sortedEvents = [...eventsData].sort((a, b) => {
    return categories.indexOf(a.category) - categories.indexOf(b.category);
  });

  events.innerHTML = `
    <div class="events__container">
      <div class="section-header">
        <p class="section-label">DEPARTMENTS :: CHOOSE_YOUR_PATH</p>
        <h2 id="events-heading">Events</h2>
      </div>
      <div class="events__filter" role="tablist" aria-label="Filter events by department">
        ${categories.map((cat, i) => `
          <button role="tab" aria-selected="${i === 0}" class="filter-tab ${i === 0 ? 'is-active' : ''}" data-filter="${cat.toLowerCase()}">${cat}</button>
        `).join('')}
      </div>
      <ul class="events__grid" role="list" aria-live="polite" aria-label="Event listings">
        ${sortedEvents.map(event => `
          <li class="event-card" role="listitem" data-category="${event.category.toLowerCase()}" data-id="${event.id}">
            <article style="--card-accent: ${event.accent}">
              <div class="event-card__header">
                <span class="event-card__category">${event.category}</span>
                <span class="event-card__id" aria-label="Event ID">${event.id}</span>
              </div>
              <div class="event-card__body">
                <h3 class="event-card__title">${event.title}</h3>
                <p class="event-card__desc">${event.desc.substring(0, 100)}${event.desc.length > 100 ? '...' : ''}</p>
                <div class="event-card__meta">
                  <span aria-label="Date">${event.date}</span>
                  <span aria-label="Team size">Team: ${event.team}</span>
                  <span aria-label="Prize pool">Pool: ${event.prize}</span>
                </div>
              </div>
              <a href="/event/${event.id}" class="event-card__cta" data-navigo aria-label="View details for ${event.title}">Details</a>
            </article>
          </li>
        `).join('')}
      </ul>
    </div>
  `;

  // Filter Logic
  const filterTabs = document.querySelectorAll(".filter-tab");
  filterTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      if (tab.classList.contains("is-active")) return;

      filterTabs.forEach(t => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");

      const filter = tab.dataset.filter;
      const heading = document.getElementById("events-heading");
      const newText = filter === "all" ? "Events" : `${tab.textContent} Events`;
      
      gsap.to(heading, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        onComplete: () => {
          heading.textContent = newText;
          gsap.to(heading, {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "back.out(1.7)"
          });
        }
      });

      const cards  = [...document.querySelectorAll(".event-card")];
      const hide   = cards.filter(c => filter !== "all" && c.dataset.category !== filter);
      const show   = cards.filter(c => filter === "all" || c.dataset.category === filter);

      // Kill any running animations on these elements
      gsap.killTweensOf(cards);

      const tl = gsap.timeline();

      if (hide.length > 0) {
        tl.to(hide, { 
          opacity: 0, 
          scale: 0.9,
          y: 20,
          duration: 0.3, 
          stagger: {
            amount: 0.1,
            from: "start"
          },
          onComplete: () => {
            hide.forEach(c => c.style.display = "none");
          }
        });
      }
      
      tl.set(show, { display: "block", opacity: 0, y: 30, scale: 0.94 }, hide.length > 0 ? ">-0.1" : 0);

      tl.to(show, { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.6, 
        stagger: {
          amount: 0.2,
          from: "start"
        }, 
        ease: "cosmicIn",
        clearProps: "transform,opacity"
      });
    });
  });

  // Make whole card clickable
  document.querySelectorAll(".event-card").forEach(card => {
    card.addEventListener("click", (e) => {
      if (!e.target.closest('a')) {
        const id = card.dataset.id;
        window.router.navigate(`/event/${id}`);
      }
    });
  });

  // Initial Entrance Animation
  gsap.from(".event-card", {
    opacity: 0,
    y: 50,
    stagger: 0.1,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".events__grid",
      start: "top 85%"
    }
  });

  window.router.updatePageLinks();
}

export function initEventDetail(eventId) {
  const container = document.getElementById("event-detail");
  if (!container) return;

  const event = eventsData.find(e => e.id === eventId);
  if (!event) {
    container.innerHTML = `<div class="error-container"><h2>Event not found</h2><a href="/events" data-navigo>Back to Events</a></div>`;
    return;
  }

  container.innerHTML = `
    <div class="event-detail__wrapper" style="--detail-accent: ${event.accent}">
      <div class="event-detail__nav">
        <a href="/events" class="back-link" data-navigo>
          <span class="arrow">←</span> BACK_TO_MISSION_CONTROL
        </a>
      </div>
      
      <div class="event-detail__content">
        <div class="event-detail__poster">
          <img src="${event.image}" alt="${event.title} Poster" />
          <div class="poster-overlay"></div>
        </div>
        
        <div class="event-detail__body">
          <header class="detail-header">
            <span class="detail-category">${event.category}</span>
            <h1 class="detail-title">${event.title}</h1>
            <span class="detail-id">${event.id}</span>
          </header>

          <div class="detail-description">
            <p>${event.desc}</p>
          </div>

          <div class="detail-info-grid">
            <div class="info-box">
              <label>TEMPORAL_MARKER</label>
              <span>${event.date}</span>
            </div>
            <div class="info-box">
              <label>SQUAD_CAPACITY</label>
              <span>${event.team}</span>
            </div>
            <div class="info-box">
              <label>REWARD_POOL</label>
              <span>${event.prize}</span>
            </div>
          </div>

          <div class="detail-actions">
            <a href="${event.regLink}" target="_blank" class="primary-reg-btn">
              INITIALIZE_REGISTRATION
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  // Detail Page Animations
  gsap.from(".event-detail__poster", {
    opacity: 0,
    x: -50,
    duration: 1,
    ease: "power4.out"
  });

  gsap.from(".event-detail__body > *", {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.1,
    ease: "cosmicIn"
  });

  window.router.updatePageLinks();
}
