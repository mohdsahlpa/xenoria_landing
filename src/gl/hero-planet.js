import * as THREE from 'three';

export function createHeroPlanet() {
  const group = new THREE.Group();

  // Core Planet - High resolution
  const geometry = new THREE.SphereGeometry(3, 128, 128); 
  
  const material = new THREE.MeshStandardMaterial({
    color: 0x0a0908,
    emissive: 0x00e5ff, 
    emissiveIntensity: 0.2, 
    metalness: 0.9,
    roughness: 0.3, 
    side: THREE.DoubleSide
  });

  const planet = new THREE.Mesh(geometry, material);
  group.add(planet);

  // Iridescent Rim Light
  const fresnelGeo = new THREE.SphereGeometry(3.1, 128, 128);
  const fresnelMat = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      color1: { value: new THREE.Color(0x00e5ff) }, 
      color2: { value: new THREE.Color(0xe36414) }  
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        float fresnel = pow(1.0 - dot(vNormal, normalize(vViewPosition)), 3.0);
        vec3 color = mix(color1, color2, sin(uTime * 0.5) * 0.5 + 0.5);
        gl_FragColor = vec4(color, fresnel * 0.5);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const fresnelMesh = new THREE.Mesh(fresnelGeo, fresnelMat);
  group.add(fresnelMesh);

  // LIGHTS ANCHORED TO GROUP - Ensures they move with the sphere to prevent leaks
  const blueLight = new THREE.PointLight(0x00e5ff, 3, 40);
  blueLight.position.set(-8, 4, 8);
  group.add(blueLight);

  const orangeLight = new THREE.PointLight(0xfb8500, 3, 40);
  orangeLight.position.set(8, -4, 8);
  group.add(orangeLight);

  const ambientLight = new THREE.AmbientLight(0x161310, 0.6);
  group.add(ambientLight);

  return { group, planet, fresnelMesh };
}

export function updateHeroPlanet(planetObj, elapsed) {
  planetObj.planet.rotation.y = elapsed * 0.05;
  
  if (planetObj.fresnelMesh) {
    planetObj.fresnelMesh.material.uniforms.uTime.value = elapsed;
  }

  if (planetObj.planet.material) {
    const shift = Math.sin(elapsed * 0.5) * 0.5 + 0.5;
    planetObj.planet.material.emissive.lerpColors(
      new THREE.Color(0x00e5ff), 
      new THREE.Color(0xe36414), 
      shift
    );
  }
}
