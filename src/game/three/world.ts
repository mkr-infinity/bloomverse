import * as THREE from 'three';

// Per-world visual theme.
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
  city:    { ground: 0x23262f, groundAccent: 0x16181f, fog: 0x0c0e16, fogDensity: 0.010, hemiSky: 0x4a5270, hemiGround: 0x141418, sun: 0xffd9a0, sunIntensity: 1.1, ambient: 0.35, props: 'city' },
  desert:  { ground: 0x7a5c34, groundAccent: 0x4a3620, fog: 0xc99a5a, fogDensity: 0.012, hemiSky: 0xd9a066, hemiGround: 0x4a3620, sun: 0xffe0a0, sunIntensity: 1.4, ambient: 0.5,  props: 'desert' },
  frozen:  { ground: 0x9fc2d6, groundAccent: 0x4a6678, fog: 0xcfe4f0, fogDensity: 0.014, hemiSky: 0xd8e8f2, hemiGround: 0x4a6678, sun: 0xffffff, sunIntensity: 1.2, ambient: 0.55, props: 'frozen' },
  burning: { ground: 0x2a120a, groundAccent: 0x140604, fog: 0x3a0e08, fogDensity: 0.018, hemiSky: 0x5a2010, hemiGround: 0x140604, sun: 0xff7a30, sunIntensity: 1.3, ambient: 0.4,  props: 'burning' },
  sky:     { ground: 0x26305e, groundAccent: 0x141c3e, fog: 0x1a2348, fogDensity: 0.008, hemiSky: 0x5066a0, hemiGround: 0x141c3e, sun: 0xa0c0ff, sunIntensity: 1.3, ambient: 0.5,  props: 'sky' },
  void:    { ground: 0x15081e, groundAccent: 0x050308, fog: 0x05030a, fogDensity: 0.020, hemiSky: 0x3a1050, hemiGround: 0x050308, sun: 0xb040ff, sunIntensity: 1.0, ambient: 0.4,  props: 'void' },
};

export function getTheme(world: string): WorldTheme {
  return THEMES[world] || THEMES.city;
}

// Sky gradients per world: [top, mid, horizon]
const SKY_GRADIENTS: Record<string, [string, string, string]> = {
  city:    ['#07080f', '#101422', '#1c1830'],
  desert:  ['#7a2a08', '#c06018', '#e09038'],
  frozen:  ['#6a9ec0', '#a8c8e0', '#d8eeff'],
  burning: ['#1a0402', '#4a0c06', '#881a0a'],
  sky:     ['#04060e', '#0c1a50', '#1840a0'],
  void:    ['#020108', '#060310', '#140620'],
};

