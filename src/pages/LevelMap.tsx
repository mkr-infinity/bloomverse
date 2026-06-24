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

  const handleLevel = (id: number) => {
    if (id <= maxLevel) navigate(`/game/${id}`);
  };

  const worldNames: Record<string, string> = {
    city: 'ABANDONED CITY', desert: 'DESERT RUINS', frozen: 'FROZEN ZONE',
    burning: 'BURNING COLLAPSE', sky: 'SKY FRAGMENTS', void: 'DARK VOID',
  };

  const worldColors: Record<string, string> = {
    city: '#4488cc', desert: '#cc8833', frozen: '#55bbee',
    burning: '#ff4422', sky: '#8855ff', void: '#ff22aa',
  };

  // Group levels by world
  let lastWorld = '';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className={styles.title}>MISSIONS</h1>
        <div className={styles.progress}>
          <span className={styles.progressText}>{maxLevel - 1}/{LEVELS.length}</span>
        </div>
      </div>

      <div className={styles.mapScroll}>
        <div className={styles.pathContainer}>
          {LEVELS.map((level, i) => {
            const unlocked = level.id <= maxLevel;
            const completed = level.id < maxLevel;
            const current = level.id === maxLevel;
            const color = worldColors[level.world];
            const showWorldLabel = level.world !== lastWorld;
            lastWorld = level.world;
            const isLeft = Math.floor(i / 2) % 2 === 0;
            const offset = isLeft ? (i % 2 === 0 ? '15%' : '45%') : (i % 2 === 0 ? '55%' : '25%');

            return (
              <div key={level.id}>
                {showWorldLabel && (
                  <div className={styles.worldBanner} style={{ borderColor: color }}>
                    <span style={{ color }}>{worldNames[level.world]}</span>
                  </div>
                )}
                <div className={styles.nodeWrapper} style={{ marginLeft: offset }}>
                  {i > 0 && (
                    <div className={styles.pathLine} style={{
                      background: completed ? color : '#2a2a3a'
                    }} />
                  )}
                  <button
                    className={`${styles.node} ${completed ? styles.completed : ''} ${current ? styles.current : ''} ${!unlocked ? styles.locked : ''}`}
                    style={{ '--c': color } as React.CSSProperties}
                    onClick={() => handleLevel(level.id)}
                    disabled={!unlocked}
                  >
                    {completed && <div className={styles.checkmark}>&#10003;</div>}
                    {current && <div className={styles.currentPulse} />}
                    <span className={styles.nodeId}>{level.id}</span>
                  </button>
                  <span className={styles.nodeName} style={{ color: unlocked ? '#ccc' : '#555' }}>
                    {level.name}
                  </span>
                </div>
              </div>
            );
          })}
          <div className={styles.endBadge}>
            <span>THE VOID AWAITS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
