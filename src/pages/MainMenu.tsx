import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { loadData } from '../utils/db';
import ParticleBackground from '../components/ParticleBackground';
import logoSvg from '../assets/logo.svg';
import styles from './MainMenu.module.css';

export default function MainMenu() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [hasSave, setHasSave] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const load = useGameStore((s) => s.load);

  useEffect(() => {
    loadData('gameState', 'progress').then((data) => setHasSave(!!data));
    const timer = setTimeout(() => setIntroComplete(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = useCallback(() => {
    if (!introComplete) setIntroComplete(true);
    setShowMenu(true);
  }, [introComplete]);

  const handleContinue = useCallback(async () => {
    await load();
    navigate('/levels');
  }, [load, navigate]);

  const handleNewGame = useCallback(() => {
    navigate('/character');
  }, [navigate]);

  return (
    <div className={styles.container} onClick={!showMenu ? handleStart : undefined}>
      <ParticleBackground />
      <div className={styles.overlay} />

      {!showMenu ? (
        <div className={`${styles.intro} ${introComplete ? styles.visible : ''}`}>
          <img src={logoSvg} alt="Bloomverse" className={styles.logo} />
          <h1 className={styles.title}>BLOOMVERSE</h1>
          <p className={styles.tagline}>Survive. Fight. Escape.</p>
          <p className={styles.pressStart}>TAP ANYWHERE TO START</p>
        </div>
      ) : (
        <div className={styles.menu}>
          <img src={logoSvg} alt="Bloomverse" className={styles.menuLogo} />
          <h1 className={styles.menuTitle}>BLOOMVERSE</h1>
          <nav className={styles.nav}>
            {hasSave && (
              <button className={styles.menuBtn} onClick={handleContinue}>
                <span className={styles.btnIcon}>&#9654;</span> CONTINUE
              </button>
            )}
            <button className={styles.menuBtn} onClick={handleNewGame}>
              <span className={styles.btnIcon}>&#9733;</span> NEW GAME
            </button>
            <button className={styles.menuBtn} onClick={() => navigate('/archive')}>
              <span className={styles.btnIcon}>&#9783;</span> ARCHIVE
            </button>
            <button className={styles.menuBtn} onClick={() => navigate('/settings')}>
              <span className={styles.btnIcon}>&#9881;</span> SETTINGS
            </button>
            <button className={styles.menuBtn} onClick={() => navigate('/about')}>
              <span className={styles.btnIcon}>&#9432;</span> ABOUT
            </button>
            <button className={styles.menuBtn} onClick={() => navigate('/support')}>
              <span className={styles.btnIcon}>&#9829;</span> SUPPORT
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
