import { create } from 'zustand';

interface WorldState {
  time: number;
  weather: string;
  setTime: (time: number) => void;
  setWeather: (weather: string) => void;
}

export const useWorldStore = create<WorldState>((set) => ({
  time: 0,
  weather: 'clear',
  setTime: (time) => set({ time }),
  setWeather: (weather) => set({ weather }),
}));
// add world state persistence
// add citizen state sync
// add UI state optimization
// add landmark cache
// add dream object registry
// add particle system state
// add audio manager state
// add weather state
// add time state
// add camera state
