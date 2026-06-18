"use client";

import { useMemo } from "react";

export function VegetationSystem() {
  return (
    <group>
      <TreeForest />
      <BushClusters />
      <MeadowFlowers />
      <GrassTufts />
    </group>
  );
}

function Tree({ position, scale = 1, variant = 0 }: { position: [number, number, number]; scale?: number; variant?: number }) {
  const trunkH = 0.8 + variant * 0.2;
  const canopyR = 0.5 + variant * 0.15;
  const leafColor = variant % 3 === 0 ? "#3a7a28" : variant % 3 === 1 ? "#4a8a38" : "#2d6b1e";
  const treeType = variant % 4;

  if (treeType === 0) {
    // Round tree
    return (
      <group position={position} scale={scale}>
        <mesh position={[0, trunkH / 2, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.12, trunkH, 8]} />
          <meshStandardMaterial color="#4a2a18" roughness={0.92} />
        </mesh>
        <mesh position={[0, trunkH + canopyR * 0.5, 0]} castShadow>
          <sphereGeometry args={[canopyR, 10, 8]} />
          <meshStandardMaterial color={leafColor} roughness={0.85} />
        </mesh>
      </group>
    );
  } else if (treeType === 1) {
    // Pine tree
    return (
      <group position={position} scale={scale}>
        <mesh position={[0, trunkH * 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.1, trunkH * 0.8, 8]} />
          <meshStandardMaterial color="#4a2a18" roughness={0.92} />
        </mesh>
        <mesh position={[0, trunkH * 0.8 + 0.3, 0]} castShadow>
          <coneGeometry args={[0.5, 0.5, 8]} />
          <meshStandardMaterial color="#2d5a1e" roughness={0.85} />
        </mesh>
        <mesh position={[0, trunkH * 0.8 + 0.6, 0]} castShadow>
          <coneGeometry args={[0.4, 0.4, 8]} />
          <meshStandardMaterial color="#2d5a1e" roughness={0.85} />
        </mesh>
        <mesh position={[0, trunkH * 0.8 + 0.85, 0]} castShadow>
          <coneGeometry args={[0.3, 0.3, 8]} />
          <meshStandardMaterial color="#2d5a1e" roughness={0.85} />
        </mesh>
      </group>
    );
  } else {
    // Multi-canopy tree
    return (
      <group position={position} scale={scale}>
        <mesh position={[0, trunkH / 2, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.1, trunkH, 8]} />
          <meshStandardMaterial color="#4a2a18" roughness={0.92} />
        </mesh>
        <mesh position={[0, trunkH + 0.2, 0]} castShadow>
          <sphereGeometry args={[canopyR * 0.7, 8, 6]} />
          <meshStandardMaterial color={leafColor} roughness={0.85} />
        </mesh>
        <mesh position={[0.3, trunkH, 0.2]} castShadow>
          <sphereGeometry args={[canopyR * 0.5, 8, 6]} />
          <meshStandardMaterial color={leafColor} roughness={0.85} />
        </mesh>
        <mesh position={[-0.25, trunkH + 0.1, -0.2]} castShadow>
          <sphereGeometry args={[canopyR * 0.5, 8, 6]} />
          <meshStandardMaterial color={leafColor} roughness={0.85} />
        </mesh>
      </group>
    );
  }
}

function TreeForest() {
  const trees = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      position: [
        Math.cos(i * 0.9) * (3 + (i % 5) * 1.8) + (Math.random() - 0.5) * 1.5,
        0,
        Math.sin(i * 0.7) * (3 + (i % 4) * 2.0) + (Math.random() - 0.5) * 1.5,
      ] as [number, number, number],
      scale: 0.6 + Math.random() * 0.6,
      variant: Math.floor(Math.random() * 4),
    }))
  , []);

  return (
    <group>
      {trees.map((tree, i) => (
        <Tree key={i} {...tree} />
      ))}
    </group>
  );
}

function Bush({ position, scale = 1, color = "#3a6a2a" }: { position: [number, number, number]; scale?: number; color?: string }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.1, 0]} castShadow>
        <sphereGeometry args={[0.2, 8, 6]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      <mesh position={[0.15, 0.05, 0.1]} castShadow>
        <sphereGeometry args={[0.15, 8, 6]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      <mesh position={[-0.1, 0.08, -0.1]} castShadow>
        <sphereGeometry args={[0.12, 8, 6]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
    </group>
  );
}

function BushClusters() {
  const bushes = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 18,
        0,
        (Math.random() - 0.5) * 18,
      ] as [number, number, number],
      scale: 0.5 + Math.random() * 0.6,
      color: ["#3a6a2a", "#4a7a3a", "#2d5a1e", "#5a8a4a"][Math.floor(Math.random() * 4)],
    }))
  , []);

  return (
    <group>
      {bushes.map((bush, i) => (
        <Bush key={i} {...bush} />
      ))}
    </group>
  );
}

function Flower({ position, color = "#ff6b9d", scale = 1 }: { position: [number, number, number]; color?: string; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.005, 0.01, 0.15, 6]} />
        <meshStandardMaterial color="#3a6a2a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.16, 0]} castShadow>
        <sphereGeometry args={[0.03, 6, 4]} />
        <meshStandardMaterial color={color} roughness={0.6} emissive={color} emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}

function MeadowFlowers() {
  const flowers = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 16,
        0,
        (Math.random() - 0.5) * 16,
      ] as [number, number, number],
      color: ["#ff6b9d", "#ffd93d", "#6bcb77", "#4d96ff", "#c68fe6", "#ff9f43"][Math.floor(Math.random() * 6)],
      scale: 0.5 + Math.random() * 0.5,
    }))
  , []);

  return (
    <group>
      {flowers.map((flower, i) => (
        <Flower key={i} {...flower} />
      ))}
    </group>
  );
}

function GrassTuft({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {[0, 0.3, 0.6, 0.9].map((offset, j) => (
        <mesh key={j} position={[Math.sin(offset) * 0.08, offset * 0.06, Math.cos(offset) * 0.08]} castShadow>
          <coneGeometry args={[0.015, 0.12, 4]} />
          <meshStandardMaterial color="#4a7a3a" roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function GrassTufts() {
  const tufts = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        0,
        (Math.random() - 0.5) * 20,
      ] as [number, number, number],
      scale: 0.5 + Math.random() * 0.5,
    }))
  , []);

  return (
    <group>
      {tufts.map((tuft, i) => (
        <GrassTuft key={i} {...tuft} />
      ))}
    </group>
  );
}
