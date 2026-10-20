"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useQuality } from "./QualityProvider";
import { StaticCharacter } from "./ui/StaticCharacter";

const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

/** Mounts the single global WebGL canvas once the page is idle (keeps LCP on HTML). */
export function SceneMount() {
  const { quality } = useQuality();
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setIdle(true), { timeout: 900 });
      return () => window.cancelIdleCallback?.(id);
    }
    const t = setTimeout(() => setIdle(true), 300);
    return () => clearTimeout(t);
  }, []);

  if (quality === null) return null;
  if (quality === "static") return <StaticCharacter />;
  return idle ? <Scene quality={quality} /> : null;
}
