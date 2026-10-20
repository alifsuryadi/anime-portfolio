"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BackSide, Mesh, ShaderMaterial } from "three";
import { noiseGLSL, skyPaletteGLSL } from "./glsl";
import { world } from "./choreo";

/** Animated dusk sky: gradient, setting sun with stripes, fbm clouds, stars and moon at night. */
export function Sky() {
  const mesh = useRef<Mesh>(null);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        side: BackSide,
        depthWrite: false,
        uniforms: { uTime: { value: 0 }, uNight: { value: 0 } },
        vertexShader: /* glsl */ `
          varying vec3 vDir;
          void main(){
            vDir = normalize(position);
            vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            gl_Position = p.xyww;
          }`,
        fragmentShader: /* glsl */ `
          uniform float uTime; uniform float uNight;
          varying vec3 vDir;
          ${noiseGLSL}
          ${skyPaletteGLSL}
          void main(){
            vec3 d = normalize(vDir);
            float h = d.y;
            vec3 col = mix(horizonColor(uNight), midColor(uNight), smoothstep(-0.02, 0.28, h));
            col = mix(col, zenithColor(uNight), smoothstep(0.22, 0.8, h));
            col = mix(col, vec3(0.03,0.02,0.07), smoothstep(0.0, -0.2, h));

            // Setting sun with retro stripes, sinking as night falls.
            vec3 sunDir = normalize(vec3(0.15, mix(0.09, -0.18, uNight), -1.0));
            float sd = dot(d, sunDir);
            float disk = smoothstep(0.9965, 0.9975, sd);
            float stripes = step(0.5, fract((d.y - sunDir.y) * 140.0 + uTime * 0.25)) + step(sunDir.y + 0.012, d.y);
            disk *= clamp(stripes, 0.0, 1.0);
            vec3 sunCol = mix(vec3(1.0, 0.86, 0.45), vec3(1.0, 0.43, 0.65), smoothstep(sunDir.y + 0.05, sunDir.y - 0.05, d.y));
            col += sunCol * disk * 1.6;
            col += vec3(1.0, 0.45, 0.3) * pow(max(sd, 0.0), 24.0) * 0.55 * (1.0 - uNight);

            // Clouds: projected onto a plane, thick near the horizon.
            vec2 uv = d.xz / (h + 0.18);
            float n = fbm(uv * 1.3 + vec2(uTime * 0.012, 0.0));
            float band = smoothstep(0.02, 0.12, h) * smoothstep(0.55, 0.15, h);
            float cloud = smoothstep(0.52, 0.78, n) * band;
            vec3 lit = mix(vec3(1.0, 0.55, 0.62), vec3(0.22, 0.12, 0.36), uNight);
            vec3 rim = mix(vec3(1.0, 0.8, 0.5), vec3(0.4, 0.95, 1.0), uNight) * pow(max(sd, 0.0), 6.0);
            col = mix(col, lit + rim * 0.4, cloud * 0.85);

            // Stars and moon.
            vec3 cell = floor(d * 180.0);
            vec2 sg = vec2(cell.x + cell.z * 13.7, cell.y - cell.z * 7.3);
            float star = step(0.9965, hash12(sg)) * smoothstep(0.08, 0.35, h);
            float tw = 0.6 + 0.4 * sin(uTime * 3.0 + hash12(sg + 7.0) * 30.0);
            col += vec3(0.9, 0.95, 1.0) * star * tw * smoothstep(0.25, 0.9, uNight) * (1.0 - cloud);
            vec3 moonDir = normalize(vec3(-0.32, 0.3, -1.0));
            float md = dot(d, moonDir);
            col += vec3(0.85, 0.97, 1.0) * smoothstep(0.9988, 0.9992, md) * smoothstep(0.3, 0.8, uNight);
            col += vec3(0.25, 0.9, 1.0) * pow(max(md, 0.0), 120.0) * 0.35 * uNight;

            gl_FragColor = vec4(col, 1.0);
          }`,
      }),
    [],
  );

  useFrame(({ camera }, dt) => {
    mesh.current?.position.copy(camera.position);
    material.uniforms.uTime.value += dt;
    material.uniforms.uNight.value = world.night;
  });

  return (
    <mesh ref={mesh} material={material} frustumCulled={false} renderOrder={-10}>
      <sphereGeometry args={[90, 48, 24]} />
    </mesh>
  );
}
