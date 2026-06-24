import { useNavigate } from 'react-router-dom';
import styles from './Support.module.css';

const links = [
  { label: 'Buy Me A Coffee', url: 'https://buymeacoffee.com/mkr_infinity', desc: 'Support development' },
  { label: 'GitHub', url: 'https://github.com/mkr-infinity', desc: 'View projects' },
  { label: 'Instagram', url: 'https://www.instagram.com/mkr_infinity', desc: 'Follow updates' },
  { label: 'Telegram', url: 'https://t.me/mkr_infinity', desc: 'Join community' },
  { label: 'Portfolio', url: 'https://mkr-infinity.github.io', desc: 'See more work' },
];

export default function Support() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')}>BACK</button>
        <h1 className={styles.title}>SUPPORT</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.hero}>
          <h2 className={styles.heading}>Support Bloomverse</h2>
          <p className={styles.subtitle}>Help keep the multiverse alive</p>
        </div>

        <div className={styles.links}>
          {links.map((link) => (
            <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className={styles.card}>
              <span className={styles.cardLabel}>{link.label}</span>
              <span className={styles.cardDesc}>{link.desc}</span>
              <span className={styles.arrow}>&#8594;</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
