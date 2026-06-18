"use client";

export function Agricultural() {
  return (
    <group>
      <GardenPlot position={[-7, 0, -7]} />
      <GardenPlot position={[-7, 0, -5]} />
      <CropRows position={[7, 0, 7]} />
      <Scarecrow position={[7, 0, 6]} />
    </group>
  );
}

function GardenPlot({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.5, 0.5]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.95} />
      </mesh>
      {[
        [0.1, 0, 0.1], [-0.1, 0, -0.1], [0.1, 0, -0.1], [-0.1, 0, 0.1],
        [0.15, 0, -0.05], [-0.15, 0, 0.05]
      ].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0.08, pos[2]]} castShadow>
          <cylinderGeometry args={[0.005, 0.008, 0.15, 6]} />
          <meshStandardMaterial color="#3a6a2a" roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function CropRows({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {Array.from({ length: 3 }, (_, row) =>
        Array.from({ length: 5 }, (_, col) => (
          <mesh key={`${row}-${col}`} position={[(col - 2) * 0.2, 0.06, (row - 1) * 0.2]} castShadow>
            <cylinderGeometry args={[0.008, 0.012, 0.12, 6]} />
            <meshStandardMaterial color="#4a8a3a" roughness={0.85} />
          </mesh>
        ))
      )}
    </group>
  );
}

function Scarecrow({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.02, 0.7, 6]} />
        <meshStandardMaterial color="#5a3a1b" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow>
        <sphereGeometry args={[0.06, 6, 4]} />
        <meshStandardMaterial color="#d8c8b0" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[0.15, 0.05, 0.02]} />
        <meshStandardMaterial color="#6a4a2a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.02, 0.25, 0.3]} />
        <meshStandardMaterial color="#6a4a2a" roughness={0.9} />
      </mesh>
    </group>
  );
}
