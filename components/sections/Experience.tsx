import { experience } from "@/content/experience";
import { backdropWords } from "@/content/japanese-phrases";
import { SectionTitle } from "@/components/anim/SectionTitle";
import { Backdrop } from "@/components/anim/Backdrop";
import { Timeline } from "@/components/ui/Timeline";

export function Experience() {
  return (
    <section id="experience" data-scene="experience" aria-labelledby="experience-title" className="relative px-4 py-28 md:px-8 md:py-40">
      <Backdrop word={backdropWords.experience} />
      <SectionTitle id="experience" side="right" />
      <div className="mx-auto max-w-7xl">
        <h2 id="experience-title" className="heading-section max-w-3xl">
          Jalur <span className="text-sunset">perjalanan</span>
        </h2>
        <p className="mt-6 mb-16 max-w-xl text-lg text-paper/90">
          Seperti naik kereta di Tokyo: tiap stasiun adalah satu babak. Gulir untuk menjalankan keretanya.
        </p>
        <div className="lg:w-2/3">
          <Timeline stations={experience} />
        </div>
      </div>
    </section>
  );
}
