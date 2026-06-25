import * as THREE from 'three';

// 3D humanoid built from primitives. Modeled facing +Z so the character's
// "forward" is +Z; orient with group.rotation.y = Math.PI/2 - aimAngle.
// Limb pivots sit at the hips/shoulders so walk animation rotates cleanly.

export interface HumanoidParts {
  group: THREE.Group;
  legL: THREE.Object3D;
  legR: THREE.Object3D;
  armL: THREE.Object3D;
  armR: THREE.Object3D;
  torso: THREE.Object3D;
  head: THREE.Object3D;
}

export interface HumanoidColors {
  skin: number;
  shirt: number;
  pants: number;
  hair: number;
  shoes: number;
  accent: number; // gun / detail
}

function mat(color: number, opts: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.05, ...opts });
}

// Pivot group: a parent at the joint position whose child mesh is offset down
// by half its length, so rotating the pivot swings the limb about the joint.
function limb(
  px: number, py: number, pz: number,
  w: number, h: number, d: number,
  material: THREE.Material,
): THREE.Object3D {
  const pivot = new THREE.Group();
  pivot.position.set(px, py, pz);
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.y = -h / 2;
  mesh.castShadow = true;
  pivot.add(mesh);
  return pivot;
}

export function createHumanoid(colors: HumanoidColors): HumanoidParts {
  const group = new THREE.Group();
  const skin = mat(colors.skin);
  const shirt = mat(colors.shirt);
  const pants = mat(colors.pants);
  const hair = mat(colors.hair);
  const shoes = mat(colors.shoes);
  const accent = mat(colors.accent, { metalness: 0.4, roughness: 0.4 });

  // Hips at y = 0.9, ground at 0. Total height ~1.9.
  // Legs
  const legL = limb(-0.13, 0.9, 0, 0.18, 0.85, 0.22, pants);
  const legR = limb(0.13, 0.9, 0, 0.18, 0.85, 0.22, pants);
  // shoe caps
  const shoeL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.3), shoes);
  shoeL.position.set(0, -0.85, 0.04);
  legL.add(shoeL);
  const shoeR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.3), shoes);
  shoeR.position.set(0, -0.85, 0.04);
  legR.add(shoeR);
  group.add(legL, legR);

  // Torso
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.28), shirt);
  torso.position.set(0, 1.5, 0);
  torso.castShadow = true;
  // accent chest strap
  const strap = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.08, 0.3), accent);
  strap.position.set(0, 1.65, 0);
  group.add(torso, strap);

  // Arms (shoulders at y ~1.8)
  const armL = limb(-0.32, 1.8, 0, 0.14, 0.62, 0.16, shirt);
  const armR = limb(0.32, 1.8, 0, 0.14, 0.62, 0.16, shirt);
  // hands
  const handL = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), skin);
  handL.position.y = -0.62;
  armL.add(handL);
  const handR = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), skin);
  handR.position.y = -0.62;
  armR.add(handR);
  group.add(armL, armR);

  // Neck + head
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.1, 8), skin);
  neck.position.set(0, 1.92, 0);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.32, 0.3), skin);
  head.position.set(0, 2.12, 0);
  head.castShadow = true;
  // hair cap
  const hairCap = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.32), hair);
  hairCap.position.set(0, 2.24, 0);
  group.add(neck, head, hairCap);

  // Gun held forward (+Z), attached to right arm pivot
  const gun = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.45), accent);
  gun.position.set(0.06, -0.5, 0.2);
  armR.add(gun);

  group.traverse((o) => { if ((o as THREE.Mesh).isMesh) o.castShadow = true; });

  return { group, legL, legR, armL, armR, torso, head };
}

// Drive a walk/idle pose. phase advances with time; moving toggles stride.
export function animateHumanoid(p: HumanoidParts, phase: number, moving: boolean, intensity = 1) {
  const s = moving ? 1 : 0.12;
  const swing = Math.sin(phase) * 0.5 * intensity * s;
  p.legL.rotation.x = swing;
  p.legR.rotation.x = -swing;
  p.armL.rotation.x = -swing * 0.8;
  // right arm holds the gun forward — keep it aimed, slight recoil idle
  p.armR.rotation.x = -1.2 + (moving ? Math.sin(phase) * 0.15 : 0);
  // subtle body bob
  p.torso.position.y = 1.5 + (moving ? Math.abs(Math.sin(phase)) * 0.05 : 0);
}

// === Enemies ===
const ZOMBIE_COLORS: Record<string, HumanoidColors> = {
  walker: { skin: 0x6f8a5a, shirt: 0x3a3a2a, pants: 0x2a2a1a, hair: 0x1a1a12, shoes: 0x111111, accent: 0x44ff44 },
  runner: { skin: 0x7a9a4a, shirt: 0x2a3a1a, pants: 0x202018, hair: 0x14140a, shoes: 0x0a0a0a, accent: 0xaaff00 },
  tank: { skin: 0x5a6a4a, shirt: 0x222831, pants: 0x1a1a1a, hair: 0x0a0a0a, shoes: 0x080808, accent: 0xff8800 },
  explosive: { skin: 0x7a8a3a, shirt: 0x5a3a1a, pants: 0x2a2010, hair: 0x14100a, shoes: 0x0a0808, accent: 0xffaa00 },
  boss: { skin: 0x4a3050, shirt: 0x1a0a1a, pants: 0x100510, hair: 0x0a050a, shoes: 0x050005, accent: 0xff00ff },
};

export function createZombieHumanoid(type: 'walker' | 'runner' | 'tank' | 'explosive' | 'boss'): HumanoidParts {
  const parts = createHumanoid(ZOMBIE_COLORS[type] || ZOMBIE_COLORS.walker);
  const scale = type === 'boss' ? 1.6 : type === 'tank' ? 1.3 : type === 'runner' ? 0.95 : 1;
  parts.group.scale.setScalar(scale);
  // Glowing eyes
  const eyeColor = type === 'boss' ? 0xff00ff : type === 'explosive' ? 0xffaa00 : 0xaaff00;
  const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor, emissive: eyeColor, emissiveIntensity: 2 });
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyeMat);
  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyeMat);
  eyeL.position.set(-0.07, 2.14, 0.16);
  eyeR.position.set(0.07, 2.14, 0.16);
  parts.group.add(eyeL, eyeR);
  return parts;
}

// Shambling animation for zombies — slower, lurching, arms reaching forward.
export function animateZombie(p: HumanoidParts, phase: number) {
  const swing = Math.sin(phase) * 0.35;
  p.legL.rotation.x = swing;
  p.legR.rotation.x = -swing;
  // arms reach forward (zombie pose)
  p.armL.rotation.x = -1.4 + Math.sin(phase * 0.7) * 0.2;
  p.armR.rotation.x = -1.4 + Math.sin(phase * 0.7 + 0.5) * 0.2;
  p.torso.position.y = 1.5 + Math.abs(Math.sin(phase)) * 0.03;
}
