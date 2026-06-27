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

  // === CINEMATIC LIGHTING: darken the field, then a warm light pool around
  // the player so the action reads clearly (action-game look). ===
  ctx.fillStyle = 'rgba(2,3,10,0.34)';
  ctx.fillRect(0, 0, w, h);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const lp = ctx.createRadialGradient(state.playerX, state.playerY, 12, state.playerX, state.playerY, 210);
  lp.addColorStop(0, 'rgba(255,230,180,0.22)');
  lp.addColorStop(0.5, 'rgba(255,180,110,0.08)');
  lp.addColorStop(1, 'transparent');
  ctx.fillStyle = lp;
  ctx.beginPath();
  ctx.arc(state.playerX, state.playerY, 210, 0, Math.PI * 2);
  ctx.fill();
  // muzzle flash burst — the engine emits a short-lived yellow particle per shot
  const firing = state.particles.some((p) => p.color === '#ffff00' && p.life > 2);
  if (firing) {
    const mx = state.playerX + Math.cos(state.playerAngle) * 24;
    const my = state.playerY + Math.sin(state.playerAngle) * 24;
    const mf = ctx.createRadialGradient(mx, my, 1, mx, my, 50);
    mf.addColorStop(0, 'rgba(255,240,170,0.55)');
    mf.addColorStop(1, 'transparent');
    ctx.fillStyle = mf;
    ctx.beginPath(); ctx.arc(mx, my, 50, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();

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

  // Enemy bullets
  ctx.fillStyle = '#ff3355';
  ctx.shadowColor = '#ff3355';
  ctx.shadowBlur = 10;
  for (const b of state.enemyBullets) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.source === 'boss' ? 4 : 3, 0, Math.PI * 2);
    ctx.fill();
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

  drawOverlays(ctx, state, w, h);
}

// HUD + screen overlays only — for drawing on a 2D layer above the 3D scene.
export function drawHUDLayer(ctx: CanvasRenderingContext2D, state: GameState, w: number, h: number) {
  drawHUD(ctx, state, w, h);
  drawOverlays(ctx, state, w, h);
}

