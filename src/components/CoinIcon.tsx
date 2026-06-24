interface Props { size?: number; }

/** Small gold coin icon used wherever coins are displayed. */
export default function CoinIcon({ size = 16 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', filter: 'drop-shadow(0 0 4px rgba(255,200,0,0.6))' }} aria-hidden="true">
      <defs>
        <radialGradient id="coinG" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#fff3b0" />
          <stop offset="45%" stopColor="#ffd23f" />
          <stop offset="100%" stopColor="#e08a00" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#coinG)" stroke="#b86b00" strokeWidth="1.2" />
      <circle cx="12" cy="12" r="6.6" fill="none" stroke="#fff0a8" strokeWidth="1" opacity="0.7" />
      <text x="12" y="16.2" textAnchor="middle" fontSize="9" fontWeight="900" fill="#8a4b00" fontFamily="Orbitron, monospace">$</text>
    </svg>
  );
}
