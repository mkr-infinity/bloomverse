import { useState } from 'react';
import styles from './Tutorial.module.css';

interface Props { onClose: () => void; }

export default function Tutorial({ onClose }: Props) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'MOVEMENT',
      desc: 'Use W A S D or Arrow Keys to move your operative around the battlefield.',
      keys: ['W', 'A', 'S', 'D'],
    },
    {
      title: 'COMBAT',
      desc: 'Aim with your Mouse. Press SPACE or Left Click to fire at enemies.',
      keys: ['SPACE', 'CLICK'],
    },
    {
      title: 'RELOAD',
      desc: 'Press R to reload your weapon. Keep an eye on your ammo count!',
      keys: ['R'],
    },
    {
      title: 'SURVIVE',
      desc: 'Kill all zombies in every wave to complete the mission. Collect pickups to heal and restock.',
      keys: [],
    },
  ];

  const s = steps[step];

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <div className={styles.stepDots}>
          {steps.map((_, i) => (
            <div key={i} className={`${styles.dot} ${i === step ? styles.dotActive : ''} ${i < step ? styles.dotDone : ''}`} />
          ))}
        </div>

        <h2 className={styles.title}>{s.title}</h2>
        <p className={styles.desc}>{s.desc}</p>

        {s.keys.length > 0 && (
          <div className={styles.keys}>
            {s.keys.map((k) => (
              <span key={k} className={styles.key}>{k}</span>
            ))}
          </div>
        )}

        <div className={styles.buttons}>
          {step > 0 && (
            <button className={styles.btnBack} onClick={() => setStep(step - 1)}>BACK</button>
          )}
          {step < steps.length - 1 ? (
            <button className={styles.btnNext} onClick={() => setStep(step + 1)}>NEXT</button>
          ) : (
            <button className={styles.btnGo} onClick={onClose}>LET'S GO!</button>
          )}
        </div>

        <button className={styles.skip} onClick={onClose}>Skip Tutorial</button>
      </div>
    </div>
  );
}
