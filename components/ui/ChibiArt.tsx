import { useId } from "react";

/**
 * Original 2D chibi used by the loader, the eyecatch and the static (no-WebGL /
 * reduced motion) mode. She is the SD version of the 3D character in
 * `three/AnimeModel.tsx`, so the two must stay in step: lavender twin tails
 * with spiky bangs, cat-ear headphones, sailor uniform with a sakura ribbon,
 * pleated skirt, thigh-high stockings with a neon band, orange sneakers.
 *
 * Drawn like a cel: ink outlines, flat fills and a single shadow tone.
 */
type Props = {
  pose?: "idle" | "wave" | "cheer";
  happy?: boolean;
  className?: string;
  title?: string;
};

const INK = "#1C1026";
const HAIR = "#B7A2F2";
const HAIR_SHADE = "#8E76DC";
const HAIR_GLOSS = "#EFE6FF";
const SKIN = "#FFE6D8";
const SKIN_SHADE = "#F2B1AA";
const SHIRT = "#F6F2FB";
const SHIRT_SHADE = "#C4B9E2";
const NAVY = "#34327A";
const NAVY_SHADE = "#1F1D52";
const SOCK = "#241F3D";
const CYAN = "#3BF4FB";
const SAKURA = "#FF6FA5";
const SAKURA_SHADE = "#C93F7C";
const PHONES = "#3A2F63";
const SHOE = "#FF8A3D";

const line = {
  stroke: INK,
  strokeWidth: 2.5,
  strokeLinejoin: "round",
  strokeLinecap: "round",
} as const;

