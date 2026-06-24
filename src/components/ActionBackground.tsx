import { useEffect, useRef } from 'react';

/**
 * Cinematic action background for the main menu — a dusk battlefield:
 * burning city skyline, drifting smoke, rising embers, distant explosion
 * glows, sweeping searchlights and a foreground soldier silhouette.
 * Rendered procedurally on canvas so it stays crisp and offline-friendly.
 */
export default function ActionBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;
    let frame = 0;
    let w = 0, h = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Persistent particle systems
    const embers = Array.from({ length: 70 }, () => ({
      x: Math.random(), y: Math.random(), s: 0.5 + Math.random() * 2,
      sp: 0.2 + Math.random() * 0.8, drift: (Math.random() - 0.5) * 0.4,
    }));

    // Skyline buildings (seeded once)
    const buildings: { x: number; bw: number; bh: number; lit: number[] }[] = [];
    let bx = 0;
    while (bx < 1) {
      const bw = 0.03 + Math.random() * 0.05;
      const bh = 0.12 + Math.random() * 0.28;
      const lit = Array.from({ length: 6 }, () => (Math.random() > 0.55 ? 1 : 0));
      buildings.push({ x: bx, bw, bh, lit });
      bx += bw + 0.005;
    }

    const draw = () => {
      frame++;
      // === SKY (dusk / fire) ===
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#0a0612');
      sky.addColorStop(0.35, '#2a1024');
      sky.addColorStop(0.6, '#6e1f1a');
      sky.addColorStop(0.8, '#b8431a');
      sky.addColorStop(1, '#1c0c08');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // Distant explosion glow (pulsing)
      const ex = w * (0.25 + Math.sin(frame * 0.003) * 0.05);
      const glow = ctx.createRadialGradient(ex, h * 0.62, 10, ex, h * 0.62, w * 0.4);
      const gp = 0.18 + Math.sin(frame * 0.04) * 0.06;
      glow.addColorStop(0, `rgba(255,150,40,${gp})`);
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Searchlight beams
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 2; i++) {
        const baseX = w * (0.3 + i * 0.4);
        const ang = -Math.PI / 2 + Math.sin(frame * 0.006 + i * 2) * 0.5;
        const beam = ctx.createLinearGradient(baseX, h * 0.7, baseX + Math.cos(ang) * h, h * 0.7 + Math.sin(ang) * h);
        beam.addColorStop(0, 'rgba(255,220,180,0.10)');
        beam.addColorStop(1, 'transparent');
        ctx.fillStyle = beam;
        ctx.beginPath();
        ctx.moveTo(baseX, h * 0.72);
        ctx.lineTo(baseX + Math.cos(ang - 0.05) * h, h * 0.72 + Math.sin(ang - 0.05) * h);
        ctx.lineTo(baseX + Math.cos(ang + 0.05) * h, h * 0.72 + Math.sin(ang + 0.05) * h);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // === DISTANT SKYLINE ===
      const horizon = h * 0.72;
      ctx.fillStyle = '#0d0710';
      for (const b of buildings) {
        const x = b.x * w;
        const bw = b.bw * w;
        const bh = b.bh * h;
        ctx.fillRect(x, horizon - bh, bw, bh);
        // lit windows
        for (let r = 0; r < b.lit.length; r++) {
          if (b.lit[r] && (frame + r * 13) % 200 > 20) {
            ctx.fillStyle = 'rgba(255,180,80,0.5)';
            ctx.fillRect(x + bw * 0.3, horizon - bh + 6 + r * (bh / 7), bw * 0.35, 3);
            ctx.fillStyle = '#0d0710';
          }
        }
      }

      // smoke columns rising from skyline
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < 4; i++) {
        const sxp = w * (0.15 + i * 0.23);
        for (let p = 0; p < 6; p++) {
          const t = (frame * 0.4 + p * 60 + i * 30) % 360;
          const yy = horizon - t;
          const sz = 20 + t * 0.4;
          ctx.fillStyle = `rgba(40,30,30,${0.06 * (1 - t / 360)})`;
          ctx.beginPath();
          ctx.arc(sxp + Math.sin(t * 0.02 + i) * 20, yy, sz, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // === GROUND ===
      const ground = ctx.createLinearGradient(0, horizon, 0, h);
      ground.addColorStop(0, '#1a0e0a');
      ground.addColorStop(1, '#050203');
      ctx.fillStyle = ground;
      ctx.fillRect(0, horizon, w, h - horizon);
      // rubble specks
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      for (let i = 0; i < 30; i++) {
        const rx = ((i * 97) % 100) / 100 * w;
        const ry = horizon + ((i * 53) % 100) / 100 * (h - horizon);
        ctx.fillRect(rx, ry, 3 + (i % 3), 2);
      }

      // === FOREGROUND SOLDIER SILHOUETTE (right side) ===
      drawSoldier(ctx, w * 0.78, h * 0.96, h * 0.5, frame);

      // === EMBERS ===
      for (const e of embers) {
        e.y -= e.sp * 0.0016;
        e.x += e.drift * 0.0006;
        if (e.y < -0.02) { e.y = 1.02; e.x = Math.random(); }
        const px = e.x * w, py = e.y * h;
        const flick = 0.5 + Math.sin(frame * 0.1 + px) * 0.5;
        ctx.fillStyle = `rgba(255,${130 + flick * 80},40,${0.5 + flick * 0.4})`;
        ctx.beginPath();
        ctx.arc(px, py, e.s, 0, Math.PI * 2);
        ctx.fill();
      }

      // Vignette + film grain feel
      const vig = ctx.createRadialGradient(w / 2, h / 2, h * 0.25, w / 2, h / 2, w * 0.75);
      vig.addColorStop(0, 'transparent');
      vig.addColorStop(1, 'rgba(0,0,0,0.7)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
}

function drawSoldier(ctx: CanvasRenderingContext2D, x: number, baseY: number, height: number, frame: number) {
  const u = height / 100; // unit
  const breath = Math.sin(frame * 0.04) * 0.6;
  ctx.save();
  ctx.translate(x, baseY + breath);
  ctx.fillStyle = '#08060a';
  ctx.strokeStyle = '#08060a';

  // rim light from the fire behind
  ctx.shadowColor = 'rgba(255,140,50,0.6)';
  ctx.shadowBlur = 18;

  // legs (slight combat stance)
  ctx.beginPath();
  ctx.moveTo(-6 * u, 0);
  ctx.lineTo(-9 * u, -34 * u);
  ctx.lineTo(-2 * u, -36 * u);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(8 * u, 0);
  ctx.lineTo(6 * u, -34 * u);
  ctx.lineTo(1 * u, -36 * u);
  ctx.lineTo(2 * u, 0);
  ctx.closePath();
  ctx.fill();

  // torso (with tactical bulk)
  ctx.beginPath();
  ctx.moveTo(-9 * u, -34 * u);
  ctx.lineTo(-11 * u, -62 * u);
  ctx.lineTo(-4 * u, -70 * u);
  ctx.lineTo(7 * u, -68 * u);
  ctx.lineTo(9 * u, -60 * u);
  ctx.lineTo(7 * u, -34 * u);
  ctx.closePath();
  ctx.fill();

  // head + helmet
  ctx.beginPath();
  ctx.ellipse(0, -76 * u, 6 * u, 7 * u, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-7 * u, -80 * u, 14 * u, 4 * u); // helmet brim

  // raised rifle across body
  ctx.save();
  ctx.rotate(-0.18);
  ctx.fillRect(-2 * u, -64 * u, 30 * u, 4 * u); // barrel
  ctx.fillRect(18 * u, -66 * u, 6 * u, 9 * u); // mag
  ctx.fillRect(-6 * u, -62 * u, 8 * u, 7 * u); // stock
  ctx.restore();

  // arms gripping
  ctx.beginPath();
  ctx.moveTo(-4 * u, -62 * u);
  ctx.lineTo(8 * u, -58 * u);
  ctx.lineTo(7 * u, -52 * u);
  ctx.lineTo(-5 * u, -54 * u);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}
