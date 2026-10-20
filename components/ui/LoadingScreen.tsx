"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { bus } from "@/lib/scroll-state";
import { useQuality } from "@/components/QualityProvider";
import { ChibiArt } from "./ChibiArt";

const MAX_WAIT = 3200;

/**
 * Rendered in the static HTML so it covers the first paint; a CSS failsafe
 * hides it if JS never runs. Progress = fonts + window load + 3D scene ready.
 */
export function LoadingScreen() {
  const { quality, setReady } = useQuality();
  const [pct, setPct] = useState(0);
  const [gone, setGone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const chibi = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (quality === null) return;
    const flags = { fonts: false, load: document.readyState === "complete", scene: quality === "static" };
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
        .fromTo(chibi.current, { xPercent: -260, rotate: -20, opacity: 1 }, { xPercent: 0, rotate: 0, duration: 0.55, ease: "back.out(2.2)" })
        .to(chibi.current, { y: -24, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" })
        .add(() => bus.emit("loader-done"))
        .to("[data-loader-panel='top']", { yPercent: -100, duration: 0.7, ease: "power4.inOut" }, "+=0.1")
        .to("[data-loader-panel='bottom']", { yPercent: 100, duration: 0.7, ease: "power4.inOut" }, "<")
        .to("[data-loader-content]", { opacity: 0, duration: 0.25 }, "<");
    };

    const tick = () => {
      const elapsed = performance.now() - started;
      const target =
        elapsed > MAX_WAIT ? 100 : (flags.fonts ? 35 : 10) + (flags.load ? 30 : 0) + (flags.scene ? 35 : 0);
      shown += (target - shown) * 0.12 + 0.15;
      shown = Math.min(shown, target, 100);
      setPct(Math.round(shown));
      if (shown >= 99.5 && !finished) {
        setPct(100);
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
    <div
      ref={root}
      className="loader fixed inset-0 z-[100] text-paper"
      role="status"
      aria-live="polite"
      aria-label={`Memuat halaman, ${pct}%`}
    >
      <div data-loader-panel="top" className="absolute inset-x-0 top-0 h-1/2 bg-ink" />
      <div data-loader-panel="bottom" className="absolute inset-x-0 bottom-0 h-1/2 bg-ink">
        <div className="halftone absolute inset-0 text-night" />
      </div>
      <div data-loader-content className="absolute inset-0 grid place-items-center">
        <div className="flex w-[min(80vw,26rem)] flex-col items-start gap-4">
          <div ref={chibi} className="h-28 w-24 opacity-0">
            <ChibiArt pose="cheer" happy />
          </div>
          <p lang="ja" className="font-jp text-xl font-bold tracking-widest">
            読み込み中…
          </p>
          <div className="relative h-3 w-full -skew-x-12 border-2 border-paper">
            <div className="absolute inset-y-0 left-0 bg-sakura" style={{ width: `${pct}%` }} />
            <div className="absolute inset-y-0 left-0 bg-cyan mix-blend-screen" style={{ width: `${Math.max(0, pct - 12)}%` }} />
          </div>
          <div className="flex w-full justify-between font-display text-sm text-muted">
            <span>LOADING</span>
            <span className="tabular-nums text-paper">{pct}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
