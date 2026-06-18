export const storageKeys = {
  deviceId: "bloomverse:device-id",
  citizenDraft: "bloomverse:citizen-draft",
  avatarDraft: "bloomverse:avatar-draft",
  settings: "bloomverse:settings",
  audioSettings: "bloomverse:audio-settings",
  tutorialState: "bloomverse:tutorial-state",
  cameraPreferences: "bloomverse:camera-preferences",
  searchHistory: "bloomverse:search-history",
  discoveryJournal: "bloomverse:discovery-journal"
} as const;

export function readLocalValue<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  const rawValue = window.localStorage.getItem(key);

  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

export function writeLocalValue<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getOrCreateDeviceId() {
  if (typeof window === "undefined") {
    return "server";
  }

  const existing = window.localStorage.getItem(storageKeys.deviceId);

  if (existing) {
    return existing;
  }

  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  const id = `device_${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
  window.localStorage.setItem(storageKeys.deviceId, id);
  return id;
}
