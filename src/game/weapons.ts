// Arsenal catalog — weapons and gear purchasable with coins in the Armory.
// Weapon stats feed directly into the game engine loadout.

export interface WeaponDef {
  id: string;
  name: string;
  type: 'pistol' | 'smg' | 'rifle' | 'shotgun' | 'sniper' | 'lmg' | 'plasma';
  damage: number;       // per bullet
  fireCooldown: number; // frames between shots (lower = faster)
  ammo: number;         // magazine / reserve size
  reloadFrames: number; // timed reload duration at 60fps
  pellets: number;      // bullets per shot (shotgun > 1)
  price: number;        // 0 = free starter
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGEND' | 'MYTHIC';
  accent: string;
  desc: string;
}

export const WEAPONS: WeaponDef[] = [
  { id: 'pistol', name: 'Void Pistol', type: 'pistol', damage: 18, fireCooldown: 10, ammo: 40, reloadFrames: 55, pellets: 1, price: 0,
    rarity: 'COMMON', accent: '#9aa7b5', desc: 'Reliable sidearm. Never jams, never quits.' },
  { id: 'smg', name: 'Rift SMG', type: 'smg', damage: 13, fireCooldown: 4, ammo: 80, reloadFrames: 70, pellets: 1, price: 400,
    rarity: 'RARE', accent: '#00ff88', desc: 'Spits lead. Shreds fast, light hitters at close range.' },
  { id: 'rifle', name: 'Pulse Rifle', type: 'rifle', damage: 28, fireCooldown: 8, ammo: 60, reloadFrames: 78, pellets: 1, price: 750,
    rarity: 'RARE', accent: '#00d4ff', desc: 'Balanced all-rounder. The soldier’s choice.' },
  { id: 'shotgun', name: 'Breach Shotgun', type: 'shotgun', damage: 20, fireCooldown: 20, ammo: 28, reloadFrames: 95, pellets: 5, price: 1200,
    rarity: 'EPIC', accent: '#ff6b2d', desc: 'Five-pellet spread. Devastating up close.' },
  { id: 'sniper', name: 'Specter Sniper', type: 'sniper', damage: 110, fireCooldown: 28, ammo: 20, reloadFrames: 110, pellets: 1, price: 1800,
    rarity: 'EPIC', accent: '#b14aff', desc: 'One shot, one kill. Punches through tanks.' },
  { id: 'lmg', name: 'Havoc LMG', type: 'lmg', damage: 22, fireCooldown: 5, ammo: 140, reloadFrames: 130, pellets: 1, price: 2600,
    rarity: 'LEGEND', accent: '#ffcc00', desc: 'Belt-fed suppression. Hold the trigger, hold the line.' },
  { id: 'plasma', name: 'Nova Cannon', type: 'plasma', damage: 80, fireCooldown: 11, ammo: 50, reloadFrames: 85, pellets: 1, price: 4200,
    rarity: 'MYTHIC', accent: '#ff2d55', desc: 'Superheated plasma bolts that melt everything.' },
];

export interface GearDef {
  id: string;
  name: string;
  price: number;
  accent: string;
  desc: string;
  // applied to the loadout at game start
  bonusHealth?: number;
  bonusArmor?: number;
  ammoMult?: number;   // multiplies weapon ammo
  damageMult?: number; // multiplies weapon damage
}

export const GEAR: GearDef[] = [
  { id: 'vest', name: 'Combat Vest', price: 500, accent: '#ffcc00', bonusArmor: 30,
    desc: 'Start every mission with +30 armor plating.' },
  { id: 'stim', name: 'Nano Stims', price: 700, accent: '#00ff88', bonusHealth: 40,
    desc: 'Reinforced biology. +40 max health.' },
  { id: 'belt', name: 'Ammo Belt', price: 900, accent: '#00d4ff', ammoMult: 1.4,
    desc: 'Carry 40% more rounds into every fight.' },
  { id: 'adrenal', name: 'Adrenal Core', price: 1500, accent: '#ff2d55', damageMult: 1.2,
    desc: 'Combat overdrive. +20% weapon damage.' },
];

export function getWeapon(id: string): WeaponDef {
  return WEAPONS.find((w) => w.id === id) || WEAPONS[0];
}

export interface Loadout {
  damage: number;
  fireCooldown: number;
  pellets: number;
  maxAmmo: number;
  reloadDuration: number;
  bonusHealth: number;
  bonusArmor: number;
}

// Build the effective in-game loadout from an equipped weapon + owned gear.
export function buildLoadout(weaponId: string, ownedGear: string[]): Loadout {
  const w = getWeapon(weaponId);
  let damage = w.damage;
  let maxAmmo = w.ammo;
  let bonusHealth = 0;
  let bonusArmor = 0;
  for (const g of GEAR) {
    if (!ownedGear.includes(g.id)) continue;
    if (g.bonusHealth) bonusHealth += g.bonusHealth;
    if (g.bonusArmor) bonusArmor += g.bonusArmor;
    if (g.ammoMult) maxAmmo = Math.round(maxAmmo * g.ammoMult);
    if (g.damageMult) damage = Math.round(damage * g.damageMult);
  }
  return { damage, fireCooldown: w.fireCooldown, pellets: w.pellets, maxAmmo, reloadDuration: w.reloadFrames, bonusHealth, bonusArmor };
}
