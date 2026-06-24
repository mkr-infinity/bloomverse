import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { getLevel } from '../game/engine';
import { CHARACTERS } from '../game/characters';
import CoinIcon from '../components/CoinIcon';
import styles from './Archive.module.css';

const WORLD_LABEL: Record<string, string> = {
  city: 'Abandoned City', desert: 'Desert Ruins', frozen: 'Frozen Zone',
  burning: 'Burning Collapse', sky: 'Sky Fragments', void: 'Dark Void',
};

export default function Archive() {
  const navigate = useNavigate();
  const progress = useGameStore((s) => s.progress);
  const [loaded, setLoaded] = useState(false);
  const load = useGameStore((s) => s.load);

  useEffect(() => { load().then(() => setLoaded(true)); }, [load]);

  if (!loaded) return null;

  const formatDate = (ts: number) => ts ? new Date(ts).toLocaleDateString() : 'N/A';
  const cleared = Math.max(0, progress.maxLevelReached - 1);
  const owned = (progress.unlockedCharacters || ['ghost']);
  const activeChar = CHARACTERS.find((c) => c.id === progress.selectedCharacter) || CHARACTERS[0];
  const world = getLevel(progress.maxLevelReached).world;
  const winRate = (cleared + progress.totalDeaths) > 0
    ? Math.round((cleared / (cleared + progress.totalDeaths)) * 100) : 0;
  const kd = progress.totalDeaths > 0 ? (progress.totalKills / progress.totalDeaths).toFixed(2) : `${progress.totalKills}`;
  const avgKills = cleared > 0 ? Math.round(progress.totalKills / cleared) : progress.totalKills;

  const stats = [
    { label: 'Highest Level', value: `${progress.maxLevelReached}`, accent: '#ff6b2d' },
    { label: 'Missions Cleared', value: `${cleared}`, accent: '#00ff88' },
    { label: 'Total Kills', value: `${progress.totalKills}`, accent: '#ff2d55' },
    { label: 'Total Deaths', value: `${progress.totalDeaths}`, accent: '#8a8a9a' },
    { label: 'K/D Ratio', value: `${kd}`, accent: '#00d4ff' },
    { label: 'Win Rate', value: `${winRate}%`, accent: '#00ff88' },
    { label: 'Bosses Slain', value: `${progress.bossesDefeated}`, accent: '#b14aff' },
    { label: 'Avg Kills / Run', value: `${avgKills}`, accent: '#ffcc00' },
    { label: 'Operatives', value: `${owned.length} / ${CHARACTERS.length}`, accent: '#00d4ff' },
    { label: 'Current World', value: WORLD_LABEL[world] || world, accent: '#ff6b2d' },
    { label: 'Achievements', value: `${progress.achievements.length}`, accent: '#ffcc00' },
    { label: 'First Deployed', value: formatDate(progress.firstPlayDate), accent: '#8a8a9a' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')} aria-label="Back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <h1 className={styles.title}>ARCHIVE</h1>
      </div>

      <div className={styles.content}>
        {/* Summary banner */}
        <div className={styles.banner}>
          <div className={styles.bannerLeft}>
            <span className={styles.bannerLabel}>ACTIVE OPERATIVE</span>
            <span className={styles.bannerName} style={{ color: activeChar.accent }}>{activeChar.name}</span>
            <span className={styles.bannerRole}>{activeChar.role} &middot; {activeChar.rarity}</span>
          </div>
          <div className={styles.bannerRight}>
            <div className={styles.coinPill}><CoinIcon size={20} /><span>{progress.coins || 0}</span></div>
            <span className={styles.bannerLabel}>COIN BALANCE</span>
          </div>
        </div>

        <div className={styles.grid}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.card} style={{ borderTopColor: stat.accent }}>
              <span className={styles.cardValue} style={{ color: stat.accent }}>{stat.value}</span>
              <span className={styles.cardLabel}>{stat.label}</span>
            </div>
          ))}
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>OPERATIVE ROSTER</h2>
          <div className={styles.roster}>
            {CHARACTERS.map((c) => {
              const unlocked = c.price === 0 || owned.includes(c.id);
              return (
                <div key={c.id} className={`${styles.rosterItem} ${unlocked ? '' : styles.rosterLocked}`}>
                  <span className={styles.rosterName} style={unlocked ? { color: c.accent } : undefined}>{c.name}</span>
                  <span className={styles.rosterStatus}>{unlocked ? 'OWNED' : `LOCKED`}</span>
                </div>
              );
            })}
          </div>
        </section>

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
