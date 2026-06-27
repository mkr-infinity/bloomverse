import * as THREE from 'three';

function mat(color: number, emissive = 0x000000, metalness = 0.45) {
  return new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity: emissive ? 0.45 : 0, roughness: 0.35, metalness });
}

function box(w: number, h: number, d: number, material: THREE.Material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  m.position.set(x, y, z);
  m.castShadow = true;
  return m;
}

function barrel(radius: number, length: number, material: THREE.Material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 10), material);
  m.rotation.x = Math.PI / 2;
  m.position.set(x, y, z);
  m.castShadow = true;
  return m;
}

export function createWeaponMesh(type: string, accentHex: string) {
  const accent = parseInt(accentHex.replace('#', ''), 16) || 0xffcc00;
  const dark = mat(0x151820);
  const metal = mat(0x2a3038);
  const accentMat = mat(accent, accent, 0.25);
  const weapon = new THREE.Group();

  // All weapons face +Z and attach to HumanoidParts.weaponMount.
  if (type === 'pistol') {
    weapon.add(box(0.1, 0.11, 0.32, dark, 0, 0, 0.12));
    weapon.add(box(0.08, 0.18, 0.08, metal, 0, -0.11, -0.02));
    weapon.add(barrel(0.035, 0.22, accentMat, 0, 0.02, 0.33));
  } else if (type === 'smg') {
    weapon.add(box(0.12, 0.12, 0.5, dark, 0, 0, 0.18));
    weapon.add(box(0.08, 0.24, 0.09, metal, 0, -0.16, 0.04));
    weapon.add(box(0.05, 0.08, 0.22, accentMat, 0, 0.05, 0.02));
    weapon.add(barrel(0.03, 0.26, accentMat, 0, 0.01, 0.48));
  } else if (type === 'rifle') {
    weapon.add(box(0.13, 0.13, 0.72, dark, 0, 0, 0.28));
    weapon.add(box(0.1, 0.12, 0.26, metal, 0, 0.02, -0.13));
    weapon.add(box(0.08, 0.22, 0.1, metal, 0, -0.16, 0.03));
    weapon.add(barrel(0.032, 0.34, accentMat, 0, 0.02, 0.7));
  } else if (type === 'shotgun') {
    weapon.add(box(0.16, 0.13, 0.78, dark, 0, 0, 0.24));
    weapon.add(barrel(0.04, 0.62, metal, -0.04, 0.04, 0.45));
    weapon.add(barrel(0.04, 0.62, metal, 0.04, 0.04, 0.45));
    weapon.add(box(0.12, 0.1, 0.32, accentMat, 0, -0.02, 0.02));
  } else if (type === 'sniper') {
    weapon.add(box(0.1, 0.12, 0.95, dark, 0, 0, 0.34));
    weapon.add(barrel(0.026, 0.58, accentMat, 0, 0.02, 0.82));
    weapon.add(barrel(0.055, 0.34, metal, 0, 0.16, 0.18));
    weapon.add(box(0.18, 0.08, 0.2, metal, 0, 0.01, -0.22));
  } else if (type === 'lmg') {
    weapon.add(box(0.18, 0.17, 0.82, dark, 0, 0, 0.28));
    weapon.add(box(0.26, 0.2, 0.18, accentMat, 0, -0.08, 0.03));
    weapon.add(barrel(0.045, 0.5, metal, 0, 0.03, 0.76));
    weapon.add(box(0.11, 0.1, 0.34, metal, 0, 0.13, 0.16));
  } else if (type === 'plasma') {
    weapon.add(box(0.18, 0.18, 0.64, dark, 0, 0, 0.22));
    weapon.add(new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), accentMat));
    weapon.children[weapon.children.length - 1].position.set(0, 0.02, 0.16);
    weapon.add(barrel(0.06, 0.35, accentMat, 0, 0.02, 0.56));
    weapon.add(box(0.08, 0.28, 0.08, metal, 0, -0.18, 0.04));
  } else {
    weapon.add(box(0.1, 0.12, 0.45, dark, 0, 0, 0.16));
    weapon.add(barrel(0.03, 0.28, accentMat, 0, 0.02, 0.43));
  }

  // Small muzzle marker used visually only; engine still owns bullet spawn.
  const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), accentMat);
  muzzle.position.set(0, 0.02, 0.78);
  muzzle.userData.muzzle = true;
  weapon.add(muzzle);

  weapon.scale.setScalar(1.15);
  return weapon;
}
