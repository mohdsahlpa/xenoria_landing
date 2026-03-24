import gsap from "gsap";
import '../styles/sections/faq.css';

export function initFAQ() {
  const faq = document.getElementById("faq");
  if (!faq) return;

  const faqData = [
    { 
      q: "Who can participate?", 
      a: "Open to all students from any college or university. Whether you're a freshman or a PhD candidate, curiosity is the only prerequisite." 
    },
    { 
      q: "What is the registration fee?", 
      a: "Fees vary from ₹0 to ₹500 depending on the event. Specific fee details can be found on individual event dossiers in the events section." 
    },
    { 
      q: "Is accommodation provided?", 
      a: "Yes, hostel accommodation is available on request for outstation participants. Please select the accommodation option during registration." 
    },
    { 
      q: "Will I get a certificate?", 
      a: "Yes, all participants will receive a verifiable digital certificate of participation, and winners will receive certificates of excellence." 
    }
  ];

  faq.innerHTML = `
    <div class="faq__container">
      <div class="section-header">
        <p class="section-label">QUERY :: INTERFACE</p>
        <h2 id="faq-heading">Frequently Asked Questions</h2>
      </div>
      <div class="faq__grid" role="list">
        ${faqData.map((item, i) => `
          <div class="faq__block" role="listitem">
            <button class="faq__trigger" aria-expanded="false" aria-controls="faq-desc-${i}">
              <span class="faq__label">${item.q}</span>
              <div class="faq__status">
                <span class="faq__status-icon"></span>
              </div>
            </button>
            <div id="faq-desc-${i}" class="faq__content" hidden>
              <div class="faq__content-inner">
                <div class="faq__content-body">
                  <p>${item.a}</p>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // FAQ Logic with refined animations
  const blocks = document.querySelectorAll(".faq__block");
  
  blocks.forEach(block => {
    const trigger = block.querySelector(".faq__trigger");
    const content = block.querySelector(".faq__content");
    const icon = block.querySelector(".faq__status-icon");

    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";

      // Close others for better focus
      blocks.forEach(other => {
        if (other !== block) {
          const otherTrigger = other.querySelector(".faq__trigger");
          if (otherTrigger.getAttribute("aria-expanded") === "true") {
            const otherContent = other.querySelector(".faq__content");
            gsap.to(otherContent, { height: 0, duration: 0.4, ease: "power2.inOut", onComplete: () => otherContent.setAttribute("hidden", "") });
            otherTrigger.setAttribute("aria-expanded", "false");
            other.classList.remove("is-open");
          }
        }
      });

      if (!isOpen) {
        content.removeAttribute("hidden");
        block.classList.add("is-open");
        gsap.fromTo(content, 
          { height: 0, opacity: 0 }, 
          { height: "auto", opacity: 1, duration: 0.5, ease: "power3.out" }
        );
        trigger.setAttribute("aria-expanded", "true");
      } else {
        block.classList.remove("is-open");
        gsap.to(content, { 
          height: 0, 
          opacity: 0,
          duration: 0.4, 
          ease: "power2.inOut", 
          onComplete: () => content.setAttribute("hidden", "") 
        });
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  });

  // Entrance Animation
  gsap.from(".faq__block", {
    scrollTrigger: {
      trigger: ".faq__grid",
      start: "top 85%"
    },
    opacity: 0,
    y: 40,
    duration: 1,
    stagger: 0.15,
    ease: "power4.out",
    clearProps: "all"
  });
}
