"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, InstancedMesh, MeshBasicMaterial, Object3D } from "three";
import { palette, toonGradient } from "./toon";
import { world } from "./choreo";

const TOP = -1;

/** Rooftop set: slab, neon edge, railings, vending machine, water tank and string lights. */
export function Rooftop() {
  const g = toonGradient();
  const rails = useRef<InstancedMesh>(null);
  const bulbs = useRef<InstancedMesh>(null);
  const vendGlow = useMemo(() => new MeshBasicMaterial({ color: new Color(palette.sakura).multiplyScalar(1.6), toneMapped: false }), []);
  const neon = useMemo(() => new MeshBasicMaterial({ color: new Color(palette.cyan).multiplyScalar(1.5), toneMapped: false }), []);
  const bulbMat = useMemo(() => new MeshBasicMaterial({ color: new Color("#FFD9A0").multiplyScalar(2.2), toneMapped: false }), []);

  const bulbPoints = useMemo(() => {
    // Catenary from the vending machine to the water tank, then to the torii.
    const pts: [number, number, number][] = [];
    const seg = (a: [number, number, number], b: [number, number, number], n: number, sag: number) => {
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1);
        pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t - Math.sin(Math.PI * t) * sag, a[2] + (b[2] - a[2]) * t]);
      }
    };
    seg([-4.8, 1.4, -2.5], [4.6, 1.8, -6.5], 22, 0.7);
    seg([4.6, 1.8, -6.5], [1.3, 1.9, -10], 10, 0.4);
    seg([-1.3, 1.9, -10], [-4.8, 1.4, -2.5], 14, 0.6);
    return pts;
  }, []);

  useLayoutEffect(() => {
    const o = new Object3D();
    let i = 0;
    const box = (x: number, y: number, z: number, sx: number, sy: number, sz: number) => {
      o.position.set(x, y, z);
      o.scale.set(sx, sy, sz);
      o.updateMatrix();
      rails.current!.setMatrixAt(i++, o.matrix);
    };
    const post = (x: number, z: number) => box(x, TOP + 0.45, z, 0.06, 0.9, 0.06);
    for (let z = 5; z >= -15; z -= 1.25) {
      post(-6, z);
      post(6, z);
    }
    for (let x = -6; x <= 6; x += 1.25) post(x, -15.5);
    box(-6, TOP + 0.9, -5, 0.08, 0.06, 20.6);
    box(6, TOP + 0.9, -5, 0.08, 0.06, 20.6);
    box(0, TOP + 0.9, -15.5, 12, 0.06, 0.08);
    rails.current!.count = i;
    rails.current!.instanceMatrix.needsUpdate = true;

    bulbPoints.forEach((p, k) => {
      o.position.set(...p);
      o.scale.setScalar(1);
      o.rotation.set(0, 0, 0);
      o.updateMatrix();
      bulbs.current!.setMatrixAt(k, o.matrix);
    });
    bulbs.current!.instanceMatrix.needsUpdate = true;
  }, [bulbPoints]);

  useFrame(({ clock }) => {
    // Neon strip flickers a little more as night falls.
    const f = 1.2 + world.night * 0.6 + Math.sin(clock.elapsedTime * 13) * 0.04 * world.night;
    neon.color.set(palette.cyan).multiplyScalar(f);
  });

  return (
    <group>
      {/* slab */}
      <mesh position={[0, TOP - 0.25, -5]}>
        <boxGeometry args={[12.4, 0.5, 21.4]} />
        <meshToonMaterial color="#2a2140" gradientMap={g} />
      </mesh>
      {/* tiles */}
      <gridHelper args={[12, 24, "#3b2e5c", "#3b2e5c"]} position={[0, TOP + 0.005, -5]} scale={[1, 1, 1.78]} />
      {/* neon edge */}
      <mesh position={[0, TOP - 0.02, 5.72]} material={neon}>
        <boxGeometry args={[12.4, 0.04, 0.04]} />
      </mesh>
      <mesh position={[-6.22, TOP - 0.02, -5]} material={neon}>
        <boxGeometry args={[0.04, 0.04, 21.4]} />
      </mesh>
      <mesh position={[6.22, TOP - 0.02, -5]} material={neon}>
        <boxGeometry args={[0.04, 0.04, 21.4]} />
      </mesh>
      {/* railings */}
      <instancedMesh ref={rails} args={[undefined, undefined, 64]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshToonMaterial color="#5b4d82" gradientMap={g} />
      </instancedMesh>
      {/* vending machine */}
      <group position={[-4.8, TOP, -2.5]} rotation={[0, 0.5, 0]}>
        <mesh position={[0, 0.95, 0]}>
          <boxGeometry args={[0.95, 1.9, 0.7]} />
          <meshToonMaterial color="#e8e2f5" gradientMap={g} />
        </mesh>
        <mesh position={[0, 1.15, 0.36]} material={vendGlow}>
          <planeGeometry args={[0.75, 0.9]} />
        </mesh>
        {[0, 1, 2].map((r) => (
          <mesh key={r} position={[0, 0.85 + r * 0.3, 0.37]}>
            <planeGeometry args={[0.72, 0.03]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
        ))}
        <mesh position={[0, 0.35, 0.36]}>
          <planeGeometry args={[0.6, 0.18]} />
          <meshBasicMaterial color={palette.ink} />
        </mesh>
      </group>
      {/* water tank */}
      <group position={[4.6, TOP, -6.5]}>
        {[-0.5, 0.5].map((x) =>
          [-0.5, 0.5].map((z) => (
            <mesh key={`${x}${z}`} position={[x, 0.4, z]}>
              <boxGeometry args={[0.08, 0.8, 0.08]} />
              <meshToonMaterial color="#3a2f55" gradientMap={g} />
            </mesh>
          )),
        )}
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.85, 0.85, 1.3, 18]} />
          <meshToonMaterial color="#6d5a9c" gradientMap={g} />
        </mesh>
        <mesh position={[0, 2.15, 0]}>
          <coneGeometry args={[0.9, 0.3, 18]} />
          <meshToonMaterial color="#4a3b70" gradientMap={g} />
        </mesh>
      </group>
      {/* AC units */}
      {[
        [3.8, 1.8],
        [4.9, 2.6],
      ].map(([x, z]) => (
        <mesh key={x} position={[x, TOP + 0.3, z]}>
          <boxGeometry args={[0.9, 0.6, 0.5]} />
          <meshToonMaterial color="#8d84a8" gradientMap={g} />
        </mesh>
      ))}
      {/* string lights */}
      <instancedMesh ref={bulbs} args={[undefined, undefined, bulbPoints.length]} material={bulbMat}>
        <sphereGeometry args={[0.045, 8, 6]} />
      </instancedMesh>
    </group>
  );
}
