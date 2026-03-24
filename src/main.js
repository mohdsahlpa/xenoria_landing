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
import { initPreloader } from './components/preloader';
import { initFooter } from './components/footer';
import { initA11y } from './utils/a11y';
import { initHero, revealHero } from './sections/hero';
import { initAbout } from './sections/about';
import { initEvents, initEventDetail } from './sections/events';
import { initSchedule } from './sections/schedule';
import { initSpeakers } from './sections/speakers';
import { initSponsors } from './sections/sponsors';
import { initFAQ } from './sections/faq';
import { initRegister } from './sections/register';
import { GLScene } from './gl/scene';

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

function handleRouteChange(path, initFn, isHome = false) {
  clearContent();
  initFn();
  
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate: true });
  }

  // Update dock active state with a robust normalized path
  const normalizedPath = "/" + path.replace(/^\//, "").replace(/\/$/, "");
  
  // We need to expose a way to update the dock and mobile nav
  const dock = document.getElementById("dock");
  if (dock && window.updateDockActive) {
    window.updateDockActive(normalizedPath);
  }

  const mobileNav = document.getElementById("mobile-fab");
  if (mobileNav && window.updateMobileNavActive) {
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

  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);
}

document.addEventListener('DOMContentLoaded', () => {
  initDock();
  initMobileNav();
  initFooter();
  initA11y();
  initCursor();

  const canvas = document.getElementById('starfield-canvas');
  if (canvas && !glSceneInstance) {
    glSceneInstance = new GLScene(canvas);
  }

  lenisInstance = initLenis();
  window.lenis = lenisInstance;

  router
    .on("/", (match) => {
      handleRouteChange(match.url, () => {
        const main = document.getElementById('main-content');
        main.innerHTML = `
          <section id="hero" aria-label="Xenoria hero"></section>
          <section id="about" aria-labelledby="about-heading"></section>
        `;
        initHero();
        initAbout();
      }, true);
    })
    .on("/events", (match) => {
      handleRouteChange(match.url, () => {
        const main = document.getElementById('main-content');
        main.innerHTML = '<section id="events" aria-labelledby="events-heading"></section>';
        initEvents();
      });
    })
    .on("/schedule", (match) => {
      handleRouteChange(match.url, () => {
        const main = document.getElementById('main-content');
        main.innerHTML = '<section id="schedule" aria-labelledby="schedule-heading"></section>';
        initSchedule();
      });
    })
    .on("/speakers", (match) => {
      handleRouteChange(match.url, () => {
        const main = document.getElementById('main-content');
        main.innerHTML = '<section id="speakers" aria-labelledby="speakers-heading"></section>';
        initSpeakers();
      });
    })
    .on("/sponsors", (match) => {
      handleRouteChange(match.url, () => {
        const main = document.getElementById('main-content');
        main.innerHTML = '<section id="sponsors" aria-labelledby="sponsors-heading"></section>';
        initSponsors();
      });
    })
    .on("/faq", (match) => {
      handleRouteChange(match.url, () => {
        const main = document.getElementById('main-content');
        main.innerHTML = '<section id="faq" aria-labelledby="faq-heading"></section>';
        initFAQ();
      });
    })
    .on("/register", (match) => {
      handleRouteChange(match.url, () => {
        const main = document.getElementById('main-content');
        main.innerHTML = '<section id="register" aria-labelledby="register-heading"></section>';
        initRegister();
      });
    })
    .on("/event/:id", (match) => {
      handleRouteChange(match.url, () => {
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
