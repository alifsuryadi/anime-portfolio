"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { useMotion } from "@/components/QualityProvider";
import { useT } from "@/components/LangProvider";

type Cert = { name: string; issuer: string; date: string };
type Rarity = "SSR" | "SR" | "R";

/** Rarity by recency, so it's playful without ranking issuers. */
const rarityOf = (date: string): Rarity =>
  date.includes("2025") ? "SSR" : date.includes("2024") ? "SR" : "R";
const RARITY: Record<Rarity, { color: string; stars: number }> = {
  SSR: { color: "var(--sunset)", stars: 3 },
  SR: { color: "var(--sakura)", stars: 2 },
  R: { color: "var(--neon-cyan)", stars: 1 },
};

/**
 * Certifications as gacha cards: dealt in when the deck scrolls into view and
 * flipped by click / Enter / Space. Every card's text is always available to
 * screen readers; the flip is visual only. Without JS the cards show face up.
 */
export function GachaDeck({ certs }: { certs: readonly Cert[] }) {
  const t = useT();
  const motion = useMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<boolean[]>(() => certs.map(() => false));
  const allOpen = open.every(Boolean);

  useGSAP(
    () => {
      if (!motion) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-card]", {
          y: 120,
          x: (i) => (i % 2 ? 60 : -60),
          rotate: (i) => (i % 2 ? 14 : -14),
          opacity: 0,
          duration: 0.7,
          ease: "back.out(1.6)",
          stagger: 0.07,
          scrollTrigger: { trigger: ref.current, start: "top 80%" },
        });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [motion], revertOnUpdate: true },
  );

  const flip = (i: number) => setOpen((o) => o.map((v, j) => (j === i ? !v : v)));

  return (
    <div ref={ref}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-md text-sm font-medium">{t("gachaHint")}</p>
        <button
          type="button"
          onClick={() => setOpen(certs.map(() => !allOpen))}
          className="border-ink bg-ink text-paper hover:bg-sakura hover:text-ink border-2 px-4 py-2 text-sm font-bold transition-colors"
          data-magnetic
        >
          {allOpen ? t("shuffleBack") : t("revealAll")}
        </button>
      </div>

      <ul className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-5">
        {certs.map((c, i) => {
          const r = rarityOf(c.date);
          const { color, stars } = RARITY[r];
          const isOpen = open[i];
          return (
            <li
              key={c.name}
              data-card
              className="w-[46vw] shrink-0 snap-center sm:w-auto"
              style={{ perspective: 900 }}
            >
              <button
                type="button"
                aria-pressed={isOpen}
                onClick={() => flip(i)}
                className="gacha-card group relative block aspect-[3/4] w-full text-left"
                data-open={isOpen}
              >
                <span className="sr-only">
                  {r}: {c.name}, {c.issuer}, {c.date}
                </span>
                <span aria-hidden="true" className="gacha-inner absolute inset-0">
                  {/* back of the card */}
                  <span
                    data-face="back"
                    className="gacha-face border-ink bg-night text-paper absolute inset-0 grid place-items-center overflow-hidden border-[3px] shadow-[5px_5px_0_var(--ink)]"
                  >
                    <span className="halftone absolute inset-0" style={{ color, opacity: 0.25 }} />
                    <span
                      className="absolute inset-3 border-2"
                      style={{ borderColor: color, boxShadow: `inset 0 0 18px ${color}` }}
                    />
                    <span className="relative flex flex-col items-center gap-1">
                      <span lang="ja" className="font-jp text-4xl font-bold" style={{ color }}>
                        勲
                      </span>
                      <span className="font-display text-xs tracking-[0.3em]">TAP</span>
                    </span>
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  </span>
                  {/* front of the card */}
                  <span
                    data-face="front"
                    className="gacha-face gacha-front border-ink bg-paper text-ink absolute inset-0 flex flex-col border-[3px] p-3 shadow-[5px_5px_0_var(--ink)]"
                  >
                    <span className="flex items-center justify-between">
                      <span
                        className="font-display text-ink px-1.5 text-xs"
                        style={{ background: color }}
                      >
                        {r}
                      </span>
                      <span className="text-xs" style={{ color }}>
                        {"★".repeat(stars)}
                      </span>
                    </span>
                    <span
                      className="halftone my-2 grid flex-1 place-items-center"
                      style={{ color: "rgb(11 11 20 / 0.12)" }}
                    >
                      <span className="font-display text-ink text-center text-sm leading-tight md:text-base">
                        {c.name}
                      </span>
                    </span>
                    <span className="border-ink border-t pt-1.5 text-[0.7rem] leading-tight">
                      <span className="block font-bold">{c.issuer}</span>
                      <span className="text-ink/70">{c.date}</span>
                    </span>
                    {r === "SSR" && (
                      <span className="gacha-shine pointer-events-none absolute inset-0" />
                    )}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
