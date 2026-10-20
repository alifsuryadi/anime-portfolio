import { MathUtils, Vector3 } from "three";
import { pointerState, scrollState } from "@/lib/scroll-state";
import {
  poses,
  scenes,
  type BoneName,
  type ExpressionSpec,
  type PoseName,
  type SceneKey,
  type Vec3,
} from "@/lib/scenes.config";

export const BONES: BoneName[] = [
  "spine",
  "chest",
  "neck",
  "leftUpperArm",
  "rightUpperArm",
  "leftLowerArm",
  "rightLowerArm",
  "leftHand",
  "rightHand",
  "leftUpperLeg",
  "rightUpperLeg",
  "leftLowerLeg",
  "rightLowerLeg",
];

export const EXPRESSIONS = ["happy", "surprised", "relaxed", "angry", "sad"] as const;
export type ExpressionName = (typeof EXPRESSIONS)[number] | "blink";

const smooth = (t: number) => t * t * (3 - 2 * t);

function resolve(key: SceneKey, mobile: boolean) {
  if (!mobile || !key.mobile) return key.character;
  return { ...key.character, ...key.mobile };
}

/** The two scene keys we are between right now, and how far (0..1). */
export function currentKeys() {
  const order = scrollState.order.length ? scrollState.order : ["hero" as const];
  const sf = MathUtils.clamp(scrollState.sectionFloat, 0, order.length - 1);
  const i = Math.floor(sf);
  const j = Math.min(order.length - 1, i + 1);
  return {
    a: scenes[order[i]],
    b: scenes[order[j]],
    t: smooth(sf - i),
    idA: order[i],
    idB: order[j],
  };
}

/** Shared world values that several components read each frame. */
export const world = {
  night: 0,
  orbs: 0,
  characterPos: new Vector3(0, -1, 0),
  chibi: false,
  mobile: false,
};

const lerp3 = (out: Vector3, a: Vec3, b: Vec3, t: number) =>
  out.set(
    MathUtils.lerp(a[0], b[0], t),
    MathUtils.lerp(a[1], b[1], t),
    MathUtils.lerp(a[2], b[2], t),
  );

type Additive = (
  bones: Record<BoneName, Vec3>,
  ctx: { time: number; w: number; out: { lift: number } },
) => void;

const add = (b: Record<BoneName, Vec3>, name: BoneName, x: number, y: number, z: number) => {
  b[name][0] += x;
  b[name][1] += y;
  b[name][2] += z;
};

/** Procedural motion layered on top of each static pose. */
const additive: Record<PoseName, Additive> = {
  idle: (b, { time, w }) => {
    const br = Math.sin(time * 1.8) * w;
    add(b, "spine", br * 0.02, 0, 0);
    add(b, "leftUpperArm", 0, 0, br * 0.035);
    add(b, "rightUpperArm", 0, 0, -br * 0.035);
  },
  wave: (b, { time, w }) => {
    add(b, "rightLowerArm", 0, 0, Math.sin(time * 9) * 0.45 * w);
    add(b, "rightHand", 0, 0, Math.sin(time * 9 + 0.7) * 0.25 * w);
  },
  cast: (b, { time, w, out }) => {
    add(b, "leftUpperArm", 0, Math.sin(time * 2) * 0.08 * w, 0);
    add(b, "rightUpperArm", 0, -Math.sin(time * 2) * 0.08 * w, 0);
    out.lift += (0.12 + Math.sin(time * 2) * 0.06) * w;
  },
  think: (b, { time, w }) => {
    add(b, "neck", 0, 0, Math.sin(time * 0.8) * 0.06 * w);
  },
  walk: (b, { w, out }) => {
    const amp = MathUtils.clamp(scrollState.energy * 3, 0, 1) * w;
    const ph = scrollState.distance * 0.011;
    const s = Math.sin(ph);
    add(b, "leftUpperLeg", -s * 0.6 * amp, 0, 0);
    add(b, "rightUpperLeg", s * 0.6 * amp, 0, 0);
    add(b, "leftLowerLeg", Math.max(0, Math.sin(ph - 1.2)) * 0.9 * amp, 0, 0);
    add(b, "rightLowerLeg", Math.max(0, -Math.sin(ph - 1.2)) * 0.9 * amp, 0, 0);
    add(b, "leftUpperArm", s * 0.5 * amp, 0, 0);
    add(b, "rightUpperArm", -s * 0.5 * amp, 0, 0);
    out.lift += Math.abs(Math.cos(ph)) * 0.035 * amp;
  },
  greet: (b, { time, w }) => {
    add(b, "spine", Math.sin(time * 1.5) * 0.04 * w, 0, 0);
  },
  cheer: (b, { time, w, out }) => {
    add(b, "leftUpperArm", 0, 0, Math.sin(time * 7) * 0.18 * w);
    add(b, "rightUpperArm", 0, 0, -Math.sin(time * 7) * 0.18 * w);
    out.lift += Math.abs(Math.sin(time * 3.5)) * 0.14 * w;
  },
};

