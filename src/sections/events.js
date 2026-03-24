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

  // UPDATE META TAGS FOR SEO/AEO/GEO
  document.title = `${event.title} | Xenoria 2026 — College of Engineering`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute("content", `${event.title}: ${event.desc.substring(0, 150)}... Register now for Xenoria 2026.`);
  }

  // ADD JSON-LD FOR THE SPECIFIC EVENT
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": `${event.title} - Xenoria 2026`,
    "description": event.desc,
    "startDate": "2026-03-31T09:00:00+05:30", // Assuming start of fest
    "endDate": "2026-04-02T18:00:00+05:30",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": "College of Engineering, Main Campus",
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "Kerala",
        "addressCountry": "IN"
      }
    },
    "image": event.image,
    "offers": {
      "@type": "Offer",
      "url": event.regLink,
      "price": "0", // General entry, specific fees in desc
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock"
    }
  };

  // Inject or Update JSON-LD
  let script = document.getElementById('event-json-ld');
  if (!script) {
    script = document.createElement('script');
    script.id = 'event-json-ld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(eventJsonLd);

  container.innerHTML = `
    <div class="event-detail__wrapper" style="--detail-accent: ${event.accent}" itemscope itemtype="https://schema.org/Event">
      <meta itemprop="startDate" content="2026-03-31T09:00:00+05:30" />
      <meta itemprop="endDate" content="2026-04-02T18:00:00+05:30" />
      <div itemprop="location" itemscope itemtype="https://schema.org/Place" style="display:none">
        <meta itemprop="name" content="College of Engineering, Main Campus" />
        <div itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
          <meta itemprop="addressRegion" content="Kerala" />
          <meta itemprop="addressCountry" content="IN" />
        </div>
      </div>
      
      <div class="event-detail__nav">
        <a href="/events" class="back-link" data-navigo>
          <span class="arrow">←</span> BACK_TO_MISSION_CONTROL
        </a>
      </div>
      
      <div class="event-detail__content">
        <div class="event-detail__poster">
          <img src="${event.image}" alt="${event.title} Poster" itemprop="image" />
          <div class="poster-overlay"></div>
        </div>
        
        <div class="event-detail__body">
          <header class="detail-header">
            <span class="detail-category">${event.category}</span>
            <h1 class="detail-title" itemprop="name">${event.title}</h1>
            <span class="detail-id">${event.id}</span>
          </header>

          <div class="detail-description">
            <p itemprop="description">${event.desc}</p>
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

          <div class="detail-actions" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
            <meta itemprop="price" content="0" />
            <meta itemprop="priceCurrency" content="INR" />
            <a href="${event.regLink}" target="_blank" class="primary-reg-btn" itemprop="url">
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
