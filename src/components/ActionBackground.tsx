import { useEffect, useRef } from 'react';

/**
 * Gritty, cinematic battle-royale style home background (Free-Fire inspired).
 * Fully procedural canvas (crisp + offline):
 *  - stormy night sky with a burning-horizon glow
 *  - distant war-torn city skyline with fires + rising smoke
 *  - sweeping searchlight beams
 *  - a circling gunship/helicopter with spinning rotor + blinking nav light
 *  - a rim-lit armed operative silhouette in the foreground (hero pose)
 *  - rising embers, drifting ash, light rain + cinematic grade/vignette
 */
export default function ActionBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;
    let frame = 0;
    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const RND = (n: number) => { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); };

    // Skyline buildings (static seed, scaled to width at draw time)
    const buildings = Array.from({ length: 26 }, (_, i) => ({
      x: RND(i * 3.7),
      wd: 0.02 + RND(i + 9) * 0.05,
      ht: 0.12 + RND(i + 2) * 0.26,
      fire: RND(i + 5) > 0.74,
      lit: RND(i + 11),
    }));
    // Rising embers
    const embers = Array.from({ length: 70 }, (_, i) => ({
      x: RND(i * 2.1), y: RND(i * 1.7), sp: 0.12 + RND(i) * 0.5, sw: (RND(i + 4) - 0.5), s: 0.6 + RND(i + 1) * 1.6,
    }));
    // Rain streaks
    const rain = Array.from({ length: 90 }, (_, i) => ({
      x: RND(i * 5.3), y: RND(i * 3.1), sp: 0.9 + RND(i) * 0.9, len: 10 + RND(i + 2) * 18,
    }));
    // Searchlights
    const lights = [
      { x: 0.18, ph: 0, sp: 0.011, spread: 0.16 },
      { x: 0.74, ph: 2.1, sp: 0.009, spread: 0.13 },
      { x: 0.5, ph: 4.0, sp: 0.013, spread: 0.10 },
    ];
    // Gunships crossing the sky
    const choppers = [
      { x: -0.2, y: 0.22, sp: 0.00035, scale: 1.0, dir: 1 },
      { x: 0.9, y: 0.13, sp: 0.00024, scale: 0.6, dir: -1 },
    ];

    const draw = () => {
      frame++;
      const t = frame;
      const horizon = h * 0.7;

      // === SKY — stormy night with burning horizon ===
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#05060a');
      sky.addColorStop(0.35, '#0b0d16');
      sky.addColorStop(0.6, '#231a22');
      sky.addColorStop(0.78, '#5a2a22');
      sky.addColorStop(0.9, '#90341f');
      sky.addColorStop(1, '#2a0d08');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // burning horizon bloom
      const bloom = ctx.createRadialGradient(w * 0.5, horizon + 30, 10, w * 0.5, horizon + 30, w * 0.7);
      bloom.addColorStop(0, 'rgba(255,120,40,0.28)');
      bloom.addColorStop(0.4, 'rgba(255,80,30,0.10)');
      bloom.addColorStop(1, 'transparent');
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, w, h);

      // faint stars
      for (let i = 0; i < 50; i++) {
        const sx = RND(i * 12.3) * w;
        const sy = RND(i * 7.7) * horizon * 0.7;
        const tw = 0.3 + 0.7 * Math.abs(Math.sin(t * 0.02 + i));
        ctx.fillStyle = `rgba(200,210,230,${0.12 * tw})`;
        ctx.fillRect(sx, sy, 1.4, 1.4);
      }

      // === SEARCHLIGHT BEAMS ===
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (const L of lights) {
        const ang = -Math.PI / 2 + Math.sin(t * L.sp + L.ph) * 0.5;
        const ox = L.x * w, oy = h * 1.02;
        const len = h * 1.1;
        const ex = ox + Math.cos(ang) * len, ey = oy + Math.sin(ang) * len;
        const beam = ctx.createLinearGradient(ox, oy, ex, ey);
        beam.addColorStop(0, 'rgba(180,210,255,0.10)');
        beam.addColorStop(1, 'transparent');
        ctx.fillStyle = beam;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox + Math.cos(ang - L.spread) * len, oy + Math.sin(ang - L.spread) * len);
        ctx.lineTo(ox + Math.cos(ang + L.spread) * len, oy + Math.sin(ang + L.spread) * len);
        ctx.closePath(); ctx.fill();
      }
      ctx.restore();

      // === SMOKE COLUMNS behind skyline ===
      ctx.save();
      for (let i = 0; i < 5; i++) {
        const bx = (0.12 + i * 0.2) * w + Math.sin(t * 0.004 + i) * 8;
        for (let s = 0; s < 6; s++) {
          const sy = horizon - s * 34 - (t * 0.2 % 34);
          const r = 26 + s * 16;
          const op = 0.05 * (1 - s / 6);
          const g = ctx.createRadialGradient(bx + Math.sin(s + i) * 12, sy, 2, bx, sy, r);
          g.addColorStop(0, `rgba(40,38,44,${op})`);
          g.addColorStop(1, 'transparent');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(bx, sy, r, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.restore();

      // === DISTANT CITY SKYLINE ===
      for (const b of buildings) {
        const bx = b.x * w;
        const bw = b.wd * w;
        const bh = b.ht * h;
        const by = horizon - bh;
        ctx.fillStyle = '#0a0b11';
        ctx.fillRect(bx, by, bw, bh);
        // rim light from fires
        ctx.fillStyle = 'rgba(255,110,50,0.12)';
        ctx.fillRect(bx, by, 1.5, bh);
        // windows
        const cols = Math.max(1, Math.floor(bw / 9));
        const rows = Math.max(1, Math.floor(bh / 12));
        for (let cx = 0; cx < cols; cx++) {
          for (let cy = 0; cy < rows; cy++) {
            const seed = b.lit * 99 + cx * 3 + cy * 7;
            if (RND(seed) > 0.82) {
              const flick = Math.sin(t * 0.05 + seed) > -0.3 ? 1 : 0.3;
              ctx.fillStyle = b.fire
                ? `rgba(255,${90 + RND(seed) * 60},30,${0.5 * flick})`
                : `rgba(255,200,120,${0.28 * flick})`;
              ctx.fillRect(bx + 4 + cx * 9, by + 5 + cy * 12, 3.5, 4);
            }
          }
        }
        // fire glow at the base of burning buildings
        if (b.fire) {
          const fg = ctx.createRadialGradient(bx + bw / 2, by, 2, bx + bw / 2, by, bw);
          fg.addColorStop(0, `rgba(255,120,40,${0.25 + Math.sin(t * 0.1 + b.lit) * 0.08})`);
          fg.addColorStop(1, 'transparent');
          ctx.fillStyle = fg;
          ctx.beginPath(); ctx.arc(bx + bw / 2, by, bw, 0, Math.PI * 2); ctx.fill();
        }
      }

      // ground haze
      const haze = ctx.createLinearGradient(0, horizon - 30, 0, horizon + 80);
      haze.addColorStop(0, 'transparent');
      haze.addColorStop(0.5, 'rgba(120,60,40,0.22)');
      haze.addColorStop(1, 'transparent');
      ctx.fillStyle = haze;
      ctx.fillRect(0, horizon - 30, w, 110);

      // === GUNSHIPS ===
      for (const c of choppers) {
        c.x += c.sp * c.dir;
        if (c.dir > 0 && c.x > 1.25) c.x = -0.25;
        if (c.dir < 0 && c.x < -0.25) c.x = 1.25;
        const cxp = c.x * w;
        const cyp = c.y * h + Math.sin(t * 0.02 + c.scale * 4) * 6;
        drawChopper(ctx, cxp, cyp, 26 * c.scale, c.dir, t);
      }

      // === FOREGROUND GROUND / RUBBLE ===
      ctx.fillStyle = '#050507';
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(0, h * 0.9);
      ctx.quadraticCurveTo(w * 0.3, h * 0.86, w * 0.5, h * 0.9);
      ctx.quadraticCurveTo(w * 0.75, h * 0.94, w, h * 0.88);
      ctx.lineTo(w, h);
      ctx.closePath(); ctx.fill();

      // === HERO OPERATIVE (rim-lit silhouette) ===
      drawOperative(ctx, w * 0.5, h * 0.93, h * 0.5, t);

      // === RISING EMBERS ===
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (const e of embers) {
        e.y -= e.sp * 0.0012; e.x += e.sw * 0.0004 + Math.sin(t * 0.02 + e.s) * 0.0001;
        if (e.y < -0.02) { e.y = 1.02; e.x = RND(e.x * 733); }
        const flick = 0.5 + 0.5 * Math.sin(t * 0.2 + e.s * 9);
        ctx.fillStyle = `rgba(255,${120 + e.s * 40},40,${0.5 * flick})`;
        ctx.beginPath(); ctx.arc(e.x * w, e.y * h, e.s * 0.8, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();

      // === LIGHT RAIN ===
      ctx.strokeStyle = 'rgba(170,190,220,0.10)';
      ctx.lineWidth = 1;
      for (const r of rain) {
        r.y += r.sp * 0.004; r.x -= 0.0008;
        if (r.y > 1.02) { r.y = -0.05; r.x = RND(r.y * 411); }
        const rx = r.x * w, ry = r.y * h;
        ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 2, ry + r.len); ctx.stroke();
      }

      // === CINEMATIC GRADE + VIGNETTE ===
      const grade = ctx.createLinearGradient(0, 0, 0, h);
      grade.addColorStop(0, 'rgba(10,20,45,0.30)');
      grade.addColorStop(0.5, 'transparent');
      grade.addColorStop(1, 'rgba(60,15,5,0.25)');
      ctx.fillStyle = grade;
      ctx.fillRect(0, 0, w, h);
      const vig = ctx.createRadialGradient(w / 2, h * 0.52, h * 0.16, w / 2, h * 0.5, w * 0.85);
      vig.addColorStop(0, 'transparent');
      vig.addColorStop(1, 'rgba(0,0,0,0.88)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
}

function drawChopper(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, dir: number, t: number) {
  const u = size / 26;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(dir, 1);
  ctx.fillStyle = '#070709';
  ctx.shadowColor = 'rgba(255,140,60,0.4)';
  ctx.shadowBlur = 8 * u;

  // body
  ctx.beginPath();
  ctx.ellipse(0, 0, 16 * u, 6 * u, 0, 0, Math.PI * 2);
  ctx.fill();
  // cockpit
  ctx.beginPath();
  ctx.ellipse(11 * u, -1 * u, 6 * u, 4.5 * u, 0, 0, Math.PI * 2);
  ctx.fill();
  // tail boom
  ctx.fillRect(-30 * u, -2 * u, 18 * u, 3 * u);
  // tail fin
  ctx.beginPath();
  ctx.moveTo(-30 * u, -2 * u); ctx.lineTo(-34 * u, -9 * u); ctx.lineTo(-28 * u, -2 * u);
  ctx.closePath(); ctx.fill();
  // skids
  ctx.fillRect(-8 * u, 6 * u, 18 * u, 1.4 * u);
  ctx.fillRect(-5 * u, 4 * u, 1.4 * u, 3 * u);
  ctx.fillRect(7 * u, 4 * u, 1.4 * u, 3 * u);
  ctx.shadowBlur = 0;

  // main rotor blur
  const spin = (t * 0.5) % (Math.PI * 2);
  ctx.strokeStyle = 'rgba(180,180,190,0.18)';
  ctx.lineWidth = 1.5 * u;
  ctx.beginPath();
  ctx.ellipse(0, -8 * u, 30 * u * Math.abs(Math.cos(spin)) + 6 * u, 2 * u, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillRect(-1 * u, -9 * u, 2 * u, 3 * u); // mast
  // tail rotor blur
  ctx.beginPath();
  ctx.arc(-33 * u, -5 * u, 5 * u, 0, Math.PI * 2);
  ctx.stroke();

  // blinking nav light
  if (Math.floor(t / 24) % 2 === 0) {
    ctx.fillStyle = 'rgba(255,40,40,0.95)';
    ctx.beginPath(); ctx.arc(-12 * u, 2 * u, 1.6 * u, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function drawOperative(ctx: CanvasRenderingContext2D, x: number, baseY: number, height: number, t: number) {
  const u = height / 100;
  const breathe = Math.sin(t * 0.03) * 0.8;
  ctx.save();
  ctx.translate(x, baseY);

  // back glow halo (fires behind)
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const halo = ctx.createRadialGradient(0, -52 * u, 6, 0, -52 * u, 80 * u);
  halo.addColorStop(0, 'rgba(255,120,50,0.20)');
  halo.addColorStop(1, 'transparent');
  ctx.fillStyle = halo;
  ctx.fillRect(-90 * u, -130 * u, 180 * u, 150 * u);
  ctx.restore();

  ctx.fillStyle = '#040406';
  ctx.strokeStyle = 'rgba(255,150,70,0.5)'; // warm rim light
  ctx.lineWidth = 1.4;

  const drawPart = (path: () => void) => { path(); ctx.fill(); ctx.stroke(); };

  // legs (combat stance, slightly apart)
  drawPart(() => {
    ctx.beginPath();
    ctx.moveTo(-4 * u, -46 * u);
    ctx.lineTo(-12 * u, -2 * u);
    ctx.lineTo(-4 * u, -1 * u);
    ctx.lineTo(-1 * u, -42 * u);
    ctx.closePath();
  });
  drawPart(() => {
    ctx.beginPath();
    ctx.moveTo(4 * u, -46 * u);
    ctx.lineTo(11 * u, -2 * u);
    ctx.lineTo(4 * u, -1 * u);
    ctx.lineTo(1 * u, -42 * u);
    ctx.closePath();
  });
  // boots
  drawPart(() => { ctx.beginPath(); ctx.ellipse(-9 * u, -1 * u, 6 * u, 2.6 * u, 0, 0, Math.PI * 2); });
  drawPart(() => { ctx.beginPath(); ctx.ellipse(9 * u, -1 * u, 6 * u, 2.6 * u, 0, 0, Math.PI * 2); });

  // torso + tactical vest
  drawPart(() => {
    ctx.beginPath();
    ctx.moveTo(-12 * u, -82 * u + breathe);
    ctx.lineTo(12 * u, -82 * u + breathe);
    ctx.lineTo(14 * u, -50 * u);
    ctx.lineTo(-14 * u, -50 * u);
    ctx.closePath();
  });
  // backpack hump
  drawPart(() => {
    ctx.beginPath();
    ctx.moveTo(-13 * u, -78 * u);
    ctx.lineTo(-20 * u, -74 * u);
    ctx.lineTo(-18 * u, -54 * u);
    ctx.lineTo(-13 * u, -56 * u);
    ctx.closePath();
  });

  // head + helmet
  drawPart(() => { ctx.beginPath(); ctx.ellipse(0, -90 * u + breathe, 7 * u, 8 * u, 0, 0, Math.PI * 2); });
  // helmet brim
  drawPart(() => {
    ctx.beginPath();
    ctx.moveTo(-8 * u, -92 * u + breathe);
    ctx.quadraticCurveTo(0, -101 * u + breathe, 8 * u, -92 * u + breathe);
    ctx.lineTo(8 * u, -90 * u + breathe);
    ctx.lineTo(-8 * u, -90 * u + breathe);
    ctx.closePath();
  });

  // arms holding rifle across the body
  drawPart(() => {
    ctx.beginPath();
    ctx.moveTo(-10 * u, -78 * u);
    ctx.lineTo(-2 * u, -64 * u);
    ctx.lineTo(2 * u, -66 * u);
    ctx.lineTo(-6 * u, -80 * u);
    ctx.closePath();
  });
  drawPart(() => {
    ctx.beginPath();
    ctx.moveTo(10 * u, -76 * u);
    ctx.lineTo(20 * u, -66 * u);
    ctx.lineTo(22 * u, -69 * u);
    ctx.lineTo(13 * u, -79 * u);
    ctx.closePath();
  });

  // RIFLE
  ctx.fillStyle = '#020203';
  ctx.strokeStyle = 'rgba(255,150,70,0.45)';
  // body of rifle
  ctx.beginPath();
  ctx.moveTo(-8 * u, -66 * u);
  ctx.lineTo(30 * u, -72 * u);
  ctx.lineTo(30 * u, -68 * u);
  ctx.lineTo(-8 * u, -62 * u);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // magazine
  ctx.beginPath();
  ctx.moveTo(6 * u, -64 * u);
  ctx.lineTo(10 * u, -54 * u);
  ctx.lineTo(14 * u, -55 * u);
  ctx.lineTo(11 * u, -65 * u);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // stock
  ctx.fillRect(-14 * u, -67 * u, 7 * u, 4 * u);

  // muzzle flash (occasional)
  const flashPhase = (t * 0.04) % 7;
  if (flashPhase < 0.5) {
    const f = (0.5 - flashPhase) / 0.5;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const mx = 32 * u, my = -70 * u;
    const fl = ctx.createRadialGradient(mx, my, 1, mx, my, 22 * u * f + 4);
    fl.addColorStop(0, `rgba(255,240,180,${0.9 * f})`);
    fl.addColorStop(0.4, `rgba(255,150,40,${0.6 * f})`);
    fl.addColorStop(1, 'transparent');
    ctx.fillStyle = fl;
    ctx.beginPath(); ctx.arc(mx, my, 22 * u * f + 4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}
