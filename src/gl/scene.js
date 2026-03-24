import * as THREE from 'three';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';

import { initStarfield, updateStarfield } from './starfield';
import { createHeroPlanet, updateHeroPlanet } from './hero-planet';
import { initScrollCamera } from './scroll-camera';
import { createNebula, updateNebula } from './nebula';

export class GLScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);
    this.renderer.setClearColor(0x0c0b0a, 1);

    this.timer = new THREE.Timer();
    
    // Post Processing
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.4, 
      0.1, 
      0.1  
    );
    this.composer.addPass(this.bloomPass);

    const filmPass = new FilmPass(0.25, false);
    this.composer.addPass(filmPass);

    this.rgbShiftPass = new ShaderPass(RGBShiftShader);
    this.rgbShiftPass.uniforms['amount'].value = 0.0015;
    this.composer.addPass(this.rgbShiftPass);

    this.init();
    this.animate();

    window.addEventListener('resize', () => this.onResize());
  }

  init() {
    this.camera.position.z = 12;

    // Nebula
    this.nebula = createNebula();
    this.scene.add(this.nebula);
    
    // Starfield
    this.stars = initStarfield(this.scene);
    
    // Hero Planet
    this.planetObj = createHeroPlanet();
    this.scene.add(this.planetObj.group);
    
    // Initial responsive scale
    const scale = window.innerWidth <= 992 ? 0.6 : 1;
    this.planetObj.group.scale.set(scale, scale, scale);
  }

  reinitScroll() {
    this.isStatic = false;
    // Old method: Direct reset to centered home state
    this.camera.position.set(0, 0, 12);
    this.camera.lookAt(0, 0, 0);
    
    if (this.planetObj) {
      const scale = window.innerWidth <= 992 ? 0.6 : 1.0;
      this.planetObj.group.scale.set(scale, scale, scale);
    }

    initScrollCamera(this.camera, this.planetObj, this.bloomPass);
  }

  setStaticState() {
    this.isStatic = true;
    ScrollTrigger.getAll().forEach(st => {
      if (st.vars.id === "sphere-scroll") {
        st.kill();
      }
    });

    this.updateStaticPlacement();

    if (this.planetObj) {
      const width = window.innerWidth;
      const scale = width <= 992 ? 0.8 : 1.2;
      this.planetObj.group.scale.set(scale, scale, scale);
      if (this.planetObj.planet.material) {
        this.planetObj.planet.material.opacity = 0.9;
      }
    }
  }

  updateStaticPlacement() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;
    const vFOV = THREE.MathUtils.degToRad(this.camera.fov);
    
    const staticZ = 6.5;
    const visibleHeight = 2 * Math.tan(vFOV / 2) * staticZ;
    const visibleWidth = visibleHeight * aspect;

    const factor = width <= 992 ? 0.45 : 0.65;
    const tx = (visibleWidth / 2) * factor;
    const ty = (visibleHeight / 2) * factor;

    this.camera.position.set(tx, ty, staticZ);
    this.camera.lookAt(tx, ty, 0);
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(width, height, false);
    this.composer.setSize(width, height);

    if (this.isStatic) {
      this.updateStaticPlacement();
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.timer.update();
    const elapsed = this.timer.getElapsed();

    // Update Objects
    updateStarfield(this.stars);
    updateHeroPlanet(this.planetObj, elapsed);
    updateNebula(this.nebula, elapsed);

    // Render
    this.composer.render();
  }
}
