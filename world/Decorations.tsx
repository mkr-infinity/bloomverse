"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Mesh } from "three";

interface BenchProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

export function Bench({ position, rotation = [0, 0, 0] }: BenchProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.6, 0.05, 0.2]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.8} />
      </mesh>
      
      {/* Backrest */}
      <mesh position={[0, 0.4, -0.08]} castShadow>
        <boxGeometry args={[0.6, 0.2, 0.03]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.8} />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.25, 0.12, 0]} castShadow>
        <boxGeometry args={[0.04, 0.24, 0.15]} />
        <meshStandardMaterial color="#5a3a1b" roughness={0.9} />
      </mesh>
      <mesh position={[0.25, 0.12, 0]} castShadow>
        <boxGeometry args={[0.04, 0.24, 0.15]} />
        <meshStandardMaterial color="#5a3a1b" roughness={0.9} />
      </mesh>
    </group>
  );
}

interface SignPostProps {
  position: [number, number, number];
  text?: string;
  rotation?: [number, number, number];
}

export function SignPost({ position, text = "Welcome", rotation = [0, 0, 0] }: SignPostProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Post */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.04, 1, 8]} />
        <meshStandardMaterial color="#5a3a1b" roughness={0.9} />
      </mesh>
      
      {/* Sign board */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[0.4, 0.2, 0.03]} />
        <meshStandardMaterial color="#c9a96a" roughness={0.7} />
      </mesh>
      
      {/* Sign border */}
      <mesh position={[0, 0.9, 0.02]}>
        <boxGeometry args={[0.38, 0.18, 0.01]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.8} />
      </mesh>
    </group>
  );
}

interface LampPostProps {
  position: [number, number, number];
  intensity?: number;
}

export function LampPost({ position, intensity = 1 }: LampPostProps) {
  const lightRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (lightRef.current) {
      const pulse = 0.8 + Math.sin(clock.elapsedTime * 2) * 0.2;
      (lightRef.current.material as any).emissiveIntensity = pulse * intensity;
    }
  });

  return (
    <group position={position}>
      {/* Post */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.035, 1.6, 8]} />
        <meshStandardMaterial color="#2a2a3a" roughness={0.4} metalness={0.6} />
      </mesh>
      
      {/* Lamp head */}
      <mesh position={[0, 1.65, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.1, 12]} />
        <meshStandardMaterial color="#3a3a4a" roughness={0.5} metalness={0.5} />
      </mesh>
      
      {/* Light bulb */}
      <mesh ref={lightRef} position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshStandardMaterial 
          color="#fff5e0" 
          emissive="#f0c96b" 
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Point light */}
      <pointLight position={[0, 1.6, 0]} intensity={intensity * 2} color="#f0c96b" distance={5} decay={2} />
    </group>
  );
}

interface FountainProps {
  position: [number, number, number];
}

export function Fountain({ position }: FountainProps) {
  const waterRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (waterRef.current) {
      waterRef.current.position.y = 0.3 + Math.sin(clock.elapsedTime * 3) * 0.02;
    }
  });

  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.6, 0.3, 16]} />
        <meshStandardMaterial color="#8a8a8a" roughness={0.7} metalness={0.2} />
      </mesh>
      
      {/* Basin */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.3, 0.15, 16]} />
        <meshStandardMaterial color="#7a7a8a" roughness={0.6} metalness={0.3} />
      </mesh>
      
      {/* Water */}
      <mesh ref={waterRef} position={[0, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.35, 16]} />
        <meshStandardMaterial 
          color="#4a7a9a" 
          roughness={0.2} 
          metalness={0.4}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Center pillar */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 0.4, 8]} />
        <meshStandardMaterial color="#6a6a7a" roughness={0.5} metalness={0.4} />
      </mesh>
      
      {/* Top ornament */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <sphereGeometry args={[0.08, 8, 6]} />
        <meshStandardMaterial color="#f0c96b" roughness={0.3} metalness={0.6} />
      </mesh>
    </group>
  );
}

interface FlowerPotProps {
  position: [number, number, number];
  flowerColor?: string;
}

export function FlowerPot({ position, flowerColor = "#ff6b9d" }: FlowerPotProps) {
  return (
    <group position={position}>
      {/* Pot */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.08, 0.2, 12]} />
        <meshStandardMaterial color="#c88768" roughness={0.8} />
      </mesh>
      
      {/* Soil */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.02, 12]} />
        <meshStandardMaterial color="#4a3a2a" roughness={0.9} />
      </mesh>
      
      {/* Stem */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.01, 0.015, 0.2, 6]} />
        <meshStandardMaterial color="#3a6a2a" roughness={0.8} />
      </mesh>
      
      {/* Flower */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <sphereGeometry args={[0.05, 8, 6]} />
        <meshStandardMaterial color={flowerColor} roughness={0.6} emissive={flowerColor} emissiveIntensity={0.2} />
      </mesh>
      
      {/* Leaves */}
      <mesh position={[-0.03, 0.32, 0]} rotation={[0, 0, 0.5]}>
        <sphereGeometry args={[0.025, 6, 4]} />
        <meshStandardMaterial color="#4a8a3a" roughness={0.7} />
      </mesh>
      <mesh position={[0.03, 0.34, 0]} rotation={[0, 0, -0.5]}>
        <sphereGeometry args={[0.025, 6, 4]} />
        <meshStandardMaterial color="#4a8a3a" roughness={0.7} />
      </mesh>
    </group>
  );
}
