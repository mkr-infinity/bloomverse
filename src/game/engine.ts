export interface Vec2 { x: number; y: number; }

export interface Bullet {
  x: number; y: number;
  vx: number; vy: number;
  damage: number;
  life: number;
}

export interface Enemy {
  x: number; y: number;
  type: 'walker' | 'runner' | 'tank' | 'explosive' | 'boss';
  health: number; maxHealth: number;
  speed: number; damage: number;
  lastAttack: number;
  frame: number;
}

export interface Pickup {
  x: number; y: number;
  type: 'health' | 'ammo' | 'armor';
  value: number;
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
  pickups: Pickup[];
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

const ENEMY_STATS: Record<Enemy['type'], { health: number; speed: number; damage: number }> = {
  walker: { health: 40, speed: 0.8, damage: 8 },
  runner: { health: 25, speed: 2.0, damage: 12 },
  tank: { health: 150, speed: 0.5, damage: 20 },
  explosive: { health: 20, speed: 1.5, damage: 40 },
  boss: { health: 600, speed: 0.7, damage: 25 },
};

export function createGameState(w: number, h: number, level: LevelDef): GameState {
  const totalEnemies = level.waves.flat().reduce((s, e) => s + e.count, 0);
  return {
    playerX: w / 2, playerY: h / 2, playerAngle: 0,
    playerHealth: 100, playerMaxHealth: 100, playerArmor: 0,
    ammo: 30, maxAmmo: 30, score: 0,
    wave: 0, totalWaves: level.waves.length,
    enemies: [], bullets: [], pickups: [], particles: [],
    enemiesSpawned: 0, enemiesInWave: totalEnemies,
    spawnTimer: 60, screenShake: 0, frame: 0,
    isMoving: false, waveComplete: false, levelComplete: false,
    gameOver: false, paused: false, kills: 0,
  };
}

export function spawnEnemy(type: Enemy['type'], w: number, h: number): Enemy {
  const stats = ENEMY_STATS[type];
  const side = Math.floor(Math.random() * 4);
  let x = 0, y = 0;
  switch (side) {
    case 0: x = Math.random() * w; y = -40; break;
    case 1: x = w + 40; y = Math.random() * h; break;
    case 2: x = Math.random() * w; y = h + 40; break;
    case 3: x = -40; y = Math.random() * h; break;
  }
  return { x, y, type, health: stats.health, maxHealth: stats.health, speed: stats.speed, damage: stats.damage, lastAttack: 0, frame: Math.random() * 100 };
}

export function tick(state: GameState, input: { up: boolean; down: boolean; left: boolean; right: boolean; mouseX: number; mouseY: number; shoot: boolean; reload: boolean }, w: number, h: number, level: LevelDef): GameState {
  if (state.paused || state.gameOver || state.levelComplete) return state;
  const s = { ...state, enemies: [...state.enemies], bullets: [...state.bullets], pickups: [...state.pickups], particles: [...state.particles] };
  s.frame++;

  // Player movement
  const speed = 3.2;
  let dx = 0, dy = 0;
  if (input.up) dy -= 1;
  if (input.down) dy += 1;
  if (input.left) dx -= 1;
  if (input.right) dx += 1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  s.isMoving = dx !== 0 || dy !== 0;
  s.playerX = Math.max(20, Math.min(w - 20, s.playerX + (dx / len) * speed));
  s.playerY = Math.max(20, Math.min(h - 20, s.playerY + (dy / len) * speed));
  s.playerAngle = Math.atan2(input.mouseY - s.playerY, input.mouseX - s.playerX);

  // Shooting
  if (input.shoot && s.ammo > 0 && s.frame % 8 === 0) {
    const bSpeed = 10;
    const spread = 0.05;
    const angle = s.playerAngle + (Math.random() - 0.5) * spread;
    s.bullets.push({
      x: s.playerX + Math.cos(s.playerAngle) * 20,
      y: s.playerY + Math.sin(s.playerAngle) * 20,
      vx: Math.cos(angle) * bSpeed,
      vy: Math.sin(angle) * bSpeed,
      damage: 20 + Math.floor(level.id * 2),
      life: 60,
    });
    s.ammo--;
    // Muzzle flash particle
    s.particles.push({
      x: s.playerX + Math.cos(s.playerAngle) * 22,
      y: s.playerY + Math.sin(s.playerAngle) * 22,
      vx: Math.cos(s.playerAngle) * 3, vy: Math.sin(s.playerAngle) * 3,
      life: 5, color: '#ffff00', size: 5,
    });
  }

  // Reload (takes time)
  if (input.reload && s.ammo < s.maxAmmo) {
    s.ammo = s.maxAmmo;
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
          s.enemies.push(spawnEnemy(entry.type, w, h));
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
    if (dist > 1) {
      // Random zigzag for non-tanks
      const wobble = e.type === 'runner' ? Math.sin(e.frame * 0.1) * 0.5 : 0;
      e.x += (edx / dist) * e.speed + wobble;
      e.y += (edy / dist) * e.speed;
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
          // Random drop
          if (Math.random() < 0.2) {
            s.pickups.push({ x: e.x, y: e.y, type: Math.random() > 0.6 ? 'armor' : Math.random() > 0.5 ? 'health' : 'ammo', value: 20 });
          }
        }
        break;
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

  // Game over
  if (s.playerHealth <= 0) {
    s.playerHealth = 0;
    s.gameOver = true;
  }

  return s;
}
