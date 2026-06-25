import { useNavigate } from 'react-router-dom';
import ActionBackground from '../components/ActionBackground';
import styles from './Support.module.css';

const links = [
  {
    label: 'Buy Me A Coffee', url: 'https://buymeacoffee.com/mkr_infinity', desc: 'Fuel development',
    color: '#ffcc00',
    icon: <path d="M4 8h13v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8zm13 0h2a2 2 0 1 1 0 4h-2M5 21h12" />,
  },
  {
    label: 'GitHub', url: 'https://github.com/mkr-infinity', desc: 'View the arsenal',
    color: '#ffffff',
    icon: <path d="M9 19c-4 1.5-4-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.3 2.6 5.3 2.9 5.3 2.9a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 3.9 9.3c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />,
  },
  {
    label: 'Instagram', url: 'https://www.instagram.com/mkr_infinity', desc: 'Follow the mission',
    color: '#ff2d8a',
    icon: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" /></>,
  },
  {
    label: 'Telegram', url: 'https://t.me/mkr_infinity', desc: 'Join the squad',
    color: '#33aaff',
    icon: <path d="M21 4L3 11l6 2 2 6 3-4 4 3z" />,
  },
  {
    label: 'Portfolio', url: 'https://mkr-infinity.github.io', desc: 'Recon more work',
    color: '#00ff88',
    icon: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>,
  },
];

export default function Support() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <ActionBackground />
      <div className={styles.scrim} />

      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')} aria-label="Back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>
        <h1 className={styles.title}>SUPPORT</h1>
        <span className={styles.headTag}>ALLIES</span>
      </div>

      <div className={styles.content}>
        <div className={styles.hero}>
          <div className={styles.heroBadge}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ff5a72" strokeWidth="1.8"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" /></svg>
          </div>
          <h2 className={styles.heading}>JOIN THE FIGHT</h2>
          <p className={styles.subtitle}>Help keep the multiverse alive</p>
        </div>

        <div className={styles.links}>
          {links.map((link) => (
            <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className={styles.card} style={{ ['--c' as string]: link.color }}>
              <span className={styles.icon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{link.icon}</svg>
              </span>
              <span className={styles.cardText}>
                <span className={styles.cardLabel}>{link.label}</span>
                <span className={styles.cardDesc}>{link.desc}</span>
              </span>
              <span className={styles.arrow}>&#8250;</span>
            </a>
          ))}
        </div>

        <p className={styles.footer}>EVERY BIT OF SUPPORT PUSHES THE FRONT LINE FORWARD</p>
      </div>
    </div>
  );
}
