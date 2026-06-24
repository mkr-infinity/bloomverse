import styles from './Overlay.module.css';

interface Props { levelName: string; onNext: () => void; onQuit: () => void; }

export default function LevelComplete({ levelName, onNext, onQuit }: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <h2 className={styles.titleGreen}>LEVEL COMPLETE</h2>
        <p className={styles.subtitle}>{levelName}</p>
        <div className={styles.buttons}>
          <button className={`${styles.btn} ${styles.primary}`} onClick={onNext}>NEXT LEVEL</button>
          <button className={styles.btn} onClick={onQuit}>QUIT TO MENU</button>
        </div>
      </div>
    </div>
  );
}
