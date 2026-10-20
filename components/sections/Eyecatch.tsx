"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { useMotion } from "@/components/QualityProvider";
import { useT } from "@/components/LangProvider";
import { ChibiArt } from "@/components/ui/ChibiArt";

/**
 * Anime "eyecatch": a one-screen mid-episode card between the journey and the
 * achievements. No new information, just a change of rhythm. Pinned and
 * scrubbed when motion is allowed; a still composition otherwise.
 */
export function Eyecatch() {
  const ref = useRef<HTMLDivElement>(null);
  const motion = useMotion();
  const t = useT();

  useGSAP(
    () => {
      if (!motion) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "+=100%",
            pin: true,
            scrub: 0.6,
          },
        });
        tl.fromTo(
          "[data-ec-lines]",
          { scale: 1.6, rotate: -20, opacity: 0 },
          { scale: 1, rotate: 0, opacity: 1, duration: 1 },
          0,
        )
          .fromTo("[data-ec-band='a']", { xPercent: -35 }, { xPercent: 0, duration: 2 }, 0)
          .fromTo("[data-ec-band='b']", { xPercent: 0 }, { xPercent: -35, duration: 2 }, 0)
          .fromTo(
            "[data-ec-char]",
            { yPercent: 120, rotate: -25, scale: 0.6 },
            { yPercent: 0, rotate: 0, scale: 1, duration: 0.9, ease: "back.out(2)" },
            0.15,
          )
          .fromTo(
            "[data-ec-kana]",
            { yPercent: 60, opacity: 0, skewY: 10 },
            { yPercent: 0, opacity: 1, skewY: 0, stagger: 0.15, duration: 0.6, ease: "expo.out" },
            0.3,
          )
          .fromTo(
            "[data-ec-next]",
            { xPercent: 40, opacity: 0 },
            { xPercent: 0, opacity: 1, duration: 0.6 },
            0.9,
          )
          .to("[data-ec-char]", { y: -30, rotate: 6, duration: 0.5, yoyo: true, repeat: 1 }, 1.2);
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [motion], revertOnUpdate: true },
  );

  const band = (dir: "a" | "b") => (
    <div
      data-ec-band={dir}
      aria-hidden="true"
      className={`font-display flex w-[220%] gap-10 py-3 text-3xl whitespace-nowrap md:text-5xl ${
        dir === "a" ? "bg-ink text-paper -rotate-3" : "bg-paper text-ink rotate-2"
      }`}
    >
      {Array.from({ length: 8 }, (_, i) => (
        <span key={i}>
          TO BE CONTINUED <span className="text-sakura">✦</span> つづく{" "}
          <span className="text-sakura">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      ref={ref}
      data-covers-canvas
      className="bg-sakura text-ink relative z-10 flex h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* speed lines + halftone */}
      <div
        data-ec-lines
        aria-hidden="true"
        className="absolute -inset-[30%]"
        style={{
          background:
            "repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg 3deg, rgb(11 11 20 / 0.22) 3deg 3.6deg, transparent 3.6deg 7deg)",
          maskImage: "radial-gradient(circle at center, transparent 18%, black 65%)",
        }}
      />
      <div aria-hidden="true" className="halftone text-ink/15 absolute inset-0" />

      <div className="absolute inset-x-0 top-[12%]">{band("a")}</div>
      <div className="absolute inset-x-0 bottom-[10%]">{band("b")}</div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-4 px-4 text-center md:flex-row md:gap-16 md:text-left">
        <div data-ec-char aria-hidden="true" className="h-[24svh] max-h-80 shrink-0 md:h-[46svh]">
          <ChibiArt
            pose="cheer"
            happy
            className="h-full w-auto drop-shadow-[8px_8px_0_var(--ink)]"
          />
        </div>
        <div>
          <p
            lang="ja"
            aria-hidden="true"
            className="font-jp flex justify-center text-[24vw] leading-none font-bold md:justify-start md:text-[11rem]"
            style={{ WebkitTextStroke: "3px var(--ink)", color: "var(--paper)" }}
          >
            {Array.from("つづく").map((ch, i) => (
              <span key={i} data-ec-kana className="inline-block">
                {ch}
              </span>
            ))}
          </p>
          <p className="font-display mt-2 text-2xl md:text-4xl">{t("eyecatchTbc")}</p>
          <p
            data-ec-next
            className="bg-ink text-paper mt-6 inline-flex max-w-full flex-wrap items-center justify-center gap-x-3 px-4 py-2 text-sm font-bold"
          >
            <span lang="ja" aria-hidden="true" className="font-jp text-sakura">
              次回予告
            </span>
            <span>
              {t("eyecatchNext")}: {t("achTitleA")} {t("achTitleB")}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
