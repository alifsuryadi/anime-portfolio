export type Phrase = { ja: string; translation: string };

export const heroPhrases: Phrase[] = [
  { ja: "フルスタック開発者", translation: "Full-Stack Developer" },
  { ja: "夢を形にする", translation: "Mewujudkan mimpi jadi nyata" },
  { ja: "コードは魔法だ", translation: "Kode adalah sihir" },
  { ja: "機械学習エンジニア", translation: "Machine Learning Engineer" },
  { ja: "よろしくお願いします", translation: "Senang berkenalan" },
];

/** Vertical section titles. `id` matches the section's DOM id. */
export const sectionTitles = {
  hero: { ja: "始まり", translation: "Awal" },
  about: { ja: "自己紹介", translation: "Tentang saya" },
  skills: { ja: "技術", translation: "Keahlian" },
  projects: { ja: "作品", translation: "Karya" },
  experience: { ja: "経験", translation: "Pengalaman" },
  contact: { ja: "連絡", translation: "Kontak" },
  footer: { ja: "終わり", translation: "Akhir" },
} as const;

export type SectionId = keyof typeof sectionTitles;

/** Large parallax background words per section (decorative, aria-hidden). */
export const backdropWords: Record<SectionId, string> = {
  hero: "黄昏",
  about: "物語",
  skills: "魔法",
  projects: "漫画",
  experience: "旅路",
  contact: "手紙",
  footer: "感謝",
};

/** Glyph pool for the decode/scramble effect. */
export const KATAKANA =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ";
