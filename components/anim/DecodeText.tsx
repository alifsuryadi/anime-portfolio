"use client";

import { useEffect, useRef } from "react";
import { useQuality } from "@/components/QualityProvider";
import { useScramble } from "./useScramble";

type Props = {
  text: string;
  className?: string;
  /** Re-decode every time it enters the viewport (default: once). */
  repeat?: boolean;
  /** Also re-decode on pointer hover. */
  hover?: boolean;
  step?: number;
};

/** Japanese text that decodes when it scrolls into view. Decorative: aria-hidden. */
export function DecodeText({ text, className, repeat = false, hover = false, step = 70 }: Props) {
  const { quality } = useQuality();
  const { text: shown, run } = useScramble(text, { step });
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || quality === null || quality === "static") return;
    let done = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && (!done || repeat)) {
          done = true;
          run(text);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [quality, repeat, run, text]);

  return (
    <span
      ref={ref}
      lang="ja"
      aria-hidden="true"
      className={className}
      onPointerEnter={hover && quality !== "static" ? () => run(text) : undefined}
    >
      {shown}
    </span>
  );
}
