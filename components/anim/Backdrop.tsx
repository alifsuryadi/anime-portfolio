"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

/** Giant Japanese word behind a section that drifts with scroll (parallax). */
export function Backdrop({ word, className = "" }: { word: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ref.current,
          { yPercent: 25, xPercent: -6 },
          {
            yPercent: -25,
            xPercent: 6,
            ease: "none",
            scrollTrigger: { trigger: ref.current?.parentElement, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      lang="ja"
      className={`pointer-events-none absolute inset-x-0 top-1/4 -z-10 text-center font-jp text-[34vw] leading-none font-bold whitespace-nowrap text-paper/[0.035] select-none ${className}`}
    >
      {word}
    </div>
  );
}
