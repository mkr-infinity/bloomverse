"use client";

import { useMemo } from "react";
import { Vector3 } from "three";

const BIOMES = [
  { name: "Tropical Jungle", pos: [-18, 0, -14], color: "#2d5a1a", trees: 25 },
  { name: "Desert Dunes", pos: [20, 0, -12], color: "#c8b080", trees: 0 },
  { name: "Arctic Tundra", pos: [-22, 0, 16], color: "#a0b0b8", trees: 5 },
  { name: "Alpine Mountains", pos: [18, 0, 18], color: "#8a7a6a", trees: 10 },
  { name: "Temperate Forest", pos: [0, 0, -20], color: "#3d6b2e", trees: 20 },
  { name: "Savanna Plains", pos: [-15, 0, -20], color: "#b8a060", trees: 8 },
  { name: "Swamp Wetlands", pos: [22, 0, 4], color: "#4a6a3a", trees: 12 },
  { name: "Coastal Shore", pos: [-24, 0, -4], color: "#6f9a57", trees: 6 },
];

export function BiomeIndicator() {
  return null;
}

export function getBiomeAtPosition(x: number, z: number) {
  let closest = BIOMES[0];
  let minDist = Infinity;
  const pos = new Vector3(x, 0, z);
  for (const biome of BIOMES) {
    const dist = pos.distanceTo(new Vector3(biome.pos[0], 0, biome.pos[2]));
    if (dist < minDist) {
      minDist = dist;
      closest = biome;
    }
  }
  return closest;
}

export const biomeData = BIOMES;
