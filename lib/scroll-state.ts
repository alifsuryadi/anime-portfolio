import type { SceneId } from "@/lib/scenes.config";

/**
 * Mutable, render-free scroll state shared between Lenis, ScrollTrigger and the
 * R3F frame loop. Read it inside useFrame / rAF, never during React render.
 */
export const scrollState = {
  /** 0..1 over the whole document. */
  progress: 0,
  /** Lenis velocity, px per frame, signed. */
  velocity: 0,
  /** Smoothed absolute velocity, 0..~1. */
  energy: 0,
  /** Continuous section index: 2.4 = 40% from section 2 to section 3. */
  sectionFloat: 0,
  /** 0..1 progress inside the current section. */
  local: 0,
  /** Total px scrolled (drives the walk cycle). */
  distance: 0,
  section: "hero" as SceneId,
  /** Scene ids in DOM order (from [data-scene] elements). */
  order: ["hero"] as SceneId[],
};

export const pointerState = {
  /** Normalised device coords, -1..1. */
  x: 0,
  y: 0,
  /** Viewport pixels. */
  px: 0,
  py: 0,
  /** Pointer speed in px/frame (smoothed). */
  speed: 0,
};

/** Simple event bus for one-off effects (shooting star clicks, konami, ...). */
type Listener = (detail?: unknown) => void;
const listeners = new Map<string, Set<Listener>>();
export const bus = {
  on(type: string, fn: Listener) {
    if (!listeners.has(type)) listeners.set(type, new Set());
    listeners.get(type)!.add(fn);
    return () => {
      listeners.get(type)?.delete(fn);
    };
  },
  emit(type: string, detail?: unknown) {
    listeners.get(type)?.forEach((fn) => fn(detail));
  },
};
