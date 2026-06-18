"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Group, Mesh } from "three";

interface StarProps {
  position: [number, number, number];
  size: number;
  speed: number;
  color?: string;
}

function Star({ position, size, speed, color = "#fff8e0" }: StarProps) {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const pulse = 0.5 + Math.sin(clock.elapsedTime * speed + position[0]) * 0.5;
      ref.current.scale.setScalar(0.5 + pulse * 0.5);
      (ref.current.material as any).emissiveIntensity = 0.3 + pulse * 0.7;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[size, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

export function StarField() {
  const stars = useMemo(() =>
    Array.from({ length: 120 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 60,
        10 + Math.random() * 20,
        (Math.random() - 0.5) * 60,
      ] as [number, number, number],
      size: 0.05 + Math.random() * 0.15,
      speed: 0.3 + Math.random() * 1.2,
      color: ["#fff8e0", "#f0c96b", "#87ceeb", "#ff6b9d"][Math.floor(Math.random() * 4)],
    }))
  , []);

  return (
    <group>
      {stars.map((star, i) => (
        <Star key={i} {...star} />
      ))}
    </group>
  );
}
