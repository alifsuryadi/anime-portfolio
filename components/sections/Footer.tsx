"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/lenis";
import { bus } from "@/lib/scroll-state";
import { profile, socials } from "@/content/profile";
import { DecodeText } from "@/components/anim/DecodeText";
import { useQuality } from "@/components/QualityProvider";
import { useLang, useT } from "@/components/LangProvider";
import { localePath } from "@/lib/i18n";

/** Final scene: night sky over the rooftop torii. Click the sky for shooting stars. */
export function Footer() {
  const { quality } = useQuality();
  const t = useT();
  const lang = useLang();
  const kunai = useRef<HTMLSpanElement>(null);
  const sky = useRef<HTMLButtonElement>(null);

  const star = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const keyboard = e.detail === 0;
    const cx = keyboard ? r.left + Math.random() * r.width : e.clientX;
    const cy = keyboard ? r.top + Math.random() * r.height * 0.5 : e.clientY;
    if (quality === "high" || quality === "low") {
      bus.emit("shooting-star", {
        x: (cx / window.innerWidth) * 2 - 1,
        y: -((cy / window.innerHeight) * 2 - 1),
      });
      return;
    }
    // Static mode: a CSS streak.
    const el = document.createElement("span");
    el.setAttribute("aria-hidden", "true");
    el.className =
      "pointer-events-none absolute h-0.5 w-24 bg-gradient-to-l from-white to-transparent";
    el.style.left = `${cx - r.left}px`;
    el.style.top = `${cy - r.top}px`;
    e.currentTarget.appendChild(el);
    setTimeout(() => el.remove(), 400);
  };

  const toTop = () => {
    const reduced = quality === "static";
    if (!reduced && kunai.current) {
      gsap
        .timeline()
        .to(kunai.current, { y: 8, duration: 0.15, ease: "power2.in" })
        .to(kunai.current, { y: -window.innerHeight, duration: 0.6, ease: "power3.in" })
        .set(kunai.current, { y: 40 })
        .to(kunai.current, { y: 0, duration: 0.5, ease: "back.out(2)", delay: 0.8 });
    }
    scrollToTarget(0, { immediate: reduced });
    document.getElementById("hero-title")?.setAttribute("tabindex", "-1");
    setTimeout(
      () => document.getElementById("hero-title")?.focus({ preventScroll: true }),
      reduced ? 0 : 1200,
    );
  };

  return (
    <footer id="footer" data-scene="footer" className="relative z-10 flex min-h-[100svh] flex-col">
      <button
        ref={sky}
        type="button"
        onClick={star}
        className="relative flex-1 overflow-hidden text-left"
      >
        <span className="text-muted absolute top-24 left-1/2 w-max max-w-[90vw] -translate-x-1/2 text-center text-xs tracking-[0.3em] uppercase">
          {t("footerHint")}
        </span>
        {quality === "static" && <StaticTorii />}
      </button>

      <div className="relative px-4 pb-8 md:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-center">
            <DecodeText
              text="ありがとう"
              repeat
              hover
              step={110}
              className="font-jp text-paper block text-[18vw] leading-none font-bold md:text-[12vw]"
            />
            <span className="text-muted mt-2 block text-sm tracking-[0.3em] uppercase">
              {t("thanks")}
            </span>
          </p>

          <div className="border-line mt-12 flex flex-col items-center justify-between gap-8 border-t pt-8 md:flex-row">
            <nav aria-label={t("footerLinks")}>
              <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target={s.href.startsWith("http") ? "_blank" : undefined}
                      rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="glitch hover:text-cyan"
                      data-text={s.label}
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a href={profile.cv} download className="hover:text-cyan">
                    CV
                  </a>
                </li>
                <li>
                  <Link href={localePath(lang, "/#projects")} className="hover:text-cyan">
                    {t("navProjects")}
                  </Link>
                </li>
              </ul>
            </nav>

            <button
              type="button"
              onClick={toTop}
              className="group flex items-center gap-3 text-sm font-semibold"
              data-magnetic
            >
              <span ref={kunai} aria-hidden="true" className="inline-block">
                <svg
                  viewBox="0 0 20 60"
                  className="h-12 w-4 rotate-180 transition-transform group-hover:-translate-y-1"
                >
                  <circle cx="10" cy="5" r="4" fill="none" stroke="var(--paper)" strokeWidth="2" />
                  <rect x="8" y="9" width="4" height="18" fill="var(--neon-cyan)" />
                  <path d="M10 27 L17 36 L10 58 L3 36 Z" fill="var(--paper)" />
                </svg>
              </span>
              {t("backToTop")}
            </button>

            <p className="text-muted text-center text-xs">
              © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {profile.name}.
              {t("madeWith")}
              <br />
              <span className="opacity-70">Psst… ↑ ↑ ↓ ↓ ← → ← → B A</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function StaticTorii() {
  return (
    <svg
      viewBox="0 0 300 220"
      aria-hidden="true"
      className="absolute bottom-0 left-1/2 h-[55%] -translate-x-1/2"
    >
      <path d="M10 40 Q150 20 290 40 L290 54 Q150 36 10 54Z" fill="#1b1424" />
      <rect x="22" y="50" width="256" height="18" fill="#E8402A" />
      <rect x="40" y="88" width="220" height="12" fill="#E8402A" />
      <rect x="143" y="66" width="14" height="22" fill="#E8402A" />
      <rect x="62" y="66" width="18" height="154" fill="#E8402A" />
      <rect x="220" y="66" width="18" height="154" fill="#E8402A" />
    </svg>
  );
}
