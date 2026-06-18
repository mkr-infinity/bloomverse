"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, Group, Mesh, Vector3 } from "three";
import { districts, starterLandmarks } from "@/world/world-data";
import type { Landmark, WorldPosition } from "@/types/world";
import { RealisticTerrain } from "@/world/RealisticTerrain";
import { DynamicOcean } from "@/world/DynamicOcean";
import { StarField } from "@/world/StarField";
import { CloudLayer } from "@/world/CloudLayer";
import { RainSystem, SnowSystem } from "@/world/PrecipitationSystem";
import { WindSystem } from "@/world/WindSystem";
import { Wildlife } from "@/world/Wildlife";
import { VegetationSystem } from "@/world/VegetationSystem";
import { BuildingSystem } from "@/world/BuildingSystem";
import { DayNightCycle } from "@/world/DayNightCycle";
import { Bench, SignPost, LampPost, Fountain, FlowerPot } from "@/world/Decorations";
import { CitizenAvatar } from "@/world/Avatar";

type WorldSceneProps = {
  cameraTarget: WorldPosition;
  onSelectLandmark: (landmark: Landmark) => void;
  onHoverLandmark: (landmark: Landmark | null) => void;
  weather?: "clear" | "rain" | "snow" | "fog";
};

const cameraOffset = new Vector3(9, 8, 11);

function CameraRig({ target }: { target: WorldPosition }) {
  const lookAtTarget = useRef(new Vector3(target.x, target.y, target.z));

  useFrame(({ camera }) => {
    const desiredTarget = new Vector3(target.x, target.y, target.z);
    lookAtTarget.current.lerp(desiredTarget, 0.045);
    const desiredCamera = lookAtTarget.current.clone().add(cameraOffset);
    camera.position.lerp(desiredCamera, 0.04);
    camera.lookAt(lookAtTarget.current);
  });

  return null;
}

function RealisticGround() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.05, 0]}>
        <circleGeometry args={[20, 64]} />
        <meshStandardMaterial color="#4a6b3a" roughness={0.92} metalness={0.02} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.02, 0]}>
        <circleGeometry args={[16, 48]} />
        <meshStandardMaterial color="#5c7d4a" roughness={0.88} metalness={0.01} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.01, 0]}>
        <circleGeometry args={[11, 36]} />
        <meshStandardMaterial color="#6f8d57" roughness={0.85} metalness={0.01} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[2.0, 2.6, 32]} />
        <meshStandardMaterial color="#c9a96a" roughness={0.78} metalness={0.05} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[0.8, 1.1, 24]} />
        <meshStandardMaterial color="#b89a5e" roughness={0.75} metalness={0.08} />
      </mesh>
    </group>
  );
}

function DistrictPatches() {
  return (
    <group>
      {districts.map((district, index) => (
        <group key={district.key} position={[district.position.x, 0.02, district.position.z]} rotation={[0, index * 0.4, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[2.6, 32]} />
            <meshStandardMaterial color={district.color} roughness={0.82} transparent opacity={0.65} metalness={0.02} />
          </mesh>
          <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.65, 2.85, 32]} />
            <meshStandardMaterial color="#f0c96b" roughness={0.6} transparent opacity={0.4} emissive="#f0c96b" emissiveIntensity={0.15} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function TreeCluster({ x, z, seed }: { x: number; z: number; seed: number }) {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.6 + seed) * 0.018;
      groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.35 + seed * 2) * 0.012;
    }
  });

  const trunkH = 0.6 + (seed % 3) * 0.15;
  const canopyR = 0.5 + (seed % 4) * 0.12;
  const leafColor = seed % 3 === 0 ? "#4a7a38" : seed % 3 === 1 ? "#5a8f48" : "#3d6b2e";

  return (
    <group ref={groupRef} position={[x, 0, z]}>
      <mesh position={[0, trunkH / 2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.16, trunkH, 8]} />
        <meshStandardMaterial color="#4a2a18" roughness={0.92} metalness={0.02} />
      </mesh>
      <mesh position={[0, trunkH + canopyR * 0.6, 0]} castShadow>
        <sphereGeometry args={[canopyR, 12, 10]} />
        <meshStandardMaterial color={leafColor} roughness={0.82} metalness={0.01} />
      </mesh>
      <mesh position={[canopyR * 0.4, trunkH + canopyR * 0.3, canopyR * 0.3]} castShadow>
        <sphereGeometry args={[canopyR * 0.65, 10, 8]} />
        <meshStandardMaterial color={leafColor} roughness={0.85} metalness={0.01} />
      </mesh>
      <mesh position={[-canopyR * 0.35, trunkH + canopyR * 0.2, -canopyR * 0.25]} castShadow>
        <sphereGeometry args={[canopyR * 0.55, 10, 8]} />
        <meshStandardMaterial color={leafColor} roughness={0.85} metalness={0.01} />
      </mesh>
    </group>
  );
}

