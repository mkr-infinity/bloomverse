import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CHARACTERS, drawHumanCharacter } from '../game/characters';
import { useGameStore } from '../store/gameStore';
import styles from './CharacterSelect.module.css';

const CHAR_DATA = [
  { desc: 'Silent and lethal. Former special ops sniper.', speed: 85, power: 70, armor: 60, role: 'ASSASSIN', rarity: 'ELITE', accent: '#00d4ff' },
  { desc: 'Explosive combat specialist. Fears nothing.', speed: 65, power: 95, armor: 70, role: 'DEMOLITION', rarity: 'LEGEND', accent: '#ff6b2d' },
  { desc: 'Stealth expert. Precision over force.', speed: 95, power: 60, armor: 50, role: 'SCOUT', rarity: 'RARE', accent: '#00ff88' },
  { desc: 'Heavy weapons master. An unstoppable force.', speed: 50, power: 85, armor: 95, role: 'JUGGERNAUT', rarity: 'LEGEND', accent: '#ffcc00' },
];

function hexA(hex: string, a: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 0xff},${(n >> 8) & 0xff},${n & 0xff},${a})`;
}

export default function CharacterSelect() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const animRef = useRef(0);
  const updateProgress = useGameStore((s) => s.updateProgress);

  useEffect(() => {
    const canvas = previewRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const draw = () => {
      frameRef.current++;
      const f = frameRef.current;
      const accent = CHAR_DATA[selected].accent;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      // spotlight cone from top
      const cone = ctx.createLinearGradient(cx, 0, cx, canvas.height);
      cone.addColorStop(0, hexA(accent, 0.18));
      cone.addColorStop(1, 'transparent');
      ctx.fillStyle = cone;
      ctx.beginPath();
      ctx.moveTo(cx - 30, 0);
      ctx.lineTo(cx + 30, 0);
      ctx.lineTo(cx + 110, canvas.height);
      ctx.lineTo(cx - 110, canvas.height);
      ctx.closePath();
      ctx.fill();
      // floor disc glow
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

  const handleSelect = () => {
    updateProgress({ selectedCharacter: CHARACTERS[selected].id });
    navigate('/levels');
  };

  const data = CHAR_DATA[selected];

  return (
    <div className={styles.container}>
      {/* Animated background */}
      <div className={styles.bgGlow} />
      <div className={styles.bgGrid} />

      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <h1 className={styles.title}>SELECT OPERATIVE</h1>
        <div style={{ width: 38 }} />
      </div>

      <div className={styles.main}>
        {/* Left: character display */}
        <div className={styles.display}>
          <div className={styles.tagRow}>
            <span className={styles.roleTag} style={{ color: data.accent, borderColor: hexA(data.accent, 0.5), background: hexA(data.accent, 0.1) }}>{data.role}</span>
            <span className={`${styles.rarityTag} ${styles['rarity_' + data.rarity]}`}>{data.rarity}</span>
          </div>
          <canvas ref={previewRef} width={260} height={340} className={styles.preview} />
          <h2 className={styles.charName} style={{ textShadow: `0 0 24px ${hexA(data.accent, 0.5)}` }}>{CHARACTERS[selected].name}</h2>
          <p className={styles.charDesc}>{data.desc}</p>
        </div>

        {/* Right: stats panel */}
        <div className={styles.statsPanel}>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>SPEED</span>
            <div className={styles.statBar}><div className={styles.statFill} style={{ width: `${data.speed}%`, background: 'linear-gradient(90deg,#00d4ff,#00ff88)' }} /></div>
            <span className={styles.statVal}>{data.speed}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>POWER</span>
            <div className={styles.statBar}><div className={styles.statFill} style={{ width: `${data.power}%`, background: 'linear-gradient(90deg,#ff6b2d,#ff2d55)' }} /></div>
            <span className={styles.statVal}>{data.power}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>ARMOR</span>
            <div className={styles.statBar}><div className={styles.statFill} style={{ width: `${data.armor}%`, background: 'linear-gradient(90deg,#ffcc00,#ff6b2d)' }} /></div>
            <span className={styles.statVal}>{data.armor}</span>
          </div>
        </div>
      </div>

      {/* Character cards */}
      <div className={styles.cardRow}>
        {CHARACTERS.map((char, i) => (
          <button key={char.id} className={`${styles.card} ${i === selected ? styles.active : ''}`} onClick={() => setSelected(i)}>
            <ThumbCanvas index={i} />
            <span className={styles.cardName}>{char.name}</span>
            {i === selected && <div className={styles.cardCheck}>&#10003;</div>}
          </button>
        ))}
      </div>

      <button className={styles.confirm} onClick={handleSelect} style={{ background: `linear-gradient(135deg, ${data.accent}, ${hexA(data.accent, 0.6)})`, boxShadow: `0 6px 26px ${hexA(data.accent, 0.45)}` }}>
        <span>DEPLOY {CHARACTERS[selected].name.toUpperCase()}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
    </div>
  );
}

function ThumbCanvas({ index }: { index: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    ctx.clearRect(0, 0, c.width, c.height);
    drawHumanCharacter(ctx, c.width / 2, c.height / 2 + 16, CHARACTERS[index], 1.1, 0, 0, false);
  }, [index]);
  return <canvas ref={ref} width={56} height={76} className={styles.thumb} />;
}
