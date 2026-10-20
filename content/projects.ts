import type { L10n } from "@/lib/i18n";

export type Project = {
  slug: string;
  name: string;
  /** Decorative Japanese title (aria-hidden on the page). */
  jp: string;
  role: string;
  summary: L10n;
  description: L10n<string[]>;
  stack: string[];
  repo: string;
  live?: string;
  image: string;
  imageAlt: L10n;
  /** Accent colour token used by the manga panel. */
  accent: "sakura" | "cyan" | "sunset";
};

export const projects: Project[] = [
  {
    slug: "finboost",
    name: "FinBoost",
    jp: "金融の力",
    role: "Machine Learning Engineer",
    summary: {
      en: "An AI-powered financial education chat: Generative AI fine-tuned on financial planning data, plus an LSTM that suggests follow-up questions.",
      id: "Fitur chat edukasi finansial berbasis AI: model Generative AI di-fine-tune dengan dataset perencanaan keuangan, plus LSTM untuk saran pertanyaan.",
    },
    description: {
      en: [
        "FinBoost tackles Indonesia's financial literacy challenge with an AI-powered financial education chat.",
        "As the Machine Learning Engineer, I fine-tuned Generative AI models on financial planning datasets and improved the experience with an LSTM model that suggests the next question to ask.",
      ],
      id: [
        "FinBoost menjawab tantangan literasi keuangan di Indonesia lewat fitur chat edukasi finansial berbasis AI.",
        "Sebagai Machine Learning Engineer, saya melakukan fine-tuning model Generative AI dengan dataset perencanaan keuangan, lalu meningkatkan pengalaman pengguna dengan model LSTM yang menyarankan pertanyaan lanjutan.",
      ],
    },
    stack: ["Python", "TensorFlow", "Node.js", "Express", "Prisma", "Kotlin", "GCP"],
    repo: "https://github.com/Finboost/finboost-ml",
    live: "https://finboost-waitlist.vercel.app/",
    image: "/projects/finboost.webp",
    imageAlt: {
      en: "FinBoost app screens, an AI financial education chat",
      id: "Tampilan aplikasi FinBoost, chat edukasi finansial berbasis AI",
    },
    accent: "sunset",
  },
  {
    slug: "pasal-pintar",
    name: "Pasal Pintar",
    jp: "賢い法律",
    role: "Full-Stack & ML Developer",
    summary: {
      en: "An AI legal information app that explains Indonesian law quickly and in plain language.",
      id: "Aplikasi informasi hukum Indonesia berbasis AI yang menjelaskan pasal dengan cepat dan mudah dipahami.",
    },
    description: {
      en: [
        "Pasal Pintar is an AI-powered legal information app that gives people fast, accurate answers to their legal questions.",
        "It makes legal knowledge easier to reach with complete, easy-to-understand explanations of Indonesian laws and regulations.",
      ],
      id: [
        "Pasal Pintar adalah aplikasi informasi hukum berbasis AI yang membantu pengguna menemukan solusi cepat dan akurat untuk kebutuhan hukumnya.",
        "Tujuannya menyederhanakan akses ke pengetahuan hukum dengan penjelasan undang-undang dan peraturan Indonesia yang lengkap dan mudah dipahami.",
      ],
    },
    stack: ["TypeScript", "Firebase", "Flutter", "Python", "TensorFlow"],
    repo: "https://github.com/Project404-PasalPintar",
    live: "https://pasalpintar.netlify.app/",
    image: "/projects/pasal-pintar.webp",
    imageAlt: {
      en: "Pasal Pintar app screens, an Indonesian legal information assistant",
      id: "Tampilan aplikasi Pasal Pintar, asisten informasi hukum Indonesia",
    },
    accent: "cyan",
  },
  {
    slug: "note-kuliah",
    name: "Note Kuliah",
    jp: "講義ノート",
    role: "Full-Stack Developer",
    summary: {
      en: "A collaborative platform for sharing and finding high-quality lecture notes.",
      id: "Platform kolaboratif untuk berbagi dan mengakses catatan kuliah berkualitas.",
    },
    description: {
      en: [
        "Note Kuliah is a collaborative platform where students share and access quality lecture notes to support their learning.",
        "The frontend is built with React, Redux for state management and React Router; the backend runs on Express with Zod validation.",
      ],
      id: [
        "Note Kuliah adalah platform kolaboratif tempat mahasiswa berbagi dan mengakses catatan kuliah berkualitas untuk mendukung proses belajar.",
        "Frontend dibangun dengan React, Redux untuk state management, dan React Router, sedangkan backend memakai Express dengan validasi Zod.",
      ],
    },
    stack: ["React", "Express", "Tailwind", "Redux", "Axios", "Zod"],
    repo: "https://github.com/alifsuryadi/fp_platform_berbagi_catatan_kuliah",
    image: "/projects/note-kuliah.webp",
    imageAlt: {
      en: "Note Kuliah platform for sharing lecture notes",
      id: "Tampilan platform Note Kuliah untuk berbagi catatan kuliah",
    },
    accent: "sakura",
  },
  {
    slug: "action-figure-marketplace",
    name: "Action Figure Marketplace",
    jp: "フィギュア市場",
    role: "Founder & Full-Stack Developer",
    summary: {
      en: "A marketplace to buy, sell and trade action figures across every genre.",
      id: "Marketplace untuk jual, beli, dan tukar action figure dari berbagai genre.",
    },
    description: {
      en: [
        "Action Figure Marketplace is a dedicated platform for action figure fans and collectors.",
        "I led the build of an online marketplace where people can buy, sell and trade figures, with payments through Midtrans.",
      ],
      id: [
        "Action Figure Marketplace adalah platform khusus bagi penggemar dan kolektor action figure.",
        "Saya memimpin pengembangan marketplace online tempat pengguna bisa membeli, menjual, dan menukar action figure, lengkap dengan pembayaran lewat Midtrans.",
      ],
    },
    stack: ["Laravel", "SQL", "Vue", "SASS", "Midtrans"],
    repo: "https://github.com/alifsuryadi/action-figure-marketplace",
    live: "http://actionfigure.rf.gd/",
    image: "/projects/action-figure-marketplace.webp",
    imageAlt: {
      en: "Action Figure Marketplace for buying, selling and trading figures",
      id: "Tampilan Action Figure Marketplace untuk jual beli dan tukar figure",
    },
    accent: "sunset",
  },
  {
    slug: "maryam-dental-care",
    name: "Maryam Dental Care",
    jp: "歯科医院",
    role: "Web Developer",
    summary: {
      en: "An information website about dental care and oral health services for a local clinic.",
      id: "Website informasi layanan perawatan gigi dan kesehatan mulut untuk klinik lokal.",
    },
    description: {
      en: [
        "Maryam Dental Care is a website with information about dental care and oral health services.",
        "Its friendly design explains the different dental treatments, aesthetic procedures and oral health solutions in depth.",
      ],
      id: [
        "Maryam Dental Care adalah website yang menyediakan informasi layanan perawatan gigi dan kesehatan mulut.",
        "Dengan desain yang ramah pengguna, situs ini menjelaskan berbagai jenis perawatan gigi, prosedur estetika, dan solusi kesehatan mulut.",
      ],
    },
    stack: ["SASS", "Bootstrap", "Swiper", "AOS", "GLightbox"],
    repo: "https://github.com/alifsuryadi/maryam-dental-care",
    image: "/projects/maryam-dental-care.webp",
    imageAlt: {
      en: "Maryam Dental Care clinic website",
      id: "Tampilan website klinik Maryam Dental Care",
    },
    accent: "cyan",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
