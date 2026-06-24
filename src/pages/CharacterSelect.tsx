import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CHARACTERS, drawHumanCharacter } from '../game/characters';
import { useGameStore } from '../store/gameStore';
import CoinIcon from '../components/CoinIcon';
import ActionBackground from '../components/ActionBackground';
import styles from './CharacterSelect.module.css';

function hexA(hex: string, a: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 0xff},${(n >> 8) & 0xff},${n & 0xff},${a})`;
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
  const previewRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const animRef = useRef(0);

  useEffect(() => { load(); }, [load]);

  const coins = progress.coins || 0;
  const owned = progress.unlockedCharacters || ['ghost'];
  const char = CHARACTERS[selected];
  const isOwned = char.price === 0 || owned.includes(char.id);

  useEffect(() => {
    const canvas = previewRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const draw = () => {
      frameRef.current++;
      const f = frameRef.current;
      const accent = CHARACTERS[selected].accent;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cone = ctx.createLinearGradient(cx, 0, cx, canvas.height);
      cone.addColorStop(0, hexA(accent, 0.18));
      cone.addColorStop(1, 'transparent');
      ctx.fillStyle = cone;
      ctx.beginPath();
      ctx.moveTo(cx - 30, 0); ctx.lineTo(cx + 30, 0);
      ctx.lineTo(cx + 110, canvas.height); ctx.lineTo(cx - 110, canvas.height);
      ctx.closePath(); ctx.fill();
      const g = ctx.createRadialGradient(cx, canvas.height * 0.78, 8, cx, canvas.height * 0.78, 130);
      g.addColorStop(0, hexA(accent, 0.35));
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(cx, canvas.height * 0.8, 90, 26, 0, 0, Math.PI * 2);
      ctx.fill();
      const bob = Math.sin(f * 0.04) * 4;
      drawHumanCharacter(ctx, cx, canvas.height * 0.62 + bob, CHARACTERS[selected], 3, 0, f, true);
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [selected]);

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

  return (
    <div className={styles.container}>
      <ActionBackground />
      <div className={styles.scrim} />

      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')} aria-label="Back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <h1 className={styles.title}>SELECT OPERATIVE</h1>
        <div className={styles.coinBalance}>
          <CoinIcon size={16} />
          {coins}
        </div>
      </div>

      <div className={styles.main}>
        <div className={styles.display}>
          <div className={styles.tagRow}>
            <span className={styles.roleTag} style={{ color: char.accent, borderColor: hexA(char.accent, 0.5), background: hexA(char.accent, 0.1) }}>{char.role}</span>
            <span className={`${styles.rarityTag} ${styles['rarity_' + char.rarity]}`}>{char.rarity}</span>
          </div>
          <div className={styles.previewWrap}>
            <canvas ref={previewRef} width={260} height={340} className={`${styles.preview} ${!isOwned ? styles.lockedPreview : ''}`} />
            {!isOwned && (
              <div className={styles.lockBadge}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
                <span className={styles.lockBadgeText}>LOCKED</span>
                <span className={styles.lockBadgePrice}><CoinIcon size={13} />{char.price}</span>
              </div>
            )}
          </div>
          <h2 className={styles.charName} style={{ textShadow: `0 0 24px ${hexA(char.accent, 0.5)}` }}>{char.name}</h2>
          <p className={styles.charDesc}>{char.desc}</p>
        </div>

        <div className={styles.statsPanel}>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>SPEED</span>
            <div className={styles.statBar}><div className={styles.statFill} style={{ width: `${char.speed}%`, background: 'linear-gradient(90deg,#00d4ff,#00ff88)' }} /></div>
            <span className={styles.statVal}>{char.speed}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>POWER</span>
            <div className={styles.statBar}><div className={styles.statFill} style={{ width: `${char.power}%`, background: 'linear-gradient(90deg,#ff6b2d,#ff2d55)' }} /></div>
            <span className={styles.statVal}>{char.power}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>ARMOR</span>
            <div className={styles.statBar}><div className={styles.statFill} style={{ width: `${char.armorStat}%`, background: 'linear-gradient(90deg,#ffcc00,#ff6b2d)' }} /></div>
            <span className={styles.statVal}>{char.armorStat}</span>
          </div>
        </div>
      </div>

      <div className={styles.cardRow}>
        {CHARACTERS.map((c, i) => {
          const cOwned = c.price === 0 || owned.includes(c.id);
          return (
            <button key={c.id} className={`${styles.card} ${i === selected ? styles.active : ''} ${!cOwned ? styles.cardLocked : ''}`} onClick={() => setSelected(i)} style={i === selected ? { borderColor: c.accent, boxShadow: `0 0 20px ${hexA(c.accent, 0.4)}` } : undefined}>
              <ThumbCanvas index={i} locked={!cOwned} />
              <span className={styles.cardName}>{c.name}</span>
              {cOwned ? (
                i === selected && <div className={styles.cardCheck} style={{ background: c.accent }}>&#10003;</div>
              ) : (
                <div className={styles.cardPrice}><CoinIcon size={10} />{c.price}</div>
              )}
              {!cOwned && (
                <div className={styles.cardLockIcon}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
                </div>
              )}
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
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

function ThumbCanvas({ index, locked }: { index: number; locked: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    ctx.clearRect(0, 0, c.width, c.height);
    drawHumanCharacter(ctx, c.width / 2, c.height / 2 + 16, CHARACTERS[index], 1.1, 0, 0, false);
    if (locked) {
      ctx.fillStyle = 'rgba(5,5,10,0.6)';
      ctx.fillRect(0, 0, c.width, c.height);
    }
  }, [index, locked]);
  return <canvas ref={ref} width={56} height={76} className={styles.thumb} />;
}
