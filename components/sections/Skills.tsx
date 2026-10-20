import { backdropWords } from "@/content/japanese-phrases";
import { skills } from "@/content/skills";
import { SectionTitle } from "@/components/anim/SectionTitle";
import { Backdrop } from "@/components/anim/Backdrop";
import { SkillTree } from "@/components/ui/SkillTree";

export function Skills() {
  return (
    <section id="skills" data-scene="skills" aria-labelledby="skills-title" className="relative px-4 py-28 md:px-8 md:py-40">
      <Backdrop word={backdropWords.skills} />
      <SectionTitle id="skills" side="right" />
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="skills-title" className="heading-section">
            Skill <span className="text-cyan">tree</span>
          </h2>
          <p className="mt-6 max-w-sm text-lg leading-relaxed text-paper/90">
            {skills.length} skill yang sudah terbuka di perjalanan ini. Arahkan kursor ke sebuah node untuk menyalakan
            jalurnya, klik untuk membaca deskripsinya.
          </p>
          <p className="mt-4 max-w-sm text-sm text-muted">
            Tiap cabang punya orb sendiri yang mengorbit karakter. Coba lihat orb yang menyala saat kamu memilih cabang.
          </p>
        </div>
        <div className="rounded-sm bg-ink/70 p-5 ring-1 ring-line backdrop-blur-sm md:p-8 lg:col-span-8">
          <SkillTree />
        </div>
      </div>
    </section>
  );
}
