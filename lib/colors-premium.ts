export const premiumColors = {
  primary: {
    amber: '#f0b32a',
    copper: '#d4783a',
    brass: '#c9a030',
    gold: '#e8b830',
    bronze: '#cd7f32',
    rose: '#e8a87c',
  },
  surface: {
    obsidian: '#0d0d1a',
    midnight: '#12121f',
    deep: '#1a1a2e',
    dark: '#22223a',
    shadow: '#16213e',
    charcoal: '#1e1e2e',
  },
  accent: {
    emerald: '#4ade80',
    ruby: '#e85d5d',
    sapphire: '#60a5fa',
    topaz: '#fbbf24',
    amethyst: '#a78bfa',
    coral: '#fb7185',
    jade: '#34d399',
    sunstone: '#f97316',
  },
  text: {
    light: '#f7f3e8',
    cream: '#efe6d0',
    warm: '#e0d5b8',
    muted: '#a89f88',
    dim: '#7a7260',
  },
  atmospheric: {
    dawn: '#f0d0a0',
    day: '#fff5e0',
    dusk: '#d0a080',
    night: '#0a0a1a',
    twilight: '#2a1a3e',
    aurora: '#40e0d0',
    sunset: '#e07050',
    sunrise: '#f0a060',
  },
  ui: {
    panel: 'rgba(13,13,26,0.92)',
    border: 'rgba(232,184,48,0.12)',
    hover: 'rgba(232,184,48,0.08)',
    active: 'rgba(232,184,48,0.15)',
    glass: 'rgba(255,243,232,0.04)',
    glow: 'rgba(232,184,48,0.2)',
  },
  semantic: {
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#e85d5d',
    info: '#60a5fa',
    premium: '#e8b830',
    rare: '#a78bfa',
    epic: '#e85d5d',
    legendary: '#fbbf24',
  },
};

export function timeToColors(hour: number) {
  if (hour >= 5 && hour < 8) {
    return {
      sky: '#2a1a3e',
      ground: '#3a2a1a',
      ambient: '#f0d0a0',
      light: 0.6,
      sun: '#f0a060',
      label: 'Dawn',
    };
  }
  if (hour >= 8 && hour < 17) {
    return {
      sky: '#87ceeb',
      ground: '#4a6b3a',
      ambient: '#fff5e0',
      light: 1.0,
      sun: '#fff5e0',
      label: 'Day',
    };
  }
  if (hour >= 17 && hour < 20) {
    return {
      sky: '#1a0a2e',
      ground: '#2a1a0a',
      ambient: '#d0a080',
      light: 0.5,
      sun: '#e07050',
      label: 'Dusk',
    };
  }
  return {
    sky: '#0a0a1a',
    ground: '#1a1a0a',
    ambient: '#0a0a1a',
    light: 0.15,
    sun: '#1a0a2e',
    label: 'Night',
  };
}

export const fontFamilies = {
  heading: "'Orbitron', 'Rajdhani', 'Bebas Neue', sans-serif",
  body: "'Exo 2', 'Jura', 'Titillium Web', sans-serif",
  accent: "'Press Start 2P', 'Audiowide', 'Monoton', monospace",
  display: "'Teko', 'Oxanium', 'Barlow Condensed', sans-serif",
  ui: "'Rajdhani', 'Exo 2', sans-serif",
};
