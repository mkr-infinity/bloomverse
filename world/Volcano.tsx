"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Group } from "three";

export function Volcano({ position = [0, 0, 0] as [number, number, number] }) {
  const smokeRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (smokeRef.current) {
      smokeRef.current.position.y = 0.6 + Math.sin(t * 0.5) * 0.1;
      smokeRef.current.scale.setScalar(1 + Math.sin(t * 0.3) * 0.1);
      (smokeRef.current.material as any).opacity = 0.2 + Math.sin(t * 0.7) * 0.1;
    }
    if (glowRef.current) {
      const g = 0.6 + Math.sin(t * 1.2) * 0.4;
      (glowRef.current.material as any).emissiveIntensity = g;
      glowRef.current.scale.setScalar(0.8 + g * 0.3);
    }
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.01;
    }
  });

  return (
    <group ref={groupRef} position={[position[0], 0, position[2]]}>
      <mesh castShadow>
        <coneGeometry args={[0.6, 0.8, 16]} />
        <meshStandardMaterial color="#4a3a2a" roughness={0.9} metalness={0.02} />
      </mesh>
      <mesh position={[0, -0.2, 0]} castShadow>
        <cylinderGeometry args={[0.7, 0.9, 0.3, 16]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.85} metalness={0.02} />
      </mesh>
      <mesh ref={glowRef} position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.12, 8, 6]} />
        <meshStandardMaterial color="#ff6b3a" emissive="#ff6b3a" emissiveIntensity={0.8} transparent opacity={0.9} />
      </mesh>
      <mesh ref={smokeRef} position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.25, 8, 6]} />
        <meshStandardMaterial color="#6a5a4a" transparent opacity={0.2} roughness={1} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[Math.cos(i * 1.0) * 0.15, 0.1, Math.sin(i * 1.0) * 0.15]}>
          <sphereGeometry args={[0.02, 4, 3]} />
          <meshStandardMaterial color="#ff8a4a" emissive="#ff6b3a" emissiveIntensity={0.5} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}
