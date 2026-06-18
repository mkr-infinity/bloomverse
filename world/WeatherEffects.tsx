"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Mesh, Vector3 } from "three";

type WeatherType = "clear" | "rain" | "snow" | "fog";

interface WeatherEffectProps {
  type: WeatherType;
  intensity?: number;
}

function RainDrop({ position, speed }: { position: [number, number, number]; speed: number }) {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y -= speed * 0.1;
      if (ref.current.position.y < -1) {
        ref.current.position.y = 8;
      }
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <cylinderGeometry args={[0.005, 0.005, 0.15, 4]} />
      <meshStandardMaterial color="#75b7ca" transparent opacity={0.6} />
    </mesh>
  );
}

function SnowFlake({ position, speed }: { position: [number, number, number]; speed: number }) {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y -= speed * 0.05;
      ref.current.position.x += Math.sin(clock.elapsedTime * 2) * 0.002;
      ref.current.rotation.z += 0.02;
      if (ref.current.position.y < -1) {
        ref.current.position.y = 8;
      }
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.02, 6, 4]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.8} emissive="#ffffff" emissiveIntensity={0.2} />
    </mesh>
  );
}

function FogParticle({ position, speed }: { position: [number, number, number]; speed: number }) {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.x += Math.sin(clock.elapsedTime * speed) * 0.01;
      ref.current.position.z += Math.cos(clock.elapsedTime * speed * 0.7) * 0.01;
      (ref.current.material as any).opacity = 0.2 + Math.sin(clock.elapsedTime * speed) * 0.1;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.3, 8, 6]} />
      <meshStandardMaterial color="#f8ead2" transparent opacity={0.2} />
    </mesh>
  );
}

export function WeatherEffects({ type, intensity = 1 }: WeatherEffectProps) {
  const particles = useMemo(() => {
    const count = Math.floor(100 * intensity);
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        Math.random() * 8,
        (Math.random() - 0.5) * 20
      ] as [number, number, number],
      speed: 0.5 + Math.random() * 0.5,
    }));
  }, [intensity]);

  if (type === "clear") return null;

  return (
    <group>
      {type === "rain" && particles.map((particle, i) => (
        <RainDrop key={i} {...particle} />
      ))}
      {type === "snow" && particles.map((particle, i) => (
        <SnowFlake key={i} {...particle} />
      ))}
      {type === "fog" && particles.slice(0, 20).map((particle, i) => (
        <FogParticle key={i} {...particle} />
      ))}
    </group>
  );
}
