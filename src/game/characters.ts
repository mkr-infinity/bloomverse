export interface CharacterSkin {
  id: string;
  name: string;
  body: string;
  shirt: string;
  pants: string;
  hair: string;
  hairStyle: 'short' | 'long' | 'mohawk' | 'bald';
  shoes: string;
  accessory: 'none' | 'helmet' | 'bandana' | 'goggles';
  gender: 'male' | 'female';
}

export const CHARACTERS: CharacterSkin[] = [
  {
    id: 'ghost', name: 'Ghost',
    body: '#d4a574', shirt: '#1a1a2e', pants: '#2d2d44',
    hair: '#1a1a1a', hairStyle: 'short', shoes: '#111',
    accessory: 'bandana', gender: 'male',
  },
  {
    id: 'phoenix', name: 'Phoenix',
    body: '#c68642', shirt: '#8b0000', pants: '#2f2f2f',
    hair: '#ff4500', hairStyle: 'mohawk', shoes: '#222',
    accessory: 'goggles', gender: 'male',
  },
  {
    id: 'viper', name: 'Viper',
    body: '#f5cba7', shirt: '#006400', pants: '#1a1a1a',
    hair: '#2d1b00', hairStyle: 'long', shoes: '#333',
    accessory: 'none', gender: 'female',
  },
  {
    id: 'blaze', name: 'Blaze',
    body: '#8d5524', shirt: '#ff6600', pants: '#333',
    hair: '#000', hairStyle: 'bald', shoes: '#1a1a1a',
    accessory: 'helmet', gender: 'male',
  },
];

