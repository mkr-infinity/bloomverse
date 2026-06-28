import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { getLevel, getLevelInfo, BASE_LEVEL_COUNT } from '../game/engine';
import CoinIcon from '../components/CoinIcon';
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
  const [focusedId, setFocusedId] = useState(maxLevel);
  const nodeRefs = useRef<Record<number, HTMLButtonElement | null>>({});

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

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') { navigate('/'); return; }
      if (e.code === 'ArrowRight' || e.code === 'ArrowDown') {
        setFocusedId((prev) => { const next = Math.min(maxLevel, prev + 1); nodeRefs.current[next]?.focus(); return next; });
        e.preventDefault();
      }
      if (e.code === 'ArrowLeft' || e.code === 'ArrowUp') {
        setFocusedId((prev) => { const next = Math.max(1, prev - 1); nodeRefs.current[next]?.focus(); return next; });
        e.preventDefault();
      }
      if (e.code === 'Enter') { play(focusedId); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedId, maxLevel, navigate]);

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
        <div className={styles.headerRight}>
          <button className={styles.backBtn} onClick={() => navigate('/armory')} aria-label="Armory" title="Armory">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l9-8 9 8M5 10v10h14V10M9 21v-6h6v6"/></svg>
          </button>
          <div className={styles.coinBalance}><CoinIcon size={15} />{progress.coins || 0}</div>
          <div className={styles.headerBadge}>LV {maxLevel}</div>
        </div>
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
                const info = getLevelInfo(lvl.id);
                return (
                  <div key={lvl.id} className={styles.nodeWrap}>
                    <div className={styles.connector} />
                    <button
                      className={`${styles.node} ${done ? styles.done : ''} ${current ? styles.current : ''} ${!unlocked ? styles.locked : ''} ${info.hasBoss ? styles.boss : ''} ${focusedId === lvl.id ? styles.focused : ''}`}
                      onClick={() => { setFocusedId(lvl.id); play(lvl.id); }}
                      disabled={!unlocked}
                      ref={(el) => { nodeRefs.current[lvl.id] = el; }}
                    >
                      {done ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                      ) : !unlocked ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
                      ) : (
                        <span className={styles.nodeNum}>{lvl.id}</span>
                      )}
                      {current && <span className={styles.pingRing} />}
                      {info.hasBoss && unlocked && <span className={styles.bossStar}>&#9733;</span>}
                    </button>
                    <div className={styles.nodeInfo}>
                      <div className={styles.nodeTopRow}>
                        <span className={styles.nodeLvl}>LEVEL {lvl.id}</span>
                        <span className={`${styles.diffTag} ${styles['diff_' + info.difficulty]}`}>{info.difficulty}</span>
                      </div>
                      <span className={`${styles.nodeName} ${unlocked ? styles.nameVisible : ''}`}>{lvl.name}</span>
                      <div className={styles.nodeMeta}>
                        <span className={styles.metaEnemies}>{info.enemyCount} hostiles</span>
                        <span className={styles.metaReward}><CoinIcon size={11} />{info.reward}</span>
                      </div>
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
