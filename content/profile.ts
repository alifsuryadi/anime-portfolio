import type { L10n } from "@/lib/i18n";

export const profile = {
  name: "Alif Suryadi",
  nameJa: "アリフ・スルヤディ",
  role: "Full-Stack Developer & Machine Learning Enthusiast",
  shortRole: "Full-Stack Developer",
  location: "Indonesia",
  bio: {
    en: "Self-taught Full-Stack Developer who builds technology that creates value and helps people reach their goals. Since 2022 I've been helping local business owners launch websites that look great, stay accessible and load fast. I'm actively diving into Machine Learning to make my projects even stronger. Today I'm the founder, CEO and solo developer of Livales, and I work as a Full-Stack Developer on projects such as BKI's new website and Sekalipay.",
    id: "Self-taught Full-Stack Developer yang membangun teknologi yang memberi nilai dan membantu orang mencapai tujuannya. Sejak 2022 membantu pemilik bisnis lokal membuat website yang menarik, aksesibel, dan cepat. Aktif mendalami Machine Learning untuk memperkuat proyek-proyeknya. Kini menjadi founder, CEO, sekaligus solo developer Livales, serta Full-Stack Developer di proyek seperti website baru BKI dan Sekalipay.",
  } satisfies L10n,
  email: "alifsuryadi037@gmail.com",
  github: "https://github.com/alifsuryadi",
  linkedin: "https://www.linkedin.com/in/alifsuryadi/",
  cv: "/AlifSuryadi-Resume.pdf",
  photo: "/profile.webp",
  /** RPG flavour for the character profile card. Edit freely. */
  characterClass: "Full-Stack Mage",
  /** Stat bars on the profile card (0–100). These are self-assessments, edit to taste. */
  stats: [
    { label: "Frontend", jp: "前衛", value: 90 },
    { label: "Backend", jp: "後衛", value: 85 },
    { label: "Machine Learning", jp: "機械学習", value: 72 },
    { label: "Cloud & DevOps", jp: "雲", value: 70 },
  ],
} as const;

export const socials = [
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "Email", href: `mailto:${profile.email}` },
] as const;
