import { backdropWords } from "@/content/japanese-phrases";
import { profile } from "@/content/profile";
import { translate, type Lang } from "@/lib/i18n";
import { SectionTitle } from "@/components/anim/SectionTitle";
import { Backdrop } from "@/components/anim/Backdrop";

const ACCENTS = ["var(--sakura)", "var(--neon-cyan)", "var(--sunset)", "#B48CFF"];

/** Education, honors, languages and certifications, shown as a badge collection. */
export function Achievements({ lang }: { lang: Lang }) {
  const t = translate(lang);
  return (
    <section
      id="achievements"
      data-scene="achievements"
      aria-labelledby="achievements-title"
      className="relative px-4 py-28 md:px-8 md:py-40"
    >
      <Backdrop word={backdropWords.achievements} />
      <SectionTitle id="achievements" side="right" lang={lang} />
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12">
        {/* Left columns stay clear for the cheering character. */}
        <div aria-hidden="true" className="hidden lg:col-span-4 lg:block" />
        <div className="lg:col-span-8">
          <h2 id="achievements-title" className="heading-section">
            {t("achTitleA")} <span className="text-sunset">{t("achTitleB")}</span>
          </h2>
          <p className="text-paper/90 bg-ink/60 mt-6 max-w-xl rounded-sm p-1 text-lg backdrop-blur-[2px]">
            {t("achIntro")}
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <article className="border-sakura bg-ink/80 border-2 p-5 shadow-[6px_6px_0_var(--sakura)] backdrop-blur-sm">
              <h3 className="text-muted text-xs font-bold tracking-widest uppercase">
                {t("education")}
              </h3>
              <p className="font-display mt-3 text-lg leading-tight">
                {profile.education.degree[lang]}
              </p>
              <p className="text-paper/80 mt-2 text-sm">{profile.education.school}</p>
              <p className="text-muted mt-1 text-xs">{profile.education.period}</p>
              <p className="text-sakura mt-3 text-sm font-bold">{profile.education.gpa}</p>
            </article>
            <article className="border-sunset bg-ink/80 border-2 p-5 shadow-[6px_6px_0_var(--sunset)] backdrop-blur-sm">
              <h3 className="text-muted text-xs font-bold tracking-widest uppercase">
                {t("honors")}
              </h3>
              <ul className="mt-3 space-y-2">
                {profile.honors.map((h) => (
                  <li key={h.en} className="font-display text-lg leading-tight">
                    <span aria-hidden="true" className="text-sunset mr-1">
                      ★
                    </span>
                    {h[lang]}
                  </li>
                ))}
              </ul>
            </article>
            <article className="border-cyan bg-ink/80 border-2 p-5 shadow-[6px_6px_0_var(--neon-cyan)] backdrop-blur-sm">
              <h3 className="text-muted text-xs font-bold tracking-widest uppercase">
                {t("languages")}
              </h3>
              <ul className="mt-3 space-y-1.5">
                {profile.languages.map((l) => (
                  <li key={l.en} className="font-semibold">
                    {l[lang]}
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <h3 className="text-muted mt-14 text-xs font-bold tracking-widest uppercase">
            {t("certifications")} · {profile.certifications.length}
          </h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {profile.certifications.map((c, i) => {
              const color = ACCENTS[i % ACCENTS.length];
              return (
                <li
                  key={c.name}
                  className="bg-ink/80 group flex items-center gap-4 border p-3 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
                  style={{ borderColor: "var(--line)" }}
                >
                  <span
                    aria-hidden="true"
                    className="grid size-11 shrink-0 rotate-45 place-items-center border-2 transition-transform duration-300 group-hover:rotate-[225deg]"
                    style={{ borderColor: color, boxShadow: `0 0 12px ${color}` }}
                  >
                    <span className="-rotate-45 text-sm" style={{ color }}>
                      ✦
                    </span>
                  </span>
                  <span className="min-w-0">
                    <span className="block leading-snug font-semibold">{c.name}</span>
                    <span className="text-muted block text-xs">
                      {c.issuer} · {c.date}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
