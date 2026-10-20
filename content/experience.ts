import type { L10n } from "@/lib/i18n";

/**
 * Timeline "stations". Only facts that are already public are filled in.
 * TODO(Alif): add exact periods / organisations where `period` is missing.
 */
export type Station = {
  id: string;
  station: string;
  stationJa: string;
  title: string;
  org: L10n;
  period?: L10n;
  points: L10n<string[]>;
};

export const experience: Station[] = [
  {
    id: "self-taught",
    station: "Hajimari",
    stationJa: "始発駅",
    title: "Self-taught Developer",
    org: { en: "Learning on my own", id: "Belajar mandiri" },
    points: {
      en: [
        "Taught myself to code, from HTML/CSS all the way to full-stack.",
        "Built small projects to practise the fundamentals: frontend, backend and deployment.",
      ],
      id: [
        "Mulai belajar pemrograman secara otodidak, dari HTML/CSS sampai full-stack.",
        "Membangun proyek kecil untuk melatih fondasi: frontend, backend, dan deployment.",
      ],
    },
  },
  {
    id: "freelance",
    station: "Machi",
    stationJa: "街駅",
    title: "Freelance Web Developer",
    org: { en: "Local businesses", id: "Bisnis lokal" },
    period: { en: "2022 – present", id: "2022 – sekarang" },
    points: {
      en: [
        "Helping local business owners launch websites that look great, stay accessible and load fast.",
        "For example: the Maryam Dental Care clinic website.",
      ],
      id: [
        "Membantu pemilik bisnis lokal membuat website yang menarik, aksesibel, dan cepat.",
        "Contoh: website klinik Maryam Dental Care.",
      ],
    },
  },
  {
    id: "marketplace",
    station: "Ichiba",
    stationJa: "市場駅",
    title: "Founder & Full-Stack Developer",
    org: { en: "Action Figure Marketplace", id: "Action Figure Marketplace" },
    points: {
      en: [
        "Designed and built a buy, sell and trade marketplace for action figures with Laravel and Vue.",
        "Integrated Midtrans payments.",
      ],
      id: [
        "Merancang dan membangun marketplace jual-beli-tukar action figure dengan Laravel dan Vue.",
        "Integrasi pembayaran Midtrans.",
      ],
    },
  },
  {
    id: "finboost",
    station: "Kin'yū",
    stationJa: "金融駅",
    title: "Machine Learning Engineer",
    org: { en: "FinBoost", id: "FinBoost" },
    points: {
      en: [
        "Fine-tuned Generative AI models on financial planning datasets.",
        "LSTM model for question suggestions in the financial education chat.",
      ],
      id: [
        "Fine-tuning model Generative AI dengan dataset perencanaan keuangan.",
        "Model LSTM untuk saran pertanyaan pada fitur chat edukasi finansial.",
      ],
    },
  },
  {
    id: "pasal-pintar",
    station: "Hōritsu",
    stationJa: "法律駅",
    title: "Full-Stack & ML Developer",
    org: { en: "Pasal Pintar", id: "Pasal Pintar" },
    points: {
      en: [
        "An AI legal information app for Indonesia, built with Flutter, Firebase and TensorFlow.",
      ],
      id: [
        "Aplikasi informasi hukum Indonesia berbasis AI dengan Flutter, Firebase, dan TensorFlow.",
      ],
    },
  },
  {
    id: "fullstack-bki-sekalipay",
    station: "Kōwan",
    stationJa: "港湾駅",
    title: "Full-Stack Developer",
    org: { en: "BKI · Sekalipay", id: "BKI · Sekalipay" },
    points: {
      en: [
        "Worked on the new website of Biro Klasifikasi Indonesia (BKI), Indonesia's state-owned classification society.",
        "Full-stack development on Sekalipay.",
      ],
      id: [
        "Mengerjakan website baru Biro Klasifikasi Indonesia (BKI), BUMN biro klasifikasi Indonesia.",
        "Pengembangan full-stack di Sekalipay.",
      ],
    },
  },
  {
    id: "livales",
    station: "Shūten",
    stationJa: "終点駅",
    title: "Founder, CEO & Solo Developer",
    org: { en: "Livales", id: "Livales" },
    points: {
      en: [
        "Founded Livales, an Indonesian tech company building apps that bring people closer to the ones they love and the world they want to know.",
        "Designed, built and shipped Kana Speed (learn Japanese through quizzes) and Kado Livales (gift finder) on my own, with more apps in development.",
      ],
      id: [
        "Mendirikan Livales, perusahaan teknologi Indonesia yang membuat aplikasi untuk mendekatkan orang dengan orang tersayang dan dunia yang ingin mereka kenal.",
        "Merancang, membangun, dan merilis sendiri Kana Speed (belajar bahasa Jepang lewat kuis) dan Kado Livales (pencari kado), dengan aplikasi lain yang sedang dibuat.",
      ],
    },
  },
];
