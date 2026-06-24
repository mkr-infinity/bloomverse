import { GameEngineState } from './engine';
import { Enemy, Pickup } from './types';
import { LevelConfig } from './types';

export function renderGame(
  ctx: CanvasRenderingContext2D,
  state: GameEngineState,
  w: number,
  h: number,
  level: LevelConfig,
) {
  ctx.save();

  // Screen shake
  if (state.screenShake > 0) {
    const sx = (Math.random() - 0.5) * state.screenShake * 2;
    const sy = (Math.random() - 0.5) * state.screenShake * 2;
    ctx.translate(sx, sy);
  }

  // Background
  ctx.fillStyle = level.bgColor;
  ctx.fillRect(0, 0, w, h);

  // Grid overlay
  ctx.strokeStyle = level.ambientColor;
  ctx.lineWidth = 0.5;
  ctx.globalAlpha = 0.3;
  const gridSize = 60;
  for (let x = 0; x < w; x += gridSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += gridSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Pickups
  for (const pk of state.pickups) {
    if (!pk.active) continue;
    drawPickup(ctx, pk);
  }

  // Enemies
  for (const enemy of state.enemies) {
    if (!enemy.active) continue;
    drawEnemy(ctx, enemy);
  }

  // Projectiles
  ctx.fillStyle = '#ffdd00';
  ctx.shadowColor = '#ffdd00';
  ctx.shadowBlur = 6;
  for (const proj of state.projectiles) {
    ctx.beginPath();
    ctx.arc(proj.pos.x, proj.pos.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;

  // Player
  drawPlayer(ctx, state);

  // Particles
  for (const pt of state.particles) {
    ctx.globalAlpha = Math.min(1, pt.life / 200);
    ctx.fillStyle = pt.color;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Damage indicators
  for (const d of state.damageIndicators) {
    const age = Date.now() - d.time;
    const alpha = 1 - age / 800;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ff2d55';
    ctx.font = 'bold 14px Rajdhani';
    ctx.fillText(`-${d.value}`, d.x - 10, d.y - age * 0.03);
  }
  ctx.globalAlpha = 1;

  ctx.restore();
}

function drawPlayer(ctx: CanvasRenderingContext2D, state: GameEngineState) {
  const { player } = state;
  const { pos, angle, size } = player;

  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.rotate(angle);

  // Body
  ctx.fillStyle = '#00d4ff';
  ctx.shadowColor = '#00d4ff';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2);
  ctx.fill();

  // Inner
  ctx.fillStyle = '#0a2040';
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.6, 0, Math.PI * 2);
  ctx.fill();

  // Weapon indicator
  ctx.fillStyle = '#ffdd00';
  ctx.fillRect(size * 0.5, -2, size * 0.8, 4);

  ctx.restore();
}

function drawEnemy(ctx: CanvasRenderingContext2D, enemy: Enemy) {
  const colors: Record<Enemy['type'], string> = {
    walker: '#44cc44',
    runner: '#ff6644',
    tank: '#6666ff',
    explosive: '#ffaa00',
    boss: '#ff2d55',
  };
  const { pos, size, type, health, maxHealth } = enemy;

  ctx.fillStyle = colors[type];
  ctx.shadowColor = colors[type];
  ctx.shadowBlur = 8;

  if (type === 'boss') {
    // Hexagonal shape for boss
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      const px = pos.x + Math.cos(a) * size;
      const py = pos.y + Math.sin(a) * size;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  } else if (type === 'tank') {
    ctx.fillRect(pos.x - size, pos.y - size, size * 2, size * 2);
  } else {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;

  // Health bar
  if (health < maxHealth) {
    const barW = size * 2;
    const barH = 3;
    const barY = pos.y - size - 8;
    ctx.fillStyle = '#333';
    ctx.fillRect(pos.x - barW / 2, barY, barW, barH);
    ctx.fillStyle = '#ff2d55';
    ctx.fillRect(pos.x - barW / 2, barY, barW * (health / maxHealth), barH);
  }
}

function drawPickup(ctx: CanvasRenderingContext2D, pk: Pickup) {
  const colors: Record<Pickup['type'], string> = {
    health: '#00ff88',
    ammo: '#ffdd00',
    armor: '#00d4ff',
    credits: '#ff6b2d',
  };
  const pulse = 0.8 + Math.sin(Date.now() * 0.005) * 0.2;
  ctx.fillStyle = colors[pk.type];
  ctx.globalAlpha = pulse;
  ctx.beginPath();
  ctx.arc(pk.pos.x, pk.pos.y, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Symbol
  ctx.fillStyle = '#000';
  ctx.font = 'bold 10px Rajdhani';
  ctx.textAlign = 'center';
  const symbols: Record<Pickup['type'], string> = { health: '+', ammo: 'A', armor: 'S', credits: 'C' };
  ctx.fillText(symbols[pk.type], pk.pos.x, pk.pos.y + 4);
  ctx.textAlign = 'start';
}
