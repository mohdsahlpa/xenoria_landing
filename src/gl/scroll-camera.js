import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initScrollCamera(camera, planetObj, bloomPass) {
  const mainContent = document.getElementById("main-content");
  if (!mainContent) return;

  const config = {
    visibilityFactor: 0.65, 
    finalScale: 1.2, 
    finalOpacity: 0.9,
    
    // Phase 1: Entry into and through core (0.0 to 0.4)
    // Phase 2: Pull back and corner (0.4 to 0.8)
    vortexEntryEnd: 0.35,
    cornerStart: 0.4,
    cornerEnd: 0.8,
    bloomPeak: 0.35,   
  };

  // Path: Starts at 12, goes THROUGH the core to -1 (Vortex), then pulls back to 7 (Corner)
  const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 12),     
    new THREE.Vector3(0, 0, 4),      
    new THREE.Vector3(0, 0, -1.0),   // Deep inside/through
    new THREE.Vector3(0, 0, 3),      // Pulling back
    new THREE.Vector3(0, 0, 7.0),    // Final stable distance
  ]);

  const position = new THREE.Vector3();
  const baseBloom = 0.4;
  const peakBloom = 5.0; // Stronger flash for vortex entry

  const mm = gsap.matchMedia();

  mm.add({
    isDesktop: "(min-width: 993px)",
    isMobile: "(max-width: 992px)"
  }, (context) => {
    const { isMobile } = context.conditions;

    ScrollTrigger.getAll().forEach(st => {
      if (st.vars.trigger === "#main-content" && st.vars.id === "sphere-scroll") {
        st.kill();
      }
    });

    ScrollTrigger.create({
      id: "sphere-scroll",
      trigger: "#main-content",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2,
      onUpdate: (self) => {
        const progress = self.progress;
        
        // 1. PATH LOGIC - The camera moves along the curve (In then Out)
        path.getPoint(progress, position);
        
        // 2. SLIDE LOGIC - Cornering to Bottom-Left (happens after vortex entry)
        const slideProgress = gsap.utils.clamp(0, 1, gsap.utils.normalize(config.cornerStart, config.cornerEnd, progress));
        const swiftEase = gsap.parseEase("power2.inOut")(slideProgress);
        
        const vFOV = THREE.MathUtils.degToRad(camera.fov);
        
        // Reference distance for stable sliding visualization (avoiding jitter near 0)
        const refZ = Math.max(Math.abs(position.z), 3.0);
        const visibleHeight = 2 * Math.tan(vFOV / 2) * refZ;
        const visibleWidth = visibleHeight * camera.aspect;

        // Move camera TOP-RIGHT to place sphere center in BOTTOM-LEFT
        const factor = isMobile ? 0.35 : config.visibilityFactor;
        const targetX = (visibleWidth / 2) * factor;
        const targetY = (visibleHeight / 2) * factor;

        const cameraX = position.x + (swiftEase * targetX);
        const cameraY = position.y + (swiftEase * targetY);
        
        camera.position.set(cameraX, cameraY, position.z);
        camera.lookAt(cameraX, cameraY, 0);

        // 3. SPHERE BEHAVIOR - Rotation & Scaling
        if (planetObj) {
          // Extra rotation that increases as we corner
          const rotationSpeed = progress * Math.PI * 4;
          planetObj.group.rotation.y = rotationSpeed * 0.5;
          planetObj.group.rotation.z = rotationSpeed * 0.2;

          const baseScale = isMobile ? 0.8 : 1.0;
          const targetScale = isMobile ? 1.0 : config.finalScale;
          const scaleVal = baseScale + (swiftEase * (targetScale - baseScale));
          planetObj.group.scale.set(scaleVal, scaleVal, scaleVal);

          if (planetObj.planet.material) {
            // Fade slightly as we go through core, then stabilize
            const coreFade = 1.0 - (gsap.utils.clamp(0, 1, gsap.utils.normalize(0.25, 0.45, progress)) * 0.5);
            planetObj.planet.material.opacity = coreFade;
            planetObj.planet.material.transparent = true;
          }
        }

        // 4. BLOOM FLASH - Peaking at the vortex passage
        if (bloomPass) {
          const flashProgress = gsap.utils.clamp(0, 1, gsap.utils.normalize(config.bloomPeak - 0.15, config.bloomPeak + 0.15, progress));
          const intensity = Math.sin(flashProgress * Math.PI); 
          bloomPass.strength = baseBloom + (peakBloom * intensity);
        }
      }
    });
  });
}
