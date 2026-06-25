import * as THREE from 'three';

// Per-world visual theme. The engine's 2D plane (x = width, y = height) maps
// onto the 3D XZ plane (engine.x -> world.x, engine.y -> world.z), with Y up.
export interface WorldTheme {
  ground: number;
  groundAccent: number;
  fog: number;
  fogDensity: number;
  hemiSky: number;
  hemiGround: number;
  sun: number;
  sunIntensity: number;
  ambient: number;
  props: 'city' | 'desert' | 'frozen' | 'burning' | 'sky' | 'void';
}

const THEMES: Record<string, WorldTheme> = {
  city: { ground: 0x23262f, groundAccent: 0x16181f, fog: 0x0c0e16, fogDensity: 0.012, hemiSky: 0x4a5270, hemiGround: 0x141418, sun: 0xffd9a0, sunIntensity: 1.1, ambient: 0.35, props: 'city' },
  desert: { ground: 0x7a5c34, groundAccent: 0x4a3620, fog: 0xc99a5a, fogDensity: 0.014, hemiSky: 0xd9a066, hemiGround: 0x4a3620, sun: 0xffe0a0, sunIntensity: 1.4, ambient: 0.5, props: 'desert' },
  frozen: { ground: 0x9fc2d6, groundAccent: 0x4a6678, fog: 0xcfe4f0, fogDensity: 0.016, hemiSky: 0xd8e8f2, hemiGround: 0x4a6678, sun: 0xffffff, sunIntensity: 1.2, ambient: 0.55, props: 'frozen' },
  burning: { ground: 0x2a120a, groundAccent: 0x140604, fog: 0x3a0e08, fogDensity: 0.02, hemiSky: 0x5a2010, hemiGround: 0x140604, sun: 0xff7a30, sunIntensity: 1.3, ambient: 0.4, props: 'burning' },
  sky: { ground: 0x26305e, groundAccent: 0x141c3e, fog: 0x1a2348, fogDensity: 0.01, hemiSky: 0x5066a0, hemiGround: 0x141c3e, sun: 0xa0c0ff, sunIntensity: 1.3, ambient: 0.5, props: 'sky' },
  void: { ground: 0x15081e, groundAccent: 0x050308, fog: 0x05030a, fogDensity: 0.022, hemiSky: 0x3a1050, hemiGround: 0x050308, sun: 0xb040ff, sunIntensity: 1.0, ambient: 0.4, props: 'void' },
};

export function getTheme(world: string): WorldTheme {
  return THEMES[world] || THEMES.city;
}

// Deterministic pseudo-random from a seed so each level's prop layout is stable.
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Build the static arena for a level. Returns the group + a list of collider
// AABBs (XZ boxes) the gameplay layer can use for cover/obstacles later.
export function buildArena(theme: WorldTheme, seed: number, w: number, h: number): {
  group: THREE.Group;
  colliders: { x: number; z: number; hw: number; hd: number }[];
} {
  const group = new THREE.Group();
  const colliders: { x: number; z: number; hw: number; hd: number }[] = [];
  const rand = seeded(seed);

  // Ground plane
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshStandardMaterial({ color: theme.ground, roughness: 1 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  group.add(ground);

  // Grid accent for depth perception
  const grid = new THREE.GridHelper(Math.max(w, h), Math.max(w, h) / 4, theme.groundAccent, theme.groundAccent);
  (grid.material as THREE.Material).opacity = 0.35;
  (grid.material as THREE.Material).transparent = true;
  group.add(grid);

  // Arena boundary walls (low) so the player reads the play space
  const wallMat = new THREE.MeshStandardMaterial({ color: theme.groundAccent, roughness: 0.9 });
  const wallH = 1.2;
  const addWall = (x: number, z: number, sw: number, sh: number) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(sw, wallH, sh), wallMat);
    m.position.set(x, wallH / 2, z);
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
  };
  addWall(0, -h / 2, w, 1);
  addWall(0, h / 2, w, 1);
  addWall(-w / 2, 0, 1, h);
  addWall(w / 2, 0, 1, h);

  // Themed prop scatter. Props are simple boxes/cylinders placed away from center.
  const propMat = new THREE.MeshStandardMaterial({ color: theme.ground, roughness: 0.85 });
  const addProp = (x: number, z: number, pw: number, ph: number, pd: number, color?: number) => {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(pw, ph, pd),
      new THREE.MeshStandardMaterial({ color: color ?? theme.groundAccent, roughness: 0.85 }),
    );
    m.position.set(x, ph / 2, z);
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
    colliders.push({ x, z, hw: pw / 2, hd: pd / 2 });
  };

  const half = Math.min(w, h) / 2;
  for (let i = 0; i < 14; i++) {
    const x = (rand() - 0.5) * (w - 60);
    const z = (rand() - 0.5) * (h - 60);
    if (Math.hypot(x, z) < 40) continue; // keep center clear (spawn zone)
    const pw = 4 + rand() * 8;
    const pd = 4 + rand() * 8;
    const ph = theme.props === 'sky' ? 6 + rand() * 10 : 3 + rand() * 7;
    addProp(x, z, pw, ph, pd);
  }

  // World-specific flavor
  if (theme.props === 'desert') {
    for (let i = 0; i < 6; i++) {
      const x = (rand() - 0.5) * (w - 40), z = (rand() - 0.5) * (h - 40);
      if (Math.hypot(x, z) < 30) continue;
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 4, 6), propMat);
      trunk.position.set(x, 2, z);
      group.add(trunk);
    }
  } else if (theme.props === 'sky') {
    // floating islands beyond the floor edge — decorative
    for (let i = 0; i < 6; i++) {
      const x = (rand() - 0.5) * w * 1.6, z = (rand() - 0.5) * h * 1.6;
      const y = -8 - rand() * 10;
      const island = new THREE.Mesh(new THREE.DodecahedronGeometry(6 + rand() * 6, 0), propMat);
      island.position.set(x, y, z);
      group.add(island);
    }
  }

  void half;
  return { group, colliders };
}
