import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CHARACTERS, CharacterSkin, drawCharacter } from '../game/characters';
import { useGameStore } from '../store/gameStore';
import styles from './CharacterSelect.module.css';

export default function CharacterSelect() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const updateProgress = useGameStore((s) => s.updateProgress);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = 200;
    canvas.height = 200;
    let anim: number;

    const draw = () => {
      frameRef.current++;
      ctx.clearRect(0, 0, 200, 200);
      drawCharacter(ctx, 100, 120, CHARACTERS[selected], 2.5, 0, frameRef.current, true);
      anim = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(anim);
  }, [selected]);

  const handleConfirm = () => {
    updateProgress({ selectedCharacter: CHARACTERS[selected].id });
    navigate('/levels');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')}>BACK</button>
        <h1 className={styles.title}>CHOOSE YOUR FIGHTER</h1>
      </div>

      <div className={styles.content}>
        <canvas ref={canvasRef} className={styles.preview} />
        <h2 className={styles.charName}>{CHARACTERS[selected].name}</h2>

        <div className={styles.grid}>
          {CHARACTERS.map((char, i) => (
            <button
              key={char.id}
              className={`${styles.card} ${i === selected ? styles.active : ''}`}
              onClick={() => setSelected(i)}
            >
              <CharacterThumb skin={char} />
              <span className={styles.cardName}>{char.name}</span>
            </button>
          ))}
        </div>

        <button className={styles.confirm} onClick={handleConfirm}>
          SELECT & PLAY
        </button>
      </div>
    </div>
  );
}

function CharacterThumb({ skin }: { skin: CharacterSkin }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = 60;
    canvas.height = 80;
    drawCharacter(ctx, 30, 50, skin, 1.2, 0, 0, false);
  }, [skin]);
  return <canvas ref={ref} className={styles.thumb} />;
}
