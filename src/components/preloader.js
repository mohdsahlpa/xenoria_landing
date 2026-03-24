import gsap from "gsap";

export function initPreloader(onComplete) {
  let preloader = document.querySelector('.preloader');
  
  if (!preloader) {
    preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
      <div class="preloader__inner">
        <div class="preloader__logo">XN<span>×</span>26</div>
        <div class="preloader__stars">
          ${Array(20).fill('<span></span>').join('')}
        </div>
        <div class="preloader__progress">
          <div class="preloader__bar"></div>
        </div>
      </div>
    `;
    document.body.appendChild(preloader);

    // Preloader Styles
    const style = document.createElement('style');
    style.textContent = `
      .preloader {
        position: fixed;
        inset: 0;
        background: var(--color-void);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      .preloader__inner {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 40px;
      }
      .preloader__logo {
        font-family: var(--font-hero);
        font-size: 4rem;
        font-weight: 900;
        letter-spacing: 0.2em;
        color: var(--color-text-primary);
      }
      .preloader__logo span { color: var(--color-nebula-cyan); }
      
      .preloader__stars {
        position: absolute;
        inset: -200px;
        pointer-events: none;
      }
      .preloader__stars span {
        position: absolute;
        top: 50%; left: 50%;
        width: 100px; height: 1px;
        background: linear-gradient(90deg, transparent, var(--color-nebula-cyan));
        transform-origin: left center;
      }
      .preloader__progress {
        width: 200px;
        height: 2px;
        background: rgba(255,255,255,0.1);
        border-radius: 2px;
        overflow: hidden;
      }
      .preloader__bar {
        width: 0%;
        height: 100%;
        background: var(--color-nebula-cyan);
        box-shadow: 0 0 10px var(--color-nebula-cyan);
      }
    `;
    document.head.appendChild(style);

    // Position stars radially
    const stars = preloader.querySelectorAll('.preloader__stars span');
    stars.forEach((star, i) => {
      const angle = (i / stars.length) * Math.PI * 2;
      gsap.set(star, {
        rotation: angle * (180 / Math.PI),
        x: Math.cos(angle) * 20,
        y: Math.sin(angle) * 20,
        scaleX: 0
      });
    });
  }

  const stars = preloader.querySelectorAll('.preloader__stars span');
  const tl = gsap.timeline({
    onComplete: () => {
      gsap.to(preloader, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(preloader, { display: 'none' }); // Don't remove, just hide
          if (onComplete) onComplete();
        }
      });
    }
  });

  gsap.set(preloader, { display: 'flex', opacity: 1 });
  gsap.set(".preloader__bar", { width: "0%" });
  gsap.set(stars, { scaleX: 0, opacity: 1 });
  gsap.set(".preloader__logo", { opacity: 1, scale: 1 });

  tl.to(".preloader__bar", { width: "100%", duration: 1.5, ease: "power2.inOut" })
    .to(stars, {
      scaleX: 60,
      opacity: 0,
      stagger: { amount: 0.6, from: "center" },
      ease: "warpOut",
      duration: 0.8
    }, "-=0.3")
    .to(".preloader__logo", { opacity: 0, scale: 1.3, duration: 0.5 }, "-=0.3");
}
