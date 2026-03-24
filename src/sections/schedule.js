import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import '../styles/sections/schedule.css';

export function initSchedule() {
  const schedule = document.getElementById("schedule");
  if (!schedule) return;

  schedule.innerHTML = `
    <h2 id="schedule-heading" class="sr-only">Festival Schedule</h2>
    <div class="schedule__day-indicator" aria-live="polite" aria-label="Currently viewing day">
      <span class="day-label">TIMELINE <strong class="day-number">01</strong></span>
    </div>
    <div class="schedule__track" role="list">
      <div class="schedule__day" role="listitem" data-day="1" aria-label="Day 1 - Opening">
        <span class="day__bg-number" aria-hidden="true">01</span>
        <div class="day__content">
          <span class="day__date">March 14, 2026</span>
          <h3 class="day__title">First Contact</h3>
          <ul class="day__events" role="list">
            <li class="day__event-item">
              <time class="event-time">09:00</time>
              <span class="event-name">Inauguration Ceremony</span>
            </li>
            <li class="day__event-item">
              <time class="event-time">11:00</time>
              <span class="event-name">Keynote: Future of AI</span>
            </li>
            <li class="day__event-item">
              <time class="event-time">14:00</time>
              <span class="event-name">Hackathon Begins</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="schedule__day" role="listitem" data-day="2" aria-label="Day 2 - Transmission">
        <span class="day__bg-number" aria-hidden="true">02</span>
        <div class="day__content">
          <span class="day__date">March 15, 2026</span>
          <h3 class="day__title">Transmission</h3>
          <ul class="day__events" role="list">
            <li class="day__event-item">
              <time class="event-time">10:00</time>
              <span class="event-name">Robo Wars Prelims</span>
            </li>
            <li class="day__event-item">
              <time class="event-time">13:00</time>
              <span class="event-name">Paper Presentation</span>
            </li>
            <li class="day__event-item">
              <time class="event-time">16:00</time>
              <span class="event-name">Gaming Tournament</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="schedule__day" role="listitem" data-day="3" aria-label="Day 3 - Singularity">
        <span class="day__bg-number" aria-hidden="true">03</span>
        <div class="day__content">
          <span class="day__date">March 16, 2026</span>
          <h3 class="day__title">Singularity</h3>
          <ul class="day__events" role="list">
            <li class="day__event-item">
              <time class="event-time">10:00</time>
              <span class="event-name">Hackathon Finale</span>
            </li>
            <li class="day__event-item">
              <time class="event-time">14:00</time>
              <span class="event-name">Robo Wars Finals</span>
            </li>
            <li class="day__event-item">
              <time class="event-time">17:00</time>
              <span class="event-name">Awards Ceremony</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `;

  const track = document.querySelector(".schedule__track");
  const sections = gsap.utils.toArray(".schedule__day");
  const dayIndicator = document.querySelector(".day-number");

  const mm = gsap.matchMedia();

  mm.add("(min-width: 769px)", () => {
    // Horizontal Scroll
    gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: "#schedule",
        pin: true,
        scrub: 1,
        snap: 1 / (sections.length - 1),
        start: "top top",
        end: () => "+=" + track.offsetWidth,
        onUpdate: (self) => {
          const day = Math.round(self.progress * (sections.length - 1)) + 1;
          if (dayIndicator) dayIndicator.textContent = String(day).padStart(2, "0");
        }
      }
    });

    // Parallax background numbers
    sections.forEach((section) => {
      const bgNum = section.querySelector(".day__bg-number");
      gsap.to(bgNum, {
        x: 100,
        scrollTrigger: {
          trigger: section,
          containerAnimation: null, // This is tricky with pin, might need a different approach
          start: "left right",
          end: "right left",
          scrub: true
        }
      });
    });
  });

  mm.add("(max-width: 768px)", () => {
    sections.forEach((section, i) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 20%",
        end: "bottom 20%",
        onToggle: self => {
          if (self.isActive && dayIndicator) {
            dayIndicator.textContent = String(i + 1).padStart(2, "0");
          }
        }
      });
    });
  });
}
