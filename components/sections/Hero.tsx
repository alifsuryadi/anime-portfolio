import { heroPhrases, backdropWords } from "@/content/japanese-phrases";
import { profile } from "@/content/profile";
import { translate, type Lang } from "@/lib/i18n";
import { KanjiScramble } from "@/components/anim/KanjiScramble";
import { SplitText } from "@/components/anim/SplitText";
import { SectionTitle } from "@/components/anim/SectionTitle";
import { Backdrop } from "@/components/anim/Backdrop";

export function Hero({ lang }: { lang: Lang }) {
  const t = translate(lang);
  return (
    <section
      id="hero"
      data-scene="hero"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-4 pt-[var(--header-h)] pb-10 md:px-8"
    >
      <Backdrop word={backdropWords.hero} />
      <SectionTitle id="hero" side="right" lang={lang} />

      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
          <span className="chip border-sakura/60 text-paper">
            <span aria-hidden="true" className="text-sakura mr-1">
              ●
            </span>
            {t("heroOpen")}
          </span>
          <span className="chip text-muted">{profile.location}</span>
        </div>

        <h1 id="hero-title" className="display-xl">
          <SplitText text="ALIF" className="text-paper block" />
          <SplitText
            text="SURYADI"
            className="text-outline block"
            letterClassName="hover:text-sakura"
          />
          <span className="sr-only"> · {profile.role}</span>
        </h1>

        <div className="mt-6 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-xl">
            <KanjiScramble
              phrases={heroPhrases}
              label={t("heroRoleLabel")}
              className="text-cyan text-2xl md:text-4xl"
              translationClassName="mt-1 text-sm tracking-[0.2em] text-muted uppercase"
            />
            <p className="text-paper/90 mt-5 text-base leading-relaxed md:text-lg">
              {profile.role}. {t("heroLine")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="#projects" className="btn-neon" data-magnetic>
              {t("heroCta")} <span aria-hidden="true">→</span>
            </a>
            <a href={profile.cv} download className="btn-neon btn-neon--cyan" data-magnetic>
              {t("downloadCv")}
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator: a kunai that keeps diving */}
      <a
        href="#about"
        className="text-muted absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs md:flex"
      >
        <span lang="ja" aria-hidden="true" className="vertical-jp text-[0.7rem]">
          スクロール
        </span>
        <svg viewBox="0 0 20 60" className="scroll-kunai h-12 w-4" aria-hidden="true">
          <circle cx="10" cy="5" r="4" fill="none" stroke="var(--paper)" strokeWidth="2" />
          <rect x="8" y="9" width="4" height="18" fill="var(--sakura)" />
          <path d="M10 27 L17 36 L10 58 L3 36 Z" fill="var(--paper)" />
          <path d="M10 30 L10 54" stroke="var(--ink)" strokeWidth="1" />
        </svg>
        <span className="sr-only">{t("heroScroll")}</span>
      </a>
    </section>
  );
}
