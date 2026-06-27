export interface Vec2 { x: number; y: number; }

export interface Bullet {
  x: number; y: number;
  vx: number; vy: number;
  damage: number;
  life: number;
}

export interface EnemyBullet {
  x: number; y: number;
  vx: number; vy: number;
  damage: number;
  life: number;
  source: Enemy['type'];
}

export interface Enemy {
  x: number; y: number;
  type: 'walker' | 'runner' | 'tank' | 'explosive' | 'boss';
  health: number; maxHealth: number;
  speed: number; damage: number;
  lastAttack: number;
  lastShot: number;
  frame: number;
}

export interface Pickup {
  x: number; y: number;
  type: 'health' | 'ammo' | 'armor';
  value: number;
}

export interface Cover {
  x: number; y: number;
  w: number; h: number;
  type: 'barrier' | 'container' | 'rock' | 'crystal' | 'pillar';
}

export interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; color: string;
  size: number;
}

export interface GameState {
  playerX: number; playerY: number;
  playerAngle: number;
  playerHealth: number; playerMaxHealth: number;
  playerArmor: number;
  ammo: number; maxAmmo: number;
  score: number;
  wave: number; totalWaves: number;
  enemies: Enemy[];
  bullets: Bullet[];
  enemyBullets: EnemyBullet[];
  pickups: Pickup[];
  cover: Cover[];
  particles: Particle[];
  enemiesSpawned: number;
  enemiesInWave: number;
  spawnTimer: number;
  screenShake: number;
  frame: number;
  isMoving: boolean;
  waveComplete: boolean;
  levelComplete: boolean;
  gameOver: boolean;
  paused: boolean;
  kills: number;
  waveAnnounce: number; // frames remaining to show wave text
  lastShot: number; // frame of the last fired shot (per-shot cooldown)
  reloadTimer: number; // frames remaining until ammo refills
  reloadDuration: number;
  weaponDamage: number;
  fireCooldown: number;
  pellets: number;
}

export interface LevelDef {
  id: number;
  name: string;
  world: string;
  waves: { type: Enemy['type']; count: number }[][];
  bg: string;
  grid: string;
}

