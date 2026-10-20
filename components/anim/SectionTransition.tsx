"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { bus, scrollState } from "@/lib/scroll-state";
import { useMotion } from "@/components/QualityProvider";
import type { SceneId } from "@/lib/scenes.config";

/**
 * Anime-style cut between sections: a speed-line burst with a short white
 * flash, or a manga panel wipe when entering the paper (projects) page.
 */
export function SectionTransition() {
  const motion = useMotion();
  const lines = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const wipe = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!motion) return;
    let lastAt = 0;
    return bus.on("section", (detail) => {
      const { from, to } = detail as { from: SceneId | null; to: SceneId };
      if (!from) return;
      const now = performance.now();
      if (now - lastAt < 700) return;
      lastAt = now;
      const fast = scrollState.energy > 0.35;
      if (to === "projects" || from === "projects") {
        const dir = to === "projects" ? 1 : -1;
        gsap.fromTo(
          wipe.current,
          { xPercent: -110 * dir, skewX: -12, opacity: 1 },
          {
            xPercent: 110 * dir,
            duration: 0.7,
            ease: "power4.inOut",
            onComplete: () => void gsap.set(wipe.current, { opacity: 0 }),
          },
        );
        return;
      }
      gsap
        .timeline()
        .fromTo(
          lines.current,
          { opacity: 0, scale: 1.4 },
          { opacity: fast ? 0.55 : 0.32, scale: 1, duration: 0.18, ease: "power2.out" },
        )
        .to(lines.current, { opacity: 0, scale: 0.9, duration: 0.45, ease: "power2.in" });
      if (fast) {
        gsap.fromTo(
          flash.current,
          { opacity: 0 },
          { opacity: 0.28, duration: 0.06, yoyo: true, repeat: 1, ease: "none" },
        );
      }
    });
  }, [motion]);

  if (!motion) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
      <div ref={lines} className="speedlines absolute -inset-[20%] opacity-0" />
      <div ref={flash} className="absolute inset-0 bg-white opacity-0" />
      <div ref={wipe} className="bg-paper absolute inset-y-0 -left-[10%] w-[120%] opacity-0">
        <div className="halftone text-ink/15 absolute inset-0" />
        <div className="bg-ink absolute inset-y-0 left-0 w-3" />
        <div className="bg-ink absolute inset-y-0 right-0 w-3" />
      </div>
    </div>
  );
}
