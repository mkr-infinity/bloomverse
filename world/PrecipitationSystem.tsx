"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Mesh } from "three";

export function RainSystem({ intensity = 1 }) {
  const count = Math.floor(200 * intensity);
  const drops = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 30,
        10 + Math.random() * 5,
        (Math.random() - 0.5) * 30,
      ] as [number, number, number],
      speed: 0.3 + Math.random() * 0.2,
    }))
  , [count]);

  return (
    <group>
      {drops.map((drop, i) => (
        <RainDrop key={i} {...drop} />
      ))}
    </group>
  );
}

function RainDrop({ position, speed }: { position: [number, number, number]; speed: number }) {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y -= speed * 0.2;
      ref.current.position.x += Math.sin(clock.elapsedTime * 10 + position[0]) * 0.005;
      if (ref.current.position.y < -1) {
        ref.current.position.y = 10 + Math.random() * 3;
        ref.current.position.x = (Math.random() - 0.5) * 30;
        ref.current.position.z = (Math.random() - 0.5) * 30;
      }
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <cylinderGeometry args={[0.003, 0.003, 0.2, 4]} />
      <meshStandardMaterial color="#75b7ca" transparent opacity={0.5} />
    </mesh>
  );
}

export function SnowSystem({ intensity = 1 }) {
  const count = Math.floor(150 * intensity);
  const flakes = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 30,
        10 + Math.random() * 5,
        (Math.random() - 0.5) * 30,
      ] as [number, number, number],
      speed: 0.1 + Math.random() * 0.15,
      size: 0.02 + Math.random() * 0.03,
    }))
  , [count]);

  return (
    <group>
      {flakes.map((flake, i) => (
        <SnowFlake key={i} {...flake} />
      ))}
    </group>
  );
}

function SnowFlake({ position, speed, size }: { position: [number, number, number]; speed: number; size: number }) {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y -= speed * 0.08;
      ref.current.position.x += Math.sin(clock.elapsedTime * 1.5 + position[2]) * 0.005;
      ref.current.position.z += Math.cos(clock.elapsedTime * 1.2 + position[0]) * 0.005;
      ref.current.rotation.z += 0.01;
      if (ref.current.position.y < -1) {
        ref.current.position.y = 10 + Math.random() * 3;
        ref.current.position.x = (Math.random() - 0.5) * 30;
        ref.current.position.z = (Math.random() - 0.5) * 30;
      }
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 6, 4]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.8} />
    </mesh>
  );
}
