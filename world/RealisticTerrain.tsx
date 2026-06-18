"use client";

import { useMemo } from "react";
import * as THREE from "three";

function height(x: number, z: number): number {
  const n = Math.sin(x * 0.5) * Math.cos(z * 0.5) +
            Math.sin(x * 1.3 + z * 0.7) * 0.5 +
            Math.cos(x * 0.9 + z * 1.1) * 0.25;
  return n / 1.75;
}

interface TerrainProps {
  size?: number;
  segments?: number;
  heightScale?: number;
}

export function RealisticTerrain({ size = 40, segments = 60, heightScale = 0.6 }: TerrainProps) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(size, size, segments, segments);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const h = height(x, z) * heightScale;
      pos.setY(i, h);
    }
    pos.needsUpdate = true;
    g.computeVertexNormals();
    return g;
  }, [size, segments, heightScale]);

  return (
    <mesh geometry={geo} receiveShadow>
      <meshStandardMaterial color="#4a6b3a" roughness={0.92} metalness={0.01} flatShading />
    </mesh>
  );
}
