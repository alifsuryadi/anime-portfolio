"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { bus, scrollState } from "@/lib/scroll-state";
import { useMotion } from "@/components/QualityProvider";
import type { SceneId } from "@/lib/scenes.config";
import { EyeCutIn } from "@/components/ui/EyeCutIn";

/**
 * Anime-style cut between sections: a speed-line burst with a short white
 * flash and, every few seconds at most, a cut-in strip of the character's
 * eyes; or a manga panel wipe when entering the paper (projects) page.
 */
const CUT_GAP = 3500;
export function SectionTransition() {
  const motion = useMotion();
  const lines = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const wipe = useRef<HTMLDivElement>(null);
  const cut = useRef<HTMLDivElement>(null);
  const eyes = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!motion) return;
    let lastAt = 0;
    let lastCut = -CUT_GAP;
    return bus.on("section", (detail) => {
      const { from, to } = detail as { from: SceneId | null; to: SceneId };
      if (!from) return;
      const now = performance.now();
      if (now - lastAt < 700) return;
      lastAt = now;
      const fast = scrollState.energy > 0.35;
      // Paper pages (manga panels, gacha cards) get a page-wipe instead of speed lines.
      const paper = (id: SceneId | null) => id === "projects" || id === "achievements";
      if (paper(to) || paper(from)) {
        const dir = paper(to) ? 1 : -1;
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
      // Eye cut-in: the strip snaps open from the leading edge, the "camera"
      // drifts across her eyes, then it snaps shut the other way.
      if (now - lastCut > CUT_GAP) {
        lastCut = now;
        const dir = scrollState.velocity < 0 ? -1 : 1;
        const open = dir > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";
        const shut = dir > 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";
        gsap
          .timeline()
          .set(cut.current, { opacity: 1, clipPath: open })
          .to(cut.current, { clipPath: "inset(0 0 0 0)", duration: 0.16, ease: "power3.out" })
          .to(cut.current, { clipPath: shut, duration: 0.2, ease: "power3.in" }, "+=0.34")
          .set(cut.current, { opacity: 0 });
        gsap.fromTo(
          eyes.current,
          { xPercent: 3 * dir },
          { xPercent: -3 * dir, duration: 0.7, ease: "none" },
        );
      }
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
      <div
        ref={cut}
        className="border-paper absolute inset-x-0 top-[32%] h-[24svh] min-h-28 -skew-y-3 overflow-hidden border-y-4 opacity-0 shadow-[0_10px_0_var(--sakura)]"
      >
        <div ref={eyes} className="absolute -inset-x-[6%] inset-y-0">
          <EyeCutIn className="h-full w-full" />
        </div>
        <div className="cutin-lines absolute inset-0" />
      </div>
      <div ref={wipe} className="bg-paper absolute inset-y-0 -left-[10%] w-[120%] opacity-0">
        <div className="halftone text-ink/15 absolute inset-0" />
        <div className="bg-ink absolute inset-y-0 left-0 w-3" />
        <div className="bg-ink absolute inset-y-0 right-0 w-3" />
      </div>
    </div>
  );
}
