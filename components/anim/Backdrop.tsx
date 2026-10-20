"use client";

import { useRef } from "react";
import { useMotion } from "@/components/QualityProvider";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

/** Giant Japanese word behind a section that drifts with scroll (parallax). */
export function Backdrop({ word, className = "" }: { word: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const motion = useMotion();

  useGSAP(
    () => {
      // Off in Static mode: navbar toggle, reduced motion or no GPU.
      if (!motion) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ref.current,
          { yPercent: 25, xPercent: -6 },
          {
            yPercent: -25,
            xPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: ref.current?.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [motion], revertOnUpdate: true },
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      lang="ja"
      data-word={word}
      // Rendered via ::before so the decorative glyphs never become the LCP element.
      className={`font-jp text-paper/[0.035] pointer-events-none absolute inset-x-0 top-1/4 -z-10 text-center text-[34vw] leading-none font-bold whitespace-nowrap select-none before:content-[attr(data-word)] ${className}`}
    />
  );
}