export const LEVELS: LevelDef[] = [
  { id: 1, name: 'City Outskirts', world: 'city', bg: '#0d1117', grid: '#1a2332',
    waves: [[{type:'walker',count:4}],[{type:'walker',count:5},{type:'runner',count:2}],[{type:'walker',count:6},{type:'runner',count:3}]] },
  { id: 2, name: 'Market District', world: 'city', bg: '#0f1520', grid: '#1c2535',
    waves: [[{type:'walker',count:6},{type:'runner',count:2}],[{type:'runner',count:5},{type:'tank',count:1}],[{type:'walker',count:4},{type:'runner',count:4},{type:'tank',count:1}]] },
  { id: 3, name: 'Highway Ruins', world: 'desert', bg: '#1a1408', grid: '#2d2210',
    waves: [[{type:'runner',count:6},{type:'tank',count:1}],[{type:'walker',count:5},{type:'explosive',count:2}],[{type:'runner',count:6},{type:'tank',count:2},{type:'explosive',count:1}]] },
  { id: 4, name: 'Desert Compound', world: 'desert', bg: '#1c1208', grid: '#2e2010',
    waves: [[{type:'runner',count:8},{type:'explosive',count:3}],[{type:'tank',count:3},{type:'runner',count:5}],[{type:'runner',count:6},{type:'tank',count:2},{type:'explosive',count:3}]] },
  { id: 5, name: 'Frozen Bridge', world: 'frozen', bg: '#0a1420', grid: '#152535',
    waves: [[{type:'runner',count:8},{type:'tank',count:2}],[{type:'explosive',count:4},{type:'runner',count:6}],[{type:'tank',count:3},{type:'runner',count:8},{type:'explosive',count:2}]] },
  { id: 6, name: 'Ice Factory', world: 'frozen', bg: '#0c1625', grid: '#18283a',
    waves: [[{type:'runner',count:10},{type:'tank',count:3}],[{type:'explosive',count:5},{type:'tank',count:3}],[{type:'runner',count:8},{type:'tank',count:4},{type:'explosive',count:3}]] },
  { id: 7, name: 'Burning Streets', world: 'burning', bg: '#1a0a08', grid: '#2d1510',
    waves: [[{type:'runner',count:10},{type:'explosive',count:4}],[{type:'tank',count:4},{type:'runner',count:8}],[{type:'boss',count:1},{type:'runner',count:5}]] },
  { id: 8, name: 'Collapsed Tower', world: 'burning', bg: '#1c0c0a', grid: '#301812',
    waves: [[{type:'runner',count:12},{type:'explosive',count:5}],[{type:'tank',count:5},{type:'explosive',count:4}],[{type:'boss',count:1},{type:'tank',count:2},{type:'runner',count:6}]] },
  { id: 9, name: 'Sky Platform', world: 'sky', bg: '#0a0a1a', grid: '#15152d',
    waves: [[{type:'runner',count:12},{type:'tank',count:4}],[{type:'explosive',count:6},{type:'runner',count:8}],[{type:'boss',count:1},{type:'tank',count:3},{type:'explosive',count:4}]] },
  { id: 10, name: 'Floating Arena', world: 'sky', bg: '#0b0b1e', grid: '#161630',
    waves: [[{type:'runner',count:15},{type:'tank',count:5}],[{type:'boss',count:1},{type:'explosive',count:5},{type:'runner',count:8}],[{type:'boss',count:2},{type:'tank',count:4},{type:'runner',count:10}]] },
  { id: 11, name: 'Void Gate', world: 'void', bg: '#050508', grid: '#0a0a15',
    waves: [[{type:'runner',count:15},{type:'tank',count:5},{type:'explosive',count:5}],[{type:'boss',count:1},{type:'runner',count:10},{type:'explosive',count:6}],[{type:'boss',count:2},{type:'tank',count:5},{type:'runner',count:12}]] },
  { id: 12, name: 'Final Dimension', world: 'void', bg: '#030305', grid: '#080812',
    waves: [[{type:'runner',count:18},{type:'tank',count:6},{type:'explosive',count:6}],[{type:'boss',count:2},{type:'tank',count:5},{type:'explosive',count:8}],[{type:'boss',count:3},{type:'tank',count:6},{type:'runner',count:15}]] },
];

// === INFINITE LEVEL SYSTEM (Subway-Surfers style endless progression) ===
// Worlds cycle every 2 levels. Beyond the handcrafted set, levels are generated
// procedurally with escalating difficulty so progression never ends.
const WORLD_ORDER = ['city', 'desert', 'frozen', 'burning', 'sky', 'void'];

const AREA_NAMES: Record<string, string[]> = {
  city: ['City Outskirts', 'Market District', 'Downtown Ruins', 'Subway Tunnels', 'Rooftop Run', 'Police Plaza'],
  desert: ['Highway Ruins', 'Desert Compound', 'Sandstorm Pass', 'Oasis Outpost', 'Buried Temple', 'Dune Fortress'],
  frozen: ['Frozen Bridge', 'Ice Factory', 'Glacier Camp', 'Frostbite Lab', 'Avalanche Ridge', 'Polar Station'],
  burning: ['Burning Streets', 'Collapsed Tower', 'Magma Quarter', 'Ash Boulevard', 'Inferno Gate', 'Cinder Spire'],
  sky: ['Sky Platform', 'Floating Arena', 'Cloud Bastion', 'Storm Deck', 'Sky Citadel', 'Heaven Fracture'],
  void: ['Void Gate', 'Final Dimension', 'Null Expanse', 'Abyss Core', 'Entropy Field', 'The Last Bloom'],
};

function worldForLevel(id: number): string {
  return WORLD_ORDER[Math.floor((id - 1) / 2) % WORLD_ORDER.length];
}

function nameForLevel(id: number, world: string): string {
  const names = AREA_NAMES[world];
  const cycle = Math.floor((id - 1) / (WORLD_ORDER.length * 2));
  const idx = Math.floor((id - 1) / 2) % WORLD_ORDER.length;
  const base = names[Math.min(idx + (cycle % 2) * 2, names.length - 1)] || names[0];
  return cycle > 0 ? `${base} ${['', 'II', 'III', 'IV', 'V', 'VI'][Math.min(cycle, 6)]}`.trim() : base;
}

