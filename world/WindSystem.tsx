"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Group } from "three";

export function WindSystem() {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.elapsedTime;
      groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.005;
      groupRef.current.rotation.x = Math.sin(t * 0.35) * 0.003;
    }
  });

  return <group ref={groupRef} />;
}

export function useWind() {
  const windRef = useRef({ speed: 0.5, direction: 0, gust: 0 });

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    windRef.current.speed = 0.3 + Math.sin(t * 0.2) * 0.2;
    windRef.current.direction = Math.sin(t * 0.05) * Math.PI;
    windRef.current.gust = Math.max(0, Math.sin(t * 3) * Math.sin(t * 1.7));
  });

  return windRef.current;
}
