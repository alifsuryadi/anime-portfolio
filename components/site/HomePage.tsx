import type { Lang } from "@/lib/i18n";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Achievements } from "@/components/sections/Achievements";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export function HomePage({ lang }: { lang: Lang }) {
  return (
    <>
      <main id="main" className="relative z-10">
        <Hero lang={lang} />
        <About lang={lang} />
        <Skills lang={lang} />
        <Projects />
        <Experience lang={lang} />
        <Achievements lang={lang} />
        <Contact lang={lang} />
      </main>
      <Footer />
    </>
  );
}
