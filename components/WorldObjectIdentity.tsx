"use client";

export type WorldObjectIdentity = {
  id: string;
  name: string;
  type: 'tree' | 'building' | 'animal' | 'landmark' | 'flower' | 'water' | 'rock' | 'decoration' | 'character';
  description: string;
  lore: string;
  age: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  tags: string[];
  discovered: boolean;
};

export const worldObjectIdentities: WorldObjectIdentity[] = [
  { id: 'ancient-oak-1', name: 'Ancient Oak', type: 'tree', description: 'A towering oak that has stood for centuries', lore: 'Planted by the first citizen as a symbol of growth', age: 350, rarity: 'epic', tags: ['tree', 'ancient', 'nature'], discovered: false },
  { id: 'crystal-pond-1', name: 'Crystal Pond', type: 'water', description: 'A pristine pond with crystal-clear water', lore: 'Said to reflect the true soul of those who gaze into it', age: 1000, rarity: 'rare', tags: ['water', 'magical', 'reflection'], discovered: false },
  { id: 'dreamer-cabin-1', name: 'Dreamer Cabin', type: 'building', description: 'A cozy cabin where dreams take shape', lore: 'Built by the first dreamer who imagined this world', age: 50, rarity: 'uncommon', tags: ['building', 'home', 'dreams'], discovered: false },
  { id: 'golden-flower-1', name: 'Golden Blossom', type: 'flower', description: 'A rare flower that glows in moonlight', lore: 'Blooms only when a true dream is shared nearby', age: 5, rarity: 'legendary', tags: ['flower', 'rare', 'glowing'], discovered: false },
  { id: 'guardian-rock-1', name: 'Guardian Sentinel', type: 'rock', description: 'A weathered stone that watches over the land', lore: 'Ancient guardian turned to stone, still watching', age: 5000, rarity: 'epic', tags: ['rock', 'ancient', 'guardian'], discovered: false },
  { id: 'whispering-vine-1', name: 'Whispering Vine', type: 'decoration', description: 'Vines that carry the whispers of the wind', lore: 'They say if you listen closely, you can hear messages from afar', age: 80, rarity: 'rare', tags: ['vine', 'magical', 'whispers'], discovered: false },
  { id: 'ember-bush-1', name: 'Ember Bush', type: 'decoration', description: 'A bush that smolders with warm embers', lore: 'The embers never die, kept alive by the world\'s heartbeat', age: 200, rarity: 'uncommon', tags: ['bush', 'fire', 'warmth'], discovered: false },
  { id: 'crystal-mushroom-1', name: 'Crystal Shroom', type: 'decoration', description: 'A mushroom that sparkles like a gem', lore: 'Grows where moonlight touches the ground directly', age: 15, rarity: 'rare', tags: ['mushroom', 'crystal', 'glowing'], discovered: false },
  { id: 'star-petal-1', name: 'Star Petal', type: 'flower', description: 'A flower shaped like a five-pointed star', lore: 'Each petal represents a dream that came true', age: 3, rarity: 'legendary', tags: ['flower', 'star', 'dreams'], discovered: false },
  { id: 'timber-post-1', name: 'Timber Post', type: 'decoration', description: 'A sturdy wooden post marking the path', lore: 'Part of the first road built by citizen hands', age: 25, rarity: 'common', tags: ['wood', 'path', 'structure'], discovered: false },
];

export function getIdentity(id: string): WorldObjectIdentity | undefined {
  return worldObjectIdentities.find((o) => o.id === id);
}

export function getIdentitiesByType(type: WorldObjectIdentity['type']): WorldObjectIdentity[] {
  return worldObjectIdentities.filter((o) => o.type === type);
}

export function getRarityColor(rarity: WorldObjectIdentity['rarity']): string {
  const colors = {
    common: '#a89f88',
    uncommon: '#4ade80',
    rare: '#60a5fa',
    epic: '#a78bfa',
    legendary: '#fbbf24',
  };
  return colors[rarity];
}

export function identityToHtml(identity: WorldObjectIdentity): string {
  return `
    <div class="identity-tooltip">
      <div class="identity-header">
        <span class="identity-name">${identity.name}</span>
        <span class="identity-rarity ${identity.rarity}">${identity.rarity.toUpperCase()}</span>
      </div>
      <div class="identity-type">${identity.type}</div>
      <div class="identity-desc">${identity.description}</div>
      <div class="identity-lore">${identity.lore}</div>
      <div class="identity-footer">
        <span class="identity-age">Age: ${identity.age} years</span>
        <span class="identity-tags">${identity.tags.map((t) => `#${t}`).join(' ')}</span>
      </div>
    </div>
  `;
}
