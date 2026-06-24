export interface Vector2 {
  x: number;
  y: number;
}

export interface Entity {
  id: string;
  pos: Vector2;
  vel: Vector2;
  size: number;
  health: number;
  maxHealth: number;
  active: boolean;
}

export interface Enemy extends Entity {
  type: 'walker' | 'runner' | 'tank' | 'explosive' | 'boss';
  damage: number;
  speed: number;
  attackCooldown: number;
  lastAttack: number;
  xpValue: number;
}

export interface Projectile {
  id: string;
  pos: Vector2;
  vel: Vector2;
  damage: number;
  active: boolean;
  lifetime: number;
}

export interface Pickup {
  id: string;
  pos: Vector2;
  type: 'health' | 'ammo' | 'armor' | 'credits';
  value: number;
  active: boolean;
}

export interface LevelConfig {
  id: number;
  name: string;
  world: string;
  waves: WaveConfig[];
  bgColor: string;
  ambientColor: string;
}

export interface WaveConfig {
  enemies: { type: Enemy['type']; count: number }[];
  spawnDelay: number;
}

export interface GameInput {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  shoot: boolean;
  reload: boolean;
  mouseX: number;
  mouseY: number;
}
