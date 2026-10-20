"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { KATAKANA } from "@/content/japanese-phrases";

const rand = () => KATAKANA[(Math.random() * KATAKANA.length) | 0];

/**
 * Decode effect: every glyph flickers through random katakana, then locks in
 * one by one from left to right. Returns the text to render and `run(next)`.
 */
export function useScramble(initial: string, { step = 55, flicker = 4 } = {}) {
  const [text, setText] = useState(initial);
  const raf = useRef(0);

  const run = useCallback(
    (target: string, instant = false) => {
      cancelAnimationFrame(raf.current);
      if (instant) {
        setText(target);
        return Promise.resolve();
      }
      const chars = Array.from(target);
      const start = performance.now();
      return new Promise<void>((resolve) => {
        let frame = 0;
        const tick = (now: number) => {
          frame++;
          const locked = Math.floor((now - start) / step);
          if (frame % 2 === 0 || locked >= chars.length) {
            const out = chars
              .map((ch, i) => {
                if (i < locked || ch === " " || ch === "・") return ch;
                return i < locked + flicker * 2 ? rand() : "　";
              })
              .join("");
            setText(out);
          }
          if (locked < chars.length) raf.current = requestAnimationFrame(tick);
          else {
            setText(target);
            resolve();
          }
        };
        raf.current = requestAnimationFrame(tick);
      });
    },
    [step, flicker],
  );

  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return { text, run };
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
