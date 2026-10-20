"use client";

import { useEffect, useState } from "react";
import { useQuality } from "./QualityProvider";
import { useT } from "./LangProvider";

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
  const t = useT();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    // Compare the last N keys, so extra presses before the code (↑ ↑ ↑ …) still work.
    const recent: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      recent.push(key);
      if (recent.length > CODE.length) recent.shift();
      if (recent.length === CODE.length && recent.every((k, j) => k === CODE[j])) {
        recent.length = 0;
        setChibi(!chibi);
        setToast(!chibi ? t("chibiOn") : t("chibiOff"));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chibi, setChibi, t]);

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
