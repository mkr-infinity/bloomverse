import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { WEAPONS, GEAR, WeaponDef } from '../game/weapons';
import CoinIcon from '../components/CoinIcon';
import ActionBackground from '../components/ActionBackground';
import styles from './Armory.module.css';

function hexA(hex: string, a: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 0xff},${(n >> 8) & 0xff},${n & 0xff},${a})`;
}

// Stylized gun silhouettes per weapon type (48x20 viewBox).
function GunIcon({ type, color }: { type: WeaponDef['type']; color: string }) {
  const shapes: Record<WeaponDef['type'], JSX.Element> = {
    pistol: <><rect x="10" y="6" width="20" height="6" rx="1" /><rect x="12" y="11" width="6" height="7" rx="1" /></>,
    smg: <><rect x="6" y="6" width="26" height="5" rx="1" /><rect x="12" y="10" width="5" height="8" rx="1" /><rect x="30" y="5" width="8" height="3" rx="1" /></>,
    rifle: <><rect x="4" y="6" width="34" height="5" rx="1" /><rect x="16" y="10" width="5" height="7" rx="1" /><rect x="2" y="5" width="5" height="7" rx="1" /></>,
    shotgun: <><rect x="4" y="6" width="36" height="6" rx="1" /><rect x="14" y="11" width="6" height="6" rx="1" /><rect x="2" y="7" width="4" height="6" rx="1" /></>,
    sniper: <><rect x="2" y="7" width="42" height="4" rx="1" /><rect x="18" y="10" width="5" height="7" rx="1" /><rect x="20" y="3" width="12" height="3" rx="1" /></>,
    lmg: <><rect x="4" y="5" width="34" height="7" rx="1" /><rect x="16" y="11" width="6" height="7" rx="1" /><circle cx="34" cy="14" r="4" /></>,
    plasma: <><rect x="6" y="5" width="30" height="8" rx="3" /><rect x="14" y="12" width="6" height="6" rx="1" /><circle cx="38" cy="9" r="4" /></>,
  };
  return (
    <svg width="58" height="24" viewBox="0 0 48 20" fill={color} aria-hidden="true">
      {shapes[type]}
    </svg>
  );
}

const MAX_DMG = 110;
const MAX_AMMO = 140;

export default function Armory() {
  const navigate = useNavigate();
  const progress = useGameStore((s) => s.progress);
  const load = useGameStore((s) => s.load);
  const buyWeapon = useGameStore((s) => s.buyWeapon);
  const equipWeapon = useGameStore((s) => s.equipWeapon);
  const buyGear = useGameStore((s) => s.buyGear);

  const [tab, setTab] = useState<'weapons' | 'gear'>('weapons');
  const [notice, setNotice] = useState('');

  useEffect(() => { load(); }, [load]);

  const coins = progress.coins || 0;
  const ownedWeapons = progress.unlockedWeapons || ['pistol'];
  const equipped = progress.equippedWeapon || 'pistol';
  const ownedGear = progress.ownedGear || [];

  const flash = (msg: string) => { setNotice(msg); setTimeout(() => setNotice(''), 2000); };

  const handleWeapon = (w: WeaponDef) => {
    const owned = w.price === 0 || ownedWeapons.includes(w.id);
    if (owned) {
      equipWeapon(w.id);
      flash(`${w.name} equipped`);
      return;
    }
    if (coins < w.price) { flash(`Need ${w.price - coins} more coins`); return; }
    if (buyWeapon(w.id, w.price)) flash(`${w.name} acquired & equipped!`);
  };

  const handleGear = (id: string, name: string, price: number) => {
    if (ownedGear.includes(id)) { flash(`${name} already owned`); return; }
    if (coins < price) { flash(`Need ${price - coins} more coins`); return; }
    if (buyGear(id, price)) flash(`${name} installed!`);
  };

  return (
    <div className={styles.container}>
      <ActionBackground />
      <div className={styles.scrim} />

      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')} aria-label="Back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>
        <h1 className={styles.title}>ARMORY</h1>
        <div className={styles.coinBalance}><CoinIcon size={18} />{coins}</div>
      </div>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === 'weapons' ? styles.tabActive : ''}`} onClick={() => setTab('weapons')}>WEAPONS</button>
        <button className={`${styles.tab} ${tab === 'gear' ? styles.tabActive : ''}`} onClick={() => setTab('gear')}>GEAR</button>
      </div>

      <div className={styles.scroll}>
        {tab === 'weapons' && (
          <div className={styles.grid}>
            {WEAPONS.map((w) => {
              const owned = w.price === 0 || ownedWeapons.includes(w.id);
              const isEquipped = equipped === w.id;
              const rate = Math.round((60 / w.fireCooldown) * 10) / 10;
              return (
                <div
                  key={w.id}
                  className={`${styles.card} ${isEquipped ? styles.cardEquipped : ''}`}
                  style={{ ['--c' as string]: w.accent }}
                >
                  <div className={styles.cardTop}>
                    <span className={`${styles.rarity} ${styles['r_' + w.rarity]}`}>{w.rarity}</span>
                    {isEquipped && <span className={styles.equippedTag}>EQUIPPED</span>}
                  </div>

                  <div className={styles.gunWrap} style={{ background: `radial-gradient(circle, ${hexA(w.accent, 0.16)}, transparent 70%)` }}>
                    <GunIcon type={w.type} color={w.accent} />
                  </div>

                  <h3 className={styles.name}>{w.name}</h3>
                  <p className={styles.desc}>{w.desc}</p>

                  <div className={styles.stats}>
                    <Stat label="DMG" val={w.damage} max={MAX_DMG} color={w.accent} />
                    <Stat label="RATE" val={rate} max={15} color={w.accent} suffix="/s" />
                    <Stat label="MAG" val={w.ammo} max={MAX_AMMO} color={w.accent} />
                  </div>

                  <button
                    className={`${styles.action} ${owned ? styles.actionOwned : ''} ${isEquipped ? styles.actionEquipped : ''}`}
                    onClick={() => handleWeapon(w)}
                    disabled={isEquipped}
                    style={!owned ? { background: `linear-gradient(135deg, ${w.accent}, ${hexA(w.accent, 0.6)})` } : undefined}
                  >
                    {isEquipped ? 'EQUIPPED' : owned ? 'EQUIP' : (<><CoinIcon size={14} />{w.price}</>)}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'gear' && (
          <div className={styles.grid}>
            {GEAR.map((g) => {
              const owned = ownedGear.includes(g.id);
              return (
                <div key={g.id} className={`${styles.card} ${owned ? styles.cardEquipped : ''}`} style={{ ['--c' as string]: g.accent }}>
                  <div className={styles.cardTop}>
                    <span className={styles.gearTag} style={{ color: g.accent, borderColor: hexA(g.accent, 0.5) }}>GEAR</span>
                    {owned && <span className={styles.equippedTag}>OWNED</span>}
                  </div>
                  <div className={styles.gearIcon} style={{ background: hexA(g.accent, 0.12), borderColor: hexA(g.accent, 0.5), color: g.accent }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2l8 4v6c0 5-3.4 8.3-8 10-4.6-1.7-8-5-8-10V6z" /></svg>
                  </div>
                  <h3 className={styles.name}>{g.name}</h3>
                  <p className={styles.desc}>{g.desc}</p>
                  <button
                    className={`${styles.action} ${owned ? styles.actionEquipped : ''}`}
                    onClick={() => handleGear(g.id, g.name, g.price)}
                    disabled={owned}
                    style={!owned ? { background: `linear-gradient(135deg, ${g.accent}, ${hexA(g.accent, 0.6)})` } : undefined}
                  >
                    {owned ? 'INSTALLED' : (<><CoinIcon size={14} />{g.price}</>)}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {notice && <div className={styles.notice}>{notice}</div>}
    </div>
  );
}

function Stat({ label, val, max, color, suffix }: { label: string; val: number; max: number; color: string; suffix?: string }) {
  return (
    <div className={styles.statRow}>
      <span className={styles.statLabel}>{label}</span>
      <div className={styles.statBar}><div className={styles.statFill} style={{ width: `${Math.min(100, (val / max) * 100)}%`, background: color }} /></div>
      <span className={styles.statVal}>{val}{suffix || ''}</span>
    </div>
  );
}
