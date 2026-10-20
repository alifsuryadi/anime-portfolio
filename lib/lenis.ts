import type Lenis from "lenis";

/** The single Lenis instance (null in static / reduced-motion mode). */
export const lenisRef: { current: Lenis | null } = { current: null };

export function scrollToTarget(
  target: string | number | HTMLElement,
  opts?: { immediate?: boolean },
) {
  const lenis = lenisRef.current;
  if (lenis) {
    lenis.scrollTo(target, { offset: 0, immediate: opts?.immediate, duration: 1.4 });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "auto" });
  } else {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView({ block: "start" });
  }
}
