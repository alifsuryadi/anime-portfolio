"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { bus } from "@/lib/scroll-state";
import { useQuality } from "@/components/QualityProvider";
import { ChibiArt } from "./ChibiArt";
import { useLang, useT } from "@/components/LangProvider";
import { profile } from "@/content/profile";
import { heroPhrases, sectionTitles } from "@/content/japanese-phrases";

const MAX_WAIT = 3200;
const OP_CARDS = ["name", "role", "episode"] as const;

/**
 * Rendered in the static HTML so it covers the first paint; a CSS failsafe
 * hides it if JS never runs. Progress = fonts + window load + 3D scene ready.
 *
 * Every load ends like an anime opening: three title cards on hard cuts (name,
 * role, episode title) before the panels part. Static mode skips them.
 */
export function LoadingScreen() {
  const { quality, setReady } = useQuality();
  const t = useT();
  const lang = useLang();
  // Progress is written straight to the DOM: no React re-render every frame.
  const barA = useRef<HTMLDivElement>(null);
  const barB = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const chibi = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    // Finish exactly once, even if the quality mode changes mid-load.
    if (quality === null || done.current) return;
    const flags = {
      fonts: false,
      load: document.readyState === "complete",
      scene: quality === "static",
    };
    let shown = 0;
    let raf = 0;
    let finished = false;
    const started = performance.now();

    document.fonts?.ready.then(() => (flags.fonts = true));
    const onLoad = () => (flags.load = true);
    window.addEventListener("load", onLoad);
    const offScene = bus.on("scene-ready", () => (flags.scene = true));

    const finish = () => {
      finished = true;
      done.current = true;
      document.documentElement.dataset.loaded = "true";
      setReady(true);
      const reduced = quality === "static";
      if (reduced) {
        gsap.to(root.current, { opacity: 0, duration: 0.3, onComplete: () => setGone(true) });
        bus.emit("loader-done");
        return;
      }
      const tl = gsap
        .timeline({ onComplete: () => setGone(true) })
        .fromTo(
          chibi.current,
          { xPercent: -260, rotate: -20, opacity: 1 },
          { xPercent: 0, rotate: 0, duration: 0.55, ease: "back.out(2.2)" },
        )
        .to(chibi.current, { y: -24, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" });
      {
        tl.set("[data-loader-content]", { opacity: 0 }, "+=0.1");
        for (const card of OP_CARDS) {
          const sel = `[data-op='${card}']`;
          // Hard cut in, a short push-in while it holds, hard cut out.
          tl.set(sel, { autoAlpha: 1 })
            .fromTo(
              `${sel} [data-op-in]`,
              { scale: 1.16 },
              { scale: 1, duration: 0.46, ease: "power3.out" },
            )
            .set(sel, { autoAlpha: 0 });
        }
      }
      tl.add(() => bus.emit("loader-done"))
        .to(
          "[data-loader-panel='top']",
          { yPercent: -100, duration: 0.7, ease: "power4.inOut" },
          "+=0.1",
        )
        .to(
          "[data-loader-panel='bottom']",
          { yPercent: 100, duration: 0.7, ease: "power4.inOut" },
          "<",
        )
        .to("[data-loader-content]", { opacity: 0, duration: 0.25 }, "<");
    };

    const paint = (v: number) => {
      if (barA.current) barA.current.style.width = `${v}%`;
      if (barB.current) barB.current.style.width = `${Math.max(0, v - 12)}%`;
      if (num.current) num.current.textContent = `${v}%`;
    };

    let last = started;
    const tick = () => {
      const now = performance.now();
      const elapsed = now - started;
      // Time-based easing, so slow devices (few fps) don't stretch the loader.
      const dt = Math.min(0.25, (now - last) / 1000);
      last = now;
      const target =
        elapsed > MAX_WAIT
          ? 100
          : (flags.fonts ? 35 : 10) + (flags.load ? 30 : 0) + (flags.scene ? 35 : 0);
      shown += (target - shown) * (1 - Math.exp(-dt * 8)) + dt * 9;
      shown = Math.min(shown, target, 100);
      paint(Math.round(shown));
      // Hard cap: never hold the page longer than MAX_WAIT + a short ramp.
      if ((shown >= 99.5 || elapsed > MAX_WAIT + 700) && !finished) {
        paint(100);
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
      offScene();
    };
  }, [quality, setReady]);

  if (gone) return null;

  return (
    <div ref={root} className="loader text-paper fixed inset-0 z-[100]" role="status">
      <span className="sr-only">{t("loading")}</span>
      <div data-loader-panel="top" className="bg-ink absolute inset-x-0 top-0 h-1/2" />
      <div data-loader-panel="bottom" className="bg-ink absolute inset-x-0 bottom-0 h-1/2">
        <div className="halftone text-night absolute inset-0" />
      </div>
      {/* Opening title cards (decorative; the hero repeats all of this as real text). */}
      <div aria-hidden="true">
        <div
          data-op="name"
          className="bg-ink invisible absolute inset-0 grid place-items-center overflow-hidden opacity-0"
        >
          <div data-op-in className="flex items-center gap-6 md:gap-10">
            <span lang="ja" className="vertical-jp text-sakura text-4xl font-bold md:text-6xl">
              {profile.nameJa}
            </span>
            <span className="bg-paper h-40 w-0.5 md:h-64" />
            <span className="font-display text-3xl leading-none md:text-6xl">{profile.name}</span>
          </div>
        </div>
        <div
          data-op="role"
          className="bg-paper text-ink invisible absolute inset-0 grid place-items-center overflow-hidden opacity-0"
        >
          <div className="halftone text-ink/10 absolute inset-0" />
          <div data-op-in className="relative px-6 text-center">
            <p lang="ja" className="font-jp text-xl font-bold md:text-3xl">
              {heroPhrases[0].ja}
            </p>
            <p className="font-display mx-auto mt-3 max-w-[min(90vw,60rem)] text-[clamp(1.9rem,6vw,4.5rem)] leading-none text-balance">
              {profile.role}
            </p>
          </div>
        </div>
        <div
          data-op="episode"
          className="bg-sakura text-ink invisible absolute inset-0 grid place-items-center overflow-hidden opacity-0"
        >
          <div className="speedlines absolute -inset-[20%] opacity-40" />
          <div data-op-in className="relative text-center">
            <p lang="ja" className="font-jp text-7xl font-bold md:text-9xl">
              {sectionTitles.hero.ja}
            </p>
            <p className="font-display mt-2 text-xl md:text-3xl">
              {sectionTitles.hero.translation[lang]}
            </p>
          </div>
        </div>
      </div>
      <div data-loader-content className="absolute inset-0 grid place-items-center">
        <div className="flex w-[min(80vw,26rem)] flex-col items-start gap-4">
          <div ref={chibi} className="h-28 w-24 opacity-0">
            <ChibiArt pose="cheer" happy />
          </div>
          <p lang="ja" aria-hidden="true" className="font-jp text-xl font-bold tracking-widest">
            読み込み中…
          </p>
          <div className="border-paper relative h-3 w-full -skew-x-12 border-2">
            <div ref={barA} className="bg-sakura absolute inset-y-0 left-0 w-0" />
            <div ref={barB} className="bg-cyan absolute inset-y-0 left-0 w-0 mix-blend-screen" />
          </div>
          <div
            aria-hidden="true"
            className="font-display text-muted flex w-full justify-between text-sm"
          >
            <span>{t("loadingCaps")}</span>
            <span ref={num} className="text-paper tabular-nums">
              0%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
