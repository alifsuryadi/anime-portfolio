"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Outlines } from "@react-three/drei";
import {
  Color,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  Raycaster,
  Vector2,
  Vector3,
  type Texture,
} from "three";
import type { BoneName, TouchZone } from "@/lib/scenes.config";
import { bus, pointerState } from "@/lib/scroll-state";
import { BONES, world, type CharacterDriver } from "./choreo";
import { celMaterial, setCelMood } from "./cel";
import { HEAD_R, faceGeo, headGeo, lathe, pleatedSkirt, strand } from "./animeGeometry";
import { palette } from "./toon";
import * as face from "./faceTextures";

const INK = "#1c1026";
/** Clicks on these never reach the character. */
const NOT_HER =
  "a, button, input, textarea, select, label, summary, [role='button'], [data-cursor], [data-covers-canvas]";

type Spring = {
  g: Group;
  axis: "x" | "z";
  k: number;
  a: number;
  v: number;
  rest: number;
  gain: number;
};

const decal = (map: Texture) =>
  new MeshBasicMaterial({
    map,
    transparent: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    toneMapped: false,
  });

/** Hair cap: centre and radius, in head space. Bangs and locks root on this sphere. */
const CAP = { y: 0.014, z: -0.02, r: 0.125 };
const onCap = (azimuth: number, elevation: number, r = CAP.r): [number, number, number] => [
  Math.sin(azimuth) * Math.cos(elevation) * r,
  CAP.y + Math.sin(elevation) * r,
  CAP.z + Math.cos(azimuth) * Math.cos(elevation) * r,
];

/** Fringe, left to right: [azimuth, width, length, roll, bend]. */
const BANGS: [number, number, number, number, number][] = [
  [-1.08, 0.062, 0.18, 0.1, 0.1],
  [-0.8, 0.066, 0.15, 0.16, 0.16],
  [-0.53, 0.064, 0.134, 0.08, 0.1],
  [-0.27, 0.062, 0.14, -0.06, -0.12],
  [0.0, 0.058, 0.118, 0.1, 0.14],
  [0.26, 0.062, 0.138, 0.02, 0.08],
  [0.52, 0.064, 0.13, -0.1, -0.12],
  [0.8, 0.066, 0.152, -0.16, -0.16],
  [1.08, 0.062, 0.18, -0.1, -0.1],
];
const HEM = [1.75, 2.15, 2.55, 2.95, -2.95, -2.55, -2.15, -1.75];

/**
 * The procedural character, used when no VRM file is present: an original
 * anime-proportioned girl (about 6.5 heads tall) built from lathes and a few
 * deformed spheres, cel shaded with ink outlines. The rig uses the same bone
 * names and rest pose (T-pose, arms along ±X) as a VRM, so poses from
 * scenes.config.ts drive both identically.
 *
 * Invisible hit volumes follow the bones, one per touch zone. A click or tap
 * on her is raycast against them and answered by `driver.touch`.
 */
