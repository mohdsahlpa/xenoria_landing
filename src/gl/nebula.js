import * as THREE from 'three';

export function createNebula() {
  const geometry = new THREE.PlaneGeometry(30, 30);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color(0xe36414) }, // Arrakis Orange
      uColor2: { value: new THREE.Color(0x1a1612) }, // Deep Umber
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec2 uResolution;
      varying vec2 vUv;

      // Noise function for heat haze / sandstorm effect
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        vec2 uv = vUv;
        
        // Circular mask to prevent "rectangular cutting"
        float dist = distance(uv, vec2(0.5));
        float alpha = smoothstep(0.5, 0.2, dist) * 0.15;

        float n = noise(uv + uTime * 0.05);
        vec3 color = mix(uColor1, uColor2, uv.y + n * 0.4);
        gl_FragColor = vec4(color, alpha); // Use calculated alpha for soft edges
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = -3;
  return mesh;
}

export function updateNebula(mesh, elapsed) {
  mesh.material.uniforms.uTime.value = elapsed;
}
