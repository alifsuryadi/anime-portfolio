import { useId } from "react";

/**
 * Close-up of the character's eyes for the section cut-in: the frame an action
 * anime flashes before a scene change. Same eyes as `three/faceTextures.ts`
 * and `ChibiArt`, with the brows set low for a determined look.
 */
const INK = "#1C1026";
const HAIR = "#B7A2F2";
const HAIR_SHADE = "#8E76DC";
const SKIN = "#FFE6D8";
const SKIN_SHADE = "#F2B1AA";

const LID = "M-44 8 C -30 -40, 22 -44, 47 -8 C 42 10, 24 20, -2 20 C -24 20, -38 17, -44 8 Z";

export function EyeCutIn({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 600 150"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`i${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4A123C" />
          <stop offset="0.5" stopColor="#C93F7C" />
          <stop offset="1" stopColor="#FF9CC2" />
        </linearGradient>
        <clipPath id={`l${id}`}>
          <path d={LID} />
        </clipPath>
      </defs>
      <rect width="600" height="150" fill={SKIN} />
      {/* shadow under the fringe, and the bridge of the nose */}
      <path
        d="M0 0 H600 V52 L560 34 L520 62 L470 30 L420 58 L370 28 L320 54 L270 28 L220 58 L170 30 L120 62 L70 34 L0 56 Z"
        fill={SKIN_SHADE}
      />
      <path d="M306 118 L298 140" stroke="#D58B8E" strokeWidth="4" strokeLinecap="round" />

      {[-1, 1].map((dir) => (
        <g key={dir} transform={`translate(${300 + dir * 104} 92) scale(${dir} 1)`}>
          <path d={LID} fill="#FFFAFB" />
          <g clipPath={`url(#l${id})`}>
            <rect x="-50" y="-50" width="100" height="22" fill="#9276B0" opacity="0.4" />
            <ellipse
              cx="-4"
              cy="-5"
              rx="24"
              ry="31"
              fill={`url(#i${id})`}
              stroke="#3A0F33"
              strokeWidth="4"
            />
            <ellipse cx="-4" cy="-6" rx="9" ry="14" fill="#2A0A26" />
            <ellipse cx="-4" cy="13" rx="13" ry="7" fill="#FFD6E8" opacity="0.6" />
            <ellipse
              cx="-15"
              cy="-17"
              rx="7"
              ry="9"
              fill="#FFFFFF"
              transform="rotate(-23 -15 -17)"
            />
            <circle cx="6" cy="6" r="3.5" fill="#FFFFFF" />
          </g>
          <path
            d="M-47 11 C -31 -41, 22 -45, 47 -9 L 62 -19 L 54 -3 L 60 4 L 46 1 C 26 -31, -24 -30, -41 12 Z"
            fill={INK}
          />
          <path
            d="M10 21 Q 32 20 43 5"
            stroke={INK}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          {/* brow: inner end pulled down */}
          <path
            d="M-46 -44 Q 0 -66 52 -62"
            stroke="#6A56A8"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      ))}

      {/* fringe */}
      <path
        d="M0 0 H600 V40 L560 20 L520 50 L470 16 L420 46 L370 14 L320 42 L270 14 L220 46 L170 16 L120 50 L70 20 L0 44 Z"
        fill={HAIR}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M470 16 L520 50 L540 34 L510 0 H470 Z M170 16 L220 46 L236 30 L210 0 H176 Z"
        fill={HAIR_SHADE}
      />
    </svg>
  );
}