// Generate escalating waves for any level id.
function generateWaves(id: number): { type: Enemy['type']; count: number }[][] {
  const tier = Math.floor((id - 1) / 2); // 0,0,1,1,2,2...
  const numWaves = Math.min(3 + Math.floor(id / 8), 6);
  const waves: { type: Enemy['type']; count: number }[][] = [];
  for (let w = 0; w < numWaves; w++) {
    const intensity = 1 + tier * 0.25 + w * 0.15;
    const wave: { type: Enemy['type']; count: number }[] = [];
    wave.push({ type: 'runner', count: Math.round((4 + tier) * intensity) });
    if (id >= 2) wave.push({ type: 'walker', count: Math.round((3 + tier * 0.5) * intensity) });
    if (id >= 4) wave.push({ type: 'tank', count: Math.max(1, Math.round((tier * 0.4) * intensity)) });
    if (id >= 5) wave.push({ type: 'explosive', count: Math.max(1, Math.round((tier * 0.5) * intensity)) });
    // Boss on the final wave of every 4th level (and scaling later)
    if (w === numWaves - 1 && id >= 7 && id % 4 === 3) {
      wave.push({ type: 'boss', count: Math.min(1 + Math.floor(tier / 6), 3) });
    } else if (w === numWaves - 1 && id >= 10 && id % 5 === 0) {
      wave.push({ type: 'boss', count: 1 });
    }
    waves.push(wave);
  }
  return waves;
}

// The "official" number of crafted milestones shown before pure procedural levels.
// Levels are infinite; this just controls how many nodes the map renders by default.
export const BASE_LEVEL_COUNT = LEVELS.length;

// Returns a level definition for ANY id (1..infinity).
export function getLevel(id: number): LevelDef {
  if (id <= LEVELS.length) return LEVELS[id - 1];
  const world = worldForLevel(id);
  return {
    id,
    name: nameForLevel(id, world),
    world,
    bg: '#0a0a0f',
    grid: '#1a1a25',
    waves: generateWaves(id),
  };
}

export interface LevelInfo {
  hasBoss: boolean;
  enemyCount: number;
  waves: number;
  reward: number; // base coin reward for clearing
  difficulty: 'EASY' | 'NORMAL' | 'HARD' | 'BRUTAL' | 'BOSS';
}

export function getLevelInfo(id: number): LevelInfo {
  const lvl = getLevel(id);
  const all = lvl.waves.flat();
  const enemyCount = all.reduce((s, e) => s + e.count, 0);
  const hasBoss = all.some((e) => e.type === 'boss');
  const reward = id * 40 + enemyCount * 4;
  let difficulty: LevelInfo['difficulty'];
  if (hasBoss) difficulty = 'BOSS';
  else if (id <= 2) difficulty = 'EASY';
  else if (id <= 6) difficulty = 'NORMAL';
  else if (id <= 12) difficulty = 'HARD';
  else difficulty = 'BRUTAL';
  return { hasBoss, enemyCount, waves: lvl.waves.length, reward, difficulty };
}

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function getLevelCover(level: LevelDef, w: number, h: number): Cover[] {
  const rand = seeded(level.id * 7919 + level.world.length * 97);
  const covers: Cover[] = [];
  const typeForWorld: Record<string, Cover['type']> = {
    city: 'container', desert: 'rock', frozen: 'crystal', burning: 'pillar', sky: 'barrier', void: 'pillar',
  };
  const count = level.world === 'city' ? 9 : level.world === 'frozen' ? 10 : 8;
  for (let i = 0; i < count; i++) {
    const cw = level.world === 'city' ? 54 + rand() * 34 : 34 + rand() * 36;
    const ch = level.world === 'city' ? 32 + rand() * 24 : 30 + rand() * 34;
    const x = 70 + rand() * (w - 140);
    const y = 70 + rand() * (h - 140);
    if (Math.hypot(x - w / 2, y - h / 2) < 120) continue;
    covers.push({ x, y, w: cw, h: ch, type: typeForWorld[level.world] || 'barrier' });
  }
  return covers;
}

