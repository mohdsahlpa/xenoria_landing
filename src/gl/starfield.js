import * as THREE from 'three';

export function initStarfield(scene) {
  const layers = [
    { count: 12000, size: 0.15, speed: 0.00003, depth: 400 }, // Ultra-fine dust
    { count: 8000, size: 0.3, speed: 0.00006, depth: 300 },   // Spice particles
    { count: 3000, size: 0.6, speed: 0.0001, depth: 200 },    // Subtle sand grains
  ];

  const stars = [];

  layers.forEach(({ count, size, depth, speed }) => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * depth;
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    
    const mat = new THREE.PointsMaterial({
      color: 0x5e544a, // Muted shadow sand color
      size, 
      sizeAttenuation: true,
      transparent: true, 
      opacity: 0.25 // Significantly reduced opacity
    });

    // Subtler spice blue highlights
    if (size > 0.4) {
      mat.color.set(0x00a8cc); // More muted blue
      mat.opacity = 0.35;
    }

    const points = new THREE.Points(geo, mat);
    scene.add(points);
    stars.push({ points, speed });
  });

  return stars;
}

export function updateStarfield(stars) {
  stars.forEach(({ points, speed }) => {
    points.rotation.y += speed;
    points.rotation.x += speed * 0.1;
  });
}
