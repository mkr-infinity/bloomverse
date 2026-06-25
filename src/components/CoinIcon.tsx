interface Props { size?: number; }

/**
 * Premium 3D-style faction coin: a beveled gunmetal token with a deep-red
 * face and an embossed human skull. Carries a red glow so it reads as the
 * game's currency everywhere it appears.
 */
export default function CoinIcon({ size = 16 }: Props) {
  const id = `c${Math.round(size)}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      style={{ display: 'block', filter: 'drop-shadow(0 0 5px rgba(255,40,70,0.65))' }}
      aria-hidden="true"
    >
      <defs>
        {/* metallic beveled rim */}
        <radialGradient id={`${id}rim`} cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#9aa0aa" />
          <stop offset="45%" stopColor="#5a5f6b" />
          <stop offset="80%" stopColor="#2c2f38" />
          <stop offset="100%" stopColor="#15171d" />
        </radialGradient>
        {/* deep red coin face */}
        <radialGradient id={`${id}face`} cx="40%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#ff5a72" />
          <stop offset="40%" stopColor="#d11533" />
          <stop offset="100%" stopColor="#6e0014" />
        </radialGradient>
        {/* bone skull shading */}
        <linearGradient id={`${id}bone`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbf7ef" />
          <stop offset="100%" stopColor="#b9b0a0" />
        </linearGradient>
      </defs>

      {/* outer metallic disc */}
      <circle cx="24" cy="24" r="23" fill={`url(#${id}rim)`} stroke="#0c0d11" strokeWidth="1" />
      {/* knurled edge highlight */}
      <circle cx="24" cy="24" r="20.5" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      {/* red face */}
      <circle cx="24" cy="24" r="18" fill={`url(#${id}face)`} stroke="#3a0009" strokeWidth="1" />
      {/* inner ring */}
      <circle cx="24" cy="24" r="14.5" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="1" />

      {/* === EMBOSSED SKULL === */}
      <g fill={`url(#${id}bone)`} stroke="#7a7264" strokeWidth="0.5">
        {/* cranium */}
        <path d="M24 11c-6.2 0-10.5 4.3-10.5 10 0 3.4 1.6 5.9 3.6 7.6 0.7 0.6 1 1.1 1.05 2l0.2 2.2c0.06 0.9 0.7 1.4 1.6 1.4h7.9c0.9 0 1.55-0.5 1.6-1.4l0.2-2.2c0.06-0.9 0.35-1.4 1.05-2 2-1.7 3.6-4.2 3.6-7.6 0-5.7-4.3-10-10.3-10z" />
      </g>
      {/* eye sockets */}
      <ellipse cx="19.3" cy="22.3" rx="3.1" ry="3.5" fill="#1a0205" />
      <ellipse cx="28.7" cy="22.3" rx="3.1" ry="3.5" fill="#1a0205" />
      {/* eye glints */}
      <circle cx="20.4" cy="21.2" r="0.8" fill="rgba(255,120,140,0.9)" />
      <circle cx="29.8" cy="21.2" r="0.8" fill="rgba(255,120,140,0.9)" />
      {/* nasal cavity */}
      <path d="M24 24.5l-1.6 3.3h3.2z" fill="#1a0205" />
      {/* teeth */}
      <g fill="#1a0205">
        <rect x="20.4" y="33.4" width="1.4" height="2.6" rx="0.4" />
        <rect x="23.3" y="33.6" width="1.4" height="2.8" rx="0.4" />
        <rect x="26.2" y="33.4" width="1.4" height="2.6" rx="0.4" />
      </g>

      {/* top sheen */}
      <ellipse cx="19" cy="13" rx="9" ry="4" fill="rgba(255,255,255,0.12)" />
    </svg>
  );
}
