import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { LEVELS } from '../game/engine';
import styles from './LevelMap.module.css';

const WORLD_COLORS: Record<string, { bg: string; node: string; glow: string }> = {
  city: { bg: '#1a2332', node: '#4488cc', glow: '#4488cc' },
  desert: { bg: '#2d2210', node: '#cc8833', glow: '#ff9944' },
  frozen: { bg: '#152535', node: '#55bbee', glow: '#88ddff' },
  burning: { bg: '#2d1510', node: '#ff4422', glow: '#ff6644' },
  sky: { bg: '#15152d', node: '#8855ff', glow: '#aa77ff' },
  void: { bg: '#0a0a15', node: '#ff22aa', glow: '#ff44cc' },
};

export default function LevelMap() {
  const navigate = useNavigate();
  const progress = useGameStore((s) => s.progress);
  const maxLevel = progress.maxLevelReached;

  const handleLevel = (id: number) => {
    if (id <= maxLevel) {
      navigate(`/game/${id}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')}>BACK</button>
        <h1 className={styles.title}>SELECT MISSION</h1>
      </div>

      <div className={styles.mapScroll}>
        <div className={styles.path}>
          {LEVELS.map((level, i) => {
            const unlocked = level.id <= maxLevel;
            const current = level.id === maxLevel;
            const colors = WORLD_COLORS[level.world];
            const isLeft = i % 2 === 0;

            return (
              <div key={level.id} className={styles.nodeRow} style={{ justifyContent: isLeft ? 'flex-start' : 'flex-end' }}>
                {i > 0 && (
                  <svg className={styles.connector} viewBox="0 0 200 60" preserveAspectRatio="none">
                    <path
                      d={isLeft ? 'M 160 0 Q 100 30 40 60' : 'M 40 0 Q 100 30 160 60'}
                      fill="none"
                      stroke={unlocked ? colors.node : '#333'}
                      strokeWidth="3"
                      strokeDasharray={unlocked ? 'none' : '6 4'}
                      opacity={unlocked ? 0.6 : 0.3}
                    />
                  </svg>
                )}
                <button
                  className={`${styles.node} ${unlocked ? styles.unlocked : styles.locked} ${current ? styles.current : ''}`}
                  style={{
                    '--node-color': colors.node,
                    '--node-glow': colors.glow,
                  } as React.CSSProperties}
                  onClick={() => handleLevel(level.id)}
                  disabled={!unlocked}
                >
                  <span className={styles.nodeNum}>{level.id}</span>
                  <span className={styles.nodeName}>{level.name}</span>
                  {!unlocked && <span className={styles.lock}>&#128274;</span>}
                  {current && <span className={styles.currentBadge}>NEXT</span>}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
