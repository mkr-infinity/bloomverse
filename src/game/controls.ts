export type ControlAction = 'up' | 'down' | 'left' | 'right' | 'shoot' | 'reload' | 'pause';

export type ControlBindings = Record<ControlAction, string[]>;

export const CONTROL_ACTIONS: { action: ControlAction; label: string; hint: string }[] = [
  { action: 'up', label: 'Move Up', hint: 'Forward movement' },
  { action: 'down', label: 'Move Down', hint: 'Backward movement' },
  { action: 'left', label: 'Move Left', hint: 'Strafe left' },
  { action: 'right', label: 'Move Right', hint: 'Strafe right' },
  { action: 'shoot', label: 'Shoot', hint: 'Keyboard fire; mouse still works' },
  { action: 'reload', label: 'Reload', hint: 'Refill current weapon' },
  { action: 'pause', label: 'Pause', hint: 'Open pause menu' },
];

export const DEFAULT_BINDINGS: ControlBindings = {
  up: ['KeyW', 'ArrowUp'],
  down: ['KeyS', 'ArrowDown'],
  left: ['KeyA', 'ArrowLeft'],
  right: ['KeyD', 'ArrowRight'],
  shoot: ['Space'],
  reload: ['KeyR'],
  pause: ['Escape'],
};

const STORAGE_KEY = 'bloomverse_control_bindings_v1';

export function getControlBindings(): ControlBindings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneBindings(DEFAULT_BINDINGS);
    const parsed = JSON.parse(raw) as Partial<ControlBindings>;
    return {
      up: normalize(parsed.up, DEFAULT_BINDINGS.up),
      down: normalize(parsed.down, DEFAULT_BINDINGS.down),
      left: normalize(parsed.left, DEFAULT_BINDINGS.left),
      right: normalize(parsed.right, DEFAULT_BINDINGS.right),
      shoot: normalize(parsed.shoot, DEFAULT_BINDINGS.shoot),
      reload: normalize(parsed.reload, DEFAULT_BINDINGS.reload),
      pause: normalize(parsed.pause, DEFAULT_BINDINGS.pause),
    };
  } catch {
    return cloneBindings(DEFAULT_BINDINGS);
  }
}

export function saveControlBindings(bindings: ControlBindings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bindings));
}

export function resetControlBindings(): ControlBindings {
  const bindings = cloneBindings(DEFAULT_BINDINGS);
  saveControlBindings(bindings);
  return bindings;
}

export function setPrimaryBinding(bindings: ControlBindings, action: ControlAction, code: string): ControlBindings {
  const next = cloneBindings(bindings);
  // Keep arrow-key secondary defaults for movement if the player changes WASD,
  // so desktop controls always have a safe fallback.
  const secondary = DEFAULT_BINDINGS[action].filter((c) => c.startsWith('Arrow'));
  next[action] = Array.from(new Set([code, ...secondary]));
  return next;
}

export function isActionKey(bindings: ControlBindings, action: ControlAction, code: string) {
  return bindings[action].includes(code);
}

export function formatKey(code: string) {
  if (code === 'Space') return 'SPACE';
  if (code === 'Escape') return 'ESC';
  if (code.startsWith('Key')) return code.slice(3).toUpperCase();
  if (code.startsWith('Digit')) return code.slice(5);
  if (code.startsWith('Arrow')) return code.replace('Arrow', 'ARROW ');
  return code.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase();
}

export function formatBinding(codes: string[]) {
  return codes.map(formatKey).join(' / ');
}

function normalize(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return [...fallback];
  const codes = value.filter((v): v is string => typeof v === 'string' && v.length > 0);
  return codes.length ? Array.from(new Set(codes)) : [...fallback];
}

function cloneBindings(bindings: ControlBindings): ControlBindings {
  return {
    up: [...bindings.up],
    down: [...bindings.down],
    left: [...bindings.left],
    right: [...bindings.right],
    shoot: [...bindings.shoot],
    reload: [...bindings.reload],
    pause: [...bindings.pause],
  };
}
