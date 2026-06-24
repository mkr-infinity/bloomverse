import { GameState, LevelDef } from './engine';
import { CharacterSkin, drawCharacter, drawZombie } from './characters';

export function render(ctx: CanvasRenderingContext2D, state: GameState, w: number, h: number, level: LevelDef, skin: CharacterSkin) {
  ctx.save();

  // Screen shake
  if (state.screenShake > 0) {
    ctx.translate((Math.random() - 0.5) * state.screenShake * 2, (Math.random() - 0.5) * state.screenShake * 2);
  }

  // Background
  ctx.fillStyle = level.bg;
  ctx.fillRect(0, 0, w, h);

  // Ground grid
  ctx.strokeStyle = level.grid;
  ctx.lineWidth = 0.5;
  ctx.globalAlpha = 0.4;
  for (let x = 0; x < w; x += 50) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += 50) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Pickups
  for (const p of state.pickups) {
    const pulse = 0.8 + Math.sin(state.frame * 0.08) * 0.2;
    ctx.globalAlpha = pulse;
    ctx.fillStyle = p.type === 'health' ? '#00ff66' : p.type === 'ammo' ? '#ffcc00' : '#00ccff';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(p.type === 'health' ? '+' : p.type === 'ammo' ? 'A' : 'S', p.x, p.y + 4);
    ctx.globalAlpha = 1;
  }

  // Enemies (draw far ones first)
  const sortedEnemies = [...state.enemies].sort((a, b) => a.y - b.y);
  for (const e of sortedEnemies) {
    drawZombie(ctx, e.x, e.y, e.type, e.frame, e.health, e.maxHealth);
  }

  // Bullets
  ctx.fillStyle = '#ffdd00';
  ctx.shadowColor = '#ffaa00';
  ctx.shadowBlur = 8;
  for (const b of state.bullets) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
    ctx.fill();
    // Trail
    ctx.fillStyle = 'rgba(255, 200, 0, 0.3)';
    ctx.beginPath();
    ctx.arc(b.x - b.vx * 0.5, b.y - b.vy * 0.5, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffdd00';
  }
  ctx.shadowBlur = 0;

  // Player character
  drawCharacter(ctx, state.playerX, state.playerY, skin, 1, state.playerAngle, state.frame, state.isMoving);

  // Particles
  for (const p of state.particles) {
    ctx.globalAlpha = p.life / 40;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Crosshair
  const mx = state.playerX + Math.cos(state.playerAngle) * 50;
  const my = state.playerY + Math.sin(state.playerAngle) * 50;
  ctx.strokeStyle = 'rgba(255, 45, 85, 0.7)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(mx, my, 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(mx - 12, my); ctx.lineTo(mx - 5, my);
  ctx.moveTo(mx + 5, my); ctx.lineTo(mx + 12, my);
  ctx.moveTo(mx, my - 12); ctx.lineTo(mx, my - 5);
  ctx.moveTo(mx, my + 5); ctx.lineTo(mx, my + 12);
  ctx.stroke();

  ctx.restore();

  // HUD - Bottom left health/armor
  drawHUD(ctx, state, w, h);
}

function drawHUD(ctx: CanvasRenderingContext2D, state: GameState, w: number, h: number) {
  // Health bar - bottom left
  const hx = 16, hy = h - 50;
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.beginPath();
  ctx.roundRect(hx - 4, hy - 4, 170, 42, 4);
  ctx.fill();

  ctx.fillStyle = '#888';
  ctx.font = '10px Orbitron, monospace';
  ctx.textAlign = 'left';
  ctx.fillText('HP', hx, hy + 8);
  ctx.fillStyle = '#222';
  ctx.fillRect(hx + 22, hy, 130, 10);
  ctx.fillStyle = state.playerHealth > 30 ? '#ff2d55' : '#ff0000';
  ctx.fillRect(hx + 22, hy, 130 * (state.playerHealth / state.playerMaxHealth), 10);

  if (state.playerArmor > 0) {
    ctx.fillStyle = '#888';
    ctx.fillText('AR', hx, hy + 24);
    ctx.fillStyle = '#222';
    ctx.fillRect(hx + 22, hy + 16, 130, 8);
    ctx.fillStyle = '#00ccff';
    ctx.fillRect(hx + 22, hy + 16, 130 * (state.playerArmor / 50), 8);
  }

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 11px Orbitron, monospace';
  ctx.fillText(`${Math.ceil(state.playerHealth)}`, hx + 155, hy + 9);

  // Ammo - bottom right
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.beginPath();
  ctx.roundRect(w - 120, h - 50, 108, 38, 4);
  ctx.fill();
  ctx.fillStyle = '#ffcc00';
  ctx.font = 'bold 18px Orbitron, monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`${state.ammo}`, w - 40, h - 26);
  ctx.fillStyle = '#666';
  ctx.font = '10px Orbitron, monospace';
  ctx.fillText(`/ ${state.maxAmmo}`, w - 18, h - 26);
  ctx.fillStyle = '#888';
  ctx.font = '9px Orbitron, monospace';
  ctx.fillText('R to reload', w - 18, h - 16);

  // Wave info - top center
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath();
  ctx.roundRect(w / 2 - 80, 8, 160, 28, 4);
  ctx.fill();
  ctx.fillStyle = '#ff6b2d';
  ctx.font = '11px Orbitron, monospace';
  ctx.fillText(`WAVE ${Math.min(state.wave + 1, state.totalWaves)} / ${state.totalWaves}`, w / 2, 26);

  // Score & Kills - top left
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath();
  ctx.roundRect(12, 8, 120, 28, 4);
  ctx.fill();
  ctx.fillStyle = '#00ff88';
  ctx.font = '10px Orbitron, monospace';
  ctx.fillText(`KILLS: ${state.kills}`, 20, 20);
  ctx.fillStyle = '#ccc';
  ctx.fillText(`SCORE: ${state.score}`, 20, 32);
}
