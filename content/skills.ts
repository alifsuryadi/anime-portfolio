import type { L10n } from "@/lib/i18n";

export type SkillGroup = "lang" | "web" | "data" | "ops" | "ml";

/** `main` marks the handful of skills Alif reaches for first. */
export type Skill = { name: string; group: SkillGroup; note: L10n; main?: boolean };

export const skillGroups: Record<SkillGroup, { label: L10n; jp: string }> = {
  lang: { label: { en: "Languages", id: "Bahasa" }, jp: "言語" },
  web: { label: { en: "Frontend & Mobile", id: "Frontend & Mobile" }, jp: "画面" },
  data: { label: { en: "Backend & Data", id: "Backend & Data" }, jp: "資料" },
  ops: { label: { en: "Cloud & Ops", id: "Cloud & Ops" }, jp: "雲" },
  ml: { label: { en: "Machine Learning", id: "Machine Learning" }, jp: "知能" },
};

const s = (name: string, group: SkillGroup, en: string, id: string, main = false): Skill => ({
  name,
  group,
  note: { en, id },
  main,
});

export const skills: Skill[] = [
  s(
    "TypeScript",
    "lang",
    "My main language for the web: strict types, fearless refactors.",
    "Bahasa utama untuk web: tipe yang ketat, refactor tanpa takut.",
    true,
  ),
  s(
    "Go (Golang)",
    "lang",
    "Fast backends, like Naima's ESG microservices on AWS.",
    "Backend yang cepat, seperti microservice ESG Naima di AWS.",
  ),
  s(
    "Python",
    "lang",
    "Home base for ML experiments and model serving.",
    "Bahasa utama untuk eksperimen dan serving model ML.",
  ),

  s(
    "Next.js",
    "web",
    "SSR/SSG, SEO and performance for real products, like this site.",
    "SSR/SSG, SEO, dan performa untuk produk nyata, seperti situs ini.",
    true,
  ),
  s(
    "React",
    "web",
    "My go-to library for interactive interfaces.",
    "Library UI andalan untuk antarmuka interaktif.",
  ),
  s(
    "Flutter",
    "web",
    "Cross-platform mobile apps, like Pasal Pintar.",
    "Aplikasi mobile lintas platform, seperti Pasal Pintar.",
  ),

  s(
    "Laravel",
    "data",
    "BKI's ship register, Sekalipay's affiliate system and a BUMN document system.",
    "Register kapal BKI, sistem affiliate Sekalipay, dan sistem dokumen BUMN.",
    true,
  ),
  s(
    "Node.js",
    "data",
    "Serverless functions and REST APIs (Express).",
    "Serverless function dan REST API (Express).",
  ),
  s(
    "SQL Server",
    "data",
    "Enterprise database for BKI and a BUMN document system, with tuned queries.",
    "Database enterprise untuk BKI dan sistem dokumen BUMN, dengan query yang dioptimalkan.",
  ),
  s(
    "PostgreSQL",
    "data",
    "Relational database, e.g. Sekalipay's affiliate system.",
    "Database relasional, misalnya sistem affiliate Sekalipay.",
  ),
  s(
    "Firebase",
    "data",
    "Firestore, Cloud Messaging and hosting, from Studyo.io to Livales.",
    "Firestore, Cloud Messaging, dan hosting, dari Studyo.io sampai Livales.",
  ),

  s(
    "GCP",
    "ops",
    "Cloud Functions, Firestore and Cloud Run (Studyo.io, FinBoost).",
    "Cloud Functions, Firestore, dan Cloud Run (Studyo.io, FinBoost).",
    true,
  ),
  s(
    "AWS",
    "ops",
    "Go microservices on ECS and serverless backends.",
    "Microservice Go di ECS dan backend serverless.",
  ),
  s(
    "Docker",
    "ops",
    "Containerized services and blue-green deployments.",
    "Service dalam container dan blue-green deployment.",
  ),
  s(
    "CI/CD",
    "ops",
    "GitHub Actions pipelines, e.g. at Naima Sustainability.",
    "Pipeline GitHub Actions, misalnya di Naima Sustainability.",
  ),

  s(
    "LLM (GenAI)",
    "ml",
    "GPT, LLaMA and BERT: fine-tuning, sentiment analysis (93% accuracy) and chatbots.",
    "GPT, LLaMA, dan BERT: fine-tuning, analisis sentimen (akurasi 93%), dan chatbot.",
    true,
  ),
  s(
    "TensorFlow",
    "ml",
    "Training and fine-tuning models, including LSTMs.",
    "Training dan fine-tuning model, termasuk LSTM.",
  ),
  s(
    "Hugging Face",
    "ml",
    "Pretrained models and NLP pipelines.",
    "Model pretrained dan pipeline NLP.",
  ),
];

/** Also in the toolbox, listed in one line under the tree. */
export const otherSkills = [
  "JavaScript",
  "PHP",
  "Dart",
  "Express.js",
  "Gin (Go)",
  "Flask",
  "REST API",
  "MySQL",
  "Tailwind CSS",
  "Cloud Run",
  "Git",
  "n8n",
  "PyTorch",
  "System Design",
];
