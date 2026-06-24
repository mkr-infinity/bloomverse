export interface CharacterSkin {
  id: string;
  name: string;
  skinTone: string;
  hairColor: string;
  shirtColor: string;
  pantsColor: string;
  shoeColor: string;
  hairStyle: 'buzz' | 'slick' | 'long' | 'bald' | 'mohawk';
  gear: 'vest' | 'jacket' | 'armor' | 'hoodie' | 'tactical';
  // Meta / progression
  role: string;
  rarity: 'RARE' | 'ELITE' | 'EPIC' | 'LEGEND' | 'MYTHIC';
  accent: string;
  desc: string;
  speed: number;
  power: number;
  armorStat: number;
  price: number; // 0 = free / starter
}

export const CHARACTERS: CharacterSkin[] = [
  { id: 'ghost', name: 'Ghost', skinTone: '#e8b898', hairColor: '#1a1a1a', shirtColor: '#1c1c2e', pantsColor: '#2a2a3a', shoeColor: '#111', hairStyle: 'buzz', gear: 'vest',
    role: 'ASSASSIN', rarity: 'ELITE', accent: '#00d4ff', desc: 'Silent and lethal. Former special ops sniper.', speed: 85, power: 70, armorStat: 60, price: 0 },
  { id: 'viper', name: 'Viper', skinTone: '#f5cba7', hairColor: '#2d1b00', shirtColor: '#1a4a1a', pantsColor: '#111', shoeColor: '#222', hairStyle: 'long', gear: 'armor',
    role: 'SCOUT', rarity: 'RARE', accent: '#00ff88', desc: 'Stealth expert. Precision over brute force.', speed: 95, power: 60, armorStat: 50, price: 350 },
  { id: 'phoenix', name: 'Phoenix', skinTone: '#c68642', hairColor: '#cc3300', shirtColor: '#880000', pantsColor: '#222', shoeColor: '#1a1a1a', hairStyle: 'slick', gear: 'jacket',
    role: 'DEMOLITION', rarity: 'LEGEND', accent: '#ff6b2d', desc: 'Explosive combat specialist. Fears nothing.', speed: 65, power: 95, armorStat: 70, price: 500 },
  { id: 'blaze', name: 'Blaze', skinTone: '#6f4e37', hairColor: '#000', shirtColor: '#cc4400', pantsColor: '#1a1a1a', shoeColor: '#0a0a0a', hairStyle: 'bald', gear: 'hoodie',
    role: 'JUGGERNAUT', rarity: 'LEGEND', accent: '#ffcc00', desc: 'Heavy weapons master. An unstoppable force.', speed: 50, power: 85, armorStat: 95, price: 800 },
  { id: 'raven', name: 'Raven', skinTone: '#d9a066', hairColor: '#7a2dff', shirtColor: '#1a1a22', pantsColor: '#15151c', shoeColor: '#0a0a0a', hairStyle: 'mohawk', gear: 'tactical',
    role: 'RECON', rarity: 'EPIC', accent: '#b14aff', desc: 'Ghost in the wire. Sees every threat first.', speed: 88, power: 72, armorStat: 64, price: 1200 },
  { id: 'titan', name: 'Titan', skinTone: '#8d5524', hairColor: '#000', shirtColor: '#3a3f4a', pantsColor: '#222', shoeColor: '#111', hairStyle: 'bald', gear: 'armor',
    role: 'TANK', rarity: 'LEGEND', accent: '#9aa7b5', desc: 'A walking fortress. Absorbs everything.', speed: 42, power: 80, armorStat: 100, price: 1800 },
  { id: 'frost', name: 'Frost', skinTone: '#f0d0b0', hairColor: '#cfe8ff', shirtColor: '#16384a', pantsColor: '#10202a', shoeColor: '#0a141a', hairStyle: 'slick', gear: 'tactical',
    role: 'MARKSMAN', rarity: 'EPIC', accent: '#66ccff', desc: 'One breath, one shot. Cold precision.', speed: 80, power: 90, armorStat: 58, price: 2500 },
  { id: 'inferno', name: 'Inferno', skinTone: '#5a3825', hairColor: '#ff5500', shirtColor: '#1a0a0a', pantsColor: '#140606', shoeColor: '#0a0303', hairStyle: 'mohawk', gear: 'jacket',
    role: 'BERSERKER', rarity: 'MYTHIC', accent: '#ff2d55', desc: 'Pure rage incarnate. The last thing they see.', speed: 92, power: 100, armorStat: 75, price: 4000 },
];

