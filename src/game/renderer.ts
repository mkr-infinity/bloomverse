import { GameState, LevelDef } from './engine';
import { CharacterSkin, drawHumanCharacter, drawZombieHuman } from './characters';

export function render(ctx: CanvasRenderingContext2D, state: GameState, w: number, h: number, level: LevelDef, skin: CharacterSkin) {
  ctx.save();

  // Screen shake
  if (state.screenShake > 0) {
    ctx.translate((Math.random() - 0.5) * state.screenShake * 2, (Math.random() - 0.5) * state.screenShake * 2);
  }

  // Rich battlefield background per world
  drawBattlefield(ctx, w, h, level, state.frame);

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

  // Wave announcement
  if (state.waveAnnounce > 0) {
    const alpha = Math.min(1, state.waveAnnounce / 30);
    const scale = 1 + (90 - state.waveAnnounce) * 0.002;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.textAlign = 'center';
    ctx.font = `bold ${Math.floor(28 * scale)}px Orbitron, monospace`;
    ctx.fillStyle = '#ff6b2d';
    ctx.shadowColor = '#ff6b2d';
    ctx.shadowBlur = 15;
    ctx.fillText(`WAVE ${state.wave + 1}`, w / 2, h / 2 - 20);
    ctx.font = '12px Orbitron, monospace';
    ctx.fillStyle = '#ccc';
    ctx.shadowBlur = 0;
    ctx.fillText('INCOMING', w / 2, h / 2 + 5);
    ctx.restore();
  }

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


function drawBattlefield(ctx: CanvasRenderingContext2D, w: number, h: number, level: LevelDef, frame: number) {
  const seed = level.id * 31;
  const rand = (n: number) => {
    const x = Math.sin(seed + n * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };

  if (level.world === 'city') {
    // Cracked asphalt ground
    ctx.fillStyle = '#15171c';
    ctx.fillRect(0, 0, w, h);
    // Road texture
    const grd = ctx.createLinearGradient(0, 0, w, h);
    grd.addColorStop(0, '#1a1c22');
    grd.addColorStop(0.5, '#141519');
    grd.addColorStop(1, '#1c1e24');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);
    // Road markings
    ctx.strokeStyle = 'rgba(200,180,60,0.15)';
    ctx.lineWidth = 4;
    ctx.setLineDash([30, 25]);
    ctx.beginPath(); ctx.moveTo(w * 0.5, 0); ctx.lineTo(w * 0.5, h); ctx.stroke();
    ctx.setLineDash([]);
    // Cracks
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 8; i++) {
      const cx = rand(i) * w, cy = rand(i + 50) * h;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + 30 + rand(i + 1) * 40, cy + 15);
      ctx.lineTo(cx + 50, cy + 40 + rand(i + 2) * 30);
      ctx.stroke();
    }
    // Abandoned cars / debris blocks
    for (let i = 0; i < 5; i++) {
      const cx = 60 + rand(i + 10) * (w - 120), cy = 60 + rand(i + 20) * (h - 120);
      ctx.fillStyle = '#22242c';
      fillRoundRect(ctx, cx, cy, 44, 22, 4);
      ctx.fillStyle = '#181a20';
      fillRoundRect(ctx, cx + 6, cy - 8, 30, 14, 3);
      ctx.fillStyle = 'rgba(80,120,160,0.2)';
      ctx.fillRect(cx + 9, cy - 6, 24, 8);
    }
  } else if (level.world === 'desert') {
    // Sandy ground
    const grd = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, w);
    grd.addColorStop(0, '#3a2e16');
    grd.addColorStop(1, '#241c0e');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);
    // Sand dune curves
    ctx.strokeStyle = 'rgba(120,95,45,0.25)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 6; i++) {
      const y = (i / 6) * h + Math.sin(frame * 0.005 + i) * 5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= w; x += 40) {
        ctx.lineTo(x, y + Math.sin(x * 0.02 + i) * 12);
      }
      ctx.stroke();
    }
    // Rocks & ruins (pillars)
    for (let i = 0; i < 6; i++) {
      const cx = 50 + rand(i + 5) * (w - 100), cy = 50 + rand(i + 15) * (h - 100);
      ctx.fillStyle = '#4a3a20';
      fillRoundRect(ctx, cx, cy, 16, 38, 3);
      ctx.fillStyle = '#5a4628';
      fillRoundRect(ctx, cx - 3, cy - 6, 22, 8, 2);
    }
  } else if (level.world === 'frozen') {
    // Ice ground
    const grd = ctx.createLinearGradient(0, 0, w, h);
    grd.addColorStop(0, '#16242f');
    grd.addColorStop(0.5, '#1a2e3a');
    grd.addColorStop(1, '#122028');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);
    // Ice cracks (web pattern)
    ctx.strokeStyle = 'rgba(150,210,240,0.18)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const cx = rand(i + 3) * w, cy = rand(i + 33) * h;
      for (let a = 0; a < 5; a++) {
        const ang = (a / 5) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(ang) * 40, cy + Math.sin(ang) * 40);
        ctx.stroke();
      }
    }
    // Ice shards / snow piles
    for (let i = 0; i < 7; i++) {
      const cx = 40 + rand(i + 7) * (w - 80), cy = 40 + rand(i + 17) * (h - 80);
      ctx.fillStyle = 'rgba(180,220,250,0.25)';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + 8, cy - 22);
      ctx.lineTo(cx + 16, cy);
      ctx.closePath();
      ctx.fill();
    }
  } else if (level.world === 'burning') {
    // Scorched ground
    const grd = ctx.createRadialGradient(w / 2, h / 2, 30, w / 2, h / 2, w);
    grd.addColorStop(0, '#2a1208');
    grd.addColorStop(1, '#160805');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);
    // Lava cracks (glowing)
    const glow = 0.4 + Math.sin(frame * 0.05) * 0.2;
    ctx.strokeStyle = `rgba(255,100,20,${glow})`;
    ctx.lineWidth = 2;
    ctx.shadowColor = '#ff5500';
    ctx.shadowBlur = 8;
    for (let i = 0; i < 6; i++) {
      const cx = rand(i + 2) * w, cy = rand(i + 22) * h;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + 40 + rand(i) * 30, cy + 20);
      ctx.lineTo(cx + 60, cy + 50);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
    // Embers floating
    for (let i = 0; i < 20; i++) {
      const ex = (rand(i + 60) * w + frame * 0.3) % w;
      const ey = (rand(i + 70) * h - frame * 0.5 + h) % h;
      ctx.fillStyle = `rgba(255,${120 + rand(i) * 100},30,${0.4 + rand(i) * 0.4})`;
      ctx.fillRect(ex, ey, 2, 2);
    }
  } else if (level.world === 'sky') {
    // Sky void
    const grd = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, w);
    grd.addColorStop(0, '#16163a');
    grd.addColorStop(1, '#0a0a1e');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);
    // Stars
    for (let i = 0; i < 40; i++) {
      const sx = rand(i) * w, sy = rand(i + 40) * h;
      ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.sin(frame * 0.03 + i) * 0.3})`;
      ctx.fillRect(sx, sy, 1.5, 1.5);
    }
    // Floating platform edges (the island they fight on)
    ctx.fillStyle = 'rgba(40,40,80,0.4)';
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2, w * 0.42, h * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(120,100,200,0.3)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2, w * 0.42, h * 0.42, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Floating rocks
    for (let i = 0; i < 5; i++) {
      const cx = 60 + rand(i + 9) * (w - 120);
      const cy = 60 + rand(i + 19) * (h - 120) + Math.sin(frame * 0.02 + i) * 6;
      ctx.fillStyle = '#2a2a4a';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + 20, cy + 6);
      ctx.lineTo(cx + 16, cy + 16);
      ctx.lineTo(cx - 2, cy + 12);
      ctx.closePath();
      ctx.fill();
    }
  } else { // void
    ctx.fillStyle = '#040308';
    ctx.fillRect(0, 0, w, h);
    // Void energy waves
    const grd = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w * 0.7);
    grd.addColorStop(0, 'rgba(80,10,80,0.3)');
    grd.addColorStop(0.5, 'rgba(40,5,50,0.15)');
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);
    // Swirling void particles
    for (let i = 0; i < 30; i++) {
      const ang = (i / 30) * Math.PI * 2 + frame * 0.01;
      const dist = 100 + (i % 5) * 60 + Math.sin(frame * 0.02 + i) * 20;
      const vx = w / 2 + Math.cos(ang) * dist;
      const vy = h / 2 + Math.sin(ang) * dist;
      ctx.fillStyle = `rgba(${150 + rand(i) * 100},20,${150 + rand(i) * 80},${0.3 + rand(i) * 0.3})`;
      ctx.beginPath();
      ctx.arc(vx, vy, 1.5 + rand(i) * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Subtle vignette for all
  const vig = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, w * 0.7);
  vig.addColorStop(0, 'transparent');
  vig.addColorStop(1, 'rgba(0,0,0,0.5)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);
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

  // Minimap - bottom center
  drawMinimap(ctx, state, w, h);
}

function drawMinimap(ctx: CanvasRenderingContext2D, state: GameState, canvasW: number, canvasH: number) {
  const size = 80;
  const mx = canvasW / 2 - size / 2;
  const my = canvasH - size - 12;
  const scale = size / Math.max(canvasW, canvasH);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  fillRoundRect(ctx, mx - 2, my - 2, size + 4, size + 4, 4);

  // Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.strokeRect(mx, my, size, size);

  // Player dot
  const px = mx + state.playerX * scale;
  const py = my + state.playerY * scale;
  ctx.fillStyle = '#00d4ff';
  ctx.beginPath();
  ctx.arc(px, py, 3, 0, Math.PI * 2);
  ctx.fill();

  // Enemy dots
  ctx.fillStyle = '#ff2d55';
  for (const e of state.enemies) {
    const ex = mx + e.x * scale;
    const ey = my + e.y * scale;
    if (ex >= mx && ex <= mx + size && ey >= my && ey <= my + size) {
      ctx.beginPath();
      ctx.arc(ex, ey, e.type === 'boss' ? 3 : 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Pickup dots
  ctx.fillStyle = '#00ff88';
  for (const p of state.pickups) {
    const ppx = mx + p.x * scale;
    const ppy = my + p.y * scale;
    ctx.fillRect(ppx - 1, ppy - 1, 2, 2);
  }
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
