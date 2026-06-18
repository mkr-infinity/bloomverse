"use client";

export function WaterFeatures() {
  return (
    <group>
      <Well position={[-8, 0, 8]} />
      <BirdBath position={[8, 0, -8]} />
      <SmallPond position={[-2, 0, -7]} radius={0.6} />
      <Stream position={[-3, 0, -9]} end={[3, 0, -9]} />
    </group>
  );
}

function Well({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.25, 0.4, 12]} />
        <meshStandardMaterial color="#7a6a5a" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.35, 0]} castShadow>
        <torusGeometry args={[0.22, 0.03, 8, 12]} />
        <meshStandardMaterial color="#6a5a4a" roughness={0.8} />
      </mesh>
      <mesh position={[0.18, 0.4, 0]} castShadow>
        <boxGeometry args={[0.02, 0.15, 0.02]} />
        <meshStandardMaterial color="#5a3a1b" roughness={0.9} />
      </mesh>
      <mesh position={[-0.18, 0.4, 0]} castShadow>
        <boxGeometry args={[0.02, 0.15, 0.02]} />
        <meshStandardMaterial color="#5a3a1b" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.15, 0.02, 0.02]} />
        <meshStandardMaterial color="#5a3a1b" roughness={0.9} />
      </mesh>
    </group>
  );
}

function BirdBath({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.04, 0.4, 8]} />
        <meshStandardMaterial color="#8a8a8a" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.12, 0.04, 12]} />
        <meshStandardMaterial color="#8a8a8a" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.01, 12]} />
        <meshStandardMaterial color="#4a7a9a" roughness={0.2} metalness={0.3} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

function SmallPond({ position, radius }: { position: [number, number, number]; radius: number }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[radius, 16]} />
        <meshStandardMaterial color="#3a6a5a" roughness={0.7} transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <circleGeometry args={[radius * 0.6, 12]} />
        <meshStandardMaterial color="#4a7a9a" roughness={0.2} metalness={0.3} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function Stream({ position, end }: { position: [number, number, number]; end: [number, number, number] }) {
  const length = Math.sqrt(
    Math.pow(end[0] - position[0], 2) + Math.pow(end[2] - position[2], 2)
  );
  const mid: [number, number, number] = [
    (position[0] + end[0]) / 2,
    0.02,
    (position[2] + end[2]) / 2
  ];

  return (
    <mesh position={mid} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[length, 0.15]} />
      <meshStandardMaterial color="#4a7a9a" roughness={0.3} metalness={0.2} transparent opacity={0.5} />
    </mesh>
  );
}
