"use client";

export function Fencing() {
  return (
    <group>
      <WoodenFence positions={[[-10, 0, -8], [-10, 0, -6], [-10, 0, -4], [-10, 0, -2]]} />
      <WoodenFence positions={[[10, 0, 8], [10, 0, 6], [10, 0, 4], [10, 0, 2]]} />
      <Gate position={[0, 0, -10]} />
    </group>
  );
}

function WoodenFence({ positions }: { positions: [number, number, number][] }) {
  return (
    <group>
      {positions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh position={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[0.03, 0.6, 0.02]} />
            <meshStandardMaterial color="#6a4a2a" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.15, 0]} castShadow>
            <boxGeometry args={[0.02, 0.04, 0.3]} />
            <meshStandardMaterial color="#6a4a2a" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.35, 0]} castShadow>
            <boxGeometry args={[0.02, 0.04, 0.3]} />
            <meshStandardMaterial color="#6a4a2a" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Gate({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[-0.2, 0.3, 0]} castShadow>
        <boxGeometry args={[0.03, 0.6, 0.02]} />
        <meshStandardMaterial color="#6a4a2a" roughness={0.9} />
      </mesh>
      <mesh position={[0.2, 0.3, 0]} castShadow>
        <boxGeometry args={[0.03, 0.6, 0.02]} />
        <meshStandardMaterial color="#6a4a2a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.4, 0.04, 0.02]} />
        <meshStandardMaterial color="#6a4a2a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.4, 0.04, 0.02]} />
        <meshStandardMaterial color="#6a4a2a" roughness={0.9} />
      </mesh>
    </group>
  );
}
