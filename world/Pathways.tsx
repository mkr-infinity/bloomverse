"use client";

export function Pathways() {
  return (
    <group>
      <DirtPath start={[-8, 0, 0]} end={[8, 0, 0]} width={0.4} />
      <DirtPath start={[0, 0, -8]} end={[0, 0, 8]} width={0.4} />
      <DirtPath start={[-5, 0, -5]} end={[5, 0, 5]} width={0.3} />
      <StonePath start={[-3, 0, -3]} end={[-1, 0, 1]} />
      <StonePath start={[3, 0, -3]} end={[1, 0, 1]} />
      <DirtPath start={[-8, 0, 8]} end={[8, 0, -8]} width={0.25} />
    </group>
  );
}

function DirtPath({ start, end, width }: { start: [number, number, number]; end: [number, number, number]; width: number }) {
  const length = Math.sqrt(
    Math.pow(end[0] - start[0], 2) + Math.pow(end[2] - start[2], 2)
  );
  const angle = Math.atan2(end[2] - start[2], end[0] - start[0]);
  const mid: [number, number, number] = [
    (start[0] + end[0]) / 2,
    0.03,
    (start[2] + end[2]) / 2
  ];

  return (
    <group position={mid} rotation={[0, -angle, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[length, width]} />
        <meshStandardMaterial color="#8a7a5a" roughness={0.95} />
      </mesh>
    </group>
  );
}

function StonePath({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const stones = Array.from({ length: 8 }, (_, i) => {
    const t = i / 7;
    return {
      position: [
        start[0] + (end[0] - start[0]) * t + (Math.random() - 0.5) * 0.1,
        0.04,
        start[2] + (end[2] - start[2]) * t + (Math.random() - 0.5) * 0.1,
      ] as [number, number, number],
      scale: 0.5 + Math.random() * 0.5,
    };
  });

  return (
    <group>
      {stones.map((stone, i) => (
        <mesh key={i} position={stone.position} rotation={[0, Math.random() * Math.PI, 0]} castShadow>
          <sphereGeometry args={[0.06 * stone.scale, 6, 4]} />
          <meshStandardMaterial color="#7a7a7a" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}
