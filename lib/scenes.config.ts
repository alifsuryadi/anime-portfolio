/**
 * Character + camera choreography, one key per scene.
 *
 * Every element with `data-scene="<id>"` in the page becomes a key. While you
 * scroll from one section to the next the character and camera blend between
 * the two keys. Swap the model by changing `character.vrmUrl`; nothing else
 * needs to change as long as the model is a humanoid VRM.
 */
import type { SectionId } from "@/content/japanese-phrases";

export type SceneId = SectionId | "detail";
export type Vec3 = [number, number, number];

/** Humanoid bones shared by VRM models and the procedural fallback. */
export type BoneName =
  | "spine"
  | "chest"
  | "neck"
  | "leftUpperArm"
  | "rightUpperArm"
  | "leftLowerArm"
  | "rightLowerArm"
  | "leftHand"
  | "rightHand"
  | "leftUpperLeg"
  | "rightUpperLeg"
  | "leftLowerLeg"
  | "rightLowerLeg";

/** Euler rotations (radians) on VRM *normalized* bones: T-pose rest, arms along ±X. */
export type PoseSpec = Partial<Record<BoneName, Vec3>>;

export type PoseName = "idle" | "wave" | "cast" | "think" | "walk" | "greet" | "cheer";

/** VRM 1.0 preset expression names. */
export type ExpressionSpec = Partial<
  Record<"happy" | "surprised" | "relaxed" | "angry" | "sad", number>
>;

export type SceneKey = {
  character: { position: Vec3; rotationY: number; scale: number };
  /** Overrides for narrow screens (< 768px), so the character never sits behind text. */
  mobile?: { position?: Vec3; rotationY?: number; scale?: number };
  /** Camera override for narrow screens. Default: pulled back and centered. */
  mobileCamera?: { position: Vec3; target: Vec3; fov: number };
  camera: { position: Vec3; target: Vec3; fov: number };
  pose: PoseName;
  expression: ExpressionSpec;
  /** 0 = golden dusk, 1 = deep night. */
  night: number;
  /** How strongly the skill orbs show (0..1). */
  orbs?: number;
};

const ARMS_DOWN: PoseSpec = {
  leftUpperArm: [0, 0, -1.22],
  rightUpperArm: [0, 0, 1.22],
  leftLowerArm: [0, 0, -0.12],
  rightLowerArm: [0, 0, 0.12],
};

export const poses: Record<PoseName, PoseSpec> = {
  idle: { ...ARMS_DOWN, spine: [0.02, 0, 0] },
  wave: {
    ...ARMS_DOWN,
    rightUpperArm: [0, 0.1, -1.05],
    rightLowerArm: [0, 0, -1.25],
    spine: [0, 0, 0.06],
  },
  cast: {
    leftUpperArm: [-0.2, -0.9, -0.55],
    rightUpperArm: [-0.2, 0.9, 0.55],
    leftLowerArm: [0, -0.7, 0],
    rightLowerArm: [0, 0.7, 0],
    spine: [-0.06, 0, 0],
  },
  think: {
    ...ARMS_DOWN,
    rightUpperArm: [0, 0.9, 1.0],
    rightLowerArm: [0, 2.0, 0],
    neck: [0.12, 0, 0.12],
  },
  walk: { ...ARMS_DOWN },
  greet: {
    leftUpperArm: [0, -0.5, -1.15],
    rightUpperArm: [0, 0.5, 1.15],
    leftLowerArm: [0, -1.4, 0],
    rightLowerArm: [0, 1.4, 0],
    spine: [0.12, 0, 0],
  },
  cheer: {
    leftUpperArm: [0, 0, 0.9],
    rightUpperArm: [0, 0, -0.9],
    leftLowerArm: [0, 0, 0.3],
    rightLowerArm: [0, 0, -0.3],
  },
};

