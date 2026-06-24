import { Weapon } from '../store/gameStore';
import styles from './HUD.module.css';

interface HUDProps {
  health: number;
  maxHealth: number;
  armor: number;
  weapon: Weapon | undefined;
  level: number;
  levelName: string;
  wave: number;
  totalWaves: number;
  kills: number;
  playerLevel: number;
  xp: number;
  xpToNext: number;
}

export default function HUD({ health, maxHealth, armor, weapon, level, levelName, wave, totalWaves, kills, playerLevel, xp, xpToNext }: HUDProps) {
  const healthPct = (health / maxHealth) * 100;
  const xpPct = (xp / xpToNext) * 100;

  return (
    <div className={styles.hud}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <div className={styles.levelInfo}>
          <span className={styles.levelNum}>LEVEL {level}</span>
          <span className={styles.levelName}>{levelName}</span>
        </div>
        <div className={styles.waveInfo}>
          WAVE {Math.min(wave + 1, totalWaves)} / {totalWaves}
        </div>
      </div>

      {/* Bottom left - Health & Armor */}
      <div className={styles.bottomLeft}>
        <div className={styles.healthContainer}>
          <div className={styles.barLabel}>HP</div>
          <div className={styles.barOuter}>
            <div className={`${styles.barInner} ${styles.healthBar}`} style={{ width: `${healthPct}%` }} />
          </div>
          <span className={styles.barValue}>{Math.ceil(health)}</span>
        </div>
        {armor > 0 && (
          <div className={styles.healthContainer}>
            <div className={styles.barLabel}>AR</div>
            <div className={styles.barOuter}>
              <div className={`${styles.barInner} ${styles.armorBar}`} style={{ width: `${(armor / 50) * 100}%` }} />
            </div>
            <span className={styles.barValue}>{Math.ceil(armor)}</span>
          </div>
        )}
      </div>

      {/* Bottom right - Weapon */}
      <div className={styles.bottomRight}>
        {weapon && (
          <div className={styles.weaponInfo}>
            <span className={styles.weaponName}>{weapon.name}</span>
            <span className={styles.ammo}>{weapon.ammo} / {weapon.maxAmmo}</span>
          </div>
        )}
      </div>

      {/* Top right - Stats */}
      <div className={styles.topRight}>
        <div className={styles.stat}>LVL {playerLevel}</div>
        <div className={styles.xpBar}>
          <div className={styles.xpFill} style={{ width: `${xpPct}%` }} />
        </div>
        <div className={styles.stat}>KILLS: {kills}</div>
      </div>
    </div>
  );
}
