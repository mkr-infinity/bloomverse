"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Group } from "three";

export function DesertOasis({ position = [0, 0, 0] as [number, number, number] }) {
  const waterRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (waterRef.current) {
      const t = clock.elapsedTime;
      (waterRef.current.material as any).emissiveIntensity = 0.15 + Math.sin(t * 0.4) * 0.05;
      waterRef.current.position.y = 0.05 + Math.sin(t * 0.3) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[position[0], 0, position[2]]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <circleGeometry args={[0.6, 16]} />
        <meshStandardMaterial color="#c8b080" roughness={0.95} metalness={0} />
      </mesh>
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[0.45, 16]} />
        <meshStandardMaterial color="#3a8aaa" roughness={0.15} metalness={0.3} transparent opacity={0.85}
          emissive="#2a6a8a" emissiveIntensity={0.15}
        />
      </mesh>
      <mesh position={[0.2, 0.15, 0.15]}>
        <sphereGeometry args={[0.08, 6, 4]} />
        <meshStandardMaterial color="#6a9a4a" roughness={0.85} />
      </mesh>
      <mesh position={[-0.15, 0.12, -0.2]}>
        <sphereGeometry args={[0.06, 6, 4]} />
        <meshStandardMaterial color="#5a8a3a" roughness={0.85} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.6, 0.75, 16]} />
        <meshStandardMaterial color="#d8c090" roughness={0.9} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
