"use client";

export function BuildingSystem() {
  return (
    <group>
      <Cabin position={[-3, 0, -5]} rotation={[0, 0.5, 0]} />
      <Cabin position={[4, 0, 4]} rotation={[0, -0.3, 0]} />
      <Tower position={[-6, 0, 2]} />
      <SmallHouse position={[5, 0, -4]} rotation={[0, 0.8, 0]} />
    </group>
  );
}

function Cabin({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.8, 0.6, 0.7]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.3, 0.1, 0.3]} />
        <meshStandardMaterial color="#5a3a1b" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.75, 0]} castShadow>
        <coneGeometry args={[0.6, 0.3, 4]} />
        <meshStandardMaterial color="#6f4a3e" roughness={0.78} />
      </mesh>
      <mesh position={[0.15, 0.35, 0.36]}>
        <boxGeometry args={[0.15, 0.15, 0.01]} />
        <meshStandardMaterial color="#f0c96b" roughness={0.5} emissive="#f0c96b" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

function Tower({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 1.0, 8]} />
        <meshStandardMaterial color="#7a6a5a" roughness={0.75} />
      </mesh>
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.2, 0.1, 8]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow>
        <coneGeometry args={[0.3, 0.2, 8]} />
        <meshStandardMaterial color="#4a3a2a" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.9, 0.18]}>
        <boxGeometry args={[0.08, 0.08, 0.01]} />
        <meshStandardMaterial color="#f0c96b" emissive="#f0c96b" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function SmallHouse({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.5, 0.4, 0.5]} />
        <meshStandardMaterial color="#c88768" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.45, 0]} castShadow>
        <coneGeometry args={[0.4, 0.25, 4]} />
        <meshStandardMaterial color="#6f4a3e" roughness={0.78} />
      </mesh>
      <mesh position={[0, 0.65, 0]} castShadow>
        <sphereGeometry args={[0.04, 6, 4]} />
        <meshStandardMaterial color="#c96b5f" roughness={0.5} />
      </mesh>
    </group>
  );
}
