"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import type { Station } from "@/content/experience";

const LINE = ["var(--sakura)", "var(--neon-cyan)", "var(--sunset)", "#B48CFF", "var(--paper)"];

/**
 * Tokyo rail line: stations are timeline entries, and a little train rides
 * the track with scroll progress, lighting up each station it reaches.
 */
export function Timeline({ stations }: { stations: Station[] }) {
  const ref = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const list = ref.current!;
        gsap.fromTo(
          "[data-train]",
          { top: "0%" },
          {
            top: "100%",
            ease: "none",
            scrollTrigger: { trigger: list, start: "top 60%", end: "bottom 60%", scrub: 0.4 },
          },
        );
        gsap.fromTo(
          "[data-rail-fill]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: list, start: "top 60%", end: "bottom 60%", scrub: 0.4 },
          },
        );
        gsap.utils.toArray<HTMLElement>("[data-station]").forEach((st) => {
          gsap.from(st.querySelector("[data-card]"), {
            x: 60,
            opacity: 0,
            duration: 0.8,
            ease: "expo.out",
            scrollTrigger: { trigger: st, start: "top 75%" },
          });
          gsap.to(st, {
            scrollTrigger: {
              trigger: st,
              start: "top 60%",
              toggleClass: { targets: st, className: "is-reached" },
            },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <ol ref={ref} className="relative ml-4 border-l-0 md:ml-10">
      {/* rails + sleepers */}
      <span
        aria-hidden="true"
        className="absolute top-0 bottom-0 -left-[9px] w-[18px]"
        style={{
          background:
            "linear-gradient(90deg, var(--muted) 0 2px, transparent 2px calc(100% - 2px), var(--muted) calc(100% - 2px)), repeating-linear-gradient(180deg, rgb(185 177 201 / 0.35) 0 4px, transparent 4px 18px)",
        }}
      />
      <span
        aria-hidden="true"
        data-rail-fill
        className="bg-sakura absolute top-0 bottom-0 -left-[2px] w-1 origin-top shadow-[0_0_12px_var(--sakura)]"
      />
      {/* the train */}
      <span aria-hidden="true" data-train className="absolute -left-[17px] z-10 -translate-y-1/2">
        <svg viewBox="0 0 34 46" className="h-11 w-8">
          <rect
            x="3"
            y="2"
            width="28"
            height="38"
            rx="9"
            fill="var(--paper)"
            stroke="var(--ink)"
            strokeWidth="2"
          />
          <rect x="7" y="7" width="20" height="11" rx="3" fill="var(--night)" />
          <rect x="3" y="24" width="28" height="4" fill="var(--sakura)" />
          <circle cx="10" cy="34" r="2.5" fill="var(--neon-cyan)" />
          <circle cx="24" cy="34" r="2.5" fill="var(--neon-cyan)" />
        </svg>
      </span>

      {stations.map((s, i) => {
        const color = LINE[i % LINE.length];
        return (
          <li key={s.id} data-station className="group relative pb-16 pl-10 last:pb-0 md:pl-16">
            <span
              aria-hidden="true"
              className="bg-ink font-display absolute top-1 -left-[15px] grid size-[30px] place-items-center rounded-full border-4 text-[0.6rem] transition-all duration-500 group-[.is-reached]:scale-110"
              style={{ borderColor: color, boxShadow: `0 0 0 0 ${color}` }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div data-card className="max-w-2xl">
              <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span lang="ja" className="font-jp text-xl font-bold" style={{ color }}>
                  {s.stationJa}
                </span>
                <span className="text-muted text-xs tracking-[0.25em] uppercase">
                  {s.station} station
                </span>
              </p>
              <div
                className="bg-ink/75 mt-3 border-l-4 p-5 backdrop-blur-sm transition-transform duration-300 group-hover:translate-x-1"
                style={{ borderColor: color }}
              >
                <h3 className="font-display text-xl md:text-2xl">{s.title}</h3>
                <p className="text-cyan mt-1 text-sm">
                  {s.org}
                  {s.period ? <span className="text-muted"> · {s.period}</span> : null}
                </p>
                <ul className="text-paper/90 mt-3 list-none space-y-1.5">
                  {s.points.map((pt) => (
                    <li
                      key={pt}
                      className="before:bg-sakura relative pl-5 before:absolute before:top-[0.6em] before:left-0 before:size-2 before:rotate-45"
                    >
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
