"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
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
function FrameGate({ pathname }: { pathname: string }) {
  const setFrameloop = useThree((s) => s.setFrameloop);
  // Pause while an opaque full-screen section ([data-covers-canvas]) fills the
  // viewport. The canvas outlives client navigations, so re-bind on every route.
  useEffect(() => {
    const active = new Set<Element>();
    const triggers: ScrollTrigger[] = [];
    const apply = () => setFrameloop(document.hidden || active.size > 0 ? "never" : "always");
    apply();
    const raf = requestAnimationFrame(() => {
      document.querySelectorAll("[data-covers-canvas]").forEach((el) => {
        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: "top top",
            end: "bottom bottom",
            onToggle: (self) => {
              if (self.isActive) active.add(el);
              else active.delete(el);
              apply();
            },
          }),
        );
      });
    });
    document.addEventListener("visibilitychange", apply);
    return () => {
      cancelAnimationFrame(raf);
      triggers.forEach((t) => t.kill());
      document.removeEventListener("visibilitychange", apply);
      setFrameloop("always");
    };
  }, [setFrameloop, pathname]);
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
  const pathname = usePathname();
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
        <FrameGate pathname={pathname} />
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
