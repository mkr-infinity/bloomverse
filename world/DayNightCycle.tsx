"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

export function DayNightCycle() {
  const sunRef = useRef<Mesh>(null);
  const moonRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 0.02;
    const angle = t % (Math.PI * 2);
    const radius = 20;

    if (sunRef.current) {
      sunRef.current.position.x = Math.cos(angle) * radius;
      sunRef.current.position.y = Math.sin(angle) * radius + 3;
      sunRef.current.position.z = 0;
    }
    if (moonRef.current) {
      moonRef.current.position.x = Math.cos(angle + Math.PI) * radius;
      moonRef.current.position.y = Math.sin(angle + Math.PI) * radius + 3;
      moonRef.current.position.z = 0;
    }
  });

  return (
    <group>
      <mesh ref={sunRef} position={[10, 8, 0]}>
        <sphereGeometry args={[0.5, 16, 12]} />
        <meshStandardMaterial
          color="#fff5e0"
          emissive="#f0c96b"
          emissiveIntensity={2}
        />
        <pointLight intensity={50} color="#fff5e0" distance={30} decay={1} />
      </mesh>
      <mesh ref={moonRef} position={[-10, -3, 0]}>
        <sphereGeometry args={[0.3, 16, 12]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.8} emissive="#c8c0b0" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}