function TreesAndNature() {
  const trees = useMemo(() => [
    [-12, -3, 1], [-11, -7, 2], [-8, -9, 3], [7, -8, 4], [11, -3, 5],
    [12, 4, 6], [6, 10, 7], [-9, 8, 8], [-13, 2, 9], [-14, -1, 10],
    [13, -6, 11], [-7, -12, 12], [10, 9, 13], [-10, -11, 14], [14, 1, 15],
    [-5, -13, 16], [8, -12, 17], [-12, 8, 18], [13, 7, 19], [-6, 12, 20]
  ], []);

  return (
    <group>
      {trees.map(([x, z, seed]) => (
        <TreeCluster key={`${x}-${z}`} x={x} z={z} seed={seed} />
      ))}
    </group>
  );
}

function LandmarkMesh({
  landmark,
  onSelect,
  onHover
}: {
  landmark: Landmark;
  onSelect: (landmark: Landmark) => void;
  onHover: (landmark: Landmark | null) => void;
}) {
  const groupRef = useRef<Group>(null);
  const glowRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.2 + landmark.position.x) * 0.02;
    }
    if (glowRef.current) {
      const pulse = 0.8 + Math.sin(clock.elapsedTime * 1.2 + landmark.position.z) * 0.15;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group
      ref={groupRef}
      position={[landmark.position.x, 0, landmark.position.z]}
      onClick={() => onSelect(landmark)}
      onPointerOver={(e) => { e.stopPropagation(); onHover(landmark); }}
      onPointerOut={() => onHover(null)}
    >
      <mesh ref={glowRef} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1.2, 24]} />
        <meshStandardMaterial color="#f0c96b" emissive="#f0c96b" emissiveIntensity={0.3} transparent opacity={0.45} />
      </mesh>
      <LandmarkShape landmark={landmark} />
    </group>
  );
}

function DreamRocket({ x, z, color }: { x: number; z: number; color: string }) {
  const ref = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = 0.9 + Math.sin(clock.elapsedTime * 0.8) * 0.2;
      ref.current.rotation.y = clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={ref} position={[x, 0.9, z]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.08, 0.18, 0.6, 8]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <coneGeometry args={[0.1, 0.18, 8]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh position={[0, -0.38, 0]}>
        <coneGeometry args={[0.14, 0.12, 6]} />
        <meshStandardMaterial color="#c96b5f" emissive="#c96b5f" emissiveIntensity={0.6} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.32, 12]} />
        <meshStandardMaterial color={color} transparent opacity={0.3} emissive={color} emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

function DreamStudio({ x, z, color }: { x: number; z: number; color: string }) {
  const ref = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = 0.7 + Math.sin(clock.elapsedTime * 0.7 + 1) * 0.15;
      ref.current.rotation.y = clock.elapsedTime * 0.25;
    }
  });

  return (
    <group ref={ref} position={[x, 0.7, z]}>
      <mesh castShadow>
        <boxGeometry args={[0.35, 0.25, 0.35]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} emissive={color} emissiveIntensity={0.15} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <coneGeometry args={[0.28, 0.2, 4]} />
        <meshStandardMaterial color="#8d6d4b" roughness={0.7} />
      </mesh>
    </group>
  );
}

function DreamHouse({ x, z, color }: { x: number; z: number; color: string }) {
  const ref = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = 0.65 + Math.sin(clock.elapsedTime * 0.6 + 2) * 0.12;
      ref.current.rotation.y = clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={ref} position={[x, 0.65, z]}>
      <mesh castShadow>
        <boxGeometry args={[0.3, 0.22, 0.28]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.15} emissive={color} emissiveIntensity={0.1} />
      </mesh>
      <mesh position={[0, 0.19, 0]}>
        <coneGeometry args={[0.26, 0.18, 4]} />
        <meshStandardMaterial color="#6f4a3e" roughness={0.75} />
      </mesh>
    </group>
  );
}

