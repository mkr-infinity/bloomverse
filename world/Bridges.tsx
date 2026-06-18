"use client";

export function Bridges() {
  return (
    <group>
      <WoodBridge start={[-9, 0, 4]} end={[-6, 0, 4]} />
      <WoodBridge start={[6, 0, -5]} end={[9, 0, -5]} />
      <ArchBridge start={[-4, 0, -8]} end={[-4, 0, -5]} />
    </group>
  );
}

function WoodBridge({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const length = Math.sqrt(
    Math.pow(end[0] - start[0], 2) + Math.pow(end[2] - start[2], 2)
  );
  const angle = Math.atan2(end[2] - start[2], end[0] - start[0]);
  const mid: [number, number, number] = [
    (start[0] + end[0]) / 2,
    0.1,
    (start[2] + end[2]) / 2
  ];

  return (
    <group position={mid} rotation={[0, -angle, 0]}>
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[length, 0.03, 0.25]} />
        <meshStandardMaterial color="#6a4a2a" roughness={0.9} />
      </mesh>
      <mesh position={[-length / 2 + 0.05, 0.15, 0]} castShadow>
        <boxGeometry args={[0.02, 0.12, 0.02]} />
        <meshStandardMaterial color="#5a3a1b" roughness={0.9} />
      </mesh>
      <mesh position={[length / 2 - 0.05, 0.15, 0]} castShadow>
        <boxGeometry args={[0.02, 0.12, 0.02]} />
        <meshStandardMaterial color="#5a3a1b" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.15, 0.1]} castShadow>
        <boxGeometry args={[length, 0.02, 0.01]} />
        <meshStandardMaterial color="#5a3a1b" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.15, -0.1]} castShadow>
        <boxGeometry args={[length, 0.02, 0.01]} />
        <meshStandardMaterial color="#5a3a1b" roughness={0.9} />
      </mesh>
    </group>
  );
}

function ArchBridge({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const mid: [number, number, number] = [
    (start[0] + end[0]) / 2,
    0,
    (start[2] + end[2]) / 2
  ];

  return (
    <group position={mid}>
      <mesh position={[0, 0.3, 0]} rotation={[0, 0, 0.1]} castShadow>
        <torusGeometry args={[0.5, 0.04, 8, 12, Math.PI]} />
        <meshStandardMaterial color="#7a6a5a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[1.0, 0.03, 0.3]} />
        <meshStandardMaterial color="#7a6a5a" roughness={0.85} />
      </mesh>
    </group>
  );
}
