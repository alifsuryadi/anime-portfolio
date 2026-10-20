"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, DirectionalLight, HemisphereLight } from "three";
import { world } from "./choreo";

const duskSky = new Color("#ffb3c7");
const nightSky = new Color("#6c7bd9");
const duskKey = new Color("#ff9a5a");
const nightKey = new Color("#7af6ff");

/** Sunset key light from behind, cool fill from the front; both shift as night falls. */
export function Lights() {
  const hemi = useRef<HemisphereLight>(null);
  const key = useRef<DirectionalLight>(null);
  const fill = useRef<DirectionalLight>(null);

  useFrame(() => {
    const n = world.night;
    if (hemi.current) {
      hemi.current.color.copy(duskSky).lerp(nightSky, n);
      hemi.current.intensity = 1.6 - n * 0.6;
    }
    if (key.current) {
      key.current.color.copy(duskKey).lerp(nightKey, n);
      key.current.intensity = 2.6 - n * 1.2;
    }
    if (fill.current) fill.current.intensity = 1.5 - n * 0.4;
  });

  return (
    <>
      <hemisphereLight ref={hemi} args={["#ffb3c7", "#2a1240", 1.6]} />
      <directionalLight ref={key} position={[-4, 3, -6]} intensity={2.6} />
      <directionalLight ref={fill} position={[3, 4, 6]} intensity={1.5} color="#fff1f5" />
    </>
  );
}
