import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { LEVELS, createGameState, tick, GameState } from '../game/engine';
import { render } from '../game/renderer';
import { createInput } from '../game/input';
import { CHARACTERS } from '../game/characters';
import styles from './Game.module.css';

export default function Game() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const inputRef = useRef<ReturnType<typeof createInput> | null>(null);
  const animRef = useRef(0);
  const { progress, updateProgress, save } = useGameStore();

  const [overlay, setOverlay] = useState<'none' | 'pause' | 'win' | 'lose'>('none');

  const lvlIndex = Math.min((parseInt(levelId || '1') || 1) - 1, LEVELS.length - 1);
  const level = LEVELS[lvlIndex];
  const charId = (progress as Record<string, unknown>).selectedCharacter as string || 'ghost';
  const skin = CHARACTERS.find((c) => c.id === charId) || CHARACTERS[0];

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cursor = 'none';

    stateRef.current = createGameState(canvas.width, canvas.height, level);
    inputRef.current = createInput(canvas);

    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);

    const loop = () => {
      if (!stateRef.current || !inputRef.current) return;
      const w = canvas.width, h = canvas.height;

      stateRef.current = tick(stateRef.current, inputRef.current.state, w, h, level);
      render(ctx, stateRef.current, w, h, level, skin);

      if (stateRef.current.levelComplete && overlay === 'none') {
        setOverlay('win');
        const next = Math.max(progress.maxLevelReached, level.id + 1);
        updateProgress({ maxLevelReached: next, totalKills: progress.totalKills + stateRef.current.kills });
        save();
      }
      if (stateRef.current.gameOver && overlay === 'none') {
        setOverlay('lose');
        updateProgress({ totalDeaths: progress.totalDeaths + 1, totalKills: progress.totalKills + stateRef.current.kills });
        save();
      }

      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      inputRef.current?.destroy();
      window.removeEventListener('resize', onResize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        if (overlay === 'none') {
          setOverlay('pause');
          if (stateRef.current) stateRef.current.paused = true;
        } else if (overlay === 'pause') {
          setOverlay('none');
          if (stateRef.current) stateRef.current.paused = false;
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [overlay]);

  const resume = useCallback(() => {
    setOverlay('none');
    if (stateRef.current) stateRef.current.paused = false;
  }, []);

  const retry = useCallback(() => {
    const canvas = canvasRef.current!;
    stateRef.current = createGameState(canvas.width, canvas.height, level);
    setOverlay('none');
  }, [level]);

  const nextLevel = useCallback(() => {
    const nextId = Math.min(level.id + 1, LEVELS.length);
    navigate(`/game/${nextId}`);
    const canvas = canvasRef.current!;
    stateRef.current = createGameState(canvas.width, canvas.height, LEVELS[nextId - 1]);
    setOverlay('none');
  }, [level.id, navigate]);

  const quit = useCallback(() => navigate('/levels'), [navigate]);

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />
      {overlay === 'pause' && (
        <div className={styles.overlay}>
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>PAUSED</h2>
            <button className={styles.btn} onClick={resume}>RESUME</button>
            <button className={styles.btn} onClick={retry}>RESTART</button>
            <button className={`${styles.btn} ${styles.danger}`} onClick={quit}>QUIT</button>
          </div>
        </div>
      )}
      {overlay === 'win' && (
        <div className={styles.overlay}>
          <div className={styles.panel}>
            <h2 className={styles.panelTitleGreen}>MISSION COMPLETE</h2>
            <p className={styles.sub}>{level.name}</p>
            <p className={styles.score}>Score: {stateRef.current?.score || 0}</p>
            <button className={`${styles.btn} ${styles.primary}`} onClick={nextLevel}>NEXT MISSION</button>
            <button className={styles.btn} onClick={quit}>BACK TO MAP</button>
          </div>
        </div>
      )}
      {overlay === 'lose' && (
        <div className={styles.overlay}>
          <div className={styles.panel}>
            <h2 className={styles.panelTitleRed}>YOU DIED</h2>
            <p className={styles.sub}>The undead claimed you.</p>
            <button className={`${styles.btn} ${styles.primary}`} onClick={retry}>TRY AGAIN</button>
            <button className={styles.btn} onClick={quit}>BACK TO MAP</button>
          </div>
        </div>
      )}
    </div>
  );
}
