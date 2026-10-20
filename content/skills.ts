import type { L10n } from "@/lib/i18n";

export type SkillGroup = "lang" | "web" | "data" | "ops" | "ml";

export type Skill = { name: string; group: SkillGroup; note: L10n };

export const skillGroups: Record<SkillGroup, { label: L10n; jp: string }> = {
  lang: { label: { en: "Languages", id: "Bahasa" }, jp: "言語" },
  web: { label: { en: "Web & Mobile", id: "Web & Mobile" }, jp: "画面" },
  data: { label: { en: "Data & API", id: "Data & API" }, jp: "資料" },
  ops: { label: { en: "Cloud & Ops", id: "Cloud & Ops" }, jp: "雲" },
  ml: { label: { en: "Machine Learning", id: "Machine Learning" }, jp: "知能" },
};

const s = (name: string, group: SkillGroup, en: string, id: string): Skill => ({
  name,
  group,
  note: { en, id },
});

export const skills: Skill[] = [
  s(
    "TypeScript",
    "lang",
    "My main language for the web: strict types, fearless refactors.",
    "Bahasa utama untuk web: tipe yang ketat, refactor tanpa takut.",
  ),
  s(
    "Go (Golang)",
    "lang",
    "Fast, lightweight backend services.",
    "Service backend yang cepat dan ringan.",
  ),
  s(
    "Python",
    "lang",
    "Home base for ML experiments and model training.",
    "Bahasa utama untuk eksperimen dan training model ML.",
  ),
  s(
    "PHP",
    "lang",
    "Websites and web apps built on Laravel.",
    "Website dan aplikasi web berbasis Laravel.",
  ),
  s(
    "React",
    "web",
    "My go-to library for interactive interfaces.",
    "Library UI andalan untuk antarmuka interaktif.",
  ),
  s(
    "Next.js",
    "web",
    "SSR/SSG, SEO and performance for real products.",
    "SSR/SSG, SEO, dan performa untuk produk web.",
  ),
  s(
    "Flutter",
    "web",
    "Cross-platform mobile apps, like Pasal Pintar.",
    "Aplikasi mobile lintas platform, seperti Pasal Pintar.",
  ),
  s(
    "Laravel",
    "web",
    "PHP framework for marketplaces and dashboards.",
    "Framework PHP untuk marketplace dan dashboard.",
  ),
  s("Node.js", "data", "JavaScript on the server.", "Runtime JavaScript di sisi server."),
  s(
    "Express.js",
    "data",
    "Lean REST APIs on top of Node.js.",
    "REST API yang ringkas di atas Node.js.",
  ),
  s(
    "Gin (Go)",
    "data",
    "Go HTTP framework for high-performance APIs.",
    "HTTP framework Go untuk API berperforma tinggi.",
  ),
  s(
    "REST API",
    "data",
    "Consistent, well-documented endpoints.",
    "Desain endpoint yang konsisten dan terdokumentasi.",
  ),
  s(
    "PostgreSQL",
    "data",
    "Relational database for serious data.",
    "Database relasional untuk data yang serius.",
  ),
  s(
    "MySQL",
    "data",
    "Relational database behind many client projects.",
    "Database relasional untuk banyak proyek klien.",
  ),
  s(
    "Firebase",
    "data",
    "Auth, Firestore and hosting for fast iteration.",
    "Auth, Firestore, dan hosting untuk iterasi cepat.",
  ),
  s(
    "System Design",
    "data",
    "Architectures that scale and stay maintainable.",
    "Merancang arsitektur yang skalabel dan mudah dirawat.",
  ),
  s(
    "Docker",
    "ops",
    "The same environment from laptop to server.",
    "Lingkungan yang konsisten dari laptop sampai server.",
  ),
  s(
    "GCP",
    "ops",
    "Deploying models and APIs, as in FinBoost.",
    "Deploy model dan API, seperti di FinBoost.",
  ),
  s(
    "AWS",
    "ops",
    "Cloud services for hosting and storage.",
    "Layanan cloud untuk hosting dan storage.",
  ),
  s("Git", "ops", "Version control and team collaboration.", "Version control dan kolaborasi tim."),
  s("CI/CD", "ops", "Automated build, test and deploy.", "Build, test, dan deploy otomatis."),
  s(
    "TensorFlow",
    "ml",
    "Training and fine-tuning models, including LSTMs.",
    "Training dan fine-tuning model, termasuk LSTM.",
  ),
  s(
    "PyTorch",
    "ml",
    "Deep learning research and experiments.",
    "Riset dan eksperimen deep learning.",
  ),
  s(
    "LLM (GenAI)",
    "ml",
    "Fine-tuning and integrating large language models.",
    "Fine-tuning dan integrasi model bahasa besar.",
  ),
];
