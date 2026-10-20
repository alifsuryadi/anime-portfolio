export type Quality = "high" | "low" | "static";

/** "none" = no WebGL, "software" = CPU rasteriser (SwiftShader, llvmpipe...), "gpu" = real GPU. */
export function webglSupport(): "none" | "software" | "gpu" {
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ||
      canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return "none";
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return /swiftshader|llvmpipe|software|basic render/i.test(renderer) ? "software" : "gpu";
  } catch {
    return "none";
  }
}

/** Best guess at first load. Runs only in the browser (call from useEffect). */
export function detectQuality(): Quality {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "static";
  // Without a real GPU every WebGL frame is a long CPU task: use the 2D fallback.
  if (webglSupport() !== "gpu") return "static";
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
