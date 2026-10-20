import { backdropWords } from "@/content/japanese-phrases";
import { profile, socials } from "@/content/profile";
import { SectionTitle } from "@/components/anim/SectionTitle";
import { Backdrop } from "@/components/anim/Backdrop";
import { ContactForm } from "@/components/ui/ContactForm";

export function Contact() {
  return (
    <section id="contact" data-scene="contact" aria-labelledby="contact-title" className="relative px-4 py-28 md:px-8 md:py-40">
      <Backdrop word={backdropWords.contact} />
      <SectionTitle id="contact" />
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 id="contact-title" className="heading-section">
            Ayo bikin <span className="text-sakura">episode</span> berikutnya
          </h2>
          <p className="mt-6 max-w-xl text-lg text-paper/90">
            Punya ide website, aplikasi, atau fitur AI? Ceritakan saja. Saya biasanya membalas dalam 1–2 hari.
          </p>
          <div className="mt-10 border-2 border-paper bg-night/80 p-5 shadow-[10px_10px_0_var(--neon-cyan)] backdrop-blur-sm md:p-8">
            <ContactForm />
          </div>
        </div>
        <div className="flex flex-col justify-end gap-6 lg:col-span-5 lg:pb-4">
          {/* speech bubble from the character */}
          <div aria-hidden="true" className="relative ml-auto hidden w-fit rotate-2 border-2 border-ink bg-paper px-5 py-3 text-ink lg:block">
            <p lang="ja" className="font-jp text-lg font-bold">お待ちしています!</p>
            <p className="text-xs">Saya tunggu pesanmu!</p>
            <span className="absolute -bottom-3 left-8 size-5 rotate-45 border-r-2 border-b-2 border-ink bg-paper" />
          </div>
          <ul className="flex flex-col gap-3 rounded-sm bg-ink/70 p-4 backdrop-blur-sm lg:mt-[30vh]">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="glitch font-display text-3xl md:text-4xl"
                  data-text={s.label}
                >
                  {s.label}
                  <span className="sr-only">{s.href.startsWith("http") ? " (tab baru)" : `: ${profile.email}`}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
