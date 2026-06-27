import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { loadData } from '../utils/db';
import ActionBackground from '../components/ActionBackground';
import logoSvg from '../assets/logo.svg';
import styles from './MainMenu.module.css';

export default function MainMenu() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [hasSave, setHasSave] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const load = useGameStore((s) => s.load);
  const reset = useGameStore((s) => s.reset);

  useEffect(() => {
    loadData('gameState', 'progress').then((data) => setHasSave(!!data));
    const timer = setTimeout(() => setIntroComplete(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = useCallback(() => {
    setIntroComplete(true);
    setShowMenu(true);
  }, []);

  const handleContinue = useCallback(async () => {
    await load();
    navigate('/levels');
  }, [load, navigate]);

  const handleNewGame = useCallback(() => {
    reset();
    navigate('/character');
  }, [reset, navigate]);

  return (
    <div className={styles.container} onClick={!showMenu ? handleStart : undefined}>
      <ActionBackground />
      <div className={styles.grade} />
      <div className={styles.scanline} />

      {!showMenu ? (
        <div className={`${styles.intro} ${introComplete ? styles.visible : ''}`}>
          <div className={styles.logoWrap}>
            <div className={styles.logoRing} />
            <div className={styles.logoRing2} />
            <img src={logoSvg} alt="Bloomverse" className={styles.logo} />
          </div>
          <h1 className={styles.title}>
            {'BLOOMVERSE'.split('').map((c, i) => (
              <span key={i} className={styles.titleChar}>{c}</span>
            ))}
          </h1>
          <p className={styles.tagline}>SURVIVE &middot; FIGHT &middot; ESCAPE</p>
          <div className={styles.bootMeta}>
            <span>3D BROWSER BUILD</span>
            <span>LOCAL SAVE</span>
            <span>OFFLINE READY</span>
          </div>

          <div className={styles.pressStart}>
            <div className={styles.tapBtn}>
              <span className={styles.tapPulse} />
              <span className={styles.pressText}>ENTER BLOOMVERSE</span>
            </div>
          </div>
          <p className={styles.studio}>MKR INFINITY PRESENTS</p>
        </div>
      ) : (
        <div className={styles.menu}>
          <div className={styles.menuHeader}>
            <img src={logoSvg} alt="Bloomverse" className={styles.menuLogo} />
            <div>
              <h1 className={styles.menuTitle}>BLOOMVERSE</h1>
              <p className={styles.menuSub}>3D BROWSER SURVIVAL &middot; SAVES LOCALLY</p>
            </div>
          </div>
          <div className={styles.statusStrip}>
            <span>READY TO DEPLOY</span>
            <span>NO LOGIN</span>
            <span>INDEXEDDB SAVE</span>
          </div>
          <nav className={styles.nav}>
            {hasSave && (
              <button className={`${styles.menuBtn} ${styles.continueBtn}`} onClick={handleContinue}>
                <div className={styles.btnLeft}>
                  <span className={styles.btnIcon}>&#9654;</span>
                  <span className={styles.btnText}>CONTINUE</span>
                </div>
                <span className={styles.btnArrow}>&#8250;</span>
              </button>
            )}
            <button className={`${styles.menuBtn} ${styles.newGameBtn}`} onClick={handleNewGame}>
              <div className={styles.btnLeft}>
                <span className={styles.btnIcon}>&#9733;</span>
                <span className={styles.btnText}>NEW GAME</span>
              </div>
              <span className={styles.btnArrow}>&#8250;</span>
            </button>
            <button className={styles.menuBtn} onClick={() => navigate('/armory')}>
              <div className={styles.btnLeft}>
                <span className={styles.btnIcon}>&#9876;</span>
                <span className={styles.btnText}>ARMORY</span>
              </div>
              <span className={styles.btnArrow}>&#8250;</span>
            </button>
            <div className={styles.divider} />
            <button className={styles.menuBtn} onClick={() => navigate('/archive')}>
              <div className={styles.btnLeft}>
                <span className={styles.btnIcon}>&#9783;</span>
                <span className={styles.btnText}>ARCHIVE</span>
              </div>
              <span className={styles.btnArrow}>&#8250;</span>
            </button>
            <button className={styles.menuBtn} onClick={() => navigate('/settings')}>
              <div className={styles.btnLeft}>
                <span className={styles.btnIcon}>&#9881;</span>
                <span className={styles.btnText}>SETTINGS</span>
              </div>
              <span className={styles.btnArrow}>&#8250;</span>
            </button>
            <button className={styles.menuBtn} onClick={() => navigate('/about')}>
              <div className={styles.btnLeft}>
                <span className={styles.btnIcon}>&#9432;</span>
                <span className={styles.btnText}>ABOUT</span>
              </div>
              <span className={styles.btnArrow}>&#8250;</span>
            </button>
            <button className={styles.menuBtn} onClick={() => navigate('/support')}>
              <div className={styles.btnLeft}>
                <span className={styles.btnIcon}>&#9829;</span>
                <span className={styles.btnText}>SUPPORT</span>
              </div>
              <span className={styles.btnArrow}>&#8250;</span>
            </button>
          </nav>
          <p className={styles.version}>v1.0.0</p>
        </div>
      )}
    </div>
  );
}
