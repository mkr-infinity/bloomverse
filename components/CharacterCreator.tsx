"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type CharacterStyle = 'warrior' | 'mage' | 'rogue' | 'ranger' | 'artificer' | 'dreamer';
type Accessory = 'crown' | 'mask' | 'cape' | 'glow' | 'wings' | 'aura';
type Background = 'forest' | 'mountain' | 'ocean' | 'sky' | 'void' | 'crystal';

const STYLES: { id: CharacterStyle; label: string; icon: string; desc: string; colors: string[] }[] = [
  { id: 'warrior', label: 'Warrior', icon: '⚔️', desc: 'Brave & Strong', colors: ['#e85d5d', '#c0392b', '#f0b32a'] },
  { id: 'mage', label: 'Mage', icon: '🔮', desc: 'Wise & Mystical', colors: ['#a78bfa', '#7c3aed', '#60a5fa'] },
  { id: 'rogue', label: 'Rogue', icon: '🗡️', desc: 'Swift & Cunning', colors: ['#34d399', '#059669', '#e8a87c'] },
  { id: 'ranger', label: 'Ranger', icon: '🏹', desc: 'Wild & Free', colors: ['#4ade80', '#16a34a', '#fbbf24'] },
  { id: 'artificer', label: 'Artificer', icon: '⚙️', desc: 'Creative & Brilliant', colors: ['#f97316', '#ea580c', '#e8b830'] },
  { id: 'dreamer', label: 'Dreamer', icon: '✨', desc: 'Visionary & Inspired', colors: ['#fb7185', '#e85d5d', '#f0d0a0'] },
];

const ACCESSORIES: Accessory[] = ['crown', 'mask', 'cape', 'glow', 'wings', 'aura'];
const BACKGROUNDS: Background[] = ['forest', 'mountain', 'ocean', 'sky', 'void', 'crystal'];

