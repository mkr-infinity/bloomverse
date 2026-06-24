import { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { createInitialState, updateEngine, fireProjectile, GameEngineState } from '../game/engine';
import { renderGame } from '../game/renderer';
import { createInputHandler } from '../game/input';
import { LEVELS } from '../game/levels';
import HUD from '../components/HUD';
import PauseMenu from '../components/PauseMenu';
import LevelComplete from '../components/LevelComplete';
import GameOver from '../components/GameOver';
import styles from './Game.module.css';

export default function Game() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngineState | null>(null);
  const inputRef = useRef<ReturnType<typeof createInputHandler> | null>(null);
  const lastTimeRef = useRef(0);
  const lastShotRef = useRef(0);
  const animRef = useRef(0);

  const {
    player, progress,
    setPlaying, setPaused, damagePlayer, healPlayer,
    addKill, addXP, updatePlayer, updateProgress, save,
  } = useGameStore();

  const [gameState, setGameState] = useState<'playing' | 'paused' | 'levelComplete' | 'gameOver'>('playing');

  const levelIndex = Math.min(progress.currentLevel - 1, LEVELS.length - 1);
  const levelConfig = LEVELS[levelIndex];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    engineRef.current = createInitialState(canvas.width, canvas.height);
    inputRef.current = createInputHandler(canvas);
    setPlaying(true);
    lastTimeRef.current = performance.now();

    if (progress.firstPlayDate === 0) {
      updateProgress({ firstPlayDate: Date.now() });
    }

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const loop = (time: number) => {
      const dt = Math.min(time - lastTimeRef.current, 50);
      lastTimeRef.current = time;

      if (!engineRef.current || !inputRef.current) return;

      const input = inputRef.current.state;
      const w = canvas.width;
      const h = canvas.height;

      if (gameState === 'playing') {
        // Shooting
        if (input.shoot) {
          const weapon = player.weapons[player.activeWeaponIndex];
          if (weapon && time - lastShotRef.current > weapon.fireRate && weapon.ammo > 0) {
            engineRef.current = fireProjectile(engineRef.current, weapon.damage);
            lastShotRef.current = time;
            updatePlayer({ weapons: player.weapons.map((w, i) => i === player.activeWeaponIndex ? { ...w, ammo: w.ammo - 1 } : w) });
          }
        }

        // Reload
        if (input.reload) {
          const weapon = player.weapons[player.activeWeaponIndex];
          if (weapon && weapon.ammo < weapon.maxAmmo) {
            updatePlayer({ weapons: player.weapons.map((w, i) => i === player.activeWeaponIndex ? { ...w, ammo: w.maxAmmo } : w) });
          }
        }

        engineRef.current = updateEngine(
          engineRef.current, input, dt, w, h, levelConfig,
          (dmg) => damagePlayer(dmg),
          (xp) => { addKill(); addXP(xp); },
          (type, value) => {
            if (type === 'health') healPlayer(value);
            else if (type === 'ammo') {
              updatePlayer({ weapons: player.weapons.map((w, i) => i === player.activeWeaponIndex ? { ...w, ammo: Math.min(w.maxAmmo, w.ammo + value) } : w) });
            } else if (type === 'credits') updatePlayer({ credits: player.credits + value });
          },
          player.health,
        );

        if (engineRef.current.levelComplete) {
          setGameState('levelComplete');
          const next = progress.currentLevel + 1;
          updateProgress({
            currentLevel: next,
            maxLevelReached: Math.max(progress.maxLevelReached, next),
          });
          save();
        }

        if (engineRef.current.gameOver) {
          setGameState('gameOver');
          updateProgress({ totalDeaths: progress.totalDeaths + 1 });
          save();
        }
      }

      renderGame(ctx, engineRef.current, w, h, levelConfig);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      inputRef.current?.destroy();
      setPlaying(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        if (gameState === 'playing') {
          setGameState('paused');
          setPaused(true);
        } else if (gameState === 'paused') {
          setGameState('playing');
          setPaused(false);
        }
      }
      // Weapon switch with number keys
      if (e.code >= 'Digit1' && e.code <= 'Digit9') {
        const idx = parseInt(e.code.replace('Digit', '')) - 1;
        if (idx < player.weapons.length) {
          useGameStore.getState().switchWeapon(idx);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [gameState, setPaused, player.weapons.length]);

  const handleResume = useCallback(() => { setGameState('playing'); setPaused(false); }, [setPaused]);
  const handleQuit = useCallback(() => { save(); navigate('/'); }, [save, navigate]);
  const handleNextLevel = useCallback(() => {
    const canvas = canvasRef.current!;
    engineRef.current = createInitialState(canvas.width, canvas.height);
    setGameState('playing');
  }, []);
  const handleRetry = useCallback(() => {
    const canvas = canvasRef.current!;
    useGameStore.getState().updatePlayer({ health: player.maxHealth });
    engineRef.current = createInitialState(canvas.width, canvas.height);
    setGameState('playing');
  }, [player.maxHealth]);

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <HUD
        health={player.health}
        maxHealth={player.maxHealth}
        armor={player.armor}
        weapon={player.weapons[player.activeWeaponIndex]}
        level={progress.currentLevel}
        levelName={levelConfig.name}
        wave={engineRef.current?.wave ?? 0}
        totalWaves={levelConfig.waves.length}
        kills={player.kills}
        playerLevel={player.level}
        xp={player.xp}
        xpToNext={player.xpToNext}
      />
      {gameState === 'paused' && <PauseMenu onResume={handleResume} onQuit={handleQuit} />}
      {gameState === 'levelComplete' && <LevelComplete levelName={levelConfig.name} onNext={handleNextLevel} onQuit={handleQuit} />}
      {gameState === 'gameOver' && <GameOver onRetry={handleRetry} onQuit={handleQuit} />}
    </div>
  );
}
