"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Outlines } from "@react-three/drei";
import { Color, Group, MathUtils, Mesh, MeshBasicMaterial } from "three";
import type { BoneName } from "@/lib/scenes.config";
import { BONES, world, type CharacterDriver } from "./choreo";
import { palette, toonGradient } from "./toon";

const OUT = palette.night;

/**
 * Procedural, original chibi used when no VRM file is present. The rig uses
 * the same bone names and rest pose (T-pose, arms along ±X) as a VRM, so poses
 * from scenes.config.ts drive both identically.
 */
export function ChibiModel({ driver }: { driver: CharacterDriver }) {
  const g = toonGradient();
  const root = useRef<Group>(null);
  const bones = useRef<Partial<Record<BoneName | "head" | "body", Group | null>>>({});
  const eyes = useRef<Group[]>([]);
  const eyeArcs = useRef<Mesh[]>([]);
  const smile = useRef<Mesh>(null);
  const mouthO = useRef<Mesh>(null);
  const springs = useRef<
    { g: Group | null; axis: "x" | "z"; k: number; a: number; v: number; rest: number }[]
  >([]);

  const trim = useMemo(
    () =>
      new MeshBasicMaterial({
        color: new Color(palette.cyan).multiplyScalar(1.6),
        toneMapped: false,
      }),
    [],
  );
  const blush = useMemo(
    () =>
      new MeshBasicMaterial({
        color: palette.sakura,
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
      }),
    [],
  );
  const phones = useMemo(
    () =>
      new MeshBasicMaterial({
        color: new Color(palette.sakura).multiplyScalar(1.2),
        toneMapped: false,
      }),
    [],
  );

  const bind = (name: BoneName | "head" | "body") => (el: Group | null) => {
    bones.current[name] = el;
  };
  const spring =
    (axis: "x" | "z", k: number, rest = 0) =>
    (el: Group | null) => {
      if (el && !springs.current.some((s) => s.g === el))
        springs.current.push({ g: el, axis, k, a: rest, v: 0, rest });
    };

  useFrame((state, dt) => {
    const d = Math.min(dt, 1 / 20);
    driver.update(d, state.clock.elapsedTime);
    const r = root.current;
    if (!r) return;
    r.position.copy(driver.position);
    r.rotation.y = driver.rotationY;
    r.scale.setScalar(driver.scale);

    for (const n of BONES) {
      const b = bones.current[n];
      if (b) b.rotation.set(driver.bones[n][0], driver.bones[n][1], driver.bones[n][2]);
    }
    const head = bones.current.head;
    if (head) {
      head.rotation.set(driver.head.x, driver.head.y, 0);
      const s = world.chibi ? 1.32 : 1;
      head.scale.setScalar(MathUtils.lerp(head.scale.x, s, 0.1));
    }
    const body = bones.current.body;
    if (body) {
      const breath = 1 + Math.sin(state.clock.elapsedTime * 1.8) * 0.012;
      body.scale.set(1, breath, 1);
    }

    // Expressions.
    const e = driver.expressions;
    const closed = Math.max(e.blink, e.happy * 0.95);
    const open = (1 - closed) * (1 + e.surprised * 0.25) * (1 - e.relaxed * 0.35);
    eyes.current.forEach(
      (eye) => eye && eye.scale.set(1 + e.surprised * 0.15, Math.max(0.02, open), 1),
    );
    eyeArcs.current.forEach((arc) => {
      if (!arc) return;
      const w = Math.max(e.happy, e.blink * 0.8);
      arc.visible = w > 0.4;
      arc.rotation.z = e.happy > e.blink ? 0 : Math.PI;
    });
    if (smile.current)
      smile.current.scale.setScalar(Math.max(0.001, 1 - e.surprised) * (0.7 + e.happy * 0.5));
    if (mouthO.current) mouthO.current.scale.setScalar(Math.max(0.001, e.surprised));
    blush.opacity = 0.15 + e.happy * 0.5;

    // Spring hair: driven by head angular velocity and vertical motion.
    for (const s of springs.current) {
      if (!s.g) continue;
      const force = (s.axis === "x" ? driver.headVel.x : -driver.headVel.y) * 0.08;
      s.v += (-(s.a - s.rest) * s.k - s.v * 2 * Math.sqrt(s.k) * 0.35 - force * s.k * 0.1) * d;
      s.a += s.v * d;
      s.a = MathUtils.clamp(s.a, s.rest - 0.7, s.rest + 0.7);
      s.g.rotation[s.axis] = s.a;
    }
  });

  const toon = (color: string) => <meshToonMaterial color={color} gradientMap={g} />;
  const outline = <Outlines thickness={0.018} color={OUT} />;

  return (
    <group ref={root}>
      {/* hips at y = 0.55 above the feet */}
      <group position={[0, 0.55, 0]}>
        {/* legs */}
        {([-1, 1] as const).map((side) => {
          const L = side < 0 ? "right" : "left";
          return (
            <group key={side} ref={bind(`${L}UpperLeg` as BoneName)} position={[side * 0.1, 0, 0]}>
              <mesh position={[0, -0.13, 0]}>
                <capsuleGeometry args={[0.062, 0.16, 4, 10]} />
                {toon(palette.skin)}
                {outline}
              </mesh>
              <group ref={bind(`${L}LowerLeg` as BoneName)} position={[0, -0.26, 0]}>
                <mesh position={[0, -0.12, 0]}>
                  <capsuleGeometry args={[0.055, 0.14, 4, 10]} />
                  {toon(palette.skin)}
                  {outline}
                </mesh>
                <mesh position={[0, -0.26, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
                  <capsuleGeometry args={[0.07, 0.1, 4, 10]} />
                  {toon(palette.sunset)}
                  {outline}
                </mesh>
              </group>
            </group>
          );
        })}
        {/* shorts */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.19, 0.21, 0.16, 16]} />
          {toon(palette.night)}
          {outline}
        </mesh>

        <group ref={bind("spine")} position={[0, 0.05, 0]}>
          <group ref={bind("body")}>
            <mesh position={[0, 0.16, 0]}>
              <capsuleGeometry args={[0.2, 0.14, 6, 16]} />
              {toon(palette.hoodie)}
              {outline}
            </mesh>
            <mesh position={[0, 0.03, 0]} rotation={[Math.PI / 2, 0, 0]} material={trim}>
              <torusGeometry args={[0.2, 0.014, 6, 32]} />
            </mesh>
            {/* pocket */}
            <mesh position={[0, 0.1, 0.19]}>
              <boxGeometry args={[0.18, 0.07, 0.02]} />
              {toon(palette.hoodieShade)}
            </mesh>
          </group>

          <group ref={bind("chest")} position={[0, 0.2, 0]}>
            {/* hood + headphones around the neck */}
            <mesh position={[0, 0.13, -0.09]} rotation={[1.2, 0, 0]}>
              <torusGeometry args={[0.14, 0.05, 8, 20]} />
              {toon(palette.hoodieShade)}
              {outline}
            </mesh>
            <mesh position={[0, 0.14, 0.02]} rotation={[Math.PI / 2 + 0.2, 0, 0]} material={phones}>
              <torusGeometry args={[0.13, 0.018, 6, 24, Math.PI]} />
            </mesh>
            {[-1, 1].map((s) => (
              <mesh key={s} position={[s * 0.14, 0.12, 0.04]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.055, 0.055, 0.05, 14]} />
                {toon(palette.sakura)}
                {outline}
              </mesh>
            ))}
            {/* drawstrings */}
            {[-1, 1].map((s) => (
              <mesh key={`d${s}`} position={[s * 0.05, 0.02, 0.19]}>
                <cylinderGeometry args={[0.008, 0.008, 0.12, 4]} />
                <meshBasicMaterial color={palette.paper} />
              </mesh>
            ))}

            {/* arms (rest pose along ±X) */}
            {([-1, 1] as const).map((side) => {
              const L = side > 0 ? "left" : "right";
              return (
                <group
                  key={side}
                  ref={bind(`${L}UpperArm` as BoneName)}
                  position={[side * 0.2, 0.1, 0]}
                >
                  <mesh position={[side * 0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <capsuleGeometry args={[0.062, 0.12, 4, 10]} />
                    {toon(palette.hoodie)}
                    {outline}
                  </mesh>
                  <group ref={bind(`${L}LowerArm` as BoneName)} position={[side * 0.2, 0, 0]}>
                    <mesh position={[side * 0.09, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                      <capsuleGeometry args={[0.058, 0.1, 4, 10]} />
                      {toon(palette.hoodieShade)}
                      {outline}
                    </mesh>
                    <mesh
                      position={[side * 0.17, 0, 0]}
                      rotation={[0, 0, Math.PI / 2]}
                      material={trim}
                    >
                      <torusGeometry args={[0.058, 0.01, 6, 16]} />
                    </mesh>
                    <group ref={bind(`${L}Hand` as BoneName)} position={[side * 0.2, 0, 0]}>
                      <mesh position={[side * 0.04, 0, 0]}>
                        <sphereGeometry args={[0.055, 12, 10]} />
                        {toon(palette.skin)}
                        {outline}
                      </mesh>
                    </group>
                  </group>
                </group>
              );
            })}

            <group ref={bind("neck")} position={[0, 0.2, 0]}>
              <group ref={bind("head")} position={[0, 0.04, 0]}>
                {/* face */}
                <mesh position={[0, 0.36, 0]}>
                  <sphereGeometry args={[0.4, 32, 24]} />
                  {toon(palette.skin)}
                  {outline}
                </mesh>
                {/* hair: back volume + cap */}
                <mesh position={[0, 0.36, -0.07]} scale={[1, 1.04, 1]}>
                  <sphereGeometry args={[0.43, 28, 20]} />
                  {toon(palette.hair)}
                  {outline}
                </mesh>
                <mesh position={[0, 0.39, 0.01]}>
                  <sphereGeometry args={[0.43, 28, 16, 0, Math.PI * 2, 0, Math.PI * 0.42]} />
                  {toon(palette.hair)}
                </mesh>
                {/* bangs */}
                {[-0.26, -0.13, 0, 0.13, 0.26].map((x, i) => (
                  <mesh
                    key={x}
                    position={[x, 0.6 - Math.abs(x) * 0.25, 0.3 - Math.abs(x) * 0.22]}
                    rotation={[-0.45, x * 0.6, x * 0.9 + (i % 2 ? 0.08 : -0.08)]}
                  >
                    <coneGeometry args={[0.1, 0.3, 6]} />
                    {toon(i === 3 ? palette.sakura : palette.hair)}
                  </mesh>
                ))}
                {/* side locks (spring) */}
                {[-1, 1].map((s) => (
                  <group key={s} ref={spring("x", 60)} position={[s * 0.35, 0.42, 0.13]}>
                    <mesh position={[0, -0.18, 0]} rotation={[0, 0, s * 0.08]}>
                      <capsuleGeometry args={[0.065, 0.28, 4, 8]} />
                      {toon(palette.hair)}
                      {outline}
                    </mesh>
                  </group>
                ))}
                {/* ahoge (spring) */}
                <group ref={spring("z", 40, 0.2)} position={[0.02, 0.8, 0.02]}>
                  <mesh position={[0.04, 0.08, 0]} rotation={[0, 0, -0.6]}>
                    <coneGeometry args={[0.035, 0.2, 5]} />
                    {toon(palette.hair)}
                  </mesh>
                </group>
                {/* eyes */}
                {[-1, 1].map((s, i) => (
                  <group key={s} position={[s * 0.14, 0.33, 0.36]} rotation={[0, s * 0.36, 0]}>
                    <group ref={(el) => void (el && (eyes.current[i] = el))}>
                      <mesh scale={[0.058, 0.085, 0.025]}>
                        <sphereGeometry args={[1, 16, 12]} />
                        <meshBasicMaterial color={palette.night} />
                      </mesh>
                      <mesh position={[0, -0.022, 0.012]} scale={[0.04, 0.045, 0.02]}>
                        <sphereGeometry args={[1, 12, 10]} />
                        <meshBasicMaterial
                          color={new Color(palette.cyan).multiplyScalar(1.1)}
                          toneMapped={false}
                        />
                      </mesh>
                      <mesh position={[0.018, 0.03, 0.022]} scale={[0.018, 0.018, 0.01]}>
                        <sphereGeometry args={[1, 8, 6]} />
                        <meshBasicMaterial color="#ffffff" toneMapped={false} />
                      </mesh>
                    </group>
                    <mesh
                      ref={(el) => void (el && (eyeArcs.current[i] = el))}
                      position={[0, -0.01, 0.02]}
                      visible={false}
                    >
                      <torusGeometry args={[0.05, 0.012, 6, 14, Math.PI]} />
                      <meshBasicMaterial color={palette.night} />
                    </mesh>
                  </group>
                ))}
                {/* brows */}
                {[-1, 1].map((s) => (
                  <mesh
                    key={`b${s}`}
                    position={[s * 0.14, 0.46, 0.355]}
                    rotation={[0, s * 0.36, s * -0.12]}
                  >
                    <boxGeometry args={[0.08, 0.014, 0.01]} />
                    <meshBasicMaterial color={palette.hair} />
                  </mesh>
                ))}
                {/* blush */}
                {[-1, 1].map((s) => (
                  <mesh
                    key={`c${s}`}
                    position={[s * 0.25, 0.24, 0.3]}
                    rotation={[0, s * 0.7, 0]}
                    material={blush}
                  >
                    <circleGeometry args={[0.055, 16]} />
                  </mesh>
                ))}
                {/* mouth */}
                <mesh ref={smile} position={[0, 0.2, 0.366]} rotation={[0, 0, Math.PI]}>
                  <torusGeometry args={[0.035, 0.009, 6, 12, Math.PI]} />
                  <meshBasicMaterial color={palette.night} />
                </mesh>
                <mesh ref={mouthO} position={[0, 0.19, 0.37]} scale={0.001}>
                  <sphereGeometry args={[0.03, 10, 8]} />
                  <meshBasicMaterial color="#9c2448" />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
