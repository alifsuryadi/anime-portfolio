import { experience } from "@/content/experience";
import { backdropWords } from "@/content/japanese-phrases";
import { translate, type Lang } from "@/lib/i18n";
import { SectionTitle } from "@/components/anim/SectionTitle";
import { Backdrop } from "@/components/anim/Backdrop";
import { Timeline } from "@/components/ui/Timeline";

export function Experience({ lang }: { lang: Lang }) {
  const t = translate(lang);
  return (
    <section
      id="experience"
      data-scene="experience"
      aria-labelledby="experience-title"
      className="relative px-4 py-28 md:px-8 md:py-40"
    >
      <Backdrop word={backdropWords.experience} />
      <SectionTitle id="experience" side="right" lang={lang} />
      <div className="mx-auto max-w-7xl">
        <h2 id="experience-title" className="heading-section max-w-3xl">
          {t("expTitleA")} <span className="text-sunset">{t("expTitleB")}</span>
        </h2>
        <p className="text-paper/90 bg-ink/60 mt-6 mb-16 max-w-xl rounded-sm p-1 text-lg backdrop-blur-[2px]">
          {t("expIntro")}
        </p>
        <div className="lg:w-2/3">
          <Timeline stations={experience.filter((s) => s.featured !== false)} />
          <div className="mt-20 ml-4 md:ml-10">
            <h3 className="text-muted text-xs font-bold tracking-widest uppercase">
              {t("earlierStops")}
            </h3>
            <ul className="mt-4 grid gap-2">
              {experience
                .filter((s) => s.featured === false)
                .map((s) => (
                  <li
                    key={s.id}
                    className="bg-ink/75 border-line grid gap-x-4 gap-y-0.5 border-l-2 px-4 py-2.5 backdrop-blur-sm sm:grid-cols-[1fr_auto]"
                  >
                    <span>
                      <span className="font-semibold">{s.title}</span>
                      <span className="text-cyan"> · {s.org}</span>
                    </span>
                    <span className="text-muted text-xs sm:self-center">
                      <time>{s.period[lang]}</time>
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
