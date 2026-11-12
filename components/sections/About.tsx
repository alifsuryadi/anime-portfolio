import Image from "next/image";
import { profile } from "@/content/profile";
import { backdropWords } from "@/content/japanese-phrases";
import { translate, type Lang } from "@/lib/i18n";
import { SectionTitle } from "@/components/anim/SectionTitle";
import { Backdrop } from "@/components/anim/Backdrop";
import { TiltCard } from "@/components/ui/TiltCard";

const FACT_COLORS = ["bg-sakura", "bg-cyan", "bg-sunset"];

/**
 * About, laid out as one page of a colour manga: a tall portrait panel, the
 * bio spoken in two balloons, three slanted fact panels and a closing strip.
 * DOM order is the reading order (title, portrait, bio, facts, elements);
 * the grid only rearranges it from `md` up.
 */
export function About({ lang }: { lang: Lang }) {
  const t = translate(lang);
  const since = 2022;
  // One balloon per sentence. Splits only before a capital, so "Node.js and" stays whole.
  const [lead, ...rest] = profile.bio[lang].split(/(?<=\.)\s+(?=\p{Lu})/u);

  return (
    <section
      id="about"
      data-scene="about"
      aria-labelledby="about-title"
      className="relative px-4 py-28 md:px-8 md:py-40"
    >
      <Backdrop word={backdropWords.about} />
      <SectionTitle id="about" lang={lang} />

      <div className="mx-auto grid max-w-7xl lg:grid-cols-12">
        {/* The right columns stay clear for the 3D character. */}
        <div className="manga-page grid gap-3 p-3 md:grid-cols-12 md:p-4 lg:col-span-9">
          {/* Title panel + first balloon */}
          <div className="manga-panel bg-sakura flex flex-col justify-between gap-5 p-5 md:col-span-7 md:col-start-6 md:row-start-1 md:p-6">
            <div aria-hidden="true" className="burst absolute inset-0" />
            <h2 id="about-title" className="heading-section relative">
              {t("aboutTitleA")} {t("aboutTitleB")}
            </h2>
            <p className="fukidashi relative text-base md:text-lg">{lead}</p>
          </div>

          {/* Portrait panel */}
          <TiltCard className="md:col-span-5 md:col-start-1 md:row-span-2 md:row-start-1">
            <article
              aria-label={t("cardLabel")}
              className="manga-panel bg-night text-paper flex h-full flex-col p-3"
            >
              <div className="flex items-center justify-between text-[0.7rem] font-bold tracking-widest">
                <span aria-hidden="true" className="bg-sakura text-ink px-2 py-0.5">
                  SSR
                </span>
                <span lang="ja" aria-hidden="true" className="font-jp text-cyan">
                  キャラクター紹介
                </span>
              </div>
              <div className="border-paper bg-ink relative mt-3 min-h-64 flex-1 overflow-hidden border-2">
                <Image
                  src={profile.photo}
                  alt={t("photoAlt")}
                  fill
                  sizes="(min-width: 1024px) 24rem, 90vw"
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
              <div className="mt-3 flex items-end justify-between gap-3">
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
            </article>
          </TiltCard>

          {/* Second balloon, on cyan screentone */}
          {rest.length > 0 && (
            <div className="manga-panel bg-cyan/25 grid place-items-center p-5 md:col-span-7 md:col-start-6 md:row-start-2 md:p-6">
              <div aria-hidden="true" className="halftone text-cyan absolute inset-0 opacity-60" />
              <p className="fukidashi relative text-base md:text-lg">{rest.join(" ")}</p>
            </div>
          )}

          {/* Three facts: slanted panels, one flat colour each */}
          <dl className="grid gap-3 md:col-span-12 md:grid-cols-3 md:px-3">
            {profile.facts.map((f, i) => (
              <div
                key={f.label.en}
                className={`manga-panel ${FACT_COLORS[i % 3]} p-4 md:-skew-x-6`}
              >
                <div className="md:skew-x-6">
                  <dt>
                    <span className="bg-ink text-paper inline-block px-2 py-1 text-xs leading-none font-bold">
                      {f.label[lang]}
                    </span>
                  </dt>
                  <dd className="mt-2 leading-snug font-bold">{f.value[lang]}</dd>
                </div>
              </div>
            ))}
          </dl>

          {/* Closing strip: the four elements */}
          <div className="manga-panel bg-night text-paper p-4 md:col-span-12">
            <p className="text-muted text-xs font-bold">{t("elements")}</p>
            <ul className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
              {profile.elements.map((e) => (
                <li
                  key={e.label}
                  className="bg-ink flex items-center gap-2.5 border-2 p-2"
                  style={{ borderColor: e.color }}
                >
                  <span
                    lang="ja"
                    aria-hidden="true"
                    className="font-jp grid size-8 shrink-0 place-items-center rounded-full border-2 text-xs font-bold"
                    style={{ borderColor: e.color, color: e.color }}
                  >
                    {e.jp}
                  </span>
                  <span className="text-xs leading-tight font-semibold">{e.label}</span>
                </li>
              ))}
            </ul>
            <a
              href="#achievements"
              className="hover:text-cyan mt-4 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
            >
              {t("aboutMore")} <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
