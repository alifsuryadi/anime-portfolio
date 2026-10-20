"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useMotion } from "@/components/QualityProvider";

/** 3D tilt that follows the pointer, with a moving holo glare. */
export function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const glare = useRef<HTMLDivElement>(null);

  const motion = useMotion();

  const onMove = (e: React.PointerEvent) => {
    if (!motion || e.pointerType !== "mouse") return;
    const r = ref.current!.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(ref.current, {
      rotateY: px * 18,
      rotateX: -py * 18,
      duration: 0.5,
      ease: "power3.out",
    });
    gsap.to(glare.current, {
      opacity: 0.5,
      backgroundPosition: `${50 + px * 80}% ${50 + py * 80}%`,
      duration: 0.5,
    });
  };
  const onLeave = () => {
    gsap.to(ref.current, { rotateY: 0, rotateX: 0, duration: 0.9, ease: "elastic.out(1, 0.5)" });
    gsap.to(glare.current, { opacity: 0, duration: 0.5 });
  };

  return (
    <div style={{ perspective: 900 }} className={className}>
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="relative will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
        <div
          ref={glare}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle at center, rgb(255 255 255 / 0.45), rgb(59 244 251 / 0.15) 15%, transparent 35%)",
            backgroundSize: "200% 200%",
            backgroundPosition: "50% 50%",
          }}
        />
      </div>
    </div>
  );
}
