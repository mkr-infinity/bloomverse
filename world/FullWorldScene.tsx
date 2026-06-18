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
import { Campfire } from "@/world/Campfire";
import { WoodBridge, ArchBridge } from "@/world/Bridges";
import { DirtPath, StonePath } from "@/world/Pathways";
import { WoodenBench, StumpSeat } from "@/world/Seating";
import { StreetLamp, GroundLantern, HangingLantern } from "@/world/Lighting";
import { GardenPlot, CropRows, Scarecrow } from "@/world/Agricultural";
import { Well, BirdBath, SmallPond, Stream } from "@/world/WaterFeatures";
import { WoodenFence, Gate } from "@/world/Fencing";
import { Rocks, Pebbles, MossPatches } from "@/world/GroundDetails";
import { Vines, FallenLeaves, BerryBushes } from "@/world/NatureDetails";
import { Mushrooms, Logs, HayBales } from "@/world/DecorativeElements";
import { Pollen, DustMotes, LeafFall } from "@/world/AmbientParticles";
import { FoliageSway, WaterRipple } from "@/world/EnvironmentEffects";
import { AtmosphereGlow } from "@/world/AtmosphereGlow";
import { EarthTerrain } from "@/world/EarthTerrain";
import { Waterfall } from "@/world/Waterfall";
import { WeatherEffects } from "@/world/WeatherEffects";

type WorldSceneProps = {
  cameraTarget: WorldPosition;
  onSelectLandmark: (landmark: Landmark) => void;
  onHoverLandmark: (landmark: Landmark | null) => void;
  weather?: "clear" | "rain" | "snow" | "fog";
};

const cameraOffset = new Vector3(12, 10, 14);

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

function LandmarkMesh({ landmark, onSelect, onHover }: { landmark: Landmark; onSelect: (landmark: Landmark) => void; onHover: (landmark: Landmark | null) => void }) {
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
    <group ref={groupRef} position={[landmark.position.x, 0, landmark.position.z]}
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
      </group>
    );
  }
  const bodyColor = landmark.kind === "monument" ? "#bfa36f"
    : landmark.kind === "hall" ? "#8d6d4b" : landmark.kind === "museum" ? "#c7aa7a" : "#d0b17a";
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

