import styles from './PageTransition.module.css';

export default function PageTransition({ text }: { text?: string }) {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}>
        <div className={styles.ring} />
        <div className={styles.ring2} />
      </div>
      <p className={styles.text}>{text || 'LOADING'}</p>
    </div>
  );
}