const zero = (): Record<BoneName, Vec3> =>
  Object.fromEntries(BONES.map((n) => [n, [0, 0, 0] as Vec3])) as Record<BoneName, Vec3>;

/**
 * Turns scroll + pointer state into damped character targets. Both the VRM and
 * the procedural chibi read from the same driver, so choreography lives in
 * scenes.config.ts only.
 */
export class CharacterDriver {
  position = new Vector3(0, -1, 0);
  rotationY = 0;
  scale = 1;
  bones = zero();
  expressions: Record<ExpressionName, number> = {
    happy: 0,
    surprised: 0,
    relaxed: 0,
    angry: 0,
    sad: 0,
    blink: 0,
  };
  head = { x: 0, y: 0 };
  /** Angular velocity of the head, for spring hair on the procedural model. */
  headVel = { x: 0, y: 0 };
  private targetPos = new Vector3();
  private nextBlink = 2;
  private blinkT = -1;
  private first = true;

  update(dt: number, time: number) {
    const { a, b, t } = currentKeys();
    const ca = resolve(a, world.mobile);
    const cb = resolve(b, world.mobile);

    // Pose: static blend + additive motion.
    const target = zero();
    const pa = poses[a.pose];
    const pb = poses[b.pose];
    for (const n of BONES) {
      const va = pa[n] ?? [0, 0, 0];
      const vb = pb[n] ?? [0, 0, 0];
      target[n] = [
        MathUtils.lerp(va[0], vb[0], t),
        MathUtils.lerp(va[1], vb[1], t),
        MathUtils.lerp(va[2], vb[2], t),
      ];
    }
    const out = { lift: 0 };
    additive[a.pose](target, { time, w: 1 - t, out });
    if (b.pose !== a.pose || t > 0) additive[b.pose](target, { time, w: t, out });

    lerp3(this.targetPos, ca.position, cb.position, t);
    this.targetPos.y += out.lift;
    const rotY = MathUtils.lerp(ca.rotationY, cb.rotationY, t);
    const scale = MathUtils.lerp(ca.scale, cb.scale, t);

    const k = this.first ? 1 : 1 - Math.exp(-dt * 6);
    const kb = this.first ? 1 : 1 - Math.exp(-dt * 10);
    this.first = false;
    this.position.lerp(this.targetPos, k);
    this.rotationY = MathUtils.lerp(this.rotationY, rotY, k);
    this.scale = MathUtils.lerp(this.scale, scale, k);
    for (const n of BONES) {
      const cur = this.bones[n];
      const tg = target[n];
      cur[0] = MathUtils.lerp(cur[0], tg[0], kb);
      cur[1] = MathUtils.lerp(cur[1], tg[1], kb);
      cur[2] = MathUtils.lerp(cur[2], tg[2], kb);
    }

    // Expressions.
    const ea: ExpressionSpec = a.expression;
    const eb: ExpressionSpec = b.expression;
    for (const e of EXPRESSIONS) {
      const tg = MathUtils.lerp(ea[e] ?? 0, eb[e] ?? 0, t);
      this.expressions[e] = MathUtils.lerp(this.expressions[e], tg, 1 - Math.exp(-dt * 5));
    }

    // Blink: random interval, ~140ms closed. Skipped while smiling with eyes shut.
    this.nextBlink -= dt;
    if (this.nextBlink <= 0 && this.blinkT < 0) {
      this.blinkT = 0;
      this.nextBlink = 2 + Math.random() * 3.5;
    }
    if (this.blinkT >= 0) {
      this.blinkT += dt;
      this.expressions.blink = Math.sin(Math.min(1, this.blinkT / 0.16) * Math.PI);
      if (this.blinkT > 0.16) {
        this.blinkT = -1;
        this.expressions.blink = 0;
      }
    }

    // Head follows the cursor (compensating body yaw so it looks at the viewer side).
    const hy = MathUtils.clamp(pointerState.x * 0.6 - this.rotationY * 0.55, -0.85, 0.85);
    const hx = MathUtils.clamp(-pointerState.y * 0.35, -0.4, 0.4);
    const ky = 1 - Math.exp(-dt * 7);
    const nx = MathUtils.lerp(this.head.x, hx, ky);
    const ny = MathUtils.lerp(this.head.y, hy, ky);
    this.headVel.x = (nx - this.head.x) / Math.max(dt, 1e-3);
    this.headVel.y = (ny - this.head.y) / Math.max(dt, 1e-3);
    this.head.x = nx;
    this.head.y = ny;

    world.characterPos.copy(this.position);
  }
}
