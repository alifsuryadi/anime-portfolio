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
    summary: {
      en: "The new ship register system of Biro Klasifikasi Indonesia (BKI): ship lists, status changes, certificates and email delivery, built with Laravel and SQL Server.",
      id: "Sistem register kapal baru Biro Klasifikasi Indonesia (BKI): daftar kapal, perubahan status, sertifikat, dan pengiriman email, dibangun dengan Laravel dan SQL Server.",
    },
    description: {
      en: [
        "Biro Klasifikasi Indonesia (BKI) is Indonesia's national classification society, a state-owned enterprise that keeps ships and marine structures safe to internationally recognized standards.",
        "For the new BKI system I built the ship register and vessel lists, the ship status change workflow, certificate generation, and automatic email delivery, with scheduled cron jobs for the background work.",
        "Built with Laravel on SQL Server, as a Fullstack Developer at PT Fox Global Intertech (Foxion), supporting BKI's critical survey data management.",
      ],
      id: [
        "Biro Klasifikasi Indonesia (BKI) adalah biro klasifikasi nasional Indonesia, BUMN yang menjaga keselamatan kapal dan struktur laut sesuai standar internasional.",
        "Untuk sistem BKI yang baru, saya membangun register dan daftar kapal, alur perubahan status kapal, pembuatan sertifikat, dan pengiriman email otomatis, dengan cron job terjadwal untuk proses di belakang layar.",
        "Dibangun dengan Laravel dan SQL Server, sebagai Fullstack Developer di PT Fox Global Intertech (Foxion), untuk mendukung pengelolaan data survei penting BKI.",
      ],
    },
    stack: ["Laravel", "PHP", "SQL Server", "Cron jobs", "Email automation"],
    live: "https://new.bki.co.id/",
    image: "/projects/bki.webp",
    imageAlt: {
      en: "BKI ship monitoring dashboard with ship register totals and vessel status",
      id: "Dashboard monitoring kapal BKI dengan total register kapal dan status kapal",
    },
    accent: "cyan",
  },
  {
    slug: "sekalipay",
    name: "Sekalipay",
    jp: "セカリペイ",
    role: "Full-Stack Developer",
    summary: {
      en: "A digital store for premium apps, game top-ups, mobile credit, vouchers and SMM services. I built its affiliate system with Laravel and PostgreSQL.",
      id: "Toko digital untuk aplikasi premium, top up game, pulsa, voucher, dan layanan SMM. Saya membangun sistem affiliate-nya dengan Laravel dan PostgreSQL.",
    },
    description: {
      en: [
        "SekaliPay offers premium apps, game top-ups, mobile credit, digital vouchers and SMM services at affordable prices, with fast processing and secure payments.",
        "I built its affiliate system with Laravel and PostgreSQL.",
      ],
      id: [
        "SekaliPay menyediakan aplikasi premium, top up game, pulsa, voucher digital, dan layanan SMM dengan harga terjangkau, proses cepat, dan pembayaran aman.",
        "Saya membangun sistem affiliate-nya dengan Laravel dan PostgreSQL.",
      ],
    },
    stack: ["Laravel", "PHP", "PostgreSQL"],
    live: "https://sekalipay.com/",
    image: "/projects/sekalipay.webp",
    imageAlt: {
      en: "Sekalipay home page with a reseller banner and flash sale",
      id: "Beranda Sekalipay dengan banner reseller dan flash sale",
    },
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
        "I led the 2-person ML team in the Bangkit Academy capstone: a financial coach chatbot on GPT-2 and LLaMA 3, served with Flask in Docker on Google Cloud Run, with 100+ users on the waiting list.",
      ],
      id: [
        "FinBoost menjawab tantangan literasi keuangan di Indonesia lewat fitur chat edukasi finansial berbasis AI.",
        "Sebagai Machine Learning Engineer, saya melakukan fine-tuning model Generative AI dengan dataset perencanaan keuangan, lalu meningkatkan pengalaman pengguna dengan model LSTM yang menyarankan pertanyaan lanjutan.",
        "Saya memimpin tim ML 2 orang di capstone Bangkit Academy: chatbot pelatih keuangan dengan GPT-2 dan LLaMA 3, dilayani Flask dalam Docker di Google Cloud Run, dengan 100+ pengguna di waiting list.",
      ],
    },
    stack: [
      "Python",
      "TensorFlow",
      "Flask",
      "Docker",
      "Cloud Run",
      "Node.js",
      "Express",
      "Prisma",
      "Kotlin",
      "GCP",
    ],
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
