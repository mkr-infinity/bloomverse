import { useEffect, useRef } from 'react';

/**
 * Cinematic action-movie background for the main menu.
 * Layered parallax battlefield at dusk: volumetric god-rays, a ruined city
 * skyline with fire-lit windows, drifting smoke, a patrolling gunship with
 * searchlight, a rim-lit hero soldier in the foreground, large bokeh embers
 * and falling ash. Rendered procedurally on canvas (crisp + offline).
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

    const R = (n: number) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };

    // Far skyline buildings
    const farB: { x: number; bw: number; bh: number }[] = [];
    for (let x = 0, i = 0; x < 1.1; i++) { const bw = 0.04 + R(i) * 0.06; farB.push({ x, bw, bh: 0.1 + R(i + 9) * 0.18 }); x += bw + 0.01; }
    // Mid ruined buildings with windows
    const midB: { x: number; bw: number; bh: number; win: number[][] }[] = [];
    for (let x = -0.05, i = 0; x < 1.1; i++) {
      const bw = 0.07 + R(i + 30) * 0.09;
      const bh = 0.18 + R(i + 40) * 0.26;
      const cols = 3 + Math.floor(R(i + 50) * 3);
      const rows = 4 + Math.floor(R(i + 60) * 4);
      const win: number[][] = [];
      for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) win.push([c / cols, r / rows, R(i * 7 + c * 3 + r)]);
      midB.push({ x, bw, bh, win }); x += bw + 0.015;
    }
    const bigEmbers = Array.from({ length: 16 }, (_, i) => ({ x: R(i * 3), y: R(i * 5), s: 6 + R(i) * 12, sp: 0.15 + R(i + 1) * 0.3 }));
    const ash = Array.from({ length: 90 }, (_, i) => ({ x: R(i * 2.1), y: R(i * 1.7), sp: 0.2 + R(i) * 0.5, sw: (R(i + 4) - 0.5) * 0.3, s: 0.6 + R(i + 2) * 1.4 }));

    const draw = () => {
      frame++;
      const t = frame;
      const horizon = h * 0.74;

      // === SKY: cinematic teal-to-fire dusk ===
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#070a14');
      sky.addColorStop(0.32, '#172033');
      sky.addColorStop(0.55, '#5a2a2a');
      sky.addColorStop(0.72, '#c25324');
      sky.addColorStop(0.86, '#e87d2a');
      sky.addColorStop(1, '#2a1208');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // distant haze sun glow near horizon
      const sun = ctx.createRadialGradient(w * 0.34, horizon - 30, 10, w * 0.34, horizon - 30, w * 0.5);
      sun.addColorStop(0, 'rgba(255,180,90,0.45)');
      sun.addColorStop(0.5, 'rgba(255,120,50,0.12)');
      sun.addColorStop(1, 'transparent');
      ctx.fillStyle = sun;
      ctx.fillRect(0, 0, w, h);

      // === GOD RAYS (volumetric light shafts) ===
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const rayOrigin = { x: w * 0.34, y: horizon - 30 };
      for (let i = 0; i < 9; i++) {
        const a = -Math.PI / 2 + (i - 4) * 0.14 + Math.sin(t * 0.004 + i) * 0.02;
        const len = h * 1.1;
        const spread = 0.05 + i * 0.004;
        const ray = ctx.createLinearGradient(rayOrigin.x, rayOrigin.y, rayOrigin.x + Math.cos(a) * len, rayOrigin.y + Math.sin(a) * len);
        ray.addColorStop(0, `rgba(255,200,120,${0.05 + Math.sin(t * 0.02 + i) * 0.02})`);
        ray.addColorStop(1, 'transparent');
        ctx.fillStyle = ray;
        ctx.beginPath();
        ctx.moveTo(rayOrigin.x, rayOrigin.y);
        ctx.lineTo(rayOrigin.x + Math.cos(a - spread) * len, rayOrigin.y + Math.sin(a - spread) * len);
        ctx.lineTo(rayOrigin.x + Math.cos(a + spread) * len, rayOrigin.y + Math.sin(a + spread) * len);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // === FAR SKYLINE (parallax) ===
      const fp = (t * 0.06) % (w + 100);
      ctx.fillStyle = 'rgba(18,16,28,0.85)';
      for (const b of farB) {
        const x = ((b.x * w - fp * 0.2) % (w + 120) + w + 120) % (w + 120) - 60;
        ctx.fillRect(x, horizon - b.bh * h, b.bw * w, b.bh * h);
      }

      // === MID RUINED CITY with fire-lit windows ===
      const mp = (t * 0.12) % (w + 200);
      for (const b of midB) {
        const x = ((b.x * w - mp * 0.5) % (w + 240) + w + 240) % (w + 240) - 120;
        const bw = b.bw * w, bh = b.bh * h;
        const top = horizon - bh;
        // body
        const bg = ctx.createLinearGradient(0, top, 0, horizon);
        bg.addColorStop(0, '#0d0a12');
        bg.addColorStop(1, '#060409');
        ctx.fillStyle = bg;
        ctx.fillRect(x, top, bw, bh);
        // windows
        for (const win of b.win) {
          const wx = x + win[0] * bw + bw * 0.06;
          const wy = top + win[1] * bh + 6;
          const ww = bw * 0.16, wh = bh * 0.05;
          if (win[2] > 0.78) {
            const fl = 0.5 + Math.sin(t * 0.08 + wx + wy) * 0.5;
            ctx.fillStyle = `rgba(255,${120 + fl * 90},40,${0.5 + fl * 0.4})`;
          } else if (win[2] > 0.55) {
            ctx.fillStyle = 'rgba(120,150,190,0.18)';
          } else {
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
          }
          ctx.fillRect(wx, wy, ww, wh);
        }
      }

      // smoke plumes behind buildings
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < 5; i++) {
        const sxp = (w * (0.12 + i * 0.2) - mp * 0.5 + w * 3) % w;
        for (let p = 0; p < 7; p++) {
          const tt = (t * 0.5 + p * 55 + i * 40) % 380;
          ctx.fillStyle = `rgba(60,45,45,${0.05 * (1 - tt / 380)})`;
          ctx.beginPath();
          ctx.arc(sxp + Math.sin(tt * 0.02 + i) * 24, horizon - tt, 22 + tt * 0.45, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // === GUNSHIP patrolling ===
      drawGunship(ctx, ((t * 0.6) % (w + 300)) - 150, h * 0.2 + Math.sin(t * 0.01) * 12, t);

      // === GROUND ===
      const ground = ctx.createLinearGradient(0, horizon, 0, h);
      ground.addColorStop(0, '#1a0e0a');
      ground.addColorStop(1, '#040203');
      ctx.fillStyle = ground;
      ctx.fillRect(0, horizon, w, h - horizon);
      // wet-ground reflection of the fire glow
      const refl = ctx.createLinearGradient(0, horizon, 0, h);
      refl.addColorStop(0, 'rgba(255,120,40,0.18)');
      refl.addColorStop(0.4, 'transparent');
      ctx.fillStyle = refl;
      ctx.fillRect(w * 0.15, horizon, w * 0.5, h - horizon);
      // rubble silhouettes
      ctx.fillStyle = '#070302';
      for (let i = 0; i < 9; i++) {
        const rx = (R(i) * w + (t * 0.2)) % w;
        const rw = 30 + R(i + 2) * 70;
        ctx.beginPath();
        ctx.moveTo(rx, h);
        ctx.lineTo(rx + rw * 0.3, horizon + 14 + R(i + 3) * 20);
        ctx.lineTo(rx + rw * 0.7, horizon + 8 + R(i + 4) * 16);
        ctx.lineTo(rx + rw, h);
        ctx.closePath();
        ctx.fill();
      }

      // === HERO SOLDIER (foreground, rim-lit) ===
      drawSoldier(ctx, w * 0.8, h * 1.0, h * 0.62, t);

      // === FALLING ASH ===
      for (const a of ash) {
        a.y += a.sp * 0.0012; a.x += a.sw * 0.0006;
        if (a.y > 1.02) { a.y = -0.02; a.x = R(a.x * 999); }
        ctx.fillStyle = `rgba(180,170,165,${0.12 + a.s * 0.06})`;
        ctx.fillRect(a.x * w, a.y * h, a.s, a.s);
      }

      // === RISING EMBERS ===
      for (let i = 0; i < 60; i++) {
        const ex = (R(i) * w + Math.sin(t * 0.01 + i) * 20) % w;
        const cycle = (t * (0.3 + R(i + 1) * 0.5) + R(i) * h) % h;
        const ey = h - cycle;
        const fl = 0.5 + Math.sin(t * 0.12 + i) * 0.5;
        ctx.fillStyle = `rgba(255,${120 + fl * 90},40,${0.35 + fl * 0.45})`;
        ctx.beginPath();
        ctx.arc(ex, ey, 0.8 + R(i + 5) * 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // === BIG BOKEH EMBERS (depth-of-field foreground) ===
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (const e of bigEmbers) {
        e.y -= e.sp * 0.0014; e.x += 0.0003;
        if (e.y < -0.05) { e.y = 1.05; e.x = R(e.x * 777); }
        const px = e.x * w, py = e.y * h;
        const grd = ctx.createRadialGradient(px, py, 0, px, py, e.s);
        grd.addColorStop(0, 'rgba(255,170,70,0.35)');
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.arc(px, py, e.s, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();

      // === CINEMATIC GRADE: teal shadows, vignette, letterbox tint ===
      const teal = ctx.createLinearGradient(0, 0, 0, h);
      teal.addColorStop(0, 'rgba(0,40,60,0.18)');
      teal.addColorStop(0.5, 'transparent');
      ctx.fillStyle = teal;
      ctx.fillRect(0, 0, w, h);
      const vig = ctx.createRadialGradient(w / 2, h * 0.52, h * 0.2, w / 2, h * 0.52, w * 0.8);
      vig.addColorStop(0, 'transparent');
      vig.addColorStop(1, 'rgba(0,0,0,0.78)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
}

function drawGunship(ctx: CanvasRenderingContext2D, x: number, y: number, t: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#0a0a10';
  // body
  ctx.beginPath();
  ctx.ellipse(0, 0, 34, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  // tail boom
  ctx.fillRect(20, -3, 40, 5);
  ctx.fillRect(56, -10, 5, 14);
  // cockpit glass
  ctx.fillStyle = 'rgba(120,160,200,0.25)';
  ctx.beginPath(); ctx.ellipse(-22, -1, 10, 6, 0, 0, Math.PI * 2); ctx.fill();
  // rotor (spinning blur)
  ctx.strokeStyle = 'rgba(150,150,160,0.25)';
  ctx.lineWidth = 2;
  const rot = Math.sin(t * 0.6) * 60;
  ctx.beginPath(); ctx.moveTo(-rot, -12); ctx.lineTo(rot, -12); ctx.stroke();
  ctx.fillStyle = '#0a0a10'; ctx.fillRect(-3, -16, 6, 6);
  // blinking nav light
  if (Math.floor(t / 20) % 2 === 0) {
    ctx.fillStyle = '#ff3030';
    ctx.beginPath(); ctx.arc(-30, 2, 2, 0, Math.PI * 2); ctx.fill();
  }
  // downward searchlight
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const beam = ctx.createLinearGradient(0, 6, 0, 220);
  beam.addColorStop(0, 'rgba(255,240,200,0.18)');
  beam.addColorStop(1, 'transparent');
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.moveTo(-6, 6); ctx.lineTo(6, 6); ctx.lineTo(60, 220); ctx.lineTo(-60, 220); ctx.closePath();
  ctx.fill();
  ctx.restore();
  ctx.restore();
}

function drawSoldier(ctx: CanvasRenderingContext2D, x: number, baseY: number, height: number, frame: number) {
  const u = height / 100;
  const breath = Math.sin(frame * 0.035) * 0.7;
  ctx.save();
  ctx.translate(x, baseY + breath);

  // rim light glow behind the figure
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const rim = ctx.createRadialGradient(-8 * u, -55 * u, 4, -8 * u, -55 * u, 70 * u);
  rim.addColorStop(0, 'rgba(255,150,60,0.22)');
  rim.addColorStop(1, 'transparent');
  ctx.fillStyle = rim;
  ctx.fillRect(-80 * u, -120 * u, 160 * u, 130 * u);
  ctx.restore();

  ctx.fillStyle = '#050407';
  ctx.shadowColor = 'rgba(255,130,50,0.55)';
  ctx.shadowBlur = 14;

  // legs (combat stance)
  ctx.beginPath();
  ctx.moveTo(-6 * u, 0); ctx.lineTo(-10 * u, -34 * u); ctx.lineTo(-2 * u, -36 * u); ctx.lineTo(1 * u, 0); ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(9 * u, 0); ctx.lineTo(7 * u, -34 * u); ctx.lineTo(1 * u, -36 * u); ctx.lineTo(3 * u, 0); ctx.closePath(); ctx.fill();
  // boots
  ctx.fillRect(-11 * u, -3 * u, 12 * u, 4 * u);
  ctx.fillRect(3 * u, -3 * u, 12 * u, 4 * u);

  // torso w/ tactical vest bulk
  ctx.beginPath();
  ctx.moveTo(-10 * u, -34 * u);
  ctx.lineTo(-12 * u, -60 * u);
  ctx.lineTo(-6 * u, -70 * u);
  ctx.lineTo(8 * u, -68 * u);
  ctx.lineTo(11 * u, -58 * u);
  ctx.lineTo(8 * u, -34 * u);
  ctx.closePath(); ctx.fill();
  // shoulder pads
  ctx.beginPath(); ctx.ellipse(-10 * u, -62 * u, 5 * u, 4 * u, -0.3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(10 * u, -60 * u, 5 * u, 4 * u, 0.3, 0, Math.PI * 2); ctx.fill();

  // head + helmet + headset
  ctx.beginPath(); ctx.ellipse(-1 * u, -76 * u, 6.5 * u, 7.5 * u, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(-8 * u, -81 * u, 15 * u, 4 * u); // helmet brim
  ctx.beginPath(); ctx.arc(5 * u, -74 * u, 2.5 * u, 0, Math.PI * 2); ctx.fill(); // headset

  // rifle raised across body
  ctx.save();
  ctx.rotate(-0.16);
  ctx.fillRect(-2 * u, -64 * u, 34 * u, 4.5 * u); // barrel + body
  ctx.fillRect(20 * u, -66 * u, 6 * u, 11 * u); // mag
  ctx.fillRect(-8 * u, -62 * u, 9 * u, 8 * u); // stock
  ctx.fillRect(28 * u, -64 * u, 6 * u, 2 * u); // muzzle
  ctx.restore();

  // arms gripping the rifle
  ctx.beginPath();
  ctx.moveTo(-5 * u, -62 * u); ctx.lineTo(10 * u, -57 * u); ctx.lineTo(9 * u, -50 * u); ctx.lineTo(-6 * u, -53 * u); ctx.closePath(); ctx.fill();

  ctx.restore();
}
