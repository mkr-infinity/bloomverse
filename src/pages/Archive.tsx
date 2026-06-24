import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import styles from './Archive.module.css';

export default function Archive() {
  const navigate = useNavigate();
  const progress = useGameStore((s) => s.progress);
  const [loaded, setLoaded] = useState(false);
  const load = useGameStore((s) => s.load);

  useEffect(() => {
    load().then(() => setLoaded(true));
  }, [load]);

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const formatDate = (ts: number) => ts ? new Date(ts).toLocaleDateString() : 'N/A';

  const stats = [
    { label: 'First Play', value: formatDate(progress.firstPlayDate) },
    { label: 'Total Play Time', value: formatTime(progress.playTime) },
    { label: 'Levels Completed', value: `${progress.maxLevelReached - 1}` },
    { label: 'Total Kills', value: `${progress.totalKills}` },
    { label: 'Total Deaths', value: `${progress.totalDeaths}` },
    { label: 'Bosses Defeated', value: `${progress.bossesDefeated}` },
    { label: 'Highest Level', value: `${progress.maxLevelReached}` },
  ];

  if (!loaded) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <h1 className={styles.title}>ARCHIVE</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.grid}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.card}>
              <span className={styles.cardValue}>{stat.value}</span>
              <span className={styles.cardLabel}>{stat.label}</span>
            </div>
          ))}
        </div>

        {progress.achievements.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>ACHIEVEMENTS</h2>
            <div className={styles.achievements}>
              {progress.achievements.map((a) => (
                <div key={a} className={styles.achievement}>{a}</div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
