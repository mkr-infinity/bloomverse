import { useEffect, useState } from 'react';
import styles from './LoadingScreen.module.css';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + Math.random() * 15;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.core}>
        <svg className={styles.logo} viewBox="0 0 100 100" width="80" height="80">
          <circle cx="50" cy="50" r="30" fill="none" stroke="#ff2d55" strokeWidth="2" opacity="0.5" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="#00ff88" strokeWidth="1.5" opacity="0.7">
            <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="50" cy="50" r="8" fill="#ff2d55">
            <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
      <div className={styles.barContainer}>
        <div className={styles.bar} style={{ width: `${Math.min(progress, 100)}%` }} />
      </div>
      <p className={styles.text}>LOADING BLOOMVERSE</p>
    </div>
  );
}
