import { LevelConfig } from './types';

export const LEVELS: LevelConfig[] = [
  {
    id: 1, name: 'Abandoned City', world: 'city',
    bgColor: '#0d1117', ambientColor: '#1a2332',
    waves: [
      { enemies: [{ type: 'walker', count: 5 }], spawnDelay: 1500 },
      { enemies: [{ type: 'walker', count: 8 }, { type: 'runner', count: 2 }], spawnDelay: 1200 },
      { enemies: [{ type: 'walker', count: 6 }, { type: 'runner', count: 4 }], spawnDelay: 1000 },
    ],
  },
  {
    id: 2, name: 'Desert Ruins', world: 'desert',
    bgColor: '#1a1408', ambientColor: '#2d2210',
    waves: [
      { enemies: [{ type: 'walker', count: 8 }, { type: 'runner', count: 3 }], spawnDelay: 1200 },
      { enemies: [{ type: 'runner', count: 6 }, { type: 'tank', count: 1 }], spawnDelay: 1000 },
      { enemies: [{ type: 'walker', count: 5 }, { type: 'runner', count: 5 }, { type: 'tank', count: 2 }], spawnDelay: 900 },
    ],
  },
  {
    id: 3, name: 'Frozen Industrial Zone', world: 'frozen',
    bgColor: '#0a1420', ambientColor: '#152535',
    waves: [
      { enemies: [{ type: 'runner', count: 8 }, { type: 'tank', count: 2 }], spawnDelay: 1000 },
      { enemies: [{ type: 'walker', count: 6 }, { type: 'explosive', count: 3 }], spawnDelay: 900 },
      { enemies: [{ type: 'runner', count: 8 }, { type: 'tank', count: 3 }, { type: 'explosive', count: 2 }], spawnDelay: 800 },
    ],
  },
  {
    id: 4, name: 'Burning Urban Collapse', world: 'burning',
    bgColor: '#1a0a08', ambientColor: '#2d1510',
    waves: [
      { enemies: [{ type: 'runner', count: 10 }, { type: 'explosive', count: 4 }], spawnDelay: 800 },
      { enemies: [{ type: 'tank', count: 4 }, { type: 'runner', count: 8 }], spawnDelay: 700 },
      { enemies: [{ type: 'walker', count: 5 }, { type: 'runner', count: 8 }, { type: 'tank', count: 3 }, { type: 'explosive', count: 3 }], spawnDelay: 600 },
      { enemies: [{ type: 'boss', count: 1 }], spawnDelay: 0 },
    ],
  },
  {
    id: 5, name: 'Floating Sky Fragments', world: 'sky',
    bgColor: '#0a0a1a', ambientColor: '#15152d',
    waves: [
      { enemies: [{ type: 'runner', count: 12 }, { type: 'explosive', count: 5 }], spawnDelay: 700 },
      { enemies: [{ type: 'tank', count: 5 }, { type: 'runner', count: 10 }], spawnDelay: 600 },
      { enemies: [{ type: 'runner', count: 12 }, { type: 'tank', count: 4 }, { type: 'explosive', count: 5 }], spawnDelay: 500 },
      { enemies: [{ type: 'boss', count: 1 }, { type: 'runner', count: 5 }], spawnDelay: 500 },
    ],
  },
  {
    id: 6, name: 'Dark Void Dimension', world: 'void',
    bgColor: '#050508', ambientColor: '#0a0a15',
    waves: [
      { enemies: [{ type: 'runner', count: 15 }, { type: 'tank', count: 5 }, { type: 'explosive', count: 5 }], spawnDelay: 500 },
      { enemies: [{ type: 'runner', count: 12 }, { type: 'tank', count: 6 }, { type: 'explosive', count: 6 }], spawnDelay: 400 },
      { enemies: [{ type: 'runner', count: 10 }, { type: 'explosive', count: 8 }, { type: 'tank', count: 4 }], spawnDelay: 400 },
      { enemies: [{ type: 'boss', count: 1 }, { type: 'tank', count: 3 }, { type: 'runner', count: 8 }], spawnDelay: 300 },
    ],
  },
];
