// Core Styles
import './styles/tokens.css';
import './styles/reset.css';
import './styles/typography.css';
import './styles/layout.css';
import './styles/dock.css';
import './styles/mobile-nav.css';
import './styles/cursor.css';

// Neo-Brutalist x Romantic Fusion Fonts
import '@fontsource/space-grotesk/700.css';
import '@fontsource/space-grotesk/600.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/fraunces/400-italic.css';
import '@fontsource/fraunces/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/300.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/orbitron/900.css';
import '@fontsource/orbitron/700.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import Navigo from 'navigo';

import { initLenis } from './utils/lenis-setup';
import { initDock } from './components/dock';
import { initMobileNav } from './components/mobile-nav';
import { initCursor } from './components/cursor';
import { initFooter } from './components/footer';
import { initA11y } from './utils/a11y';
import { initHero, revealHero } from './sections/hero';
import { initAbout } from './sections/about';

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger, CustomEase);

// Register Custom Eases
CustomEase.create("cosmicIn",    "M0,0 C0.12,0 0.18,1 1,1");
CustomEase.create("warpOut",     "M0,0 C0.4,0 0.2,1 1,1");
CustomEase.create("orbitFloat",  "M0,0 C0.45,0.05 0.55,0.95 1,1");

// Persistent components
let glSceneInstance = null;
let lenisInstance = null;
const router = new Navigo("/", { hash: false });

window.router = router;

function clearContent() {
  const main = document.getElementById('main-content');
  if (main) main.innerHTML = '';
  ScrollTrigger.getAll().forEach(st => st.kill());
}

async function handleRouteChange(path, initFn, isHome = false) {
  // If we are navigating AWAY from home or TO home from another page, clear.
  // But if it's the INITIAL load and it's home, don't clear (HTML is already there).
  const main = document.getElementById('main-content');
  const isInitialHome = isHome && main.querySelector('#hero') && main.querySelector('#about') && !window.hasNavigated;
  
  if (!isInitialHome) {
    clearContent();
  }
  
  await initFn();
  window.hasNavigated = true;
  
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate: true });
  }

  // Update dock active state
  const normalizedPath = "/" + path.replace(/^\//, "").replace(/\/$/, "");
  
  if (window.updateDockActive) {
    window.updateDockActive(normalizedPath);
  }

  if (window.updateMobileNavActive) {
    window.updateMobileNavActive(normalizedPath);
  }
  
  if (glSceneInstance) {
    if (isHome) {
      glSceneInstance.reinitScroll();
    } else {
      glSceneInstance.setStaticState();
    }
  }

  if (isHome) {
    revealHero();
  }

  // Ensure ScrollTrigger sees the new content
  setTimeout(() => {
    ScrollTrigger.refresh();
    // If glSceneInstance was initialized LATE, it might need another reinitScroll 
    // after ScrollTrigger.refresh() has established the page height.
    if (glSceneInstance && isHome) {
       glSceneInstance.reinitScroll();
    }
  }, 200);
}

document.addEventListener('DOMContentLoaded', async () => {
  initDock();
  initMobileNav();
  initFooter();
  initA11y();
  initCursor();

  lenisInstance = initLenis();
  window.lenis = lenisInstance;

  // Initialize GL Scene lazily
  const canvas = document.getElementById('starfield-canvas');
  if (canvas && !glSceneInstance) {
    import('./gl/scene').then(({ GLScene }) => {
      glSceneInstance = new GLScene(canvas);
      const currentPath = router.getCurrentLocation().url;
      const isHome = currentPath === "" || currentPath === "/";
      if (isHome) {
        glSceneInstance.reinitScroll();
      } else {
        glSceneInstance.setStaticState();
      }
    });
  }

  router
    .on("/", (match) => {
      handleRouteChange(match.url, () => {
        const main = document.getElementById('main-content');
        if (!main.querySelector('#hero')) {
          main.innerHTML = `
            <section id="hero" aria-label="Xenoria hero"></section>
            <section id="about" aria-labelledby="about-heading"></section>
          `;
        }
        initHero();
        initAbout();
      }, true);
    })
    .on("/events", (match) => {
      handleRouteChange(match.url, async () => {
        const { initEvents } = await import('./sections/events');
        const main = document.getElementById('main-content');
        main.innerHTML = '<section id="events" aria-labelledby="events-heading"></section>';
        initEvents();
      });
    })
    .on("/schedule", (match) => {
      handleRouteChange(match.url, async () => {
        const { initSchedule } = await import('./sections/schedule');
        const main = document.getElementById('main-content');
        main.innerHTML = '<section id="schedule" aria-labelledby="schedule-heading"></section>';
        initSchedule();
      });
    })
    .on("/speakers", (match) => {
      handleRouteChange(match.url, async () => {
        const { initSpeakers } = await import('./sections/speakers');
        const main = document.getElementById('main-content');
        main.innerHTML = '<section id="speakers" aria-labelledby="speakers-heading"></section>';
        initSpeakers();
      });
    })
    .on("/sponsors", (match) => {
      handleRouteChange(match.url, async () => {
        const { initSponsors } = await import('./sections/sponsors');
        const main = document.getElementById('main-content');
        main.innerHTML = '<section id="sponsors" aria-labelledby="sponsors-heading"></section>';
        initSponsors();
      });
    })
    .on("/faq", (match) => {
      handleRouteChange(match.url, async () => {
        const { initFAQ } = await import('./sections/faq');
        const main = document.getElementById('main-content');
        main.innerHTML = '<section id="faq" aria-labelledby="faq-heading"></section>';
        initFAQ();
      });
    })
    .on("/register", (match) => {
      handleRouteChange(match.url, async () => {
        const { initRegister } = await import('./sections/register');
        const main = document.getElementById('main-content');
        main.innerHTML = '<section id="register" aria-labelledby="register-heading"></section>';
        initRegister();
      });
    })
    .on("/event/:id", (match) => {
      handleRouteChange(match.url, async () => {
        const { initEventDetail } = await import('./sections/events');
        const main = document.getElementById('main-content');
        main.innerHTML = '<section id="event-detail"></section>';
        initEventDetail(match.data.id);
      });
    })
    .notFound(() => {
      router.navigate("/");
    })
    .resolve();
});
