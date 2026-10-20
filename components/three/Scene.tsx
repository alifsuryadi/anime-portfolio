"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { ScrollTrigger } from "@/lib/gsap";
import { bus } from "@/lib/scroll-state";
import { qualitySettings, type Quality } from "@/lib/quality";
import { useQuality } from "@/components/QualityProvider";
import { world } from "./choreo";
import { CameraRig } from "./CameraRig";
import { Lights } from "./Lights";
import { Sky } from "./Sky";
import { Skyline } from "./Skyline";
import { Rooftop } from "./Rooftop";
import { Torii } from "./Torii";
import { Character } from "./Character";
import { SakuraField } from "./SakuraField";
import { SkillOrbs } from "./SkillOrbs";
import { ShootingStars } from "./ShootingStars";
import { Effects } from "./Effects";

/** Pauses rendering when the tab is hidden or the paper (projects) page fully covers the canvas. */
function FrameGate() {
  const setFrameloop = useThree((s) => s.setFrameloop);
  useEffect(() => {
    let covered = false;
    const apply = () => setFrameloop(document.hidden || covered ? "never" : "always");
    const el = document.getElementById("projects");
    const st = el
      ? ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          onToggle: (self) => {
            covered = self.isActive;
            apply();
          },
        })
      : null;
    document.addEventListener("visibilitychange", apply);
    return () => {
      st?.kill();
      document.removeEventListener("visibilitychange", apply);
      setFrameloop("always");
    };
  }, [setFrameloop]);
  return null;
}

function ReadySignal() {
  const sent = useRef(false);
  useFrame(() => {
    if (sent.current) return;
    sent.current = true;
    requestAnimationFrame(() => bus.emit("scene-ready"));
  });
  return null;
}

export default function Scene({ quality }: { quality: Exclude<Quality, "static"> }) {
  const { downgrade, chibi } = useQuality();
  const s = qualitySettings[quality];
  useEffect(() => {
    world.chibi = chibi;
  }, [chibi]);

  return (
    <div aria-hidden="true" className="fixed inset-0 z-0">
      <Canvas
        dpr={s.dpr}
        gl={{
          antialias: quality === "high",
          powerPreference: "high-performance",
          alpha: false,
          stencil: false,
        }}
        camera={{ fov: 32, near: 0.1, far: 200, position: [0, 0.15, 5.4] }}
        flat={false}
      >
        <color attach="background" args={["#0B0B14"]} />
        <PerformanceMonitor onDecline={downgrade} flipflops={2} />
        <FrameGate />
        <ReadySignal />
        <CameraRig />
        <Lights />
        <Sky />
        <Skyline count={quality === "high" ? 160 : 90} />
        <Rooftop />
        <Torii />
        <Character />
        <SakuraField count={s.petals} />
        {s.orbs && <SkillOrbs />}
        <ShootingStars />
        {s.post && <Effects />}
      </Canvas>
    </div>
  );
}
