"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

export function Campfire({ position }: { position: [number, number, number] }) {
  const fireRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (fireRef.current) {
      const t = clock.elapsedTime * 4;
      fireRef.current.scale.y = 1 + Math.sin(t * 3) * 0.15;
      fireRef.current.scale.x = 1 + Math.sin(t * 2.5 + 1) * 0.1;
    }
    if (glowRef.current) {
      const t = clock.elapsedTime;
      (glowRef.current.material as any).emissiveIntensity = 0.3 + Math.sin(t * 2) * 0.15;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.03, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.25, 0.06, 8]} />
        <meshStandardMaterial color="#4a3a2a" roughness={0.9} />
      </mesh>
      {[0, 0.1, -0.1, 0.05, -0.05].map((offset, i) => (
        <mesh key={i} position={[offset, 0.06, Math.sin(i * 1.5) * 0.1]} castShadow>
          <cylinderGeometry args={[0.01, 0.015, 0.08, 4]} />
          <meshStandardMaterial color="#3a2a1a" roughness={0.9} />
        </mesh>
      ))}
      <mesh ref={fireRef} position={[0, 0.1, 0]}>
        <coneGeometry args={[0.06, 0.12, 6]} />
        <meshStandardMaterial color="#f0a030" emissive="#f06020" emissiveIntensity={2} transparent opacity={0.9} />
      </mesh>
      <mesh ref={glowRef} position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.3, 8, 6]} />
        <meshStandardMaterial color="#f0c96b" emissive="#f0c96b" emissiveIntensity={0.3} transparent opacity={0.2} />
      </mesh>
      <pointLight position={[0, 0.3, 0]} intensity={8} color="#f0a030" distance={6} decay={2} />
    </group>
  );
}