export function AnimeModel({ driver }: { driver: CharacterDriver }) {
  const camera = useThree((s) => s.camera);
  const dpr = useThree((s) => s.viewport.dpr);
  const root = useRef<Group>(null);
  const bones = useRef<Partial<Record<BoneName | "head" | "body", Group | null>>>({});
  const springs = useRef<Spring[]>([]);
  const hits = useRef<Mesh[]>([]);
  const hovered = useRef<TouchZone | null>(null);

  const tex = useMemo(
    () => ({
      open: face.eyesOpen(),
      half: face.eyesHalf(),
      wide: face.eyesWide(),
      closed: face.eyesClosed(),
      happy: face.eyesHappy(),
      smile: face.mouthSmile(),
      laugh: face.mouthOpen(),
      o: face.mouthO(),
      blush: face.blush(),
    }),
    [],
  );

  const mats = useMemo(
    () => ({
      skin: celMaterial({ color: "#ffe6d8", shade: "#f2b1aa", edge: 0.02, rim: 0.35 }),
      neck: celMaterial({ color: "#f6bdb2", shade: "#e9a3a0" }),
      hair: celMaterial({ color: "#b7a2f2", shade: "#7a5fc4", gloss: "#f1e9ff", edge: 0.18 }),
      lock: celMaterial({ color: "#b7a2f2", shade: "#7a5fc4", edge: 0.18 }),
      shirt: celMaterial({ color: "#efebf6", shade: "#b9aedb" }),
      navy: celMaterial({ color: "#34327a", shade: "#1b1947", doubleSide: true }),
      sock: celMaterial({ color: "#241f3d", shade: "#120f24" }),
      pink: celMaterial({ color: palette.sakura, shade: "#c93f7c" }),
      shoe: celMaterial({ color: palette.sunset, shade: "#c9502f" }),
      white: celMaterial({ color: "#efebf6", shade: "#b9aedb" }),
      phones: celMaterial({ color: "#3a2f63", shade: "#201741" }),
      trim: new MeshBasicMaterial({
        color: new Color(palette.cyan).multiplyScalar(1.6),
        toneMapped: false,
      }),
      glow: new MeshBasicMaterial({
        color: new Color(palette.sakura).multiplyScalar(1.4),
        toneMapped: false,
      }),
      eyes: decal(tex.open),
      mouth: decal(tex.smile),
      blush: decal(tex.blush),
      hit: new MeshBasicMaterial({ visible: false }),
    }),
    [tex],
  );

  const geo = useMemo(
    () => ({
      head: headGeo(),
      face: faceGeo(),
      thigh: lathe([
        [0, -0.425],
        [0.04, -0.41],
        [0.046, -0.35],
        [0.057, -0.2],
        [0.068, -0.07],
        [0.06, 0.02],
        [0, 0.04],
      ]),
      stocking: lathe([
        [0, -0.43],
        [0.043, -0.413],
        [0.049, -0.35],
        [0.057, -0.27],
        [0.06, -0.235],
      ]),
      shin: lathe([
        [0, -0.4],
        [0.027, -0.385],
        [0.031, -0.32],
        [0.047, -0.15],
        [0.049, -0.07],
        [0.046, 0.0],
        [0, 0.03],
      ]),
      torso: lathe(
        [
          [0.082, 0],
          [0.076, 0.05],
          [0.086, 0.13],
          [0.102, 0.22],
          [0.1, 0.28],
          [0.064, 0.33],
          [0.03, 0.375],
        ],
        24,
        0.72,
      ),
      sleeve: lathe([
        [0, -0.024],
        [0.036, -0.012],
        [0.045, 0.03],
        [0.048, 0.075],
        [0.041, 0.1],
      ]),
      upperArm: lathe([
        [0, -0.02],
        [0.03, 0],
        [0.033, 0.1],
        [0.029, 0.2],
        [0, 0.225],
      ]),
      foreArm: lathe([
        [0, -0.02],
        [0.029, 0],
        [0.03, 0.05],
        [0.021, 0.19],
        [0, 0.205],
      ]),
      skirt: pleatedSkirt(0.084, 0.158, 0.25),
      bangs: BANGS.map(([, w, len, , bend]) => strand(w, len, 0.03, bend, 0.06)),
      sideLock: [-1, 1].map((s) => strand(0.042, 0.23, 0.026, s * -0.1, 0.05)),
      hem: HEM.map((a, i) =>
        strand(0.07, 0.12 + (i % 2) * 0.03, 0.034, (i % 2 ? 0.2 : -0.2) * 0.6),
      ),
      tailA: [-1, 1].map((s) => strand(0.09, 0.3, 0.05, s * 0.1)),
      tailB: [-1, 1].map((s) => strand(0.074, 0.33, 0.042, s * -0.14)),
      tailWisp: [-1, 1].map((s) => strand(0.045, 0.2, 0.026, s * 0.3)),
      ahoge: strand(0.02, 0.085, 0.012, 0.55),
      ribbonTail: strand(0.02, 0.07, 0.008),
    }),
    [],
  );

  useEffect(
    () => () => {
      Object.values(mats).forEach((m) => m.dispose());
      Object.values(tex).forEach((t) => t.dispose());
      Object.values(geo)
        .flat()
        .forEach((g) => g.dispose());
    },
    [mats, tex, geo],
  );

  // ── Touch ────────────────────────────────────────────────────────────────
  const pick = useMemo(() => {
    const ray = new Raycaster();
    const ndc = new Vector2();
    const local = new Vector3();
    return (x: number, y: number) => {
      const r = root.current;
      if (!r) return null;
      ray.setFromCamera(ndc.set(x, y), camera);
      const hit = ray.intersectObjects(hits.current, false)[0];
      if (!hit) return null;
      const data = hit.object.userData as { zone: TouchZone; side?: number };
      // +x in her own space is her left.
      const side = data.side ?? (r.worldToLocal(local.copy(hit.point)).x >= 0 ? 1 : -1);
      return { zone: data.zone, side };
    };
  }, [camera]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.(NOT_HER)) return;
      const hit = pick(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      );
      if (!hit) return;
      driver.touch(hit.zone, hit.side);
      bus.emit("character-touch", { zone: hit.zone, x: e.clientX, y: e.clientY });
    };
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("click", onClick);
      bus.emit("character-hover", null);
    };
  }, [driver, pick]);

  const bind = (name: BoneName | "head" | "body") => (el: Group | null) => {
    bones.current[name] = el;
  };
  const spring =
    (axis: "x" | "z", k: number, rest = 0, gain = 1) =>
    (el: Group | null) => {
      if (el && !springs.current.some((s) => s.g === el))
        springs.current.push({ g: el, axis, k, a: rest, v: 0, rest, gain });
    };
  /** Props for an invisible hit volume belonging to a touch zone. */
  const zone = (name: TouchZone, side?: number) => ({
    ref: (el: Mesh | null) => {
      if (el && !hits.current.includes(el)) hits.current.push(el);
    },
    userData: { zone: name, side },
    material: mats.hit,
  });

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
      head.rotation.set(
        driver.head.x,
        driver.head.y,
        Math.sin(time * 1.1) * 0.04 + driver.headRoll,
      );
      // Konami easter egg: big-head mode.
      head.scale.setScalar(MathUtils.lerp(head.scale.x, world.chibi ? 1.9 : 1, 0.1));
    }
    const body = bones.current.body;
    if (body) body.scale.set(1, 1 + Math.sin(time * 1.8) * 0.012, 1);

    // Face: pick the drawn frame that matches the expression.
    const e = driver.expressions;
    mats.eyes.map =
      e.happy > 0.5
        ? tex.happy
        : e.blink > 0.6
          ? tex.closed
          : e.blink > 0.25
            ? tex.half
            : e.surprised > 0.45
              ? tex.wide
              : e.relaxed > 0.5
                ? tex.half
                : tex.open;
    mats.mouth.map = e.surprised > 0.4 ? tex.o : e.happy > 0.6 ? tex.laugh : tex.smile;
    mats.blush.opacity = Math.min(1, 0.2 + e.happy * 0.45 + driver.flustered * 0.55);

    // Dusk -> night tint, shared by the cel shader and the face decals.
    const tint = setCelMood(world.night);
    mats.eyes.color.copy(tint).multiplyScalar(0.92);
    mats.mouth.color.copy(tint);
    mats.blush.color.copy(tint);

    // Spring hair: driven by head turn speed, body bounce, and tugs from a touch.
    const bounce =
      (driver.position.y - (r.userData.lastY ?? driver.position.y)) / Math.max(d, 1e-3);
    r.userData.lastY = driver.position.y;
    const kick = driver.hairKick;
    driver.hairKick = 0;
    for (const s of springs.current) {
      const force =
        (s.axis === "x" ? driver.headVel.x - bounce * 0.6 : -driver.headVel.y) * 0.08 * s.gain;
      s.v += (-(s.a - s.rest) * s.k - s.v * 2 * Math.sqrt(s.k) * 0.3 - force * s.k * 0.1) * d;
      s.v += kick * s.gain * 0.5;
      s.a = MathUtils.clamp(s.a + s.v * d, s.rest - 0.8, s.rest + 0.8);
      s.g.rotation[s.axis] = s.a + Math.sin(time * 1.6 + s.rest * 3) * 0.025;
    }

    // Hover: tell the cursor when it is over a touchable part.
    if (pointerState.px || pointerState.py) {
      const over = pick(pointerState.x, pointerState.y)?.zone ?? null;
      if (over !== hovered.current) {
        hovered.current = over;
        bus.emit("character-hover", over);
      }
    }
  });

  // Ink line weight in CSS pixels, constant on screen like a drawn line.
  const ink = <Outlines thickness={2.4 * dpr} color={INK} />;
  const fine = <Outlines thickness={1.6 * dpr} color={INK} />;

  return (
    <group ref={root}>
      {/* hips */}
      <group position={[0, 0.86, 0]}>
        {([-1, 1] as const).map((side) => {
          const L = side < 0 ? "right" : "left";
          return (
            <group
              key={side}
              ref={bind(`${L}UpperLeg` as BoneName)}
              position={[side * 0.058, -0.02, 0]}
            >
              <mesh geometry={geo.thigh} material={mats.skin}>
                {ink}
              </mesh>
              {/* thigh-high stocking with a neon band */}
              <mesh geometry={geo.stocking} material={mats.sock}>
                {ink}
              </mesh>
              <mesh position={[0, -0.243, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.trim}>
                <torusGeometry args={[0.0605, 0.004, 6, 20]} />
              </mesh>
              <mesh position={[0, -0.2, 0]} {...zone("body")}>
                <capsuleGeometry args={[0.075, 0.26, 3, 8]} />
              </mesh>
              <group ref={bind(`${L}LowerLeg` as BoneName)} position={[0, -0.4, 0]}>
                <mesh geometry={geo.shin} material={mats.sock}>
                  {ink}
                </mesh>
                {/* sneaker */}
                <mesh
                  position={[0, -0.405, 0.03]}
                  scale={[0.041, 0.034, 0.084]}
                  material={mats.shoe}
                >
                  <sphereGeometry args={[1, 16, 12]} />
                  {ink}
                </mesh>
                <mesh
                  position={[0, -0.431, 0.03]}
                  scale={[0.043, 0.012, 0.087]}
                  material={mats.white}
                >
                  <sphereGeometry args={[1, 16, 8]} />
                  {fine}
                </mesh>
                <mesh position={[0, -0.2, 0]} {...zone("body")}>
                  <capsuleGeometry args={[0.065, 0.2, 3, 8]} />
                </mesh>
                <mesh position={[0, -0.41, 0.03]} {...zone("shoe", side)}>
                  <sphereGeometry args={[0.09, 8, 6]} />
                </mesh>
              </group>
            </group>
          );
        })}

        <mesh position={[0, -0.02, 0]} scale={[0.1, 0.07, 0.08]} material={mats.navy}>
          <sphereGeometry args={[1, 16, 12]} />
        </mesh>
        <mesh
          geometry={geo.skirt}
          position={[0, -0.045, 0]}
          scale={[1, 1, 0.84]}
          material={mats.navy}
        >
          {ink}
        </mesh>
        <mesh position={[0, -0.04, 0]} {...zone("body")}>
          <capsuleGeometry args={[0.15, 0.06, 3, 8]} />
        </mesh>

        <group ref={bind("spine")} position={[0, 0.06, 0]}>
          <group ref={bind("body")}>
            <mesh geometry={geo.torso} material={mats.shirt}>
              {ink}
            </mesh>
            {/* waistband */}
            <mesh
              position={[0, 0.022, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={[1, 0.74, 1]}
              material={mats.navy}
            >
              <torusGeometry args={[0.081, 0.012, 8, 28]} />
              {fine}
            </mesh>
            <mesh position={[0, 0.19, 0]} {...zone("body")}>
              <capsuleGeometry args={[0.11, 0.18, 3, 8]} />
            </mesh>
          </group>

          <group ref={bind("chest")} position={[0, 0.2, 0]}>
            {/* sailor collar + ribbon */}
            <mesh position={[0, 0.15, 0]} scale={[1, 1, 0.86]} material={mats.navy}>
              <cylinderGeometry args={[0.034, 0.09, 0.06, 24, 1, true]} />
              {ink}
            </mesh>
            <mesh
              position={[0, 0.127, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={[1, 0.86, 1]}
              material={mats.white}
            >
              <torusGeometry args={[0.082, 0.003, 6, 32]} />
            </mesh>
            <group position={[0, 0.098, 0.082]}>
              {[-1, 1].map((s) => (
                <group key={s}>
                  <mesh
                    position={[s * 0.027, 0.004, 0]}
                    rotation={[0, 0, s * 0.35]}
                    scale={[0.028, 0.017, 0.009]}
                    material={mats.pink}
                  >
                    <sphereGeometry args={[1, 12, 8]} />
                    {fine}
                  </mesh>
                  <mesh
                    geometry={geo.ribbonTail}
                    rotation={[0.1, 0, s * 0.28]}
                    material={mats.pink}
                  >
                    {fine}
                  </mesh>
                </group>
              ))}
              <mesh material={mats.pink}>
                <sphereGeometry args={[0.011, 10, 8]} />
                {fine}
              </mesh>
            </group>

            {([-1, 1] as const).map((side) => {
              const L = side > 0 ? "left" : "right";
              const along: [number, number, number] = [0, 0, (-side * Math.PI) / 2];
              return (
                <group
                  key={side}
                  ref={bind(`${L}UpperArm` as BoneName)}
                  position={[side * 0.112, 0.112, 0]}
                >
                  <mesh geometry={geo.upperArm} rotation={along} material={mats.skin}>
                    {ink}
                  </mesh>
                  {/* short puff sleeve with a navy cuff */}
                  <mesh geometry={geo.sleeve} rotation={along} material={mats.shirt}>
                    {ink}
                  </mesh>
                  <mesh
                    position={[side * 0.098, 0, 0]}
                    rotation={[0, Math.PI / 2, 0]}
                    material={mats.navy}
                  >
                    <torusGeometry args={[0.041, 0.006, 6, 20]} />
                  </mesh>
                  <group ref={bind(`${L}LowerArm` as BoneName)} position={[side * 0.21, 0, 0]}>
                    <mesh geometry={geo.foreArm} rotation={along} material={mats.skin}>
                      {ink}
                    </mesh>
                    <group ref={bind(`${L}Hand` as BoneName)} position={[side * 0.2, 0, 0]}>
                      <mesh
                        position={[side * 0.042, 0, 0]}
                        scale={[0.046, 0.014, 0.03]}
                        material={mats.skin}
                      >
                        <sphereGeometry args={[1, 14, 10]} />
                        {ink}
                      </mesh>
                      <mesh
                        position={[side * 0.03, -0.002, 0.03]}
                        rotation={[0, side * -0.6, 0]}
                        scale={[0.021, 0.01, 0.011]}
                        material={mats.skin}
                      >
                        <sphereGeometry args={[1, 10, 8]} />
                        {fine}
                      </mesh>
                      <mesh position={[side * 0.04, 0, 0]} {...zone("hand", side)}>
                        <sphereGeometry args={[0.085, 8, 6]} />
                      </mesh>
                    </group>
                  </group>
                </group>
              );
            })}

            <group ref={bind("neck")} position={[0, 0.19, 0]}>
              <mesh position={[0, 0.015, 0]} material={mats.neck}>
                <cylinderGeometry args={[0.027, 0.031, 0.11, 14]} />
                {fine}
              </mesh>
              <group ref={bind("head")} position={[0, 0.045, 0]}>
                {/* everything below is in head space: origin at the centre of the skull */}
                <group position={[0, HEAD_R * 1.22 - 0.005, 0]}>
                  <mesh geometry={geo.head} material={mats.skin}>
                    {ink}
                  </mesh>
                  <mesh geometry={geo.face} material={mats.blush} renderOrder={1} />
                  <mesh geometry={geo.face} material={mats.mouth} renderOrder={2} />
                  <mesh geometry={geo.face} material={mats.eyes} renderOrder={3} />

                  {/* hair: cap, fringe, side locks, hem */}
                  <mesh position={[0, CAP.y, CAP.z]} material={mats.hair}>
                    <sphereGeometry args={[CAP.r, 36, 28]} />
                    {ink}
                  </mesh>
                  {BANGS.map(([a, , , roll], i) => (
                    <group key={a} position={onCap(a, 0.78, 0.133)} rotation={[0, a, 0]}>
                      <mesh geometry={geo.bangs[i]} rotation={[-0.4, 0, roll]} material={mats.lock}>
                        {fine}
                      </mesh>
                    </group>
                  ))}
                  {[-1, 1].map((s, i) => (
                    <group key={s} position={onCap(s * 1.3, 0.42, 0.13)} rotation={[0, s * 1.3, 0]}>
                      <group ref={spring("x", 55, -0.1, 1)}>
                        <mesh geometry={geo.sideLock[i]} material={mats.lock}>
                          {fine}
                        </mesh>
                      </group>
                    </group>
                  ))}
                  {HEM.map((a, i) => (
                    <group key={a} position={onCap(a, -0.2)} rotation={[0, a, 0]}>
                      <mesh geometry={geo.hem[i]} rotation={[-0.22, 0, 0]} material={mats.lock}>
                        {fine}
                      </mesh>
                    </group>
                  ))}

                  {/* twin tails tied with sakura bobbles (two-segment springs) */}
                  {[-1, 1].map((s, i) => (
                    <group key={`t${s}`} position={[s * 0.112, 0.062, -0.05]}>
                      <mesh material={mats.pink}>
                        <sphereGeometry args={[0.022, 12, 10]} />
                        {fine}
                      </mesh>
                      <group ref={spring("z", 30, s * 0.3, 1.6)}>
                        <mesh geometry={geo.tailA[i]} material={mats.lock}>
                          {ink}
                        </mesh>
                        <mesh
                          geometry={geo.tailWisp[i]}
                          position={[s * 0.01, -0.06, -0.01]}
                          rotation={[0, 0, s * 0.2]}
                          material={mats.lock}
                        >
                          {fine}
                        </mesh>
                        <mesh position={[s * 0.01, -0.15, 0]} {...zone("hair")}>
                          <capsuleGeometry args={[0.06, 0.18, 3, 8]} />
                        </mesh>
                        <group
                          ref={spring("z", 26, s * -0.34, 2.2)}
                          position={[s * 0.022, -0.23, 0]}
                        >
                          <mesh geometry={geo.tailB[i]} material={mats.lock}>
                            {ink}
                          </mesh>
                          <mesh position={[s * -0.02, -0.17, 0]} {...zone("hair")}>
                            <capsuleGeometry args={[0.055, 0.2, 3, 8]} />
                          </mesh>
                        </group>
                      </group>
                    </group>
                  ))}

                  {/* ahoge (spring) */}
                  <group ref={spring("z", 40, 0.2, 1.4)} position={[0.008, 0.132, 0.01]}>
                    <mesh geometry={geo.ahoge} rotation={[0, 0, Math.PI]} material={mats.lock}>
                      {fine}
                    </mesh>
                  </group>

                  {/* cat-ear headphones */}
                  <mesh position={[0, 0.004, -0.014]} material={mats.phones}>
                    <torusGeometry args={[0.139, 0.009, 8, 40, Math.PI]} />
                    {fine}
                  </mesh>
                  {[-1, 1].map((s) => (
                    <group key={`p${s}`}>
                      <mesh
                        position={[s * 0.136, -0.008, -0.014]}
                        rotation={[0, 0, Math.PI / 2]}
                        material={mats.white}
                      >
                        <cylinderGeometry args={[0.043, 0.043, 0.03, 20]} />
                        {ink}
                      </mesh>
                      <mesh
                        position={[s * 0.152, -0.008, -0.014]}
                        rotation={[0, Math.PI / 2, 0]}
                        material={mats.trim}
                      >
                        <torusGeometry args={[0.029, 0.005, 6, 20]} />
                      </mesh>
                      <group position={[s * 0.088, 0.142, -0.014]} rotation={[0, 0, -s * 0.5]}>
                        <mesh material={mats.phones}>
                          <coneGeometry args={[0.04, 0.075, 4]} />
                          {fine}
                        </mesh>
                        <mesh
                          position={[0, -0.006, 0.014]}
                          scale={[0.6, 0.65, 0.4]}
                          material={mats.glow}
                        >
                          <coneGeometry args={[0.04, 0.075, 4]} />
                        </mesh>
                      </group>
                      <mesh position={[s * 0.155, -0.008, -0.014]} {...zone("headphones")}>
                        <sphereGeometry args={[0.06, 8, 6]} />
                      </mesh>
                      <mesh position={[s * 0.092, 0.15, -0.014]} {...zone("headphones")}>
                        <sphereGeometry args={[0.05, 8, 6]} />
                      </mesh>
                    </group>
                  ))}

                  {/* touch zones on the head */}
                  <mesh position={[0, 0.045, -0.012]} {...zone("head")}>
                    <sphereGeometry args={[0.15, 10, 8]} />
                  </mesh>
                  <mesh position={[0, -0.05, 0.062]} {...zone("cheek")}>
                    <sphereGeometry args={[0.076, 10, 8]} />
                  </mesh>
                  <mesh position={[0, 0.2, 0.01]} {...zone("ahoge")}>
                    <sphereGeometry args={[0.045, 8, 6]} />
                  </mesh>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
