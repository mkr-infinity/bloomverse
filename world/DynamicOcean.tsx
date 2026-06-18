"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";

export function DynamicOcean() {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.elapsedTime;
      meshRef.current.position.y = Math.sin(t * 0.3) * 0.05;
      (meshRef.current.material as any).opacity = 0.7 + Math.sin(t * 0.2) * 0.15;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <circleGeometry args={[22, 64]} />
        <meshStandardMaterial
          color="#2a5a7a"
          roughness={0.15}
          metalness={0.45}
          transparent
          opacity={0.7}
          emissive="#1a3a5a"
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]}>
        <ringGeometry args={[18, 22, 48]} />
        <meshStandardMaterial color="#3a6a5a" roughness={0.6} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
