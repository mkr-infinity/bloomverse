"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Mesh, Color } from "three";
import type { CharacterData } from "./CharacterCreator";

export function CharacterAvatar3D({ data, position = [0, 0, 0] as [number, number, number] }: { data: CharacterData; position?: [number, number, number] }) {
  const groupRef = useRef<Group>(null);
  const colors = useMemo(() => data.colors.map((c) => new Color(c)), [data.colors]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.8) * 0.1;
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.2) * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.2, 0.4, 8, 12]} />
        <meshStandardMaterial color={colors[0]} roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh position={[0, 1.4, 0]} castShadow>
        <sphereGeometry args={[0.2, 12, 10]} />
        <meshStandardMaterial color="#f0d0a0" roughness={0.5} />
      </mesh>
      <mesh position={[-0.08, 1.42, 0.18]} castShadow>
        <sphereGeometry args={[0.02, 6, 4]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.3} />
      </mesh>
      <mesh position={[0.08, 1.42, 0.18]} castShadow>
        <sphereGeometry args={[0.02, 6, 4]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.3} />
      </mesh>
      {data.accessory === 'crown' && (
        <mesh position={[0, 1.6, 0]} castShadow>
          <torusGeometry args={[0.12, 0.015, 8, 12]} />
          <meshStandardMaterial color={colors[1]} roughness={0.2} metalness={0.6} emissive={colors[1]} emissiveIntensity={0.2} />
        </mesh>
      )}
      {data.accessory === 'glow' && (
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.35, 8, 6]} />
          <meshStandardMaterial color={colors[2]} transparent opacity={0.15} emissive={colors[2]} emissiveIntensity={0.4} />
        </mesh>
      )}
      {data.accessory === 'wings' && (
        <>
          <mesh position={[0.2, 1.2, 0]} rotation={[0, 0, -0.3]}>
            <planeGeometry args={[0.25, 0.15]} />
            <meshStandardMaterial color={colors[2]} transparent opacity={0.5} side={2} emissive={colors[2]} emissiveIntensity={0.2} />
          </mesh>
          <mesh position={[-0.2, 1.2, 0]} rotation={[0, 0, 0.3]}>
            <planeGeometry args={[0.25, 0.15]} />
            <meshStandardMaterial color={colors[2]} transparent opacity={0.5} side={2} emissive={colors[2]} emissiveIntensity={0.2} />
          </mesh>
        </>
      )}
      <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.25, 0.3, 16]} />
        <meshStandardMaterial color={colors[1]} transparent opacity={0.4} emissive={colors[1]} emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}
