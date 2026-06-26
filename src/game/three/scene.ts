import * as THREE from 'three';
import { GameState, LevelDef } from '../engine';
import { CharacterSkin } from '../characters';
import { getTheme, buildArena } from './world';
import { createHumanoid, animateHumanoid, HumanoidParts, createZombieHumanoid, animateZombie } from './humanoid';

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
}

export class GameScene3D {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  private sun: THREE.DirectionalLight;
  private playerParts!: HumanoidParts;
  private enemyViews = new Map<Enemy_id, EnemyView>();
  private bulletGroup = new THREE.Group();
  private pickupGroup = new THREE.Group();
  private particleGroup = new THREE.Group();
  private muzzle: THREE.PointLight;
  private playerForward = new THREE.Vector3(0, 0, 1);
  private animPhase = 0;
  private aimMarker!: THREE.Mesh;

  constructor(public canvas: HTMLCanvasElement, level: LevelDef, skin: CharacterSkin) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene = new THREE.Scene();
    const theme = getTheme(level.world);
    this.scene.fog = new THREE.FogExp2(theme.fog, theme.fogDensity);
    this.scene.background = new THREE.Color(theme.fog);

    // Lights
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

    // Arena (engine uses a 1280x720-ish canvas; mirror that into world units)
    const W = 1280 / 4, H = 720 / 4; // scale down to a sane arena size (~320x180 units)
    this.arenaW = W;
    const arena = buildArena(theme, level.id * 31, W, H);
    this.scene.add(arena.group);

    // Player
    this.playerParts = createHumanoid(skinToColors(skin));
    this.scene.add(this.playerParts.group);

    // Bullets + pickups + particles containers
    this.scene.add(this.bulletGroup, this.pickupGroup, this.particleGroup);

    // Muzzle flash light (off by default)
    this.muzzle = new THREE.PointLight(0xffd070, 0, 18, 2);
    this.scene.add(this.muzzle);

    // Aim marker — a flat ring on the ground showing where the gun points.
    this.aimMarker = new THREE.Mesh(
      new THREE.RingGeometry(0.6, 0.9, 20),
      new THREE.MeshBasicMaterial({ color: 0xff2d55, transparent: true, opacity: 0.7, side: THREE.DoubleSide }),
    );
    this.aimMarker.rotation.x = -Math.PI / 2;
    this.scene.add(this.aimMarker);