function overlapsCover(x: number, y: number, radius: number, cover: Cover) {
  const cx = Math.max(cover.x - cover.w / 2, Math.min(x, cover.x + cover.w / 2));
  const cy = Math.max(cover.y - cover.h / 2, Math.min(y, cover.y + cover.h / 2));
  return (x - cx) ** 2 + (y - cy) ** 2 < radius ** 2;
}

function isBlocked(x: number, y: number, radius: number, cover: Cover[]) {
  return cover.some((c) => overlapsCover(x, y, radius, c));
}

const ENEMY_STATS: Record<Enemy['type'], { health: number; speed: number; damage: number }> = {
  walker: { health: 40, speed: 0.8, damage: 8 },
  runner: { health: 25, speed: 2.0, damage: 12 },
  tank: { health: 150, speed: 0.5, damage: 20 },
  explosive: { health: 20, speed: 1.5, damage: 40 },
  boss: { health: 600, speed: 0.7, damage: 25 },
};

export interface GameLoadout {
  damage: number;
  fireCooldown: number;
  pellets: number;
  maxAmmo: number;
  reloadDuration?: number;
  bonusHealth: number;
  bonusArmor: number;
}

export function createGameState(w: number, h: number, level: LevelDef, loadout?: GameLoadout): GameState {
  const totalEnemies = level.waves.flat().reduce((s, e) => s + e.count, 0);
  const lo: GameLoadout = loadout || { damage: 20, fireCooldown: 8, pellets: 1, maxAmmo: 50, reloadDuration: 70, bonusHealth: 0, bonusArmor: 0 };
  const maxHealth = 100 + lo.bonusHealth;
  const cover = getLevelCover(level, w, h);
  return {
    playerX: w / 2, playerY: h / 2, playerAngle: 0,
    playerHealth: maxHealth, playerMaxHealth: maxHealth, playerArmor: lo.bonusArmor,
    ammo: lo.maxAmmo, maxAmmo: lo.maxAmmo, score: 0,
    wave: 0, totalWaves: level.waves.length,
    enemies: [], bullets: [], enemyBullets: [], pickups: [], cover, particles: [],
    enemiesSpawned: 0, enemiesInWave: totalEnemies,
    spawnTimer: 60, screenShake: 0, frame: 0,
    isMoving: false, waveComplete: false, levelComplete: false,
    gameOver: false, paused: false, kills: 0, waveAnnounce: 90, lastShot: -100,
    reloadTimer: 0, reloadDuration: lo.reloadDuration || 70,
    weaponDamage: lo.damage, fireCooldown: lo.fireCooldown, pellets: lo.pellets,
  };
}

export function spawnEnemy(type: Enemy['type'], w: number, h: number, levelId: number = 1): Enemy {
  const stats = ENEMY_STATS[type];
  const hpScale = 1 + (levelId - 1) * 0.15;
  const side = Math.floor(Math.random() * 4);
  let x = 0, y = 0;
  switch (side) {
    case 0: x = Math.random() * w; y = -40; break;
    case 1: x = w + 40; y = Math.random() * h; break;
    case 2: x = Math.random() * w; y = h + 40; break;
    case 3: x = -40; y = Math.random() * h; break;
  }
  const hp = Math.floor(stats.health * hpScale);
  return { x, y, type, health: hp, maxHealth: hp, speed: stats.speed, damage: stats.damage, lastAttack: 0, lastShot: -120, frame: Math.random() * 100 };
}

