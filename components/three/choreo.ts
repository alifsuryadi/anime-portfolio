import { MathUtils, Vector3 } from "three";
import { pointerState, scrollState } from "@/lib/scroll-state";
import {
  handShapes,
  hands,
  poses,
  scenes,
  touches,
  WAVE_LOWER,
  WAVE_TWIST,
  WAVE_UPPER,
  type BoneName,
  type ExpressionSpec,
  type HandShape,
  type PoseName,
  type SceneKey,
  type TouchZone,
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

/** Offsets a pose layer may add on top of the bones. */
type Out = { lift: number; headX: number; headRoll: number };

type Additive = (bones: Record<BoneName, Vec3>, ctx: { time: number; w: number; out: Out }) => void;

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
  listen: (b, { time, w }) => {
    const beat = Math.sin(time * 2.4) * w;
    add(b, "neck", beat * 0.03, 0, 0);
    add(b, "spine", Math.sin(time * 1.8) * 0.015 * w, 0, 0);
    add(b, "leftUpperArm", 0, 0, Math.sin(time * 1.8) * 0.03 * w);
  },
  wave: (b, { time, w }) => {
    add(b, "rightLowerArm", 0, 0, Math.sin(time * 9) * 0.45 * w);
    // With the hand twisted palm-forward its y axis is her front-back axis,
    // so this rocks the hand side to side in the plane of the wave.
    add(b, "rightHand", 0, Math.sin(time * 9 + 0.7) * 0.25 * w, 0);
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

const toward = (b: Record<BoneName, Vec3>, name: BoneName, goal: Vec3, w: number) => {
  for (let i = 0; i < 3; i++) b[name][i] = MathUtils.lerp(b[name][i], goal[i], w);
};

type Reaction = (
  bones: Record<BoneName, Vec3>,
  /** `t` = seconds since the touch, `side` = +1 her left (viewer's right at rest), -1 her right. */
  ctx: { t: number; w: number; out: Out; side: number },
) => void;

/** Body motion for each touch zone; timing and expression are in scenes.config.ts. */
const reactions: Record<TouchZone, Reaction> = {
  // Head pat: she leans into it and sways.
  head: (b, { t, w, out }) => {
    out.headX += 0.2 * w;
    out.headRoll += Math.sin(t * 8) * 0.07 * w;
    out.lift -= Math.abs(Math.sin(t * 8)) * 0.012 * w;
  },
  // Cheek poke: the head tips away from the finger.
  cheek: (b, { w, out, side }) => {
    out.headRoll += side * 0.24 * w;
    add(b, "spine", 0, 0, side * 0.05 * w);
  },
  hair: (b, { w, out, side }) => {
    out.headRoll -= side * 0.16 * w;
    out.headX -= 0.06 * w;
  },
  ahoge: (b, { w, out }) => {
    out.headX -= 0.14 * w;
  },
  // Nods along to whatever is playing.
  headphones: (b, { t, w, out }) => {
    out.headX += (0.05 + Math.sin(t * 11) * 0.08) * w;
    add(b, "spine", Math.sin(t * 11) * 0.015 * w, 0, 0);
  },
  // High five with the hand that was touched.
  hand: (b, { t, w, side }) => {
    const pop = Math.exp(-t * 5) * 0.25;
    if (side > 0) {
      toward(b, "leftUpperArm", [0, -0.5, 0.75 + pop], w);
      toward(b, "leftLowerArm", [0, -0.5, 0.35], w);
    } else {
      toward(b, "rightUpperArm", [0, 0.5, -0.75 - pop], w);
      toward(b, "rightLowerArm", [0, 0.5, -0.35], w);
    }
  },
  // Startled hop.
  shoe: (b, { t, w, out }) => {
    const air = Math.sin(Math.min(1, t / 0.55) * Math.PI);
    out.lift += air * 0.2;
    add(b, "leftLowerLeg", air * 0.7 * w, 0, 0);
    add(b, "rightLowerLeg", air * 0.45 * w, 0, 0);
    add(b, "leftUpperArm", 0, 0, air * 0.4 * w);
    add(b, "rightUpperArm", 0, 0, -air * 0.4 * w);
  },
  // Anywhere else: a wave hello.
  body: (b, { t, w }) => {
    toward(b, "rightUpperArm", WAVE_UPPER, w);
    toward(b, "rightLowerArm", [0, 0, WAVE_LOWER[2] + Math.sin(t * 9) * 0.45], w);
    toward(b, "rightHand", [WAVE_TWIST, Math.sin(t * 9 + 0.7) * 0.25, 0], w);
    add(b, "spine", 0, 0, 0.05 * w);
  },
};

const HAND_KEYS = ["curl", "spread", "thumb", "point"] as const;
type Side = "left" | "right";

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
  /** Sideways head tilt added by touch reactions. */
  headRoll = 0;
  /** One-shot impulse for the hair springs; the model consumes it and resets it to 0. */
  hairKick = 0;
  /** 0..1 while a touch reaction plays (drives the blush). */
  flustered = 0;
  /** Damped hand shapes (her left / her right), read by the model's fingers each frame. */
  hands: Record<Side, HandShape> = {
    left: { ...handShapes.relaxed },
    right: { ...handShapes.relaxed },
  };
  private reaction: { zone: TouchZone; side: number; t: number } | null = null;
  /** Angular velocity of the head, for spring hair on the procedural model. */
  headVel = { x: 0, y: 0 };
  private targetPos = new Vector3();
  private nextBlink = 2;
  private blinkT = -1;
  private first = true;

  /** Start the reaction for a touched zone. `side`: +1 her left, -1 her right. */
  touch(zone: TouchZone, side = 1) {
    this.reaction = { zone, side, t: 0 };
    if (zone === "hair" || zone === "ahoge" || zone === "shoe") this.hairKick = side * 14;
    else if (zone === "cheek") this.hairKick = -side * 6;
  }

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
    const out: Out = { lift: 0, headX: 0, headRoll: 0 };
    additive[a.pose](target, { time, w: 1 - t, out });
    if (b.pose !== a.pose || t > 0) additive[b.pose](target, { time, w: t, out });

    // Touch reaction: fades in fast, holds, eases out over the last third.
    const r = this.reaction;
    let env = 0;
    if (r) {
      r.t += dt;
      const u = r.t / touches[r.zone].duration;
      if (u >= 1) this.reaction = null;
      else {
        env = Math.min(1, u * 8) * (1 - smooth(Math.max(0, (u - 0.66) / 0.34)));
        reactions[r.zone](target, { t: r.t, w: env, out, side: r.side });
      }
    }
    this.flustered = env;

    // Hands: blend the two poses' shapes, let a touch reaction take over one hand.
    const kh = this.first ? 1 : 1 - Math.exp(-dt * 12);
    const over = r && env > 0 ? touches[r.zone].hand : undefined;
    for (const s of ["left", "right"] as const) {
      const ha = handShapes[hands[a.pose][s]];
      const hb = handShapes[hands[b.pose][s]];
      const mine =
        over && (over.which === "right" ? s === "right" : r!.side > 0 === (s === "left"));
      for (const key of HAND_KEYS) {
        let tg = MathUtils.lerp(ha[key], hb[key], t);
        if (mine) tg = MathUtils.lerp(tg, handShapes[over.shape][key], env);
        this.hands[s][key] = MathUtils.lerp(this.hands[s][key], tg, kh);
      }
    }

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
      let tg = MathUtils.lerp(ea[e] ?? 0, eb[e] ?? 0, t);
      // While she reacts, the touch expression replaces the scene's.
      if (r && env > 0) tg = MathUtils.lerp(tg, touches[r.zone].expression[e] ?? 0, env);
      this.expressions[e] = MathUtils.lerp(
        this.expressions[e],
        tg,
        1 - Math.exp(-dt * (env > 0 ? 14 : 5)),
      );
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
    const hx = MathUtils.clamp(-pointerState.y * 0.35, -0.4, 0.4) + out.headX;
    this.headRoll = MathUtils.lerp(this.headRoll, out.headRoll, 1 - Math.exp(-dt * 12));
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
