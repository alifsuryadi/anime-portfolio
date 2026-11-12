"use client";

import { useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { CapsuleGeometry, MathUtils, type Group, type Material, type Mesh } from "three";
import type { HandShape } from "@/lib/scenes.config";
import { celMaterial } from "./cel";

/**
 * A hand with a palm, four two-joint fingers with nails and a thumb. Lives in
 * the hand bone's space: the arm runs along ±x (`side`), the palm faces -y and
 * the thumb sits on +z, as in a T-pose. The fingers follow `shape` every frame
 * (open, relaxed, fist, pointing...); the shapes per pose are in scenes.config.ts.
 */

/** [radius, base length, tip length, z on the knuckle line] */
const FINGERS: [number, number, number, number][] = [
  [0.0055, 0.021, 0.017, 0.0168], // index
  [0.0057, 0.023, 0.019, 0.0057], // middle
  [0.0053, 0.021, 0.017, -0.0056], // ring
  [0.0046, 0.016, 0.014, -0.016], // pinky
];
const PALM_END = 0.054;
const UPRIGHT = Math.PI / 2; // capsules are built along y; lay them along x

/** Thumb joint rotations [base xyz, tip xyz] at thumb = 0 (out), 0.4 (relaxed), 1 (over a fist). */
const THUMB: [number, number, number][][] = [
  [
    [0.15, -1.0, -0.05],
    [0, -0.1, 0],
  ],
  [
    [0.35, -0.62, -0.25],
    [0.15, 0.35, -0.25],
  ],
  [
    [0.85, -0.3, -0.7],
    [0.2, 0.55, -0.45],
  ],
];

type Seg = { geo: CapsuleGeometry; len: number; r: number };

// One nail material for both hands.
let nailMat: Material | null = null;
const nail = () =>
  (nailMat ??= celMaterial({ color: "#ffd3d8", shade: "#f0a7b0", edge: 0.02, rim: 0.5 }));

/** Sets every joint of one hand from a shape. */
function pose(
  side: number,
  s: HandShape,
  base: (Group | null)[],
  tip: (Group | null)[],
  thumb: (Group | null)[],
  fill: Mesh | null,
) {
  // Two-joint fingers can't fold flush; this fills the inside of a closing fist.
  if (fill) {
    const k = MathUtils.smoothstep(s.curl, 0.3, 0.9);
    fill.visible = k > 0.01;
    fill.scale.set(0.015, 0.002 + 0.011 * k, 0.022);
  }
  FINGERS.forEach(([, , , z], i) => {
    const c = i === 0 ? s.curl * (1 - s.point) : s.curl;
    // Half-closed hands curl more toward the pinky, as drawn hands do.
    const fan = 0.1 * i * 4 * c * (1 - c);
    const splay = (z - 0.002) * (1.5 + s.spread * 6) * (1 - c * 0.85);
    // A full fist bends ~150° in all, so the fingertips rest on the palm.
    base[i]?.rotation.set(0, side * -splay, side * -(0.02 + c * 1.35 + fan));
    tip[i]?.rotation.set(0, 0, side * -(0.04 + c * 1.3 + fan));
  });
  const [from, to, u] =
    s.thumb < 0.4
      ? [THUMB[0], THUMB[1], s.thumb / 0.4]
      : [THUMB[1], THUMB[2], (s.thumb - 0.4) / 0.6];
  thumb.forEach((g, j) => {
    const r = from[j].map((v, k) => MathUtils.lerp(v, to[j][k], u));
    g?.rotation.set(r[0], side * r[1], side * r[2]);
  });
}

export function AnimeHand({
  side,
  shape,
  material,
  outline,
}: {
  side: 1 | -1;
  /** Read every frame; the driver keeps it damped. */
  shape: HandShape;
  material: Material;
  /** An `<Outlines>` element, drawn on every part. */
  outline: ReactNode;
}) {
  const geo = useMemo(() => {
    const seg = (r: number, len: number): Seg => ({
      geo: new CapsuleGeometry(r, Math.max(0.001, len - r), 3, 8),
      len,
      r,
    });
    return {
      fingers: FINGERS.map(([r, a, b]) => [seg(r, a), seg(r * 0.9, b)] as const),
      thumb: [seg(0.0068, 0.018), seg(0.006, 0.014)] as const,
    };
  }, []);

  const base = useRef<(Group | null)[]>([]);
  const tip = useRef<(Group | null)[]>([]);
  const thumb = useRef<(Group | null)[]>([]);
  const fill = useRef<Mesh>(null);

  // Right pose on the first frame, then follow the shape.
  const apply = () => pose(side, shape, base.current, tip.current, thumb.current, fill.current);
  useLayoutEffect(apply);
  useFrame(apply);

  /** One segment, starting at its group's origin and pointing out along the arm. */
  const bone = (s: Seg) => (
    <mesh
      geometry={s.geo}
      position={[side * (s.len / 2), 0, 0]}
      rotation={[0, 0, UPRIGHT]}
      material={material}
    >
      {outline}
    </mesh>
  );
  /** A nail on the back (+y) of a fingertip segment. */
  const nailOn = (s: Seg) => (
    <mesh
      position={[side * (s.len - s.r * 1.05), s.r * 0.72, 0]}
      scale={[s.r * 1.05, s.r * 0.32, s.r * 0.78]}
      material={nail()}
    >
      <sphereGeometry args={[1, 10, 6]} />
    </mesh>
  );

  return (
    <group>
      {/* palm: wider at the knuckles than at the wrist */}
      <mesh position={[side * 0.029, 0, 0]} scale={[0.03, 0.0115, 0.026]} material={material}>
        <sphereGeometry args={[1, 16, 10]} />
        {outline}
      </mesh>
      <mesh position={[side * 0.044, 0.0005, 0]} scale={[0.018, 0.0105, 0.027]} material={material}>
        <sphereGeometry args={[1, 14, 8]} />
      </mesh>
      <mesh ref={fill} position={[side * (PALM_END - 0.004), -0.012, 0]} material={material}>
        <sphereGeometry args={[1, 14, 8]} />
      </mesh>

      {FINGERS.map(([, , , z], i) => {
        const [b, e] = geo.fingers[i];
        return (
          <group
            key={i}
            ref={(g) => void (base.current[i] = g)}
            position={[side * PALM_END, 0.001, z]}
          >
            {bone(b)}
            <group ref={(g) => void (tip.current[i] = g)} position={[side * b.len, 0, 0]}>
              {bone(e)}
              {nailOn(e)}
            </group>
          </group>
        );
      })}

      {/* thumb: from the heel of the palm */}
      <group ref={(g) => void (thumb.current[0] = g)} position={[side * 0.014, -0.004, 0.019]}>
        {bone(geo.thumb[0])}
        <group ref={(g) => void (thumb.current[1] = g)} position={[side * geo.thumb[0].len, 0, 0]}>
          {bone(geo.thumb[1])}
          {nailOn(geo.thumb[1])}
        </group>
      </group>
    </group>
  );
}
