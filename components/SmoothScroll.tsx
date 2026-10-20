"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { lenisRef } from "@/lib/lenis";
import { bus, scrollState } from "@/lib/scroll-state";
import type { SceneId } from "@/lib/scenes.config";
import { useMotion } from "./QualityProvider";

type Mark = { id: SceneId; top: number; bottom: number };

/**
 * Lenis smooth scroll synced with ScrollTrigger, plus the scene tracker that
 * turns scroll position into `scrollState.sectionFloat` for the 3D choreography.
 */
export function SmoothScroll() {
  const motion = useMotion();
  const pathname = usePathname();

  // Lenis lifecycle.
  useEffect(() => {
    if (!motion) return;
    const lenis = new Lenis({ anchors: { offset: 0 }, lerp: 0.1, wheelMultiplier: 1 });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [motion]);

  // Scene tracker (runs in every mode so the navbar can highlight sections).
  useEffect(() => {
    let marks: Mark[] = [];
    let lastY = window.scrollY;
    let raf = 0;
    let lastSection: SceneId | null = null;

    const measure = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
      marks = els.map((el) => {
        const r = el.getBoundingClientRect();
        const top = r.top + window.scrollY;
        return { id: el.dataset.scene as SceneId, top, bottom: top + r.height };
      });
      scrollState.order = marks.map((m) => m.id);
    };

    const update = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const max = Math.max(1, document.documentElement.scrollHeight - vh);
      scrollState.progress = y / max;
      const v = lenisRef.current ? lenisRef.current.velocity : y - lastY;
      lastY = y;
      scrollState.velocity = v;
      scrollState.energy += (Math.min(1, Math.abs(v) / 40) - scrollState.energy) * 0.08;
      scrollState.distance += Math.abs(v);

      if (marks.length) {
        const focus = y + vh * 0.6;
        let i = 0;
        while (i < marks.length - 1 && focus >= marks[i + 1].top) i++;
        const m = marks[i];
        const span = Math.min(vh * 0.8, m.bottom - m.top);
        const t = i === 0 ? 1 : Math.min(1, Math.max(0, (focus - m.top) / span));
        scrollState.sectionFloat = i === 0 ? 0 : i - 1 + t;
        scrollState.local = Math.min(1, Math.max(0, (y + vh * 0.5 - m.top) / (m.bottom - m.top)));
        scrollState.section = m.id;
        if (m.id !== lastSection) {
          bus.emit("section", { from: lastSection, to: m.id });
          lastSection = m.id;
        }
      }
      raf = requestAnimationFrame(update);
    };

    // Measure after layout settles (fonts, pinned sections).
    const remeasure = () => requestAnimationFrame(measure);
    const ro = new ResizeObserver(remeasure);
    ro.observe(document.body);
    ScrollTrigger.addEventListener("refresh", remeasure);
    measure();
    raf = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      ScrollTrigger.removeEventListener("refresh", remeasure);
    };
  }, [pathname]);

  // Scroll to top on route change so the scene starts at its first key.
  useEffect(() => {
    if (window.location.hash) return;
    lenisRef.current?.scrollTo(0, { immediate: true });
    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
}
