import gsap from "gsap";
import '../styles/sections/register.css';

export function initRegister() {
  const register = document.getElementById("register");
  if (!register) return;

  register.innerHTML = `
    <div class="register__container">
      <div class="register__content">
        <span class="register__label">LIMITED :: CAPACITY</span>
        <h2 id="register-heading">Your Mission<br>Starts <em>Now</em></h2>
        <p class="register__sub">Registration closes March 10, 2026. Entry fee from ₹0 to ₹500 depending on the challenge.</p>
        
        <div class="register__countdown" aria-label="Time remaining to register">
          <div class="countdown-unit"><span class="countdown-val" id="cd-days">12</span><span>Days</span></div>
          <div class="countdown-unit"><span class="countdown-val" id="cd-hours">08</span><span>Hours</span></div>
          <div class="countdown-unit"><span class="countdown-val" id="cd-mins">45</span><span>Mins</span></div>
        </div>

        <a href="https://register.xenoria.edu" class="cta__button" aria-label="Register for Xenoria 2026" target="_blank" rel="noopener">
          Initialize Launch
          <span class="cta__button-glow" aria-hidden="true"></span>
        </a>
      </div>
    </div>
  `;

  // GSAP Animation
  const ctaTl = gsap.timeline({
    scrollTrigger: { 
      trigger: "#register", 
      start: "top 75%"
    }
  });

  ctaTl
    .from(".register__label",   { opacity: 0, letterSpacing: "1.5em", duration: 1, ease: "power3.out" })
    .from("#register-heading",  { opacity: 0, y: 50, duration: 1, ease: "power4.out" }, "-=0.6")
    .from(".register__sub",     { opacity: 0, y: 20, duration: 0.8 }, "-=0.7")
    .from(".register__countdown", { opacity: 0, scale: 0.95, duration: 1, ease: "power2.out" }, "-=0.6")
    .from(".countdown-unit",    { opacity: 0, y: 15, stagger: 0.1, duration: 0.5 }, "-=0.5")
    .from(".cta__button",       { opacity: 0, y: 30, duration: 0.8, ease: "back.out(1.7)" }, "-=0.4");
}
