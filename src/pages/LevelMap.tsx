import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { getLevel, BASE_LEVEL_COUNT } from '../game/engine';
import styles from './LevelMap.module.css';

const WORLD_LABEL: Record<string, string> = {
  city: 'ABANDONED CITY',
  desert: 'DESERT RUINS',
  frozen: 'FROZEN ZONE',
  burning: 'BURNING COLLAPSE',
  sky: 'SKY FRAGMENTS',
  void: 'DARK VOID',
};

interface Segment {
  world: string;
  levels: { id: number; name: string }[];
}

export default function LevelMap() {
  const navigate = useNavigate();
  const progress = useGameStore((s) => s.progress);
  const load = useGameStore((s) => s.load);
  const maxLevel = progress.maxLevelReached;

  useEffect(() => { load(); }, [load]);

  // Endless: always render a buffer past the furthest reached level.
  const total = Math.max(BASE_LEVEL_COUNT, maxLevel + 4);

  const segments = useMemo<Segment[]>(() => {
    const segs: Segment[] = [];
    for (let id = 1; id <= total; id++) {
      const lvl = getLevel(id);
      const last = segs[segs.length - 1];
      if (last && last.world === lvl.world) {
        last.levels.push({ id: lvl.id, name: lvl.name });
      } else {
        segs.push({ world: lvl.world, levels: [{ id: lvl.id, name: lvl.name }] });
      }
    }
    return segs;
  }, [total]);

  const play = (id: number) => { if (id <= maxLevel) navigate(`/game/${id}`); };

  return (
    <div className={styles.world}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/')} aria-label="Back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div className={styles.headerCenter}>
          <h1 className={styles.headerTitle}>THE MULTIVERSE</h1>
          <p className={styles.headerSub}>Endless mission map</p>
        </div>
        <div className={styles.headerBadge}>LV {maxLevel}</div>
      </div>

      {/* Scrollable themed journey */}
      <div className={styles.scroll}>
        {segments.map((seg, si) => (
          <section key={si} className={`${styles.biome} ${styles['biome_' + seg.world]}`}>
            {/* Scenery layers */}
            <div className={styles.sky} />
            <div className={styles.horizon} />
            <div className={styles.skyline} />
            <div className={styles.ground} />
            <div className={styles.haze} />

            <span className={styles.biomeLabel}>{WORLD_LABEL[seg.world] || seg.world}</span>

            <div className={styles.nodes}>
              {seg.levels.map((lvl) => {
                const unlocked = lvl.id <= maxLevel;
                const done = lvl.id < maxLevel;
                const current = lvl.id === maxLevel;
                return (
                  <div key={lvl.id} className={styles.nodeWrap}>
                    <div className={styles.connector} />
                    <button
                      className={`${styles.node} ${done ? styles.done : ''} ${current ? styles.current : ''} ${!unlocked ? styles.locked : ''}`}
                      onClick={() => play(lvl.id)}
                      disabled={!unlocked}
                    >
                      {done ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                      ) : !unlocked ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
                      ) : (
                        <span className={styles.nodeNum}>{lvl.id}</span>
                      )}
                      {current && <span className={styles.pingRing} />}
                    </button>
                    <div className={styles.nodeInfo}>
                      <span className={styles.nodeLvl}>LEVEL {lvl.id}</span>
                      <span className={`${styles.nodeName} ${unlocked ? styles.nameVisible : ''}`}>{lvl.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
        <div className={styles.endNote}>More worlds collapse ahead... survive to unlock them.</div>
      </div>
    </div>
  );
}
