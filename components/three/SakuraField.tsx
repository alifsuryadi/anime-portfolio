"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Color,
  DoubleSide,
  InstancedMesh,
  MeshBasicMaterial,
  Object3D,
  Shape,
  ShapeGeometry,
  Vector3,
} from "three";
import { pointerState, scrollState } from "@/lib/scroll-state";

const BOX = new Vector3(14, 8, 12);

/**
 * Falling sakura: one InstancedMesh. Wind grows with scroll speed, and petals
 * near the cursor get blown along the pointer's motion.
 */
export function SakuraField({ count = 500 }: { count?: number }) {
  const ref = useRef<InstancedMesh>(null);

  const geometry = useMemo(() => {
    const s = new Shape();
    s.moveTo(0, -1);
    s.bezierCurveTo(0.9, -0.7, 0.75, 0.6, 0.18, 1);
    s.lineTo(0, 0.72);
    s.lineTo(-0.18, 1);
    s.bezierCurveTo(-0.75, 0.6, -0.9, -0.7, 0, -1);
    const g = new ShapeGeometry(s, 6);
    g.scale(0.045, 0.045, 0.045);
    return g;
  }, []);
  const material = useMemo(
    () =>
      new MeshBasicMaterial({
        side: DoubleSide,
        transparent: true,
        opacity: 0.92,
        depthWrite: false,
      }),
    [],
  );

  const petals = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        p: new Vector3(
          (Math.random() - 0.5) * BOX.x,
          (Math.random() - 0.5) * BOX.y,
          (Math.random() - 0.5) * BOX.z,
        ),
        v: new Vector3(),
        rot: new Vector3(Math.random() * 6, Math.random() * 6, Math.random() * 6),
        spin: new Vector3(
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3,
        ),
        fall: 0.25 + Math.random() * 0.35,
        phase: Math.random() * 100,
        scale: 0.6 + Math.random() * 0.8,
      })),
    [count],
  );

  useLayoutEffect(() => {
    const c = new Color();
    for (let i = 0; i < count; i++) {
      c.set("#FF6FA5").lerp(new Color("#FFE0EC"), Math.random() * 0.75);
      ref.current!.setColorAt(i, c);
    }
    if (ref.current!.instanceColor) ref.current!.instanceColor.needsUpdate = true;
  }, [count]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  const o = useMemo(() => new Object3D(), []);
  const ndc = useMemo(() => new Vector3(), []);
  const prevPointer = useMemo(() => ({ x: 0, y: 0 }), []);

  useFrame(({ camera, clock }, dt) => {
    const mesh = ref.current;
    if (!mesh) return;
    const d = Math.min(dt, 1 / 20);
    const t = clock.elapsedTime;
    const energy = scrollState.energy;
    const dir = Math.sign(scrollState.velocity) || 1;
    const windX = 0.35 + energy * 5.5;
    const lift = dir * energy * 3.2;
    const pdx = pointerState.x - prevPointer.x;
    const pdy = pointerState.y - prevPointer.y;
    prevPointer.x = pointerState.x;
    prevPointer.y = pointerState.y;
    const pointerMoving = Math.abs(pdx) + Math.abs(pdy) > 0.002;
    const center = camera.position;

    for (let i = 0; i < count; i++) {
      const pt = petals[i];
      pt.v.x += (windX + Math.sin(t * 0.7 + pt.phase) * 0.6 - pt.v.x) * d * 2;
      pt.v.y += (-pt.fall + lift - pt.v.y) * d * 2.5;
      pt.v.z += (Math.cos(t * 0.5 + pt.phase) * 0.3 - pt.v.z) * d * 2;

      if (pointerMoving) {
        ndc.copy(pt.p).project(camera);
        const dx = ndc.x - pointerState.x;
        const dy = ndc.y - pointerState.y;
        const dist2 = dx * dx + dy * dy;
        if (ndc.z < 1 && dist2 < 0.04) {
          const f = (1 - dist2 / 0.04) * 90;
          pt.v.x += pdx * f;
          pt.v.y += pdy * f;
        }
      }

      pt.p.addScaledVector(pt.v, d);
      // Wrap inside a box that travels with the camera (infinite field).
      for (const ax of ["x", "y", "z"] as const) {
        const half = BOX[ax] / 2;
        const rel = pt.p[ax] - center[ax];
        if (rel > half) pt.p[ax] -= BOX[ax];
        else if (rel < -half) pt.p[ax] += BOX[ax];
      }
      const sp = 1 + energy * 4;
      pt.rot.x += pt.spin.x * d * sp;
      pt.rot.y += pt.spin.y * d * sp;
      pt.rot.z += pt.spin.z * d * sp;
      o.position.copy(pt.p);
      o.rotation.set(pt.rot.x, pt.rot.y, pt.rot.z);
      o.scale.setScalar(pt.scale);
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={ref} args={[geometry, material, count]} frustumCulled={false} />;
}
