"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, Group, MeshBasicMaterial } from "three";
import { palette, toonGradient } from "./toon";
import { world } from "./choreo";

/** Low-poly rooftop shrine: torii gate with two glowing paper lanterns. */
export function Torii({ position = [0, -1, -10] as [number, number, number] }) {
  const g = toonGradient();
  const lanterns = useRef<Group>(null);
  const glow = useMemo(() => new MeshBasicMaterial({ color: new Color("#FFB36B"), toneMapped: false }), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    glow.color.set("#FFB36B").multiplyScalar(1 + world.night * 1.4 + Math.sin(t * 6) * 0.05);
    if (lanterns.current) lanterns.current.children.forEach((c, i) => (c.rotation.z = Math.sin(t * 1.3 + i) * 0.05));
  });

  const red = <meshToonMaterial color={palette.vermilion} gradientMap={g} />;
  const black = <meshToonMaterial color="#1b1424" gradientMap={g} />;

  return (
    <group position={position}>
      {/* pillars */}
      {[-1.25, 1.25].map((x) => (
        <group key={x}>
          <mesh position={[x, 1.55, 0]}>
            <cylinderGeometry args={[0.14, 0.17, 3.1, 12]} />
            {red}
          </mesh>
          <mesh position={[x, 0.12, 0]}>
            <cylinderGeometry args={[0.21, 0.21, 0.24, 12]} />
            {black}
          </mesh>
        </group>
      ))}
      {/* nuki (lower beam) */}
      <mesh position={[0, 2.35, 0]}>
        <boxGeometry args={[3.2, 0.16, 0.18]} />
        {red}
      </mesh>
      {/* gakuzuka */}
      <mesh position={[0, 2.62, 0]}>
        <boxGeometry args={[0.16, 0.4, 0.16]} />
        {red}
      </mesh>
      {/* kasagi (top beam) with upturned ends */}
      <mesh position={[0, 2.9, 0]}>
        <boxGeometry args={[3.0, 0.22, 0.32]} />
        {red}
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 1.75, 2.96, 0]} rotation={[0, 0, s * 0.14]}>
          <boxGeometry args={[0.7, 0.22, 0.32]} />
          {red}
        </mesh>
      ))}
      <mesh position={[0, 3.06, 0]}>
        <boxGeometry args={[3.1, 0.1, 0.4]} />
        {black}
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={`k${s}`} position={[s * 1.8, 3.13, 0]} rotation={[0, 0, s * 0.16]}>
          <boxGeometry args={[0.75, 0.1, 0.4]} />
          {black}
        </mesh>
      ))}
      {/* shimenawa rope + paper streamers */}
      <mesh position={[0, 2.2, 0.05]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.05, 2.2, 4, 8]} />
        <meshToonMaterial color="#d9c38f" gradientMap={g} />
      </mesh>
      {[-0.6, 0, 0.6].map((x) => (
        <mesh key={x} position={[x, 2.0, 0.08]}>
          <planeGeometry args={[0.1, 0.3]} />
          <meshBasicMaterial color={palette.paper} />
        </mesh>
      ))}
      {/* lanterns */}
      <group ref={lanterns}>
        {[-2.3, 2.3].map((x) => (
          <group key={x} position={[x, 0, 0.6]}>
            <mesh position={[0, 0.45, 0]}>
              <boxGeometry args={[0.12, 0.9, 0.12]} />
              {black}
            </mesh>
            <mesh position={[0, 1.15, 0]} material={glow}>
              <cylinderGeometry args={[0.22, 0.22, 0.5, 10]} />
            </mesh>
            <mesh position={[0, 1.45, 0]}>
              <coneGeometry args={[0.32, 0.18, 10]} />
              {black}
            </mesh>
          </group>
        ))}
      </group>
      <pointLight position={[0, 1.4, 1]} color="#ff9a5a" intensity={6} distance={6} decay={2} />
    </group>
  );
}
