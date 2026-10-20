"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils, PerspectiveCamera, Vector3 } from "three";
import { pointerState, scrollState } from "@/lib/scroll-state";
import { currentKeys, world } from "./choreo";

/** Blends camera position / target / fov between scene keys, with pointer parallax and a scroll-speed shake. */
export function CameraRig() {
  const pos = useMemo(() => new Vector3(), []);
  const look = useMemo(() => new Vector3(), []);
  const cur = useMemo(
    () => ({ pos: new Vector3(), look: new Vector3(), fov: 32, init: false }),
    [],
  );

  useFrame(({ camera, size, clock }, dt) => {
    const { a, b, t } = currentKeys();
    world.night = MathUtils.lerp(a.night, b.night, t);

    world.mobile = size.width < 768;
    const ca = (world.mobile && a.mobileCamera) || a.camera;
    const cb = (world.mobile && b.mobileCamera) || b.camera;
    pos.set(
      MathUtils.lerp(ca.position[0], cb.position[0], t),
      MathUtils.lerp(ca.position[1], cb.position[1], t),
      MathUtils.lerp(ca.position[2], cb.position[2], t),
    );
    look.set(
      MathUtils.lerp(ca.target[0], cb.target[0], t),
      MathUtils.lerp(ca.target[1], cb.target[1], t),
      MathUtils.lerp(ca.target[2], cb.target[2], t),
    );
    let fov = MathUtils.lerp(ca.fov, cb.fov, t);

    // Narrow screens without an explicit camera: pull back and center the shot.
    if (world.mobile) {
      const w = (a.mobileCamera ? 0 : 1 - t) + (b.mobileCamera ? 0 : t);
      pos.z += 1.6 * w;
      pos.x *= 1 - 0.7 * w;
      look.x *= 1 - 0.7 * w;
      fov += 6 * w;
    }

    // Pointer parallax + fast-scroll shake.
    pos.x += pointerState.x * 0.18;
    pos.y += pointerState.y * 0.1;
    const shake = scrollState.energy * 0.03;
    pos.x += Math.sin(clock.elapsedTime * 40) * shake;
    pos.y += Math.cos(clock.elapsedTime * 37) * shake;

    const k = cur.init ? 1 - Math.exp(-dt * 4) : 1;
    cur.init = true;
    cur.pos.lerp(pos, k);
    cur.look.lerp(look, k);
    cur.fov = MathUtils.lerp(cur.fov, fov + scrollState.energy * 4, k);

    camera.position.copy(cur.pos);
    camera.lookAt(cur.look);
    const cam = camera as PerspectiveCamera;
    if (Math.abs(cam.fov - cur.fov) > 0.01) {
      cam.fov = cur.fov;
      cam.updateProjectionMatrix();
    }
  });

  return null;
}
