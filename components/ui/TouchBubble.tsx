"use client";

import { useEffect, useRef, useState } from "react";
import { MOTION_OK, gsap } from "@/lib/gsap";
import { bus } from "@/lib/scroll-state";
import type { TouchZone } from "@/lib/scenes.config";
import type { dict } from "@/lib/i18n";
import { useT } from "@/components/LangProvider";

const LINES: Record<TouchZone, keyof typeof dict> = {
  head: "touchHead",
  cheek: "touchCheek",
  hair: "touchHair",
  ahoge: "touchAhoge",
  headphones: "touchHeadphones",
  hand: "touchHand",
  shoe: "touchShoe",
  body: "touchBody",
};

type Touch = { zone: TouchZone; x: number; y: number; id: number };

/**
 * What the 3D character says when you click or tap her: a manga speech bubble
 * at the pointer. The canvas is decorative (aria-hidden), and so is this.
 */
export function TouchBubble() {
  const t = useT();
  const [touch, setTouch] = useState<Touch | null>(null);
  const el = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let id = 0;
    return bus.on("character-touch", (d) => setTouch({ ...(d as Omit<Touch, "id">), id: ++id }));
  }, []);

  useEffect(() => {
    if (!touch) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        el.current,
        { scale: 0.5, yPercent: 30, rotate: -8 },
        { scale: 1, yPercent: 0, rotate: -2, duration: 0.45, ease: "back.out(2.4)" },
      );
    });
    const timer = setTimeout(() => setTouch(null), 1700);
    return () => {
      mm.revert();
      clearTimeout(timer);
    };
  }, [touch]);

  if (!touch) return null;
  // Keep the bubble on screen and above the finger.
  const left = Math.min(Math.max(touch.x, 110), window.innerWidth - 110);
  const top = Math.max(touch.y - 28, 96);
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-[96] -translate-x-1/2 -translate-y-full"
      style={{ left, top }}
    >
      <p
        ref={el}
        key={touch.id}
        className="border-ink bg-paper text-ink origin-bottom -rotate-2 border-2 px-4 py-2 text-sm font-bold whitespace-nowrap shadow-[5px_5px_0_var(--ink)]"
      >
        {t(LINES[touch.zone])}
      </p>
    </div>
  );
}
