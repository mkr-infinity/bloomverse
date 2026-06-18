"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

export function Waterfall({ position = [0, 0, 0] as [number, number, number], height = 1.5 }) {
  const waterRef = useRef<Mesh>(null);
  const mistRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (waterRef.current) {
      waterRef.current.position.y = position[1] + Math.sin(t * 2) * 0.03;
    }
    if (mistRef.current) {
      mistRef.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.05);
      (mistRef.current.material as any).opacity = 0.15 + Math.sin(t * 0.3) * 0.05;
    }
  });

  return (
    <group position={[position[0], 0, position[2]]}>
      <mesh position={[0, position[1] + height / 2, 0]}>
        <boxGeometry args={[0.08, height, 0.08]} />
        <meshStandardMaterial color="#8ac4d8" transparent opacity={0.6} roughness={0.1} metalness={0.2} />
      </mesh>
      <mesh ref={mistRef} position={[0, position[1] + 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 12]} />
        <meshStandardMaterial color="#a0d8e8" transparent opacity={0.15} roughness={0.3} />
      </mesh>
      <mesh ref={waterRef} position={[0, position[1] + 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.2, 12]} />
        <meshStandardMaterial color="#6ab0c8" transparent opacity={0.5} roughness={0.1} metalness={0.3} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[Math.sin(i * 1.0) * 0.12, position[1] + i * (height / 6), Math.cos(i * 0.7) * 0.12]}>
          <sphereGeometry args={[0.02, 6, 4]} />
          <meshStandardMaterial color="#b0e0f0" transparent opacity={0.3 + (i % 3) * 0.1} />
        </mesh>
      ))}
    </group>
  );
}
