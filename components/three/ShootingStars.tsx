"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, Mesh, PlaneGeometry, ShaderMaterial, Vector3 } from "three";
import { bus } from "@/lib/scroll-state";
import { world } from "./choreo";

const POOL = 10;

/** Shooting stars: spawned where the user clicks the footer sky, plus occasional random ones at night. */
export function ShootingStars() {
  const meshes = useRef<(Mesh | null)[]>([]);
  const queue = useRef<{ x: number; y: number }[]>([]);
  const stars = useMemo(
    () =>
      Array.from({ length: POOL }, () => ({
        life: 0,
        pos: new Vector3(),
        dir: new Vector3(),
        speed: 0,
      })),
    [],
  );
  const geometry = useMemo(() => {
    const g = new PlaneGeometry(1, 0.03);
    g.translate(-0.5, 0, 0);
    return g;
  }, []);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: { uAlpha: { value: 1 } },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `varying vec2 vUv; uniform float uAlpha;
          void main(){ float a = pow(vUv.x, 2.5) * (1.0 - abs(vUv.y - 0.5) * 2.0);
          gl_FragColor = vec4(mix(vec3(0.4,0.95,1.0), vec3(1.0), vUv.x) * 1.6, a * uAlpha); }`,
      }),
    [],
  );

  useEffect(
    () => bus.on("shooting-star", (d) => queue.current.push(d as { x: number; y: number })),
    [],
  );
  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  const tmp = useMemo(() => new Vector3(), []);
  useFrame(({ camera }, dt) => {
    // Random ones at night.
    if (world.night > 0.6 && Math.random() < dt * 0.25 * world.night)
      queue.current.push({ x: Math.random() * 1.6 - 0.8, y: 0.3 + Math.random() * 0.6 });

    while (queue.current.length) {
      const q = queue.current.shift()!;
      const s = stars.find((x) => x.life <= 0);
      if (!s) break;
      tmp.set(q.x, q.y, 0.5).unproject(camera).sub(camera.position).normalize();
      s.pos.copy(camera.position).addScaledVector(tmp, 40);
      s.dir.set(-0.8 - Math.random() * 0.4, -0.45 - Math.random() * 0.2, 0).normalize();
      s.speed = 28 + Math.random() * 12;
      s.life = 1;
    }

    stars.forEach((s, i) => {
      const m = meshes.current[i];
      if (!m) return;
      if (s.life <= 0) {
        m.visible = false;
        return;
      }
      s.life -= dt * 1.1;
      s.pos.addScaledVector(s.dir, s.speed * dt);
      m.visible = true;
      m.position.copy(s.pos);
      m.quaternion.copy(camera.quaternion);
      m.rotateZ(Math.atan2(s.dir.y, s.dir.x));
      m.scale.set(6 * Math.min(1, (1 - s.life) * 4), 3, 1);
    });
  });

  return (
    <group>
      {stars.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => void (meshes.current[i] = el)}
          geometry={geometry}
          material={material}
          visible={false}
          renderOrder={-5}
        />
      ))}
    </group>
  );
}
