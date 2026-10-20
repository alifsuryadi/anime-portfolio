"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction, type ChromaticAberrationEffect } from "postprocessing";
import { Vector2 } from "three";
import { scrollState } from "@/lib/scroll-state";

const offset = new Vector2(0.0005, 0.0005);

/** Bloom for neon, chromatic aberration that grows with scroll speed, vignette and a little grain. */
export function Effects() {
  const ca = useRef<ChromaticAberrationEffect>(null);

  useFrame(() => {
    const o = 0.0004 + scrollState.energy * 0.0045;
    ca.current?.offset.set(o, o * 0.6);
  });

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        mipmapBlur
        intensity={0.85}
        luminanceThreshold={0.62}
        luminanceSmoothing={0.25}
        radius={0.7}
      />
      <ChromaticAberration ref={ca} offset={offset} radialModulation={false} modulationOffset={0} />
      <Vignette offset={0.32} darkness={0.62} />
      <Noise premultiply blendFunction={BlendFunction.SCREEN} opacity={0.06} />
    </EffectComposer>
  );
}
