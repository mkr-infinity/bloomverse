"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Mesh } from "three";

export function AtmosphericFog() {
  const particles = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 25,
        0.5 + Math.random() * 3,
        (Math.random() - 0.5) * 25,
      ] as [number, number, number],
      speed: 0.2 + Math.random() * 0.3,
      size: 0.3 + Math.random() * 0.5,
    }))
  , []);

  return (
    <group>
      {particles.map((p, i) => (
        <FogParticle key={i} {...p} />
      ))}
    </group>
  );
}

function FogParticle({ position, speed, size }: { position: [number, number, number]; speed: number; size: number }) {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.elapsedTime * speed;
      ref.current.position.x += Math.sin(t * 0.3) * 0.003;
      ref.current.position.z += Math.cos(t * 0.2) * 0.003;
      (ref.current.material as any).opacity = 0.15 + Math.sin(t * 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 6, 4]} />
      <meshStandardMaterial color="#c8d0d8" transparent opacity={0.2} roughness={1} />
    </mesh>
  );
}
