import '../styles/sections/sponsors.css';

export function initSponsors() {
  const sponsors = document.getElementById("sponsors");
  if (!sponsors) return;

  const sponsorLogos = ["Google", "Microsoft", "Meta", "Nvidia", "AMD", "Intel", "OpenAI", "Anthropic"];

  sponsors.innerHTML = `
    <div class="sponsors__container">
      <div class="section-header">
        <p class="section-label">SYSTEM :: PARTNERS</p>
        <h2 id="sponsors-heading">Sponsors</h2>
      </div>

      <!-- Infinite marquee -->
      <div class="sponsors__marquee" aria-label="Sponsor logos (scrolling)" role="img">
        <div class="sponsors__marquee-track" aria-hidden="true">
          ${[...sponsorLogos, ...sponsorLogos].map(logo => `
            <div class="marquee-logo">${logo}</div>
          `).join('')}
        </div>
      </div>

      <!-- Tier grid -->
      <div class="sponsors__tiers">
        <div class="sponsors__tier" data-tier="title">
          <h3 class="tier-label">Title Sponsor</h3>
          <div class="tier-logos" role="list" aria-label="Title sponsor">
            <div class="sponsor-card" role="listitem">
              <span class="sponsor-name">SPACEX</span>
            </div>
          </div>
        </div>
        
        <div class="sponsors__tier" data-tier="gold">
          <h3 class="tier-label">Gold Tier</h3>
          <div class="tier-logos" role="list" aria-label="Gold sponsors">
            <div class="sponsor-card" role="listitem">
              <span class="sponsor-name">TESLA</span>
            </div>
            <div class="sponsor-card" role="listitem">
              <span class="sponsor-name">BLUE ORIGIN</span>
            </div>
          </div>
        </div>

        <div class="sponsors__tier" data-tier="gold">
          <h3 class="tier-label">Silver Tier</h3>
          <div class="tier-logos" role="list" aria-label="Silver sponsors">
            <div class="sponsor-card" role="listitem">
              <span class="sponsor-name">ORACLE</span>
            </div>
            <div class="sponsor-card" role="listitem">
              <span class="sponsor-name">ADOBE</span>
            </div>
            <div class="sponsor-card" role="listitem">
              <span class="sponsor-name">IBM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
