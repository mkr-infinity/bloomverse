import styles from './Overlay.module.css';

interface Props { onRetry: () => void; onQuit: () => void; }

export default function GameOver({ onRetry, onQuit }: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <h2 className={styles.titleRed}>GAME OVER</h2>
        <p className={styles.subtitle}>The void consumed you.</p>
        <div className={styles.buttons}>
          <button className={`${styles.btn} ${styles.primary}`} onClick={onRetry}>RETRY</button>
          <button className={styles.btn} onClick={onQuit}>QUIT TO MENU</button>
        </div>
      </div>
    </div>
  );
}
