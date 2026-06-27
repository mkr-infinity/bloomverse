export interface AudioSettings {
  sfxVolume: number;
  musicVolume: number;
}

const STORAGE_KEY = 'bloomverse_audio_settings_v1';

export const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  sfxVolume: 80,
  musicVolume: 60,
};

let ctx: AudioContext | null = null;
let unlocked = false;

export function getAudioSettings(): AudioSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_AUDIO_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<AudioSettings>;
    return {
      sfxVolume: clampVolume(parsed.sfxVolume, DEFAULT_AUDIO_SETTINGS.sfxVolume),
      musicVolume: clampVolume(parsed.musicVolume, DEFAULT_AUDIO_SETTINGS.musicVolume),
    };
  } catch {
    return { ...DEFAULT_AUDIO_SETTINGS };
  }
}

export function saveAudioSettings(settings: AudioSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    sfxVolume: clampVolume(settings.sfxVolume, DEFAULT_AUDIO_SETTINGS.sfxVolume),
    musicVolume: clampVolume(settings.musicVolume, DEFAULT_AUDIO_SETTINGS.musicVolume),
  }));
}

export function unlockAudio() {
  const audio = getContext();
  if (!audio) return;
  if (audio.state === 'suspended') void audio.resume();
  unlocked = true;
}

export type SoundName = 'shoot' | 'enemyShoot' | 'hit' | 'damage' | 'pickup' | 'reloadStart' | 'reloadDone' | 'victory' | 'defeat';

export function playSound(name: SoundName) {
  const settings = getAudioSettings();
  const volume = settings.sfxVolume / 100;
  if (volume <= 0) return;
  const audio = getContext();
  if (!audio) return;
  if (!unlocked && audio.state === 'suspended') return;

  const now = audio.currentTime;
  const profile = SOUND_PROFILES[name];
  if (!profile) return;

  const gain = audio.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(profile.gain * volume, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + profile.duration);
  gain.connect(audio.destination);

  for (const tone of profile.tones) {
    const osc = audio.createOscillator();
    osc.type = tone.type;
    osc.frequency.setValueAtTime(tone.from, now);
    osc.frequency.exponentialRampToValueAtTime(tone.to, now + profile.duration);
    osc.connect(gain);
    osc.start(now + (tone.delay || 0));
    osc.stop(now + profile.duration);
  }
}

const SOUND_PROFILES: Record<SoundName, { duration: number; gain: number; tones: { type: OscillatorType; from: number; to: number; delay?: number }[] }> = {
  shoot: { duration: 0.08, gain: 0.18, tones: [{ type: 'square', from: 190, to: 70 }, { type: 'sawtooth', from: 90, to: 45 }] },
  enemyShoot: { duration: 0.09, gain: 0.14, tones: [{ type: 'sawtooth', from: 260, to: 100 }] },
  hit: { duration: 0.07, gain: 0.13, tones: [{ type: 'triangle', from: 520, to: 190 }] },
  damage: { duration: 0.18, gain: 0.22, tones: [{ type: 'sawtooth', from: 120, to: 38 }] },
  pickup: { duration: 0.12, gain: 0.16, tones: [{ type: 'sine', from: 520, to: 920 }, { type: 'triangle', from: 760, to: 1200, delay: 0.03 }] },
  reloadStart: { duration: 0.16, gain: 0.12, tones: [{ type: 'triangle', from: 240, to: 180 }] },
  reloadDone: { duration: 0.13, gain: 0.16, tones: [{ type: 'triangle', from: 420, to: 780 }] },
  victory: { duration: 0.55, gain: 0.18, tones: [{ type: 'sine', from: 440, to: 880 }, { type: 'triangle', from: 660, to: 1320, delay: 0.08 }] },
  defeat: { duration: 0.55, gain: 0.2, tones: [{ type: 'sawtooth', from: 220, to: 55 }, { type: 'triangle', from: 110, to: 40, delay: 0.06 }] },
};

function getContext() {
  if (ctx) return ctx;
  const AudioCtor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return null;
  ctx = new AudioCtor();
  return ctx;
}

function clampVolume(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : fallback;
}
