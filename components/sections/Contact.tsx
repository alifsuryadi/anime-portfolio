import { backdropWords } from "@/content/japanese-phrases";
import { profile, socials } from "@/content/profile";
import { translate, type Lang } from "@/lib/i18n";
import { SectionTitle } from "@/components/anim/SectionTitle";
import { Backdrop } from "@/components/anim/Backdrop";
import { ContactForm } from "@/components/ui/ContactForm";

export function Contact({ lang }: { lang: Lang }) {
  const t = translate(lang);
  return (
    <section
      id="contact"
      data-scene="contact"
      aria-labelledby="contact-title"
      className="relative px-4 py-28 md:px-8 md:py-40"
    >
      <Backdrop word={backdropWords.contact} />
      <SectionTitle id="contact" lang={lang} />
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 id="contact-title" className="heading-section">
            {t("contactTitleA")} <span className="text-sakura">{t("contactTitleB")}</span>
          </h2>
          <p className="text-paper/90 bg-ink/60 mt-6 max-w-xl rounded-sm p-1 text-lg backdrop-blur-[2px]">
            {t("contactIntro")}
          </p>
          <div className="border-paper bg-night/80 mt-10 border-2 p-5 shadow-[10px_10px_0_var(--neon-cyan)] backdrop-blur-sm md:p-8">
            <ContactForm />
          </div>
          <ul className="mt-12 flex flex-wrap gap-x-10 gap-y-3">
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
                  <span className="sr-only">
                    {s.href.startsWith("http") ? t("newTab") : `: ${profile.email}`}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        {/* Right columns stay clear for the character; the speech bubble is hers. */}
        <div className="relative hidden lg:col-span-5 lg:block">
          <div
            aria-hidden="true"
            className="border-ink bg-paper text-ink sticky top-[22vh] ml-auto w-fit rotate-2 border-2 px-5 py-3"
          >
            <p lang="ja" className="font-jp text-lg font-bold">
              お待ちしています!
            </p>
            <p className="text-xs">{t("bubble")}</p>
            <span className="border-ink bg-paper absolute -bottom-3 left-8 size-5 rotate-45 border-r-2 border-b-2" />
          </div>
        </div>
      </div>
    </section>
  );
}
