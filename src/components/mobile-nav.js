import gsap from "gsap";

export function initMobileNav() {
  if (document.getElementById('mobile-fab')) return;

  const overlay = document.createElement('div');
  overlay.className = 'mobile-fab-overlay';
  document.body.appendChild(overlay);

  const container = document.createElement('div');
  container.className = 'mobile-fab-container';
  container.id = 'mobile-fab';
  
  const linksData = [
    { path: '/', label: 'Home', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>' },
    { path: '/events', label: 'Events', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>' },
    { path: '/schedule', label: 'Schedule', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>' },
    { path: '/speakers', label: 'Speakers', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>' },
    { path: '/sponsors', label: 'Sponsors', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>' },
    { path: '/faq', label: 'FAQ', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>' }
  ];

  container.innerHTML = `
    <ul class="mobile-fab__menu">
      ${[...linksData].reverse().map(link => `
        <li class="mobile-fab__menu-item">
          <a href="${link.path}" data-nav="${link.path}" class="mobile-fab__item" aria-label="${link.label}">
            <span class="mobile-fab__item-label">${link.label}</span>
            ${link.icon}
          </a>
        </li>
      `).join('')}
    </ul>
    <button class="mobile-fab__toggle" aria-label="Toggle Menu" aria-expanded="false">
      <div class="fab-toggle__icon">
        <span class="fab-toggle__line"></span>
        <span class="fab-toggle__line"></span>
      </div>
    </button>
  `;

  document.body.appendChild(container);

  const toggleBtn = container.querySelector('.mobile-fab__toggle');
  const menuItems = container.querySelectorAll('.mobile-fab__menu-item');
  const links = container.querySelectorAll('.mobile-fab__item');
  let isExpanded = false;

  // Items are hidden and collapsed at the toggle position
  gsap.set(menuItems, { opacity: 0, scale: 0.5, y: 50, pointerEvents: 'none', display: 'none' });

  function toggleMenu() {
    isExpanded = !isExpanded;
    toggleBtn.setAttribute('aria-expanded', isExpanded);
    
    if (isExpanded) {
      container.classList.add('is-expanded');
      overlay.classList.add('is-active');
      gsap.set(menuItems, { display: 'block' });
      gsap.to(menuItems, {
        opacity: 1,
        scale: 1,
        y: 0,
        pointerEvents: 'auto',
        stagger: 0.05,
        duration: 0.4,
        ease: "back.out(1.7)"
      });
    } else {
      container.classList.remove('is-expanded');
      overlay.classList.remove('is-active');
      gsap.to(menuItems, {
        opacity: 0,
        scale: 0.5,
        y: 50,
        pointerEvents: 'none',
        stagger: { amount: 0.1, from: "end" },
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(menuItems, { display: 'none' });
        }
      });
    }
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  overlay.addEventListener('click', (e) => {
    if (isExpanded) toggleMenu();
  });

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-nav');
      toggleMenu();
      if (window.router) window.router.navigate(target);
    });
  });

  const updateActive = (path) => {
    links.forEach(link => {
      const href = link.getAttribute('data-nav');
      link.setAttribute('aria-current', href === path ? 'true' : 'false');
    });
  };

  window.updateMobileNavActive = updateActive;
}
