import Image from "next/image";
import { profile } from "@/content/profile";
import { backdropWords } from "@/content/japanese-phrases";
import { SectionTitle } from "@/components/anim/SectionTitle";
import { Backdrop } from "@/components/anim/Backdrop";
import { TiltCard } from "@/components/ui/TiltCard";
import { StatBars } from "@/components/ui/StatBars";

export function About() {
  const since = 2022;
  return (
    <section id="about" data-scene="about" aria-labelledby="about-title" className="relative px-4 py-28 md:px-8 md:py-40">
      <Backdrop word={backdropWords.about} />
      <SectionTitle id="about" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-12">
        {/* Character profile card */}
        <TiltCard className="mx-auto w-full max-w-sm lg:col-span-4">
          <article
            aria-label="Kartu profil karakter"
            className="relative overflow-hidden border-2 border-paper bg-night p-4 shadow-[10px_10px_0_var(--sakura)]"
          >
            <div className="flex items-center justify-between text-[0.7rem] font-bold tracking-widest">
              <span className="bg-sakura px-2 py-0.5 text-ink">SSR</span>
              <span lang="ja" aria-hidden="true" className="font-jp text-cyan">
                キャラクター紹介
              </span>
            </div>
            <div className="relative mt-3 aspect-square overflow-hidden border-2 border-paper bg-ink">
              <Image
                src={profile.photo}
                alt="Foto Alif Suryadi"
                fill
                sizes="(min-width: 1024px) 24rem, 80vw"
                className="object-cover"
              />
              <div aria-hidden="true" className="halftone absolute inset-x-0 bottom-0 h-1/3 text-sakura/40" />
              <span
                aria-hidden="true"
                lang="ja"
                className="vertical-jp absolute top-2 right-2 bg-ink/80 px-1 py-2 text-sm font-bold text-paper"
              >
                {profile.nameJa}
              </span>
            </div>
            <div className="mt-4 flex items-end justify-between gap-3">
              <div>
                <p className="font-display text-xl leading-none">{profile.name}</p>
                <p className="mt-1 text-sm text-cyan">Class: {profile.characterClass}</p>
              </div>
              <p className="text-right text-xs text-muted">
                Aktif sejak
                <span className="block font-display text-lg text-paper">{since}</span>
              </p>
            </div>
            <div className="mt-4 border-t border-line pt-4">
              <StatBars stats={profile.stats} />
            </div>
          </article>
        </TiltCard>

        <div className="lg:col-span-5">
          <h2 id="about-title" className="heading-section">
            Tentang <span className="text-sakura">saya</span>
          </h2>
          <div className="mt-6 space-y-4 rounded-sm bg-ink/60 p-1 text-lg leading-relaxed text-paper/90 backdrop-blur-[2px]">
            <p>{profile.bio}</p>
            <p className="text-base text-muted">
              Tiap proyek saya perlakukan seperti episode baru: ada masalah yang perlu dipecahkan, karakter (pengguna) yang
              perlu dibantu, dan akhir yang bikin puas.
            </p>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2 text-sm">
            <li className="chip">Self-taught</li>
            <li className="chip">Full-Stack</li>
            <li className="chip">Machine Learning</li>
            <li className="chip">Indonesia</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
