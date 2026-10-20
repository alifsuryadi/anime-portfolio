"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

type Stat = { label: string; jp: string; value: number };

/** RPG stat bars that charge up when the card enters the viewport. */
export function StatBars({ stats }: { stats: readonly Stat[] }) {
  const ref = useRef<HTMLDListElement>(null);

  useGSAP(
    () => {
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
    { scope: ref },
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
            <span className="relative h-2.5 flex-1 -skew-x-12 overflow-hidden bg-ink/80 ring-1 ring-line">
              <span
                data-bar
                className="absolute inset-y-0 left-0 origin-left bg-[linear-gradient(90deg,var(--sakura),var(--sunset))]"
                style={{ width: `${s.value}%` }}
              />
            </span>
            <span className="w-8 text-right font-display text-xs tabular-nums">{s.value}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
