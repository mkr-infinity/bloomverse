import { useEffect, useRef } from 'react';

/**
 * Epic, cinematic home-screen background (Game-of-Thrones inspired).
 * Painterly layers with aerial perspective: dramatic dusk sky, drifting cloud
 * bands, receding hazy mountain ranges, a fortress citadel with towers and
 * banners, volumetric god-rays, circling ravens, a cloaked sentinel on a cliff
 * and drifting snow + embers. Fully procedural canvas (crisp + offline).
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

    // Pre-seed cloud bands, ravens, snow
    const clouds = Array.from({ length: 7 }, (_, i) => ({
      y: 0.08 + i * 0.05 + RND(i) * 0.02,
      x: RND(i * 3),
      sp: 0.00002 + RND(i + 1) * 0.00004,
      scale: 0.6 + RND(i + 2) * 0.9,
      op: 0.05 + RND(i + 3) * 0.08,
    }));
    const ravens = Array.from({ length: 6 }, (_, i) => ({
      x: RND(i * 5), y: 0.18 + RND(i + 7) * 0.22, sp: 0.0004 + RND(i) * 0.0006, ph: RND(i) * 6.28, amp: 0.01 + RND(i + 2) * 0.02,
    }));
    const snow = Array.from({ length: 110 }, (_, i) => ({
      x: RND(i * 2.3), y: RND(i * 1.9), sp: 0.15 + RND(i) * 0.4, sw: (RND(i + 4) - 0.5) * 0.5, s: 0.7 + RND(i + 1) * 1.8,
    }));

    const draw = () => {
      frame++;
      const t = frame;
      const horizon = h * 0.72;

      // === SKY — dramatic cold dusk with ember horizon ===
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#0b1020');
      sky.addColorStop(0.28, '#1b2740');
      sky.addColorStop(0.5, '#41435e');
      sky.addColorStop(0.66, '#9a6a55');
      sky.addColorStop(0.76, '#d89a55');
      sky.addColorStop(0.86, '#e7b262');
      sky.addColorStop(1, '#3a2418');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // low sun glow
      const sunX = w * 0.5, sunY = horizon - 18;
      const sun = ctx.createRadialGradient(sunX, sunY, 6, sunX, sunY, w * 0.6);
      sun.addColorStop(0, 'rgba(255,225,160,0.55)');
      sun.addColorStop(0.4, 'rgba(255,160,80,0.16)');
      sun.addColorStop(1, 'transparent');
      ctx.fillStyle = sun;
      ctx.fillRect(0, 0, w, h);

      // === DRIFTING CLOUD BANDS ===
      for (const c of clouds) {
        c.x += c.sp;
        const cy = c.y * h;
        const baseX = ((c.x % 1) * (w + 600)) - 300;
        for (let s = 0; s < 5; s++) {
          const cx = baseX + s * 90 * c.scale + Math.sin(t * 0.002 + s) * 10;
          const rw = (120 + s * 30) * c.scale;
          const rh = 18 * c.scale;
          const grd = ctx.createRadialGradient(cx, cy, 2, cx, cy, rw);
          grd.addColorStop(0, `rgba(235,210,180,${c.op})`);
          grd.addColorStop(1, 'transparent');
          ctx.fillStyle = grd;
          ctx.beginPath(); ctx.ellipse(cx, cy, rw, rh, 0, 0, Math.PI * 2); ctx.fill();
        }
      }

      // === GOD RAYS from the sun ===
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 11; i++) {
        const a = -Math.PI / 2 + (i - 5) * 0.12 + Math.sin(t * 0.003 + i) * 0.015;
        const len = h * 1.2;
        const spread = 0.045;
        const ray = ctx.createLinearGradient(sunX, sunY, sunX + Math.cos(a) * len, sunY + Math.sin(a) * len);
        ray.addColorStop(0, `rgba(255,215,150,${0.04 + Math.sin(t * 0.02 + i) * 0.015})`);
        ray.addColorStop(1, 'transparent');
        ctx.fillStyle = ray;
        ctx.beginPath();
        ctx.moveTo(sunX, sunY);
        ctx.lineTo(sunX + Math.cos(a - spread) * len, sunY + Math.sin(a - spread) * len);
        ctx.lineTo(sunX + Math.cos(a + spread) * len, sunY + Math.sin(a + spread) * len);
        ctx.closePath(); ctx.fill();
      }
      ctx.restore();

      // === MOUNTAIN RANGES (aerial perspective: far=hazy/light) ===
      drawRange(ctx, w, horizon - 4, 0.10, '#6a6f86', 0.5, 7, 11);   // far
      drawRange(ctx, w, horizon + 6, 0.16, '#3f4560', 0.7, 13, 23);  // mid
      drawRange(ctx, w, horizon + 18, 0.24, '#222640', 0.92, 19, 31); // near-ish

      // === THE CITADEL (fortress on a crag) ===
      drawCitadel(ctx, w * 0.5, horizon + 16, h, t);

      // atmospheric haze sitting over the valley
      const haze = ctx.createLinearGradient(0, horizon - 40, 0, horizon + 60);
      haze.addColorStop(0, 'transparent');
      haze.addColorStop(0.5, 'rgba(220,180,140,0.18)');
      haze.addColorStop(1, 'transparent');
      ctx.fillStyle = haze;
      ctx.fillRect(0, horizon - 40, w, 100);

      // === RAVENS circling ===
      for (const r of ravens) {
        r.x += r.sp;
        const rx = ((r.x % 1) * (w + 200)) - 100;
        const ry = r.y * h + Math.sin(t * 0.02 + r.ph) * r.amp * h;
        drawRaven(ctx, rx, ry, 5 + RND(r.ph) * 4, t + r.ph * 20);
      }

      // === FOREGROUND CLIFF (darkest, framing the bottom) ===
      ctx.fillStyle = '#0a0a12';
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(0, h * 0.86);
      ctx.quadraticCurveTo(w * 0.18, h * 0.8, w * 0.34, h * 0.9);
      ctx.lineTo(w * 0.34, h);
      ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(w, h);
      ctx.lineTo(w, h * 0.82);
      ctx.quadraticCurveTo(w * 0.82, h * 0.78, w * 0.64, h * 0.9);
      ctx.lineTo(w * 0.64, h);
      ctx.closePath(); ctx.fill();

      // === CLOAKED SENTINEL on the left cliff ===
      drawSentinel(ctx, w * 0.2, h * 0.9, h * 0.42, t);

      // === DRIFTING SNOW / ASH ===
      for (const f of snow) {
        f.y += f.sp * 0.0013; f.x += f.sw * 0.0006 + Math.sin(t * 0.01 + f.s) * 0.00008;
        if (f.y > 1.02) { f.y = -0.02; f.x = RND(f.x * 991); }
        ctx.fillStyle = `rgba(225,225,235,${0.18 + f.s * 0.05})`;
        ctx.beginPath(); ctx.arc(f.x * w, f.y * h, f.s * 0.9, 0, Math.PI * 2); ctx.fill();
      }

      // === CINEMATIC GRADE ===
      const teal = ctx.createLinearGradient(0, 0, 0, h);
      teal.addColorStop(0, 'rgba(10,30,60,0.22)');
      teal.addColorStop(0.5, 'transparent');
      ctx.fillStyle = teal;
      ctx.fillRect(0, 0, w, h);
      const vig = ctx.createRadialGradient(w / 2, h * 0.5, h * 0.18, w / 2, h * 0.5, w * 0.85);
      vig.addColorStop(0, 'transparent');
      vig.addColorStop(1, 'rgba(0,0,0,0.82)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
}

// A jagged mountain ridge filled to the bottom of the screen.
function drawRange(ctx: CanvasRenderingContext2D, w: number, baseY: number, height: number, color: string, alpha: number, seed: number, peaks: number) {
  const H = ctx.canvas.height; // device px; we drew in css px via transform so use window via baseY scale
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, baseY);
  const peakH = height * (window.innerHeight);
  for (let i = 0; i <= peaks; i++) {
    const x = (i / peaks) * w;
    const r = Math.sin((i + seed) * 12.9898) * 43758.5453;
    const j = (r - Math.floor(r));
    const y = baseY - peakH * (0.45 + j * 0.55) * (0.6 + 0.4 * Math.sin(i * 1.7 + seed));
    const midX = x - (w / peaks) * 0.5;
    ctx.lineTo(midX, baseY - peakH * 0.2 * j);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, baseY);
  ctx.lineTo(w, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawCitadel(ctx: CanvasRenderingContext2D, cx: number, baseY: number, h: number, t: number) {
  const s = h * 0.0016; // scale unit
  ctx.save();
  ctx.translate(cx, baseY);
  // rim light from the sun behind
  ctx.shadowColor = 'rgba(255,190,110,0.55)';
  ctx.shadowBlur = 16;
  ctx.fillStyle = '#15131f';

  const tower = (x: number, wdt: number, ht: number, roof = true) => {
    ctx.fillRect(x - wdt / 2, -ht, wdt, ht);
    // battlements
    for (let bx = x - wdt / 2; bx < x + wdt / 2 - 2; bx += wdt / 4) {
      ctx.fillRect(bx, -ht - 4 * s, (wdt / 4) * 0.6, 4 * s);
    }
    if (roof) {
      ctx.beginPath();
      ctx.moveTo(x - wdt / 2 - 2 * s, -ht);
      ctx.lineTo(x, -ht - 16 * s);
      ctx.lineTo(x + wdt / 2 + 2 * s, -ht);
      ctx.closePath();
      ctx.fill();
    }
  };

  // curtain wall
  ctx.fillRect(-90 * s, -50 * s, 180 * s, 50 * s);
  for (let bx = -90 * s; bx < 90 * s - 2; bx += 14 * s) {
    ctx.fillRect(bx, -54 * s, 7 * s, 4 * s);
  }
  // gate
  ctx.save(); ctx.shadowBlur = 0;
  ctx.fillStyle = '#0a0810';
  ctx.beginPath();
  ctx.moveTo(-10 * s, 0); ctx.lineTo(-10 * s, -22 * s);
  ctx.quadraticCurveTo(0, -32 * s, 10 * s, -22 * s); ctx.lineTo(10 * s, 0);
  ctx.closePath(); ctx.fill();
  ctx.restore();

  // towers (varied heights)
  tower(-78 * s, 26 * s, 88 * s);
  tower(78 * s, 26 * s, 88 * s);
  tower(-40 * s, 22 * s, 70 * s);
  tower(40 * s, 22 * s, 70 * s);
  tower(0, 34 * s, 128 * s); // great keep

  // banners on the keep (gentle wave)
  ctx.shadowBlur = 0;
  const wave = Math.sin(t * 0.05) * 3 * s;
  ctx.fillStyle = 'rgba(180,30,40,0.85)';
  ctx.beginPath();
  ctx.moveTo(-6 * s, -118 * s);
  ctx.lineTo(-6 * s + wave, -100 * s);
  ctx.lineTo(-2 * s, -104 * s);
  ctx.lineTo(2 * s, -118 * s);
  ctx.closePath(); ctx.fill();

  // a few lit windows
  ctx.fillStyle = 'rgba(255,190,90,0.85)';
  const winY = [-100, -80, -60, -40];
  for (const wy of winY) {
    if (Math.floor((t + wy) / 60) % 3 !== 0) ctx.fillRect(-1.5 * s, wy * s, 3 * s, 5 * s);
  }
  ctx.fillRect(-78 * s - 1.5 * s, -60 * s, 3 * s, 5 * s);
  ctx.fillRect(78 * s - 1.5 * s, -64 * s, 3 * s, 5 * s);

  ctx.restore();
}

function drawRaven(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, t: number) {
  const flap = Math.sin(t * 0.3) * 0.8;
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = 'rgba(10,10,16,0.85)';
  ctx.lineWidth = Math.max(1, size * 0.18);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-size, flap * size * 0.5);
  ctx.quadraticCurveTo(-size * 0.3, -size * 0.4, 0, 0);
  ctx.quadraticCurveTo(size * 0.3, -size * 0.4, size, flap * size * 0.5);
  ctx.stroke();
  ctx.restore();
}

function drawSentinel(ctx: CanvasRenderingContext2D, x: number, baseY: number, height: number, frame: number) {
  const u = height / 100;
  const sway = Math.sin(frame * 0.02) * 1.2;
  ctx.save();
  ctx.translate(x, baseY);

  // rim glow
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const rim = ctx.createRadialGradient(6 * u, -55 * u, 4, 6 * u, -55 * u, 70 * u);
  rim.addColorStop(0, 'rgba(255,180,100,0.16)');
  rim.addColorStop(1, 'transparent');
  ctx.fillStyle = rim;
  ctx.fillRect(-80 * u, -130 * u, 170 * u, 140 * u);
  ctx.restore();

  ctx.fillStyle = '#060509';
  ctx.shadowColor = 'rgba(255,160,90,0.45)';
  ctx.shadowBlur = 12;

  // billowing cloak
  ctx.beginPath();
  ctx.moveTo(-12 * u, -70 * u);
  ctx.quadraticCurveTo(-22 * u + sway * 3, -30 * u, -16 * u + sway * 4, 2 * u);
  ctx.lineTo(12 * u, 2 * u);
  ctx.quadraticCurveTo(16 * u, -40 * u, 10 * u, -72 * u);
  ctx.closePath();
  ctx.fill();

  // body / shoulders
  ctx.beginPath();
  ctx.moveTo(-9 * u, -40 * u);
  ctx.lineTo(-11 * u, -66 * u);
  ctx.lineTo(-5 * u, -74 * u);
  ctx.lineTo(7 * u, -73 * u);
  ctx.lineTo(10 * u, -64 * u);
  ctx.lineTo(8 * u, -40 * u);
  ctx.closePath();
  ctx.fill();

  // hooded head
  ctx.beginPath();
  ctx.moveTo(-6 * u, -74 * u);
  ctx.quadraticCurveTo(0, -90 * u, 6 * u, -74 * u);
  ctx.quadraticCurveTo(3 * u, -78 * u, 0, -78 * u);
  ctx.quadraticCurveTo(-3 * u, -78 * u, -6 * u, -74 * u);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath(); ctx.ellipse(0, -77 * u, 5.5 * u, 7 * u, 0, 0, Math.PI * 2); ctx.fill();

  // tall spear planted
  ctx.fillRect(13 * u, -96 * u, 2.4 * u, 96 * u);
  ctx.beginPath();
  ctx.moveTo(14.2 * u, -110 * u);
  ctx.lineTo(11 * u, -96 * u);
  ctx.lineTo(17.4 * u, -96 * u);
  ctx.closePath();
  ctx.fill();
  // gripping hand
  ctx.beginPath(); ctx.ellipse(13 * u, -58 * u, 3 * u, 3.5 * u, 0, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
}
