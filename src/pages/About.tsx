import { useNavigate } from 'react-router-dom';
import logoSvg from '../assets/logo.svg';
import ActionBackground from '../components/ActionBackground';
import styles from './About.module.css';

const FEATURES = [
  { val: '3D', label: 'BROWSER ACTION' },
  { val: '∞', label: 'ENDLESS LEVELS' },
  { val: '7', label: 'ARMORY GUNS' },
  { val: '100%', label: 'LOCAL SAVE' },
];

const ENEMIES = [
  { name: 'WALKER', desc: 'Slow but relentless shamblers that swarm in numbers.' },
  { name: 'RUNNER', desc: 'Fast, erratic chargers that close the gap in seconds.' },
  { name: 'TANK', desc: 'Heavily armored brutes that soak up everything you fire.' },
  { name: 'EXPLOSIVE', desc: 'Volatile rushers that detonate on contact — keep your distance.' },
  { name: 'BOSS', desc: 'Apex horrors with massive health pools and devastating hits.' },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <ActionBackground />
      <div className={styles.scrim} />

      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')} aria-label="Back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>
        <h1 className={styles.title}>INTEL</h1>
        <span className={styles.headTag}>CLASSIFIED</span>
      </div>

      <div className={styles.content}>
        <div className={styles.hero}>
          <div className={styles.logoRing}>
            <img src={logoSvg} alt="Bloomverse" className={styles.logo} />
          </div>
          <h2 className={styles.gameName}>BLOOMVERSE</h2>
          <p className={styles.tagline}>SURVIVE &middot; FIGHT &middot; ESCAPE</p>
          <span className={styles.version}>BUILD v1.0.0</span>
        </div>

        <div className={styles.statGrid}>
          {FEATURES.map((f) => (
            <div key={f.label} className={styles.statCard}>
              <span className={styles.statVal}>{f.val}</span>
              <span className={styles.statLabel}>{f.label}</span>
            </div>
          ))}
        </div>

        <section className={styles.panel}>
          <h3 className={styles.panelTitle}><span className={styles.bar} />MISSION BRIEFING</h3>
          <p className={styles.body}>
            Bloomverse is a simple, fast browser-based 3D action survival game. No account,
            no backend, no install required — just enter the arena, survive waves, earn coins,
            and upgrade your loadout.
          </p>
          <p className={styles.body}>
            Your progress is saved directly in this browser with IndexedDB. Continue your run,
            export your save from Settings, or reset anytime — everything stays on your device.
          </p>
        </section>

        <section className={styles.panel}>
          <h3 className={styles.panelTitle}><span className={styles.bar} />HOW IT PLAYS</h3>
          <ul className={styles.list}>
            <li><span className={styles.dot} /> Move with <b>WASD</b>, aim with the mouse, fire, reload and dash.</li>
            <li><span className={styles.dot} /> Use cover, dodge hostile fire and clear every wave to earn <b>coins</b>.</li>
            <li><span className={styles.dot} /> Spend coins in the <b>Armory</b> to unlock guns, gear and operatives.</li>
            <li><span className={styles.dot} /> Runs entirely in the browser with local save and offline-ready PWA support.</li>
          </ul>
        </section>

        <section className={styles.panel}>
          <h3 className={styles.panelTitle}><span className={styles.bar} />KNOWN HOSTILES</h3>
          <div className={styles.enemyList}>
            {ENEMIES.map((e) => (
              <div key={e.name} className={styles.enemyRow}>
                <span className={styles.enemyName}>{e.name}</span>
                <span className={styles.enemyDesc}>{e.desc}</span>
              </div>
            ))}
          </div>
        </section>

        <p className={styles.builtBy}>FORGED BY <span className={styles.accent}>MKR INFINITY</span></p>

        <a
          href="https://github.com/mkr-infinity/bloomverse"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.repoBtn}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.7.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.5 18.3 4.8 18.3 4.8c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" /></svg>
          <span>PROJECT REPOSITORY</span>
        </a>
      </div>
    </div>
  );
}