function DreamCar({ x, z, color }: { x: number; z: number; color: string }) {
  const ref = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = 0.55 + Math.sin(clock.elapsedTime * 0.9 + 3) * 0.1;
      ref.current.rotation.y = clock.elapsedTime * 0.35;
    }
  });

  return (
    <group ref={ref} position={[x, 0.55, z]}>
      <mesh castShadow>
        <boxGeometry args={[0.38, 0.12, 0.18]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.45} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.2, 0.1, 0.16]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.4} />
      </mesh>
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.22, 0.3, 10]} />
        <meshStandardMaterial color={color} transparent opacity={0.25} emissive={color} emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}

function DreamObjects() {
  return (
    <group>
      <DreamRocket x={7.5} z={3.2} color="#f0c96b" />
      <DreamStudio x={8.7} z={5.4} color="#c96b5f" />
      <DreamHouse x={5.6} z={6.2} color="#75b7ca" />
      <DreamCar x={10.2} z={4.5} color="#8764c8" />
    </group>
  );
}

function LandmarkShape({ landmark }: { landmark: Landmark }) {
  if (landmark.kind === "tree") {
    return (
      <group>
        <mesh position={[0, 0.65, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.3, 1.3, 8]} />
          <meshStandardMaterial color="#4a2a18" roughness={0.9} metalness={0.02} />
        </mesh>
        <mesh position={[0, 1.5, 0]} castShadow>
          <sphereGeometry args={[0.85, 14, 10]} />
          <meshStandardMaterial color="#4a7a38" roughness={0.78} metalness={0.01} />
        </mesh>
        <mesh position={[0.4, 1.3, 0.3]} castShadow>
          <sphereGeometry args={[0.5, 10, 8]} />
          <meshStandardMaterial color="#5a8f48" roughness={0.8} />
        </mesh>
        <mesh position={[-0.35, 1.2, -0.25]} castShadow>
          <sphereGeometry args={[0.45, 10, 8]} />
          <meshStandardMaterial color="#3d6b2e" roughness={0.82} />
        </mesh>
      </group>
    );
  }

  if (landmark.kind === "fountain") {
    return (
      <group>
        <mesh position={[0, 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.85, 0.95, 0.24, 16]} />
          <meshStandardMaterial color="#c9b180" roughness={0.65} metalness={0.08} />
        </mesh>
        <mesh position={[0, 0.32, 0]} castShadow>
          <cylinderGeometry args={[0.55, 0.65, 0.18, 16]} />
          <meshStandardMaterial color="#75b7ca" roughness={0.25} metalness={0.15} emissive="#75b7ca" emissiveIntensity={0.25} />
        </mesh>
        <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.75, 24]} />
          <meshStandardMaterial color="#5a9ab5" roughness={0.2} metalness={0.1} transparent opacity={0.6} />
        </mesh>
      </group>
    );
  }

  if (landmark.kind === "observatory") {
    return (
      <group>
        <mesh position={[0, 0.55, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.48, 1.1, 12]} />
          <meshStandardMaterial color="#d6c092" roughness={0.7} metalness={0.05} />
        </mesh>
        <mesh position={[0, 1.2, 0]} castShadow>
          <sphereGeometry args={[0.5, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#68a8b2" roughness={0.35} metalness={0.2} />
        </mesh>
        <mesh position={[0, 1.22, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.6, 6]} />
          <meshStandardMaterial color="#8a8a8a" roughness={0.4} metalness={0.5} />
        </mesh>
      </group>
    );
  }

  const bodyColor = landmark.kind === "monument" ? "#bfa36f"
    : landmark.kind === "hall" ? "#8d6d4b"
    : landmark.kind === "museum" ? "#c7aa7a" : "#d0b17a";
  const roofColor = landmark.kind === "plaza" ? "#f0c96b" : "#8f4f43";

  return (
    <group>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[1.0, 0.7, 1.0]} />
        <meshStandardMaterial color={bodyColor} roughness={0.72} metalness={0.04} />
      </mesh>
      <mesh position={[0, 0.9, 0]} castShadow>
        <coneGeometry args={[0.78, 0.65, 6]} />
        <meshStandardMaterial color={roofColor} roughness={0.68} metalness={0.06} />
      </mesh>
    </group>
  );
}

