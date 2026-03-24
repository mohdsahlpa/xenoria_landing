import gsap from "gsap";

export function initDock() {
  const dock = document.getElementById("dock");
  if (!dock) return;

  dock.innerHTML = `
    <div class="dock__container">
      <div class="dock__inner">
        <div class="dock__header">
          <a href="/" class="dock__logo" aria-label="XN×26 — Xenoria home" data-nav="/">XN<span>×</span>26</a>
          <span class="dock__active-display">HOME</span>
          <button class="dock__toggle" aria-label="Toggle Menu" aria-expanded="false">
            <span class="toggle__line"></span>
            <span class="toggle__line"></span>
          </button>
        </div>
        
        <nav class="dock__nav">
          <ul class="dock__links" role="list">
            <li><a href="/"          class="dock__link" data-nav="/" title="Home">
              <span class="dock__link-text">Home</span>
            </a></li>
            <li><a href="/events"    class="dock__link" data-nav="/events" title="Events">
              <span class="dock__link-text">Events</span>
            </a></li>
            <li><a href="/schedule"  class="dock__link" data-nav="/schedule" title="Schedule">
              <span class="dock__link-text">Schedule</span>
            </a></li>
            <li><a href="/speakers"  class="dock__link" data-nav="/speakers" title="Speakers">
              <span class="dock__link-text">Speakers</span>
            </a></li>
            <li><a href="/sponsors"  class="dock__link" data-nav="/sponsors" title="Sponsors">
              <span class="dock__link-text">Sponsors</span>
            </a></li>
            <li><a href="/faq"       class="dock__link" data-nav="/faq" title="FAQ">
              <span class="dock__link-text">FAQ</span>
            </a></li>
          </ul>
        </nav>
      </div>
    </div>
  `;

  const router = window.router;
  const inner = dock.querySelector(".dock__inner");
  const toggle = dock.querySelector(".dock__toggle");
  const activeDisplay = dock.querySelector(".dock__active-display");
  let isExpanded = false;

  function toggleDock() {
    isExpanded = !isExpanded;
    toggle.setAttribute("aria-expanded", isExpanded);
    inner.classList.toggle("is-expanded", isExpanded);

    if (isExpanded) {
      gsap.to(".toggle__line:nth-child(1)", { y: 4, rotation: 45, duration: 0.3 });
      gsap.to(".toggle__line:nth-child(2)", { y: -4, rotation: -45, duration: 0.3 });
      gsap.from(".dock__link", { 
        opacity: 0, 
        y: -10, 
        stagger: 0.05, 
        duration: 0.4, 
        delay: 0.1 
      });
    }
    else {
      gsap.to(".toggle__line", { y: 0, rotation: 0, duration: 0.3 });
    }
  }

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleDock();
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (isExpanded && !inner.contains(e.target)) {
      toggleDock();
    }
  });

  function updateActiveLink(path) {
    const allLinks = dock.querySelectorAll("[data-nav]");
    allLinks.forEach(el => {
      const href = el.getAttribute("data-nav");
      const isActive = href === path;
      el.setAttribute("aria-current", isActive ? "true" : "false");
      
      if (isActive && !el.classList.contains('dock__logo')) {
        activeDisplay.innerText = el.innerText.toUpperCase();
      }
    });

    if (path === "/") {
      activeDisplay.innerText = "HOME";
    }
  }

  window.updateDockActive = updateActiveLink;

  dock.querySelectorAll("[data-nav]").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.getAttribute("data-nav");
      if (isExpanded) toggleDock();
      router.navigate(target);
    });
  });
}
