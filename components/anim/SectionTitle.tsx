import { sectionTitles, type SectionId } from "@/content/japanese-phrases";
import { DecodeText } from "./DecodeText";

/** Vertical Japanese section marker on the screen edge. Decorative. */
export function SectionTitle({ id, side = "left" }: { id: SectionId; side?: "left" | "right" }) {
  const t = sectionTitles[id];
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-auto absolute top-24 hidden flex-col items-center gap-3 md:flex ${
        side === "left" ? "left-4 lg:left-8" : "right-4 lg:right-8"
      }`}
    >
      <span className="h-16 w-px bg-sakura" />
      <DecodeText text={t.ja} hover className="vertical-jp text-2xl font-bold text-paper lg:text-3xl" />
      <span className="vertical-jp text-[0.7rem] tracking-[0.3em] text-muted" style={{ textOrientation: "mixed" }}>
        {t.translation.toUpperCase()}
      </span>
    </div>
  );
}
