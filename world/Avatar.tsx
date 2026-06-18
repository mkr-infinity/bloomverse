"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Mesh } from "three";

interface AvatarProps {
  color?: string;
  scale?: number;
  animate?: boolean;
}

export function Avatar({ color = "#f0c96b", scale = 1, animate = true }: AvatarProps) {
  const groupRef = useRef<Group>(null);
  const headRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (animate && groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.1;
    }
    if (animate && headRef.current) {
      headRef.current.position.y = 1.2 + Math.sin(clock.elapsedTime * 2) * 0.02;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Body */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <capsuleGeometry args={[0.2, 0.4, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* Head */}
      <mesh ref={headRef} position={[0, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 12]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.08, 1.22, 0.2]}>
        <sphereGeometry args={[0.04, 8, 6]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.3} />
      </mesh>
      <mesh position={[0.08, 1.22, 0.2]}>
        <sphereGeometry args={[0.04, 8, 6]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.3} />
      </mesh>
      
      {/* Smile */}
      <mesh position={[0, 1.15, 0.22]} rotation={[0.2, 0, 0]}>
        <torusGeometry args={[0.06, 0.015, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#c96b5f" roughness={0.5} />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.3, 0.7, 0]} rotation={[0, 0, 0.3]} castShadow>
        <capsuleGeometry args={[0.06, 0.25, 4, 8]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[0.3, 0.7, 0]} rotation={[0, 0, -0.3]} castShadow>
        <capsuleGeometry args={[0.06, 0.25, 4, 8]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.1, 0.15, 0]} castShadow>
        <capsuleGeometry args={[0.07, 0.2, 4, 8]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />
      </mesh>
      <mesh position={[0.1, 0.15, 0]} castShadow>
        <capsuleGeometry args={[0.07, 0.2, 4, 8]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />
      </mesh>
      
      {/* Hat */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 0.15, 12]} />
        <meshStandardMaterial color="#6f4a3e" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.48, 0]} castShadow>
        <coneGeometry args={[0.18, 0.1, 12]} />
        <meshStandardMaterial color="#6f4a3e" roughness={0.7} />
      </mesh>
    </group>
  );
}

export function CitizenAvatar({ role = "explorer", color }: { role?: string; color?: string }) {
  const roleColors: Record<string, string> = {
    explorer: "#4a90d9",
    creator: "#d94a6b",
    guardian: "#4ad97a",
    dreamer: "#9b4ad9",
    elder: "#d9a74a",
  };

  const avatarColor = color || roleColors[role] || "#f0c96b";

  return <Avatar color={avatarColor} scale={0.8} />;
}
