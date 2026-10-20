/**
 * Timeline "stations". Only facts that are already public are filled in.
 * TODO(Alif): add exact periods / organisations where it says `period: undefined`.
 */
export type Station = {
  id: string;
  station: string;
  stationJa: string;
  title: string;
  org: string;
  period?: string;
  points: string[];
};

export const experience: Station[] = [
  {
    id: "self-taught",
    station: "Hajimari",
    stationJa: "始発駅",
    title: "Self-taught Developer",
    org: "Belajar mandiri",
    points: [
      "Mulai belajar pemrograman secara otodidak, dari HTML/CSS sampai full-stack.",
      "Membangun proyek kecil untuk melatih fondasi: frontend, backend, dan deployment.",
    ],
  },
  {
    id: "freelance",
    station: "Machi",
    stationJa: "街駅",
    title: "Freelance Web Developer",
    org: "Bisnis lokal",
    period: "2022 – sekarang",
    points: [
      "Membantu pemilik bisnis lokal membuat website yang menarik, aksesibel, dan cepat.",
      "Contoh: website klinik Maryam Dental Care.",
    ],
  },
  {
    id: "marketplace",
    station: "Ichiba",
    stationJa: "市場駅",
    title: "Founder & Full-Stack Developer",
    org: "Action Figure Marketplace",
    points: [
      "Merancang dan membangun marketplace jual-beli-tukar action figure dengan Laravel dan Vue.",
      "Integrasi pembayaran Midtrans.",
    ],
  },
  {
    id: "finboost",
    station: "Kin'yū",
    stationJa: "金融駅",
    title: "Machine Learning Engineer",
    org: "FinBoost",
    points: [
      "Fine-tuning model Generative AI dengan dataset perencanaan keuangan.",
      "Model LSTM untuk saran pertanyaan pada fitur chat edukasi finansial.",
    ],
  },
  {
    id: "pasal-pintar",
    station: "Hōritsu",
    stationJa: "法律駅",
    title: "Full-Stack & ML Developer",
    org: "Pasal Pintar",
    points: [
      "Aplikasi informasi hukum Indonesia berbasis AI dengan Flutter, Firebase, dan TensorFlow.",
    ],
  },
];
