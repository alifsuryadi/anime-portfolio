import type { L10n } from "@/lib/i18n";

/** Timeline "stations", oldest first (the train rides forward in time). Source: LinkedIn. */
export type Station = {
  id: string;
  /** Decorative station name (romaji + Japanese). */
  station: string;
  stationJa: string;
  title: string;
  org: string;
  place: L10n;
  period: L10n;
  points: L10n<string[]>;
};

const p = (en: string, id: string): L10n => ({ en, id });

export const experience: Station[] = [
  {
    id: "sdn-03-pauh-barat",
    station: "Gakkō",
    stationJa: "学校駅",
    title: "Administrative",
    org: "SDN 03 Pauh Barat",
    place: p("Pariaman, West Sumatra", "Pariaman, Sumatera Barat"),
    period: p("Jan 2022 – Dec 2022", "Jan 2022 – Des 2022"),
    points: {
      en: [
        "Digitized school archives and automated Excel-based reports, cutting manual administrative work by 40%.",
      ],
      id: [
        "Mendigitalkan arsip sekolah dan mengotomatiskan laporan berbasis Excel, memangkas pekerjaan administrasi manual hingga 40%.",
      ],
    },
  },
  {
    id: "gaotek",
    station: "Nyūyōku",
    stationJa: "紐育駅",
    title: "Software Developer",
    org: "GAOTek Inc.",
    place: p("New York, United States (remote)", "New York, Amerika Serikat (remote)"),
    period: p("Apr 2023 – Aug 2023", "Apr 2023 – Agu 2023"),
    points: {
      en: [
        "Identified and fixed 25+ front-end bugs on WordPress-based sites, improving stability and functionality.",
        "Documented issues and remediation steps to streamline hand-offs to senior developers.",
      ],
      id: [
        "Menemukan dan memperbaiki 25+ bug front-end di situs berbasis WordPress, meningkatkan stabilitas dan fungsionalitas.",
        "Mendokumentasikan masalah dan langkah perbaikan agar serah terima ke developer senior lebih lancar.",
      ],
    },
  },
  {
    id: "inatechno",
    station: "Shika",
    stationJa: "歯科駅",
    title: "Software Engineer",
    org: "INATECHNO",
    place: p("Padang, West Sumatra", "Padang, Sumatera Barat"),
    period: p("Oct 2023 – Mar 2024", "Okt 2023 – Mar 2024"),
    points: {
      en: [
        'Led a team of 2 through the development lifecycle of the "Maryam Dental Care" MVP (Flutter & Laravel).',
        "Iterated on UI/UX with designers based on user feedback and wrote unit tests for backend reliability.",
      ],
      id: [
        'Memimpin tim 2 orang dalam siklus pengembangan MVP "Maryam Dental Care" (Flutter & Laravel).',
        "Mengiterasi UI/UX bersama desainer berdasarkan masukan pengguna dan menulis unit test untuk keandalan backend.",
      ],
    },
  },
  {
    id: "inajunior",
    station: "Sensei",
    stationJa: "先生駅",
    title: "Course Instructor",
    org: "INAJUNIOR",
    place: p("Padang, West Sumatra", "Padang, Sumatera Barat"),
    period: p("Nov 2023 – Mar 2024", "Nov 2023 – Mar 2024"),
    points: {
      en: [
        "Taught robotics with Arduino and programming fundamentals with Scratch.",
        "Fostered teamwork and collaboration among students.",
      ],
      id: [
        "Mengajar robotika dengan Arduino dan dasar pemrograman dengan Scratch.",
        "Membangun kerja sama tim dan kolaborasi antar siswa.",
      ],
    },
  },
  {
    id: "bangkit",
    station: "Kikai",
    stationJa: "機械駅",
    title: "Machine Learning Cohort",
    org: "Bangkit Academy (Google, Tokopedia, Gojek & Traveloka)",
    place: p("Bandung, West Java", "Bandung, Jawa Barat"),
    period: p("Feb 2024 – Jul 2024", "Feb 2024 – Jul 2024"),
    points: {
      en: [
        "Deep learning with TensorFlow and deploying ML models to cloud, edge and mobile.",
        "Capstone (Entrepreneur Track): a generative AI chatbot with GPT-2 and LLaMA 3, plus LSTM question suggestions. This became FinBoost.",
      ],
      id: [
        "Deep learning dengan TensorFlow dan deploy model ML ke cloud, edge, dan mobile.",
        "Capstone (Entrepreneur Track): chatbot generative AI dengan GPT-2 dan LLaMA 3, plus saran pertanyaan dengan LSTM. Proyek ini menjadi FinBoost.",
      ],
    },
  },
  {
    id: "naima",
    station: "Midori",
    stationJa: "緑駅",
    title: "Full Stack Engineer",
    org: "Naima",
    place: p("Padang, West Sumatra", "Padang, Sumatera Barat"),
    period: p("Jul 2024 – Oct 2024", "Jul 2024 – Okt 2024"),
    points: {
      en: [
        "Prototyped an ESG (Environmental, Social, Governance) SaaS platform for sustainability tracking.",
        "Front-end in React and Tailwind; back-end in Go on AWS.",
      ],
      id: [
        "Membuat prototipe platform SaaS ESG (Environmental, Social, Governance) untuk pelacakan keberlanjutan.",
        "Front-end dengan React dan Tailwind; back-end dengan Go di AWS.",
      ],
    },
  },
  {
    id: "hacktiv8",
    station: "Kanjō",
    stationJa: "感情駅",
    title: "Generative AI & Machine Learning",
    org: "Hacktiv8 Indonesia",
    place: p("South Jakarta", "Jakarta Selatan"),
    period: p("Aug 2024 – Dec 2024", "Agu 2024 – Des 2024"),
    points: {
      en: [
        "Built a movie-review sentiment analysis pipeline with GPT-3 and IBM Watson NLU, reaching 93% accuracy.",
        "Deployed it as an inference API on IBM Cloud and wrote the technical documentation.",
      ],
      id: [
        "Membangun pipeline analisis sentimen ulasan film dengan GPT-3 dan IBM Watson NLU, akurasi 93%.",
        "Men-deploy-nya sebagai inference API di IBM Cloud dan menulis dokumentasi teknisnya.",
      ],
    },
  },
  {
    id: "studyo",
    station: "Rondon",
    stationJa: "倫敦駅",
    title: "Back End Developer",
    org: "Studyo.io",
    place: p("London, United Kingdom (remote)", "London, Inggris (remote)"),
    period: p("Sep 2024 – May 2025", "Sep 2024 – Mei 2025"),
    points: {
      en: [
        "Built a student–tutor meeting service with the Agora SDK for video and audio.",
        "Serverless endpoints with Cloud Functions, recordings in Cloud Storage, and real-time notifications with Firebase Cloud Messaging.",
      ],
      id: [
        "Membangun layanan meeting siswa–tutor dengan Agora SDK untuk video dan audio.",
        "Endpoint serverless dengan Cloud Functions, rekaman di Cloud Storage, dan notifikasi real-time dengan Firebase Cloud Messaging.",
      ],
    },
  },
  {
    id: "stafbook",
    station: "Shorui",
    stationJa: "書類駅",
    title: "Full Stack Developer",
    org: "StafBook (YC W22)",
    place: p("North Jakarta", "Jakarta Utara"),
    period: p("Jun 2025 – Aug 2025", "Jun 2025 – Agu 2025"),
    points: {
      en: [
        "Document digitization system for a state-owned enterprise (BUMN), front-end and back-end, with Laravel and SQL Server.",
        "Shipped new features and optimized database queries for system performance.",
      ],
      id: [
        "Sistem digitalisasi dokumen untuk sebuah BUMN, front-end dan back-end, dengan Laravel dan SQL Server.",
        "Merilis fitur baru dan mengoptimalkan query database untuk performa sistem.",
      ],
    },
  },
  {
    id: "livales",
    station: "Taisetsu",
    stationJa: "大切駅",
    title: "Chief Executive Officer & Founder",
    org: "Livales",
    place: p("Indonesia", "Indonesia"),
    period: p("Jun 2025 – present", "Jun 2025 – sekarang"),
    points: {
      en: [
        "Founded an Indonesian tech company building apps that bring people closer to the ones they love and the world they want to know.",
        "Solo developer behind Kana Speed (learn Japanese through quizzes) and Kado Livales (gift finder), with more apps in development.",
      ],
      id: [
        "Mendirikan perusahaan teknologi Indonesia yang membuat aplikasi untuk mendekatkan orang dengan orang tersayang dan dunia yang ingin mereka kenal.",
        "Solo developer di balik Kana Speed (belajar bahasa Jepang lewat kuis) dan Kado Livales (pencari kado), dengan aplikasi lain yang sedang dibuat.",
      ],
    },
  },
  {
    id: "foxion",
    station: "Kōwan",
    stationJa: "港湾駅",
    title: "Full Stack Engineer",
    org: "Foxion Technologies",
    place: p("Tanjung Priok, Jakarta", "Tanjung Priok, Jakarta"),
    period: p("Jul 2025 – present", "Jul 2025 – sekarang"),
    points: {
      en: [
        "Delivering digital solutions with the Foxion team for a state-owned enterprise (BUMN) under the Danantara holding.",
      ],
      id: [
        "Mengembangkan solusi digital bersama tim Foxion untuk sebuah BUMN di bawah holding Danantara.",
      ],
    },
  },
];
