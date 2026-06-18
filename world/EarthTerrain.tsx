"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, Mesh, BufferGeometry, Float32BufferAttribute } from "three";

function noise2D(x: number, z: number): number {
  return Math.sin(x * 1.7 + z * 0.3) * 0.5 + Math.sin(z * 2.1 + x * 0.7) * 0.3 + Math.sin((x + z) * 1.3) * 0.2;
}

const BIOME_COLORS = {
  ocean: new Color("#1a3a5a"),
  coast: new Color("#6f9a57"),
  plains: new Color("#5c8d4a"),
  forest: new Color("#3d6b2e"),
  desert: new Color("#c8b080"),
  tundra: new Color("#a0b0b8"),
  mountain: new Color("#8a7a6a"),
  snow: new Color("#d8dce0"),
  jungle: new Color("#2d5a1a"),
  swamp: new Color("#4a6a3a"),
};

function getBiomeColor(height: number, moisture: number): Color {
  if (height < -0.1) return BIOME_COLORS.ocean;
  if (height < 0.05) return BIOME_COLORS.coast;
  if (height < 0.15) return moisture > 0.5 ? BIOME_COLORS.jungle : BIOME_COLORS.plains;
  if (height < 0.3) return moisture > 0.4 ? BIOME_COLORS.forest : (moisture > 0.2 ? BIOME_COLORS.plains : BIOME_COLORS.desert);
  if (height < 0.5) return BIOME_COLORS.mountain;
  if (height < 0.7) return BIOME_COLORS.tundra;
  return BIOME_COLORS.snow;
}

export function EarthTerrain({ size = 80, segments = 128, heightScale = 1.2 }: { size?: number; segments?: number; heightScale?: number }) {
  const meshRef = useRef<Mesh>(null);

  const { geometry } = useMemo(() => {
    const geo = new BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];
    const uvs: number[] = [];
    const half = size / 2;
    const step = size / segments;

    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const x = -half + i * step;
        const z = -half + j * step;
        const h = noise2D(x * 0.04, z * 0.04) * heightScale * 1.5
          + noise2D(x * 0.08, z * 0.08) * heightScale * 0.6
          + noise2D(x * 0.16, z * 0.16) * heightScale * 0.3;
        const m = noise2D(x * 0.03 + 100, z * 0.03 + 100) * 0.5 + 0.5;
        const color = getBiomeColor(h, m);
        positions.push(x, h, z);
        colors.push(color.r, color.g, color.b);
        uvs.push(i / segments, j / segments);
      }
    }

    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const a = i * (segments + 1) + j;
        const b = i * (segments + 1) + j + 1;
        const c = (i + 1) * (segments + 1) + j;
        const d = (i + 1) * (segments + 1) + j + 1;
        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }

    for (let i = 0; i < positions.length; i += 3) {
      const dx = positions[i] - 0;
      const dy = positions[i + 1] - 0;
      const dz = positions[i + 2] - 0;
      const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
      normals.push(dx / len, dy / len, dz / len);
    }

    geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geo.setAttribute("color", new Float32BufferAttribute(colors, 3));
    geo.setAttribute("normal", new Float32BufferAttribute(normals, 3));
    geo.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return { geometry: geo };
  }, [size, segments, heightScale]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.elapsedTime * 0.003;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} receiveShadow castShadow>
      <meshStandardMaterial vertexColors roughness={0.85} metalness={0.02} flatShading />
    </mesh>
  );
}
