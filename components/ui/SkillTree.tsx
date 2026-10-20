"use client";

import { useEffect, useRef, useState } from "react";
import { skillGroups, skills, type SkillGroup } from "@/content/skills";
import { bus } from "@/lib/scroll-state";
import { useLang, useT } from "@/components/LangProvider";

const GROUPS = Object.keys(skillGroups) as SkillGroup[];
const ACCENT: Record<SkillGroup, string> = {
  lang: "var(--neon-cyan)",
  web: "var(--sakura)",
  data: "var(--sunset)",
  ops: "#B48CFF",
  ml: "var(--paper)",
};

/**
 * RPG skill tree: hovering a node lights the path from its branch root and
 * pulses the matching orb in the 3D scene; clicking opens its description.
 */
export function SkillTree() {
  const [hover, setHover] = useState<{ g: SkillGroup; i: number } | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const lang = useLang();
  const t = useT();

  useEffect(() => {
    bus.emit("skill-hover", hover?.g ?? null);
  }, [hover]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <div
      ref={root}
      className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 xl:grid-cols-5"
      onPointerLeave={() => setHover(null)}
    >
      {GROUPS.map((g) => {
        const list = skills.filter((s) => s.group === g);
        const color = ACCENT[g];
        return (
          <section
            key={g}
            aria-label={skillGroups[g].label[lang]}
            className="relative flex flex-col items-start"
            style={{ ["--c" as string]: color }}
          >
            <div className="flex items-center gap-2">
              <span
                lang="ja"
                aria-hidden="true"
                className="font-jp grid size-12 place-items-center rounded-full border-2 text-sm font-bold transition-shadow"
                style={{
                  borderColor: color,
                  color,
                  boxShadow: hover?.g === g ? `0 0 18px ${color}` : "none",
                }}
              >
                {skillGroups[g].jp}
              </span>
              <h3 className="text-sm font-bold tracking-wide">{skillGroups[g].label[lang]}</h3>
            </div>
            <ul className="mt-1 ml-6 flex flex-col">
              {list.map((s, i) => {
                const lit = hover?.g === g && i <= hover.i;
                const id = `skill-${s.name.replace(/\W+/g, "-").toLowerCase()}`;
                const isOpen = open === s.name;
                return (
                  <li key={s.name} className="relative pt-4">
                    <span
                      aria-hidden="true"
                      className="absolute top-0 -left-px h-full w-0.5 transition-colors duration-300"
                      style={{
                        background: lit ? color : "var(--line)",
                        boxShadow: lit ? `0 0 8px ${color}` : "none",
                      }}
                    />
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={id}
                      onPointerEnter={() => setHover({ g, i })}
                      onFocus={() => setHover({ g, i })}
                      onBlur={() => setHover(null)}
                      onClick={() => setOpen(isOpen ? null : s.name)}
                      className="group relative -ml-[7px] flex items-center gap-2 py-1 text-left text-sm"
                    >
                      <span
                        aria-hidden="true"
                        className="size-3.5 rotate-45 border-2 transition-all duration-300"
                        style={{
                          borderColor: lit || isOpen ? color : "var(--muted)",
                          background: lit || isOpen ? color : "var(--ink)",
                          boxShadow: lit ? `0 0 12px ${color}` : "none",
                        }}
                      />
                      <span
                        className={`transition-colors ${lit || isOpen || s.main ? "text-paper" : "text-paper/80"} ${s.main ? "font-bold" : ""}`}
                      >
                        {s.name}
                      </span>
                      {s.main && (
                        <span
                          className="text-ink rounded-full px-1.5 py-px text-[0.6rem] font-bold tracking-wider uppercase"
                          style={{ background: color }}
                        >
                          {t("mainSkill")}
                        </span>
                      )}
                    </button>
                    <div
                      id={id}
                      role="region"
                      aria-label={`${t("skillAbout")} ${s.name}`}
                      hidden={!isOpen}
                      className="bg-ink text-paper absolute top-full left-2 z-20 mt-1 w-56 border-2 p-3 text-xs leading-relaxed shadow-[6px_6px_0_var(--c)]"
                      style={{ borderColor: color }}
                    >
                      <p className="mb-1 font-bold" style={{ color }}>
                        {s.name}
                      </p>
                      {s.note[lang]}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
