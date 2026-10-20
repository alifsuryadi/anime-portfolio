export const profile = {
  name: "Alif Suryadi",
  nameJa: "アリフ・スルヤディ",
  role: "Full-Stack Developer & Machine Learning Enthusiast",
  shortRole: "Full-Stack Developer",
  location: "Indonesia",
  bio: "Self-taught Full-Stack Developer yang membangun teknologi yang memberi nilai dan membantu orang mencapai tujuannya. Sejak 2022 membantu pemilik bisnis lokal membuat website yang menarik, aksesibel, dan cepat. Aktif mendalami Machine Learning untuk memperkuat proyek-proyeknya.",
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
