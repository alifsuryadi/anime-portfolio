import type { L10n } from "@/lib/i18n";

export const profile = {
  name: "Alif Suryadi",
  nameJa: "アリフ・スルヤディ",
  role: "Full-Stack & Machine Learning Engineer",
  shortRole: "Full-Stack Engineer",
  location: "Indonesia",
  bio: {
    en: "A results-driven Software Engineer with 3+ years of experience architecting, leading and developing full-stack applications and machine learning solutions. I build serverless backends (Node.js, Go), responsive frontends (React, Next.js) and AI/ML systems, on GCP and AWS with Docker and CI/CD. Today I'm a Fullstack Developer at PT Fox Global Intertech, building systems for Biro Klasifikasi Indonesia, and the founder & CEO of Livales.",
    id: "Software Engineer berorientasi hasil dengan pengalaman 3+ tahun merancang, memimpin, dan mengembangkan aplikasi full-stack serta solusi machine learning. Saya membangun backend serverless (Node.js, Go), frontend responsif (React, Next.js), dan sistem AI/ML, di GCP dan AWS dengan Docker dan CI/CD. Kini saya Fullstack Developer di PT Fox Global Intertech, membangun sistem untuk Biro Klasifikasi Indonesia, sekaligus founder & CEO Livales.",
  } satisfies L10n,
  bioExtra: {
    en: "Proven at leading projects and mentoring team members. Known for end-to-end project ownership, clean architecture and data-driven optimizations.",
    id: "Terbiasa memimpin proyek dan membimbing anggota tim. Dikenal dengan kepemilikan proyek end-to-end, arsitektur yang rapi, dan optimasi berbasis data.",
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
    { label: "Frontend", jp: "前衛", value: 94 },
    { label: "Backend", jp: "後衛", value: 92 },
    { label: "Machine Learning", jp: "機械学習", value: 75 },
    { label: "Cloud & DevOps", jp: "雲", value: 78 },
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