function CitizenHomeGrove() {
  const homes = useMemo(() => [
    [2.5, -5.8, 0], [3.7, -4.8, 1], [4.8, -5.7, 2], [2.6, -3.9, 3],
    [5.5, -4.2, 4], [3.2, -6.5, 5]
  ], []);

  return (
    <group>
      {homes.map(([x, z, seed]) => (
        <group key={`${x}-${z}`} position={[x, 0, z]} rotation={[0, seed * 0.5, 0]}>
          <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[0.5, 16]} />
            <meshStandardMaterial color="#c9a96a" roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.22, 0]} castShadow>
            <boxGeometry args={[0.38, 0.28, 0.35]} />
            <meshStandardMaterial color="#c88768" roughness={0.8} metalness={0.02} />
          </mesh>
          <mesh position={[0, 0.48, 0]} castShadow>
            <coneGeometry args={[0.35, 0.28, 4]} />
            <meshStandardMaterial color="#6f4a3e" roughness={0.78} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function GrassPatches() {
  const patches = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      x: Math.cos(i * 0.8) * (3 + (i % 5) * 1.5),
      z: Math.sin(i * 1.1) * (3 + (i % 4) * 1.8),
      scale: 0.3 + (i % 3) * 0.15,
      rotation: i * 0.5,
    }))
  , []);

  return (
    <group>
      {patches.map((patch, i) => (
        <group key={i} position={[patch.x, 0.08, patch.z]} rotation={[0, patch.rotation, 0]}>
          {[0, 0.3, 0.6, 0.9, 1.2].map((offset, j) => (
            <mesh key={j} position={[Math.sin(offset) * 0.15, offset * 0.08, Math.cos(offset) * 0.15]} castShadow>
              <coneGeometry args={[0.02 * patch.scale, 0.15 * patch.scale, 4]} />
              <meshStandardMaterial color="#5a8f48" roughness={0.85} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function WaterPond({ position, radius }: { position: [number, number, number]; radius: number }) {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.elapsedTime;
      (ref.current.material as any).emissiveIntensity = 0.1 + Math.sin(t * 0.5) * 0.05;
    }
  });

  return (
    <group position={position}>
      <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[radius, 24]} />
        <meshStandardMaterial 
          color="#4a7a9a" 
          roughness={0.2} 
          metalness={0.3} 
          transparent 
          opacity={0.85}
          emissive="#2a5a7a"
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[radius * 0.9, radius * 1.05, 24]} />
        <meshStandardMaterial color="#3a6a5a" roughness={0.7} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function FlowerField() {
  const flowers = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      x: Math.cos(i * 1.2) * (4 + (i % 4) * 1.2),
      z: Math.sin(i * 0.9) * (4 + (i % 3) * 1.5),
      color: i % 4 === 0 ? "#ff6b9d" : i % 4 === 1 ? "#ffd93d" : i % 4 === 2 ? "#6bcb77" : "#4d96ff",
      scale: 0.4 + (i % 3) * 0.2,
    }))
  , []);

  return (
    <group>
      {flowers.map((flower, i) => (
        <group key={i} position={[flower.x, 0.12, flower.z]} scale={flower.scale}>
          <mesh position={[0, 0.08, 0]} castShadow>
            <cylinderGeometry args={[0.01, 0.015, 0.16, 6]} />
            <meshStandardMaterial color="#3a6a2a" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.18, 0]} castShadow>
            <sphereGeometry args={[0.04, 8, 6]} />
            <meshStandardMaterial color={flower.color} roughness={0.6} emissive={flower.color} emissiveIntensity={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function DustParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => ({
      position: [
        Math.cos(i * 0.7) * (6 + (i % 5) * 1.5),
        1 + (i % 6) * 0.8,
        Math.sin(i * 1.1) * (6 + (i % 4) * 1.2)
      ] as [number, number, number],
      speed: 0.2 + (i % 4) * 0.1,
      size: 0.02 + (i % 3) * 0.01,
    }))
  , []);

  return (
    <group>
      {particles.map((particle, i) => (
        <DustParticle key={i} {...particle} index={i} />
      ))}
    </group>
  );
}

function DustParticle({ position, speed, size, index }: { position: [number, number, number]; speed: number; size: number; index: number }) {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.elapsedTime * speed + index;
      ref.current.position.y = position[1] + Math.sin(t) * 0.3;
      ref.current.position.x = position[0] + Math.sin(t * 0.5) * 0.2;
      (ref.current.material as any).opacity = 0.3 + Math.sin(t * 2) * 0.2;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 6, 4]} />
      <meshStandardMaterial color="#f0e68c" transparent opacity={0.4} emissive="#f0e68c" emissiveIntensity={0.3} />
    </mesh>
  );
}

