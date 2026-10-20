import Image from "next/image";
import { profile } from "@/content/profile";
import { backdropWords } from "@/content/japanese-phrases";
import { translate, type Lang } from "@/lib/i18n";
import { SectionTitle } from "@/components/anim/SectionTitle";
import { Backdrop } from "@/components/anim/Backdrop";
import { TiltCard } from "@/components/ui/TiltCard";
import { StatBars } from "@/components/ui/StatBars";

export function About({ lang }: { lang: Lang }) {
  const t = translate(lang);
  const since = 2022;
  return (
    <section
      id="about"
      data-scene="about"
      aria-labelledby="about-title"
      className="relative px-4 py-28 md:px-8 md:py-40"
    >
      <Backdrop word={backdropWords.about} />
      <SectionTitle id="about" lang={lang} />

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-12">
        {/* Character profile card */}
        <TiltCard className="mx-auto w-full max-w-sm lg:col-span-4">
          <article
            aria-label={t("cardLabel")}
            className="border-paper bg-night relative overflow-hidden border-2 p-4 shadow-[10px_10px_0_var(--sakura)]"
          >
            <div className="flex items-center justify-between text-[0.7rem] font-bold tracking-widest">
              <span aria-hidden="true" className="bg-sakura text-ink px-2 py-0.5">
                SSR
              </span>
              <span lang="ja" aria-hidden="true" className="font-jp text-cyan">
                キャラクター紹介
              </span>
            </div>
            <div className="border-paper bg-ink relative mt-3 aspect-square overflow-hidden border-2">
              <Image
                src={profile.photo}
                alt={t("photoAlt")}
                fill
                sizes="(min-width: 1024px) 24rem, 80vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="halftone text-sakura/40 absolute inset-x-0 bottom-0 h-1/3"
              />
              <span
                aria-hidden="true"
                lang="ja"
                className="vertical-jp bg-ink/80 text-paper absolute top-2 right-2 px-1 py-2 text-sm font-bold"
              >
                {profile.nameJa}
              </span>
            </div>
            <div className="mt-4 flex items-end justify-between gap-3">
              <div>
                <p className="font-display text-xl leading-none">{profile.name}</p>
                <p className="text-cyan mt-1 text-sm">
                  {t("classLabel")}: {profile.characterClass}
                </p>
              </div>
              <p className="text-muted text-right text-xs">
                {t("activeSince")}
                <span className="font-display text-paper block text-lg">{since}</span>
              </p>
            </div>
            <div className="border-line mt-4 border-t pt-4">
              <StatBars stats={profile.stats} />
            </div>
          </article>
        </TiltCard>

        <div className="lg:col-span-5">
          <h2 id="about-title" className="heading-section">
            {t("aboutTitleA")} <span className="text-sakura">{t("aboutTitleB")}</span>
          </h2>
          <p className="bg-ink/60 mt-6 rounded-sm p-1 text-lg leading-relaxed backdrop-blur-[2px]">
            {profile.bio[lang]}
          </p>
          <dl className="mt-8 grid gap-3">
            {profile.facts.map((f, i) => (
              <div
                key={f.label.en}
                className="bg-ink/75 grid grid-cols-[6.5rem_1fr] items-baseline gap-3 border-l-2 p-3 backdrop-blur-sm"
                style={{
                  borderColor: ["var(--sakura)", "var(--neon-cyan)", "var(--sunset)"][i % 3],
                }}
              >
                <dt className="text-muted text-xs font-bold tracking-widest uppercase">
                  {f.label[lang]}
                </dt>
                <dd className="font-semibold">{f.value[lang]}</dd>
              </div>
            ))}
          </dl>
          <a
            href="#achievements"
            className="hover:text-cyan mt-6 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
          >
            {t("aboutMore")} <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
