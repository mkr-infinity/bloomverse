"use client";

export function Seating() {
  return (
    <group>
      <WoodenBench position={[-4, 0, 3]} rotation={[0, 0.8, 0]} />
      <WoodenBench position={[5, 0, -4]} rotation={[0, -0.5, 0]} />
      <WoodenBench position={[0, 0, 7]} rotation={[0, 0, 0]} />
      <StumpSeat position={[-6, 0, -2]} />
      <StumpSeat position={[-5.5, 0, -1.5]} />
      <StumpSeat position={[7, 0, 3]} />
    </group>
  );
}

function WoodenBench({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.5, 0.04, 0.18]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.3, -0.07]} castShadow>
        <boxGeometry args={[0.5, 0.18, 0.03]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.85} />
      </mesh>
      <mesh position={[-0.2, 0.07, 0]} castShadow>
        <boxGeometry args={[0.03, 0.14, 0.16]} />
        <meshStandardMaterial color="#5a3a1b" roughness={0.9} />
      </mesh>
      <mesh position={[0.2, 0.07, 0]} castShadow>
        <boxGeometry args={[0.03, 0.14, 0.16]} />
        <meshStandardMaterial color="#5a3a1b" roughness={0.9} />
      </mesh>
    </group>
  );
}

function StumpSeat({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} castShadow>
      <cylinderGeometry args={[0.1, 0.12, 0.15, 8]} />
      <meshStandardMaterial color="#5a3a1b" roughness={0.9} />
    </mesh>
  );
}
