import { GameState, LevelDef } from './engine';
import { CharacterSkin, drawHumanCharacter, drawZombieHuman } from './characters';

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

  // Environment details (static debris based on level seed)
  drawEnvironment(ctx, w, h, level, state.frame);

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
    drawZombieHuman(ctx, e.x, e.y, e.type, e.frame, e.health, e.maxHealth);
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
  drawHumanCharacter(ctx, state.playerX, state.playerY, skin, 1, state.playerAngle, state.frame, state.isMoving);

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

  // Damage vignette when health is low
  if (state.playerHealth < 40) {
    const intensity = 1 - (state.playerHealth / 40);
    ctx.fillStyle = `rgba(100, 0, 0, ${intensity * 0.3})`;
    ctx.fillRect(0, 0, w, h);
    // Pulsing red border
    const pulse = 0.3 + Math.sin(state.frame * 0.1) * 0.15;
    ctx.shadowColor = `rgba(255, 0, 0, ${pulse * intensity})`;
    ctx.shadowBlur = 40;
    ctx.strokeStyle = `rgba(255, 0, 0, ${pulse * intensity})`;
    ctx.lineWidth = 8;
    ctx.strokeRect(0, 0, w, h);
    ctx.shadowBlur = 0;
  }

  // Screen flash on damage (screen shake correlates)
  if (state.screenShake > 8) {
    ctx.fillStyle = `rgba(255, 0, 0, ${(state.screenShake - 8) * 0.03})`;
    ctx.fillRect(0, 0, w, h);
  }
}


function drawEnvironment(ctx: CanvasRenderingContext2D, w: number, h: number, level: LevelDef, frame: number) {
  // Seed-based static debris
  const seed = level.id * 7;
  ctx.globalAlpha = 0.3;

  if (level.world === 'city' || level.world === 'burning') {
    // Rubble / concrete chunks
    ctx.fillStyle = '#2a2a2a';
    for (let i = 0; i < 12; i++) {
      const rx = ((seed + i * 137) % w);
      const ry = ((seed + i * 89) % h);
      const rs = 4 + (i % 5) * 2;
      ctx.fillRect(rx, ry, rs, rs * 0.6);
    }
    // Cracks
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const cx = ((seed + i * 200) % w);
      const cy = ((seed + i * 150) % h);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + 20, cy + 10);
      ctx.lineTo(cx + 25, cy + 30);
      ctx.stroke();
    }
  } else if (level.world === 'desert') {
    // Sand dunes / rocks
    ctx.fillStyle = '#3a2a10';
    for (let i = 0; i < 8; i++) {
      const rx = ((seed + i * 171) % w);
      const ry = ((seed + i * 113) % h);
      ctx.beginPath();
      ctx.ellipse(rx, ry, 8 + i * 2, 4 + i, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (level.world === 'frozen') {
    // Ice shards
    ctx.fillStyle = '#2a4455';
    for (let i = 0; i < 8; i++) {
      const rx = ((seed + i * 131) % w);
      const ry = ((seed + i * 97) % h);
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx + 4, ry - 12);
      ctx.lineTo(rx + 8, ry);
      ctx.fill();
    }
  } else if (level.world === 'sky') {
    // Floating fragments - slight movement
    ctx.fillStyle = '#1a1a3a';
    for (let i = 0; i < 6; i++) {
      const rx = ((seed + i * 157) % w);
      const ry = ((seed + i * 123) % h) + Math.sin(frame * 0.01 + i) * 3;
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx + 15, ry + 5);
      ctx.lineTo(rx + 12, ry + 12);
      ctx.lineTo(rx - 3, ry + 8);
      ctx.closePath();
      ctx.fill();
    }
  } else if (level.world === 'void') {
    // Void particles
    ctx.fillStyle = '#2a0a2a';
    for (let i = 0; i < 15; i++) {
      const rx = ((seed + i * 143 + frame * 0.2) % w);
      const ry = ((seed + i * 107) % h);
      const rs = 1 + Math.sin(frame * 0.02 + i) * 1;
      ctx.beginPath();
      ctx.arc(rx, ry, rs, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.globalAlpha = 1;
}
function drawHUD(ctx: CanvasRenderingContext2D, state: GameState, w: number, h: number) {
  // Health bar - bottom left
  const hx = 16, hy = h - 50;
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  fillRoundRect(ctx, hx - 4, hy - 4, 170, 42, 4);

  ctx.fillStyle = '#888';
  ctx.font = '10px Orbitron, monospace';
  ctx.textAlign = 'left';
  ctx.fillText('HP', hx, hy + 8);
  ctx.fillStyle = '#222';
  ctx.fillRect(hx + 22, hy, 130, 10);
  const hpColor = state.playerHealth > 60 ? '#00cc44' : state.playerHealth > 30 ? '#ff8800' : '#ff0000';
  ctx.fillStyle = hpColor;
  ctx.fillRect(hx + 22, hy, 130 * (state.playerHealth / state.playerMaxHealth), 10);
  // HP glow when low
  if (state.playerHealth <= 30) {
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 6;
    ctx.fillRect(hx + 22, hy, 130 * (state.playerHealth / state.playerMaxHealth), 10);
    ctx.shadowBlur = 0;
  }

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
  fillRoundRect(ctx, w - 130, h - 54, 118, 42, 4);
  ctx.fillStyle = state.ammo > 5 ? '#ffcc00' : '#ff4400';
  ctx.font = 'bold 20px Orbitron, monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`${state.ammo}`, w - 44, h - 26);
  ctx.fillStyle = '#555';
  ctx.font = '11px Orbitron, monospace';
  ctx.fillText(`/ ${state.maxAmmo}`, w - 18, h - 26);
  // Reload hint flashes when empty
  if (state.ammo === 0) {
    ctx.fillStyle = `rgba(255, 68, 0, ${0.5 + Math.sin(state.frame * 0.15) * 0.5})`;
  } else {
    ctx.fillStyle = '#555';
  }
  ctx.font = '9px Orbitron, monospace';
  ctx.fillText('[R] RELOAD', w - 18, h - 14);

  // Wave info - top center
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  fillRoundRect(ctx, w / 2 - 90, 8, 180, 32, 4);
  ctx.fillStyle = '#ff6b2d';
  ctx.font = 'bold 11px Orbitron, monospace';
  const waveNum = Math.min(state.wave + 1, state.totalWaves);
  ctx.fillText(`WAVE ${waveNum} / ${state.totalWaves}`, w / 2, 24);
  // Wave progress bar
  ctx.fillStyle = '#222';
  ctx.fillRect(w / 2 - 50, 30, 100, 4);
  ctx.fillStyle = '#ff6b2d';
  ctx.fillRect(w / 2 - 50, 30, 100 * (waveNum / state.totalWaves), 4);

  // Kills & Score - top left
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  fillRoundRect(ctx, 12, 8, 110, 32, 4);
  ctx.fillStyle = '#00ff88';
  ctx.font = 'bold 10px Orbitron, monospace';
  ctx.fillText(`KILLS ${state.kills}`, 20, 22);
  ctx.fillStyle = '#aaa';
  ctx.font = '9px Orbitron, monospace';
  ctx.fillText(`SCORE ${state.score}`, 20, 34);

  // Enemies remaining - top right
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  fillRoundRect(ctx, w - 100, 8, 88, 24, 4);
  ctx.fillStyle = '#ff4455';
  ctx.font = '10px Orbitron, monospace';
  ctx.fillText(`${state.enemies.length} ENEMIES`, w - 18, 24);
}

function fillRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}