function WindSway({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.elapsedTime;
      groupRef.current.rotation.z = Math.sin(t * 0.8) * 0.02;
      groupRef.current.rotation.x = Math.sin(t * 0.6) * 0.015;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

function PathWay({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const length = Math.sqrt(
    Math.pow(end[0] - start[0], 2) + Math.pow(end[2] - start[2], 2)
  );
  const angle = Math.atan2(end[2] - start[2], end[0] - start[0]);
  const midpoint: [number, number, number] = [
    (start[0] + end[0]) / 2,
    0.04,
    (start[2] + end[2]) / 2
  ];

  return (
    <group position={midpoint} rotation={[0, -angle, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[length, 0.2]} />
        <meshStandardMaterial color="#b89a5e" roughness={0.85} metalness={0.05} />
      </mesh>
    </group>
  );
}

export function WorldScene({ cameraTarget, onSelectLandmark, onHoverLandmark, weather }: WorldSceneProps) {
  const showRain = weather === "rain";
  const showSnow = weather === "snow";

  return (
    <Canvas
      shadows
      camera={{ position: [9, 8, 11], fov: 45, near: 0.1, far: 120 }}
      className="world-canvas"
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#0f1520"]} />

      <fog attach="fog" args={["#0f1520", 15, 45]} />

      <ambientLight intensity={0.4} color="#8fa4c4" />
      <hemisphereLight args={["#87ceeb", "#4a6b3a", 0.6]} />

      <directionalLight
        position={[8, 12, 5]}
        intensity={3.2}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={50}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.0001}
        color="#fff5e0"
      />

      <directionalLight position={[-5, 8, -3]} intensity={0.8} color="#7090c0" />
      <pointLight position={[0, 4, 0]} intensity={10} color="#f0c96b" distance={15} decay={2} />
      <pointLight position={[-9, 2, -5]} intensity={4} color="#5a8f48" distance={8} decay={2} />
      <pointLight position={[6, 2, 4]} intensity={4} color="#75b7ca" distance={8} decay={2} />

      <spotLight
        position={[0, 15, 0]}
        angle={0.4}
        penumbra={0.8}
        intensity={5}
        color="#f0c96b"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <CameraRig target={cameraTarget} />
      <RealisticTerrain size={40} segments={64} heightScale={0.6} />
      <DynamicOcean />
      <StarField />
      <CloudLayer />
      <DayNightCycle />
      <WindSystem />
      <VegetationSystem />
      <BuildingSystem />
      <Wildlife />

      {showRain && <RainSystem intensity={1} />}
      {showSnow && <SnowSystem intensity={1} />}

      <DistrictPatches />
      <TreesAndNature />
      <CitizenHomeGrove />
      <DreamObjects />
      <GrassPatches />
      <FlowerField />
      <DustParticles />
      <WaterPond position={[-6, 0, -3]} radius={1.2} />
      <WaterPond position={[7, 0, 5]} radius={0.8} />
      <PathWay start={[-8, 0, 0]} end={[8, 0, 0]} />
      <PathWay start={[0, 0, -8]} end={[0, 0, 8]} />

      <Bench position={[-4, 0, 2]} rotation={[0, 0.5, 0]} />
      <Bench position={[5, 0, -3]} rotation={[0, -0.3, 0]} />
      <SignPost position={[0, 0, 6]} />
      <SignPost position={[-7, 0, 0]} rotation={[0, 1.5, 0]} />
      <LampPost position={[-3, 0, 4]} intensity={1.2} />
      <LampPost position={[4, 0, -2]} intensity={0.8} />
      <LampPost position={[-5, 0, -5]} intensity={1} />
      <Fountain position={[0, 0, 0]} />
      <FlowerPot position={[2, 0, 3]} flowerColor="#ff6b9d" />
      <FlowerPot position={[-2, 0, 3]} flowerColor="#ffd93d" />
      <FlowerPot position={[3, 0, 1]} flowerColor="#6bcb77" />
      <FlowerPot position={[-3, 0, 1]} flowerColor="#4d96ff" />
      <CitizenAvatar role="explorer" />
      <CitizenAvatar role="creator" />
      <CitizenAvatar role="guardian" />

      {starterLandmarks.map((landmark) => (
        <LandmarkMesh key={landmark.id} landmark={landmark} onSelect={onSelectLandmark} onHover={onHoverLandmark} />
      ))}
    </Canvas>
  );
}
// add output color space
