"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, BackSide } from "three";

export function AtmosphereGlow({ radius = 5.2, color = "#4a8aaa" }: { radius?: number; color?: string }) {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.elapsedTime;
      (meshRef.current.material as any).opacity = 0.25 + Math.sin(t * 0.1) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} scale={1.02}>
      <sphereGeometry args={[radius, 48, 48]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.25}
        side={BackSide}
        roughness={0}
        metalness={0}
        emissive={color}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}
