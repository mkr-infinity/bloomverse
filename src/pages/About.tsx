import { useNavigate } from 'react-router-dom';
import logoSvg from '../assets/logo.svg';
import styles from './About.module.css';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <h1 className={styles.title}>ABOUT</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.hero}>
          <img src={logoSvg} alt="Bloomverse" className={styles.logo} />
          <h2 className={styles.gameName}>BLOOMVERSE</h2>
          <p className={styles.tagline}>Survive. Fight. Escape.</p>
          <p className={styles.version}>Version 1.0.0</p>
        </div>

        <div className={styles.description}>
          <p>
            A single-player action survival game set in a collapsing multiverse.
            Fight through waves of enemies across distorted worlds, upgrade your arsenal,
            and escape the void.
          </p>
        </div>

        <div className={styles.credits}>
          <p className={styles.builtBy}>Built by <span className={styles.accent}>MKR Infinity</span></p>
        </div>

        <div className={styles.links}>
          <a href="https://github.com/mkr-infinity/bloomverse" target="_blank" rel="noopener noreferrer" className={styles.link}>
            <span className={styles.linkLabel}>Project Repository</span>
            <span className={styles.linkUrl}>github.com/mkr-infinity/bloomverse</span>
          </a>
          <a href="https://github.com/mkr-infinity/bloomverse/issues" target="_blank" rel="noopener noreferrer" className={styles.link}>
            <span className={styles.linkLabel}>Report Issues</span>
            <span className={styles.linkUrl}>Submit bug reports</span>
          </a>
          <a href="https://github.com/mkr-infinity/bloomverse/issues/new" target="_blank" rel="noopener noreferrer" className={styles.link}>
            <span className={styles.linkLabel}>Request Features</span>
            <span className={styles.linkUrl}>Suggest new ideas</span>
          </a>
          <a href="https://github.com/mkr-infinity/bloomverse#contributing" target="_blank" rel="noopener noreferrer" className={styles.link}>
            <span className={styles.linkLabel}>Contribute</span>
            <span className={styles.linkUrl}>Help build Bloomverse</span>
          </a>
        </div>
      </div>
    </div>
  );
}
