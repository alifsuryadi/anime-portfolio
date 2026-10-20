import type { L10n } from "@/lib/i18n";

export type Phrase = { ja: string; translation: L10n };

export const heroPhrases: Phrase[] = [
  {
    ja: "フルスタック開発者",
    translation: { en: "Full-Stack Developer", id: "Full-Stack Developer" },
  },
  {
    ja: "夢を形にする",
    translation: { en: "Turning dreams into reality", id: "Mewujudkan mimpi jadi nyata" },
  },
  { ja: "コードは魔法だ", translation: { en: "Code is magic", id: "Kode adalah sihir" } },
  {
    ja: "機械学習エンジニア",
    translation: { en: "Machine Learning Engineer", id: "Machine Learning Engineer" },
  },
  { ja: "よろしくお願いします", translation: { en: "Nice to meet you", id: "Senang berkenalan" } },
];

/** Vertical section titles. `id` matches the section's DOM id. */
export const sectionTitles = {
  hero: { ja: "始まり", translation: { en: "Beginning", id: "Awal" } },
  about: { ja: "自己紹介", translation: { en: "About me", id: "Tentang saya" } },
  skills: { ja: "技術", translation: { en: "Skills", id: "Keahlian" } },
  projects: { ja: "作品", translation: { en: "Work", id: "Karya" } },
  experience: { ja: "経験", translation: { en: "Journey", id: "Pengalaman" } },
  achievements: { ja: "実績", translation: { en: "Achievements", id: "Pencapaian" } },
  contact: { ja: "連絡", translation: { en: "Contact", id: "Kontak" } },
  footer: { ja: "終わり", translation: { en: "The end", id: "Akhir" } },
} as const;

export type SectionId = keyof typeof sectionTitles;

/** Large parallax background words per section (decorative, aria-hidden). */
export const backdropWords: Record<SectionId, string> = {
  hero: "黄昏",
  about: "物語",
  skills: "魔法",
  projects: "漫画",
  experience: "旅路",
  achievements: "勲章",
  contact: "手紙",
  footer: "感謝",
};

/** Glyph pool for the decode/scramble effect. */
export const KATAKANA =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ";
