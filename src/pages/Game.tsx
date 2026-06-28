import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { getLevel, createGameState, tick, GameState } from '../game/engine';
import { render as render2D, drawHUDLayer, addDmgNum } from '../game/renderer';
import { GameScene3D } from '../game/three/scene';
import { createInput } from '../game/input';
import { CHARACTERS } from '../game/characters';
import { buildLoadout } from '../game/weapons';
import { getControlBindings, isActionKey } from '../game/controls';
import { playSound, unlockAudio } from '../game/audio';
import Tutorial from '../components/Tutorial';
import CoinIcon from '../components/CoinIcon';
import styles from './Game.module.css';

export default function Game() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);      // WebGL world
  const hudRef = useRef<HTMLCanvasElement>(null);          // 2D HUD overlay
  const stateRef = useRef<GameState | null>(null);
  const inputRef = useRef<ReturnType<typeof createInput> | null>(null);
  const sceneRef = useRef<GameScene3D | null>(null);
  const animRef = useRef(0);
  const { progress, updateProgress, save, addCoins } = useGameStore();
  const [overlay, setOverlay] = useState<'none' | 'pause' | 'win' | 'lose'>('none');
  const [stats, setStats] = useState({ kills: 0, score: 0, accuracy: 0, coins: 0 });
  const overlayRef = useRef<'none' | 'pause' | 'win' | 'lose'>('none');
  const [killFeed, setKillFeed] = useState<Array<{ id: number; type: string }>>([]);
  const killFeedIdRef = useRef(0);
  const [showControlsHint, setShowControlsHint] = useState(true);
  const audioStatsRef = useRef({ ammo: -1, enemyBullets: 0, kills: 0, health: -1, pickups: 0, reloadTimer: 0 });
  const [showTutorial, setShowTutorial] = useState(() => {
    return !localStorage.getItem('bloomverse_tutorial_done');
  });

  const lvlId = Math.max(1, parseInt(levelId || '1') || 1);
  const level = getLevel(lvlId);
  const charId = progress.selectedCharacter || 'ghost';
  const skin = CHARACTERS.find((c) => c.id === charId) || CHARACTERS[0];

  // Build the active loadout from the equipped weapon + owned gear (read fresh
  // from the store so purchases made before a run always apply).
  const makeLoadout = () => {
    const p = useGameStore.getState().progress;
    return buildLoadout(p.equippedWeapon || 'pistol', p.ownedGear || []);
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const hud = hudRef.current!;
    const ctx = hud.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    hud.width = window.innerWidth;
    hud.height = window.innerHeight;
    canvas.style.cursor = 'none';
    const unlock = () => unlockAudio();
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });

    let scene: GameScene3D | null = null;
    try {
      scene = new GameScene3D(canvas, level, skin);
    } catch (err) {
      console.error('WebGL initialization failed, falling back to 2D:', err);
      // If WebGL fails, the game still runs via the 2D HUD canvas below
    }
    sceneRef.current = scene;
    const has3D = !!scene;

    inputRef.current = createInput(canvas);
    stateRef.current = createGameState(canvas.width, canvas.height, level, makeLoadout());

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      hud.width = window.innerWidth;
      hud.height = window.innerHeight;
      sceneRef.current?.onResize();
    };
    window.addEventListener('resize', onResize);

    // Fixed-timestep accumulator: physics runs at a constant rate so the game
    // plays identically on 60/120/144 Hz displays (fixes the old speed bug).
    const FIXED_DT = 1000 / 60;
    let last = performance.now();
    let acc = 0;

    const loop = (now: number) => {
      if (!stateRef.current || !inputRef.current) return;
      const w = canvas.width, h = canvas.height;

      // Advance simulation in fixed steps
      let frameDt = now - last;
      last = now;
      if (frameDt > 250) frameDt = 250; // avoid spiral-of-death after tab blur
      acc += frameDt;
      const gs = stateRef.current;
      if (!gs.paused && !gs.gameOver && !gs.levelComplete) {
        // Project raw mouse through the 3D camera onto the ground plane so aim
        // is accurate at any perspective angle. Falls back to raw coords in 2D mode.
        const rawMX = inputRef.current.state.mouseX;
        const rawMY = inputRef.current.state.mouseY;
        let aimX = rawMX, aimY = rawMY;
        if (scene) {
          const pt = scene.getAimPoint(rawMX, rawMY, w, h);
          if (pt) { aimX = pt.x; aimY = pt.y; }
        }
        const tickInput = { ...inputRef.current.state, mouseX: aimX, mouseY: aimY };
        while (acc >= FIXED_DT) {
          stateRef.current = tick(stateRef.current, tickInput, w, h, level);
          acc -= FIXED_DT;
        }
      } else {
        acc = 0;
      }

      // Camera shake amplitude from engine state drives a small render offset
      if (scene) {
        try {
          scene.update(stateRef.current, w, h, frameDt / 1000);
          scene.render();
        } catch {
          // if 3D rendering fails mid-frame, continue with 2D only
        }
      }

      emitGameplayAudio(stateRef.current);

      // Damage numbers + kill feed from hit events
      const hitEvts = stateRef.current.hitEvents;
      if (hitEvts.length > 0) {
        const kills: Array<{ id: number; type: string }> = [];
        for (const evt of hitEvts) {
          addDmgNum(evt.x, evt.y, evt.damage, evt.damage >= 40);
          if (evt.killed && evt.killedType) {
            kills.push({ id: killFeedIdRef.current++, type: evt.killedType });
          }
        }
        if (kills.length > 0) {
          setKillFeed((prev) => [...kills, ...prev].slice(0, 5));
        }
      }

      // HUD overlay (or full 2D fallback if no 3D)
      ctx.clearRect(0, 0, w, h);
      if (!has3D) {
        try { render2D(ctx, stateRef.current, w, h, level, skin); } catch { /* skip frame */ }
      } else {
        drawHUDLayer(ctx, stateRef.current, w, h);
      }

      // Mouse cursor crosshair drawn at actual screen position
      if (inputRef.current) {
        const mx = inputRef.current.state.mouseX;
        const my = inputRef.current.state.mouseY;
        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.arc(mx, my, 7, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mx - 12, my); ctx.lineTo(mx - 4, my);
        ctx.moveTo(mx + 4, my);  ctx.lineTo(mx + 12, my);
        ctx.moveTo(mx, my - 12); ctx.lineTo(mx, my - 4);
        ctx.moveTo(mx, my + 4);  ctx.lineTo(mx, my + 12);
        ctx.stroke();
        ctx.restore();
      }

      if (stateRef.current.levelComplete && overlayRef.current === 'none') {
        const s = stateRef.current;
        const coins = level.id * 40 + s.kills * 4 + Math.floor(s.score / 20);
        setStats({ kills: s.kills, score: s.score, accuracy: s.ammo > 0 ? Math.round((s.kills / Math.max(1, 30 - s.ammo + s.kills)) * 100) : 100, coins });
        overlayRef.current = 'win';
        setOverlay('win');
        playSound('victory');
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
        playSound('defeat');
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
      sceneRef.current?.dispose();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resume = useCallback(() => { overlayRef.current = 'none'; setOverlay('none'); if (stateRef.current) stateRef.current.paused = false; }, []);
  const retry = useCallback(() => {
    const canvas = canvasRef.current!;
    stateRef.current = createGameState(canvas.width, canvas.height, level, makeLoadout());
    overlayRef.current = 'none';
    setOverlay('none');
  }, [level]);
  const nextLevel = useCallback(() => {
    const nxt = level.id + 1;
    navigate(`/game/${nxt}`, { replace: true });
    const canvas = canvasRef.current!;
    stateRef.current = createGameState(canvas.width, canvas.height, getLevel(nxt), makeLoadout());
    overlayRef.current = 'none';
    setOverlay('none');
  }, [level.id, navigate]);
  const quit = useCallback(() => navigate('/levels'), [navigate]);
  const home = useCallback(() => navigate('/'), [navigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const bindings = getControlBindings();
      if (isActionKey(bindings, 'pause', e.code)) {
        if (overlay === 'none') { setOverlay('pause'); if (stateRef.current) stateRef.current.paused = true; }
        else if (overlay === 'pause') { resume(); }
        return;
      }
      if (overlay === 'pause') {
        if (e.code === 'Enter' || e.code === 'Space') { e.preventDefault(); resume(); }
        else if (e.code === 'KeyR') retry();
        else if (e.code === 'KeyQ') quit();
      }
      if (overlay === 'win') {
        if (e.code === 'Enter' || e.code === 'KeyN') nextLevel();
        else if (e.code === 'KeyR') retry();
        else if (e.code === 'KeyQ') quit();
      }
      if (overlay === 'lose') {
        if (e.code === 'Enter' || e.code === 'KeyR') retry();
        else if (e.code === 'KeyQ') quit();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [overlay, resume, retry, nextLevel, quit]);

  const closeTutorial = useCallback(() => {
    localStorage.setItem('bloomverse_tutorial_done', '1');
    setShowTutorial(false);
  }, []);

  // Auto-dismiss controls hint after 6 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowControlsHint(false), 6000);
    return () => clearTimeout(t);
  }, []);

  const emitGameplayAudio = (s: GameState) => {
    const prev = audioStatsRef.current;
    if (prev.ammo < 0) {
      audioStatsRef.current = { ammo: s.ammo, enemyBullets: s.enemyBullets.length, kills: s.kills, health: s.playerHealth, pickups: s.pickups.length, reloadTimer: s.reloadTimer };
      return;
    }
    if (s.ammo < prev.ammo && s.reloadTimer <= 0) playSound('shoot');
    if (s.enemyBullets.length > prev.enemyBullets) playSound('enemyShoot');
    if (s.kills > prev.kills) playSound('hit');
    if (s.playerHealth < prev.health) playSound('damage');
    if (s.pickups.length < prev.pickups) playSound('pickup');
    if (prev.reloadTimer <= 0 && s.reloadTimer > 0) playSound('reloadStart');
    if (prev.reloadTimer > 0 && s.reloadTimer <= 0) playSound('reloadDone');
    audioStatsRef.current = { ammo: s.ammo, enemyBullets: s.enemyBullets.length, kills: s.kills, health: s.playerHealth, pickups: s.pickups.length, reloadTimer: s.reloadTimer };
  };

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <canvas ref={hudRef} className={styles.hud} />

      {/* Kill feed — top right, below enemy count */}
      {killFeed.length > 0 && (
        <div className={styles.killFeed}>
          {killFeed.map((k) => (
            <div key={k.id} className={styles.killEntry}>
              <span className={styles.killIcon}>✕</span>
              <span className={styles.killType}>{k.type.toUpperCase()}</span>
              <span className={styles.killEliminatedLabel}>ELIMINATED</span>
            </div>
          ))}
        </div>
      )}

      {/* Controls hint — fades after 6s */}
      {showControlsHint && overlay === 'none' && (
        <div className={styles.controlsHint} onClick={() => setShowControlsHint(false)}>
          <span><kbd>WASD</kbd> Move</span>
          <span><kbd>Mouse</kbd> Aim</span>
          <span><kbd>Click</kbd> Shoot</span>
          <span><kbd>R</kbd> / <kbd>Right-click</kbd> Reload</span>
          <span><kbd>Shift</kbd> Dash</span>
        </div>
      )}

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
            <div className={styles.keyHints}>
              <span><kbd>ESC</kbd> Resume</span>
              <span><kbd>R</kbd> Restart</span>
              <span><kbd>Q</kbd> Quit</span>
            </div>
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
                <div className={styles.keyHints}>
                  <span><kbd>ENTER</kbd> Next</span>
                  <span><kbd>R</kbd> Replay</span>
                  <span><kbd>Q</kbd> Map</span>
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
              <div className={styles.keyHints}>
                <span><kbd>ENTER</kbd> Retry</span>
                <span><kbd>Q</kbd> Map</span>
              </div>
            </div>

            <p className={styles.defeatQuote}>"Every death makes you stronger."</p>
          </div>
        </div>
      )}
    </div>
  );
}
