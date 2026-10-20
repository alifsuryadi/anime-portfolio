"use client";

import { useRef } from "react";
import { useMotion } from "@/components/QualityProvider";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

type Stat = { label: string; jp: string; value: number };

/** RPG stat bars that charge up when the card enters the viewport. */
export function StatBars({ stats }: { stats: readonly Stat[] }) {
  const ref = useRef<HTMLDListElement>(null);
  const motion = useMotion();

  useGSAP(
    () => {
      // Off in Static mode: navbar toggle, reduced motion or no GPU.
      if (!motion) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-bar]", {
          scaleX: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ref.current, start: "top 85%" },
        });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [motion], revertOnUpdate: true },
  );

  return (
    <dl ref={ref} className="space-y-2.5">
      {stats.map((s) => (
        <div key={s.label}>
          <dt className="flex items-baseline justify-between text-xs font-semibold">
            <span>
              {s.label}{" "}
              <span lang="ja" aria-hidden="true" className="font-jp text-muted">
                {s.jp}
              </span>
            </span>
          </dt>
          <dd className="mt-1 flex items-center gap-2">
            <span className="bg-ink/80 ring-line relative h-2.5 flex-1 -skew-x-12 overflow-hidden ring-1">
              <span
                data-bar
                className="absolute inset-y-0 left-0 origin-left bg-[linear-gradient(90deg,var(--sakura),var(--sunset))]"
                style={{ width: `${s.value}%` }}
              />
            </span>
            <span className="font-display w-8 text-right text-xs tabular-nums">{s.value}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
