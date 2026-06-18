"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

interface CloudProps {
  position: [number, number, number];
  scale: number;
  speed: number;
}

function CloudGroup({ position, scale, speed }: CloudProps) {
  const ref = useRef<any>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.x += Math.sin(clock.elapsedTime * speed * 0.1) * 0.002;
      ref.current.position.z += Math.cos(clock.elapsedTime * speed * 0.08) * 0.002;
    }
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 8, 6]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.9} transparent opacity={0.7} />
      </mesh>
      <mesh position={[0.6, 0.2, 0.3]}>
        <sphereGeometry args={[0.6, 8, 6]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.9} transparent opacity={0.65} />
      </mesh>
      <mesh position={[-0.5, 0.1, -0.4]}>
        <sphereGeometry args={[0.5, 8, 6]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.9} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0.3, 0.4, -0.2]}>
        <sphereGeometry args={[0.4, 8, 6]} />
        <meshStandardMaterial color="#d8d0c0" roughness={0.9} transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

export function CloudLayer() {
  const clouds = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 30,
        4 + Math.random() * 3,
        (Math.random() - 0.5) * 30,
      ] as [number, number, number],
      scale: 0.5 + Math.random() * 1.0,
      speed: 0.5 + Math.random() * 0.5,
    }))
  , []);

  return (
    <group>
      {clouds.map((cloud, i) => (
        <CloudGroup key={i} {...cloud} />
      ))}
    </group>
  );
}
