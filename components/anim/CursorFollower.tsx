"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { pointerState } from "@/lib/scroll-state";
import { useQuality } from "@/components/QualityProvider";

type Mode = "default" | "link" | "project" | "magnetic";

type Petal = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  vr: number;
  life: number;
  size: number;
  hue: number;
};

/**
 * Custom cursor: a precise dot plus a chibi hitodama (spirit flame) that lags
 * behind on a spring and sheds sakura petals. Touch devices get tap ripples.
 */
export function CursorFollower() {
  const { quality, chibi } = useQuality();
  const [fine, setFine] = useState(false);
  const dot = useRef<HTMLDivElement>(null);
  const spirit = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const eyes = useRef<SVGGElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>("default");
  const modeRef = useRef<Mode>("default");
  const enabled = fine && quality !== null && quality !== "static";

  // Always track the pointer for the 3D scene (look-at, wind), even without a custom cursor.
  useEffect(() => {
    setFine(window.matchMedia("(pointer: fine)").matches);
    let lx = 0;
    let ly = 0;
    const onMove = (e: PointerEvent) => {
      pointerState.px = e.clientX;
      pointerState.py = e.clientY;
      pointerState.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerState.y = -((e.clientY / window.innerHeight) * 2 - 1);
      const d = Math.hypot(e.clientX - lx, e.clientY - ly);
      pointerState.speed += (d - pointerState.speed) * 0.2;
      lx = e.clientX;
      ly = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Touch: ripple on tap.
  useEffect(() => {
    if (fine || quality === "static" || quality === null) return;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      const el = document.createElement("span");
      el.setAttribute("aria-hidden", "true");
      el.className =
        "pointer-events-none fixed z-[90] size-16 -translate-1/2 rounded-full border-2 border-sakura";
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
      document.body.appendChild(el);
      gsap.fromTo(
        el,
        { scale: 0.2, opacity: 1 },
        { scale: 2.4, opacity: 0, duration: 0.7, ease: "expo.out", onComplete: () => el.remove() },
      );
    };
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onDown);
  }, [fine, quality]);

  useEffect(() => {
    if (!enabled) return;
    const html = document.documentElement;
    html.classList.add("has-cursor");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const sp = { x: pos.x, y: pos.y, vx: 0, vy: 0 };
    let magnet: HTMLElement | null = null;
    let raf = 0;
    let visible = false;

    const ctx = canvas.current!.getContext("2d")!;
    const petals: Petal[] = [];
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.current!.width = window.innerWidth * dpr;
      canvas.current!.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const setModeBoth = (m: Mode) => {
      if (modeRef.current === m) return;
      modeRef.current = m;
      setMode(m);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        visible = true;
        sp.x = pos.x;
        sp.y = pos.y;
        gsap.to([dot.current, spirit.current], { opacity: 1, duration: 0.3 });
      }
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        gsap.to(magnet, {
          x: (pos.x - cx) * 0.35,
          y: (pos.y - cy) * 0.35,
          duration: 0.4,
          ease: "power3.out",
        });
      }
    };

    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const mag = t?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (mag !== magnet) {
        if (magnet) gsap.to(magnet, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
        magnet = mag;
      }
      const explicit = t?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor as Mode | undefined;
      if (explicit) return setModeBoth(explicit);
      if (mag) return setModeBoth("magnetic");
      if (t?.closest("a, button, [role='button'], summary, label[for]")) return setModeBoth("link");
      setModeBoth("default");
    };

    const onLeave = () => {
      visible = false;
      gsap.to([dot.current, spirit.current], { opacity: 0, duration: 0.3 });
    };

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.globalAlpha = Math.max(0, p.life) * 0.9;
      ctx.fillStyle = `hsl(${p.hue} 100% 78%)`;
      const s = p.size;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.9, -s * 0.8, s * 0.7, s * 0.6, 0, s);
      ctx.bezierCurveTo(-s * 0.7, s * 0.6, -s * 0.9, -s * 0.8, -s * 0.25, -s * 0.85);
      ctx.lineTo(0, -s * 0.55);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // Spring follow for the spirit.
      let tx = pos.x;
      let ty = pos.y;
      if (magnet && modeRef.current === "magnetic") {
        const r = magnet.getBoundingClientRect();
        tx = r.left + r.width / 2;
        ty = r.top + r.height / 2;
      }
      const k = 140;
      const damp = 16;
      sp.vx += ((tx - sp.x) * k - sp.vx * damp) * dt;
      sp.vy += ((ty - sp.y) * k - sp.vy * damp) * dt;
      sp.x += sp.vx * dt;
      sp.y += sp.vy * dt;

      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      const tilt = Math.max(-40, Math.min(40, sp.vx * 0.03));
      if (spirit.current)
        spirit.current.style.transform = `translate3d(${sp.x}px, ${sp.y}px, 0) rotate(${tilt}deg)`;
      if (eyes.current) {
        const ex = Math.max(-3, Math.min(3, (tx - sp.x) * 0.08));
        const ey = Math.max(-2, Math.min(2, (ty - sp.y) * 0.08));
        eyes.current.setAttribute("transform", `translate(${ex} ${ey})`);
      }

      // Petal trail.
      const speed = Math.hypot(sp.vx, sp.vy);
      if (
        visible &&
        speed > 120 &&
        petals.length < 120 &&
        Math.random() < Math.min(0.9, speed / 1600)
      ) {
        petals.push({
          x: sp.x + (Math.random() - 0.5) * 10,
          y: sp.y + (Math.random() - 0.5) * 10,
          vx: -sp.vx * 0.04 + (Math.random() - 0.5) * 30,
          vy: -sp.vy * 0.04 + Math.random() * 20,
          r: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 6,
          life: 1,
          size: 3 + Math.random() * 4,
          hue: 330 + Math.random() * 20,
        });
      }
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        p.vy += 40 * dt;
        p.vx += Math.sin(now * 0.002 + i) * 12 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.r += p.vr * dt;
        p.life -= dt * 0.9;
        if (p.life <= 0) petals.splice(i, 1);
        else drawPetal(p);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
      if (magnet) gsap.set(magnet, { x: 0, y: 0 });
    };
  }, [enabled]);

  if (!enabled) return null;

  const size = chibi ? 1.5 : 1;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[95]">
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
      <div ref={dot} className="absolute top-0 left-0 opacity-0">
        <span
          className={`bg-paper block size-1.5 -translate-1/2 rounded-full transition-transform duration-200 ${
            mode === "default" ? "" : "scale-0"
          }`}
        />
      </div>
      <div ref={spirit} className="absolute top-0 left-0 opacity-0">
        <div
          className="-translate-1/2 transition-[width,height] duration-300 ease-[var(--ease-snap)]"
          style={{ width: 0, height: 0 }}
        >
          {/* Morphing ring for link / project modes */}
          <div
            className={`absolute top-1/2 left-1/2 grid -translate-1/2 place-items-center rounded-full border-2 transition-all duration-300 ease-[var(--ease-snap)] ${
              mode === "link"
                ? "border-cyan bg-cyan/10 size-16"
                : mode === "project"
                  ? "border-sakura bg-sakura text-ink size-24"
                  : mode === "magnetic"
                    ? "border-sunset/80 size-20"
                    : "size-0 border-transparent"
            }`}
          >
            <span
              ref={label}
              className={`font-jp text-cyan text-sm font-bold ${mode === "link" ? "opacity-100" : "opacity-0"}`}
            >
              見る
            </span>
            {mode === "project" && (
              <svg
                viewBox="0 0 24 24"
                className="absolute size-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M6 18 18 6M9 6h9v9" />
              </svg>
            )}
          </div>
          {/* Hitodama spirit */}
          <svg
            viewBox="-24 -30 48 54"
            className={`absolute top-1/2 left-1/2 -translate-1/2 transition-all duration-300 ${
              mode === "project" || mode === "link" ? "translate-x-6 -translate-y-10 scale-75" : ""
            }`}
            style={{
              width: 40 * size,
              height: 45 * size,
              filter: "drop-shadow(0 0 8px rgb(59 244 251 / 0.8))",
            }}
          >
            <path
              d="M0 -28 C 6 -16, 18 -10, 16 4 C 15 14, 8 20, 0 20 C -8 20, -15 14, -16 4 C -17 -8, -4 -12, 0 -28 Z"
              fill="#3BF4FB"
              opacity="0.35"
            />
            <path
              d="M0 -18 C 4 -10, 12 -6, 11 4 C 10 11, 6 15, 0 15 C -6 15, -11 11, -11 4 C -11 -4, -3 -8, 0 -18 Z"
              fill="#E9FEFF"
            />
            <g ref={eyes}>
              <ellipse cx="-4" cy="4" rx="1.8" ry="2.6" fill="#1A1033" />
              <ellipse cx="4" cy="4" rx="1.8" ry="2.6" fill="#1A1033" />
              <ellipse cx="-7" cy="8" rx="2" ry="1.1" fill="#FF6FA5" opacity="0.7" />
              <ellipse cx="7" cy="8" rx="2" ry="1.1" fill="#FF6FA5" opacity="0.7" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
