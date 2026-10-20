import { useId } from "react";

/**
 * Original 2D chibi used by the loader and the static (no-WebGL / reduced
 * motion) mode. Same design as the procedural 3D character: lavender twin
 * tails with sakura bows, cat-ear headphones, big sparkly eyes, an oversized
 * hoodie with neon trim and a pleated skirt.
 */
type Props = {
  pose?: "idle" | "wave" | "cheer";
  happy?: boolean;
  className?: string;
  title?: string;
};

const HAIR = "#B9A3FF";
const HAIR_SHADE = "#9B82F0";
const TIP = "#FFB3D6";
const SKIN = "#FFE3D3";
const HOODIE = "#FBF5EE";
const HOODIE_SHADE = "#E6DCEF";
const CYAN = "#3BF4FB";
const SAKURA = "#FF6FA5";
const PHONES = "#3A2F63";
const LASH = "#24123F";
const SKIRT = "#2D2A6B";

export function ChibiArt({ pose = "idle", happy = false, className, title }: Props) {
  const id = useId().replace(/:/g, "");
  const iris = `iris-${id}`;
  const armDown = (s: 1 | -1) =>
    `M${100 - s * 32} 158 C ${100 - s * 44} 172, ${100 - s * 48} 190, ${100 - s * 46} 206`;
  const armUp = (s: 1 | -1) =>
    `M${100 - s * 32} 158 C ${100 - s * 50} 146, ${100 - s * 58} 126, ${100 - s * 60} 108`;
  const left = pose === "cheer" ? armUp(1) : armDown(1);
  const right = pose === "wave" || pose === "cheer" ? armUp(-1) : armDown(-1);
  const lEnd = pose === "cheer" ? [40, 104] : [54, 210];
  const rEnd = pose === "wave" || pose === "cheer" ? [160, 104] : [146, 210];

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
          <stop offset="0" stopColor="#2A1660" />
          <stop offset="0.45" stopColor="#6B3FD6" />
          <stop offset="0.82" stopColor="#FF6FA5" />
          <stop offset="1" stopColor="#FFD1E6" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="272" rx="44" ry="6" fill="#000" opacity="0.3" />

      {/* twin tails (behind) */}
      {[1, -1].map((s) => (
        <g key={s}>
          <path
            d={`M${100 - s * 56} 82 C ${100 - s * 82} 110, ${100 - s * 80} 170, ${100 - s * 66} 212 C ${100 - s * 58} 190, ${100 - s * 56} 140, ${100 - s * 44} 96 Z`}
            fill={HAIR}
          />
          <path
            d={`M${100 - s * 72} 196 q ${s * 4} 16 ${s * 6} 18 q ${-s * 2} -10 ${s * 2} -22 z`}
            fill={TIP}
          />
          {/* bow */}
          <path
            d={`M${100 - s * 56} 82 l ${-s * 14} -10 l 0 20 z M${100 - s * 56} 82 l ${s * 12} -12 l 2 22 z`}
            fill={SAKURA}
          />
          <circle cx={100 - s * 56} cy="82" r="4.5" fill="#FF8FB8" />
        </g>
      ))}

      {/* legs: knee socks + sneakers */}
      {[1, -1].map((s) => (
        <g key={`l${s}`}>
          <rect x={100 - s * 12 - 7} y="222" width="14" height="34" rx="7" fill="#FFFFFF" />
          <rect x={100 - s * 12 - 7} y="224" width="14" height="4" fill={SAKURA} />
          <ellipse cx={100 - s * 12} cy="260" rx="13" ry="8" fill="#FF8A3D" />
          <rect x={100 - s * 12 - 13} y="263" width="26" height="4" rx="2" fill="#FFFFFF" />
        </g>
      ))}

      {/* pleated skirt */}
      <path d="M70 196 H130 L148 232 H52 Z" fill={SKIRT} />
      <path d="M86 198 L80 232 M100 198 V232 M114 198 L120 232" stroke="#1E1C4E" strokeWidth="2" />
      <path d="M52 232 H148" stroke="#FFFFFF" strokeWidth="3" />

      {/* oversized hoodie */}
      <path
        d="M64 160 C 66 146, 134 146, 136 160 L 140 202 C 120 210, 80 210, 60 202 Z"
        fill={HOODIE}
      />
      <path d="M60 201 C 80 209, 120 209, 140 201" stroke={CYAN} strokeWidth="4" fill="none" />
      <rect x="84" y="178" width="32" height="12" rx="5" fill={HOODIE_SHADE} />
      <path d="M94 152 v18 M106 152 v18" stroke={SAKURA} strokeWidth="2" />
      <circle cx="94" cy="171" r="2.5" fill={SAKURA} />
      <circle cx="106" cy="171" r="2.5" fill={SAKURA} />

      {/* sleeves */}
      <path d={left} stroke={HOODIE} strokeWidth="20" strokeLinecap="round" fill="none" />
      <path d={right} stroke={HOODIE} strokeWidth="20" strokeLinecap="round" fill="none" />
      <circle cx={lEnd[0]} cy={lEnd[1]} r="11" fill={HOODIE} stroke={CYAN} strokeWidth="2.5" />
      <circle cx={rEnd[0]} cy={rEnd[1]} r="11" fill={HOODIE} stroke={CYAN} strokeWidth="2.5" />
      <circle cx={lEnd[0]} cy={lEnd[1] + (pose === "cheer" ? -7 : 7)} r="5.5" fill={SKIN} />
      <circle cx={rEnd[0]} cy={rEnd[1] + (pose === "idle" ? 7 : -7)} r="5.5" fill={SKIN} />

      {/* head */}
      <ellipse cx="100" cy="94" rx="64" ry="60" fill={HAIR} />
      <ellipse cx="100" cy="104" rx="56" ry="50" fill={SKIN} />
      {/* bangs */}
      <path
        d="M42 100 C 38 52, 162 52, 158 100 C 152 90, 146 82, 140 80 C 140 90, 134 96, 126 98 C 128 86, 122 76, 114 72 C 112 84, 106 92, 98 94 C 98 82, 92 74, 84 72 C 82 84, 76 92, 66 94 C 68 84, 64 78, 58 76 C 52 82, 46 90, 42 100 Z"
        fill={HAIR}
      />
      <path
        d="M70 62 C 80 56, 94 54, 104 55"
        stroke="#D6CAFF"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* side locks */}
      <path d="M44 98 C 40 122, 44 144, 52 154 C 54 136, 54 118, 58 104 Z" fill={HAIR} />
      <path d="M156 98 C 160 122, 156 144, 148 154 C 146 136, 146 118, 142 104 Z" fill={HAIR} />
      <circle cx="52" cy="154" r="4" fill={TIP} />
      <circle cx="148" cy="154" r="4" fill={TIP} />
      {/* ahoge */}
      <path d="M102 40 C 96 26, 112 18, 118 28 C 110 26, 106 32, 106 40 Z" fill={HAIR_SHADE} />

      {/* cat-ear headphones */}
      <path d="M40 98 C 40 34, 160 34, 160 98" stroke={PHONES} strokeWidth="7" fill="none" />
      <path d="M52 52 L 58 22 L 78 42 Z" fill={PHONES} />
      <path d="M58 46 L 61 30 L 71 41 Z" fill={SAKURA} />
      <path d="M148 52 L 142 22 L 122 42 Z" fill={PHONES} />
      <path d="M142 46 L 139 30 L 129 41 Z" fill={SAKURA} />
      <circle cx="40" cy="104" r="13" fill={HOODIE} stroke={PHONES} strokeWidth="3" />
      <circle cx="160" cy="104" r="13" fill={HOODIE} stroke={PHONES} strokeWidth="3" />
      <circle cx="40" cy="104" r="6" fill="none" stroke={CYAN} strokeWidth="2.5" />
      <circle cx="160" cy="104" r="6" fill="none" stroke={CYAN} strokeWidth="2.5" />

      {/* eyes */}
      {happy ? (
        <>
          <path
            d="M64 116 q 13 -16 26 0"
            stroke={LASH}
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M110 116 q 13 -16 26 0"
            stroke={LASH}
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
        </>
      ) : (
        [1, -1].map((s) => {
          const cx = 100 - s * 22;
          return (
            <g key={`e${s}`}>
              <ellipse cx={cx} cy="114" rx="13" ry="16" fill="#FFFFFF" />
              <ellipse cx={cx} cy="115" rx="11.5" ry="15" fill={`url(#${iris})`} />
              <ellipse cx={cx} cy="113" rx="5" ry="7" fill="#14082E" />
              <ellipse cx={cx + 4} cy="107" rx="4.5" ry="5.5" fill="#FFFFFF" />
              <circle cx={cx - 5} cy="122" r="2" fill="#FFFFFF" />
              <path
                d={`M${cx - 14} 109 Q ${cx} 89, ${cx + 14} 109`}
                stroke={LASH}
                strokeWidth="4.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d={s > 0 ? `M${cx - 13} 108 l -6 1` : `M${cx + 13} 108 l 6 1`}
                stroke={LASH}
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>
          );
        })
      )}

      {/* blush with hatch lines */}
      {[1, -1].map((s) => (
        <g key={`b${s}`}>
          <ellipse cx={100 - s * 36} cy="130" rx="10" ry="5" fill={SAKURA} opacity="0.45" />
          <path
            d={`M${100 - s * 36 - 4} 127 l -3 6 M${100 - s * 36 + 1} 127 l -3 6 M${100 - s * 36 + 6} 127 l -3 6`}
            stroke="#D63C78"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* mouth */}
      {happy ? (
        <path d="M92 132 q 8 2 16 0 q -2 10 -8 10 q -6 0 -8 -10 z" fill="#7A1838" />
      ) : (
        <path
          d="M91 132 q 4.5 5 9 0 q 4.5 5 9 0"
          stroke="#5A1D3A"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </svg>
  );
}
