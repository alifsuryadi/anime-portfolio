"use client";

import { useEffect, useState } from "react";
import { useQuality } from "./QualityProvider";

const CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/** Easter egg: the Konami code toggles chibi mode. */
export function Konami() {
  const { chibi, setChibi } = useQuality();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let i = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      i = key === CODE[i] ? i + 1 : key === CODE[0] ? 1 : 0;
      if (i === CODE.length) {
        i = 0;
        setChibi(!chibi);
        setToast(!chibi ? "ちびモード ON! Mode chibi aktif" : "ちびモード OFF");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chibi, setChibi]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-6 left-1/2 z-[96] -translate-x-1/2"
    >
      {toast && (
        <p className="chibi-bounce border-ink bg-sakura font-jp text-ink -rotate-2 border-2 px-5 py-3 font-bold shadow-[6px_6px_0_var(--ink)]">
          {toast}
        </p>
      )}
    </div>
  );
}
