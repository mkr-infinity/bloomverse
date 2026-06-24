import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { getLevel, createGameState, tick, GameState } from '../game/engine';
import { render } from '../game/renderer';
import { createInput } from '../game/input';
import { CHARACTERS } from '../game/characters';
import Tutorial from '../components/Tutorial';
import CoinIcon from '../components/CoinIcon';
import styles from './Game.module.css';

export default function Game() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const inputRef = useRef<ReturnType<typeof createInput> | null>(null);
  const animRef = useRef(0);
  const { progress, updateProgress, save, addCoins } = useGameStore();
  const [overlay, setOverlay] = useState<'none' | 'pause' | 'win' | 'lose'>('none');
  const [stats, setStats] = useState({ kills: 0, score: 0, accuracy: 0, coins: 0 });
  const overlayRef = useRef<'none' | 'pause' | 'win' | 'lose'>('none');
  const [showTutorial, setShowTutorial] = useState(() => {
    return !localStorage.getItem('bloomverse_tutorial_done');
  });

  const lvlId = Math.max(1, parseInt(levelId || '1') || 1);
  const level = getLevel(lvlId);
  const charId = progress.selectedCharacter || 'ghost';
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
      const gs = stateRef.current;

      if (!gs.paused && !gs.gameOver && !gs.levelComplete) {
        stateRef.current = tick(gs, inputRef.current.state, w, h, level);
      }
      render(ctx, stateRef.current, w, h, level, skin);

      if (stateRef.current.levelComplete && overlayRef.current === 'none') {
        const s = stateRef.current;
        const coins = level.id * 40 + s.kills * 4 + Math.floor(s.score / 20);
        setStats({ kills: s.kills, score: s.score, accuracy: s.ammo > 0 ? Math.round((s.kills / Math.max(1, 30 - s.ammo + s.kills)) * 100) : 100, coins });
        overlayRef.current = 'win';
        setOverlay('win');
        const next = Math.max(progress.maxLevelReached, level.id + 1);
        updateProgress({ maxLevelReached: next, totalKills: progress.totalKills + s.kills });
        addCoins(coins);
        save();
      }
      if (stateRef.current.gameOver && overlayRef.current === 'none') {
        const s = stateRef.current;
        const coins = Math.floor(s.kills * 2);
        setStats({ kills: s.kills, score: s.score, accuracy: 0, coins });
        overlayRef.current = 'lose';
        setOverlay('lose');
        updateProgress({ totalDeaths: progress.totalDeaths + 1, totalKills: progress.totalKills + s.kills });
        addCoins(coins);
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
        if (overlay === 'none') { setOverlay('pause'); if (stateRef.current) stateRef.current.paused = true; }
        else if (overlay === 'pause') { setOverlay('none'); if (stateRef.current) stateRef.current.paused = false; }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [overlay]);

  const resume = useCallback(() => { overlayRef.current = 'none'; setOverlay('none'); if (stateRef.current) stateRef.current.paused = false; }, []);
  const retry = useCallback(() => {
    const canvas = canvasRef.current!;
    stateRef.current = createGameState(canvas.width, canvas.height, level);
    overlayRef.current = 'none';
    setOverlay('none');
  }, [level]);
  const nextLevel = useCallback(() => {
    const nxt = level.id + 1;
    navigate(`/game/${nxt}`, { replace: true });
    const canvas = canvasRef.current!;
    stateRef.current = createGameState(canvas.width, canvas.height, getLevel(nxt));
    overlayRef.current = 'none';
    setOverlay('none');
  }, [level.id, navigate]);
  const quit = useCallback(() => navigate('/levels'), [navigate]);
  const home = useCallback(() => navigate('/'), [navigate]);

  const closeTutorial = useCallback(() => {
    localStorage.setItem('bloomverse_tutorial_done', '1');
    setShowTutorial(false);
  }, []);

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />

      {showTutorial && <Tutorial onClose={closeTutorial} />}

      {/* PAUSE OVERLAY */}
      {overlay === 'pause' && (
        <div className={styles.overlay}>
          <div className={styles.pausePanel}>
            <div className={styles.pauseIcon}>II</div>
            <h2 className={styles.pauseTitle}>GAME PAUSED</h2>
            <p className={styles.pauseSub}>Level {level.id} - {level.name}</p>
            <div className={styles.pauseButtons}>
              <button className={styles.btnResume} onClick={resume}>
                <span className={styles.btnPlay}>&#9654;</span> RESUME
              </button>
              <button className={styles.btnSecondary} onClick={retry}>RESTART LEVEL</button>
              <button className={styles.btnDanger} onClick={quit}>QUIT TO MAP</button>
            </div>
            <p className={styles.hint}>ESC to resume</p>
          </div>
        </div>
      )}

      {/* VICTORY OVERLAY - Free Fire style */}
      {overlay === 'win' && (
        <div className={styles.overlay}>
          <div className={styles.victoryPanel}>
            <div className={styles.victoryRays} />
            <div className={styles.victoryBurst} />
            <div className={styles.victoryContent}>
              <div className={styles.victoryBadge}>
                <svg viewBox="0 0 60 60" width="60" height="60">
                  <polygon points="30,2 38,22 60,22 42,36 48,58 30,44 12,58 18,36 0,22 22,22" fill="#ffcc00" stroke="#ff8800" strokeWidth="2"/>
                </svg>
              </div>
              <h1 className={styles.victoryTitle}>VICTORY</h1>
              <p className={styles.victoryLevel}>MISSION {level.id} COMPLETE</p>
              <p className={styles.victoryName}>{level.name}</p>

              <div className={styles.statsGrid}>
                <div className={styles.statBox}>
                  <span className={styles.statValue}>{stats.kills}</span>
                  <span className={styles.statLabel}>KILLS</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statValue}>{stats.score}</span>
                  <span className={styles.statLabel}>SCORE</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statValue}>{stats.accuracy}%</span>
                  <span className={styles.statLabel}>ACCURACY</span>
                </div>
              </div>

              <div className={styles.ratingStars}>
                <span className={styles.star}>&#9733;</span>
                <span className={styles.star}>&#9733;</span>
                <span className={`${styles.star} ${stats.kills < 10 ? styles.starDim : ''}`}>&#9733;</span>
              </div>

              <div className={styles.coinReward}>
                <CoinIcon size={18} />
                <span>+{stats.coins} COINS EARNED</span>
              </div>

              <div className={styles.victoryButtons}>
                <button className={styles.btnNext} onClick={nextLevel}>
                  NEXT MISSION <span className={styles.arrow}>&#8594;</span>
                </button>
                <div className={styles.victorySecRow}>
                  <button className={styles.btnSmall} onClick={retry}>REPLAY</button>
                  <button className={styles.btnSmall} onClick={quit}>MAP</button>
                  <button className={styles.btnSmall} onClick={home}>HOME</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DEFEAT OVERLAY - Free Fire style */}
      {overlay === 'lose' && (
        <div className={styles.overlay}>
          <div className={styles.defeatPanel}>
            <div className={styles.defeatRays} />
            <div className={styles.defeatSkull}>
              <svg viewBox="0 0 50 50" width="50" height="50">
                <circle cx="25" cy="22" r="16" fill="none" stroke="#ff2d55" strokeWidth="2"/>
                <circle cx="19" cy="20" r="4" fill="#ff2d55"/>
                <circle cx="31" cy="20" r="4" fill="#ff2d55"/>
                <path d="M18 32 L20 30 L22 32 L24 30 L26 32 L28 30 L30 32 L32 30" fill="none" stroke="#ff2d55" strokeWidth="1.5"/>
              </svg>
            </div>
            <h1 className={styles.defeatTitle}>DEFEATED</h1>
            <p className={styles.defeatMsg}>The horde was too strong.</p>
            <p className={styles.defeatMotivation}>Get back up. Fight harder.</p>

            <div className={styles.defeatStats}>
              <span>Kills: {stats.kills}</span>
              <span>Score: {stats.score}</span>
              <span className={styles.defeatCoins}>+{stats.coins} coins</span>
            </div>

            <div className={styles.defeatButtons}>
              <button className={styles.btnRetry} onClick={retry}>
                TRY AGAIN <span className={styles.arrow}>&#8635;</span>
              </button>
              <div className={styles.defeatSecRow}>
                <button className={styles.btnSmall} onClick={quit}>MAP</button>
                <button className={styles.btnSmall} onClick={home}>HOME</button>
              </div>
            </div>

            <p className={styles.defeatQuote}>"Every death makes you stronger."</p>
          </div>
        </div>
      )}
    </div>
  );
}
