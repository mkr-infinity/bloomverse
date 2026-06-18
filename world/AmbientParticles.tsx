"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Mesh } from "three";

export function AmbientParticles() {
  return (
    <group>
      <Pollen />
      <DustMotes />
      <LeafFall />
    </group>
  );
}

function Pollen() {
  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        0.5 + Math.random() * 3,
        (Math.random() - 0.5) * 20,
      ] as [number, number, number],
      speed: 0.1 + Math.random() * 0.2,
      size: 0.008 + Math.random() * 0.01,
    }))
  , []);

  return (
    <group>
      {particles.map((p, i) => (
        <FloatingParticle key={i} {...p} color="#f0e68c" />
      ))}
    </group>
  );
}

function DustMotes() {
  const particles = useMemo(() =>
    Array.from({ length: 25 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 16,
        1 + Math.random() * 4,
        (Math.random() - 0.5) * 16,
      ] as [number, number, number],
      speed: 0.05 + Math.random() * 0.1,
      size: 0.01 + Math.random() * 0.015,
    }))
  , []);

  return (
    <group>
      {particles.map((p, i) => (
        <FloatingParticle key={i} {...p} color="#d8d0c0" />
      ))}
    </group>
  );
}

function LeafFall() {
  const leaves = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 15,
        3 + Math.random() * 2,
        (Math.random() - 0.5) * 15,
      ] as [number, number, number],
      speed: 0.05 + Math.random() * 0.1,
      rotationSpeed: 0.5 + Math.random() * 1,
    }))
  , []);

  return (
    <group>
      {leaves.map((l, i) => (
        <FallingLeaf key={i} {...l} />
      ))}
    </group>
  );
}

function FloatingParticle({ position, speed, size, color }: { position: [number, number, number]; speed: number; size: number; color: string }) {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.elapsedTime * speed;
      ref.current.position.y += Math.sin(t * 3) * 0.002;
      ref.current.position.x += Math.sin(t * 2) * 0.001;
      ref.current.position.z += Math.cos(t * 1.5) * 0.001;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 4, 3]} />
      <meshStandardMaterial color={color} transparent opacity={0.4} emissive={color} emissiveIntensity={0.2} />
    </mesh>
  );
}

function FallingLeaf({ position, speed, rotationSpeed }: { position: [number, number, number]; speed: number; rotationSpeed: number }) {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.elapsedTime * speed;
      ref.current.position.y -= 0.003;
      ref.current.position.x += Math.sin(t * 3) * 0.005;
      ref.current.position.z += Math.cos(t * 2) * 0.005;
      ref.current.rotation.z += rotationSpeed * 0.01;
      ref.current.rotation.x += rotationSpeed * 0.005;
      if (ref.current.position.y < -1) {
        ref.current.position.y = 3 + Math.random() * 2;
        ref.current.position.x = (Math.random() - 0.5) * 15;
        ref.current.position.z = (Math.random() - 0.5) * 15;
      }
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <planeGeometry args={[0.03, 0.02]} />
      <meshStandardMaterial color="#8a6a2a" roughness={0.9} transparent opacity={0.6} side={2} />
    </mesh>
  );
}
