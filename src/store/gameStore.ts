import { create } from 'zustand';
import { saveData, loadData } from '../utils/db';

export interface Weapon {
  id: string;
  name: string;
  type: 'pistol' | 'rifle' | 'shotgun' | 'sniper' | 'melee';
  damage: number;
  fireRate: number;
  ammo: number;
  maxAmmo: number;
  reloadTime: number;
  level: number;
}

export interface PlayerState {
  health: number;
  maxHealth: number;
  armor: number;
  maxArmor: number;
  level: number;
  xp: number;
  xpToNext: number;
  weapons: Weapon[];
  activeWeaponIndex: number;
  credits: number;
  kills: number;
}

export interface GameProgress {
  currentLevel: number;
  maxLevelReached: number;
  totalKills: number;
  totalDeaths: number;
  bossesDefeated: number;
  playTime: number;
  firstPlayDate: number;
  achievements: string[];
  unlockedWeapons: string[];
}

interface GameState {
  player: PlayerState;
  progress: GameProgress;
  isPlaying: boolean;
  isPaused: boolean;
  setPlaying: (playing: boolean) => void;
  setPaused: (paused: boolean) => void;
  updatePlayer: (updates: Partial<PlayerState>) => void;
  updateProgress: (updates: Partial<GameProgress>) => void;
  damagePlayer: (amount: number) => void;
  healPlayer: (amount: number) => void;
  addKill: () => void;
  addXP: (amount: number) => void;
  switchWeapon: (index: number) => void;
  save: () => Promise<void>;
  load: () => Promise<void>;
  reset: () => void;
}

const defaultWeapons: Weapon[] = [
  { id: 'pistol', name: 'Void Pistol', type: 'pistol', damage: 15, fireRate: 300, ammo: 12, maxAmmo: 12, reloadTime: 1200, level: 1 },
  { id: 'rifle', name: 'Rift Rifle', type: 'rifle', damage: 25, fireRate: 150, ammo: 30, maxAmmo: 30, reloadTime: 2000, level: 1 },
];

const defaultPlayer: PlayerState = {
  health: 100,
  maxHealth: 100,
  armor: 0,
  maxArmor: 50,
  level: 1,
  xp: 0,
  xpToNext: 100,
  weapons: defaultWeapons,
  activeWeaponIndex: 0,
  credits: 0,
  kills: 0,
};

const defaultProgress: GameProgress = {
  currentLevel: 1,
  maxLevelReached: 1,
  totalKills: 0,
  totalDeaths: 0,
  bossesDefeated: 0,
  playTime: 0,
  firstPlayDate: 0,
  achievements: [],
  unlockedWeapons: ['pistol', 'rifle'],
};

export const useGameStore = create<GameState>((set, get) => ({
  player: { ...defaultPlayer },
  progress: { ...defaultProgress },
  isPlaying: false,
  isPaused: false,

  setPlaying: (playing) => set({ isPlaying: playing }),
  setPaused: (paused) => set({ isPaused: paused }),

  updatePlayer: (updates) => set((s) => ({ player: { ...s.player, ...updates } })),
  updateProgress: (updates) => set((s) => ({ progress: { ...s.progress, ...updates } })),

  damagePlayer: (amount) => set((s) => {
    let remaining = amount;
    let armor = s.player.armor;
    let health = s.player.health;
    if (armor > 0) {
      const absorbed = Math.min(armor, remaining * 0.6);
      armor -= absorbed;
      remaining -= absorbed;
    }
    health = Math.max(0, health - remaining);
    return { player: { ...s.player, health, armor } };
  }),

  healPlayer: (amount) => set((s) => ({
    player: { ...s.player, health: Math.min(s.player.maxHealth, s.player.health + amount) }
  })),

  addKill: () => set((s) => ({
    player: { ...s.player, kills: s.player.kills + 1 },
    progress: { ...s.progress, totalKills: s.progress.totalKills + 1 }
  })),

  addXP: (amount) => set((s) => {
    let xp = s.player.xp + amount;
    let level = s.player.level;
    let xpToNext = s.player.xpToNext;
    while (xp >= xpToNext) {
      xp -= xpToNext;
      level++;
      xpToNext = Math.floor(xpToNext * 1.5);
    }
    return { player: { ...s.player, xp, level, xpToNext } };
  }),

  switchWeapon: (index) => set((s) => ({
    player: { ...s.player, activeWeaponIndex: index }
  })),

  save: async () => {
    const { player, progress } = get();
    await saveData('gameState', 'player', player);
    await saveData('gameState', 'progress', progress);
  },

  load: async () => {
    const player = await loadData<PlayerState>('gameState', 'player');
    const progress = await loadData<GameProgress>('gameState', 'progress');
    if (player) set({ player });
    if (progress) set({ progress });
  },

  reset: () => set({ player: { ...defaultPlayer }, progress: { ...defaultProgress } }),
}));