export function makeSkyMesh(world: string): THREE.Mesh {
  const colors = SKY_GRADIENTS[world] || SKY_GRADIENTS.city;
  const canvas = document.createElement('canvas');
  canvas.width = 2; canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0,    colors[0]);
  grad.addColorStop(0.45, colors[1]);
  grad.addColorStop(1,    colors[2]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 2, 256);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;

  const geo = new THREE.SphereGeometry(700, 32, 16);
  const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, depthWrite: false, fog: false });
  const sky = new THREE.Mesh(geo, mat);
  sky.renderOrder = -1;
  return sky;
}

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function buildArena(theme: WorldTheme, seed: number, w: number, h: number): {
  group: THREE.Group;
  colliders: { x: number; z: number; hw: number; hd: number }[];
} {
  const group = new THREE.Group();
  const colliders: { x: number; z: number; hw: number; hd: number }[] = [];
  const rand = seeded(seed);

  // Ground
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h, 1, 1),
    new THREE.MeshStandardMaterial({ color: theme.ground, roughness: 1 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  group.add(ground);

  // Subtle grid accent
  const grid = new THREE.GridHelper(Math.max(w, h), Math.max(w, h) / 4, theme.groundAccent, theme.groundAccent);
  (grid.material as THREE.Material).opacity = 0.28;
  (grid.material as THREE.Material).transparent = true;
  group.add(grid);

  // Arena boundary walls
  const wallMat = new THREE.MeshStandardMaterial({ color: theme.groundAccent, roughness: 0.9 });
  const wallH = 1.4;
  const addWall = (x: number, z: number, sw: number, sh: number) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(sw, wallH, sh), wallMat);
    m.position.set(x, wallH / 2, z);
    m.castShadow = true; m.receiveShadow = true;
    group.add(m);
  };
  addWall(0, -h / 2, w, 1.2);
  addWall(0,  h / 2, w, 1.2);
  addWall(-w / 2, 0, 1.2, h);
  addWall( w / 2, 0, 1.2, h);

  const propMat = new THREE.MeshStandardMaterial({ color: theme.ground, roughness: 0.85 });
  const addProp = (x: number, z: number, pw: number, ph: number, pd: number, color?: number) => {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(pw, ph, pd),
      new THREE.MeshStandardMaterial({ color: color ?? theme.groundAccent, roughness: 0.85 }),
    );
    m.position.set(x, ph / 2, z);
    m.castShadow = true; m.receiveShadow = true;
    group.add(m);
    colliders.push({ x, z, hw: pw / 2, hd: pd / 2 });
  };

  for (let i = 0; i < 14; i++) {
    const x = (rand() - 0.5) * (w - 60);
    const z = (rand() - 0.5) * (h - 60);
    if (Math.hypot(x, z) < 40) continue;
    const pw = 4 + rand() * 8;
    const pd = 4 + rand() * 8;
    const ph = theme.props === 'sky' ? 6 + rand() * 10 : 3 + rand() * 7;
    addProp(x, z, pw, ph, pd);
  }

  const farFromCenter = () => {
    const x = (rand() - 0.5) * (w - 40), z = (rand() - 0.5) * (h - 40);
    return Math.hypot(x, z) < 30 ? null : { x, z };
  };

  if (theme.props === 'city') {
    // Multi-story buildings with window detail and neon edge accents
    const buildingColors = [0xb5532a, 0x2a5b8a, 0x4a7a3a, 0x8a8a2a, 0x5a3a7a, 0x7a4a3a];
    for (let i = 0; i < 9; i++) {
      const p = farFromCenter(); if (!p) continue;
      const floors = 2 + Math.floor(rand() * 3);
      const bw = 3 + rand() * 4;
      const bd = 5 + rand() * 4;
      const floorH = 2.2 + rand() * 0.8;
      const col = buildingColors[i % buildingColors.length];
      // Stack floors with slight setbacks
      for (let f = 0; f < floors; f++) {
        const fw = bw * (1 - f * 0.08);
        const fd = bd * (1 - f * 0.08);
        const building = new THREE.Mesh(
          new THREE.BoxGeometry(fw, floorH, fd),
          new THREE.MeshStandardMaterial({ color: col, roughness: 0.8 }),
        );
        building.position.set(p.x, f * floorH + floorH / 2, p.z);
        building.castShadow = true; building.receiveShadow = true;
        group.add(building);
        // Window strips (emissive lines on each floor)
        const windowMat = new THREE.MeshStandardMaterial({ color: 0xffee88, emissive: 0xffee88, emissiveIntensity: 0.8 });
        const wRow = new THREE.Mesh(new THREE.BoxGeometry(fw + 0.02, 0.2, 0.05), windowMat);
        wRow.position.set(p.x, f * floorH + floorH * 0.7, p.z - fd / 2);
        group.add(wRow);
        const wRow2 = new THREE.Mesh(new THREE.BoxGeometry(fw + 0.02, 0.2, 0.05), windowMat);
        wRow2.position.set(p.x, f * floorH + floorH * 0.7, p.z + fd / 2);
        group.add(wRow2);
      }
      // Neon roof edge accent
      const neonColors = [0x00ffff, 0xff0066, 0x00ff44, 0xff8800];
      const neonCol = neonColors[i % neonColors.length];
      const neonMat = new THREE.MeshStandardMaterial({ color: neonCol, emissive: neonCol, emissiveIntensity: 2.5 });
      const roofEdge = new THREE.Mesh(new THREE.BoxGeometry(bw + 0.3, 0.15, bd + 0.3), neonMat);
      roofEdge.position.set(p.x, floors * floorH + 0.08, p.z);
      group.add(roofEdge);
      // Roof point light matching neon color
      const roofLight = new THREE.PointLight(neonCol, 0.8, 20, 2);
      roofLight.position.set(p.x, floors * floorH + 1.5, p.z);
      group.add(roofLight);
      colliders.push({ x: p.x, z: p.z, hw: bw / 2, hd: bd / 2 });
    }
    // Shipping containers
    for (let i = 0; i < 5; i++) {
      const p = farFromCenter(); if (!p) continue;
      const col = [0xb5532a, 0x2a5b8a, 0x4a7a3a, 0x8a8a2a][i % 4];
      const cw = 3 + rand() * 2, cd = 6 + rand() * 3;
      const container = new THREE.Mesh(
        new THREE.BoxGeometry(cw, 1.6, cd),
        new THREE.MeshStandardMaterial({ color: col, roughness: 0.8 }),
      );
      container.position.set(p.x, 0.8, p.z);
      container.rotation.y = rand() * Math.PI;
      container.castShadow = true; container.receiveShadow = true;
      group.add(container);
    }
    // Police strobe lights (2 pairs)
    const strobe1 = new THREE.PointLight(0xff2222, 3, 35, 2);
    strobe1.position.set(-w * 0.3, 5, -h * 0.2);
    strobe1.userData.strobe = 0;
    group.add(strobe1);
    const strobe2 = new THREE.PointLight(0x2244ff, 3, 35, 2);
    strobe2.position.set(-w * 0.3, 5, -h * 0.2);
    strobe2.userData.strobe = Math.PI; // out of phase
    group.add(strobe2);
    const strobe3 = new THREE.PointLight(0xff2222, 2.5, 30, 2);
    strobe3.position.set(w * 0.25, 5, h * 0.3);
    strobe3.userData.strobe = Math.PI * 0.5;
    group.add(strobe3);

  } else if (theme.props === 'desert') {
    // Dead trees + boulders
    for (let i = 0; i < 8; i++) {
      const p = farFromCenter(); if (!p) continue;
      const trunkH = 4 + rand() * 3;
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.6, trunkH, 7), propMat);
      trunk.position.set(p.x, trunkH / 2, p.z);
      const branch1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.2, 2.5, 5), propMat);
      branch1.position.set(p.x + 0.8, trunkH - 0.5, p.z); branch1.rotation.z = 0.7;
      const branch2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.18, 2, 5), propMat);
      branch2.position.set(p.x - 0.6, trunkH - 1, p.z + 0.3); branch2.rotation.z = -0.5;
      group.add(trunk, branch1, branch2);
    }
    for (let i = 0; i < 12; i++) {
      const p = farFromCenter(); if (!p) continue;
      const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.6 + rand() * 1.5, 0),
        new THREE.MeshStandardMaterial({ color: 0x8a7050, roughness: 0.95 }),
      );
      rock.position.set(p.x, 0.5, p.z); rock.rotation.set(rand() * 6, rand() * 6, rand() * 6);
      rock.castShadow = true;
      group.add(rock);
    }
    // Sandy dune mounds
    for (let i = 0; i < 6; i++) {
      const p = farFromCenter(); if (!p) continue;
      const dune = new THREE.Mesh(
        new THREE.SphereGeometry(2 + rand() * 3, 8, 6),
        new THREE.MeshStandardMaterial({ color: 0xa07040, roughness: 1 }),
      );
      dune.position.set(p.x, -0.5, p.z);
      dune.scale.y = 0.35;
      dune.receiveShadow = true;
      group.add(dune);
    }

  } else if (theme.props === 'frozen') {
    // Ice crystal clusters
    const iceMat = new THREE.MeshStandardMaterial({ color: 0x9fdfff, emissive: 0x4aa0ff, emissiveIntensity: 0.7, roughness: 0.15, transparent: true, opacity: 0.88 });
    for (let i = 0; i < 18; i++) {
      const p = farFromCenter(); if (!p) continue;
      // Cluster of 3-5 crystals
      const clusterCount = 2 + Math.floor(rand() * 3);
      for (let c = 0; c < clusterCount; c++) {
        const s = 0.4 + rand() * 1.6;
        const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(s, 0), iceMat);
        crystal.position.set(
          p.x + (rand() - 0.5) * 2.5,
          s * 0.8,
          p.z + (rand() - 0.5) * 2.5,
        );
        crystal.rotation.set(rand() * 0.6, rand() * 6, rand() * 0.6);
        crystal.castShadow = true;
        group.add(crystal);
      }
      // Ambient glow at cluster base
      const iceLight = new THREE.PointLight(0x80cfff, 0.4, 10, 2);
      iceLight.position.set(p.x, 1.5, p.z);
      group.add(iceLight);
    }
    // Snow mounds
    const snowMat = new THREE.MeshStandardMaterial({ color: 0xd8ecff, roughness: 0.95 });
    for (let i = 0; i < 10; i++) {
      const p = farFromCenter(); if (!p) continue;
      const mound = new THREE.Mesh(new THREE.SphereGeometry(1.5 + rand() * 2, 8, 6), snowMat);
      mound.position.set(p.x, -0.5, p.z);
      mound.scale.y = 0.4;
      mound.receiveShadow = true;
      group.add(mound);
    }

  } else if (theme.props === 'burning') {
    // Scorched crumbling pillars
    const lavaMat = new THREE.MeshStandardMaterial({ color: 0x2a0a04, emissive: 0xff4400, emissiveIntensity: 0.8, roughness: 0.9 });
    for (let i = 0; i < 10; i++) {
      const p = farFromCenter(); if (!p) continue;
      const ph = 3 + rand() * 5;
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(1.4, ph, 1.4), lavaMat);
      pillar.position.set(p.x, ph / 2, p.z);
      pillar.rotation.y = rand() * 0.2;
      pillar.rotation.z = (rand() - 0.5) * 0.12; // slight lean
      pillar.castShadow = true;
      group.add(pillar);
      // Lava crack glow at base
      const lavaLight = new THREE.PointLight(0xff5500, 1.8, 14, 2);
      lavaLight.position.set(p.x, 0.8, p.z);
      lavaLight.userData.flicker = true;
      group.add(lavaLight);
    }
    // Main fire light
    const mainFire = new THREE.PointLight(0xff6020, 3.5, 70, 2);
    mainFire.position.set(0, 5, 0);
    mainFire.userData.flicker = true;
    group.add(mainFire);
    // Burned-out vehicles (box shapes)
    for (let i = 0; i < 4; i++) {
      const p = farFromCenter(); if (!p) continue;
      const wreck = new THREE.Mesh(
        new THREE.BoxGeometry(2 + rand(), 1.2, 4 + rand()),
        new THREE.MeshStandardMaterial({ color: 0x1a0a04, emissive: 0x441100, emissiveIntensity: 0.3, roughness: 1 }),
      );
      wreck.position.set(p.x, 0.6, p.z);
      wreck.rotation.y = rand() * Math.PI;
      wreck.castShadow = true;
      group.add(wreck);
    }

  } else if (theme.props === 'sky') {
    // Tall glowing sky towers
    const towerMat = new THREE.MeshStandardMaterial({ color: theme.ground, emissive: 0x3050a0, emissiveIntensity: 0.5, roughness: 0.7 });
    for (let i = 0; i < 10; i++) {
      const p = farFromCenter(); if (!p) continue;
      const th = 6 + rand() * 12;
      const tw = 1.5 + rand() * 2;
      const tower = new THREE.Mesh(new THREE.BoxGeometry(tw, th, tw), towerMat);
      tower.position.set(p.x, th / 2, p.z);
      tower.castShadow = true;
      group.add(tower);
      // Beacon light at top
      const beacon = new THREE.PointLight(0x80a0ff, 1.2, 20, 2);
      beacon.position.set(p.x, th + 1, p.z);
      group.add(beacon);
    }
    // Floating islands below and around the arena
    const islandMat = new THREE.MeshStandardMaterial({ color: 0x2a3a70, emissive: 0x3050a0, emissiveIntensity: 0.35, roughness: 0.85 });
    for (let i = 0; i < 10; i++) {
      const x = (rand() - 0.5) * w * 1.8, z = (rand() - 0.5) * h * 1.8;
      const y = -5 - rand() * 15;
      const island = new THREE.Mesh(new THREE.DodecahedronGeometry(4 + rand() * 8, 0), islandMat);
      island.position.set(x, y, z);
      island.rotation.set(rand(), rand(), rand() * 0.3);
      group.add(island);
    }
    // Glowing rim around arena edge
    const rimLight = new THREE.PointLight(0x6080ff, 0.5, 50, 2);
    rimLight.position.set(0, 0, 0);
    group.add(rimLight);

  } else if (theme.props === 'void') {
    // Emissive shards + void heart
    const shardMat = new THREE.MeshStandardMaterial({ color: 0x200830, emissive: 0xb040ff, emissiveIntensity: 1.0, roughness: 0.5 });
    for (let i = 0; i < 16; i++) {
      const p = farFromCenter(); if (!p) continue;
      const sh = 1 + rand() * 2.5;
      const shard = new THREE.Mesh(new THREE.TetrahedronGeometry(0.7 + rand() * 1.6, 0), shardMat);
      shard.position.set(p.x, sh / 2, p.z);
      shard.userData.swirl = rand() * 6.28;
      group.add(shard);
      // Per-shard ambient light
      const shardLight = new THREE.PointLight(0xb040ff, 0.5, 12, 2);
      shardLight.position.set(p.x, sh, p.z);
      shardLight.userData.voidPulse = true;
      group.add(shardLight);
    }
    // Void heart — central void portal
    const voidMat = new THREE.MeshStandardMaterial({ color: 0x100020, emissive: 0x8000ff, emissiveIntensity: 1.5, roughness: 0.3, transparent: true, opacity: 0.8 });
    const portal = new THREE.Mesh(new THREE.TorusGeometry(4, 0.4, 12, 40), voidMat);
    portal.rotation.x = Math.PI / 2;
    portal.position.set(0, 0.3, 0);
    portal.userData.swirl = 0;
    group.add(portal);
    // Central void pulse light
    const voidHeart = new THREE.PointLight(0x8000ff, 2, 40, 2);
    voidHeart.position.set(0, 2, 0);
    voidHeart.userData.voidPulse = true;
    group.add(voidHeart);
  }

  void propMat;
  return { group, colliders };
}
