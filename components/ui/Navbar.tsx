"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { bus } from "@/lib/scroll-state";
import { basePath, langName, localePath, type DictKey } from "@/lib/i18n";
import { sectionTitles } from "@/content/japanese-phrases";
import { profile } from "@/content/profile";
import { useQuality } from "@/components/QualityProvider";
import { useLang, useT } from "@/components/LangProvider";

const links = [
  { id: "about", label: "navAbout" },
  { id: "skills", label: "navSkills" },
  { id: "projects", label: "navProjects" },
  { id: "experience", label: "navExperience" },
  { id: "achievements", label: "navAchievements" },
  { id: "contact", label: "navContact" },
] as const satisfies readonly { id: keyof typeof sectionTitles; label: DictKey }[];

export function Navbar() {
  const pathname = usePathname();
  const lang = useLang();
  const t = useT();
  const { motionOff, setMotionOff } = useQuality();
  const [active, setActive] = useState<string>("hero");
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState("");
  const base = basePath(pathname);
  const home = base === "/";
  const other = lang === "en" ? "id" : "en";

  useEffect(() => bus.on("section", (d) => setActive((d as { to: string }).to)), []);
  // Keep the section when switching language from the home page.
  useEffect(() => setHash(home && active !== "hero" ? `#${active}` : ""), [home, active]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const href = (id: string) => (home ? `#${id}` : localePath(lang, `/#${id}`));
  const switchHref = localePath(other, `${base}${hash}`);

  const langSwitch = (
    <a
      href={switchHref}
      hrefLang={other}
      lang={other}
      title={t("switchLang")}
      className="border-line bg-ink/70 hover:border-sakura flex h-10 items-center gap-1.5 rounded-full border px-3 text-xs font-bold backdrop-blur-md"
    >
      <span aria-hidden="true" className={lang === "en" ? "text-paper" : "text-muted"}>
        EN
      </span>
      <span aria-hidden="true" className="text-muted">
        /
      </span>
      <span aria-hidden="true" className={lang === "id" ? "text-paper" : "text-muted"}>
        ID
      </span>
      <span className="sr-only">{langName[other]}</span>
    </a>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        aria-label={t("navMain")}
        className="mx-auto flex h-[var(--header-h)] max-w-7xl items-center justify-between gap-2 px-4 md:px-8"
      >
        <Link
          href={localePath(lang, "/")}
          className="group border-line bg-ink/70 flex items-center gap-2 rounded-full border py-1 pr-4 pl-1 backdrop-blur-md"
        >
          <span
            aria-hidden="true"
            className="bg-sakura font-jp text-ink grid size-8 place-items-center rounded-full text-lg font-bold transition-transform group-hover:-rotate-12"
          >
            ア
          </span>
          <span className="font-display hidden text-xs tracking-wider min-[420px]:inline sm:text-sm">
            ALIF SURYADI
          </span>
          <span className="sr-only min-[420px]:hidden">ALIF SURYADI</span>
          <span className="sr-only">, {t("home")}</span>
        </Link>

        <ul className="border-line bg-ink/70 hidden items-center gap-1 rounded-full border px-2 py-1 backdrop-blur-md lg:flex">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={href(l.id)}
                aria-current={home && active === l.id ? "true" : undefined}
                className={`group relative flex flex-col items-center rounded-full px-4 py-1.5 text-sm transition-colors ${
                  home && active === l.id ? "bg-paper text-ink" : "text-paper hover:text-cyan"
                }`}
              >
                <span
                  lang="ja"
                  aria-hidden="true"
                  className="font-jp text-[0.6rem] leading-none opacity-70"
                >
                  {sectionTitles[l.id].ja}
                </span>
                <span className="font-semibold">{t(l.label)}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {langSwitch}
          <button
            type="button"
            onClick={() => setMotionOff(!motionOff)}
            aria-pressed={motionOff}
            className="border-line bg-ink/70 hover:border-cyan flex h-10 items-center gap-2 rounded-full border px-3 text-xs font-semibold backdrop-blur-md max-sm:w-10 max-sm:justify-center max-sm:px-0"
            title={motionOff ? t("motionTitleOff") : t("motionTitleOn")}
          >
            <span
              aria-hidden="true"
              className={`size-2.5 rounded-full ${motionOff ? "bg-muted" : "bg-cyan shadow-[0_0_8px_var(--neon-cyan)]"}`}
            />
            <span className="max-sm:sr-only">{motionOff ? t("motionOff") : t("motionOn")}</span>
            <span className="sr-only">{motionOff ? t("motionOffHint") : t("motionOnHint")}</span>
          </button>
          <a
            href={profile.cv}
            download
            className="border-ink bg-paper text-ink hover:bg-cyan hidden h-10 items-center rounded-full border-2 px-4 text-sm font-bold sm:flex"
            data-magnetic
          >
            CV
          </a>
          <button
            type="button"
            className="border-line bg-ink/70 grid size-10 place-items-center rounded-full border lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">{open ? t("closeMenu") : t("openMenu")}</span>
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h10M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="bg-ink/95 fixed inset-0 top-[var(--header-h)] backdrop-blur-lg lg:hidden"
        >
          <ul className="flex flex-col gap-2 p-6">
            {links.map((l) => (
              <li key={l.id}>
                <a
                  href={href(l.id)}
                  onClick={() => setOpen(false)}
                  className="border-line font-display flex items-baseline justify-between border-b py-4 text-3xl"
                >
                  {t(l.label)}
                  <span lang="ja" aria-hidden="true" className="font-jp text-sakura text-base">
                    {sectionTitles[l.id].ja}
                  </span>
                </a>
              </li>
            ))}
            <li className="pt-4">
              <a href={profile.cv} download className="btn-neon">
                {t("downloadCv")}
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
