export type SkillGroup = "lang" | "web" | "data" | "ops" | "ml";

export type Skill = { name: string; group: SkillGroup; note: string };

export const skillGroups: Record<SkillGroup, { label: string; jp: string }> = {
  lang: { label: "Bahasa", jp: "言語" },
  web: { label: "Web & Mobile", jp: "画面" },
  data: { label: "Data & API", jp: "資料" },
  ops: { label: "Cloud & Ops", jp: "雲" },
  ml: { label: "Machine Learning", jp: "知能" },
};

export const skills: Skill[] = [
  { name: "TypeScript", group: "lang", note: "Bahasa utama untuk web: tipe yang ketat, refactor tanpa takut." },
  { name: "Go (Golang)", group: "lang", note: "Service backend yang cepat dan ringan." },
  { name: "Python", group: "lang", note: "Bahasa utama untuk eksperimen dan training model ML." },
  { name: "PHP", group: "lang", note: "Website dan aplikasi web berbasis Laravel." },
  { name: "React", group: "web", note: "Library UI andalan untuk antarmuka interaktif." },
  { name: "Next.js", group: "web", note: "SSR/SSG, SEO, dan performa untuk produk web." },
  { name: "Flutter", group: "web", note: "Aplikasi mobile lintas platform, seperti Pasal Pintar." },
  { name: "Laravel", group: "web", note: "Framework PHP untuk marketplace dan dashboard." },
  { name: "Node.js", group: "data", note: "Runtime JavaScript di sisi server." },
  { name: "Express.js", group: "data", note: "REST API yang ringkas di atas Node.js." },
  { name: "Gin (Go)", group: "data", note: "HTTP framework Go untuk API berperforma tinggi." },
  { name: "REST API", group: "data", note: "Desain endpoint yang konsisten dan terdokumentasi." },
  { name: "PostgreSQL", group: "data", note: "Database relasional untuk data yang serius." },
  { name: "MySQL", group: "data", note: "Database relasional untuk banyak proyek klien." },
  { name: "Firebase", group: "data", note: "Auth, Firestore, dan hosting untuk iterasi cepat." },
  { name: "System Design", group: "data", note: "Merancang arsitektur yang skalabel dan mudah dirawat." },
  { name: "Docker", group: "ops", note: "Lingkungan yang konsisten dari laptop sampai server." },
  { name: "GCP", group: "ops", note: "Deploy model dan API, seperti di FinBoost." },
  { name: "AWS", group: "ops", note: "Layanan cloud untuk hosting dan storage." },
  { name: "Git", group: "ops", note: "Version control dan kolaborasi tim." },
  { name: "CI/CD", group: "ops", note: "Build, test, dan deploy otomatis." },
  { name: "TensorFlow", group: "ml", note: "Training dan fine-tuning model, termasuk LSTM." },
  { name: "PyTorch", group: "ml", note: "Riset dan eksperimen deep learning." },
  { name: "LLM (GenAI)", group: "ml", note: "Fine-tuning dan integrasi model bahasa besar." },
];
