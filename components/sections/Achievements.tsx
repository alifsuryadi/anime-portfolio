import { backdropWords } from "@/content/japanese-phrases";
import { profile } from "@/content/profile";
import { translate, type Lang } from "@/lib/i18n";
import { DecodeText } from "@/components/anim/DecodeText";
import { ChibiArt } from "@/components/ui/ChibiArt";
import { GachaDeck } from "@/components/ui/GachaDeck";

/**
 * Education, honors and languages as manga info cards, plus the
 * certifications as a gacha deck. A light paper page breaks the run of dark
 * sections after the journey.
 */
export function Achievements({ lang }: { lang: Lang }) {
  const t = translate(lang);
  return (
    <section
      id="achievements"
      data-scene="achievements"
      data-covers-canvas
      aria-labelledby="achievements-title"
      className="bg-paper text-ink relative z-10 overflow-hidden px-4 py-24 md:px-8 md:py-32"
    >
      <div
        aria-hidden="true"
        className="halftone text-sakura/20 pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden="true"
        lang="ja"
        data-word={backdropWords.achievements}
        className="font-jp text-ink/[0.05] pointer-events-none absolute inset-x-0 top-10 text-center text-[30vw] leading-none font-bold whitespace-nowrap select-none before:content-[attr(data-word)]"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-end gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <p className="flex items-center gap-3 text-sm font-bold tracking-widest">
              <DecodeText text="実績" className="font-jp text-sakura text-2xl" />
              <span>{t("navAchievements").toUpperCase()}</span>
            </p>
            <h2 id="achievements-title" className="heading-section mt-3">
              {t("achTitleA")} <span className="text-sakura">{t("achTitleB")}</span>
            </h2>
            <p className="mt-5 max-w-xl text-lg font-medium">{t("achIntro")}</p>
          </div>
          <div aria-hidden="true" className="chibi-bounce hidden h-48 md:block">
            <ChibiArt
              pose="cheer"
              happy
              className="h-full w-auto drop-shadow-[6px_6px_0_var(--ink)]"
            />
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <article className="border-ink bg-paper border-[3px] p-5 shadow-[8px_8px_0_var(--sakura)]">
            <h3 className="text-ink/60 text-xs font-bold tracking-widest uppercase">
              {t("education")}
            </h3>
            <p className="font-display mt-3 text-xl leading-tight">
              {profile.education.degree[lang]}
            </p>
            <p className="mt-2 text-sm">{profile.education.school}</p>
            <p className="text-ink/60 mt-1 text-xs">{profile.education.period}</p>
            <p className="bg-ink text-paper mt-4 inline-block px-2 py-0.5 text-sm font-bold">
              {profile.education.gpa}
            </p>
          </article>
          <article className="border-ink bg-sunset border-[3px] p-5 shadow-[8px_8px_0_var(--ink)]">
            <h3 className="text-ink/70 text-xs font-bold tracking-widest uppercase">
              {t("honors")}
            </h3>
            <ul className="mt-3 space-y-2">
              {profile.honors.map((h) => (
                <li key={h.en} className="font-display text-xl leading-tight">
                  <span aria-hidden="true" className="mr-1">
                    ★
                  </span>
                  {h[lang]}
                </li>
              ))}
            </ul>
          </article>
          <article className="border-ink bg-paper border-[3px] p-5 shadow-[8px_8px_0_var(--neon-cyan)]">
            <h3 className="text-ink/60 text-xs font-bold tracking-widest uppercase">
              {t("languages")}
            </h3>
            <ul className="mt-3 space-y-1.5 font-semibold">
              {profile.languages.map((l) => (
                <li key={l.en}>{l[lang]}</li>
              ))}
            </ul>
          </article>
        </div>

        <h3 className="font-display mt-16 text-2xl">
          {t("certifications")}{" "}
          <span className="text-sakura">× {profile.certifications.length}</span>
        </h3>
        <div className="mt-4">
          <GachaDeck certs={profile.certifications} />
        </div>
      </div>
    </section>
  );
}