function darken(hex: string, amt: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgb(${Math.max(0, ((n >> 16) & 0xff) - amt)},${Math.max(0, ((n >> 8) & 0xff) - amt)},${Math.max(0, (n & 0xff) - amt)})`;
}

function lighten(hex: string, amt: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgb(${Math.min(255, ((n >> 16) & 0xff) + amt)},${Math.min(255, ((n >> 8) & 0xff) + amt)},${Math.min(255, (n & 0xff) + amt)})`;
}

export function drawHumanCharacter(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  skin: CharacterSkin,
  scale: number,
  _angle: number,
  frame: number,
  moving: boolean,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  const walk = moving ? Math.sin(frame * 0.13) : 0;
  const bob = moving ? Math.abs(Math.sin(frame * 0.13)) * 1.5 : 0;
  const arm = moving ? Math.sin(frame * 0.13) * 0.35 : 0;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.beginPath();
  ctx.ellipse(0, 32, 14, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // === LEGS ===
  // Left leg
  ctx.save();
  ctx.translate(-5, 12);
  ctx.rotate(walk * 0.35);
  // Thigh
  ctx.fillStyle = skin.pantsColor;
  roundRect(ctx, -4, 0, 8, 13, 3);
  // Knee crease
  ctx.fillStyle = darken(skin.pantsColor, 15);
  ctx.fillRect(-3, 11, 6, 2);
  // Shin
  ctx.fillStyle = skin.pantsColor;
  roundRect(ctx, -3.5, 13, 7, 10, 2);
  // Shoe
  ctx.fillStyle = skin.shoeColor;
  ctx.beginPath();
  ctx.ellipse(1, 24, 6, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = lighten(skin.shoeColor, 30);
  ctx.fillRect(-2, 22, 6, 2); // sole line
  ctx.restore();

  // Right leg
  ctx.save();
  ctx.translate(5, 12);
  ctx.rotate(-walk * 0.35);
  ctx.fillStyle = skin.pantsColor;
  roundRect(ctx, -4, 0, 8, 13, 3);
  ctx.fillStyle = darken(skin.pantsColor, 15);
  ctx.fillRect(-3, 11, 6, 2);
  ctx.fillStyle = skin.pantsColor;
  roundRect(ctx, -3.5, 13, 7, 10, 2);
  ctx.fillStyle = skin.shoeColor;
  ctx.beginPath();
  ctx.ellipse(-1, 24, 6, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = lighten(skin.shoeColor, 30);
  ctx.fillRect(-4, 22, 6, 2);
  ctx.restore();

  const by = -bob;

  // === TORSO ===
  ctx.fillStyle = skin.shirtColor;
  roundRect(ctx, -12, -14 + by, 24, 28, 4);

  // Shirt details based on gear
  if (skin.gear === 'vest') {
    ctx.fillStyle = darken(skin.shirtColor, 25);
    roundRect(ctx, -11, -12 + by, 9, 22, 2);
    roundRect(ctx, 2, -12 + by, 9, 22, 2);
    // Pockets
    ctx.fillStyle = darken(skin.shirtColor, 35);
    ctx.fillRect(-8, 2 + by, 6, 5);
    ctx.fillRect(2, 2 + by, 6, 5);
    // Zipper
    ctx.fillStyle = '#888';
    ctx.fillRect(-0.5, -10 + by, 1, 20);
  } else if (skin.gear === 'jacket') {
    // Collar
    ctx.fillStyle = darken(skin.shirtColor, 20);
    ctx.beginPath();
    ctx.moveTo(-6, -14 + by);
    ctx.lineTo(0, -10 + by);
    ctx.lineTo(6, -14 + by);
    ctx.lineTo(6, -11 + by);
    ctx.lineTo(0, -7 + by);
    ctx.lineTo(-6, -11 + by);
    ctx.closePath();
    ctx.fill();
    // Seam
    ctx.strokeStyle = darken(skin.shirtColor, 30);
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(0, -10 + by);
    ctx.lineTo(0, 12 + by);
    ctx.stroke();
  } else if (skin.gear === 'armor') {
    // Chest plate
    ctx.fillStyle = '#3a3a4a';
    roundRect(ctx, -10, -12 + by, 20, 16, 3);
    ctx.fillStyle = '#555';
    ctx.fillRect(-7, -6 + by, 14, 2);
    ctx.fillRect(-7, 0 + by, 14, 2);
    // Shoulder pads
    ctx.fillStyle = '#444';
    ctx.beginPath();
    ctx.ellipse(-12, -10 + by, 4, 6, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(12, -10 + by, 4, 6, 0.2, 0, Math.PI * 2);
    ctx.fill();
  } else if (skin.gear === 'hoodie') {
    // Hood draping
    ctx.fillStyle = darken(skin.shirtColor, 15);
    ctx.beginPath();
    ctx.moveTo(-8, -14 + by);
    ctx.quadraticCurveTo(0, -18 + by, 8, -14 + by);
    ctx.lineTo(6, -10 + by);
    ctx.lineTo(-6, -10 + by);
    ctx.closePath();
    ctx.fill();
    // Pocket
    ctx.fillStyle = darken(skin.shirtColor, 20);
    roundRect(ctx, -7, 3 + by, 14, 7, 2);
    // String
    ctx.strokeStyle = lighten(skin.shirtColor, 20);
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(-2, -10 + by);
    ctx.lineTo(-2, -3 + by);
    ctx.moveTo(2, -10 + by);
    ctx.lineTo(2, -3 + by);
    ctx.stroke();
  } else if (skin.gear === 'tactical') {
    // Cross-body harness straps
    ctx.strokeStyle = darken(skin.shirtColor, 30);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-9, -13 + by); ctx.lineTo(8, 8 + by);
    ctx.moveTo(9, -13 + by); ctx.lineTo(-8, 8 + by);
    ctx.stroke();
    // Mag pouches
    ctx.fillStyle = darken(skin.shirtColor, 38);
    roundRect(ctx, -10, 0 + by, 6, 8, 1);
    roundRect(ctx, 4, 0 + by, 6, 8, 1);
    // Collar
    ctx.fillStyle = darken(skin.shirtColor, 22);
    roundRect(ctx, -7, -14 + by, 14, 4, 1);
  }

  // Belt
  ctx.fillStyle = '#3a2a1a';
  roundRect(ctx, -12, 10 + by, 24, 4, 1);
  ctx.fillStyle = '#aaa';
  roundRect(ctx, -3, 10 + by, 6, 4, 1);

  // === ARMS ===
  // Left arm
  ctx.save();
  ctx.translate(-13, -9 + by);
  ctx.rotate(-arm - 0.08);
  ctx.fillStyle = skin.shirtColor;
  roundRect(ctx, -4, 0, 8, 12, 3); // upper arm (sleeve)
  ctx.fillStyle = skin.skinTone;
  roundRect(ctx, -3, 11, 6, 9, 2); // forearm
  // Hand
  ctx.fillStyle = skin.skinTone;
  ctx.beginPath();
  ctx.ellipse(0, 21, 3.5, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Right arm (holding gun)
  ctx.save();
  ctx.translate(13, -9 + by);
  ctx.rotate(arm + 0.15);
  ctx.fillStyle = skin.shirtColor;
  roundRect(ctx, -4, 0, 8, 12, 3);
  ctx.fillStyle = skin.skinTone;
  roundRect(ctx, -3, 11, 6, 7, 2);
  // Hand gripping gun
  ctx.fillStyle = skin.skinTone;
  ctx.beginPath();
  ctx.ellipse(0, 18, 3, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();
  // Gun
  ctx.fillStyle = '#222';
  roundRect(ctx, -1, 16, 14, 4, 1); // barrel
  ctx.fillStyle = '#333';
  roundRect(ctx, 0, 14, 6, 7, 1); // grip
  ctx.fillStyle = '#444';
  ctx.fillRect(12, 16, 3, 2); // muzzle
  ctx.restore();

  // === NECK ===
  ctx.fillStyle = skin.skinTone;
  roundRect(ctx, -3.5, -18 + by, 7, 6, 2);

  // === HEAD ===
  // Head shape
  ctx.fillStyle = skin.skinTone;
  ctx.beginPath();
  ctx.ellipse(0, -25 + by, 10, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  // Jaw definition
  ctx.fillStyle = darken(skin.skinTone, 8);
  ctx.beginPath();
  ctx.moveTo(-7, -20 + by);
  ctx.quadraticCurveTo(-8, -15 + by, -4, -14 + by);
  ctx.lineTo(4, -14 + by);
  ctx.quadraticCurveTo(8, -15 + by, 7, -20 + by);
  ctx.fill();

  // Ears
  ctx.fillStyle = skin.skinTone;
  ctx.beginPath();
  ctx.ellipse(-10, -25 + by, 2.5, 4, -0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(10, -25 + by, 2.5, 4, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = darken(skin.skinTone, 15);
  ctx.beginPath();
  ctx.ellipse(-10, -25 + by, 1.5, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(10, -25 + by, 1.5, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hair
  ctx.fillStyle = skin.hairColor;
  if (skin.hairStyle === 'buzz') {
    ctx.beginPath();
    ctx.ellipse(0, -29 + by, 10, 7, 0, Math.PI, 0);
    ctx.fill();
    // texture lines
    ctx.strokeStyle = lighten(skin.hairColor, 20);
    ctx.lineWidth = 0.5;
    for (let i = -6; i <= 6; i += 3) {
      ctx.beginPath();
      ctx.moveTo(i, -34 + by);
      ctx.lineTo(i, -28 + by);
      ctx.stroke();
    }
  } else if (skin.hairStyle === 'slick') {
    ctx.beginPath();
    ctx.ellipse(0, -30 + by, 11, 8, 0, Math.PI * 1.1, -0.1);
    ctx.fill();
    // Swept back style
    ctx.beginPath();
    ctx.moveTo(7, -30 + by);
    ctx.quadraticCurveTo(12, -28 + by, 10, -22 + by);
    ctx.lineTo(8, -24 + by);
    ctx.fill();
  } else if (skin.hairStyle === 'long') {
    ctx.beginPath();
    ctx.ellipse(0, -29 + by, 11, 8, 0, Math.PI, 0);
    ctx.fill();
    // Side hair
    roundRect(ctx, -11, -28 + by, 4, 16, 2);
    roundRect(ctx, 7, -28 + by, 4, 16, 2);
  } else if (skin.hairStyle === 'mohawk') {
    // Shaved sides (faint stubble)
    ctx.fillStyle = darken(skin.skinTone, 18);
    ctx.beginPath();
    ctx.ellipse(0, -29 + by, 10, 6, 0, Math.PI, 0);
    ctx.fill();
    // Central raised crest
    ctx.fillStyle = skin.hairColor;
    ctx.beginPath();
    ctx.moveTo(-3, -28 + by);
    ctx.lineTo(-2, -40 + by);
    ctx.lineTo(0, -34 + by);
    ctx.lineTo(2, -41 + by);
    ctx.lineTo(3, -28 + by);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = lighten(skin.hairColor, 30);
    ctx.fillRect(-1, -38 + by, 2, 10);
  }
  // bald = no hair drawn

  // === FACE ===
  // Eyebrows
  ctx.fillStyle = skin.hairColor;
  ctx.fillRect(-7, -30 + by, 5, 1.8);
  ctx.fillRect(2, -30 + by, 5, 1.8);

  // Eyes - white
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.ellipse(-4, -26 + by, 3.5, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(4, -26 + by, 3.5, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Iris
  ctx.fillStyle = '#4a3020';
  ctx.beginPath();
  ctx.arc(-4, -26 + by, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(4, -26 + by, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Pupil
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(-4, -26 + by, 0.9, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(4, -26 + by, 0.9, 0, Math.PI * 2);
  ctx.fill();

  // Eye highlight
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-3.2, -27 + by, 0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(4.8, -27 + by, 0.6, 0, Math.PI * 2);
  ctx.fill();

  // Nose
  ctx.fillStyle = darken(skin.skinTone, 12);
  ctx.beginPath();
  ctx.moveTo(-1.5, -24 + by);
  ctx.lineTo(0, -20 + by);
  ctx.lineTo(1.5, -24 + by);
  ctx.fill();
  // Nostrils
  ctx.fillStyle = darken(skin.skinTone, 25);
  ctx.beginPath();
  ctx.arc(-1, -20.5 + by, 0.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(1, -20.5 + by, 0.8, 0, Math.PI * 2);
  ctx.fill();

  // Mouth
  ctx.fillStyle = darken(skin.skinTone, 35);
  ctx.beginPath();
  ctx.ellipse(0, -17.5 + by, 3, 1.5, 0, 0, Math.PI);
  ctx.fill();
  // Upper lip
  ctx.strokeStyle = darken(skin.skinTone, 25);
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(-3, -18 + by);
  ctx.quadraticCurveTo(-1, -19 + by, 0, -18.5 + by);
  ctx.quadraticCurveTo(1, -19 + by, 3, -18 + by);
  ctx.stroke();

  ctx.restore();
}

export function drawZombieHuman(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  type: 'walker' | 'runner' | 'tank' | 'explosive' | 'boss',
  frame: number,
  health: number,
  maxHealth: number,
) {
  ctx.save();
  ctx.translate(x, y);
  const sc = type === 'boss' ? 1.6 : type === 'tank' ? 1.3 : type === 'runner' ? 0.95 : 1;
  ctx.scale(sc, sc);

  const shamble = Math.sin(frame * 0.07);
  const reach = Math.sin(frame * 0.05) * 0.5 + 0.6;
  const headTilt = Math.sin(frame * 0.03) * 0.08;

  const skinG = type === 'explosive' ? '#7a8a3a' : type === 'boss' ? '#4a3050' : '#5a7a5a';
  const clothG = type === 'explosive' ? '#5a3a1a' : type === 'boss' ? '#1a0a1a' : '#3a3a2a';

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.ellipse(0, 32, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs
  ctx.save();
  ctx.translate(-5, 12);
  ctx.rotate(shamble * 0.3);
  ctx.fillStyle = clothG;
  roundRect(ctx, -4, 0, 8, 13, 2);
  ctx.fillStyle = skinG;
  roundRect(ctx, -3, 13, 6, 9, 2);
  // Torn fabric
  ctx.fillStyle = clothG;
  ctx.fillRect(-2, 8, 3, 4);
  ctx.restore();

  ctx.save();
  ctx.translate(5, 12);
  ctx.rotate(-shamble * 0.25);
  ctx.fillStyle = clothG;
  roundRect(ctx, -4, 0, 8, 13, 2);
  ctx.fillStyle = skinG;
  roundRect(ctx, -3, 13, 6, 9, 2);
  ctx.restore();

  // Torso
  ctx.fillStyle = clothG;
  roundRect(ctx, -12, -14, 24, 28, 3);
  // Blood & tears
  ctx.fillStyle = '#3a0000';
  ctx.fillRect(-8, -4, 5, 6);
  ctx.fillRect(4, 0, 4, 5);
  ctx.fillStyle = skinG;
  ctx.fillRect(-5, 1, 3, 4); // exposed flesh
  ctx.fillRect(2, -2, 4, 3);

  // Arms reaching
  ctx.save();
  ctx.translate(-13, -9);
  ctx.rotate(-reach);
  ctx.fillStyle = skinG;
  roundRect(ctx, -4, 0, 8, 13, 2);
  roundRect(ctx, -3, 12, 6, 9, 2);
  // Claws
  ctx.fillStyle = darken(skinG, 30);
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(-2 + i * 2, 20, 1.5, 4);
  }
  ctx.restore();

  ctx.save();
  ctx.translate(13, -9);
  ctx.rotate(reach * 0.8);
  ctx.fillStyle = skinG;
  roundRect(ctx, -4, 0, 8, 13, 2);
  roundRect(ctx, -3, 12, 6, 9, 2);
  ctx.fillStyle = darken(skinG, 30);
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(-2 + i * 2, 20, 1.5, 4);
  }
  ctx.restore();

  // Neck
  ctx.fillStyle = skinG;
  roundRect(ctx, -3, -17, 6, 5, 2);

  // Head
  ctx.save();
  ctx.rotate(headTilt);
  ctx.fillStyle = skinG;
  ctx.beginPath();
  ctx.ellipse(0, -25, 10, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  // Decay patches
  ctx.fillStyle = darken(skinG, 25);
  ctx.beginPath();
  ctx.ellipse(4, -22, 4, 3, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(-6, -28, 3, 2, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Sunken eye sockets
  ctx.fillStyle = '#0a0500';
  ctx.beginPath();
  ctx.ellipse(-4, -27, 3.5, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(4, -27, 3.5, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Glowing eyes
  const eyeColor = type === 'boss' ? '#ff00ff' : type === 'explosive' ? '#ffaa00' : '#aaff00';
  ctx.fillStyle = eyeColor;
  ctx.shadowColor = eyeColor;
  ctx.shadowBlur = 4;
  ctx.beginPath();
  ctx.arc(-4, -27, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(4, -27, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Mouth - open jaw
  ctx.fillStyle = '#1a0000';
  ctx.beginPath();
  ctx.ellipse(0, -18, 5, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();
  // Teeth
  ctx.fillStyle = '#ccc';
  ctx.fillRect(-4, -20, 2, 2.5);
  ctx.fillRect(-1, -19.5, 1.5, 2);
  ctx.fillRect(2, -20, 2, 2.5);
  // Lower teeth
  ctx.fillRect(-3, -16.5, 1.5, 2);
  ctx.fillRect(1, -16.5, 2, 2);

  // Missing scalp
  ctx.fillStyle = darken(skinG, 30);
  ctx.beginPath();
  ctx.arc(-2, -33, 5, 0, Math.PI);
  ctx.fill();

  ctx.restore();

  // Explosive glow
  if (type === 'explosive') {
    ctx.strokeStyle = `rgba(255, 140, 0, ${0.4 + Math.sin(frame * 0.12) * 0.3})`;
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Boss bone crown
  if (type === 'boss') {
    ctx.fillStyle = '#ddd';
    for (let i = 0; i < 5; i++) {
      const a = Math.PI + (i / 4) * Math.PI;
      const bx = Math.cos(a) * 9;
      const by2 = -33 + Math.sin(a) * 2;
      ctx.beginPath();
      ctx.moveTo(bx - 2, by2);
      ctx.lineTo(bx, by2 - 7);
      ctx.lineTo(bx + 2, by2);
      ctx.fill();
    }
  }

  ctx.restore();

  // Health bar
  if (health < maxHealth) {
    const barW = 26 * sc;
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(x - barW / 2 - 1, y - 40 * sc, barW + 2, 5);
    ctx.fillStyle = type === 'boss' ? '#cc00cc' : '#cc2222';
    ctx.fillRect(x - barW / 2, y - 40 * sc + 0.5, barW * (health / maxHealth), 4);
  }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}