export function FullWorldScene({ cameraTarget, onSelectLandmark, onHoverLandmark, weather }: WorldSceneProps) {
  const showRain = weather === "rain";
  const showSnow = weather === "snow";

  return (
    <Canvas
      shadows
      camera={{ position: [12, 10, 14], fov: 50, near: 0.1, far: 120 }}
      className="world-canvas"
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#0f1520"]} />
      <fog attach="fog" args={["#0f1520", 20, 50]} />

      <ambientLight intensity={0.4} color="#8fa4c4" />
      <hemisphereLight args={["#87ceeb", "#4a6b3a", 0.6]} />
      <directionalLight position={[8, 12, 5]} intensity={3.2} castShadow
        shadow-mapSize-width={4096} shadow-mapSize-height={4096}
        shadow-camera-far={50} shadow-camera-left={-30} shadow-camera-right={30}
        shadow-camera-top={30} shadow-camera-bottom={-30} shadow-bias={-0.0001} color="#fff5e0"
      />
      <directionalLight position={[-5, 8, -3]} intensity={0.8} color="#7090c0" />
      <pointLight position={[0, 4, 0]} intensity={10} color="#f0c96b" distance={15} decay={2} />
      <pointLight position={[-9, 2, -5]} intensity={4} color="#5a8f48" distance={8} decay={2} />
      <pointLight position={[6, 2, 4]} intensity={4} color="#75b7ca" distance={8} decay={2} />
      <pointLight position={[12, 18, -10]} intensity={6} color="#f0c96b" distance={30} decay={2} />
      <pointLight position={[-12, 18, 10]} intensity={4} color="#4a8aaa" distance={25} decay={2} />
      <pointLight position={[0, 20, 0]} intensity={8} color="#fff5e0" distance={40} decay={2} />
      <spotLight position={[0, 15, 0]} angle={0.4} penumbra={0.8} intensity={5} color="#f0c96b" castShadow
        shadow-mapSize-width={1024} shadow-mapSize-height={1024}
      />

      <CameraRig target={cameraTarget} />
      <RealisticTerrain size={40} segments={64} heightScale={0.6} />
      <DynamicOcean />
      <StarField count={150} />
      <CloudLayer count={25} />
      <DayNightCycle />
      <WindSystem />
      <VegetationSystem />
      <BuildingSystem />
      <Wildlife />
      <AtmosphereGlow radius={25} color="#4a8aaa" />

      {showRain && <RainSystem intensity={1} />}
      {showSnow && <SnowSystem intensity={1} />}

      <DistrictPatches />

      <DirtPath start={[-8, 0, -8]} end={[8, 0, 8]} />
      <DirtPath start={[-8, 0, 8]} end={[8, 0, -8]} />
      <DirtPath start={[-12, 0, 0]} end={[12, 0, 0]} />
      <DirtPath start={[0, 0, -12]} end={[0, 0, 12]} />
      <StonePath start={[-6, 0, -4]} end={[6, 0, 4]} />
      <StonePath start={[-4, 0, -6]} end={[4, 0, 6]} />

      <WoodBridge position={[-3, 0, 1]} rotation={[0, 0.8, 0]} />
      <ArchBridge position={[4, 0, -2]} rotation={[0, -0.5, 0]} />

      <WoodenFence position={[-10, 0, -9]} count={4} />
      <WoodenFence position={[10, 0, 9]} count={4} />
      <Gate position={[-10, 0, -9]} />

      <WoodenBench position={[-4, 0, 2]} rotation={[0, 0.5, 0]} />
      <WoodenBench position={[5, 0, -3]} rotation={[0, -0.3, 0]} />
      <WoodenBench position={[-6, 0, 6]} rotation={[0, 0.8, 0]} />
      <StumpSeat position={[6, 0, 6]} />
      <StumpSeat position={[6.5, 0, 6.5]} />
      <StumpSeat position={[5.5, 0, 5.5]} />

      <StreetLamp position={[-3, 0, 4]} intensity={1.2} />
      <StreetLamp position={[4, 0, -2]} intensity={0.8} />
      <StreetLamp position={[-5, 0, -5]} intensity={1} />
      <StreetLamp position={[6, 0, 3]} intensity={1.5} />
      <GroundLantern position={[-7, 0, -3]} />
      <GroundLantern position={[7, 0, 2]} />
      <HangingLantern position={[-2, 0.8, -2]} />
      <HangingLantern position={[2, 0.8, 2]} />

      <Campfire position={[-8, 0, -6]} />
      <Campfire position={[8, 0, 6]} />

      <GardenPlot position={[-7, 0, 5]} />
      <CropRows position={[6, 0, -7]} count={5} />
      <Scarecrow position={[7, 0, -6]} />

      <Well position={[-12, 0, -5]} />
      <BirdBath position={[12, 0, 5]} />
      <SmallPond position={[-13, 0, 8]} />
      <Stream start={[-5, 0, -14]} end={[5, 0, -14]} />

      <Waterfall position={[-14, 0, -8]} height={1.5} />
      <Waterfall position={[14, 0, 8]} height={1.2} />

      <Rocks position={[-11, 0, -11]} />
      <Pebbles position={[11, 0, 11]} />
      <MossPatches position={[-9, 0, 9]} />

      <Vines position={[-10, 0, 0]} />
      <FallenLeaves position={[10, 0, 0]} />
      <BerryBushes position={[-6, 0, -8]} />

      <Mushrooms position={[-8, 0, 10]} />
      <Logs position={[8, 0, -10]} />
      <HayBales position={[12, 0, -12]} />

      <Pollen count={30} />
      <DustMotes count={25} />
      <LeafFall count={10} />

      <FoliageSway />
      <WaterRipple position={[12, 0, -8]} />
      <WaterRipple position={[-12, 0, 8]} />

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

      <CitizenAvatar role="explorer" position={[-3, 0, 0]} />
      <CitizenAvatar role="creator" position={[0, 0, -3]} />
      <CitizenAvatar role="guardian" position={[3, 0, 0]} />

      {starterLandmarks.map((landmark) => (
        <LandmarkMesh key={landmark.id} landmark={landmark} onSelect={onSelectLandmark} onHover={onHoverLandmark} />
      ))}
    </Canvas>
  );
}
