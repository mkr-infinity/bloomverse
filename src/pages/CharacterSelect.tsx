import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CHARACTERS, drawHumanCharacter } from '../game/characters';
import { useGameStore } from '../store/gameStore';
import styles from './CharacterSelect.module.css';

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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Background glow
      const g = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2 + 20, 5, canvas.width / 2, canvas.height / 2 + 20, 70);
      g.addColorStop(0, 'rgba(255, 45, 85, 0.12)');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawHumanCharacter(ctx, canvas.width / 2, canvas.height / 2 + 30, CHARACTERS[selected], 2, 0, frameRef.current, true);
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [selected]);

  const handleSelect = () => {
    updateProgress({ selectedCharacter: CHARACTERS[selected].id });
    navigate('/levels');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <h1 className={styles.title}>SELECT OPERATIVE</h1>
      </div>

      <div className={styles.content}>
        <canvas ref={previewRef} width={200} height={240} className={styles.preview} />
        <h2 className={styles.charName}>{CHARACTERS[selected].name}</h2>
        <p className={styles.charDesc}>{['Silent and lethal. Former special ops.', 'Explosive combat specialist. No fear.', 'Stealth expert. Precision strikes.', 'Heavy weapons master. Unstoppable force.'][selected]}</p>

        <div className={styles.grid}>
          {CHARACTERS.map((char, i) => (
            <button key={char.id} className={`${styles.card} ${i === selected ? styles.active : ''}`} onClick={() => setSelected(i)}>
              <ThumbCanvas index={i} />
              <span className={styles.cardName}>{char.name}</span>
            </button>
          ))}
        </div>

        <button className={styles.confirm} onClick={handleSelect}>
          DEPLOY OPERATIVE
        </button>
      </div>
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
    drawHumanCharacter(ctx, c.width / 2, c.height / 2 + 12, CHARACTERS[index], 0.9, 0, 0, false);
  }, [index]);
  return <canvas ref={ref} width={50} height={70} className={styles.thumb} />;
}
