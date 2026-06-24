import styles from './Overlay.module.css';

interface Props { onResume: () => void; onQuit: () => void; }

export default function PauseMenu({ onResume, onQuit }: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <h2 className={styles.title}>PAUSED</h2>
        <div className={styles.buttons}>
          <button className={styles.btn} onClick={onResume}>RESUME</button>
          <button className={`${styles.btn} ${styles.danger}`} onClick={onQuit}>QUIT TO MENU</button>
        </div>
        <p className={styles.hint}>Press ESC to resume</p>
      </div>
    </div>
  );
}
