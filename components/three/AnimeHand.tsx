"use client";

import { useMemo, type ReactNode } from "react";
import { CapsuleGeometry, type Material } from "three";
import { celMaterial } from "./cel";

/**
 * A hand with a palm, four two-joint fingers with nails and a thumb, in a
 * relaxed anime curl. Lives in the hand bone's space: the arm runs along ±x
 * (`side`), the palm faces -y and the thumb sits on +z, as in a T-pose.
 */

/** [radius, base length, tip length, z on the knuckle line, curl at base, extra curl at tip] */
const FINGERS: [number, number, number, number, number, number][] = [
  [0.0055, 0.021, 0.017, 0.0168, 0.22, 0.3], // index
  [0.0057, 0.023, 0.019, 0.0057, 0.3, 0.36], // middle
  [0.0053, 0.021, 0.017, -0.0056, 0.4, 0.42], // ring
  [0.0046, 0.016, 0.014, -0.016, 0.52, 0.48], // pinky
];
const PALM_END = 0.054;
const UPRIGHT = Math.PI / 2; // capsules are built along y; lay them along x

type Seg = { geo: CapsuleGeometry; len: number; r: number };

// One nail material for both hands.
let nailMat: Material | null = null;
const nail = () =>
  (nailMat ??= celMaterial({ color: "#ffd3d8", shade: "#f0a7b0", edge: 0.02, rim: 0.5 }));

export function AnimeHand({
  side,
  material,
  outline,
}: {
  side: 1 | -1;
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

      {FINGERS.map(([, , , z, curl, tip], i) => {
        const [base, end] = geo.fingers[i];
        // Fan out slightly from the middle finger.
        const splay = (z - 0.002) * 3.2;
        return (
          <group
            key={i}
            position={[side * PALM_END, 0.001, z]}
            rotation={[0, side * -splay, side * -curl]}
          >
            {bone(base)}
            <group position={[side * base.len, 0, 0]} rotation={[0, 0, side * -tip]}>
              {bone(end)}
              {nailOn(end)}
            </group>
          </group>
        );
      })}

      {/* thumb: from the heel of the palm, curving in toward the index finger */}
      <group position={[side * 0.014, -0.004, 0.019]} rotation={[0.35, side * -0.62, side * -0.25]}>
        {bone(geo.thumb[0])}
        <group
          position={[side * geo.thumb[0].len, 0, 0]}
          rotation={[0.15, side * 0.35, side * -0.25]}
        >
          {bone(geo.thumb[1])}
          {nailOn(geo.thumb[1])}
        </group>
      </group>
    </group>
  );
}
