"use client";

import { useRef } from "react";
import { useMotion } from "@/components/QualityProvider";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { bus } from "@/lib/scroll-state";

type Props = { text: string; className?: string; letterClassName?: string };

/**
 * Splits a word into letters that slam in after the loader and hop when the
 * pointer touches them. Screen readers get the whole word once.
 */
export function SplitText({ text, className, letterClassName = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const motion = useMotion();

  useGSAP(
    () => {
      // Off in Static mode: navbar toggle, reduced motion or no GPU.
      if (!motion) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const letters = ref.current?.querySelectorAll("[data-letter]");
        if (!letters?.length) return;
        const tl = gsap.timeline({ paused: true });
        tl.from(letters, {
          yPercent: 120,
          skewY: 12,
          rotate: () => gsap.utils.random(-12, 12),
          opacity: 0,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.045,
        });
        const off = bus.on("loader-done", () => tl.play());
        if (document.documentElement.dataset.loaded === "true") tl.play();
        return () => off();
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [motion], revertOnUpdate: true },
  );

  const hop = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (!motion) return;
    gsap.fromTo(
      e.currentTarget,
      { y: 0 },
      {
        y: -18,
        rotate: gsap.utils.random(-8, 8),
        duration: 0.18,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      },
    );
  };

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      {Array.from(text).map((ch, i) =>
        ch === " " ? (
          <span key={i} aria-hidden="true">
            {" "}
          </span>
        ) : (
          <span
            key={i}
            aria-hidden="true"
            className="inline-block overflow-hidden pb-[0.08em] align-bottom"
          >
            <span data-letter className={`inline-block ${letterClassName}`} onPointerEnter={hop}>
              {ch}
            </span>
          </span>
        ),
      )}
    </span>
  );
}
