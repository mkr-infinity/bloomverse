"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";

function Meteor({ seed }: { seed: number }) {
  const ref = useRef<Mesh>(null);
  const startPos = useMemo(() => {
    const angle = seed * 2.3;
    return new Vector3(
      Math.cos(angle) * 30 + seed % 5,
      15 + seed % 5,
      Math.sin(angle) * 30 + (seed * 1.7) % 5
    );
  }, [seed]);
  const speed = 3 + seed % 3;

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = (clock.elapsedTime * speed + seed * 10) % 60;
      const progress = (t % 8) / 8;
      const x = startPos.x - progress * 20;
      const y = startPos.y - progress * 15;
      const z = startPos.z + progress * 5;
      ref.current.position.set(x, y, z);
      const alpha = progress < 0.1 ? progress * 10 : progress > 0.9 ? (1 - progress) * 10 : 1;
      (ref.current.material as any).opacity = alpha * (seed % 3 === 0 ? 0 : 0.6);
      ref.current.scale.setScalar(alpha);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.08, 4, 3]} />
      <meshStandardMaterial color="#fff8e0" emissive="#f0c96b" emissiveIntensity={2} transparent opacity={0} />
    </mesh>
  );
}

export function MeteorShower({ count = 15 }: { count?: number }) {
  const meteors = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({ seed: i }))
  , [count]);

  return (
    <group>
      {meteors.map((m, i) => <Meteor key={i} seed={m.seed} />)}
    </group>
  );
}