export function CharacterCreator({
  onSave,
  initial,
}: {
  onSave: (char: CharacterData) => void;
  initial?: CharacterData;
}) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<CharacterData>(
    initial || {
      name: '',
      style: 'dreamer',
      accessory: null,
      background: 'void',
      colors: ['#e8b830', '#fbbf24', '#f0d0a0'],
      bio: '',
      title: 'New Citizen',
    }
  );

  const update = (partial: Partial<CharacterData>) => setData((d) => ({ ...d, ...partial }));

  const steps = [
    {
      title: 'Choose Your Name',
      content: (
        <div className="character-input-group">
          <input
            type="text"
            value={data.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="Enter your citizen name..."
            className="character-input"
            maxLength={24}
            autoFocus
          />
          <input
            type="text"
            value={data.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="Your title (e.g., The Brave)"
            className="character-input"
            maxLength={32}
          />
          <textarea
            value={data.bio}
            onChange={(e) => update({ bio: e.target.value })}
            placeholder="Tell your story..."
            className="character-textarea"
            rows={3}
            maxLength={200}
          />
        </div>
      ),
    },
    {
      title: 'Select Your Style',
      content: (
        <div className="character-style-grid">
          {STYLES.map((s) => (
            <motion.button
              key={s.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => update({ style: s.id, colors: s.colors })}
              className={`character-style-card ${data.style === s.id ? 'active' : ''}`}
              style={{
                borderColor: data.style === s.id ? s.colors[0] : 'rgba(232,184,48,0.1)',
                boxShadow: data.style === s.id ? `0 0 20px ${s.colors[0]}40` : 'none',
              }}
            >
              <span className="character-style-icon">{s.icon}</span>
              <span className="character-style-label">{s.label}</span>
              <span className="character-style-desc">{s.desc}</span>
              <div className="character-style-colors">
                {s.colors.map((c, i) => (
                  <span key={i} className="character-color-dot" style={{ background: c }} />
                ))}
              </div>
            </motion.button>
          ))}
        </div>
      ),
    },
    {
      title: 'Equip Accessories',
      content: (
        <div className="character-accessories-grid">
          {ACCESSORIES.map((a) => (
            <motion.button
              key={a}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => update({ accessory: data.accessory === a ? null : a })}
              className={`character-accessory-card ${data.accessory === a ? 'active' : ''}`}
            >
              <span className="character-accessory-icon">{accessoryIcon(a)}</span>
              <span className="character-accessory-label">{a.charAt(0).toUpperCase() + a.slice(1)}</span>
            </motion.button>
          ))}
        </div>
      ),
    },
    {
      title: 'Choose Background',
      content: (
        <div className="character-background-grid">
          {BACKGROUNDS.map((b) => (
            <motion.button
              key={b}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => update({ background: b })}
              className={`character-background-card ${data.background === b ? 'active' : ''}`}
            >
              <div
                className="character-background-preview"
                style={{ background: backgroundGradient(b) }}
              />
              <span className="character-background-label">{b.charAt(0).toUpperCase() + b.slice(1)}</span>
            </motion.button>
          ))}
        </div>
      ),
    },
    {
      title: 'Customize Colors',
      content: (
        <div className="character-colors-customizer">
          <label className="character-color-label">Primary Color</label>
          <input
            type="color"
            value={data.colors[0]}
            onChange={(e) => update({ colors: [e.target.value, data.colors[1], data.colors[2]] })}
            className="character-color-picker"
          />
          <label className="character-color-label">Secondary Color</label>
          <input
            type="color"
            value={data.colors[1]}
            onChange={(e) => update({ colors: [data.colors[0], e.target.value, data.colors[2]] })}
            className="character-color-picker"
          />
          <label className="character-color-label">Accent Color</label>
          <input
            type="color"
            value={data.colors[2]}
            onChange={(e) => update({ colors: [data.colors[0], data.colors[1], e.target.value] })}
            className="character-color-picker"
          />
          <div
            className="character-color-preview"
            style={{
              background: `linear-gradient(135deg, ${data.colors[0]}, ${data.colors[1]}, ${data.colors[2]})`,
            }}
          />
        </div>
      ),
    },
  ];

  const totalSteps = steps.length;

  return (
    <div className="character-creator">
      <div className="character-creator-header">
        <h2 className="character-creator-title">Create Your Character</h2>
        <div className="character-creator-steps">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`character-step-dot ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}
              onClick={() => i < step && setStep(i)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="character-creator-body"
        >
          <h3 className="character-step-title">{steps[step].title}</h3>
          {steps[step].content}
        </motion.div>
      </AnimatePresence>

      <div className="character-creator-footer">
        <button
          className="character-btn character-btn-secondary"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          Back
        </button>
        <span className="character-step-counter">
          {step + 1} / {totalSteps}
        </span>
        {step < totalSteps - 1 ? (
          <button className="character-btn character-btn-primary" onClick={() => setStep(step + 1)}>
            Next
          </button>
        ) : (
          <button
            className="character-btn character-btn-primary character-btn-glow"
            onClick={() => onSave(data)}
          >
            Confirm Character
          </button>
        )}
      </div>
    </div>
  );
}

export type CharacterData = {
  name: string;
  style: CharacterStyle;
  accessory: Accessory | null;
  background: Background;
  colors: [string, string, string];
  bio: string;
  title: string;
};

function accessoryIcon(a: Accessory): string {
  const icons: Record<Accessory, string> = {
    crown: '👑',
    mask: '🎭',
    cape: '🧙',
    glow: '💫',
    wings: '🕊️',
    aura: '🔆',
  };
  return icons[a];
}

function backgroundGradient(b: Background): string {
  const gradients: Record<Background, string> = {
    forest: 'linear-gradient(135deg, #0d2818, #1a4a2e, #2d6a3e)',
    mountain: 'linear-gradient(135deg, #1a1a2e, #3a3a5a, #6a6a8a)',
    ocean: 'linear-gradient(135deg, #0a1a2e, #0d2a4a, #1a4a7a)',
    sky: 'linear-gradient(135deg, #1a1a3e, #3a2a6a, #5a3a8a)',
    void: 'linear-gradient(135deg, #0a0a0a, #1a0a1a, #0d0d1a)',
    crystal: 'linear-gradient(135deg, #1a0a2a, #2a1a4a, #3a2a6a)',
  };
  return gradients[b];
}
