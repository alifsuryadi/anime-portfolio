import type { L10n } from "@/lib/i18n";

export const profile = {
  name: "Alif Suryadi",
  nameJa: "アリフ・スルヤディ",
  role: "Full-Stack & Machine Learning Engineer",
  shortRole: "Full-Stack Engineer",
  location: "Indonesia",
  bio: {
    en: "Software engineer with 3+ years building full-stack apps and AI/ML systems: React and Next.js on the front, Laravel, Node.js and Go on the back, shipped on GCP and AWS. I like owning a project end to end, from the first sketch to production.",
    id: "Software engineer dengan pengalaman 3+ tahun membangun aplikasi full-stack dan sistem AI/ML: React dan Next.js di depan, Laravel, Node.js, dan Go di belakang, dirilis di GCP dan AWS. Saya suka memegang proyek dari ujung ke ujung, dari sketsa pertama sampai produksi.",
  } satisfies L10n,
  /** Three quick facts under the bio. */
  facts: [
    {
      label: { en: "Now", id: "Sekarang" },
      value: {
        en: "Fullstack Developer at Foxion, building BKI's systems",
        id: "Fullstack Developer di Foxion, membangun sistem BKI",
      },
    },
    {
      label: { en: "Building", id: "Membangun" },
      value: { en: "Livales, as founder & CEO", id: "Livales, sebagai founder & CEO" },
    },
    {
      label: { en: "Known for", id: "Dikenal" },
      value: {
        en: "Leading small teams and mentoring juniors",
        id: "Memimpin tim kecil dan membimbing junior",
      },
    },
  ] satisfies { label: L10n; value: L10n }[],
  email: "alifsuryadi037@gmail.com",
  github: "https://github.com/alifsuryadi",
  linkedin: "https://www.linkedin.com/in/alifsuryadi/",
  cv: "/AlifSuryadi-Resume.pdf",
  photo: "/profile.webp",
  /** RPG flavour for the character profile card. Edit freely. */
  characterClass: "Full-Stack Mage",
  /**
   * RPG "elements" on the profile card: the four fields, no tools and no scores
   * (the tools live in the skill tree).
   */
  elements: [
    { label: "Frontend", jp: "前衛", color: "var(--sakura)" },
    { label: "Backend", jp: "後衛", color: "var(--neon-cyan)" },
    { label: "Machine Learning", jp: "知能", color: "var(--sunset)" },
    { label: "Cloud & DevOps", jp: "雲", color: "#B48CFF" },
  ],
  education: {
    school: "Universitas Putra Indonesia YPTK Padang",
    degree: {
      en: "Bachelor of Informatics Engineering",
      id: "Sarjana Teknik Informatika",
    } satisfies L10n,
    period: "Aug 2021 – Mar 2025",
    gpa: "GPA 3.66 / 4.00",
  },
  honors: [
    {
      en: "Highest GPA rank, Computer Science 2023/2024",
      id: "Peringkat IPK tertinggi, Ilmu Komputer 2023/2024",
    },
  ] satisfies L10n[],
  certifications: [
    { name: "Golang: Backend Development", issuer: "SanberCode", date: "Aug 2025" },
    { name: "Implement DevOps Workflows in Google Cloud", issuer: "Google", date: "Jul 2025" },
    { name: "Code Generation and Optimization", issuer: "IBM", date: "Jun 2025" },
    {
      name: "IBM Generative AI & Machine Learning",
      issuer: "Hacktiv8 Indonesia",
      date: "Dec 2024",
    },
    { name: "Advanced Algorithms", issuer: "Hacktiv8 Indonesia", date: "Nov 2024" },
    { name: "IT Bootcamp ReactJS", issuer: "Enigma", date: "Aug 2024" },
    { name: "Problem Solving Certificate", issuer: "HackerRank", date: "Jul 2024" },
    {
      name: "TensorFlow: Advanced Techniques Specialization",
      issuer: "DeepLearning.AI",
      date: "May 2024",
    },
    { name: "Machine Learning Specialization", issuer: "Stanford University", date: "Apr 2024" },
    { name: "Full-Stack Web Developer: Online Shop", issuer: "BuildWithAngga", date: "Dec 2023" },
  ],
  languages: [
    { en: "Indonesian (fluent)", id: "Bahasa Indonesia (fasih)" },
    { en: "English (professional)", id: "Bahasa Inggris (profesional)" },
    { en: "Japanese (basic) · 日本語", id: "Bahasa Jepang (dasar) · 日本語" },
  ] satisfies L10n[],
} as const;

export const socials = [
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "Email", href: `mailto:${profile.email}` },
] as const;
