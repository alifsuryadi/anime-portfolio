"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useMotion } from "@/components/QualityProvider";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/lenis";
import type { Project } from "@/content/projects";
import { localePath } from "@/lib/i18n";
import { useLang, useT } from "@/components/LangProvider";

const SFX = ["ドン!", "ゴゴゴ", "バーン", "シュッ", "キラッ"];
const CLIPS = [
  "polygon(0 0, 100% 3%, 97% 100%, 2% 96%)",
  "polygon(3% 2%, 100% 0, 100% 97%, 0 100%)",
  "polygon(0 4%, 96% 0, 100% 100%, 4% 97%)",
  "polygon(2% 0, 100% 4%, 98% 96%, 0 100%)",
  "polygon(0 0, 98% 2%, 100% 98%, 3% 100%)",
];
const ACCENT = {
  sakura: "var(--sakura)",
  cyan: "var(--neon-cyan)",
  sunset: "var(--sunset)",
} as const;

/**
 * Manga page: panels slide horizontally while the section is pinned (desktop,
 * motion allowed). Without motion it is a normal scroll-snapping row.
 */
export function ProjectsTrack({ projects, more }: { projects: Project[]; more: Project[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const motion = useMotion();
  const track = useRef<HTMLDivElement>(null);
  const st = useRef<ScrollTrigger | null>(null);
  const lang = useLang();
  const t = useT();

  useGSAP(
    () => {
      // Off in Static mode: navbar toggle, reduced motion or no GPU.
      if (!motion) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: wrap.current,
            pin: true,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        st.current = tween.scrollTrigger ?? null;
        // Panels tilt in as they cross the viewport (manga page turn feel).
        gsap.utils.toArray<HTMLElement>("[data-panel]").forEach((p) => {
          gsap.fromTo(
            p,
            { rotate: 2, y: 30 },
            {
              rotate: -1,
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: p,
                containerAnimation: tween,
                start: "left right",
                end: "center center",
                scrub: true,
              },
            },
          );
        });
        return () => {
          st.current = null;
        };
      });
      return () => mm.revert();
    },
    { scope: wrap, dependencies: [motion], revertOnUpdate: true },
  );

  // Keyboard users: focusing an off-screen panel scrolls the pinned track to it.
  const onFocus = (e: React.FocusEvent<HTMLElement>) => {
    const trigger = st.current;
    if (!trigger || !track.current) return;
    const panel = (e.target as HTMLElement).closest<HTMLElement>("[data-panel]");
    if (!panel) return;
    const max = track.current.scrollWidth - window.innerWidth;
    // Track fits the viewport (or layout not settled): nothing to scroll to.
    if (!(max > 0)) return;
    const x = Math.min(max, Math.max(0, panel.offsetLeft - window.innerWidth * 0.2));
    scrollToTarget(trigger.start + (x / max) * (trigger.end - trigger.start), { immediate: true });
  };

  return (
    <div ref={wrap} className="relative overflow-hidden md:h-[100svh]">
      <div
        ref={track}
        onFocus={onFocus}
        className="flex h-full snap-x snap-mandatory items-center gap-6 overflow-x-auto px-4 py-24 md:snap-none md:gap-10 md:overflow-visible md:px-[8vw] md:py-0"
      >
        {/* Title panel */}
        <div
          data-panel
          className="border-ink bg-paper text-ink relative flex h-[62svh] min-h-[22rem] w-[82vw] shrink-0 snap-center flex-col justify-between border-4 p-6 md:w-[34vw]"
        >
          <div aria-hidden="true" className="halftone text-ink/10 absolute inset-0" />
          <span
            lang="ja"
            aria-hidden="true"
            className="vertical-jp absolute top-6 right-6 text-5xl font-bold"
          >
            作品集
          </span>
          <h2 id="projects-title" className="heading-section relative max-w-[10ch]">
            {t("projectsTitle")}
          </h2>
          <p className="relative max-w-xs text-base font-medium">
            {projects.length} {t("projectsIntro")}
          </p>
          <span aria-hidden="true" className="font-display relative hidden text-sm md:block">
            {t("projectsScroll")}
          </span>
        </div>

        {projects.map((p, i) => {
          const accent = ACCENT[p.accent];
          return (
            <article
              key={p.slug}
              data-panel
              className="panel group relative h-[62svh] min-h-[22rem] w-[82vw] shrink-0 snap-center md:w-[min(46vw,40rem)]"
            >
              <Link
                href={localePath(lang, `/projects/${p.slug}`)}
                data-cursor="project"
                className="bg-ink flex h-full flex-col p-1.5 outline-offset-8"
                style={{ clipPath: CLIPS[i % CLIPS.length] }}
              >
                <div className="bg-paper relative flex-1 overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.imageAlt[lang]}
                    fill
                    sizes="(min-width: 768px) 46vw, 82vw"
                    className={`manga-img ${p.imageFit === "contain" ? "object-contain p-4" : "object-cover object-top"}`}
                  />
                  <div aria-hidden="true" className="manga-dots halftone absolute inset-0" />
                  <span
                    lang="ja"
                    aria-hidden="true"
                    className="font-jp text-paper absolute top-3 left-3 -rotate-12 text-4xl font-bold transition-transform duration-500 [-webkit-text-stroke:2px_var(--ink)] group-hover:scale-125 group-hover:-rotate-6"
                    style={{ color: accent }}
                  >
                    {SFX[i % SFX.length]}
                  </span>
                  <span
                    lang="ja"
                    aria-hidden="true"
                    className="vertical-jp bg-ink text-paper absolute top-3 right-3 px-1 py-2 text-base font-bold"
                  >
                    {p.jp}
                  </span>
                </div>
                <div className="bg-paper text-ink relative flex items-end justify-between gap-4 p-4">
                  <div>
                    <p
                      className="text-xs font-bold tracking-widest"
                      style={{ color: "var(--night)" }}
                    >
                      {p.role}
                    </p>
                    <h3 className="font-display mt-1 text-2xl leading-none md:text-3xl">
                      {p.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 max-w-md text-sm">{p.summary[lang]}</p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="border-ink group-hover:bg-ink group-hover:text-paper grid size-12 shrink-0 place-items-center rounded-full border-2 transition-colors"
                  >
                    ↗
                  </span>
                </div>
              </Link>
            </article>
          );
        })}

        {more.length > 0 && (
          <nav
            data-panel
            aria-labelledby="more-projects-title"
            className="border-ink bg-paper text-ink relative flex h-[62svh] min-h-[22rem] w-[82vw] shrink-0 snap-center flex-col border-4 p-6 md:w-[30vw]"
          >
            <div aria-hidden="true" className="halftone text-ink/10 absolute inset-0" />
            <h3 id="more-projects-title" className="font-display relative text-3xl leading-none">
              {t("moreProjects")}
            </h3>
            <p className="relative mt-3 text-sm">{t("moreProjectsIntro")}</p>
            <ul className="relative mt-6 flex flex-col gap-3">
              {more.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={localePath(lang, `/projects/${p.slug}`)}
                    data-cursor="project"
                    className="group border-ink hover:bg-ink hover:text-paper flex items-center justify-between gap-3 border-2 px-4 py-3 transition-colors"
                  >
                    <span>
                      <span className="font-display block text-lg leading-tight">{p.name}</span>
                      <span className="block text-xs">{p.role}</span>
                    </span>
                    <span aria-hidden="true">↗</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div aria-hidden="true" className="w-[4vw] shrink-0" />
      </div>
    </div>
  );
}
