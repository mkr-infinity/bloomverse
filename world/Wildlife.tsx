"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Group, Mesh } from "three";

export function Wildlife() {
  return (
    <group>
      <ButterflyField />
      <FireflyField />
      <FrogPond position={[-5, 0, -4]} />
    </group>
  );
}

function Butterfly({ position, seed }: { position: [number, number, number]; seed: number }) {
  const ref = useRef<Group>(null);
  const wingLRef = useRef<Mesh>(null);
  const wingRRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 0.5 + seed;
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(t * 2 + seed) * 0.3;
      ref.current.position.x = position[0] + Math.sin(t * 0.7) * 0.5;
      ref.current.position.z = position[2] + Math.cos(t * 0.6) * 0.5;
      ref.current.rotation.y = t * 0.5;
    }
    const wingT = Math.sin(clock.elapsedTime * 8 + seed) * 0.8;
    if (wingLRef.current) wingLRef.current.rotation.z = 0.3 + wingT;
    if (wingRRef.current) wingRRef.current.rotation.z = -0.3 - wingT;
  });

  const color = ["#ff6b9d", "#ffd93d", "#6bcb77", "#4d96ff", "#c68fe6"][seed % 5];

  return (
    <group ref={ref} position={position} scale={0.3}>
      <mesh>
        <sphereGeometry args={[0.04, 6, 4]} />
        <meshStandardMaterial color="#2a2a3a" />
      </mesh>
      <group ref={wingLRef} position={[0.04, 0, 0]}>
        <mesh rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.2, 0.005, 0.08]} />
          <meshStandardMaterial color={color} transparent opacity={0.8} />
        </mesh>
      </group>
      <group ref={wingRRef} position={[-0.04, 0, 0]}>
        <mesh rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.2, 0.005, 0.08]} />
          <meshStandardMaterial color={color} transparent opacity={0.8} />
        </mesh>
      </group>
    </group>
  );
}

function ButterflyField() {
  const butterflies = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 12,
        1 + Math.random() * 2,
        (Math.random() - 0.5) * 12,
      ] as [number, number, number],
      seed: i,
    }))
  , []);

  return (
    <group>
      {butterflies.map((b, i) => (
        <Butterfly key={i} {...b} />
      ))}
    </group>
  );
}

function Firefly({ position, seed }: { position: [number, number, number]; seed: number }) {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.elapsedTime * 0.3 + seed;
      ref.current.position.x = position[0] + Math.sin(t * 0.5) * 1.5;
      ref.current.position.z = position[2] + Math.cos(t * 0.7) * 1.5;
      ref.current.position.y = position[1] + Math.sin(t * 0.8) * 0.5;
      const pulse = 0.3 + Math.sin(clock.elapsedTime * 3 + seed * 2) * 0.7;
      ref.current.scale.setScalar(0.5 + pulse * 0.5);
      (ref.current.material as any).emissiveIntensity = pulse;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.03, 6, 4]} />
      <meshStandardMaterial
        color="#f0e68c"
        emissive="#f0c96b"
        emissiveIntensity={0.5}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

function FireflyField() {
  const fireflies = useMemo(() =>
    Array.from({ length: 25 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 15,
        0.5 + Math.random() * 2,
        (Math.random() - 0.5) * 15,
      ] as [number, number, number],
      seed: i,
    }))
  , []);

  return (
    <group>
      {fireflies.map((f, i) => (
        <Firefly key={i} {...f} />
      ))}
    </group>
  );
}

function FrogPond({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 12]} />
        <meshStandardMaterial color="#3a6a4a" roughness={0.9} />
      </mesh>
    </group>
  );
}