    // Camera
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);
  }

  private arenaW = 320;
  private camTargetPos = new THREE.Vector3();
  private camTargetLook = new THREE.Vector3();

  // Drive everything from the authoritative engine state once per frame.
  update(state: GameState, w: number, h: number, dt: number) {
    const scale = this.arenaW / w; // engine canvas -> arena scale
    const pWorld = new THREE.Vector3(
      (state.playerX - w / 2) * scale,
      0,
      (state.playerY - h / 2) * scale,
    );

    // Player position + orientation
    this.playerParts.group.position.copy(pWorld);
    // engine angle 0 points +x (right). Our humanoid faces +Z.
    // To face the aim direction: rotation.y = angle + PI/2 ... but engine angle
    // uses screen coords (y down). Map carefully.
    // Screen-y is inverted vs world-Z, so flip.
    const aim = state.playerAngle;
    this.playerParts.group.rotation.y = Math.PI / 2 - aim;
    this.playerForward.set(Math.cos(aim), 0, -Math.sin(aim)).normalize();

    // Walk animation phase
    this.animPhase += dt * (state.isMoving ? 9 : 3);
    animateHumanoid(this.playerParts, this.animPhase, state.isMoving);

    // Muzzle flash when firing
    const firing = state.particles.some((p) => p.color === '#ffff00' && p.life > 2);
    this.muzzle.intensity = firing ? 6 : 0;
    this.muzzle.position.copy(pWorld).addScaledVector(this.playerForward, 1.2).setY(1.5);

    // Aim marker sits on the ground a few units ahead of the player along the aim.
    const aimWorld = new THREE.Vector3().copy(pWorld).addScaledVector(this.playerForward, 8);
    this.aimMarker.position.set(aimWorld.x, 0.05, aimWorld.z);
    const pulse = 0.5 + Math.sin(this.animPhase * 3) * 0.2;
    (this.aimMarker.material as THREE.MeshBasicMaterial).opacity = pulse;

    // === Enemies: sync by reference id stored on the enemy object ===
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
        const newId = ++this.enemySeq as Enemy_id;
        (e as any).__id = newId;
        this.enemyViews.set(newId, view);
      }
      seen.add((e as any).__id);
      const ew = new THREE.Vector3((e.x - w / 2) * scale, 0, (e.y - h / 2) * scale);
      view.parts.group.position.copy(ew);
      // face the player
      const dx = pWorld.x - ew.x, dz = pWorld.z - ew.z;
      view.parts.group.rotation.y = Math.PI / 2 - Math.atan2(-dz, dx);
      const moving = true;
      animateZombie(view.parts, this.animPhase * 0.6 + ew.x * 0.1);
      void moving;
      // hp bar faces camera + scale
      const frac = Math.max(0, e.health / e.maxHealth);
      view.hpBar.scale.x = Math.max(0.001, frac);
      view.hpBar.position.set((1 - frac) * -0.5, 2.7, 0);
      view.hpBar.visible = frac < 0.999;
    }
    // remove dead enemies
    for (const [id, view] of this.enemyViews) {
      if (!seen.has(id)) {
        this.scene.remove(view.parts.group);
        this.enemyViews.delete(id);
      }
    }

    // === Bullets ===
    this.syncBullets(state, w, h, scale);

    // === Particles (muzzle, hit sparks, death bursts, blood) ===
    this.syncParticles(state, w, h, scale);

    // === Pickups ===
    this.syncPickups(state, w, h, scale, dt);

    // === Camera: third-person follow behind the player, looking toward aim ===
    const camOffset = new THREE.Vector3()
      .copy(this.playerForward)
      .multiplyScalar(-9) // behind
      .add(new THREE.Vector3(0, 7, 0)); // raised
    this.camTargetPos.copy(pWorld).add(camOffset);
    const lookAhead = new THREE.Vector3().copy(this.playerForward).multiplyScalar(6);
    this.camTargetLook.copy(pWorld).add(lookAhead).setY(1.2);

    const lerp = 1 - Math.pow(0.001, dt); // frame-rate independent smoothing
    this.camera.position.lerp(this.camTargetPos, lerp);
    this.camera.lookAt(this.camTargetLook);
  }

  private bulletPool: THREE.Mesh[] = [];
  private syncBullets(state: GameState, w: number, h: number, scale: number) {
    // ensure enough pooled meshes
    while (this.bulletPool.length < state.bullets.length) {
      // stretched streak along its travel direction for a tracer feel
      const m = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.1, 1.0, 3, 6),
        new THREE.MeshStandardMaterial({ color: 0xffdd33, emissive: 0xffaa00, emissiveIntensity: 3 }),
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
        // rotate the streak to match travel direction in the XZ plane
        m.rotation.y = Math.PI / 2 - Math.atan2(-b.vy, b.vx);
      } else {
        m.visible = false;
      }
    }
  }

  private pickupPool: THREE.Mesh[] = [];
  private syncPickups(state: GameState, w: number, h: number, scale: number, dt: number) {
    const colors: Record<string, number> = { health: 0x00ff66, ammo: 0xffcc00, armor: 0x00ccff };
    while (this.pickupPool.length < state.pickups.length) {
      const m = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.6, 0),
        new THREE.MeshStandardMaterial({ emissive: 0xffffff, emissiveIntensity: 1.5, roughness: 0.3 }),
      );
      this.pickupGroup.add(m);
      this.pickupPool.push(m);
    }
    for (let i = 0; i < this.pickupPool.length; i++) {
      const m = this.pickupPool[i];
      if (i < state.pickups.length) {
        const p = state.pickups[i];
        m.visible = true;
        m.position.set((p.x - w / 2) * scale, 0.8, (p.y - h / 2) * scale);
        m.rotation.y += dt * 2;
        m.rotation.x += dt * 1.2;
        (m.material as THREE.MeshStandardMaterial).emissive.setHex(colors[p.type] ?? 0xffffff);
      } else {
        m.visible = false;
      }
    }
  }

  // The engine emits short-lived particles per event (muzzle flash, hit sparks,
  // death bursts, blood). We render them as small emissive points, pooled.
  private particlePool: THREE.Mesh[] = [];
  private syncParticles(state: GameState, w: number, h: number, scale: number) {
    // muzzle particles are handled by the point light; render the rest
    const live = state.particles.filter((p) => p.color !== '#ffff00');
    while (this.particlePool.length < live.length) {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 5, 5),
        new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 2, transparent: true }),
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
        m.position.set((p.x - w / 2) * scale, 0.6, (p.y - h / 2) * scale);
        const lifeFrac = Math.max(0, p.life / 40);
        mat.opacity = lifeFrac;
        mat.color.set(p.color);
        mat.emissive.set(p.color);
        const s = p.size * 0.3 * (0.4 + lifeFrac);
        m.scale.setScalar(s);
      } else {
        m.visible = false;
      }
    }
  }

  private enemySeq = 0;
  private makeHpBar(): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 8;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#cc2222'; ctx.fillRect(0, 0, 64, 8);
    ctx.fillStyle = '#222'; ctx.fillRect(0, 0, 64, 8);
    ctx.fillStyle = '#cc2222'; ctx.fillRect(0, 0, 64, 8);
    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(1, 0.14, 1);
    return sprite;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  dispose() {
    window.removeEventListener('resize', this.onResize);
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

// unique id keys stored on enemy objects (engine Enemy is interface-only)
type Enemy_id = number & { __brand: 'enemyId' };
