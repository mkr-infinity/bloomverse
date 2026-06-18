"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Group, Color } from "three";
import { premiumColors, timeToColors } from "@/lib/colors-premium";

export function EarthIntro({ onStart, hour = 12 }: { onStart: () => void; hour?: number }) {
  const groupRef = useRef<Group>(null);
  const glowRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);
  const timeColors = useMemo(() => timeToColors(hour), [hour]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05;
    }
    if (glowRef.current) {
      const pulse = 1 + Math.sin(t * 1.5) * 0.05;
      glowRef.current.scale.setScalar(pulse);
      (glowRef.current.material as any).opacity = 0.3 + Math.sin(t * 2) * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.sin(t * 0.3) * 0.05;
      ringRef.current.rotation.z = Math.cos(t * 0.2) * 0.03;
    }
  });

  return (
    <group>
      <group ref={groupRef} onClick={onStart} onPointerOver={(e) => { e.object.scale.setScalar(1.02); }} onPointerOut={(e) => { e.object.scale.setScalar(1); }}>
        <mesh>
          <sphereGeometry args={[2.5, 48, 48]} />
          <meshStandardMaterial color={premiumColors.surface.deep} roughness={0.6} metalness={0.2} />
        </mesh>
        {generateContinents().map((cont, i) => (
          <mesh key={i} position={cont.pos} rotation={[cont.rotX, cont.rotY, 0]}>
            <planeGeometry args={[cont.w, cont.h]} />
            <meshStandardMaterial color={cont.color} roughness={0.7} metalness={0.05} side={2} />
          </mesh>
        ))}
        <mesh ref={glowRef} scale={1.02}>
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshStandardMaterial
            color={timeColors.ambient}
            transparent opacity={0.3}
            side={2}
            roughness={0}
            metalness={0}
            emissive={timeColors.ambient}
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
      <mesh ref={ringRef} rotation={[1.2, 0, 0]}>
        <ringGeometry args={[3.2, 3.8, 48]} />
        <meshStandardMaterial
          color={premiumColors.primary.gold}
          transparent opacity={0.2}
          side={2}
          emissive={premiumColors.primary.gold}
          emissiveIntensity={0.15}
        />
      </mesh>
      <mesh rotation={[1.2, 0.3, 0]}>
        <ringGeometry args={[3.5, 3.6, 48]} />
        <meshStandardMaterial
          color={premiumColors.accent.emerald}
          transparent opacity={0.08}
          side={2}
        />
      </mesh>
    </group>
  );
}

function generateContinents() {
  return [
    { pos: [-0.8, 0.3, 1.8], w: 1.2, h: 1.5, rotX: 0, rotY: 0.3, color: premiumColors.primary.copper },
    { pos: [0.5, -0.2, 2.0], w: 0.8, h: 1.0, rotX: 0.1, rotY: -0.2, color: premiumColors.primary.amber },
    { pos: [-0.3, -0.8, 1.9], w: 0.6, h: 0.4, rotX: 0.2, rotY: 0.1, color: premiumColors.primary.brass },
    { pos: [1.0, 0.5, 1.7], w: 0.5, h: 0.7, rotX: -0.1, rotY: 0.4, color: premiumColors.accent.jade },
    { pos: [-1.2, -0.1, 1.6], w: 0.4, h: 0.6, rotX: 0.1, rotY: -0.3, color: premiumColors.primary.bronze },
    { pos: [0.8, -0.6, 1.8], w: 0.7, h: 0.5, rotX: -0.2, rotY: 0.2, color: premiumColors.accent.sapphire },
  ];
}
