"use client";

import { useEffect, useRef, useState } from "react";
import { bus, scrollState } from "@/lib/scroll-state";
import { character, scenes, type SceneId } from "@/lib/scenes.config";
import { ChibiArt } from "./ChibiArt";

type Manifest = { frames: number; pattern: string; width: number; height: number };

const posFor = (id: SceneId) => {
  const x = scenes[id].character.position[0];
  return x > 0.5 ? "right" : x < -0.5 ? "left" : "center";
};

/**
 * Static-mode character. If an image sequence exists and the user has not asked
 * for reduced motion, frames are scrubbed to a <canvas> by scroll progress.
 * Otherwise a still illustration swaps pose per section (no animation).
 */
export function StaticCharacter() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [scene, setScene] = useState<SceneId>("hero");
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => bus.on("section", (d) => setScene((d as { to: SceneId }).to)), []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let alive = true;
    fetch(character.sequenceManifest)
      .then((r) => (r.ok ? r.json() : null))
      .then((m: Manifest | null) => alive && m?.frames && setManifest(m))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!manifest || !canvas.current) return;
    const ctx = canvas.current.getContext("2d")!;
    const frames: HTMLImageElement[] = [];
    for (let i = 1; i <= manifest.frames; i++) {
      const img = new Image();
      img.src = manifest.pattern.replace("%04d", String(i).padStart(4, "0"));
      frames.push(img);
    }
    let raf = 0;
    let last = -1;
    const draw = () => {
      const f = Math.min(manifest.frames - 1, Math.floor(scrollState.progress * manifest.frames));
      const img = frames[f];
      if (f !== last && img.complete) {
        ctx.clearRect(0, 0, manifest.width, manifest.height);
        ctx.drawImage(img, 0, 0, manifest.width, manifest.height);
        last = f;
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [manifest]);

  const hidden = scene === "projects";
  const side = posFor(scene);
  const pose = scenes[scene].pose === "wave" ? "wave" : scenes[scene].pose === "cheer" ? "cheer" : "idle";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed bottom-0 z-0 h-[42vh] max-h-[460px] w-auto opacity-90 md:h-[62vh] ${
        hidden ? "hidden" : ""
      } ${side === "right" ? "right-[4vw]" : side === "left" ? "left-[4vw]" : "left-1/2 -translate-x-1/2"}`}
    >
      {manifest ? (
        <canvas ref={canvas} width={manifest.width} height={manifest.height} className="h-full w-auto" />
      ) : (
        <ChibiArt pose={pose} happy={(scenes[scene].expression.happy ?? 0) > 0.5} className="h-full w-auto" />
      )}
    </div>
  );
}
