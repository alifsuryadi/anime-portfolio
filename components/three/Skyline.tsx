"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { InstancedMesh, Object3D, ShaderMaterial } from "three";
import { noiseGLSL, skyPaletteGLSL } from "./glsl";
import { world } from "./choreo";

/** Seeded RNG so the city is identical on every visit. */
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

/** Neo-Tokyo skyline: instanced towers with a procedural neon-window shader and distance fog. */
export function Skyline({ count = 140 }: { count?: number }) {
  const ref = useRef<InstancedMesh>(null);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uNight: { value: 0 } },
        vertexShader: /* glsl */ `
          varying vec3 vLocal; varying vec3 vNormal2; varying vec3 vWorld; varying float vId;
          void main(){
            vec3 s = vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
            vLocal = (position + vec3(0.0, 0.5, 0.0)) * s;
            vNormal2 = normal;
            vId = float(gl_InstanceID);
            vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0);
            vWorld = w.xyz;
            gl_Position = projectionMatrix * viewMatrix * w;
          }`,
        fragmentShader: /* glsl */ `
          uniform float uTime; uniform float uNight;
          varying vec3 vLocal; varying vec3 vNormal2; varying vec3 vWorld; varying float vId;
          ${noiseGLSL}
          ${skyPaletteGLSL}
          void main(){
            vec3 base = mix(vec3(0.10, 0.06, 0.16), vec3(0.035, 0.03, 0.07), uNight);
            float side = abs(vNormal2.x) > 0.5 ? vLocal.z : vLocal.x;
            vec2 cell = vec2(floor(side * 2.2), floor(vLocal.y * 2.6));
            vec2 f = fract(vec2(side * 2.2, vLocal.y * 2.6));
            float win = step(0.18, f.x) * step(f.x, 0.82) * step(0.25, f.y) * step(f.y, 0.75);
            float r = hash12(vec2(floor(cell.x / 2.0), cell.y) + vId * 17.31);
            float r2 = hash12(cell + vId * 3.7);
            float lit = step(mix(0.86, 0.72, uNight), r) * step(0.25, r2) * win * (abs(vNormal2.y) < 0.5 ? 1.0 : 0.0);
            float flick = 0.75 + 0.25 * sin(uTime * (1.0 + r * 3.0) + r * 40.0);
            vec3 neon = r > 0.95 ? vec3(1.0, 0.44, 0.65) : r > 0.9 ? vec3(0.23, 0.96, 0.98) : vec3(1.0, 0.78, 0.5);
            vec3 col = base + neon * lit * flick * 0.95;
            // Rim light from the sunset.
            col += horizonColor(uNight) * 0.18 * smoothstep(-10.0, 4.0, vWorld.y) * (1.0 - uNight * 0.6);
            float dist = length(vWorld.xz);
            float fog = smoothstep(24.0, 80.0, dist);
            col = mix(col, horizonColor(uNight) * 0.55 + midColor(uNight) * 0.25, fog * 0.85);
            gl_FragColor = vec4(col, 1.0);
          }`,
      }),
    [],
  );

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const r = rng(42);
    const o = new Object3D();
    for (let i = 0; i < count; i++) {
      // Rings of towers around the rooftop, denser behind it (-z).
      const ring = i < count * 0.45 ? 0 : i < count * 0.8 ? 1 : 2;
      const radius = [30, 46, 66][ring] + r() * 10;
      const ang = (r() * 2 - 1) * Math.PI * 0.85;
      const x = Math.sin(ang) * radius;
      const z = -Math.cos(ang) * radius - 4;
      const w = 2 + r() * 4;
      const d = 2 + r() * 4;
      const h = 6 + r() * (ring === 0 ? 12 : ring === 1 ? 20 : 30);
      o.position.set(x, -16 + h / 2, z);
      o.rotation.set(0, r() * Math.PI, 0);
      o.scale.set(w, h, d);
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [count]);

  useEffect(() => () => material.dispose(), [material]);

  useFrame((_, dt) => {
    material.uniforms.uTime.value += dt;
    material.uniforms.uNight.value = world.night;
  });

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, count]}
      material={material}
      frustumCulled={false}
    >
      <boxGeometry args={[1, 1, 1]} />
    </instancedMesh>
  );
}