export function drawCharacter(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  skin: CharacterSkin,
  scale: number = 1,
  angle: number = 0,
  frame: number = 0,
  isMoving: boolean = false,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  const legSwing = isMoving ? Math.sin(frame * 0.15) * 8 : 0;
  const armSwing = isMoving ? Math.sin(frame * 0.15) * 12 : 0;
  const bodyBob = isMoving ? Math.abs(Math.sin(frame * 0.15)) * 2 : 0;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(0, 28, 10, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs
  ctx.fillStyle = skin.pants;
  ctx.save();
  ctx.translate(-4, 12);
  ctx.rotate((legSwing * Math.PI) / 180);
  ctx.fillRect(-3, 0, 6, 16);
  ctx.fillStyle = skin.shoes;
  ctx.fillRect(-3, 14, 7, 4);
  ctx.restore();

  ctx.fillStyle = skin.pants;
  ctx.save();
  ctx.translate(4, 12);
  ctx.rotate((-legSwing * Math.PI) / 180);
  ctx.fillRect(-3, 0, 6, 16);
  ctx.fillStyle = skin.shoes;
  ctx.fillRect(-4, 14, 7, 4);
  ctx.restore();

  // Body / Shirt
  ctx.fillStyle = skin.shirt;
  const by = -bodyBob;
  ctx.beginPath();
  ctx.roundRect(-9, -8 + by, 18, 22, 3);
  ctx.fill();

  // Belt
  ctx.fillStyle = '#222';
  ctx.fillRect(-9, 10 + by, 18, 3);

  // Arms
  ctx.fillStyle = skin.body;
  ctx.save();
  ctx.translate(-10, -4 + by);
  ctx.rotate((armSwing * Math.PI) / 180);
  ctx.fillRect(-3, 0, 5, 14);
  ctx.restore();

  ctx.save();
  ctx.translate(10, -4 + by);
  ctx.rotate((-armSwing * Math.PI) / 180);
  ctx.fillRect(-2, 0, 5, 14);
  ctx.restore();

  // Weapon in hand (gun shape)
  ctx.save();
  ctx.translate(12, 2 + by);
  ctx.rotate((angle * 0.3) + (-armSwing * Math.PI) / 180);
  ctx.fillStyle = '#444';
  ctx.fillRect(0, -2, 14, 4);
  ctx.fillRect(2, 2, 3, 5);
  ctx.restore();

  // Head
  ctx.fillStyle = skin.body;
  ctx.beginPath();
  ctx.arc(0, -16 + by, 10, 0, Math.PI * 2);
  ctx.fill();

  // Hair
  ctx.fillStyle = skin.hair;
  if (skin.hairStyle === 'short') {
    ctx.beginPath();
    ctx.arc(0, -19 + by, 10, Math.PI, 0);
    ctx.fill();
  } else if (skin.hairStyle === 'long') {
    ctx.beginPath();
    ctx.arc(0, -19 + by, 10, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(-10, -18 + by, 4, 14);
    ctx.fillRect(6, -18 + by, 4, 14);
  } else if (skin.hairStyle === 'mohawk') {
    ctx.fillRect(-3, -30 + by, 6, 14);
  }

  // Eyes
  ctx.fillStyle = '#fff';
  ctx.fillRect(-5, -18 + by, 4, 3);
  ctx.fillRect(1, -18 + by, 4, 3);
  ctx.fillStyle = '#111';
  ctx.fillRect(-4, -17 + by, 2, 2);
  ctx.fillRect(2, -17 + by, 2, 2);

  // Accessory
  if (skin.accessory === 'bandana') {
    ctx.fillStyle = '#cc0000';
    ctx.fillRect(-10, -20 + by, 20, 3);
    ctx.fillRect(8, -19 + by, 6, 2);
  } else if (skin.accessory === 'helmet') {
    ctx.fillStyle = '#3a3a3a';
    ctx.beginPath();
    ctx.arc(0, -19 + by, 11, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#555';
    ctx.fillRect(-11, -19 + by, 22, 3);
  } else if (skin.accessory === 'goggles') {
    ctx.fillStyle = '#ff6600';
    ctx.fillRect(-7, -19 + by, 14, 4);
    ctx.fillStyle = '#222';
    ctx.fillRect(-6, -18 + by, 5, 3);
    ctx.fillRect(1, -18 + by, 5, 3);
  }

  ctx.restore();
}

export function drawZombie(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  type: 'walker' | 'runner' | 'tank' | 'explosive' | 'boss',
  frame: number,
  health: number,
  maxHealth: number,
) {
  ctx.save();
  ctx.translate(x, y);

  const scale = type === 'boss' ? 1.8 : type === 'tank' ? 1.4 : type === 'runner' ? 0.9 : 1;
  ctx.scale(scale, scale);

  const swing = Math.sin(frame * 0.1) * 10;
  const armReach = Math.sin(frame * 0.08) * 15 + 20;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(0, 28, 10 * scale, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Zombie body colors
  const skinColor = type === 'explosive' ? '#7a8a2a' : type === 'boss' ? '#4a2a4a' : '#5a7a5a';
  const clothColor = type === 'explosive' ? '#8b4513' : type === 'boss' ? '#2a0a2a' : '#3a3a2a';
  const bloodColor = '#5a0000';

  // Legs (shambling)
  ctx.fillStyle = clothColor;
  ctx.save();
  ctx.translate(-4, 12);
  ctx.rotate((swing * Math.PI) / 180);
  ctx.fillRect(-3, 0, 6, 16);
  ctx.restore();
  ctx.save();
  ctx.translate(4, 12);
  ctx.rotate((-swing * Math.PI) / 180);
  ctx.fillRect(-3, 0, 6, 16);
  ctx.restore();

  // Body (torn)
  ctx.fillStyle = clothColor;
  ctx.beginPath();
  ctx.roundRect(-9, -8, 18, 22, 2);
  ctx.fill();
  // Blood stains
  ctx.fillStyle = bloodColor;
  ctx.fillRect(-6, -2, 4, 5);
  ctx.fillRect(3, 2, 5, 4);

  // Arms (reaching forward)
  ctx.fillStyle = skinColor;
  ctx.save();
  ctx.translate(-10, -4);
  ctx.rotate((armReach * Math.PI) / 180);
  ctx.fillRect(-3, 0, 5, 14);
  ctx.restore();
  ctx.save();
  ctx.translate(10, -4);
  ctx.rotate((-armReach * Math.PI) / 180 - 0.3);
  ctx.fillRect(-2, 0, 5, 14);
  ctx.restore();

  // Head
  ctx.fillStyle = skinColor;
  ctx.beginPath();
  ctx.arc(0, -16, 10, 0, Math.PI * 2);
  ctx.fill();

  // Zombie face
  ctx.fillStyle = '#300';
  ctx.fillRect(-6, -18, 4, 4); // eye socket
  ctx.fillRect(2, -18, 4, 4);
  ctx.fillStyle = '#ff0';
  ctx.fillRect(-5, -17, 2, 2); // glowing eyes
  ctx.fillRect(3, -17, 2, 2);
  // Mouth
  ctx.fillStyle = '#300';
  ctx.fillRect(-4, -11, 8, 3);
  ctx.fillStyle = '#fff';
  ctx.fillRect(-3, -11, 2, 2);
  ctx.fillRect(1, -11, 2, 2);
  ctx.fillRect(4, -11, 1, 2);

  // Explosive glow
  if (type === 'explosive') {
    ctx.strokeStyle = `rgba(255, 100, 0, ${0.5 + Math.sin(frame * 0.2) * 0.3})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Boss crown
  if (type === 'boss') {
    ctx.fillStyle = '#aa0000';
    ctx.beginPath();
    ctx.moveTo(-8, -27);
    ctx.lineTo(-6, -33);
    ctx.lineTo(-2, -28);
    ctx.lineTo(0, -35);
    ctx.lineTo(2, -28);
    ctx.lineTo(6, -33);
    ctx.lineTo(8, -27);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();

  // Health bar (above character, outside scale transform)
  if (health < maxHealth) {
    const barW = 30 * scale;
    const barY = y - 35 * scale;
    ctx.fillStyle = '#333';
    ctx.fillRect(x - barW / 2, barY, barW, 4);
    ctx.fillStyle = type === 'boss' ? '#ff00ff' : '#ff2d55';
    ctx.fillRect(x - barW / 2, barY, barW * (health / maxHealth), 4);
  }
}
