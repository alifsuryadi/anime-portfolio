import { Color, DoubleSide, FrontSide, ShaderMaterial, Vector3 } from "three";

/**
 * Anime cel shading for the character: two flat tones split by a hard edge,
 * a hue-shifted shadow instead of a darker copy of the base colour, a thin rim
 * from the sun behind her, and an optional zig-zag "angel ring" on the hair.
 *
 * The light is fixed in view space, the way anime keeps a face readable from
 * any angle, so the scene lights only tint her (uTint / uRim follow dusk -> night).
 */
const shared = {
  uLight: { value: new Vector3(0.48, 0.58, 0.66).normalize() },
  uRimDir: { value: new Vector3(-0.8, 0.45, -0.1).normalize() },
  uTint: { value: new Color(1, 1, 1) },
  uRim: { value: new Color("#ff9a5a") },
};

const vertex = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uShade;
  uniform vec3 uGloss;
  uniform vec3 uTint;
  uniform vec3 uRim;
  uniform vec3 uLight;
  uniform vec3 uRimDir;
  uniform float uEdge;
  uniform float uRing;
  uniform float uRimPower;
  varying vec3 vN;
  varying vec3 vV;

  void main() {
    vec3 n = normalize(vN);
    if (!gl_FrontFacing) n = -n;

    float lit = smoothstep(uEdge - 0.012, uEdge + 0.012, dot(n, uLight));
    vec3 c = mix(uShade, uColor, lit);

    if (uRing > 0.0) {
      float a = atan(n.x, n.z);
      float lo = 0.46 + 0.05 * sin(a * 17.0) + 0.03 * sin(a * 41.0);
      float hi = lo + 0.12 + 0.05 * sin(a * 23.0);
      c = mix(c, uGloss, step(lo, n.y) * step(n.y, hi) * lit * uRing);
    }

    float fres = 1.0 - max(dot(n, vV), 0.0);
    float rim = step(0.7, fres) * smoothstep(0.1, 0.3, dot(n, uRimDir));
    c = c * uTint + uRim * rim * uRimPower;

    gl_FragColor = vec4(c, 1.0);
    #include <colorspace_fragment>
  }
`;

/** Anime shadows drift toward violet-pink rather than grey. */
const autoShade = (base: string) => new Color(base).multiply(new Color(0.74, 0.62, 0.84));

export type CelOptions = {
  color: string;
  /** Shadow tone. Default: the base colour pushed toward violet. */
  shade?: string;
  /** Hair highlight colour; turns the angel ring on. */
  gloss?: string;
  /** Where light turns to shadow, as N·L (-1..1). Lower = more of the surface lit. */
  edge?: number;
  rim?: number;
  doubleSide?: boolean;
};

export function celMaterial(o: CelOptions) {
  return new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    side: o.doubleSide ? DoubleSide : FrontSide,
    uniforms: {
      ...shared,
      uColor: { value: new Color(o.color) },
      uShade: { value: o.shade ? new Color(o.shade) : autoShade(o.color) },
      uGloss: { value: new Color(o.gloss ?? "#ffffff") },
      uEdge: { value: o.edge ?? 0.12 },
      uRing: { value: o.gloss ? 1 : 0 },
      uRimPower: { value: o.rim ?? 0.55 },
    },
  });
}

const duskTint = new Color(1, 0.97, 0.95);
const nightTint = new Color(0.74, 0.78, 1);
const duskRim = new Color("#ff9a5a");
const nightRim = new Color("#58e6ff");

/** Call once per frame: 0 = golden dusk, 1 = deep night. */
export function setCelMood(night: number) {
  shared.uTint.value.copy(duskTint).lerp(nightTint, night);
  shared.uRim.value.copy(duskRim).lerp(nightRim, night);
  return shared.uTint.value;
}
