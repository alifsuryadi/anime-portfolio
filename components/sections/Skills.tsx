import { backdropWords } from "@/content/japanese-phrases";
import { skills } from "@/content/skills";
import { translate, type Lang } from "@/lib/i18n";
import { SectionTitle } from "@/components/anim/SectionTitle";
import { Backdrop } from "@/components/anim/Backdrop";
import { SkillTree } from "@/components/ui/SkillTree";

export function Skills({ lang }: { lang: Lang }) {
  const t = translate(lang);
  return (
    <section
      id="skills"
      data-scene="skills"
      aria-labelledby="skills-title"
      className="relative px-4 py-28 md:px-8 md:py-40"
    >
      <Backdrop word={backdropWords.skills} />
      <SectionTitle id="skills" side="right" lang={lang} />
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12">
        {/* Left columns stay clear for the character and its orbiting skill orbs. */}
        <div aria-hidden="true" className="hidden lg:col-span-4 lg:block" />
        <div className="lg:col-span-8">
          <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-end">
            <h2 id="skills-title" className="heading-section">
              Skill <span className="text-cyan">tree</span>
            </h2>
            <p className="bg-ink/75 text-paper/90 max-w-md rounded-sm p-3 text-base leading-relaxed backdrop-blur-sm">
              {skills.length} {t("skillsIntro")}
            </p>
          </div>
          <div className="bg-ink/75 ring-line mt-8 rounded-sm p-5 ring-1 backdrop-blur-sm md:p-8">
            <SkillTree />
          </div>
        </div>
      </div>
    </section>
  );
}
