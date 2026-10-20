import type { L10n } from "@/lib/i18n";

export const profile = {
  name: "Alif Suryadi",
  nameJa: "アリフ・スルヤディ",
  role: "Full-Stack & Machine Learning Engineer",
  shortRole: "Full-Stack Engineer",
  location: "Indonesia",
  bio: {
    en: "Full-Stack & Machine Learning Engineer with 3+ years of hands-on experience turning ideas into production software. I design serverless architectures on AWS and GCP, build React and Next.js interfaces, and integrate NLP models such as GPT, LLaMA and BERT to create smart features for ed-tech, ESG and SaaS products. Today I'm a Full Stack Engineer at Foxion Technologies and the founder & CEO of Livales.",
    id: "Full-Stack & Machine Learning Engineer dengan pengalaman 3+ tahun mengubah ide menjadi software siap produksi. Saya merancang arsitektur serverless di AWS dan GCP, membangun antarmuka React dan Next.js, serta mengintegrasikan model NLP seperti GPT, LLaMA, dan BERT untuk fitur cerdas di produk ed-tech, ESG, dan SaaS. Kini saya Full Stack Engineer di Foxion Technologies sekaligus founder & CEO Livales.",
  } satisfies L10n,
  bioExtra: {
    en: "I thrive in fast-moving teams where clean code, thoughtful UX and continuous learning drive the roadmap. Known for rapid prototyping, clear communication and mentoring junior developers.",
    id: "Saya paling nyaman di tim yang bergerak cepat, di mana kode yang rapi, UX yang matang, dan belajar terus-menerus jadi arah kerja. Dikenal cepat membuat prototipe, berkomunikasi dengan jelas, dan senang membimbing developer junior.",
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
    { label: "Backend", jp: "後衛", value: 88 },
    { label: "Machine Learning", jp: "機械学習", value: 75 },
    { label: "Cloud & DevOps", jp: "雲", value: 78 },
  ],
  education: {
    school: "Universitas Putra Indonesia YPTK",
    degree: {
      en: "Bachelor's degree, Computer Science",
      id: "Sarjana Ilmu Komputer",
    } satisfies L10n,
    period: "2021 – 2025",
  },
  honors: [
    {
      en: "Highest GPA rank, Computer Science 2023/2024",
      id: "Peringkat IPK tertinggi, Ilmu Komputer 2023/2024",
    },
  ] satisfies L10n[],
  certifications: [
    "Machine Learning Specialization",
    "Mathematics for Machine Learning and Data Science Specialization",
    "Meta & Hacktiv8 Llama DevLab ID",
    "Responsive Web Design",
    'Workshop Flutter "Flutter Authentication"',
  ],
  languages: [
    { en: "English (professional working)", id: "Bahasa Inggris (profesional)" },
    { en: "Indonesian (native)", id: "Bahasa Indonesia (penutur asli)" },
  ] satisfies L10n[],
} as const;

export const socials = [
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "Email", href: `mailto:${profile.email}` },
] as const;
