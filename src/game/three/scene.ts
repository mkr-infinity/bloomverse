import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { GameState, LevelDef } from '../engine';
import { CharacterSkin } from '../characters';
import { getTheme, buildArena, makeSkyMesh } from './world';
import { createHumanoid, animateHumanoid, HumanoidParts, createZombieHumanoid, animateZombie } from './humanoid';
import { createWeaponMesh } from './weapons3d';

// Chromatic aberration + vignette pass
const ChromaVignetteShader = {
  uniforms: {
    tDiffuse: { value: null },
    chromaStrength: { value: 0.0015 },
    vignetteStrength: { value: 0.55 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float chromaStrength;
    uniform float vignetteStrength;
    varying vec2 vUv;
    void main() {
      vec2 dir = vUv - vec2(0.5);
      float dist = length(dir);
      vec2 off = normalize(dir + 0.0001) * dist * dist * chromaStrength;
      float r = texture2D(tDiffuse, vUv + off).r;
      float g = texture2D(tDiffuse, vUv).g;
      float b = texture2D(tDiffuse, vUv - off).b;
      float vig = 1.0 - dist * dist * vignetteStrength * 2.2;
      gl_FragColor = vec4(r * vig, g * vig, b * vig, 1.0);
    }
  `,
};

function skinToColors(skin: CharacterSkin) {
  const hex = (s: string) => parseInt(s.replace('#', ''), 16);
  return {
    skin: hex(skin.skinTone),
    shirt: hex(skin.shirtColor),
    pants: hex(skin.pantsColor),
    hair: hex(skin.hairColor),
    shoes: hex(skin.shoeColor),
    accent: hex(skin.accent),
  };
}

interface EnemyView {
  parts: HumanoidParts;
  hpBar: THREE.Sprite;
  bossLight?: THREE.PointLight;
}

interface ShellCasing {
  mesh: THREE.Mesh;
  vy: number; vx: number; vz: number;
  rotX: number; rotZ: number;
  age: number;
}

interface AtmoParticle {
  mesh: THREE.Mesh;
  vx: number; vy: number; vz: number;
  baseX: number; baseZ: number;
  phase: number;
}

export class GameScene3D {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;

  private composer: EffectComposer;
  private bloomPass: UnrealBloomPass;
  private chromaPass: ShaderPass;

  private sun: THREE.DirectionalLight;
  private playerParts!: HumanoidParts;
  private enemyViews = new Map<Enemy_id, EnemyView>();

  private bulletGroup = new THREE.Group();
  private enemyBulletGroup = new THREE.Group();
  private coverGroup = new THREE.Group();
  private pickupGroup = new THREE.Group();
  private particleGroup = new THREE.Group();
  private atmoGroup = new THREE.Group();
  private shellGroup = new THREE.Group();

  private muzzle: THREE.PointLight;
  private playerForward = new THREE.Vector3(0, 0, 1);
  private animPhase = 0;
  private aimMarker!: THREE.Mesh;
  private currentWeaponKey = '';
  private worldType = 'city';

  // Camera state
  private introTimer = 2.4;
  private camTargetPos = new THREE.Vector3();
  private camTargetLook = new THREE.Vector3();
  private arenaW = 320;
  private arenaH = 180;
  private fovCurrent = 60;
  private fovTarget = 60;
  private fovKickTimer = 0;

  // Shell casings
  private activeCasings: ShellCasing[] = [];
  private casingPool: ShellCasing[] = [];
  private casingGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.2, 6);
  private casingMat = new THREE.MeshStandardMaterial({ color: 0xddaa44, metalness: 0.9, roughness: 0.25 });
  private lastFireFrame = -9;

  // Atmospheric particles
  private atmoParticles: AtmoParticle[] = [];

  constructor(public canvas: HTMLCanvasElement, level: LevelDef, skin: CharacterSkin) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    this.worldType = level.world;
    this.scene = new THREE.Scene();
    const theme = getTheme(level.world);
    this.scene.fog = new THREE.FogExp2(theme.fog, theme.fogDensity);

    // Gradient sky sphere
    this.scene.add(makeSkyMesh(level.world));

    // Lighting
    const hemi = new THREE.HemisphereLight(theme.hemiSky, theme.hemiGround, theme.ambient);
    this.scene.add(hemi);

    this.sun = new THREE.DirectionalLight(theme.sun, theme.sunIntensity);
    this.sun.position.set(40, 80, 30);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.camera.left = -120;
    this.sun.shadow.camera.right = 120;
    this.sun.shadow.camera.top = 120;
    this.sun.shadow.camera.bottom = -120;
    this.sun.shadow.camera.far = 300;
    this.sun.shadow.bias = -0.0005;
    this.scene.add(this.sun);

    // Arena
    const W = 1280 / 4, H = 720 / 4;
    this.arenaW = W;
    this.arenaH = H;
    const arena = buildArena(theme, level.id * 31, W, H);
    this.scene.add(arena.group);

    // Player
    this.playerParts = createHumanoid(skinToColors(skin));
    this.scene.add(this.playerParts.group);

    this.scene.add(
      this.bulletGroup, this.enemyBulletGroup,
      this.coverGroup, this.pickupGroup,
      this.particleGroup, this.atmoGroup, this.shellGroup,
    );

    // Muzzle flash light
    this.muzzle = new THREE.PointLight(0xffd070, 0, 20, 2);
    this.scene.add(this.muzzle);

    // Aim marker
    this.aimMarker = new THREE.Mesh(
      new THREE.RingGeometry(0.6, 0.9, 24),
      new THREE.MeshBasicMaterial({ color: 0xff2d55, transparent: true, opacity: 0.7, side: THREE.DoubleSide }),
    );
    this.aimMarker.rotation.x = -Math.PI / 2;
    this.scene.add(this.aimMarker);

    // Camera — start high for intro pan
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1200);
    this.camera.position.set(0, 110, 10);
    this.camera.lookAt(0, 0, 0);

    // Post-processing
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.52,  // strength
      0.42,  // radius
      0.26,  // threshold — emissives + highlights only
    );
    this.composer.addPass(this.bloomPass);

    this.chromaPass = new ShaderPass(ChromaVignetteShader);
    this.chromaPass.uniforms.chromaStrength.value = 0.0012;
    this.composer.addPass(this.chromaPass);

    this.composer.addPass(new OutputPass());

    // Atmospheric particles
    this.initAtmoParticles(level.world);

    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);
  }

  // ── Atmospheric particle systems ────────────────────────────────────────────

  private initAtmoParticles(world: string) {
    if (world === 'frozen') {
      const geo = new THREE.SphereGeometry(0.07, 4, 4);
      for (let i = 0; i < 90; i++) {
        const mat = new THREE.MeshBasicMaterial({ color: 0xd8f0ff, transparent: true, opacity: 0.65 });
        const m = new THREE.Mesh(geo, mat);
        const bx = (Math.random() - 0.5) * this.arenaW;
        const bz = (Math.random() - 0.5) * this.arenaH;
        m.position.set(bx, 8 + Math.random() * 6, bz);
        this.atmoGroup.add(m);
        this.atmoParticles.push({
          mesh: m, vx: (Math.random() - 0.5) * 0.018, vy: -(0.025 + Math.random() * 0.04),
          vz: (Math.random() - 0.5) * 0.018, baseX: bx, baseZ: bz, phase: Math.random() * Math.PI * 2,
        });
      }
    } else if (world === 'burning') {
      for (let i = 0; i < 70; i++) {
        const col = new THREE.Color().setHSL(0.04 + Math.random() * 0.06, 1, 0.5 + Math.random() * 0.35);
        const m = new THREE.Mesh(
          new THREE.SphereGeometry(0.05 + Math.random() * 0.09, 4, 4),
          new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 3.5 }),
        );
        const bx = (Math.random() - 0.5) * this.arenaW;
        const bz = (Math.random() - 0.5) * this.arenaH;
        m.position.set(bx, Math.random() * 2, bz);
        this.atmoGroup.add(m);
        this.atmoParticles.push({
          mesh: m, vx: (Math.random() - 0.5) * 0.03, vy: 0.04 + Math.random() * 0.07,
          vz: (Math.random() - 0.5) * 0.03, baseX: bx, baseZ: bz, phase: Math.random() * Math.PI * 2,
        });
      }
    } else if (world === 'void') {
      for (let i = 0; i < 35; i++) {
        const col = new THREE.Color(0.45 + Math.random() * 0.25, 0, 0.75 + Math.random() * 0.25);
        const m = new THREE.Mesh(
          new THREE.SphereGeometry(0.18 + Math.random() * 0.28, 6, 6),
          new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 2.8, transparent: true, opacity: 0.55 }),
        );
        const bx = (Math.random() - 0.5) * this.arenaW;
        const bz = (Math.random() - 0.5) * this.arenaH;
        m.position.set(bx, 0.8 + Math.random() * 2.5, bz);
        this.atmoGroup.add(m);
        this.atmoParticles.push({
          mesh: m, vx: (Math.random() - 0.5) * 0.01, vy: 0,
          vz: (Math.random() - 0.5) * 0.01, baseX: bx, baseZ: bz, phase: Math.random() * Math.PI * 2,
        });
      }
    }
  }

  private updateAtmoParticles(dt: number) {
    const t = this.animPhase;
    for (const p of this.atmoParticles) {
      p.phase += dt;
      if (this.worldType === 'frozen') {
        p.mesh.position.x += p.vx + Math.sin(p.phase * 0.6) * 0.005;
        p.mesh.position.y += p.vy;
        p.mesh.position.z += p.vz;
        if (p.mesh.position.y < 0) {
          p.mesh.position.set(
            p.baseX + (Math.random() - 0.5) * 25,
            11 + Math.random() * 5, p.baseZ + (Math.random() - 0.5) * 25,
          );
        }
      } else if (this.worldType === 'burning') {
        p.mesh.position.x += p.vx + Math.sin(t + p.phase) * 0.008;
        p.mesh.position.y += p.vy;
        p.mesh.position.z += p.vz + Math.cos(t * 0.7 + p.phase) * 0.006;
        const mat = p.mesh.material as THREE.MeshStandardMaterial;
        const lifeFrac = Math.max(0, 1 - p.mesh.position.y / 14);
        mat.opacity = lifeFrac;
        mat.emissiveIntensity = 2.5 + lifeFrac * 2;
        if (p.mesh.position.y > 13 || lifeFrac <= 0) {
          p.mesh.position.set(p.baseX + (Math.random() - 0.5) * 30, 0.2, p.baseZ + (Math.random() - 0.5) * 30);
        }
      } else if (this.worldType === 'void') {
        p.mesh.position.x += p.vx + Math.sin(t * 0.8 + p.phase) * 0.01;
        p.mesh.position.y += Math.sin(t * 1.2 + p.phase * 2) * 0.008;
        p.mesh.position.z += p.vz + Math.cos(t * 0.7 + p.phase) * 0.009;
        const mat = p.mesh.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 1.8 + Math.sin(t * 2 + p.phase) * 1.2;
      }
    }
  }

  // ── Shell casings ───────────────────────────────────────────────────────────

  private spawnShellCasing(pos: THREE.Vector3, rightDir: THREE.Vector3) {
    let c: ShellCasing;
    if (this.casingPool.length > 0) {
      c = this.casingPool.pop()!;
    } else {
      const mesh = new THREE.Mesh(this.casingGeo, this.casingMat.clone());
      mesh.castShadow = false;
      this.shellGroup.add(mesh);
      c = { mesh, vy: 0, vx: 0, vz: 0, rotX: 0, rotZ: 0, age: 0 };
    }
    c.mesh.visible = true;
    c.mesh.position.copy(pos).add(new THREE.Vector3(0, 1.2, 0));
    const spd = 0.7 + Math.random() * 0.6;
    c.vx = rightDir.x * spd + (Math.random() - 0.5) * 0.4;
    c.vy = 0.5 + Math.random() * 0.35;
    c.vz = rightDir.z * spd + (Math.random() - 0.5) * 0.4;
    c.rotX = (Math.random() - 0.5) * 0.5;
    c.rotZ = (Math.random() - 0.5) * 0.5;
    c.age = 0;
    this.activeCasings.push(c);
  }

  private updateShellCasings() {
    for (let i = this.activeCasings.length - 1; i >= 0; i--) {
      const c = this.activeCasings[i];
      c.age++;
      c.vy -= 0.022;
      c.mesh.position.x += c.vx;
      c.mesh.position.y = Math.max(0.06, c.mesh.position.y + c.vy);
      c.mesh.position.z += c.vz;
      c.mesh.rotation.x += c.rotX;
      c.mesh.rotation.z += c.rotZ;
      if (c.mesh.position.y <= 0.06 && c.vy < 0) {
        c.vy = Math.abs(c.vy) * 0.28;
        c.vx *= 0.6; c.vz *= 0.6;
        c.rotX *= 0.4; c.rotZ *= 0.4;
      }
      (c.mesh.material as THREE.MeshStandardMaterial).opacity = Math.max(0, 1 - c.age / 55);
      if (c.age > 60) {
        c.mesh.visible = false;
        this.activeCasings.splice(i, 1);
        this.casingPool.push(c);
      }
    }
  }

  // ── Main update ─────────────────────────────────────────────────────────────

  update(state: GameState, w: number, h: number, dt: number) {
    const scale = this.arenaW / w;
    const pWorld = new THREE.Vector3(
      (state.playerX - w / 2) * scale,
      0,
      (state.playerY - h / 2) * scale,
    );

    // Player
    this.playerParts.group.position.copy(pWorld);
    const aim = state.playerAngle;
    this.playerParts.group.rotation.y = Math.PI / 2 - aim;
    this.playerForward.set(Math.cos(aim), 0, -Math.sin(aim)).normalize();

    this.animPhase += dt * (state.isMoving ? 9 : 3);
    animateHumanoid(this.playerParts, this.animPhase, state.isMoving);
    this.syncPlayerWeapon(state);

    // Muzzle flash + shell casing
    const firing = state.particles.some((p) => p.color === '#ffff00' && p.life > 2);
    this.muzzle.intensity = firing ? 7 + Math.sin(this.animPhase * 18) * 2 : 0;
    this.muzzle.position.copy(pWorld).addScaledVector(this.playerForward, 1.3).setY(1.5);
    if (firing && state.frame !== this.lastFireFrame) {
      this.lastFireFrame = state.frame;
      const rightDir = new THREE.Vector3(-this.playerForward.z, 0, this.playerForward.x);
      this.spawnShellCasing(pWorld, rightDir);
    }
    this.updateShellCasings();

    // Chromatic aberration spike on damage
    const chromaTarget = state.screenShake > 8 ? 0.009 : 0.0012;
    const cu = this.chromaPass.uniforms.chromaStrength.value as number;
    this.chromaPass.uniforms.chromaStrength.value = cu + (chromaTarget - cu) * (chromaTarget > cu ? 0.9 : 0.06);

    // Aim marker
    const aimWorld = new THREE.Vector3().copy(pWorld).addScaledVector(this.playerForward, 8);
    this.aimMarker.position.set(aimWorld.x, 0.05, aimWorld.z);
    (this.aimMarker.material as THREE.MeshBasicMaterial).opacity = 0.5 + Math.sin(this.animPhase * 3) * 0.2;

    // Sync world objects
    this.syncCover(state, w, h, scale);
    this.syncEnemies(state, pWorld, w, h, scale);
    this.syncBullets(state, w, h, scale);
    this.syncEnemyBullets(state, w, h, scale);
    this.syncParticles(state, w, h, scale);
    this.syncPickups(state, w, h, scale, dt);

    this.animateAtmosphere(dt);
    this.updateAtmoParticles(dt);

    this.updateCamera(state, pWorld, dt);
  }

  // ── Camera ──────────────────────────────────────────────────────────────────

  private updateCamera(state: GameState, pWorld: THREE.Vector3, dt: number) {
    // Dash FOV kick
    if (state.dashTriggered) {
      this.fovTarget = 80;
      this.fovKickTimer = 0.38;
    }
    if (this.fovKickTimer > 0) {
      this.fovKickTimer -= dt;
      if (this.fovKickTimer <= 0) this.fovTarget = 60;
    }
    this.fovCurrent += (this.fovTarget - this.fovCurrent) * (this.fovTarget > this.fovCurrent ? 0.22 : 0.10);
    this.camera.fov = this.fovCurrent;
    this.camera.updateProjectionMatrix();

    const camOffset = new THREE.Vector3()
      .copy(this.playerForward)
      .multiplyScalar(-9)
      .add(new THREE.Vector3(0, 7, 0));
    const normalPos = pWorld.clone().add(camOffset);
    const lookAhead = this.playerForward.clone().multiplyScalar(6);
    const normalLook = pWorld.clone().add(lookAhead).setY(1.2);

    // Cinematic intro pan: camera sweeps from top-down to play position
    if (this.introTimer > 0) {
      this.introTimer -= dt;
      const raw = Math.max(0, 1 - this.introTimer / 2.4);
      const t = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2; // ease-in-out-quad
      const introPos = new THREE.Vector3(pWorld.x + 5, 115, pWorld.z + 8);
      this.camera.position.lerpVectors(introPos, normalPos, t);
      const introLook = new THREE.Vector3(pWorld.x, 0, pWorld.z);
      this.camera.lookAt(introLook.lerp(normalLook, t));
      return;
    }

    // Wave announce: gentle orbit around player
    let orbitAdd = new THREE.Vector3();
    if (state.waveAnnounce > 20) {
      const orbitT = (state.waveAnnounce - 20) / 70;
      orbitAdd.set(Math.sin(orbitT * Math.PI * 0.7) * 4, Math.sin(orbitT * Math.PI) * 1.8, 0);
    }

    this.camTargetPos.copy(normalPos).add(orbitAdd);
    this.camTargetLook.copy(normalLook);

    // 3D camera shake
    if (state.screenShake > 0) {
      const s = state.screenShake * 0.018;
      this.camTargetPos.x += (Math.random() - 0.5) * s;
      this.camTargetPos.y += (Math.random() - 0.5) * s * 0.4;
      this.camTargetPos.z += (Math.random() - 0.5) * s;
    }

    const lerp = 1 - Math.pow(0.001, dt);
    this.camera.position.lerp(this.camTargetPos, lerp);
    this.camera.lookAt(this.camTargetLook);
  }

  // ── Scene sync helpers ──────────────────────────────────────────────────────

  private syncPlayerWeapon(state: GameState) {
    const key = `${state.weaponId}:${state.weaponType}:${state.weaponAccent}`;
    if (key === this.currentWeaponKey) return;
    this.currentWeaponKey = key;
    this.playerParts.weaponMount.clear();
    this.playerParts.weaponMount.add(createWeaponMesh(state.weaponType, state.weaponAccent));
  }

  private animateAtmosphere(dt: number) {
    this.scene.traverse((o) => {
      if (o.userData.flicker && o instanceof THREE.PointLight) {
        o.intensity = 1.6 + Math.sin(this.animPhase * 4.5) * 0.6 + Math.random() * 0.5;
      }
      if (o.userData.swirl && o instanceof THREE.Mesh) {
        o.rotation.y += dt * 1.1;
        o.position.y += Math.sin(this.animPhase + (o.userData.swirl as number)) * 0.005;
      }
      if (o.userData.strobe && o instanceof THREE.PointLight) {
        const phase = (this.animPhase * 3.2 + (o.userData.strobe as number)) % (Math.PI * 2);
        o.intensity = phase < Math.PI * 0.4 ? 3.5 : 0.04;
      }
      if (o.userData.voidPulse && o instanceof THREE.PointLight) {
        o.intensity = 0.7 + Math.sin(this.animPhase * 1.9) * 0.65;
      }
    });
  }

  private coverPool: THREE.Mesh[] = [];
  private syncCover(state: GameState, w: number, h: number, scale: number) {
    const colorFor = (t: string) => t === 'container' ? 0x36465c : t === 'rock' ? 0x6a5a45 : t === 'crystal' ? 0x8ddcff : t === 'pillar' ? 0x3a1a12 : 0x2a3440;
    while (this.coverPool.length < state.cover.length) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ roughness: 0.8 }));
      m.castShadow = true; m.receiveShadow = true;
      this.coverGroup.add(m);
      this.coverPool.push(m);
    }
    for (let i = 0; i < this.coverPool.length; i++) {
      const m = this.coverPool[i];
      if (i < state.cover.length) {
        const c = state.cover[i];
        m.visible = true;
        m.position.set((c.x - w / 2) * scale, 1.2, (c.y - h / 2) * scale);
        m.scale.set(c.w * scale, c.type === 'crystal' ? 3.4 : c.type === 'pillar' ? 4.6 : 2.4, c.h * scale);
        const mat = m.material as THREE.MeshStandardMaterial;
        mat.color.setHex(colorFor(c.type));
        mat.emissive.setHex(c.type === 'crystal' ? 0x235577 : c.type === 'pillar' ? 0x331000 : 0x000000);
        mat.emissiveIntensity = c.type === 'crystal' ? 0.55 : c.type === 'pillar' ? 0.4 : 0;
      } else { m.visible = false; }
    }
  }

  private enemySeq = 0;
  private syncEnemies(state: GameState, pWorld: THREE.Vector3, w: number, h: number, scale: number) {
    const seen = new Set<Enemy_id>();
    for (const e of state.enemies) {
      const id = (e as any).__id as Enemy_id | undefined;
      let view = id ? this.enemyViews.get(id) : undefined;
      if (!view) {
        const parts = createZombieHumanoid(e.type);
        const hpBar = this.makeHpBar();
        parts.group.add(hpBar);
        hpBar.position.set(0, 2.7, 0);
        this.scene.add(parts.group);
        view = { parts, hpBar };
        if (e.type === 'boss') {
          const bossLight = new THREE.PointLight(0xff00ff, 1.5, 16, 2);
          bossLight.position.set(0, 2.8, 0);
          parts.group.add(bossLight);
          view.bossLight = bossLight;
        }
        const newId = ++this.enemySeq as Enemy_id;
        (e as any).__id = newId;
        this.enemyViews.set(newId, view);
      }
      seen.add((e as any).__id);
      const ew = new THREE.Vector3((e.x - w / 2) * scale, 0, (e.y - h / 2) * scale);
      view.parts.group.position.copy(ew);
      view.parts.group.rotation.y = Math.PI / 2 - Math.atan2(-(pWorld.z - ew.z), pWorld.x - ew.x);
      animateZombie(view.parts, this.animPhase * 0.6 + ew.x * 0.1);
      const frac = Math.max(0, e.health / e.maxHealth);
      view.hpBar.scale.x = Math.max(0.001, frac);
      view.hpBar.position.set((1 - frac) * -0.5, 2.7, 0);
      view.hpBar.visible = frac < 0.999;
      if (view.bossLight) {
        view.bossLight.intensity = 1.2 + Math.sin(this.animPhase * 2.8) * 0.6;
      }
    }
    for (const [id, view] of this.enemyViews) {
      if (!seen.has(id)) {
        this.scene.remove(view.parts.group);
        this.enemyViews.delete(id);
      }
    }
  }

  private bulletPool: THREE.Mesh[] = [];
  private syncBullets(state: GameState, w: number, h: number, scale: number) {
    while (this.bulletPool.length < state.bullets.length) {
      const m = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.1, 1.0, 3, 6),
        new THREE.MeshStandardMaterial({ color: 0xffdd33, emissive: 0xffaa00, emissiveIntensity: 3.2 }),
      );
      m.rotation.z = Math.PI / 2;
      this.bulletGroup.add(m);
      this.bulletPool.push(m);
    }
    for (let i = 0; i < this.bulletPool.length; i++) {
      const m = this.bulletPool[i];
      if (i < state.bullets.length) {
        const b = state.bullets[i];
        m.visible = true;
        m.position.set((b.x - w / 2) * scale, 1.3, (b.y - h / 2) * scale);
        m.rotation.y = Math.PI / 2 - Math.atan2(-b.vy, b.vx);
      } else { m.visible = false; }
    }
  }

  private enemyBulletPool: THREE.Mesh[] = [];
  private syncEnemyBullets(state: GameState, w: number, h: number, scale: number) {
    while (this.enemyBulletPool.length < state.enemyBullets.length) {
      const m = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.12, 1.15, 3, 6),
        new THREE.MeshStandardMaterial({ color: 0xff3355, emissive: 0xff0033, emissiveIntensity: 3 }),
      );
      m.rotation.z = Math.PI / 2;
      this.enemyBulletGroup.add(m);
      this.enemyBulletPool.push(m);
    }
    for (let i = 0; i < this.enemyBulletPool.length; i++) {
      const m = this.enemyBulletPool[i];
      if (i < state.enemyBullets.length) {
        const b = state.enemyBullets[i];
        m.visible = true;
        m.position.set((b.x - w / 2) * scale, 1.2, (b.y - h / 2) * scale);
        m.rotation.y = Math.PI / 2 - Math.atan2(-b.vy, b.vx);
        const mat = m.material as THREE.MeshStandardMaterial;
        const boss = b.source === 'boss';
        mat.color.setHex(boss ? 0xff00ff : 0xff3355);
        mat.emissive.setHex(boss ? 0xff00ff : 0xff0033);
        m.scale.setScalar(boss ? 1.4 : 1);
      } else { m.visible = false; }
    }
  }

  private pickupPool: THREE.Mesh[] = [];
  private syncPickups(state: GameState, w: number, h: number, scale: number, dt: number) {
    const colors: Record<string, number> = { health: 0x00ff66, ammo: 0xffcc00, armor: 0x00ccff };
    while (this.pickupPool.length < state.pickups.length) {
      const m = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.6, 0),
        new THREE.MeshStandardMaterial({ emissive: 0xffffff, emissiveIntensity: 1.8, roughness: 0.3 }),
      );
      this.pickupGroup.add(m);
      this.pickupPool.push(m);
    }
    for (let i = 0; i < this.pickupPool.length; i++) {
      const m = this.pickupPool[i];
      if (i < state.pickups.length) {
        const p = state.pickups[i];
        m.visible = true;
        m.position.set((p.x - w / 2) * scale, 0.85 + Math.sin(this.animPhase + i) * 0.18, (p.y - h / 2) * scale);
        m.rotation.y += dt * 2.2;
        m.rotation.x += dt * 1.3;
        (m.material as THREE.MeshStandardMaterial).emissive.setHex(colors[p.type] ?? 0xffffff);
      } else { m.visible = false; }
    }
  }

  private particlePool: THREE.Mesh[] = [];
  private syncParticles(state: GameState, w: number, h: number, scale: number) {
    const live = state.particles.filter((p) => p.color !== '#ffff00');
    while (this.particlePool.length < live.length) {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 5, 5),
        new THREE.MeshStandardMaterial({ emissive: 0xffffff, emissiveIntensity: 2.5, transparent: true }),
      );
      this.particleGroup.add(m);
      this.particlePool.push(m);
    }
    for (let i = 0; i < this.particlePool.length; i++) {
      const m = this.particlePool[i];
      const mat = m.material as THREE.MeshStandardMaterial;
      if (i < live.length) {
        const p = live[i];
        m.visible = true;
        m.position.set((p.x - w / 2) * scale, 0.6 + (40 - p.life) * 0.045, (p.y - h / 2) * scale);
        const lifeFrac = Math.max(0, p.life / 40);
        mat.opacity = lifeFrac;
        mat.color.set(p.color);
        mat.emissive.set(p.color);
        m.scale.setScalar(p.size * 0.3 * (0.4 + lifeFrac));
      } else { m.visible = false; }
    }
  }

  private makeHpBar(): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 8;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#cc2222'; ctx.fillRect(0, 0, 64, 8);
    const tex = new THREE.CanvasTexture(canvas);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex }));
    sprite.scale.set(1, 0.14, 1);
    return sprite;
  }

  // ── Render + lifecycle ──────────────────────────────────────────────────────

  render() {
    this.composer.render();
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.composer.setSize(window.innerWidth, window.innerHeight);
    this.bloomPass.setSize(window.innerWidth, window.innerHeight);
  }

  dispose() {
    window.removeEventListener('resize', this.onResize);
    this.composer.dispose();
    this.renderer.dispose();
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
      if (m.material) {
        const mat = m.material as THREE.Material | THREE.Material[];
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat.dispose();
      }
    });
  }
}

type Enemy_id = number & { __brand: 'enemyId' };
