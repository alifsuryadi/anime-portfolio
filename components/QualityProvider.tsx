"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { detectQuality, STORAGE_KEY, type Quality } from "@/lib/quality";

type Ctx = {
  /** null until the browser has been inspected (SSR + first client render). */
  quality: Quality | null;
  /** User chose to switch animations off from the navbar. */
  motionOff: boolean;
  setMotionOff: (off: boolean) => void;
  downgrade: () => void;
  chibi: boolean;
  setChibi: (on: boolean) => void;
  ready: boolean;
  setReady: (r: boolean) => void;
};

const QualityContext = createContext<Ctx | null>(null);

export function QualityProvider({ children }: { children: React.ReactNode }) {
  const [detected, setDetected] = useState<Quality | null>(null);
  const [motionOff, setMotionOffState] = useState(false);
  const [chibi, setChibi] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {}
    setMotionOffState(stored === "off");
    // `?quality=high|low|static` forces a mode (handy for testing on any device).
    const forced = new URLSearchParams(window.location.search).get("quality");
    const pick = () =>
      forced === "high" || forced === "low" || forced === "static" ? forced : detectQuality();
    setDetected(pick());

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setDetected(pick());
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setMotionOff = useCallback((off: boolean) => {
    setMotionOffState(off);
    try {
      localStorage.setItem(STORAGE_KEY, off ? "off" : "on");
    } catch {}
  }, []);

  const downgrade = useCallback(() => setDetected((q) => (q === "high" ? "low" : q)), []);

  const quality: Quality | null = detected === null ? null : motionOff ? "static" : detected;

  useEffect(() => {
    if (quality) document.documentElement.dataset.quality = quality;
  }, [quality]);

  useEffect(() => {
    document.documentElement.classList.toggle("chibi", chibi);
  }, [chibi]);

  const value = useMemo(
    () => ({ quality, motionOff, setMotionOff, downgrade, chibi, setChibi, ready, setReady }),
    [quality, motionOff, setMotionOff, downgrade, chibi, ready],
  );

  return <QualityContext.Provider value={value}>{children}</QualityContext.Provider>;
}

export function useQuality() {
  const ctx = useContext(QualityContext);
  if (!ctx) throw new Error("useQuality must be used inside QualityProvider");
  return ctx;
}

/** True when rich motion is allowed (quality known and not static). */
export function useMotion() {
  const { quality } = useQuality();
  return quality === "high" || quality === "low";
}
