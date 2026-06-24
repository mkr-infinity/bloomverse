import { Weapon } from '../store/gameStore';

export const ALL_WEAPONS: Weapon[] = [
  { id: 'pistol', name: 'Void Pistol', type: 'pistol', damage: 15, fireRate: 300, ammo: 12, maxAmmo: 12, reloadTime: 1200, level: 1 },
  { id: 'rifle', name: 'Rift Rifle', type: 'rifle', damage: 25, fireRate: 150, ammo: 30, maxAmmo: 30, reloadTime: 2000, level: 1 },
  { id: 'shotgun', name: 'Shatter Blaster', type: 'shotgun', damage: 60, fireRate: 800, ammo: 6, maxAmmo: 6, reloadTime: 2500, level: 1 },
  { id: 'sniper', name: 'Void Piercer', type: 'sniper', damage: 90, fireRate: 1200, ammo: 5, maxAmmo: 5, reloadTime: 3000, level: 1 },
  { id: 'smg', name: 'Flux Shredder', type: 'rifle', damage: 12, fireRate: 80, ammo: 45, maxAmmo: 45, reloadTime: 1800, level: 1 },
  { id: 'launcher', name: 'Nova Launcher', type: 'shotgun', damage: 120, fireRate: 2000, ammo: 3, maxAmmo: 3, reloadTime: 3500, level: 1 },
  { id: 'melee', name: 'Rift Blade', type: 'melee', damage: 40, fireRate: 500, ammo: 999, maxAmmo: 999, reloadTime: 0, level: 1 },
  { id: 'plasma', name: 'Plasma Cannon', type: 'rifle', damage: 45, fireRate: 400, ammo: 20, maxAmmo: 20, reloadTime: 2200, level: 1 },
];

export const WEAPON_UNLOCK_LEVELS: Record<string, number> = {
  pistol: 1,
  rifle: 1,
  shotgun: 2,
  sniper: 3,
  smg: 3,
  launcher: 4,
  melee: 2,
  plasma: 5,
};

export function getUnlockedWeapons(gameLevel: number): Weapon[] {
  return ALL_WEAPONS.filter((w) => WEAPON_UNLOCK_LEVELS[w.id] <= gameLevel);
}
