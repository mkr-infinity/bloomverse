import { Enemy, Projectile, Pickup, Vector2, GameInput, WaveConfig } from './types';
import { LevelConfig } from './types';

let nextId = 0;
const uid = () => `e${nextId++}`;

function dist(a: Vector2, b: Vector2) {
  const dx = a.x - b.x, dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function normalize(v: Vector2): Vector2 {
  const len = Math.sqrt(v.x * v.x + v.y * v.y);
  return len > 0 ? { x: v.x / len, y: v.y / len } : { x: 0, y: 0 };
}

export interface PlayerEntity {
  pos: Vector2;
  vel: Vector2;
  size: number;
  angle: number;
  speed: number;
}

export interface GameEngineState {
  player: PlayerEntity;
  enemies: Enemy[];
  projectiles: Projectile[];
  pickups: Pickup[];
  wave: number;
  waveEnemiesSpawned: number;
  waveEnemiesTotal: number;
  waveComplete: boolean;
  levelComplete: boolean;
  gameOver: boolean;
  spawnTimer: number;
  screenShake: number;
  damageIndicators: { x: number; y: number; value: number; time: number }[];
  particles: { x: number; y: number; vx: number; vy: number; life: number; color: string }[];
}

const ENEMY_STATS: Record<Enemy['type'], { health: number; speed: number; damage: number; size: number; xpValue: number }> = {
  walker: { health: 30, speed: 1, damage: 8, size: 18, xpValue: 10 },
  runner: { health: 20, speed: 2.5, damage: 12, size: 14, xpValue: 15 },
  tank: { health: 120, speed: 0.6, damage: 20, size: 28, xpValue: 30 },
  explosive: { health: 15, speed: 1.8, damage: 35, size: 16, xpValue: 20 },
  boss: { health: 500, speed: 0.8, damage: 30, size: 45, xpValue: 200 },
};

export function createInitialState(canvasW: number, canvasH: number): GameEngineState {
  return {
    player: { pos: { x: canvasW / 2, y: canvasH / 2 }, vel: { x: 0, y: 0 }, size: 16, angle: 0, speed: 3.5 },
    enemies: [],
    projectiles: [],
    pickups: [],
    wave: 0,
    waveEnemiesSpawned: 0,
    waveEnemiesTotal: 0,
    waveComplete: false,
    levelComplete: false,
    gameOver: false,
    spawnTimer: 0,
    screenShake: 0,
    damageIndicators: [],
    particles: [],
  };
}

export function spawnEnemy(state: GameEngineState, type: Enemy['type'], canvasW: number, canvasH: number): Enemy {
  const stats = ENEMY_STATS[type];
  const side = Math.floor(Math.random() * 4);
  let x = 0, y = 0;
  const margin = 50;
  switch (side) {
    case 0: x = Math.random() * canvasW; y = -margin; break;
    case 1: x = canvasW + margin; y = Math.random() * canvasH; break;
    case 2: x = Math.random() * canvasW; y = canvasH + margin; break;
    case 3: x = -margin; y = Math.random() * canvasH; break;
  }
  return {
    id: uid(), pos: { x, y }, vel: { x: 0, y: 0 }, size: stats.size,
    health: stats.health, maxHealth: stats.health, active: true,
    type, damage: stats.damage, speed: stats.speed,
    attackCooldown: 1000, lastAttack: 0, xpValue: stats.xpValue,
  };
}

export function updateEngine(
  state: GameEngineState,
  input: GameInput,
  dt: number,
  canvasW: number,
  canvasH: number,
  levelConfig: LevelConfig,
  onDamagePlayer: (dmg: number) => void,
  onKill: (xp: number) => void,
  onPickup: (type: Pickup['type'], value: number) => void,
  playerHealth: number,
): GameEngineState {
  if (state.gameOver || state.levelComplete) return state;

  const s = { ...state };
  const now = Date.now();

  // Player movement
  const p = { ...s.player };
  let dx = 0, dy = 0;
  if (input.up) dy -= 1;
  if (input.down) dy += 1;
  if (input.left) dx -= 1;
  if (input.right) dx += 1;
  const moveDir = normalize({ x: dx, y: dy });
  p.pos = {
    x: Math.max(p.size, Math.min(canvasW - p.size, p.pos.x + moveDir.x * p.speed * dt * 0.06)),
    y: Math.max(p.size, Math.min(canvasH - p.size, p.pos.y + moveDir.y * p.speed * dt * 0.06)),
  };
  p.angle = Math.atan2(input.mouseY - p.pos.y, input.mouseX - p.pos.x);
  s.player = p;

  // Wave spawning
  const waves = levelConfig.waves;
  if (s.wave < waves.length) {
    const waveConfig = waves[s.wave];
    const totalInWave = waveConfig.enemies.reduce((sum, e) => sum + e.count, 0);
    if (s.waveEnemiesTotal === 0) s.waveEnemiesTotal = totalInWave;

    s.spawnTimer -= dt;
    if (s.spawnTimer <= 0 && s.waveEnemiesSpawned < totalInWave) {
      const toSpawn = pickEnemyType(waveConfig, s.waveEnemiesSpawned);
      if (toSpawn) {
        s.enemies = [...s.enemies, spawnEnemy(s, toSpawn, canvasW, canvasH)];
        s.waveEnemiesSpawned++;
      }
      s.spawnTimer = waveConfig.spawnDelay;
    }

    const allSpawned = s.waveEnemiesSpawned >= totalInWave;
    const allDead = s.enemies.filter(e => e.active).length === 0;
    if (allSpawned && allDead) {
      s.wave++;
      s.waveEnemiesSpawned = 0;
      s.waveEnemiesTotal = 0;
      s.spawnTimer = 2000;
      // Drop pickup between waves
      s.pickups = [...s.pickups, createPickup(canvasW, canvasH)];
    }
  } else {
    const allDead = s.enemies.filter(e => e.active).length === 0;
    if (allDead) s.levelComplete = true;
  }

  // Update enemies
  s.enemies = s.enemies.map((e) => {
    if (!e.active) return e;
    const dir = normalize({ x: p.pos.x - e.pos.x, y: p.pos.y - e.pos.y });
    const newPos = { x: e.pos.x + dir.x * e.speed * dt * 0.06, y: e.pos.y + dir.y * e.speed * dt * 0.06 };

    // Attack player
    if (dist(newPos, p.pos) < e.size + p.size) {
      if (now - e.lastAttack > e.attackCooldown) {
        onDamagePlayer(e.damage);
        s.screenShake = 8;
        s.damageIndicators = [...s.damageIndicators, { x: p.pos.x, y: p.pos.y - 20, value: e.damage, time: now }];
        return { ...e, pos: newPos, lastAttack: now };
      }
    }
    return { ...e, pos: newPos };
  });

  // Update projectiles
  s.projectiles = s.projectiles.map((proj) => {
    if (!proj.active) return proj;
    const newPos = { x: proj.pos.x + proj.vel.x * dt * 0.06, y: proj.pos.y + proj.vel.y * dt * 0.06 };
    proj = { ...proj, pos: newPos, lifetime: proj.lifetime - dt };
    if (proj.lifetime <= 0 || newPos.x < -50 || newPos.x > canvasW + 50 || newPos.y < -50 || newPos.y > canvasH + 50) {
      return { ...proj, active: false };
    }
    return proj;
  }).filter(p => p.active);

  // Projectile-enemy collision
  const newEnemies = [...s.enemies];
  s.projectiles = s.projectiles.filter((proj) => {
    for (let i = 0; i < newEnemies.length; i++) {
      const e = newEnemies[i];
      if (!e.active) continue;
      if (dist(proj.pos, e.pos) < e.size + 4) {
        const newHealth = e.health - proj.damage;
        if (newHealth <= 0) {
          newEnemies[i] = { ...e, health: 0, active: false };
          onKill(e.xpValue);
          s.particles = [...s.particles, ...createDeathParticles(e.pos, e.type)];
          // Random drop
          if (Math.random() < 0.3) {
            s.pickups = [...s.pickups, createPickup(canvasW, canvasH, e.pos)];
          }
        } else {
          newEnemies[i] = { ...e, health: newHealth };
          s.damageIndicators = [...s.damageIndicators, { x: e.pos.x, y: e.pos.y - e.size, value: proj.damage, time: now }];
        }
        return false;
      }
    }
    return true;
  });
  s.enemies = newEnemies;

  // Pickup collection
  s.pickups = s.pickups.filter((pk) => {
    if (!pk.active) return false;
    if (dist(pk.pos, p.pos) < p.size + 12) {
      onPickup(pk.type, pk.value);
      return false;
    }
    return true;
  });

  // Update particles
  s.particles = s.particles.map(pt => ({
    ...pt, x: pt.x + pt.vx * dt * 0.06, y: pt.y + pt.vy * dt * 0.06, life: pt.life - dt
  })).filter(pt => pt.life > 0);

  // Update damage indicators
  s.damageIndicators = s.damageIndicators.filter(d => now - d.time < 800);

  // Screen shake decay
  s.screenShake = Math.max(0, s.screenShake - dt * 0.02);

  // Game over check
  if (playerHealth <= 0) s.gameOver = true;

  return s;
}

export function fireProjectile(state: GameEngineState, damage: number, speed: number = 12): GameEngineState {
  const { player } = state;
  const vel = { x: Math.cos(player.angle) * speed, y: Math.sin(player.angle) * speed };
  const proj: Projectile = {
    id: uid(), pos: { ...player.pos }, vel, damage, active: true, lifetime: 2000,
  };
  return { ...state, projectiles: [...state.projectiles, proj] };
}

function pickEnemyType(wave: WaveConfig, spawned: number): Enemy['type'] | null {
  let count = 0;
  for (const entry of wave.enemies) {
    count += entry.count;
    if (spawned < count) return entry.type;
  }
  return null;
}

function createPickup(canvasW: number, canvasH: number, pos?: Vector2): Pickup {
  const types: Pickup['type'][] = ['health', 'ammo', 'armor', 'credits'];
  const type = types[Math.floor(Math.random() * types.length)];
  const values = { health: 25, ammo: 10, armor: 15, credits: 50 };
  return {
    id: uid(),
    pos: pos || { x: 50 + Math.random() * (canvasW - 100), y: 50 + Math.random() * (canvasH - 100) },
    type, value: values[type], active: true,
  };
}

function createDeathParticles(pos: Vector2, type: Enemy['type']) {
  const colors: Record<string, string> = { walker: '#88ff88', runner: '#ff8888', tank: '#8888ff', explosive: '#ffaa00', boss: '#ff2d55' };
  const count = type === 'boss' ? 20 : 8;
  return Array.from({ length: count }, () => ({
    x: pos.x, y: pos.y,
    vx: (Math.random() - 0.5) * 6,
    vy: (Math.random() - 0.5) * 6,
    life: 500 + Math.random() * 300,
    color: colors[type] || '#ffffff',
  }));
}
