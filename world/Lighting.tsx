"use client";

export function Lighting() {
  return (
    <group>
      <StreetLamp position={[-8, 0, 0]} />
      <StreetLamp position={[8, 0, 0]} />
      <StreetLamp position={[0, 0, -8]} />
      <StreetLamp position={[0, 0, 8]} />
      <GroundLantern position={[-3, 0, 5]} />
      <GroundLantern position={[3, 0, 5]} />
      <GroundLantern position={[-5, 0, -6]} />
      <HangingLantern position={[-2, 1.2, -4]} />
      <HangingLantern position={[2, 1.2, 4]} />
    </group>
  );
}

function StreetLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.03, 1.4, 8]} />
        <meshStandardMaterial color="#2a2a3a" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0, 1.45, 0]} castShadow>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshStandardMaterial color="#fff5e0" emissive="#f0c96b" emissiveIntensity={1} />
      </mesh>
      <pointLight position={[0, 1.4, 0]} intensity={4} color="#f0c96b" distance={4} decay={2} />
    </group>
  );
}

function GroundLantern({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.07, 0.3, 8]} />
        <meshStandardMaterial color="#3a3a4a" roughness={0.5} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.05, 8, 6]} />
        <meshStandardMaterial color="#fff5e0" emissive="#f0c96b" emissiveIntensity={0.8} />
      </mesh>
      <pointLight position={[0, 0.3, 0]} intensity={2} color="#f0c96b" distance={3} decay={2} />
    </group>
  );
}

function HangingLantern({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, -0.1, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.12, 8]} />
        <meshStandardMaterial color="#3a3a4a" roughness={0.5} metalness={0.5} />
      </mesh>
      <mesh position={[0, -0.18, 0]}>
        <sphereGeometry args={[0.04, 8, 6]} />
        <meshStandardMaterial color="#fff5e0" emissive="#f0c96b" emissiveIntensity={0.6} />
      </mesh>
      <pointLight position={[0, -0.18, 0]} intensity={1.5} color="#f0c96b" distance={2.5} decay={2} />
    </group>
  );
}
