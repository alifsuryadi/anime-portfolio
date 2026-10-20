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
  /** Public repository, if any. */
  repo?: string;
  live?: string;
  image: string;
  imageAlt: L10n;
  /** Accent colour token used by the manga panel. */
  accent: "sakura" | "cyan" | "sunset";
};

export const projects: Project[] = [
  {
    slug: "livales",
    name: "Livales",
    jp: "大切な人へ",
    role: "Founder, CEO & Solo Developer",
    summary: {
      en: "My own Indonesian tech company: apps that bring you closer to the people you love, and the world you want to know.",
      id: "Perusahaan teknologi saya sendiri: aplikasi yang mendekatkan kamu dengan orang tersayang, dan dunia yang ingin kamu kenal.",
    },
    description: {
      en: [
        "Livales is an Indonesian technology company that designs and builds its own apps. I founded it and run it as CEO, and I design, build and ship every product myself as a solo developer.",
        "The shelf so far: Kana Speed, a free web app for learning Japanese through quizzes, and Kado Livales, gift recommendations from Indonesian marketplaces with wishlists and group gifts. More apps are in development.",
        "The company website is bilingual, prerendered for SEO and hosted on Netlify, with Firebase behind the sign-up form.",
      ],
      id: [
        "Livales adalah perusahaan teknologi Indonesia yang merancang dan membangun aplikasinya sendiri. Saya mendirikannya dan memimpinnya sebagai CEO, sekaligus merancang, membangun, dan merilis setiap produk sendiri sebagai solo developer.",
        "Produk yang sudah rilis: Kana Speed, web app gratis untuk belajar bahasa Jepang lewat kuis, dan Kado Livales, rekomendasi kado dari marketplace Indonesia lengkap dengan wishlist dan patungan. Aplikasi lainnya sedang dibuat.",
        "Website perusahaannya dua bahasa, di-prerender untuk SEO, di-hosting di Netlify, dengan Firebase untuk form pendaftaran.",
      ],
    },
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Firebase", "Netlify"],
    repo: "https://github.com/livales/livales-landing-page",
    live: "https://livales.com/",
    image: "/projects/livales.webp",
    imageAlt: {
      en: "Livales company website: closer to the people you love, and the world you want to know",
      id: "Website Livales: lebih dekat dengan orang tersayang, dan dunia yang ingin kamu kenal",
    },
    accent: "sakura",
  },
  {
    slug: "bki",
    name: "BKI",
    jp: "船級協会",
    role: "Full-Stack Developer",
    // TODO(Alif): add the stack, your scope and a real screenshot (public/projects/bki.webp).
    summary: {
      en: "The new website of Biro Klasifikasi Indonesia (BKI), Indonesia's state-owned ship classification society.",
      id: "Website baru Biro Klasifikasi Indonesia (BKI), BUMN biro klasifikasi kapal Indonesia.",
    },
    description: {
      en: [
        "Biro Klasifikasi Indonesia (BKI) is Indonesia's national classification society, a state-owned enterprise that provides classification, certification and consultancy for the maritime, offshore and industrial sectors.",
        "I worked on its new website as a Full-Stack Developer.",
      ],
      id: [
        "Biro Klasifikasi Indonesia (BKI) adalah biro klasifikasi nasional Indonesia, BUMN yang menyediakan layanan klasifikasi, sertifikasi, dan konsultasi untuk sektor maritim, lepas pantai, dan industri.",
        "Saya mengerjakan website barunya sebagai Full-Stack Developer.",
      ],
    },
    stack: [],
    live: "https://new.bki.co.id/",
    image: "/projects/bki.webp",
    imageAlt: { en: "BKI website project cover", id: "Sampul proyek website BKI" },
    accent: "cyan",
  },
  {
    slug: "sekalipay",
    name: "Sekalipay",
    jp: "セカリペイ",
    role: "Full-Stack Developer",
    // TODO(Alif): describe the product, your scope and stack, and add a real screenshot.
    summary: {
      en: "Sekalipay, where I worked as a Full-Stack Developer.",
      id: "Sekalipay, tempat saya bekerja sebagai Full-Stack Developer.",
    },
    description: {
      en: ["I worked on Sekalipay as a Full-Stack Developer."],
      id: ["Saya mengerjakan Sekalipay sebagai Full-Stack Developer."],
    },
    stack: [],
    live: "https://sekalipay.com/",
    image: "/projects/sekalipay.webp",
    imageAlt: { en: "Sekalipay project cover", id: "Sampul proyek Sekalipay" },
    accent: "sunset",
  },
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
