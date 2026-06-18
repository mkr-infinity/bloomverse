"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Group } from "three";

export function FoliageSway() {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.elapsedTime;
      groupRef.current.children.forEach((child, i) => {
        child.rotation.z = Math.sin(t * 0.8 + i * 0.5) * 0.01;
        child.rotation.x = Math.sin(t * 0.6 + i * 0.3) * 0.008;
      });
    }
  });

  return <group ref={groupRef} />;
}

export function WaterRipple({ position, radius = 0.5 }: { position: [number, number, number]; radius?: number }) {
  const ref = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(clock.elapsedTime * 2 + position[0] + position[2]) * 0.01;
    }
  });

  return (
    <group ref={ref} position={[position[0], position[1], position[2]]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius, 16]} />
        <meshStandardMaterial
          color="#3a7a9a"
          roughness={0.15}
          metalness={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[radius * 0.8, radius * 0.95, 16]} />
        <meshStandardMaterial color="#4a8aaa" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}
