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
    "Fast backends, like Naima's ESG SaaS on AWS.",
    "Backend yang cepat, seperti SaaS ESG Naima di AWS.",
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
    "BKI's ship register, Sekalipay's affiliate system and a BUMN document system.",
    "Register kapal BKI, sistem affiliate Sekalipay, dan sistem dokumen BUMN.",
  ),
  s(
    "Tailwind CSS",
    "web",
    "Utility-first styling, from Naima's ESG platform to this site.",
    "Styling utility-first, dari platform ESG Naima sampai situs ini.",
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
    "Flask",
    "data",
    "Python APIs for ML models, like the FinBoost chatbot.",
    "API Python untuk model ML, seperti chatbot FinBoost.",
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
    "Relational database, e.g. Sekalipay's affiliate system.",
    "Database relasional, misalnya sistem affiliate Sekalipay.",
  ),
  s(
    "MySQL",
    "data",
    "Relational database behind many client projects.",
    "Database relasional untuk banyak proyek klien.",
  ),
  s(
    "SQL Server",
    "data",
    "Enterprise database for BKI and a BUMN document system, with tuned queries.",
    "Database enterprise untuk BKI dan sistem dokumen BUMN, dengan query yang dioptimalkan.",
  ),
  s(
    "Firebase",
    "data",
    "Firestore, Cloud Messaging and hosting, from Studyo.io to Livales.",
    "Firestore, Cloud Messaging, dan hosting, dari Studyo.io sampai Livales.",
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
    "Containerized services and blue-green deployments.",
    "Service dalam container dan blue-green deployment.",
  ),
  s(
    "GCP",
    "ops",
    "Serverless Cloud Functions and Cloud Storage (Studyo.io), ML deployment (FinBoost).",
    "Cloud Functions serverless dan Cloud Storage (Studyo.io), deploy ML (FinBoost).",
  ),
  s(
    "Cloud Run",
    "ops",
    "Serverless containers, e.g. the FinBoost chatbot service.",
    "Container serverless, misalnya service chatbot FinBoost.",
  ),
  s(
    "AWS",
    "ops",
    "Go microservices on ECS and serverless backends.",
    "Microservice Go di ECS dan backend serverless.",
  ),
  s("Git", "ops", "Version control and team collaboration.", "Version control dan kolaborasi tim."),
  s(
    "CI/CD",
    "ops",
    "GitHub Actions pipelines, e.g. at Naima Sustainability.",
    "Pipeline GitHub Actions, misalnya di Naima Sustainability.",
  ),
  s(
    "n8n",
    "ops",
    "Workflow automation without the glue code.",
    "Otomasi workflow tanpa banyak kode perekat.",
  ),
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
    "Hugging Face",
    "ml",
    "Pretrained models and NLP pipelines.",
    "Model pretrained dan pipeline NLP.",
  ),
  s(
    "LLM (GenAI)",
    "ml",
    "GPT, LLaMA and BERT: fine-tuning, sentiment analysis (93% accuracy) and chatbots.",
    "GPT, LLaMA, dan BERT: fine-tuning, analisis sentimen (akurasi 93%), dan chatbot.",
  ),
];
