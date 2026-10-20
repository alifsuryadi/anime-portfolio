/**
 * Original 2D chibi used by the loader and the static (no-WebGL / reduced
 * motion) mode. Same design as the procedural 3D character: violet bob with a
 * sakura streak, lavender hoodie with neon cyan trim, sakura headphones.
 */
type Props = {
  pose?: "idle" | "wave" | "cheer";
  happy?: boolean;
  className?: string;
  title?: string;
};

const HAIR = "#2B1A4F";
const HAIR_HI = "#4A2F7D";
const SKIN = "#FFE3D3";
const HOODIE = "#E9E3F7";
const HOODIE_SHADE = "#C9C0E3";
const CYAN = "#3BF4FB";
const SAKURA = "#FF6FA5";
const INK = "#1A1033";

export function ChibiArt({ pose = "idle", happy = false, className, title }: Props) {
  const leftArm =
    pose === "cheer" ? "M68 168 C 52 150, 44 128, 42 112" : "M68 168 C 56 184, 54 200, 58 214";
  const rightArm =
    pose === "wave" || pose === "cheer"
      ? "M132 168 C 150 152, 158 132, 158 112"
      : "M132 168 C 144 184, 146 200, 142 214";
  const lHand = pose === "cheer" ? [42, 108] : [58, 216];
  const rHand = pose === "wave" || pose === "cheer" ? [158, 108] : [142, 216];

  return (
    <svg viewBox="0 0 200 270" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      {/* shadow */}
      <ellipse cx="100" cy="262" rx="46" ry="6" fill="#000" opacity="0.3" />
      {/* legs */}
      <rect x="80" y="214" width="14" height="36" rx="7" fill={SKIN} />
      <rect x="106" y="214" width="14" height="36" rx="7" fill={SKIN} />
      <path d="M72 248 h26 a6 6 0 0 1 0 12 h-30 a5 5 0 0 1 4 -12z" fill="#FF8A3D" />
      <path d="M102 248 h26 a5 5 0 0 1 4 12 h-30 a6 6 0 0 1 0 -12z" fill="#FF8A3D" />
      <rect x="68" y="257" width="32" height="4" rx="2" fill="#F5EFE6" />
      <rect x="100" y="257" width="32" height="4" rx="2" fill="#F5EFE6" />
      {/* shorts */}
      <path d="M76 204 h48 l4 22 h-24 l-4 -8 l-4 8 h-24z" fill={INK} />
      {/* arms */}
      <path d={leftArm} stroke={HOODIE_SHADE} strokeWidth="18" strokeLinecap="round" fill="none" />
      <path d={rightArm} stroke={HOODIE_SHADE} strokeWidth="18" strokeLinecap="round" fill="none" />
      <circle cx={lHand[0]} cy={lHand[1]} r="8" fill={SKIN} />
      <circle cx={rHand[0]} cy={rHand[1]} r="8" fill={SKIN} />
      {/* hoodie body */}
      <path d="M66 160 C 70 146, 130 146, 134 160 L 138 206 C 120 214, 80 214, 62 206 Z" fill={HOODIE} />
      <path d="M62 204 C 80 212, 120 212, 138 204" stroke={CYAN} strokeWidth="4" fill="none" />
      <path d="M100 160 v42" stroke={HOODIE_SHADE} strokeWidth="2" />
      <rect x="84" y="182" width="32" height="14" rx="5" fill={HOODIE_SHADE} />
      {/* headphones around neck */}
      <path d="M72 156 C 80 170, 120 170, 128 156" stroke={SAKURA} strokeWidth="6" fill="none" strokeLinecap="round" />
      <rect x="64" y="148" width="14" height="18" rx="6" fill={SAKURA} />
      <rect x="122" y="148" width="14" height="18" rx="6" fill={SAKURA} />
      {/* head */}
      <g>
        <path d="M40 92 C 38 40, 162 40, 160 92 C 162 120, 150 146, 100 150 C 50 146, 38 120, 40 92Z" fill={HAIR} />
        <ellipse cx="100" cy="100" rx="54" ry="50" fill={SKIN} />
        {/* bangs */}
        <path
          d="M44 92 C 44 48, 156 48, 156 92 C 150 78, 140 70, 132 66 C 130 78, 124 84, 116 88 C 116 76, 110 68, 104 64 C 100 76, 92 84, 82 86 C 84 76, 80 70, 74 66 C 66 74, 60 86, 44 92Z"
          fill={HAIR}
        />
        <path d="M120 54 C 136 58, 148 70, 152 86 C 144 76, 134 70, 126 68Z" fill={SAKURA} />
        <path d="M70 58 C 80 52, 92 50, 100 50" stroke={HAIR_HI} strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* side locks */}
        <path d="M44 92 C 40 116, 44 136, 54 146 C 52 126, 54 108, 58 96Z" fill={HAIR} />
        <path d="M156 92 C 160 116, 156 136, 146 146 C 148 126, 146 108, 142 96Z" fill={HAIR} />
        {/* ahoge */}
        <path d="M100 46 C 96 30, 108 22, 118 26 C 108 28, 104 36, 104 46Z" fill={HAIR} />
        {/* eyes */}
        {happy ? (
          <>
            <path d="M68 108 q 10 -12 20 0" stroke={INK} strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M112 108 q 10 -12 20 0" stroke={INK} strokeWidth="4" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <ellipse cx="78" cy="106" rx="9" ry="13" fill={INK} />
            <ellipse cx="122" cy="106" rx="9" ry="13" fill={INK} />
            <ellipse cx="78" cy="111" rx="6" ry="6" fill={CYAN} opacity="0.85" />
            <ellipse cx="122" cy="111" rx="6" ry="6" fill={CYAN} opacity="0.85" />
            <circle cx="81" cy="100" r="3.4" fill="#fff" />
            <circle cx="125" cy="100" r="3.4" fill="#fff" />
          </>
        )}
        {/* blush */}
        <ellipse cx="64" cy="124" rx="9" ry="5" fill={SAKURA} opacity="0.45" />
        <ellipse cx="136" cy="124" rx="9" ry="5" fill={SAKURA} opacity="0.45" />
        {/* mouth */}
        <path d={happy ? "M92 126 q 8 10 16 0 z" : "M94 128 q 6 5 12 0"} stroke={INK} strokeWidth="3" strokeLinecap="round" fill={happy ? "#C2335E" : "none"} />
      </g>
    </svg>
  );
}
