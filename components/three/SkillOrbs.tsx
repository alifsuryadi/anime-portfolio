"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, Color, Group, MathUtils, Mesh, MeshBasicMaterial } from "three";
import { skillGroups, skills, type SkillGroup } from "@/content/skills";
import { bus } from "@/lib/scroll-state";
import { currentKeys, world } from "./choreo";

const GROUPS = Object.keys(skillGroups) as SkillGroup[];
const COLORS = ["#3BF4FB", "#FF6FA5", "#FF8A3D", "#B48CFF", "#F5EFE6"];

/** Glowing orbs (one per skill group) plus small satellites (one per skill) orbiting the character. */
export function SkillOrbs() {
  const root = useRef<Group>(null);
  const orbs = useRef<(Mesh | null)[]>([]);
  const sats = useRef<(Mesh | null)[]>([]);
  const focus = useRef<SkillGroup | null>(null);
  const strength = useRef(0);

  const mats = useMemo(
    () => COLORS.map((c) => new MeshBasicMaterial({ color: new Color(c).multiplyScalar(1.8), toneMapped: false, transparent: true })),
    [],
  );
  const halo = useMemo(
    () => COLORS.map((c) => new MeshBasicMaterial({ color: c, transparent: true, opacity: 0.2, blending: AdditiveBlending, depthWrite: false })),
    [],
  );

  useEffect(() => bus.on("skill-hover", (g) => (focus.current = (g as SkillGroup | null) ?? null)), []);
  useEffect(
    () => () => {
      [...mats, ...halo].forEach((m) => m.dispose());
    },
    [mats, halo],
  );

  useFrame(({ clock }, dt) => {
    const { a, b, t } = currentKeys();
    const target = MathUtils.lerp(a.orbs ?? 0, b.orbs ?? 0, t);
    strength.current = MathUtils.lerp(strength.current, target, 1 - Math.exp(-dt * 4));
    world.orbs = strength.current;
    const s = strength.current;
    const r = root.current;
    if (!r) return;
    r.visible = s > 0.01;
    if (!r.visible) return;
    r.position.copy(world.characterPos);
    r.position.y += 0.95;
    const time = clock.elapsedTime;

    GROUPS.forEach((g, i) => {
      const m = orbs.current[i];
      if (!m) return;
      const ang = time * 0.45 + (i / GROUPS.length) * Math.PI * 2;
      const tilt = 0.35;
      const rad = 1.25 * s;
      m.position.set(Math.cos(ang) * rad, Math.sin(ang * 1.3) * 0.25 + Math.sin(ang) * tilt * rad * 0.4, Math.sin(ang) * rad);
      const hot = focus.current === g ? 1.7 : focus.current ? 0.7 : 1;
      const sc = MathUtils.lerp(m.scale.x, 0.11 * hot * s, 0.15);
      m.scale.setScalar(sc);
      mats[i].opacity = s;
    });
    skills.forEach((sk, i) => {
      const m = sats.current[i];
      if (!m) return;
      const gi = GROUPS.indexOf(sk.group);
      const parent = orbs.current[gi];
      if (!parent) return;
      const ang = time * 1.4 + i * 2.1;
      const rr = 0.22 + (i % 3) * 0.05;
      m.position.set(parent.position.x + Math.cos(ang) * rr, parent.position.y + Math.sin(ang * 0.8) * rr, parent.position.z + Math.sin(ang) * rr);
      m.scale.setScalar(0.025 * s * (focus.current === sk.group ? 1.6 : 1));
    });
  });

  return (
    <group ref={root}>
      {GROUPS.map((g, i) => (
        <mesh key={g} ref={(el) => void (orbs.current[i] = el)} material={mats[i]}>
          <icosahedronGeometry args={[1, 2]} />
          <mesh scale={2.2} material={halo[i]}>
            <sphereGeometry args={[1, 16, 12]} />
          </mesh>
        </mesh>
      ))}
      {skills.map((sk, i) => (
        <mesh key={sk.name} ref={(el) => void (sats.current[i] = el)} material={mats[GROUPS.indexOf(sk.group)]}>
          <sphereGeometry args={[1, 8, 6]} />
        </mesh>
      ))}
    </group>
  );
}
