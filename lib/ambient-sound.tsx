"use client";

import { useEffect, useRef, useState } from "react";

type SoundType = "ambient" | "wind" | "birds" | "water" | "click" | "hover";

export function useAmbientSound() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [currentSound, setCurrentSound] = useState<SoundType>("ambient");
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  const createOscillator = (frequency: number, type: OscillatorType = "sine", volume: number = 0.1) => {
    if (!audioContextRef.current) return null;
    
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    gainNode.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    return { oscillator, gainNode };
  };

  const playAmbient = () => {
    if (!audioContextRef.current) return;
    
    // Create ambient wind-like sound
    const osc1 = createOscillator(80, "sine", 0.05);
    const osc2 = createOscillator(120, "sine", 0.03);
    const osc3 = createOscillator(160, "triangle", 0.02);
    
    if (osc1) {
      osc1.oscillator.start();
      oscillatorsRef.current.push(osc1.oscillator);
    }
    if (osc2) {
      osc2.oscillator.start();
      oscillatorsRef.current.push(osc2.oscillator);
    }
    if (osc3) {
      osc3.oscillator.start();
      oscillatorsRef.current.push(osc3.oscillator);
    }
  };

  const playBirdChirp = () => {
    if (!audioContextRef.current) return;
    
    const osc = createOscillator(800 + Math.random() * 400, "sine", 0.1);
    if (osc) {
      osc.oscillator.start();
      osc.gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1);
      osc.oscillator.stop(audioContextRef.current.currentTime + 0.1);
    }
  };

  const playWaterDrop = () => {
    if (!audioContextRef.current) return;
    
    const osc = createOscillator(400 + Math.random() * 200, "sine", 0.15);
    if (osc) {
      osc.oscillator.start();
      osc.gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.2);
      osc.oscillator.stop(audioContextRef.current.currentTime + 0.2);
    }
  };

  const playClick = () => {
    if (!audioContextRef.current) return;
    
    const osc = createOscillator(600, "square", 0.1);
    if (osc) {
      osc.oscillator.start();
      osc.gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.05);
      osc.oscillator.stop(audioContextRef.current.currentTime + 0.05);
    }
  };

  const toggleSound = () => {
    if (isEnabled) {
      // Stop all sounds
      oscillatorsRef.current.forEach(osc => {
        try { osc.stop(); } catch (_err) { /* already stopped */ }
      });
      oscillatorsRef.current = [];
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    } else {
      // Start audio context
      audioContextRef.current = new AudioContext();
      playAmbient();
    }
    setIsEnabled(!isEnabled);
  };

  useEffect(() => {
    return () => {
      oscillatorsRef.current.forEach(osc => {
        try { osc.stop(); } catch (_err) { /* already stopped */ }
      });
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    isEnabled,
    currentSound,
    toggleSound,
    playClick,
    playBirdChirp,
    playWaterDrop,
    setCurrentSound,
  };
}
