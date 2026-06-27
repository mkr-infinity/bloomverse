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
  const farFromCenter = () => {
    const x = (rand() - 0.5) * (w - 40), z = (rand() - 0.5) * (h - 40);
    return Math.hypot(x, z) < 30 ? null : { x, z };
  };

  if (theme.props === 'desert') {
    // dead trees + boulders
    for (let i = 0; i < 8; i++) {
      const p = farFromCenter(); if (!p) continue;
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 4 + rand() * 2, 6), propMat);
      trunk.position.set(p.x, 2 + rand(), p.z);
      // bare branches
      const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.2, 2, 4), propMat);
      branch.position.set(p.x + 0.6, 3.5, p.z); branch.rotation.z = 0.8;
      group.add(trunk, branch);
    }
    for (let i = 0; i < 10; i++) {
      const p = farFromCenter(); if (!p) continue;
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.6 + rand() * 1.2, 0), propMat);
      rock.position.set(p.x, 0.5, p.z); rock.rotation.set(rand(), rand(), rand());
      group.add(rock);
    }
  } else if (theme.props === 'city') {
    // shipping containers + concrete barriers + wrecked vehicles (boxes)
    for (let i = 0; i < 8; i++) {
      const p = farFromCenter(); if (!p) continue;
      const container = new THREE.Mesh(
        new THREE.BoxGeometry(3 + rand() * 2, 1.6, 6 + rand() * 3),
        new THREE.MeshStandardMaterial({ color: [0xb5532a, 0x2a5b8a, 0x4a7a3a, 0x8a8a2a][i % 4], roughness: 0.8 }),
      );
      container.position.set(p.x, 0.8, p.z); container.rotation.y = rand() * Math.PI;
      group.add(container);
    }
  } else if (theme.props === 'frozen') {
    // glowing ice crystals (emissive cyan spikes)
    const iceMat = new THREE.MeshStandardMaterial({ color: 0x9fdfff, emissive: 0x4aa0ff, emissiveIntensity: 0.6, roughness: 0.2, transparent: true, opacity: 0.85 });
    for (let i = 0; i < 14; i++) {
      const p = farFromCenter(); if (!p) continue;
      const s = 0.5 + rand() * 1.4;
      const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(s, 0), iceMat);
      crystal.position.set(p.x, s, p.z); crystal.rotation.set(rand(), rand(), rand());
      group.add(crystal);
    }
  } else if (theme.props === 'burning') {
    // scorched pillars with emissive lava cracks + ground ember light
    const lavaMat = new THREE.MeshStandardMaterial({ color: 0x2a0a04, emissive: 0xff4400, emissiveIntensity: 0.7, roughness: 0.9 });
    for (let i = 0; i < 8; i++) {
      const p = farFromCenter(); if (!p) continue;
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(1.5, 4 + rand() * 3, 1.5), lavaMat);
      pillar.position.set(p.x, 2 + rand() * 1.5, p.z);
      group.add(pillar);
    }
    const fire = new THREE.PointLight(0xff5a10, 2.5, 60, 2);
    fire.position.set((rand() - 0.5) * 30, 4, (rand() - 0.5) * 30);
    fire.userData.flicker = true; // scene animates this
    group.add(fire);
  } else if (theme.props === 'sky') {
    // floating islands beyond the floor edge — decorative, emissive rim
    const islandMat = new THREE.MeshStandardMaterial({ color: theme.ground, emissive: 0x3050a0, emissiveIntensity: 0.3, roughness: 0.9 });
    for (let i = 0; i < 8; i++) {
      const x = (rand() - 0.5) * w * 1.6, z = (rand() - 0.5) * h * 1.6;
      const y = -6 - rand() * 12;
      const island = new THREE.Mesh(new THREE.DodecahedronGeometry(5 + rand() * 7, 0), islandMat);
      island.position.set(x, y, z);
      group.add(island);
    }
  } else if (theme.props === 'void') {
    // emissive swirling shards
    const shardMat = new THREE.MeshStandardMaterial({ color: 0x200830, emissive: 0xb040ff, emissiveIntensity: 0.8, roughness: 0.6 });
    for (let i = 0; i < 12; i++) {
      const p = farFromCenter(); if (!p) continue;
      const shard = new THREE.Mesh(new THREE.TetrahedronGeometry(0.8 + rand() * 1.4, 0), shardMat);
      shard.position.set(p.x, 1 + rand() * 4, p.z);
      shard.userData.swirl = rand() * 6.28;
      group.add(shard);
    }
  }

  void half;
  return { group, colliders };
}
