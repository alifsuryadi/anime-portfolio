export type Quality = "high" | "low" | "static";

export function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Best guess at first load. Runs only in the browser (call from useEffect). */
export function detectQuality(): Quality {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "static";
  if (!hasWebGL()) return "static";
  const nav = navigator as Navigator & { deviceMemory?: number };
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.innerWidth < 768;
  const weakCpu = (nav.hardwareConcurrency ?? 8) <= 4;
  const weakMem = (nav.deviceMemory ?? 8) <= 4;
  if (coarse || small || weakCpu || weakMem) return "low";
  return "high";
}

export const qualitySettings = {
  high: { petals: 500, dpr: [1, 1.5] as [number, number], post: true, orbs: true },
  low: { petals: 160, dpr: [1, 1.25] as [number, number], post: false, orbs: true },
  static: { petals: 0, dpr: [1, 1] as [number, number], post: false, orbs: false },
} as const;

export const STORAGE_KEY = "alif-motion";