export const character = {
  /**
   * Path to a VRM (0.x or 1.0), e.g. "/models/character.vrm". While this is
   * null (or the file is missing) the procedural chibi is used instead.
   */
  vrmUrl: null as string | null,
  /** Uniform scale applied to VRM models (VRoid exports are ~1.6m tall). */
  vrmScale: 1,
  /**
   * Optional 2D fallback for devices without a GPU: an image sequence scrubbed
   * by scroll, e.g. "/sequences/character/manifest.json". null = still SVG.
   */
  sequenceManifest: null as string | null,
};

/** The world: a Neo-Tokyo rooftop. Character stands at y = -1, a torii shrine sits at z = -10. */
export const scenes: Record<SceneId, SceneKey> = {
  hero: {
    character: { position: [0, -1, 0], rotationY: 0, scale: 1 },
    mobile: { position: [0, -1, 0], scale: 0.8 },
    // Frame the character in the empty sky above the hero copy.
    mobileCamera: { position: [0, -0.3, 5.3], target: [0, -1.45, 0], fov: 44 },
    camera: { position: [0, 0.15, 5.4], target: [0, -0.05, 0], fov: 32 },
    pose: "idle",
    expression: { relaxed: 0.35 },
    night: 0,
  },
  about: {
    character: { position: [2.3, -1, 0], rotationY: -0.45, scale: 1 },
    mobile: { position: [1.1, -2.3, -1], scale: 0.7 },
    camera: { position: [0.4, 0.3, 6.2], target: [0.4, 0, 0], fov: 32 },
    pose: "wave",
    expression: { happy: 1 },
    night: 0.15,
  },
  skills: {
    character: { position: [-3.3, -1, 0], rotationY: 0.45, scale: 1 },
    mobile: { position: [0, -2.4, -1.5], scale: 0.7 },
    camera: { position: [-0.6, 0.8, 7.2], target: [-0.6, -0.1, 0], fov: 34 },
    pose: "cast",
    expression: { surprised: 0.7 },
    night: 0.3,
    orbs: 1,
  },
  projects: {
    character: { position: [-3, -1, 1.5], rotationY: 0.8, scale: 1 },
    camera: { position: [-1.5, 0.6, 7], target: [-1.5, -0.2, 0], fov: 34 },
    pose: "think",
    expression: { relaxed: 0.6 },
    night: 0.45,
  },
  experience: {
    character: { position: [2.6, -1, 0.4], rotationY: -Math.PI / 2, scale: 1 },
    mobile: { position: [1.3, -2.3, -1], scale: 0.65 },
    camera: { position: [0.8, 0.4, 6.6], target: [0.8, -0.1, 0], fov: 34 },
    pose: "walk",
    expression: { happy: 0.4 },
    night: 0.6,
  },
  achievements: {
    character: { position: [-2.8, -1, 0.4], rotationY: 0.4, scale: 1 },
    mobile: { position: [0, -2.6, -1.5], scale: 0.7 },
    camera: { position: [-0.6, 0.3, 6.4], target: [-0.6, 0, 0], fov: 33 },
    pose: "cheer",
    expression: { happy: 1 },
    night: 0.7,
  },
  contact: {
    character: { position: [2.6, -1, 0.6], rotationY: 0, scale: 1 },
    mobile: { position: [0, -2.6, -1.5], scale: 0.7 },
    // Looking slightly left from the right keeps the torii behind the character,
    // not behind the heading.
    camera: { position: [2.5, 0.25, 5.8], target: [0.5, 0, 0], fov: 32 },
    pose: "greet",
    expression: { happy: 1 },
    night: 0.8,
  },
  footer: {
    character: { position: [0, -1, -8.6], rotationY: 0, scale: 1 },
    camera: { position: [0, 0.4, -1.2], target: [0, 1.1, -10], fov: 42 },
    pose: "cheer",
    expression: { happy: 1 },
    night: 1,
  },
  detail: {
    character: { position: [2.7, -1, 0], rotationY: -0.35, scale: 1 },
    mobile: { position: [1.4, -2.4, -1], scale: 0.6 },
    camera: { position: [0.6, 0.3, 6.4], target: [0.6, 0, 0], fov: 32 },
    pose: "idle",
    expression: { happy: 0.6 },
    night: 0.5,
  },
};
