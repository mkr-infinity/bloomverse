import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CHARACTERS, drawHumanCharacter, CharacterSkin } from '../game/characters';
import { useGameStore } from '../store/gameStore';
import CoinIcon from '../components/CoinIcon';
import ActionBackground from '../components/ActionBackground';
import styles from './CharacterSelect.module.css';

function hexA(hex: string, a: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 0xff},${(n >> 8) & 0xff},${n & 0xff},${a})`;
}

function drawScene(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  char: CharacterSkin,
  frame: number,
  animate: boolean,
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cx = canvas.width / 2;
  const accent = char.accent;
  // spotlight cone
  const cone = ctx.createLinearGradient(cx, 0, cx, canvas.height);
  cone.addColorStop(0, hexA(accent, 0.2));
  cone.addColorStop(1, 'transparent');
  ctx.fillStyle = cone;
  ctx.beginPath();
  ctx.moveTo(cx - 30, 0); ctx.lineTo(cx + 30, 0);
  ctx.lineTo(cx + 110, canvas.height); ctx.lineTo(cx - 110, canvas.height);
  ctx.closePath(); ctx.fill();
  // floor glow
  const g = ctx.createRadialGradient(cx, canvas.height * 0.78, 8, cx, canvas.height * 0.78, 130);
  g.addColorStop(0, hexA(accent, 0.38));
  g.addColorStop(1, 'transparent');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(cx, canvas.height * 0.8, 92, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  const bob = animate ? Math.sin(frame * 0.04) * 4 : 0;
  drawHumanCharacter(ctx, cx, canvas.height * 0.62 + bob, char, 3, 0, frame, animate);
}

export default function CharacterSelect() {
  const navigate = useNavigate();
  const progress = useGameStore((s) => s.progress);
  const load = useGameStore((s) => s.load);
  const unlockCharacter = useGameStore((s) => s.unlockCharacter);
  const updateProgress = useGameStore((s) => s.updateProgress);
  const save = useGameStore((s) => s.save);

  const [selected, setSelected] = useState(0);
  const [notice, setNotice] = useState('');
  const [drag, setDrag] = useState(0);

  const dragging = useRef(false);
  const startX = useRef(0);
  const moved = useRef(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const animRef = useRef(0);
  const frameRef = useRef(0);

  useEffect(() => { load(); }, [load]);

  const coins = progress.coins || 0;
  const owned = progress.unlockedCharacters || ['ghost'];
  const char = CHARACTERS[selected];
  const isOwned = char.price === 0 || owned.includes(char.id);
  const count = CHARACTERS.length;

  // Draw a static pose for every character once mounted.
  useEffect(() => {
    CHARACTERS.forEach((c, i) => {
      const canvas = canvasRefs.current[i];
      if (canvas) drawScene(canvas.getContext('2d')!, canvas, c, 0, false);
    });
  }, []);

  // Animate only the currently selected character.
  useEffect(() => {
    const canvas = canvasRefs.current[selected];
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const loop = () => {
      frameRef.current++;
      drawScene(ctx, canvas, CHARACTERS[selected], frameRef.current, true);
      animRef.current = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(animRef.current);
      // leave a clean static frame behind
      drawScene(ctx, canvas, CHARACTERS[selected], 0, false);
    };
  }, [selected]);

  const go = useCallback((dir: number) => {
    setSelected((s) => Math.min(count - 1, Math.max(0, s + dir)));
  }, [count]);

  // Swipe handlers
  const onDown = (e: React.PointerEvent) => {
    dragging.current = true;
    moved.current = false;
    startX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 4) moved.current = true;
    setDrag(dx);
  };
  const onUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    const w = viewportRef.current?.offsetWidth || 320;
    const threshold = w * 0.16;
    if (drag < -threshold) go(1);
    else if (drag > threshold) go(-1);
    setDrag(0);
  };

  // keyboard arrows
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  const handleDeploy = () => {
    if (!isOwned) {
      if (coins < char.price) {
        setNotice(`Need ${char.price - coins} more coins`);
        setTimeout(() => setNotice(''), 2200);
        return;
      }
      const ok = unlockCharacter(char.id, char.price);
      if (ok) {
        setNotice(`${char.name} unlocked!`);
        setTimeout(() => setNotice(''), 2000);
      }
      return;
    }
    updateProgress({ selectedCharacter: char.id });
    save();
    navigate('/levels');
  };

  const trackStyle: React.CSSProperties = {
    width: `${count * 100}%`,
    transform: `translateX(calc(${(-selected * 100) / count}% + ${drag}px))`,
    transition: dragging.current ? 'none' : 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
  };

  return (
    <div className={styles.container}>
      <ActionBackground />
      <div className={styles.scrim} />

      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')} aria-label="Back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>
        <h1 className={styles.title}>SELECT OPERATIVE</h1>
        <div className={styles.coinBalance}>
          <CoinIcon size={16} />
          {coins}
        </div>
      </div>

      <div className={styles.progressTrack}>
        <span className={styles.progressLabel}>{selected + 1} / {count}</span>
        <span className={styles.swipeHint}>&#8592; SWIPE &#8594;</span>
      </div>

      <div
        className={styles.viewport}
        ref={viewportRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <div className={styles.track} style={trackStyle}>
          {CHARACTERS.map((c, i) => {
            const cOwned = c.price === 0 || owned.includes(c.id);
            const active = i === selected;
            return (
              <div className={styles.page} key={c.id} style={{ width: `${100 / count}%` }}>
                <div
                  className={`${styles.card} ${active ? styles.cardActive : styles.cardIdle}`}
                  style={active ? { borderColor: hexA(c.accent, 0.55), boxShadow: `0 24px 70px ${hexA(c.accent, 0.28)}` } : undefined}
                >
                  <div className={styles.tagRow}>
                    <span className={styles.roleTag} style={{ color: c.accent, borderColor: hexA(c.accent, 0.5), background: hexA(c.accent, 0.1) }}>{c.role}</span>
                    <span className={`${styles.rarityTag} ${styles['rarity_' + c.rarity]}`}>{c.rarity}</span>
                  </div>

                  <div className={styles.previewWrap}>
                    {active && (
                      <span
                        className={styles.aura}
                        style={{ background: `conic-gradient(from 0deg, transparent, ${hexA(c.accent, 0.55)}, transparent 55%)` }}
                      />
                    )}
                    <span
                      className={styles.platform}
                      style={{ background: `radial-gradient(ellipse at center, ${hexA(c.accent, 0.45)}, transparent 70%)` }}
                    />
                    <canvas
                      ref={(el) => { canvasRefs.current[i] = el; }}
                      width={260}
                      height={320}
                      className={`${styles.preview} ${!cOwned ? styles.lockedPreview : ''}`}
                    />
                    {!cOwned && (
                      <div className={styles.lockBadge}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
                        <span className={styles.lockBadgeText}>LOCKED</span>
                        <span className={styles.lockBadgePrice}><CoinIcon size={13} />{c.price}</span>
                      </div>
                    )}
                  </div>

                  <h2 className={styles.charName} style={{ textShadow: `0 0 24px ${hexA(c.accent, 0.5)}` }}>{c.name}</h2>
                  <p className={styles.charDesc}>{c.desc}</p>

                  <div className={styles.statsPanel}>
                    <Stat label="SPEED" val={c.speed} grad="linear-gradient(90deg,#00d4ff,#00ff88)" />
                    <Stat label="POWER" val={c.power} grad="linear-gradient(90deg,#ff6b2d,#ff2d55)" />
                    <Stat label="ARMOR" val={c.armorStat} grad="linear-gradient(90deg,#ffcc00,#ff6b2d)" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={() => go(-1)} disabled={selected === 0} aria-label="Previous">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={() => go(1)} disabled={selected === count - 1} aria-label="Next">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>

      <div className={styles.dots}>
        {CHARACTERS.map((c, i) => {
          const cOwned = c.price === 0 || owned.includes(c.id);
          return (
            <button
              key={c.id}
              className={`${styles.dot} ${i === selected ? styles.dotActive : ''}`}
              style={i === selected ? { background: c.accent, borderColor: c.accent } : undefined}
              onClick={() => setSelected(i)}
              aria-label={`Select ${c.name}`}
            >
              {!cOwned && <span className={styles.dotLock} />}
            </button>
          );
        })}
      </div>

      {notice && <div className={styles.notice}>{notice}</div>}

      <button
        className={`${styles.confirm} ${!isOwned && coins < char.price ? styles.confirmDisabled : ''}`}
        onClick={handleDeploy}
        style={isOwned
          ? { background: `linear-gradient(135deg, ${char.accent}, ${hexA(char.accent, 0.6)})`, boxShadow: `0 6px 26px ${hexA(char.accent, 0.45)}` }
          : coins >= char.price
            ? { background: 'linear-gradient(135deg,#ffcc00,#ff8800)', boxShadow: '0 6px 26px rgba(255,180,0,0.4)' }
            : undefined}
      >
        {isOwned ? (
          <>
            <span>DEPLOY {char.name.toUpperCase()}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </>
        ) : (
          <>
            <CoinIcon size={16} />
            <span>UNLOCK &middot; {char.price}</span>
          </>
        )}
      </button>
    </div>
  );
}

function Stat({ label, val, grad }: { label: string; val: number; grad: string }) {
  return (
    <div className={styles.statRow}>
      <span className={styles.statLabel}>{label}</span>
      <div className={styles.statBar}><div className={styles.statFill} style={{ width: `${val}%`, background: grad }} /></div>
      <span className={styles.statVal}>{val}</span>
    </div>
  );
}
