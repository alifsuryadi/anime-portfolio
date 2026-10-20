"use client";

import { useEffect, useRef, useState } from "react";
import type { Phrase } from "@/content/japanese-phrases";
import { useQuality } from "@/components/QualityProvider";
import { useScramble } from "./useScramble";

type Props = {
  phrases: Phrase[];
  /** ms each phrase stays locked before the next decode. */
  hold?: number;
  className?: string;
  translationClassName?: string;
  /** Accessible lead-in for the screen-reader list. */
  label?: string;
};

/**
 * Rotating Japanese phrase with a katakana decode effect and a visible
 * translation underneath. Screen readers get one static list of every phrase
 * instead of a stream of random glyphs.
 */
export function KanjiScramble({ phrases, hold = 2600, className, translationClassName, label }: Props) {
  const { quality } = useQuality();
  const [index, setIndex] = useState(0);
  const { text, run } = useScramble(phrases[0].ja);
  const root = useRef<HTMLDivElement>(null);
  const visible = useRef(true);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (quality === null) return;
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const loop = (i: number) => {
      timer = setTimeout(async () => {
        if (!alive) return;
        if (!visible.current || document.hidden) return loop(i);
        const next = (i + 1) % phrases.length;
        setIndex(next);
        await run(phrases[next].ja, quality === "static");
        if (alive) loop(next);
      }, hold);
    };
    loop(0);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [quality, phrases, hold, run]);

  return (
    <div ref={root} className={className}>
      <p className="sr-only">
        {label ? `${label}: ` : null}
        {phrases.map((p, i) => (
          <span key={p.ja}>
            <span lang="ja">{p.ja}</span> ({p.translation}){i < phrases.length - 1 ? ", " : ""}
          </span>
        ))}
      </p>
      <p aria-hidden="true" lang="ja" className="font-jp font-bold whitespace-nowrap">
        {text}
      </p>
      <p aria-hidden="true" className={translationClassName}>
        {phrases[index].translation}
      </p>
    </div>
  );
}
