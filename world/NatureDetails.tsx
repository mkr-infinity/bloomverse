"use client";

export function NatureDetails() {
  return (
    <group>
      <Vines />
      <FallenLeaves />
      <BerryBushes />
    </group>
  );
}

function Vine({ position, rotation = [0, 0, 0], length = 0.3 }: { position: [number, number, number]; rotation?: [number, number, number]; length?: number }) {
  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry args={[0.005, 0.008, length, 4]} />
      <meshStandardMaterial color="#2d5a1e" roughness={0.9} />
    </mesh>
  );
}

function Vines() {
  return (
    <group>
      <Vine position={[-4.5, 0.5, 2]} rotation={[0.3, 0, 0.5]} length={0.4} />
      <Vine position={[-4.5, 0.3, 2]} rotation={[0.5, 0.2, -0.3]} length={0.3} />
      <Vine position={[5.5, 0.4, -3]} rotation={[-0.4, 0, 0.6]} length={0.35} />
    </group>
  );
}

function FallenLeaf({ position, rotation = [0, 0, 0], color = "#8a6a2a" }: { position: [number, number, number]; rotation?: [number, number, number]; color?: string }) {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[0.03, 0.02]} />
      <meshStandardMaterial color={color} roughness={0.9} transparent opacity={0.7} side={2} />
    </mesh>
  );
}

function FallenLeaves() {
  const colors = ["#8a6a2a", "#6a4a1a", "#c88768", "#d4a86a", "#4a7a3a"];
  return (
    <group>
      {Array.from({ length: 20 }, (_, i) => (
        <FallenLeaf
          key={i}
          position={[(Math.random() - 0.5) * 10, 0.01, (Math.random() - 0.5) * 10]}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
          color={colors[Math.floor(Math.random() * colors.length)]}
        />
      ))}
    </group>
  );
}

function BerryBush({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.08, 0]}>
        <sphereGeometry args={[0.08, 6, 4]} />
        <meshStandardMaterial color="#3a6a2a" roughness={0.85} />
      </mesh>
      <mesh position={[0.03, 0.12, 0.02]}>
        <sphereGeometry args={[0.015, 6, 4]} />
        <meshStandardMaterial color="#c96b5f" roughness={0.6} />
      </mesh>
      <mesh position={[-0.02, 0.1, -0.02]}>
        <sphereGeometry args={[0.012, 6, 4]} />
        <meshStandardMaterial color="#c96b5f" roughness={0.6} />
      </mesh>
    </group>
  );
}

function BerryBushes() {
  return (
    <group>
      <BerryBush position={[-3.5, 0, -3]} scale={1} />
      <BerryBush position={[4.5, 0, 2.5]} scale={1.2} />
      <BerryBush position={[-5.5, 0, 4]} scale={0.8} />
    </group>
  );
}
