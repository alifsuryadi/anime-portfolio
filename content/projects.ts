export type Project = {
  slug: string;
  name: string;
  /** Decorative Japanese title (aria-hidden on the page). */
  jp: string;
  role: string;
  summary: string;
  description: string[];
  stack: string[];
  repo: string;
  live?: string;
  image: string;
  imageAlt: string;
  /** Accent colour token used by the manga panel. */
  accent: "sakura" | "cyan" | "sunset";
};

export const projects: Project[] = [
  {
    slug: "finboost",
    name: "FinBoost",
    jp: "金融の力",
    role: "Machine Learning Engineer",
    summary:
      "Fitur chat edukasi finansial berbasis AI: model Generative AI di-fine-tune dengan dataset perencanaan keuangan, plus LSTM untuk saran pertanyaan.",
    description: [
      "FinBoost menjawab tantangan literasi keuangan di Indonesia lewat fitur chat edukasi finansial berbasis AI.",
      "Sebagai Machine Learning Engineer, saya melakukan fine-tuning model Generative AI dengan dataset perencanaan keuangan, lalu meningkatkan pengalaman pengguna dengan model LSTM yang menyarankan pertanyaan lanjutan.",
    ],
    stack: ["Python", "TensorFlow", "Node.js", "Express", "Prisma", "Kotlin", "GCP"],
    repo: "https://github.com/Finboost/finboost-ml",
    live: "https://finboost-waitlist.vercel.app/",
    image: "/projects/finboost.webp",
    imageAlt: "Tampilan aplikasi FinBoost, chat edukasi finansial berbasis AI",
    accent: "sunset",
  },
  {
    slug: "pasal-pintar",
    name: "Pasal Pintar",
    jp: "賢い法律",
    role: "Full-Stack & ML Developer",
    summary:
      "Aplikasi informasi hukum Indonesia berbasis AI yang menjelaskan pasal dengan cepat dan mudah dipahami.",
    description: [
      "Pasal Pintar adalah aplikasi informasi hukum berbasis AI yang membantu pengguna menemukan solusi cepat dan akurat untuk kebutuhan hukumnya.",
      "Tujuannya menyederhanakan akses ke pengetahuan hukum dengan penjelasan undang-undang dan peraturan Indonesia yang lengkap dan mudah dipahami.",
    ],
    stack: ["TypeScript", "Firebase", "Flutter", "Python", "TensorFlow"],
    repo: "https://github.com/Project404-PasalPintar",
    live: "https://pasalpintar.netlify.app/",
    image: "/projects/pasal-pintar.webp",
    imageAlt: "Tampilan aplikasi Pasal Pintar, asisten informasi hukum Indonesia",
    accent: "cyan",
  },
  {
    slug: "note-kuliah",
    name: "Note Kuliah",
    jp: "講義ノート",
    role: "Full-Stack Developer",
    summary: "Platform kolaboratif untuk berbagi dan mengakses catatan kuliah berkualitas.",
    description: [
      "Note Kuliah adalah platform kolaboratif tempat mahasiswa berbagi dan mengakses catatan kuliah berkualitas untuk mendukung proses belajar.",
      "Frontend dibangun dengan React, Redux untuk state management, dan React Router, sedangkan backend memakai Express dengan validasi Zod.",
    ],
    stack: ["React", "Express", "Tailwind", "Redux", "Axios", "Zod"],
    repo: "https://github.com/alifsuryadi/fp_platform_berbagi_catatan_kuliah",
    image: "/projects/note-kuliah.webp",
    imageAlt: "Tampilan platform Note Kuliah untuk berbagi catatan kuliah",
    accent: "sakura",
  },
  {
    slug: "action-figure-marketplace",
    name: "Action Figure Marketplace",
    jp: "フィギュア市場",
    role: "Founder & Full-Stack Developer",
    summary: "Marketplace untuk jual, beli, dan tukar action figure dari berbagai genre.",
    description: [
      "Action Figure Marketplace adalah platform khusus bagi penggemar dan kolektor action figure.",
      "Saya memimpin pengembangan marketplace online tempat pengguna bisa membeli, menjual, dan menukar action figure, lengkap dengan pembayaran lewat Midtrans.",
    ],
    stack: ["Laravel", "SQL", "Vue", "SASS", "Midtrans"],
    repo: "https://github.com/alifsuryadi/action-figure-marketplace",
    live: "http://actionfigure.rf.gd/",
    image: "/projects/action-figure-marketplace.webp",
    imageAlt: "Tampilan Action Figure Marketplace untuk jual beli dan tukar figure",
    accent: "sunset",
  },
  {
    slug: "maryam-dental-care",
    name: "Maryam Dental Care",
    jp: "歯科医院",
    role: "Web Developer",
    summary: "Website informasi layanan perawatan gigi dan kesehatan mulut untuk klinik lokal.",
    description: [
      "Maryam Dental Care adalah website yang menyediakan informasi layanan perawatan gigi dan kesehatan mulut.",
      "Dengan desain yang ramah pengguna, situs ini menjelaskan berbagai jenis perawatan gigi, prosedur estetika, dan solusi kesehatan mulut.",
    ],
    stack: ["SASS", "Bootstrap", "Swiper", "AOS", "GLightbox"],
    repo: "https://github.com/alifsuryadi/maryam-dental-care",
    image: "/projects/maryam-dental-care.webp",
    imageAlt: "Tampilan website klinik Maryam Dental Care",
    accent: "cyan",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