function drawOverlays(ctx: CanvasRenderingContext2D, state: GameState, w: number, h: number) {

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

  // Top-down battlefield with a sense of place: ground plane, a distant
  // horizon band at the top (skyline of the world) and seeded structures
  // (houses, rooftops, terrain) that make every level feel like a real spot.
  const pal = WORLD_PALETTE[level.world] || WORLD_PALETTE.city;

  // === GROUND PLANE ===
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, pal.groundTop);
  g.addColorStop(1, pal.groundBot);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Soft tiled texture for depth (cheap, deterministic)
  ctx.fillStyle = pal.tile;
  for (let ty = 0; ty < h; ty += 64) {
    for (let tx = ((ty / 64) % 2) * 64; tx < w; tx += 128) {
      ctx.fillRect(tx, ty, 64, 64);
    }
  }

  // === DISTANT HORIZON / SKYLINE (top of screen) ===
  const hb = ctx.createLinearGradient(0, 0, 0, h * 0.16);
  hb.addColorStop(0, pal.sky);
  hb.addColorStop(1, 'transparent');
  ctx.fillStyle = hb;
  ctx.fillRect(0, 0, w, h * 0.16);
  // skyline silhouette ridge
  ctx.fillStyle = pal.ridge;
  ctx.beginPath();
  ctx.moveTo(0, h * 0.14);
  for (let x = 0; x <= w; x += 40) {
    const rh = pal.jagged
      ? h * 0.14 - (20 + rand(x) * 55)
      : h * 0.14 - (10 + Math.abs(Math.sin(x * 0.01 + seed)) * 30);
    ctx.lineTo(x, rh);
    if (pal.jagged) ctx.lineTo(x + 20, h * 0.14 - (10 + rand(x + 1) * 30));
  }
  ctx.lineTo(w, h * 0.14);
  ctx.closePath();
  ctx.fill();

  // === WORLD-SPECIFIC GROUND DETAIL ===
  if (level.world === 'city') {
    // Cross roads with lane markings
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.fillRect(w * 0.42, 0, w * 0.16, h);
    ctx.fillRect(0, h * 0.44, w, h * 0.16);
    ctx.strokeStyle = 'rgba(230,200,90,0.35)';
    ctx.lineWidth = 3;
    ctx.setLineDash([26, 22]);
    ctx.beginPath(); ctx.moveTo(w * 0.5, 0); ctx.lineTo(w * 0.5, h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, h * 0.52); ctx.lineTo(w, h * 0.52); ctx.stroke();
    ctx.setLineDash([]);
    // Buildings (top-down rooftops) around the edges
    for (let i = 0; i < 7; i++) {
      const bx = 30 + rand(i) * (w - 160);
      const by = 30 + rand(i + 9) * (h - 160);
      if (bx > w * 0.38 && bx < w * 0.6) continue;
      drawRooftop(ctx, bx, by, 70 + rand(i + 3) * 60, 60 + rand(i + 4) * 50, pal);
    }
    // Abandoned cars
    for (let i = 0; i < 4; i++) {
      drawCar(ctx, 60 + rand(i + 20) * (w - 120), 60 + rand(i + 30) * (h - 120), rand(i) * 6.28, rand(i + 1));
    }
  } else if (level.world === 'desert') {
    // Sand ripples
    ctx.strokeStyle = 'rgba(120,90,45,0.22)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 7; i++) {
      const y = (i / 7) * h;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= w; x += 36) ctx.lineTo(x, y + Math.sin(x * 0.02 + i) * 10);
      ctx.stroke();
    }
    // Adobe houses + ruined pillars
    for (let i = 0; i < 5; i++) {
      drawRooftop(ctx, 40 + rand(i) * (w - 140), 40 + rand(i + 7) * (h - 140), 56 + rand(i) * 40, 50 + rand(i + 2) * 36, pal);
    }
    for (let i = 0; i < 6; i++) {
      const cx = 50 + rand(i + 5) * (w - 100), cy = 50 + rand(i + 15) * (h - 100);
      ctx.fillStyle = '#6a5230';
      ctx.beginPath(); ctx.ellipse(cx, cy, 11, 11, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#4a3820';
      ctx.beginPath(); ctx.ellipse(cx, cy, 7, 7, 0, 0, Math.PI * 2); ctx.fill();
    }
  } else if (level.world === 'frozen') {
    // Ice sheet sheen
    const sheen = ctx.createLinearGradient(0, 0, w, h);
    sheen.addColorStop(0, 'rgba(180,220,250,0.10)');
    sheen.addColorStop(0.5, 'transparent');
    sheen.addColorStop(1, 'rgba(180,220,250,0.06)');
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, w, h);
    // Cracks
    ctx.strokeStyle = 'rgba(150,210,240,0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const cx = rand(i + 3) * w, cy = rand(i + 33) * h;
      for (let a = 0; a < 5; a++) {
        const ang = (a / 5) * Math.PI * 2;
        ctx.beginPath(); ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(ang) * 42, cy + Math.sin(ang) * 42); ctx.stroke();
      }
    }
    // Snow-roofed cabins + snow piles
    for (let i = 0; i < 5; i++) {
      drawRooftop(ctx, 40 + rand(i) * (w - 140), 50 + rand(i + 6) * (h - 150), 60 + rand(i) * 40, 54 + rand(i + 2) * 34, pal);
    }
    for (let i = 0; i < 8; i++) {
      const cx = 40 + rand(i + 7) * (w - 80), cy = 40 + rand(i + 17) * (h - 80);
      ctx.fillStyle = 'rgba(235,245,255,0.5)';
      ctx.beginPath(); ctx.ellipse(cx, cy, 14, 9, 0, 0, Math.PI * 2); ctx.fill();
    }
  } else if (level.world === 'burning') {
    // Scorch radial
    const sc = ctx.createRadialGradient(w / 2, h / 2, 30, w / 2, h / 2, w * 0.7);
    sc.addColorStop(0, 'rgba(60,20,8,0.0)');
    sc.addColorStop(1, 'rgba(10,4,3,0.5)');
    ctx.fillStyle = sc;
    ctx.fillRect(0, 0, w, h);
    // Glowing lava cracks
    const glow = 0.4 + Math.sin(frame * 0.05) * 0.2;
    ctx.strokeStyle = `rgba(255,100,20,${glow})`;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#ff5500'; ctx.shadowBlur = 10;
    for (let i = 0; i < 6; i++) {
      const cx = rand(i + 2) * w, cy = rand(i + 22) * h;
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.lineTo(cx + 40 + rand(i) * 30, cy + 22);
      ctx.lineTo(cx + 64, cy + 54); ctx.stroke();
    }
    ctx.shadowBlur = 0;
    // Burnt-out building shells
    for (let i = 0; i < 5; i++) {
      drawRooftop(ctx, 40 + rand(i) * (w - 150), 40 + rand(i + 8) * (h - 150), 64 + rand(i) * 50, 58 + rand(i + 3) * 40, pal);
    }
    // Embers
    for (let i = 0; i < 24; i++) {
      const ex = (rand(i + 60) * w + frame * 0.3) % w;
      const ey = (rand(i + 70) * h - frame * 0.5 + h) % h;
      ctx.fillStyle = `rgba(255,${120 + rand(i) * 100},30,${0.4 + rand(i) * 0.4})`;
      ctx.fillRect(ex, ey, 2, 2);
    }
  } else if (level.world === 'sky') {
    // Floating island platform
    ctx.fillStyle = 'rgba(40,46,90,0.5)';
    ctx.beginPath(); ctx.ellipse(w / 2, h / 2, w * 0.44, h * 0.44, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(130,160,255,0.4)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.ellipse(w / 2, h / 2, w * 0.44, h * 0.44, 0, 0, Math.PI * 2); ctx.stroke();
    // Stars beyond the platform
    for (let i = 0; i < 50; i++) {
      const sx = rand(i) * w, sy = rand(i + 40) * h;
      const d = Math.hypot(sx - w / 2, sy - h / 2);
      if (d < w * 0.44) continue;
      ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.sin(frame * 0.03 + i) * 0.3})`;
      ctx.fillRect(sx, sy, 1.6, 1.6);
    }
    // Sky temples
    for (let i = 0; i < 4; i++) {
      drawRooftop(ctx, w / 2 + (rand(i) - 0.5) * w * 0.5, h / 2 + (rand(i + 4) - 0.5) * h * 0.5, 54, 50, pal);
    }
  } else { // void
    ctx.fillStyle = '#050308';
    ctx.fillRect(0, 0, w, h);
    const vg = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w * 0.7);
    vg.addColorStop(0, 'rgba(90,12,90,0.32)');
    vg.addColorStop(0.5, 'rgba(45,6,55,0.16)');
    vg.addColorStop(1, 'transparent');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 34; i++) {
      const ang = (i / 34) * Math.PI * 2 + frame * 0.01;
      const dist = 100 + (i % 5) * 60 + Math.sin(frame * 0.02 + i) * 20;
      const vx = w / 2 + Math.cos(ang) * dist;
      const vy = h / 2 + Math.sin(ang) * dist;
      ctx.fillStyle = `rgba(${150 + rand(i) * 100},20,${150 + rand(i) * 80},${0.3 + rand(i) * 0.3})`;
      ctx.beginPath(); ctx.arc(vx, vy, 1.5 + rand(i) * 2, 0, Math.PI * 2); ctx.fill();
    }
  }

  // Subtle vignette for all
  const vig = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, w * 0.7);
  vig.addColorStop(0, 'transparent');
  vig.addColorStop(1, 'rgba(0,0,0,0.5)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);
}

interface Palette {
  groundTop: string; groundBot: string; tile: string;
  sky: string; ridge: string; jagged: boolean;
  roof: string; roofEdge: string; roofDetail: string;
}

const WORLD_PALETTE: Record<string, Palette> = {
  city: { groundTop: '#20232b', groundBot: '#15171c', tile: 'rgba(255,255,255,0.015)', sky: 'rgba(40,46,66,0.7)', ridge: '#0c0e16', jagged: true, roof: '#2c2f3a', roofEdge: '#1a1c24', roofDetail: '#3a3e4c' },
  desert: { groundTop: '#7a5c34', groundBot: '#4a3620', tile: 'rgba(255,220,150,0.03)', sky: 'rgba(210,150,90,0.6)', ridge: '#5a4226', jagged: false, roof: '#8a6a3e', roofEdge: '#5c4424', roofDetail: '#a07c4a' },
  frozen: { groundTop: '#9fc2d6', groundBot: '#4a6678', tile: 'rgba(255,255,255,0.05)', sky: 'rgba(150,190,215,0.6)', ridge: '#2a4658', jagged: true, roof: '#d8e8f2', roofEdge: '#7fa0b4', roofDetail: '#bcd6e6' },
  burning: { groundTop: '#3a1a0e', groundBot: '#140604', tile: 'rgba(255,90,20,0.02)', sky: 'rgba(160,50,20,0.65)', ridge: '#1f0a06', jagged: true, roof: '#3a1c12', roofEdge: '#1a0a06', roofDetail: '#552413' },
  sky: { groundTop: '#26305e', groundBot: '#141c3e', tile: 'rgba(150,180,255,0.03)', sky: 'rgba(60,90,160,0.5)', ridge: '#1a2348', jagged: false, roof: '#3a4a80', roofEdge: '#222c54', roofDetail: '#5066a0' },
  void: { groundTop: '#15081e', groundBot: '#050308', tile: 'rgba(180,60,200,0.02)', sky: 'rgba(90,20,110,0.5)', ridge: '#1a0824', jagged: true, roof: '#2a1038', roofEdge: '#160620', roofDetail: '#3e1850' },
};

// Top-down building/house rooftop with edge shadow + chimney/skylight detail.
function drawRooftop(ctx: CanvasRenderingContext2D, x: number, y: number, bw: number, bh: number, pal: Palette) {
  // drop shadow
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  fillRoundRect(ctx, x + 6, y + 8, bw, bh, 5);
  // walls (edge)
  ctx.fillStyle = pal.roofEdge;
  fillRoundRect(ctx, x - 2, y - 2, bw + 4, bh + 4, 5);
  // roof
  ctx.fillStyle = pal.roof;
  fillRoundRect(ctx, x, y, bw, bh, 4);
  // roof ridge lines
  ctx.strokeStyle = pal.roofDetail;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x + 4, y + bh / 2); ctx.lineTo(x + bw - 4, y + bh / 2);
  ctx.stroke();
  // skylight / AC unit
  ctx.fillStyle = pal.roofDetail;
  fillRoundRect(ctx, x + bw * 0.3, y + bh * 0.3, bw * 0.22, bh * 0.22, 2);
  // chimney
  ctx.fillStyle = pal.roofEdge;
  ctx.fillRect(x + bw * 0.68, y + bh * 0.6, 9, 9);
}

// Simple top-down wrecked car.
function drawCar(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, tint: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  fillRoundRect(ctx, -22, -12, 48, 26, 6);
  ctx.fillStyle = tint > 0.5 ? '#3a2a2a' : '#283038';
  fillRoundRect(ctx, -24, -13, 48, 26, 6);
  // roof/cabin
  ctx.fillStyle = tint > 0.5 ? '#241818' : '#1a2026';
  fillRoundRect(ctx, -8, -10, 22, 20, 4);
  // windshield glint
  ctx.fillStyle = 'rgba(120,150,180,0.25)';
  fillRoundRect(ctx, 12, -8, 8, 16, 2);
  ctx.restore();
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
