import { sectionTitles, type SectionId } from "@/content/japanese-phrases";
import type { Lang } from "@/lib/i18n";
import { DecodeText } from "./DecodeText";

/** Vertical Japanese section marker on the screen edge. Decorative. */
export function SectionTitle({
  id,
  side = "left",
  lang,
}: {
  id: SectionId;
  side?: "left" | "right";
  lang: Lang;
}) {
  const t = sectionTitles[id];
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-auto absolute top-24 hidden flex-col items-center gap-3 md:flex ${
        side === "left" ? "left-4 lg:left-8" : "right-4 lg:right-8"
      }`}
    >
      <span className="bg-sakura h-16 w-px" />
      <DecodeText
        text={t.ja}
        hover
        className="vertical-jp text-paper text-2xl font-bold lg:text-3xl"
      />
      <span
        className="vertical-jp text-muted text-[0.7rem] tracking-[0.3em]"
        style={{ textOrientation: "mixed" }}
      >
        {t.translation[lang].toUpperCase()}
      </span>
    </div>
  );
}
