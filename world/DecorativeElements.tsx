"use client";

export function DecorativeElements() {
  return (
    <group>
      <Mushrooms />
      <Logs />
      <HayBales />
    </group>
  );
}

function Mushroom({ position, color = "#c88768", scale = 1 }: { position: [number, number, number]; color?: string; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.01, 0.015, 0.1, 6]} />
        <meshStandardMaterial color="#d8c8b0" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.12, 0]} castShadow>
        <sphereGeometry args={[0.04, 8, 6]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
    </group>
  );
}

function Mushrooms() {
  return (
    <group>
      <Mushroom position={[-2, 0, -1]} color="#c88768" scale={1} />
      <Mushroom position={[-1.8, 0, -0.8]} color="#e8a878" scale={0.7} />
      <Mushroom position={[-2.1, 0, -0.7]} color="#b07758" scale={0.5} />
      <Mushroom position={[3, 0, 2]} color="#c68fe6" scale={1.2} />
      <Mushroom position={[3.2, 0, 2.2]} color="#c68fe6" scale={0.8} />
    </group>
  );
}

function Log({ position, rotation = [0, 0, 0], scale = 1 }: { position: [number, number, number]; rotation?: [number, number, number]; scale?: number }) {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <cylinderGeometry args={[0.05 * scale, 0.07 * scale, 0.3 * scale, 8]} />
      <meshStandardMaterial color="#5a3a1b" roughness={0.9} />
    </mesh>
  );
}

function Logs() {
  return (
    <group>
      <Log position={[-9, 0.04, 1]} rotation={[0, 0, 0.1]} scale={1.5} />
      <Log position={[-8.8, 0.04, 1.3]} rotation={[0, 0.3, -0.1]} scale={1.2} />
      <Log position={[-9.1, 0.03, 1.5]} rotation={[1.2, 0, 0]} scale={1} />
    </group>
  );
}

function HayBale({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <mesh position={position} castShadow>
      <cylinderGeometry args={[0.12 * scale, 0.1 * scale, 0.08 * scale, 8]} />
      <meshStandardMaterial color="#d4b86a" roughness={0.95} />
    </mesh>
  );
}

function HayBales() {
  return (
    <group>
      <HayBale position={[7.5, 0.04, 0]} scale={1} />
      <HayBale position={[7.7, 0.04, 0.12]} scale={0.9} />
      <HayBale position={[7.3, 0.04, -0.1]} scale={0.8} />
    </group>
  );
}
