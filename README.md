# Xenoria — TechFest 2026

**Xenoria** is a production-grade, immersive single-page web application built for a college technical festival. It features a **Deep Space / Cosmic Dark** aesthetic with high-performance 3D visuals, smooth scroll-driven animations, and a custom UI system.

---

## 🚀 Tech Stack

### Frontend Core
- **Vanilla JS (ES2022+)**: Zero framework overhead for maximum performance.
- **Vite**: Ultra-fast build tool and development server.
- **Three.js**: Powers the 3D hero scene, starfield backgrounds, and cosmic effects.
- **GSAP (GreenSock)**: Orchestrates all UI animations and scroll-triggered transitions.
- **Lenis**: Provides high-quality smooth scrolling integrated with the GSAP ticker.
- **Navigo**: Handles client-side routing for seamless section transitions.

### Aesthetics & UI
- **Vanilla CSS**: Custom design system with glassmorphism and cosmic color tokens.
- **Typography**: Space Grotesk, Orbitron, Inter, and JetBrains Mono.
- **Custom Cursor**: A GSAP-powered interactive cursor system with context-aware states.

### Deployment & DevOps
- **Cloudflare Pages**: High-performance edge hosting.
- **Wrangler**: CLI for Cloudflare deployment and environment management.
- **Node.js**: Version 20.x (managed via `.nvmrc`).

---

## ✨ Features

- **Interactive 3D Hero**: A Three.js icosahedron "planet" with Fresnel glows and nebula shaders.
- **Smooth Scroll Architecture**: Integrated Lenis + GSAP ScrollTrigger for a cinematic experience.
- **Dynamic Event System**: Data-driven event cards with category filtering.
- **Horizontal Schedule**: A pinned horizontal scroll track for the 3-day event timeline.
- **Glassmorphic UI**: High-end translucent panels with glow effects and backdrop blurs.
- **Responsive Design**: Mobile-optimized layouts with a dedicated mobile navigation system.
- **Performance Optimized**: 
  - Sub-second LCP.
  - Zero layout shifts (CLS).
  - Optimized font loading and asset management.

---

## 🛠️ Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v20.x recommended)
- [npm](https://www.npmjs.com/)

### Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mohdsahlpa/xenoria_landing.git
   cd xenoria_landing
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

### Project Structure
```text
├── src/
│   ├── components/    # Reusable UI (Dock, Cursor, Footer, etc.)
│   ├── gl/            # Three.js / WebGL logic (Starfield, Nebula, etc.)
│   ├── sections/      # Page sections (Hero, About, Events, etc.)
│   ├── styles/        # Modular CSS system
│   ├── utils/         # Helpers (A11y, Lenis setup, etc.)
│   └── main.js        # App entry point & Router
├── public/            # Static assets
├── wrangler.jsonc     # Cloudflare Pages configuration
└── vite.config.js     # Vite build settings
```

---

## 🌐 Deployment

The project is configured for **Cloudflare Pages**. 

### Manual Deploy
```bash
npm run deploy
```

### Routing Note
SPA routing is handled via `wrangler.jsonc` using the `not_found_handling: "single-page-application"` setting. Do not add a manual `_redirects` file as it may cause infinite loops.

---

## 📄 License
This project is for educational and showcase purposes for the College Technical Fest. All rights reserved.
