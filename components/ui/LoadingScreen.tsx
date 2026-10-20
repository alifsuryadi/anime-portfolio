"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { bus } from "@/lib/scroll-state";
import { useQuality } from "@/components/QualityProvider";
import { ChibiArt } from "./ChibiArt";
import { useT } from "@/components/LangProvider";

const MAX_WAIT = 3200;

/**
 * Rendered in the static HTML so it covers the first paint; a CSS failsafe
 * hides it if JS never runs. Progress = fonts + window load + 3D scene ready.
 */
export function LoadingScreen() {
  const { quality, setReady } = useQuality();
  const t = useT();
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
      gsap
        .timeline({ onComplete: () => setGone(true) })
        .fromTo(
          chibi.current,
          { xPercent: -260, rotate: -20, opacity: 1 },
          { xPercent: 0, rotate: 0, duration: 0.55, ease: "back.out(2.2)" },
        )
        .to(chibi.current, { y: -24, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" })
        .add(() => bus.emit("loader-done"))
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