export function tick(state: GameState, input: { up: boolean; down: boolean; left: boolean; right: boolean; mouseX: number; mouseY: number; shoot: boolean; reload: boolean }, w: number, h: number, level: LevelDef): GameState {
  if (state.paused || state.gameOver || state.levelComplete) return state;
  const s = { ...state, enemies: [...state.enemies], bullets: [...state.bullets], enemyBullets: [...state.enemyBullets], pickups: [...state.pickups], cover: [...state.cover], particles: [...state.particles] };
  s.frame++;

  // Player movement with acceleration
  const speed = 3.5;
  let dx = 0, dy = 0;
  if (input.up) dy -= 1;
  if (input.down) dy += 1;
  if (input.left) dx -= 1;
  if (input.right) dx += 1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  s.isMoving = dx !== 0 || dy !== 0;
  const nextPlayerX = Math.max(20, Math.min(w - 20, s.playerX + (dx / len) * speed));
  const nextPlayerY = Math.max(20, Math.min(h - 20, s.playerY + (dy / len) * speed));
  if (!isBlocked(nextPlayerX, s.playerY, 18, s.cover)) s.playerX = nextPlayerX;
  if (!isBlocked(s.playerX, nextPlayerY, 18, s.cover)) s.playerY = nextPlayerY;
  s.playerAngle = Math.atan2(input.mouseY - s.playerY, input.mouseX - s.playerX);

  // Reload countdown. Ammo refills only when the timer completes; shooting is
  // blocked while reloading so reload becomes a tactical combat window.
  if (s.reloadTimer > 0) {
    s.reloadTimer--;
    if (s.reloadTimer <= 0) {
      s.reloadTimer = 0;
      s.ammo = s.maxAmmo;
      s.particles.push({ x: s.playerX, y: s.playerY, vx: 0, vy: -1, life: 18, color: '#00d4ff', size: 3 });
    }
  }

  // Shooting — fire-rate is a per-shot cooldown (not a global frame modulo),
  // so a single quick click always fires once the cooldown has elapsed.
  // Weapon stats (damage, cooldown, pellets) come from the equipped loadout.
  if (input.shoot && s.reloadTimer <= 0 && s.ammo > 0 && s.frame - s.lastShot >= s.fireCooldown) {
    s.lastShot = s.frame;
    const bSpeed = 11;
    const pellets = Math.max(1, s.pellets);
    const spread = pellets > 1 ? 0.32 : 0.05;
    for (let p = 0; p < pellets; p++) {
      const angle = s.playerAngle + (pellets > 1 ? (p / (pellets - 1) - 0.5) * spread : (Math.random() - 0.5) * spread);
      s.bullets.push({
        x: s.playerX + Math.cos(s.playerAngle) * 20,
        y: s.playerY + Math.sin(s.playerAngle) * 20,
        vx: Math.cos(angle) * bSpeed,
        vy: Math.sin(angle) * bSpeed,
        damage: s.weaponDamage + Math.floor(level.id * 1.5),
        life: 60,
      });
    }
    s.ammo--;
    // Muzzle flash particle
    s.particles.push({
      x: s.playerX + Math.cos(s.playerAngle) * 22,
      y: s.playerY + Math.sin(s.playerAngle) * 22,
      vx: Math.cos(s.playerAngle) * 3, vy: Math.sin(s.playerAngle) * 3,
      life: 5, color: '#ffff00', size: 5,
    });
  }

  // Reload (timed, not instant)
  if ((input.reload || (input.shoot && s.ammo <= 0)) && s.reloadTimer <= 0 && s.ammo < s.maxAmmo) {
    s.reloadTimer = s.reloadDuration;
  }

  // Wave spawning
  const currentWave = level.waves[s.wave];
  if (currentWave) {
    const totalInWave = currentWave.reduce((sum, e) => sum + e.count, 0);
    s.spawnTimer--;
    if (s.spawnTimer <= 0 && s.enemiesSpawned < totalInWave) {
      let count = 0;
      for (const entry of currentWave) {
        count += entry.count;
        if (s.enemiesSpawned < count) {
          s.enemies.push(spawnEnemy(entry.type, w, h, level.id));
          s.enemiesSpawned++;
          break;
        }
      }
      s.spawnTimer = Math.max(15, 45 - s.wave * 5);
    }
    if (s.enemiesSpawned >= totalInWave && s.enemies.length === 0) {
      s.wave++;
      s.enemiesSpawned = 0;
      s.spawnTimer = 90;
      s.waveAnnounce = 90;
      // Drop pickups between waves
      s.pickups.push({ x: Math.random() * (w - 100) + 50, y: Math.random() * (h - 100) + 50, type: Math.random() > 0.5 ? 'health' : 'ammo', value: Math.random() > 0.5 ? 30 : 15 });
      if (s.wave >= s.totalWaves) {
        s.levelComplete = true;
      }
    }
  }

  // Update enemies
  const now = s.frame;
  for (let i = s.enemies.length - 1; i >= 0; i--) {
    const e = s.enemies[i];
    e.frame++;
    const edx = s.playerX - e.x;
    const edy = s.playerY - e.y;
    const dist = Math.sqrt(edx * edx + edy * edy);
    const ranged = e.type === 'runner' || e.type === 'tank' || e.type === 'boss';
    const preferredRange = e.type === 'boss' ? 260 : e.type === 'tank' ? 210 : 160;
    if (dist > 1) {
      // Random zigzag for non-tanks. Ranged enemies kite once inside their ideal range.
      const wobble = e.type === 'runner' ? Math.sin(e.frame * 0.1) * 0.5 : 0;
      const dir = ranged && dist < preferredRange ? -0.35 : 1;
      const nx = e.x + (edx / dist) * e.speed * dir + wobble;
      const ny = e.y + (edy / dist) * e.speed * dir;
      const enemyRadius = e.type === 'boss' ? 34 : e.type === 'tank' ? 26 : 18;
      if (!isBlocked(nx, e.y, enemyRadius, s.cover)) e.x = nx;
      if (!isBlocked(e.x, ny, enemyRadius, s.cover)) e.y = ny;
    }

    // Ranged enemies shoot at the player. This turns the horde into real shooter
    // opponents while keeping walkers/exploders as close-range pressure.
    if (ranged && dist < preferredRange + 80 && now - e.lastShot > (e.type === 'boss' ? 55 : e.type === 'tank' ? 85 : 105)) {
      e.lastShot = now;
      const lead = 0.16;
      const aimX = edx + (s.isMoving ? Math.cos(s.playerAngle) * lead * dist : 0);
      const aimY = edy + (s.isMoving ? Math.sin(s.playerAngle) * lead * dist : 0);
      const a = Math.atan2(aimY, aimX) + (Math.random() - 0.5) * (e.type === 'boss' ? 0.08 : 0.16);
      const speed = e.type === 'boss' ? 7.5 : 6;
      s.enemyBullets.push({
        x: e.x + Math.cos(a) * 22,
        y: e.y + Math.sin(a) * 22,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        damage: e.type === 'boss' ? 16 : e.type === 'tank' ? 13 : 9,
        life: 95,
        source: e.type,
      });
      s.particles.push({ x: e.x, y: e.y, vx: Math.cos(a) * 2, vy: Math.sin(a) * 2, life: 8, color: e.type === 'boss' ? '#ff00ff' : '#ff4455', size: 4 });
    }

    // Attack player
    if (dist < 30) {
      if (now - e.lastAttack > 60) {
        let dmg = e.damage;
        if (s.playerArmor > 0) {
          const absorbed = Math.min(s.playerArmor, dmg * 0.5);
          s.playerArmor -= absorbed;
          dmg -= absorbed;
        }
        s.playerHealth -= dmg;
        s.screenShake = 12;
        e.lastAttack = now;
        for (let p = 0; p < 6; p++) {
          s.particles.push({ x: s.playerX, y: s.playerY - 10, vx: (Math.random() - 0.5) * 5, vy: -Math.random() * 3, life: 25, color: '#ff0000', size: 3 });
        }
      }
    }
  }

  // Update bullets
  for (let i = s.bullets.length - 1; i >= 0; i--) {
    const b = s.bullets[i];
    b.x += b.vx;
    b.y += b.vy;
    b.life--;
    if (b.life <= 0 || b.x < -10 || b.x > w + 10 || b.y < -10 || b.y > h + 10) {
      s.bullets.splice(i, 1);
      continue;
    }
    if (isBlocked(b.x, b.y, 4, s.cover)) {
      s.bullets.splice(i, 1);
      for (let p = 0; p < 3; p++) {
        s.particles.push({ x: b.x, y: b.y, vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2, life: 14, color: '#b8c1cc', size: 2 });
      }
      continue;
    }
    // Hit enemies
    for (let j = s.enemies.length - 1; j >= 0; j--) {
      const e = s.enemies[j];
      const hitDist = e.type === 'boss' ? 35 : e.type === 'tank' ? 25 : 18;
      if (Math.abs(b.x - e.x) < hitDist && Math.abs(b.y - e.y) < hitDist) {
        e.health -= b.damage;
        s.bullets.splice(i, 1);
        // Hit particles
        for (let p = 0; p < 3; p++) {
          s.particles.push({ x: e.x, y: e.y - 10, vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3, life: 20, color: '#44ff44', size: 2 });
        }
        if (e.health <= 0) {
          // Death explosion
          for (let p = 0; p < 10; p++) {
            s.particles.push({ x: e.x, y: e.y, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6, life: 40, color: e.type === 'explosive' ? '#ff8800' : '#66ff66', size: 4 });
          }
          // Explosive damages nearby
          if (e.type === 'explosive') {
            s.screenShake = 15;
            const blastRange = 80;
            if (Math.sqrt((s.playerX - e.x) ** 2 + (s.playerY - e.y) ** 2) < blastRange) {
              s.playerHealth -= 15;
            }
          }
          s.enemies.splice(j, 1);
          s.kills++;
          s.score += e.type === 'boss' ? 500 : e.type === 'tank' ? 100 : 25;
          // Frequent drops
          if (Math.random() < 0.35) {
            const dropType = Math.random();
            const pType = dropType > 0.6 ? 'ammo' : dropType > 0.3 ? 'health' : 'armor';
            s.pickups.push({ x: e.x, y: e.y, type: pType, value: pType === 'ammo' ? 15 : 25 });
          }
        }
        break;
      }
    }
  }

  // Update enemy bullets
  for (let i = s.enemyBullets.length - 1; i >= 0; i--) {
    const b = s.enemyBullets[i];
    b.x += b.vx;
    b.y += b.vy;
    b.life--;
    if (b.life <= 0 || b.x < -20 || b.x > w + 20 || b.y < -20 || b.y > h + 20) {
      s.enemyBullets.splice(i, 1);
      continue;
    }
    if (isBlocked(b.x, b.y, 4, s.cover)) {
      s.enemyBullets.splice(i, 1);
      for (let p = 0; p < 3; p++) {
        s.particles.push({ x: b.x, y: b.y, vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2, life: 14, color: '#ff6677', size: 2 });
      }
      continue;
    }
    if (Math.abs(b.x - s.playerX) < 18 && Math.abs(b.y - s.playerY) < 18) {
      let dmg = b.damage;
      if (s.playerArmor > 0) {
        const absorbed = Math.min(s.playerArmor, dmg * 0.55);
        s.playerArmor -= absorbed;
        dmg -= absorbed;
      }
      s.playerHealth -= dmg;
      s.screenShake = Math.max(s.screenShake, 9);
      s.enemyBullets.splice(i, 1);
      for (let p = 0; p < 5; p++) {
        s.particles.push({ x: s.playerX, y: s.playerY, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4, life: 18, color: '#ff3355', size: 3 });
      }
    }
  }

  // Pickups
  for (let i = s.pickups.length - 1; i >= 0; i--) {
    const p = s.pickups[i];
    if (Math.abs(p.x - s.playerX) < 25 && Math.abs(p.y - s.playerY) < 25) {
      if (p.type === 'health') s.playerHealth = Math.min(s.playerMaxHealth, s.playerHealth + p.value);
      else if (p.type === 'ammo') s.ammo = Math.min(s.maxAmmo, s.ammo + p.value);
      else if (p.type === 'armor') s.playerArmor = Math.min(50, s.playerArmor + p.value);
      s.pickups.splice(i, 1);
    }
  }

  // Particles
  for (let i = s.particles.length - 1; i >= 0; i--) {
    const p = s.particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    if (p.life <= 0) s.particles.splice(i, 1);
  }

  // Screen shake decay
  if (s.screenShake > 0) s.screenShake -= 0.5;

  // Wave announce decay
  if (s.waveAnnounce > 0) s.waveAnnounce--;

  // Game over
  if (s.playerHealth <= 0) {
    s.playerHealth = 0;
    s.gameOver = true;
  }

  return s;
}
