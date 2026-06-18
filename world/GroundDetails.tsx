"use client";

export function GroundDetails() {
  return (
    <group>
      <Rocks />
      <Pebbles />
      <MossPatches />
    </group>
  );
}

function Rock({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.1 * scale, 0]} />
      <meshStandardMaterial color="#6a6a6a" roughness={0.9} />
    </mesh>
  );
}

function Rocks() {
  return (
    <group>
      <Rock position={[-8, 0, -2]} scale={2} />
      <Rock position={[-7.5, 0, -1.5]} scale={1.2} />
      <Rock position={[6, 0, 5]} scale={1.5} />
      <Rock position={[6.4, 0, 4.6]} scale={1} />
      <Rock position={[7, 0, -6]} scale={3} />
      <Rock position={[6.5, 0, -5.5]} scale={1.8} />
      <Rock position={[-5, 0, 7]} scale={2.2} />
    </group>
  );
}

function Pebble({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} castShadow>
      <icosahedronGeometry args={[0.03, 0]} />
      <meshStandardMaterial color="#7a7a7a" roughness={0.9} />
    </mesh>
  );
}

function Pebbles() {
  return (
    <group>
      {Array.from({ length: 20 }, (_, i) => (
        <Pebble key={i} position={[(Math.random() - 0.5) * 14, 0, (Math.random() - 0.5) * 14]} />
      ))}
    </group>
  );
}

function MossPatches() {
  return (
    <group>
      {Array.from({ length: 15 }, (_, i) => (
        <mesh key={i} position={[(Math.random() - 0.5) * 12, 0.02, (Math.random() - 0.5) * 12]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.08 + Math.random() * 0.15, 6]} />
          <meshStandardMaterial color="#4a7a3a" roughness={0.95} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}
