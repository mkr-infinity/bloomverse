import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CHARACTERS, CharacterSkin, drawHumanCharacter } from '../game/characters';
import { useGameStore } from '../store/gameStore';
import styles from './CharacterSelect.module.css';

export default function CharacterSelect() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const animRef = useRef(0);
  const updateProgress = useGameStore((s) => s.updateProgress);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = 180;
    canvas.height = 220;

    const draw = () => {
      frameRef.current++;
      ctx.clearRect(0, 0, 180, 220);
      // Draw background glow
      const grd = ctx.createRadialGradient(90, 130, 10, 90, 130, 80);
      grd.addColorStop(0, 'rgba(255, 45, 85, 0.1)');
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, 180, 220);
      // Draw character
      drawHumanCharacter(ctx, 90, 140, CHARACTERS[selected], 2.2, 0, frameRef.current, true);
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [selected]);

  const handleConfirm = () => {
    updateProgress({ selectedCharacter: CHARACTERS[selected].id });
    navigate('/levels');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className={styles.title}>SELECT OPERATIVE</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.previewSection}>
          <canvas ref={canvasRef} className={styles.preview} />
          <h2 className={styles.charName}>{CHARACTERS[selected].name}</h2>
          <p className={styles.charDesc}>{getDescription(selected)}</p>
        </div>

        <div className={styles.grid}>
          {CHARACTERS.map((char, i) => (
            <button
              key={char.id}
              className={`${styles.card} ${i === selected ? styles.active : ''}`}
              onClick={() => setSelected(i)}
            >
              <CharThumb skin={char} />
              <span className={styles.cardName}>{char.name}</span>
            </button>
          ))}
        </div>

        <button className={styles.confirm} onClick={handleConfirm}>
          DEPLOY OPERATIVE
        </button>
      </div>
    </div>
  );
}

function getDescription(index: number): string {
  const descs = [
    'Silent and lethal. Former special ops.',
    'Explosive combat specialist. No fear.',
    'Stealth expert. Precision strikes.',
    'Heavy weapons master. Unstoppable force.',
  ];
  return descs[index];
}

function CharThumb({ skin }: { skin: CharacterSkin }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    c.width = 50;
    c.height = 70;
    ctx.clearRect(0, 0, 50, 70);
    drawHumanCharacter(ctx, 25, 48, skin, 1, 0, 0, false);
  }, [skin]);
  return <canvas ref={ref} className={styles.thumb} />;
}
