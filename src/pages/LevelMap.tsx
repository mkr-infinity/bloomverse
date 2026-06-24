import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { LEVELS } from '../game/engine';
import styles from './LevelMap.module.css';

export default function LevelMap() {
  const navigate = useNavigate();
  const progress = useGameStore((s) => s.progress);
  const load = useGameStore((s) => s.load);
  const maxLevel = progress.maxLevelReached;

  useEffect(() => { load(); }, [load]);

  const play = (id: number) => { if (id <= maxLevel) navigate(`/game/${id}`); };

  return (
    <div className={styles.world}>
      {/* Scenic background layers */}
      <div className={styles.skyLayer} />
      <div className={styles.mountainLayer} />
      <div className={styles.cityLayer} />
      <div className={styles.fogLayer} />

      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div className={styles.headerCenter}>
          <h1 className={styles.headerTitle}>THE MULTIVERSE</h1>
          <p className={styles.headerSub}>Choose your mission</p>
        </div>
        <div className={styles.headerBadge}>{maxLevel - 1}/{LEVELS.length}</div>
      </div>

      {/* Level path */}
      <div className={styles.scroll}>
        <div className={styles.pathWrap}>
          {/* Decorative path line */}
          <svg className={styles.pathSvg} viewBox="0 0 360 1500" preserveAspectRatio="none">
            <path d="M180 20 C100 100 260 180 180 260 C100 340 260 420 180 500 C100 580 260 660 180 740 C100 820 260 900 180 980 C100 1060 260 1140 180 1220 C100 1300 260 1380 180 1460" fill="none" stroke="rgba(255,200,100,0.15)" strokeWidth="4" strokeDasharray="8 6"/>
          </svg>

          {LEVELS.map((level, i) => {
            const unlocked = level.id <= maxLevel;
            const done = level.id < maxLevel;
            const current = level.id === maxLevel;
            const xPos = 50 + Math.sin(i * 0.55) * 25;

            return (
              <div key={level.id} className={styles.nodeWrap} style={{ left: `${xPos}%` }}>
                <button
                  className={`${styles.node} ${done ? styles.done : ''} ${current ? styles.current : ''} ${!unlocked ? styles.locked : ''}`}
                  onClick={() => play(level.id)}
                  disabled={!unlocked}
                >
                  {done ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                  ) : (
                    <span className={styles.nodeNum}>{level.id}</span>
                  )}
                </button>
                {current && <div className={styles.currentGlow} />}
                <span className={`${styles.nodeName} ${unlocked ? styles.nameVisible : ''}`}>{level.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