export function ChibiArt({ pose = "idle", happy = false, className, title }: Props) {
  const id = useId().replace(/:/g, "");
  const iris = `iris-${id}`;
  const faceClip = `face-${id}`;

  // s = 1 is the left of the picture, -1 the right.
  const x = (s: number, d: number) => 100 - s * d;
  const up = (s: 1 | -1) => (s === 1 ? pose === "cheer" : pose !== "idle");
  const arm = (s: 1 | -1) =>
    up(s)
      ? `M${x(s, 34)} 160 C ${x(s, 58)} 150, ${x(s, 72)} 112, ${x(s, 71)} 76`
      : `M${x(s, 34)} 160 C ${x(s, 45)} 172, ${x(s, 48)} 188, ${x(s, 46)} 203`;
  const hand = (s: 1 | -1) => (up(s) ? [x(s, 71), 70] : [x(s, 46), 208]);

  const drawArm = (s: 1 | -1) => (
    <g key={`a${s}`}>
      <path d={arm(s)} stroke={INK} strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d={arm(s)} stroke={SKIN} strokeWidth="9" strokeLinecap="round" fill="none" />
      <circle cx={hand(s)[0]} cy={hand(s)[1]} r="7" fill={SKIN} {...line} />
      {/* puff sleeve with a navy cuff */}
      <ellipse
        cx={x(s, 37)}
        cy={up(s) ? 157 : 162}
        rx="12.5"
        ry="10.5"
        fill={SHIRT}
        transform={`rotate(${s * (up(s) ? 50 : -28)} ${x(s, 37)} ${up(s) ? 157 : 162})`}
        {...line}
      />
      <path
        d={
          up(s)
            ? `M${x(s, 40)} 146 q ${-s * 9} 3 ${-s * 12} 11`
            : `M${x(s, 31)} 171 q ${-s * 8} 4 ${-s * 15} -1`
        }
        stroke={NAVY}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );

  return (
    <svg
      viewBox="0 0 200 280"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id={iris} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4A123C" />
          <stop offset="0.5" stopColor="#C93F7C" />
          <stop offset="1" stopColor="#FF9CC2" />
        </linearGradient>
        <clipPath id={faceClip}>
          <path d="M48 100 C 48 134, 76 150, 100 150 C 124 150, 152 134, 152 100 C 152 66, 48 66, 48 100 Z" />
        </clipPath>
      </defs>
      <ellipse cx="100" cy="273" rx="42" ry="5.5" fill="#000" opacity="0.3" />

      {/* twin tails (behind): spiky ends, one shadow tone on the inner side */}
      {([1, -1] as const).map((s) => (
        <g key={`t${s}`}>
          <path
            d={`M${x(s, 58)} 80 C ${x(s, 92)} 96, ${x(s, 98)} 160, ${x(s, 82)} 216 L ${x(s, 76)} 196 L ${x(s, 67)} 220 L ${x(s, 63)} 192 L ${x(s, 53)} 208 C ${x(s, 55)} 162, ${x(s, 52)} 122, ${x(s, 46)} 94 Z`}
            fill={HAIR}
            {...line}
          />
          <path
            d={`M${x(s, 52)} 104 C ${x(s, 62)} 136, ${x(s, 64)} 168, ${x(s, 62)} 190 L ${x(s, 54)} 205 C ${x(s, 56)} 162, ${x(s, 53)} 124, ${x(s, 48)} 98 Z`}
            fill={HAIR_SHADE}
          />
        </g>
      ))}
      {/* back hair hem */}
      <path
        d="M46 112 L 44 150 L 56 138 L 62 158 L 74 142 H 126 L 138 158 L 144 138 L 156 150 L 154 112 Z"
        fill={HAIR_SHADE}
        {...line}
      />

      {/* legs: a strip of skin, thigh-high stockings with a neon band, sneakers */}
      {([1, -1] as const).map((s) => (
        <g key={`l${s}`}>
          <rect x={x(s, 12) - 7.5} y="222" width="15" height="14" fill={SKIN} {...line} />
          <path d={`M${x(s, 12) - 7.5} 234 h 15 v 22 q -7.5 5 -15 0 Z`} fill={SOCK} {...line} />
          <path d={`M${x(s, 12) - 7.5} 235 h 15`} stroke={CYAN} strokeWidth="3" />
          <path d={`M${x(s, 12) - 12} 266 q 0 -10 12 -10 q 13 0 13 10 Z`} fill={SHOE} {...line} />
          <rect
            x={x(s, 12) - 13}
            y="265"
            width="27"
            height="5"
            rx="2.5"
            fill={SHIRT}
            {...line}
            strokeWidth={2}
          />
        </g>
      ))}

      {/* pleated skirt with a zig-zag hem */}
      <path
        d="M70 192 H130 L150 230 L139 227 L129 234 L115 228 L100 235 L85 228 L71 234 L61 227 L50 230 Z"
        fill={NAVY}
        {...line}
      />
      <path d="M130 192 L150 230 L139 227 L129 234 L122 231 L116 194 Z" fill={NAVY_SHADE} />
      <path
        d="M85 228 L 88 198 M100 235 V 198 M115 228 L 112 198"
        stroke={INK}
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* sailor blouse */}
      <path
        d="M69 158 C 72 148, 128 148, 131 158 L 133 194 C 118 199, 82 199, 67 194 Z"
        fill={SHIRT}
        {...line}
      />
      <path
        d="M118 152 C 126 152, 130 154, 131 158 L 133 194 C 128 196, 122 197, 116 197 Z"
        fill={SHIRT_SHADE}
      />
      <path d="M68 192 C 82 198, 118 198, 132 192" stroke={NAVY} strokeWidth="4" fill="none" />

      {!up(1) && drawArm(1)}
      {!up(-1) && drawArm(-1)}

      {/* collar and ribbon */}
      <path d="M76 153 L100 180 L124 153 C 114 146, 86 146, 76 153 Z" fill={NAVY} {...line} />
      <path d="M82 155 L100 175 L118 155" stroke={SHIRT} strokeWidth="1.8" fill="none" />
      <path d="M100 179 l -6 17 l 6 -4 l 6 4 Z" fill={SAKURA_SHADE} {...line} strokeWidth={2} />
      <path
        d="M100 179 l -15 -8 l 2 15 Z M100 179 l 15 -8 l -2 15 Z"
        fill={SAKURA}
        {...line}
        strokeWidth={2}
      />
      <circle cx="100" cy="179" r="3.6" fill={SAKURA} {...line} strokeWidth={2} />

      {/* head */}
      <ellipse cx="100" cy="92" rx="61" ry="57" fill={HAIR} {...line} />
      <path
        d="M48 100 C 48 134, 76 150, 100 150 C 124 150, 152 134, 152 100 C 152 66, 48 66, 48 100 Z"
        fill={SKIN}
        {...line}
      />
      {/* shadow the fringe casts on the face */}
      <path
        clipPath={`url(#${faceClip})`}
        d="M40 60 H160 V112 L150 94 L143 118 L134 92 L124 116 L114 90 L104 112 L94 90 L84 116 L74 92 L64 118 L56 96 L40 112 Z"
        fill={SKIN_SHADE}
        opacity="0.75"
      />

      {/* eyes: drawn once with the outer corner at +x, mirrored for the other side */}
      {([1, -1] as const).map((s) => (
        <g key={`e${s}`} transform={`translate(${x(s, 25)} 120) scale(${s > 0 ? -1 : 1} 1)`}>
          {happy ? (
            <path
              d="M-13 3 Q 0 -13 13 3"
              stroke={INK}
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            <>
              <path d="M-13 -1 Q 0 -17 13 -3 Q 12 12 0 13 Q -11 12 -13 -1 Z" fill="#FFFFFF" />
              <ellipse
                cx="1"
                cy="1"
                rx="9"
                ry="11.5"
                fill={`url(#${iris})`}
                stroke="#3A0F33"
                strokeWidth="1.5"
              />
              <ellipse cx="1" cy="0" rx="3.4" ry="5" fill="#2A0A26" />
              <ellipse cx="-3" cy="-5" rx="3" ry="3.8" fill="#FFFFFF" />
              <circle cx="5" cy="6" r="1.6" fill="#FFFFFF" />
              <path d="M-15 1 Q -2 -19 14 -4 L 20 -9 L 17 -1 Q 2 -12 -12 0 Z" fill={INK} />
              <path
                d="M4 14 Q 10 13 13 8"
                stroke={INK}
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
            </>
          )}
        </g>
      ))}

      {/* blush with hatch lines */}
      {([1, -1] as const).map((s) => (
        <g key={`b${s}`}>
          <ellipse cx={x(s, 37)} cy="136" rx="9" ry="4.5" fill={SAKURA} opacity="0.4" />
          <path
            d={`M${x(s, 37) - 4} 133 l -3 6 M${x(s, 37) + 1} 133 l -3 6 M${x(s, 37) + 6} 133 l -3 6`}
            stroke="#E25478"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* mouth */}
      {happy ? (
        <path
          d="M92 136 q 8 2 16 0 q -1 10 -8 10 q -7 0 -8 -10 z"
          fill="#8A2742"
          {...line}
          strokeWidth={2}
        />
      ) : (
        <path
          d="M94 138 q 6 4 12 0"
          stroke={INK}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      )}

      {/* fringe: sharp locks, a shadow lock and a gloss streak */}
      <path
        d="M42 106 C 34 46, 166 46, 158 106 L150 88 L143 112 L134 86 L124 110 L114 84 L104 106 L94 84 L84 110 L74 86 L64 112 L56 90 Z"
        fill={HAIR}
        {...line}
      />
      <path d="M134 86 L143 112 L150 88 L158 106 C 160 88, 152 70, 140 62 Z" fill={HAIR_SHADE} />
      <path
        d="M114 84 L124 110 L128 96 L122 72 Z M74 86 L84 110 L88 96 L82 74 Z"
        fill={HAIR_SHADE}
      />
      <path
        d="M62 66 L 72 60 L 80 66 L 90 58 L 100 64 L 110 57 L 120 63"
        stroke={HAIR_GLOSS}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* side locks */}
      {([1, -1] as const).map((s) => (
        <path
          key={`s${s}`}
          d={`M${x(s, 57)} 92 L ${x(s, 61)} 152 L ${x(s, 50)} 132 L ${x(s, 45)} 104 Z`}
          fill={HAIR}
          {...line}
        />
      ))}
      {/* ahoge */}
      <path d="M100 40 C 94 24, 112 14, 120 26 C 110 24, 106 31, 106 41 Z" fill={HAIR} {...line} />

      {/* cat-ear headphones and hair bobbles */}
      <path d="M40 98 C 40 32, 160 32, 160 98" stroke={INK} strokeWidth="10" fill="none" />
      <path d="M40 98 C 40 32, 160 32, 160 98" stroke={PHONES} strokeWidth="5.5" fill="none" />
      {([1, -1] as const).map((s) => (
        <g key={`p${s}`}>
          <path d={`M${x(s, 50)} 52 L ${x(s, 43)} 18 L ${x(s, 22)} 40 Z`} fill={PHONES} {...line} />
          <path d={`M${x(s, 44)} 45 L ${x(s, 40)} 28 L ${x(s, 30)} 39 Z`} fill={SAKURA} />
          <circle cx={x(s, 60)} cy="104" r="13" fill={SHIRT} {...line} />
          <circle cx={x(s, 60)} cy="104" r="6" fill="none" stroke={CYAN} strokeWidth="2.5" />
          <circle cx={x(s, 62)} cy="82" r="5" fill={SAKURA} {...line} strokeWidth={2} />
        </g>
      ))}

      {/* raised arms go in front of the head */}
      {up(1) && drawArm(1)}
      {up(-1) && drawArm(-1)}
    </svg>
  );
}
