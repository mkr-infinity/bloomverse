export interface CharacterSkin {
  id: string;
  name: string;
  skinTone: string;
  hairColor: string;
  shirtColor: string;
  pantsColor: string;
  shoeColor: string;
  hairStyle: 'buzz' | 'slick' | 'long' | 'bald';
  gear: 'vest' | 'jacket' | 'armor' | 'hoodie';
}

export const CHARACTERS: CharacterSkin[] = [
  { id: 'ghost', name: 'Ghost', skinTone: '#e8b898', hairColor: '#1a1a1a', shirtColor: '#1c1c2e', pantsColor: '#2a2a3a', shoeColor: '#111', hairStyle: 'buzz', gear: 'vest' },
  { id: 'phoenix', name: 'Phoenix', skinTone: '#c68642', hairColor: '#cc3300', shirtColor: '#880000', pantsColor: '#222', shoeColor: '#1a1a1a', hairStyle: 'slick', gear: 'jacket' },
  { id: 'viper', name: 'Viper', skinTone: '#f5cba7', hairColor: '#2d1b00', shirtColor: '#1a4a1a', pantsColor: '#111', shoeColor: '#222', hairStyle: 'long', gear: 'armor' },
  { id: 'blaze', name: 'Blaze', skinTone: '#6f4e37', hairColor: '#000', shirtColor: '#cc4400', pantsColor: '#1a1a1a', shoeColor: '#0a0a0a', hairStyle: 'bald', gear: 'hoodie' },
];

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

  const walk = moving ? Math.sin(frame * 0.12) : 0;
  const bob = moving ? Math.abs(Math.sin(frame * 0.12)) * 1.5 : 0;
  const armSwing = moving ? Math.sin(frame * 0.12) * 0.4 : 0;

  // Drop shadow
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.ellipse(0, 30, 12, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // LEGS with proper proportions
  ctx.save();
  ctx.translate(-5, 10);
  ctx.rotate(walk * 0.4);
  // Left thigh
  ctx.fillStyle = skin.pantsColor;
  drawRoundedLimb(ctx, -3, 0, 7, 12);
  // Left calf
  ctx.fillStyle = darken(skin.pantsColor, 20);
  drawRoundedLimb(ctx, -2, 11, 6, 10);
  // Left shoe
  ctx.fillStyle = skin.shoeColor;
  ctx.beginPath();
  ctx.ellipse(1, 22, 5, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(5, 10);
  ctx.rotate(-walk * 0.4);
  ctx.fillStyle = skin.pantsColor;
  drawRoundedLimb(ctx, -3, 0, 7, 12);
  ctx.fillStyle = darken(skin.pantsColor, 20);
  drawRoundedLimb(ctx, -2, 11, 6, 10);
  ctx.fillStyle = skin.shoeColor;
  ctx.beginPath();
  ctx.ellipse(1, 22, 5, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // TORSO - muscular proportioned
  const ty = -bob;
  ctx.fillStyle = skin.shirtColor;
  drawRoundedLimb(ctx, -11, -12 + ty, 22, 24);

  // Gear overlay
  if (skin.gear === 'vest') {
    ctx.fillStyle = darken(skin.shirtColor, 30);
    drawRoundedLimb(ctx, -9, -10 + ty, 8, 20);
    drawRoundedLimb(ctx, 1, -10 + ty, 8, 20);
  } else if (skin.gear === 'armor') {
    ctx.fillStyle = '#3a3a4a';
    drawRoundedLimb(ctx, -10, -10 + ty, 20, 14);
    ctx.fillStyle = '#555';
    ctx.fillRect(-6, -4 + ty, 12, 2);
  } else if (skin.gear === 'jacket') {
    ctx.strokeStyle = darken(skin.shirtColor, 40);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -12 + ty);
    ctx.lineTo(0, 12 + ty);
    ctx.stroke();
  }

  // Belt
  ctx.fillStyle = '#3a2a1a';
  ctx.fillRect(-11, 8 + ty, 22, 3);
  ctx.fillStyle = '#888';
  ctx.fillRect(-2, 8 + ty, 4, 3);

  // ARMS - proportional human arms
  // Left arm
  ctx.save();
  ctx.translate(-12, -8 + ty);
  ctx.rotate(-armSwing - 0.1);
  ctx.fillStyle = skin.shirtColor;
  drawRoundedLimb(ctx, -3, 0, 7, 10);
  ctx.fillStyle = skin.skinTone;
  drawRoundedLimb(ctx, -2, 9, 5, 8);
  ctx.restore();

  // Right arm (holding weapon)
  ctx.save();
  ctx.translate(12, -8 + ty);
  ctx.rotate(armSwing + 0.2);
  ctx.fillStyle = skin.shirtColor;
  drawRoundedLimb(ctx, -3, 0, 7, 10);
  ctx.fillStyle = skin.skinTone;
  drawRoundedLimb(ctx, -2, 9, 5, 6);
  // Gun in hand
  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(0, 13, 12, 4);
  ctx.fillStyle = '#444';
  ctx.fillRect(1, 11, 3, 5);
  ctx.restore();

  // NECK
  ctx.fillStyle = skin.skinTone;
  drawRoundedLimb(ctx, -3, -16 + ty, 6, 5);

  // HEAD - realistic proportions
  ctx.fillStyle = skin.skinTone;
  ctx.beginPath();
  ctx.ellipse(0, -22 + ty, 9, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ears
  ctx.beginPath();
  ctx.ellipse(-9, -22 + ty, 2.5, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(9, -22 + ty, 2.5, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hair
  ctx.fillStyle = skin.hairColor;
  if (skin.hairStyle === 'buzz') {
    ctx.beginPath();
    ctx.ellipse(0, -25 + ty, 9, 7, 0, Math.PI, 0);
    ctx.fill();
  } else if (skin.hairStyle === 'slick') {
    ctx.beginPath();
    ctx.ellipse(0, -26 + ty, 10, 8, 0, Math.PI * 1.1, -0.1);
    ctx.fill();
    ctx.fillRect(6, -28 + ty, 4, 6);
  } else if (skin.hairStyle === 'long') {
    ctx.beginPath();
    ctx.ellipse(0, -25 + ty, 10, 8, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(-10, -25 + ty, 4, 12);
    ctx.fillRect(6, -25 + ty, 4, 12);
  }

  // Face features
  // Eyebrows
  ctx.fillStyle = skin.hairColor;
  ctx.fillRect(-6, -25 + ty, 4, 1.5);
  ctx.fillRect(2, -25 + ty, 4, 1.5);

  // Eyes - detailed
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.ellipse(-4, -22 + ty, 3, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(4, -22 + ty, 3, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  // Iris
  ctx.fillStyle = '#3a2a1a';
  ctx.beginPath();
  ctx.arc(-4, -22 + ty, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(4, -22 + ty, 1.5, 0, Math.PI * 2);
  ctx.fill();
  // Pupils
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(-4, -22 + ty, 0.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(4, -22 + ty, 0.8, 0, Math.PI * 2);
  ctx.fill();

  // Nose
  ctx.fillStyle = darken(skin.skinTone, 15);
  ctx.beginPath();
  ctx.moveTo(-1.5, -20 + ty);
  ctx.lineTo(0, -17 + ty);
  ctx.lineTo(1.5, -20 + ty);
  ctx.fill();

  // Mouth
  ctx.strokeStyle = darken(skin.skinTone, 30);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, -15 + ty, 3, 0.1, Math.PI - 0.1);
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

  const sc = type === 'boss' ? 1.7 : type === 'tank' ? 1.3 : type === 'runner' ? 0.95 : 1;
  ctx.scale(sc, sc);

  const shamble = Math.sin(frame * 0.08) * 0.3;
  const armReach = Math.sin(frame * 0.06) * 0.5 + 0.8;
  const headTilt = Math.sin(frame * 0.04) * 0.1;

  const skinG = type === 'explosive' ? '#7a8a3a' : type === 'boss' ? '#4a3050' : '#5a7a5a';
  const clothG = type === 'explosive' ? '#5a3a1a' : type === 'boss' ? '#1a0a1a' : '#3a3a2a';

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(0, 30, 11, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs shambling
  ctx.save();
  ctx.translate(-5, 10);
  ctx.rotate(shamble);
  ctx.fillStyle = clothG;
  drawRoundedLimb(ctx, -3, 0, 7, 12);
  ctx.fillStyle = darken(clothG, 10);
  drawRoundedLimb(ctx, -2, 11, 6, 9);
  // Torn pants detail
  ctx.fillStyle = skinG;
  ctx.fillRect(-1, 8, 4, 3);
  ctx.restore();

  ctx.save();
  ctx.translate(5, 10);
  ctx.rotate(-shamble * 0.7);
  ctx.fillStyle = clothG;
  drawRoundedLimb(ctx, -3, 0, 7, 12);
  ctx.fillStyle = darken(clothG, 10);
  drawRoundedLimb(ctx, -2, 11, 6, 9);
  ctx.restore();

  // Torso torn
  ctx.fillStyle = clothG;
  drawRoundedLimb(ctx, -11, -12, 22, 24);
  // Blood/rip marks
  ctx.fillStyle = '#4a0000';
  ctx.fillRect(-7, -5, 5, 6);
  ctx.fillRect(3, -1, 4, 5);
  ctx.fillStyle = skinG;
  ctx.fillRect(-5, 0, 3, 4);

  // Arms reaching forward
  ctx.save();
  ctx.translate(-12, -8);
  ctx.rotate(-armReach);
  ctx.fillStyle = skinG;
  drawRoundedLimb(ctx, -3, 0, 7, 12);
  drawRoundedLimb(ctx, -2, 11, 5, 8);
  // Clawed fingers
  ctx.fillStyle = darken(skinG, 30);
  ctx.fillRect(-2, 18, 2, 4);
  ctx.fillRect(0, 17, 2, 5);
  ctx.fillRect(2, 18, 2, 4);
  ctx.restore();

  ctx.save();
  ctx.translate(12, -8);
  ctx.rotate(armReach * 0.8);
  ctx.fillStyle = skinG;
  drawRoundedLimb(ctx, -3, 0, 7, 12);
  drawRoundedLimb(ctx, -2, 11, 5, 8);
  ctx.fillStyle = darken(skinG, 30);
  ctx.fillRect(-2, 18, 2, 4);
  ctx.fillRect(0, 17, 2, 5);
  ctx.fillRect(2, 18, 2, 4);
  ctx.restore();

  // Neck
  ctx.fillStyle = skinG;
  drawRoundedLimb(ctx, -3, -16, 6, 5);

  // Head
  ctx.save();
  ctx.rotate(headTilt);
  ctx.fillStyle = skinG;
  ctx.beginPath();
  ctx.ellipse(0, -22, 9, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Decayed face
  ctx.fillStyle = darken(skinG, 20);
  ctx.beginPath();
  ctx.ellipse(3, -20, 4, 3, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Sunken glowing eyes
  ctx.fillStyle = '#1a0a00';
  ctx.beginPath();
  ctx.ellipse(-4, -23, 3, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(4, -23, 3, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  // Glow
  ctx.fillStyle = type === 'boss' ? '#ff00ff' : type === 'explosive' ? '#ffaa00' : '#aaff00';
  ctx.beginPath();
  ctx.arc(-4, -23, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(4, -23, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Mouth - gaping jaw
  ctx.fillStyle = '#2a0000';
  ctx.beginPath();
  ctx.ellipse(0, -15, 4, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  // Teeth
  ctx.fillStyle = '#ddd';
  ctx.fillRect(-3, -16, 2, 2);
  ctx.fillRect(1, -16, 2, 2);
  ctx.fillRect(-1, -14, 2, 2);

  // Missing hair / wound
  ctx.fillStyle = darken(skinG, 25);
  ctx.beginPath();
  ctx.arc(-3, -29, 5, 0, Math.PI * 1.5);
  ctx.fill();

  ctx.restore();

  // Explosive glow ring
  if (type === 'explosive') {
    ctx.strokeStyle = `rgba(255, 150, 0, ${0.4 + Math.sin(frame * 0.15) * 0.3})`;
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(0, 0, 25, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Boss crown of bone
  if (type === 'boss') {
    ctx.fillStyle = '#ddd';
    const spikes = 5;
    for (let i = 0; i < spikes; i++) {
      const a = Math.PI + (i / (spikes - 1)) * Math.PI;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 8, -30 + Math.sin(a) * 3);
      ctx.lineTo(Math.cos(a) * 6, -37);
      ctx.lineTo(Math.cos(a) * 10, -30 + Math.sin(a) * 3);
      ctx.fill();
    }
  }

  ctx.restore();

  // Health bar
  if (health < maxHealth) {
    const barW = 28 * sc;
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(x - barW / 2 - 1, y - 38 * sc - 1, barW + 2, 6);
    ctx.fillStyle = type === 'boss' ? '#cc00cc' : '#cc2222';
    ctx.fillRect(x - barW / 2, y - 38 * sc, barW * (health / maxHealth), 4);
  }
}

function drawRoundedLimb(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const r = Math.min(w, h) * 0.3;
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

function darken(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, ((num >> 16) & 0xff) - amount);
  const g = Math.max(0, ((num >> 8) & 0xff) - amount);
  const b = Math.max(0, (num & 0xff) - amount);
  return `rgb(${r},${g},${b})`;
}
