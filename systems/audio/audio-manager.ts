"use client";

import { Howl } from "howler";
import type { AudioSettings } from "@/types/world";

type SoundKey = "uiOpen" | "uiClose" | "uiSelect" | "favorite" | "discovery";

const soundManifest: Partial<Record<SoundKey, string>> = {};

const soundCache = new Map<SoundKey, Howl>();

export function playBloomSound(sound: SoundKey, settings: AudioSettings) {
  if (settings.muted) {
    return;
  }

  const src = soundManifest[sound];

  if (!src) {
    return;
  }

  const existing = soundCache.get(sound);

  if (existing) {
    existing.volume(settings.volume);
    existing.play();
    return;
  }

  const howl = new Howl({ src: [src], volume: settings.volume });
  soundCache.set(sound, howl);
  howl.play();
}

export function hasAudioAssets() {
  return Object.keys(soundManifest).length > 0;
}
