"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Outlines } from "@react-three/drei";
import { Color, DoubleSide, Group, MathUtils, Mesh, MeshBasicMaterial, type Texture } from "three";
import type { BoneName } from "@/lib/scenes.config";
import { BONES, world, type CharacterDriver } from "./choreo";
import { palette, toonGradient } from "./toon";
import * as face from "./faceTextures";

const OUT = "#2a1840";
const HAIR = "#b9a3ff";
const HAIR_TIP = "#ffb3d6";
const HOODIE = "#fbf5ee";
const HOODIE_SHADE = "#e6dcef";
const SKIRT = "#2d2a6b";
const PHONES = "#3a2f63";

type Spring = {
  g: Group;
  axis: "x" | "z";
  k: number;
  a: number;
  v: number;
  rest: number;
  gain: number;
};

const decal = (map: Texture, opacity = 1) =>
  new MeshBasicMaterial({
    map,
    transparent: true,
    opacity,
    depthWrite: false,
    side: DoubleSide,
    toneMapped: false,
  });

/**
 * Procedural, original chibi used when no VRM file is present. The rig uses
 * the same bone names and rest pose (T-pose, arms along ±X) as a VRM, so poses
 * from scenes.config.ts drive both identically. Face parts are canvas textures.
 */
export function ChibiModel({ driver }: { driver: CharacterDriver }) {
  const g = toonGradient();
  const root = useRef<Group>(null);
  const bones = useRef<Partial<Record<BoneName | "head" | "body", Group | null>>>({});
  const eyes = useRef<{ open: Mesh | null; happy: Mesh | null; closed: Mesh | null }[]>([
    { open: null, happy: null, closed: null },
    { open: null, happy: null, closed: null },
  ]);
  const mouth = useRef<{ cat: Mesh | null; open: Mesh | null; o: Mesh | null }>({
    cat: null,
    open: null,
    o: null,
  });
  const springs = useRef<Spring[]>([]);

  const mats = useMemo(() => {
    const m = {
      eyeOpen: decal(face.eyeOpen()),
      eyeHappy: decal(face.eyeHappy()),
      eyeClosed: decal(face.eyeClosed()),
      mouthCat: decal(face.mouthCat()),
      mouthOpen: decal(face.mouthOpen()),
      mouthO: decal(face.mouthO()),
      blush: decal(face.blush(), 0.5),
      trim: new MeshBasicMaterial({
        color: new Color(palette.cyan).multiplyScalar(1.6),
        toneMapped: false,
      }),
      glowPink: new MeshBasicMaterial({
        color: new Color(palette.sakura).multiplyScalar(1.4),
        toneMapped: false,
      }),
    };
    return m;
  }, []);

  useEffect(
    () => () => {
      Object.values(mats).forEach((m) => {
        m.map?.dispose();
        m.dispose();
      });
    },
    [mats],
  );

  const bind = (name: BoneName | "head" | "body") => (el: Group | null) => {
    bones.current[name] = el;
  };
  const spring =
    (axis: "x" | "z", k: number, rest = 0, gain = 1) =>
    (el: Group | null) => {
      if (el && !springs.current.some((s) => s.g === el))
        springs.current.push({ g: el, axis, k, a: rest, v: 0, rest, gain });
    };

  useFrame((state, dt) => {
    const d = Math.min(dt, 1 / 20);
    const time = state.clock.elapsedTime;
    driver.update(d, time);
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
      // Cute idle head tilt on top of the cursor look-at.
      head.rotation.set(driver.head.x, driver.head.y, Math.sin(time * 1.1) * 0.07);
      const s = world.chibi ? 1.25 : 1;
      head.scale.setScalar(MathUtils.lerp(head.scale.x, s, 0.1));
    }
    const body = bones.current.body;
    if (body) body.scale.set(1, 1 + Math.sin(time * 1.8) * 0.015, 1);

    // Expressions.
    const e = driver.expressions;
    const showHappy = e.happy > 0.5 && e.blink < 0.5;
    const showClosed = !showHappy && e.blink > 0.5;
    const openY = (1 - e.relaxed * 0.25) * (1 + e.surprised * 0.12);
    for (const eye of eyes.current) {
      if (eye.open) {
        eye.open.visible = !showHappy && !showClosed;
        eye.open.scale.set(1 + e.surprised * 0.1, Math.max(0.05, openY * (1 - e.blink * 0.9)), 1);
      }
      if (eye.happy) eye.happy.visible = showHappy;
      if (eye.closed) eye.closed.visible = showClosed;
    }
    const m = mouth.current;
    if (m.open && m.o && m.cat) {
      m.o.visible = e.surprised > 0.4;
      m.open.visible = !m.o.visible && e.happy > 0.6;
      m.cat.visible = !m.o.visible && !m.open.visible;
    }
    mats.blush.opacity = 0.3 + e.happy * 0.6;

    // Spring hair / twin tails: driven by head turn speed and body bounce.
    const bounce =
      (driver.position.y - (r.userData.lastY ?? driver.position.y)) / Math.max(d, 1e-3);
    r.userData.lastY = driver.position.y;
    for (const s of springs.current) {
      const force =
        (s.axis === "x" ? driver.headVel.x - bounce * 0.6 : -driver.headVel.y) * 0.08 * s.gain;
      s.v += (-(s.a - s.rest) * s.k - s.v * 2 * Math.sqrt(s.k) * 0.3 - force * s.k * 0.1) * d;
      s.a = MathUtils.clamp(s.a + s.v * d, s.rest - 0.8, s.rest + 0.8);
      s.g.rotation[s.axis] = s.a + Math.sin(time * 1.6 + s.rest * 3) * 0.03;
    }
  });

  const toon = (color: string) => <meshToonMaterial color={color} gradientMap={g} />;
  const outline = <Outlines thickness={0.014} color={OUT} />;

  return (
    <group ref={root}>
      {/* hips */}
      <group position={[0, 0.42, 0]}>
        {([-1, 1] as const).map((side) => {
          const L = side < 0 ? "right" : "left";
          return (
            <group
              key={side}
              ref={bind(`${L}UpperLeg` as BoneName)}
              position={[side * 0.075, 0, 0]}
            >
              <mesh position={[0, -0.1, 0]}>
                <capsuleGeometry args={[0.05, 0.1, 4, 10]} />
                {toon(palette.skin)}
                {outline}
              </mesh>
              <group ref={bind(`${L}LowerLeg` as BoneName)} position={[0, -0.2, 0]}>
                {/* knee sock */}
                <mesh position={[0, -0.08, 0]}>
                  <capsuleGeometry args={[0.047, 0.1, 4, 10]} />
                  {toon("#ffffff")}
                  {outline}
                </mesh>
                <mesh position={[0, -0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.048, 0.008, 6, 16]} />
                  {toon(palette.sakura)}
                </mesh>
                {/* chunky sneaker */}
                <mesh position={[0, -0.19, 0.025]} scale={[0.072, 0.052, 0.1]}>
                  <sphereGeometry args={[1, 16, 12]} />
                  {toon(palette.sunset)}
                  {outline}
                </mesh>
                <mesh position={[0, -0.225, 0.025]} scale={[0.075, 0.018, 0.104]}>
                  <sphereGeometry args={[1, 16, 8]} />
                  {toon("#ffffff")}
                </mesh>
              </group>
            </group>
          );
        })}

        {/* pleated skirt */}
        <mesh position={[0, -0.02, 0]}>
          <cylinderGeometry args={[0.15, 0.26, 0.17, 14, 1, true]} />
          <meshToonMaterial color={SKIRT} gradientMap={g} side={DoubleSide} />
          {outline}
        </mesh>
        <mesh position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.26, 0.012, 6, 28]} />
          {toon("#ffffff")}
        </mesh>

        <group ref={bind("spine")} position={[0, 0.03, 0]}>
          <group ref={bind("body")}>
            {/* oversized hoodie */}
            <mesh position={[0, 0.13, 0]} scale={[1.08, 1, 1]}>
              <capsuleGeometry args={[0.16, 0.1, 6, 16]} />
              {toon(HOODIE)}
              {outline}
            </mesh>
            <mesh
              position={[0, 0.02, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={[1.08, 1, 1]}
              material={mats.trim}
            >
              <torusGeometry args={[0.165, 0.012, 6, 32]} />
            </mesh>
            <mesh position={[0, 0.08, 0.155]}>
              <boxGeometry args={[0.15, 0.06, 0.02]} />
              {toon(HOODIE_SHADE)}
            </mesh>
            {/* drawstrings with sakura beads */}
            {[-1, 1].map((s) => (
              <group key={s} position={[s * 0.04, 0.2, 0.16]}>
                <mesh position={[0, -0.04, 0]}>
                  <cylinderGeometry args={[0.006, 0.006, 0.08, 4]} />
                  {toon(palette.sakura)}
                </mesh>
                <mesh position={[0, -0.085, 0]} material={mats.glowPink}>
                  <sphereGeometry args={[0.014, 8, 6]} />
                </mesh>
              </group>
            ))}
          </group>

          <group ref={bind("chest")} position={[0, 0.18, 0]}>
            {/* hood */}
            <mesh position={[0, 0.1, -0.1]} rotation={[1.1, 0, 0]}>
              <torusGeometry args={[0.12, 0.05, 8, 20]} />
              {toon(HOODIE_SHADE)}
              {outline}
            </mesh>

            {/* arms with long sleeves */}
            {([-1, 1] as const).map((side) => {
              const L = side > 0 ? "left" : "right";
              return (
                <group
                  key={side}
                  ref={bind(`${L}UpperArm` as BoneName)}
                  position={[side * 0.15, 0.08, 0]}
                >
                  <mesh position={[side * 0.07, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <capsuleGeometry args={[0.055, 0.08, 4, 10]} />
                    {toon(HOODIE)}
                    {outline}
                  </mesh>
                  <group ref={bind(`${L}LowerArm` as BoneName)} position={[side * 0.14, 0, 0]}>
                    <mesh position={[side * 0.07, 0, 0]} rotation={[0, 0, (side * Math.PI) / 2]}>
                      <cylinderGeometry args={[0.052, 0.075, 0.15, 14]} />
                      {toon(HOODIE)}
                      {outline}
                    </mesh>
                    <mesh
                      position={[side * 0.145, 0, 0]}
                      rotation={[0, 0, Math.PI / 2]}
                      material={mats.trim}
                    >
                      <torusGeometry args={[0.074, 0.009, 6, 18]} />
                    </mesh>
                    <group ref={bind(`${L}Hand` as BoneName)} position={[side * 0.15, 0, 0]}>
                      <mesh position={[side * 0.025, 0, 0]}>
                        <sphereGeometry args={[0.04, 12, 10]} />
                        {toon(palette.skin)}
                        {outline}
                      </mesh>
                    </group>
                  </group>
                </group>
              );
            })}

            <group ref={bind("neck")} position={[0, 0.15, 0]}>
              <group ref={bind("head")} position={[0, 0.02, 0]}>
                {/* face: slightly wide and soft */}
                <mesh position={[0, 0.4, 0]} scale={[1.04, 0.96, 1]}>
                  <sphereGeometry args={[0.42, 36, 28]} />
                  {toon(palette.skin)}
                  {outline}
                </mesh>

                {/* eyes (right eye drawn, left mirrored) */}
                {[-1, 1].map((s, i) => (
                  <group
                    key={s}
                    position={[s * 0.15, 0.37, 0.405]}
                    rotation={[0, s * 0.36, 0]}
                    scale={[s < 0 ? 1 : -1, 1, 1]}
                  >
                    <mesh
                      ref={(el) => void (eyes.current[i].open = el)}
                      material={mats.eyeOpen}
                      renderOrder={2}
                    >
                      <planeGeometry args={[0.17, 0.21]} />
                    </mesh>
                    <mesh
                      ref={(el) => void (eyes.current[i].happy = el)}
                      material={mats.eyeHappy}
                      renderOrder={2}
                      visible={false}
                    >
                      <planeGeometry args={[0.17, 0.21]} />
                    </mesh>
                    <mesh
                      ref={(el) => void (eyes.current[i].closed = el)}
                      material={mats.eyeClosed}
                      renderOrder={2}
                      visible={false}
                    >
                      <planeGeometry args={[0.17, 0.21]} />
                    </mesh>
                  </group>
                ))}
                {/* blush */}
                {[-1, 1].map((s) => (
                  <mesh
                    key={`b${s}`}
                    position={[s * 0.25, 0.27, 0.33]}
                    rotation={[0, s * 0.65, 0]}
                    material={mats.blush}
                    renderOrder={1}
                  >
                    <planeGeometry args={[0.13, 0.065]} />
                  </mesh>
                ))}
                {/* mouth */}
                <group position={[0, 0.24, 0.392]}>
                  <mesh
                    ref={(el) => void (mouth.current.cat = el)}
                    material={mats.mouthCat}
                    renderOrder={2}
                  >
                    <planeGeometry args={[0.07, 0.035]} />
                  </mesh>
                  <mesh
                    ref={(el) => void (mouth.current.open = el)}
                    material={mats.mouthOpen}
                    renderOrder={2}
                    visible={false}
                    position={[0, -0.005, 0]}
                  >
                    <planeGeometry args={[0.07, 0.052]} />
                  </mesh>
                  <mesh
                    ref={(el) => void (mouth.current.o = el)}
                    material={mats.mouthO}
                    renderOrder={2}
                    visible={false}
                  >
                    <planeGeometry args={[0.045, 0.045]} />
                  </mesh>
                </group>

                {/* hair: back volume + cap */}
                <mesh position={[0, 0.42, -0.07]} scale={[1.03, 1.02, 1]}>
                  <sphereGeometry args={[0.45, 32, 24]} />
                  {toon(HAIR)}
                  {outline}
                </mesh>
                <mesh position={[0, 0.45, 0.0]}>
                  <sphereGeometry args={[0.45, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
                  {toon(HAIR)}
                </mesh>
                {/* rounded bangs */}
                {[-0.72, -0.48, -0.24, 0, 0.24, 0.48, 0.72].map((a, i) => (
                  <mesh
                    key={a}
                    position={[
                      Math.sin(a) * 0.38,
                      0.6 - Math.abs(a) * 0.12,
                      Math.cos(a) * 0.38 - 0.03,
                    ]}
                    rotation={[-0.38, a, (i % 2 ? 0.14 : -0.14) - a * 0.3]}
                    scale={[0.085, i === 3 ? 0.17 : 0.2, 0.05]}
                  >
                    <sphereGeometry args={[1, 14, 12]} />
                    {toon(HAIR)}
                  </mesh>
                ))}
                {/* side locks framing the face (spring) */}
                {[-1, 1].map((s) => (
                  <group key={s} ref={spring("x", 55, 0, 1)} position={[s * 0.36, 0.42, 0.16]}>
                    <mesh
                      position={[0, -0.2, 0]}
                      rotation={[0, 0, s * 0.06]}
                      scale={[0.07, 0.25, 0.05]}
                    >
                      <sphereGeometry args={[1, 12, 12]} />
                      {toon(HAIR)}
                      {outline}
                    </mesh>
                    <mesh position={[s * -0.005, -0.42, 0.005]} scale={[0.04, 0.06, 0.035]}>
                      <sphereGeometry args={[1, 10, 8]} />
                      {toon(HAIR_TIP)}
                    </mesh>
                  </group>
                ))}
                {/* twin tails with sakura bows (two-segment springs) */}
                {[-1, 1].map((s) => (
                  <group key={`t${s}`} position={[s * 0.4, 0.55, -0.14]}>
                    {/* bow */}
                    {[-1, 1].map((w) => (
                      <mesh
                        key={w}
                        position={[0, 0.02, w * 0.07]}
                        rotation={[w * 0.5, 0, 0]}
                        scale={[0.03, 0.06, 0.07]}
                      >
                        <sphereGeometry args={[1, 10, 8]} />
                        {toon(palette.sakura)}
                        {outline}
                      </mesh>
                    ))}
                    <mesh position={[0, 0.02, 0]}>
                      <sphereGeometry args={[0.035, 10, 8]} />
                      {toon("#ff8fb8")}
                    </mesh>
                    <group ref={spring("z", 30, s * 0.35, 1.6)}>
                      <mesh position={[s * 0.04, -0.2, 0]} scale={[0.1, 0.22, 0.09]}>
                        <sphereGeometry args={[1, 14, 12]} />
                        {toon(HAIR)}
                        {outline}
                      </mesh>
                      <group ref={spring("z", 26, s * -0.5, 2.2)} position={[s * 0.05, -0.38, 0]}>
                        <mesh position={[0, -0.13, 0]} scale={[0.075, 0.16, 0.07]}>
                          <sphereGeometry args={[1, 12, 10]} />
                          {toon(HAIR)}
                          {outline}
                        </mesh>
                        <mesh position={[0, -0.27, 0]} scale={[0.045, 0.06, 0.045]}>
                          <sphereGeometry args={[1, 10, 8]} />
                          {toon(HAIR_TIP)}
                        </mesh>
                      </group>
                    </group>
                  </group>
                ))}
                {/* ahoge (spring) */}
                <group ref={spring("z", 40, 0.25, 1.4)} position={[0.03, 0.86, 0.02]}>
                  <mesh position={[0, 0.06, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <torusGeometry args={[0.055, 0.016, 6, 14, Math.PI * 1.3]} />
                    {toon(HAIR)}
                  </mesh>
                </group>

                {/* cat-ear headphones */}
                <mesh position={[0, 0.42, -0.02]} rotation={[0, 0, 0]}>
                  <torusGeometry args={[0.47, 0.022, 8, 40, Math.PI]} />
                  {toon(PHONES)}
                  {outline}
                </mesh>
                {[-1, 1].map((s) => (
                  <group key={`p${s}`}>
                    <mesh position={[s * 0.45, 0.4, -0.02]} rotation={[0, 0, Math.PI / 2]}>
                      <cylinderGeometry args={[0.1, 0.1, 0.07, 20]} />
                      {toon(HOODIE)}
                      {outline}
                    </mesh>
                    <mesh
                      position={[s * 0.49, 0.4, -0.02]}
                      rotation={[0, Math.PI / 2, 0]}
                      material={mats.trim}
                    >
                      <torusGeometry args={[0.07, 0.012, 6, 20]} />
                    </mesh>
                    {/* ear */}
                    <group position={[s * 0.3, 0.77, -0.02]} rotation={[0, 0, -s * 0.55]}>
                      <mesh>
                        <coneGeometry args={[0.1, 0.18, 4]} />
                        {toon(PHONES)}
                        {outline}
                      </mesh>
                      <mesh
                        position={[0, -0.015, 0.035]}
                        scale={[0.6, 0.65, 0.4]}
                        material={mats.glowPink}
                      >
                        <coneGeometry args={[0.1, 0.18, 4]} />
                      </mesh>
                    </group>
                  </group>
                ))}
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
