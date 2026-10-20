/**
 * Two languages: English is the default at "/", Indonesian lives under "/id".
 * Content files use `L10n` values; UI strings live in `dict` below.
 */
export const locales = ["en", "id"] as const;
export type Lang = (typeof locales)[number];
export const defaultLang: Lang = "en";

export type L10n<T = string> = Record<Lang, T>;

export const htmlLang: Record<Lang, string> = { en: "en", id: "id" };
export const ogLocale: Record<Lang, string> = { en: "en_US", id: "id_ID" };
export const schemaLang: Record<Lang, string> = { en: "en-US", id: "id-ID" };
export const langName: Record<Lang, string> = { en: "English", id: "Bahasa Indonesia" };

/** "/projects/x#top" -> "/id/projects/x#top" for Indonesian, unchanged for English. */
export function localePath(lang: Lang, path: string) {
  if (lang === defaultLang) return path;
  const [p, hash] = path.split("#");
  const base = p === "/" || p === "" ? "/id" : `/id${p}`;
  return hash !== undefined ? `${base}#${hash}` : base;
}

/** Strips the locale prefix: "/id/projects/x" -> "/projects/x". */
export function basePath(pathname: string) {
  if (pathname === "/id") return "/";
  return pathname.startsWith("/id/") ? pathname.slice(3) : pathname;
}

export const langFromPath = (pathname: string): Lang =>
  pathname === "/id" || pathname.startsWith("/id/") ? "id" : "en";

export const dict = {
  skip: { en: "Skip to content", id: "Langsung ke konten" },
  navMain: { en: "Main navigation", id: "Navigasi utama" },
  home: { en: "home", id: "beranda" },
  navAbout: { en: "About", id: "Tentang" },
  navSkills: { en: "Skills", id: "Keahlian" },
  navProjects: { en: "Work", id: "Karya" },
  navExperience: { en: "Journey", id: "Pengalaman" },
  navAchievements: { en: "Badges", id: "Lencana" },
  navContact: { en: "Contact", id: "Kontak" },
  motionOn: { en: "Motion", id: "Animasi" },
  motionOff: { en: "Motion off", id: "Animasi mati" },
  motionOnHint: { en: ": on, press to turn off", id: ": nyala, tekan untuk mematikan" },
  motionOffHint: { en: ": off, press to turn on", id: ": mati, tekan untuk menyalakan" },
  motionTitleOn: { en: "Turn animations off", id: "Matikan animasi" },
  motionTitleOff: { en: "Turn animations on", id: "Nyalakan animasi" },
  openMenu: { en: "Open menu", id: "Buka menu" },
  closeMenu: { en: "Close menu", id: "Tutup menu" },
  downloadCv: { en: "Download CV", id: "Unduh CV" },
  switchLang: { en: "Baca dalam Bahasa Indonesia", id: "Read in English" },
  loading: { en: "Loading page", id: "Memuat halaman" },
  loadingCaps: { en: "LOADING", id: "MEMUAT" },

  heroRoleLabel: { en: "Role", id: "Peran" },
  heroLine: {
    en: "I build fast, accessible and slightly magical products, from full-stack apps to AI features. Currently at Foxion, and building my own startup, Livales.",
    id: "Saya membangun produk yang cepat, aksesibel, dan sedikit ajaib, dari aplikasi full-stack sampai fitur AI. Sekarang di Foxion, sambil membangun startup sendiri, Livales.",
  },
  heroCta: { en: "See my work", id: "Lihat karya" },
  heroScroll: { en: "Scroll to About", id: "Gulir ke bagian Tentang" },

  aboutTitleA: { en: "About", id: "Tentang" },
  aboutTitleB: { en: "me", id: "saya" },
  cardLabel: { en: "Character profile card", id: "Kartu profil karakter" },
  photoAlt: { en: "Photo of Alif Suryadi", id: "Foto Alif Suryadi" },
  education: { en: "Education", id: "Pendidikan" },
  honors: { en: "Honors", id: "Penghargaan" },
  languages: { en: "Languages", id: "Bahasa" },
  certifications: { en: "Certifications", id: "Sertifikasi" },
  activeSince: { en: "Active since", id: "Aktif sejak" },

  skillsIntro: {
    en: "skills unlocked along the way. Hover a node to light up its path (and its orb next to the character), click to read about it.",
    id: "skill yang sudah terbuka di perjalanan ini. Arahkan kursor ke node untuk menyalakan jalurnya (dan orb-nya di samping karakter), klik untuk membaca deskripsinya.",
  },
  skillAbout: { en: "About", id: "Tentang" },
  mainSkill: { en: "main", id: "utama" },
  alsoUsed: { en: "Also in the toolbox", id: "Juga dipakai" },
  moreProjects: { en: "More projects", id: "Proyek lain" },
  moreProjectsIntro: {
    en: "Earlier side quests, each with its own page.",
    id: "Side quest sebelumnya, masing-masing punya halaman sendiri.",
  },
  earlierStops: { en: "Earlier stations", id: "Stasiun sebelumnya" },
  skillsTitleA: { en: "Skill", id: "Pohon" },
  skillsTitleB: { en: "tree", id: "skill" },
  techStack: { en: "Tech stack", id: "Tech stack" },

  projectsTitle: { en: "Selected work", id: "Karya pilihan" },
  projectsIntro: {
    en: "chapters, from my own startup and a state-owned ship register to digital commerce and AI finance. Hover a panel to colour it in, click to read the story.",
    id: "chapter, dari startup saya sendiri dan sistem register kapal BUMN sampai toko digital dan AI finansial. Arahkan kursor ke panel untuk mewarnainya, klik untuk membaca ceritanya.",
  },
  projectsScroll: { en: "SCROLL →", id: "GULIR →" },

  expTitleA: { en: "The", id: "Jalur" },
  expTitleB: { en: "journey", id: "perjalanan" },
  expIntro: {
    en: "Like riding a train in Tokyo: every station is a chapter, from my current roles back to my first job in 2022. Scroll to move the train.",
    id: "Seperti naik kereta di Tokyo: tiap stasiun adalah satu babak, dari peran saat ini sampai pekerjaan pertama di 2022. Gulir untuk menjalankan keretanya.",
  },
  station: { en: "station", id: "stasiun" },

  achTitleA: { en: "Achievement", id: "Pencapaian" },
  achTitleB: { en: "unlocked", id: "terbuka" },
  achIntro: {
    en: "The loot from the journey: a degree, an honor, three languages and ten certifications.",
    id: "Hasil dari perjalanan ini: satu gelar, satu penghargaan, tiga bahasa, dan sepuluh sertifikasi.",
  },
  aboutMore: {
    en: "Education, certifications & languages",
    id: "Pendidikan, sertifikasi & bahasa",
  },

  contactTitleA: { en: "Let's make the", id: "Ayo bikin" },
  contactTitleB: { en: "next episode", id: "episode berikutnya" },
  contactIntro: {
    en: "Got an idea for a website, an app or an AI feature? Tell me about it. I usually reply within 1–2 days.",
    id: "Punya ide website, aplikasi, atau fitur AI? Ceritakan saja. Saya biasanya membalas dalam 1–2 hari.",
  },
  bubble: { en: "Can't wait to hear from you!", id: "Saya tunggu pesanmu!" },
  newTab: { en: " (new tab)", id: " (tab baru)" },
  formName: { en: "Name", id: "Nama" },
  formEmail: { en: "Email", id: "Email" },
  formMessage: { en: "Message", id: "Pesan" },
  formSend: { en: "Send message", id: "Kirim pesan" },
  formSending: { en: "Sending…", id: "Mengirim…" },
  formSent: {
    en: "Thank you! Your message is on its way. ありがとう!",
    id: "Terima kasih! Pesanmu sudah terkirim. ありがとう!",
  },
  formMailto: {
    en: "Your email app should open with the message ready to send. Nothing opened? Email me directly at",
    id: "Aplikasi email-mu seharusnya terbuka dengan pesan yang siap dikirim. Tidak terbuka? Email langsung ke",
  },
  formError: {
    en: "Couldn't send it. Try again, or email me directly at",
    id: "Gagal mengirim. Coba lagi, atau email langsung ke",
  },
  errName: { en: "Please enter at least 2 characters.", id: "Nama minimal 2 karakter." },
  errEmail: { en: "That email doesn't look right.", id: "Format email belum benar." },
  errMessageShort: { en: "Please write at least 10 characters.", id: "Pesan minimal 10 karakter." },
  errMessageLong: { en: "Keep it under 2000 characters.", id: "Pesan maksimal 2000 karakter." },
  mailSubject: { en: "Hi Alif, from", id: "Halo Alif, dari" },

  footerHint: {
    en: "Click the sky for shooting stars · blow the petals with your cursor",
    id: "Klik langit untuk bintang jatuh · tiup sakura dengan kursor",
  },
  thanks: { en: "Arigatō · Thanks for stopping by", id: "Arigatō · Terima kasih sudah mampir" },
  footerLinks: { en: "Footer links", id: "Tautan footer" },
  backToTop: { en: "Back to top", id: "Kembali ke atas" },
  madeWith: { en: "Made with Next.js & Three.js.", id: "Dibuat dengan Next.js & Three.js." },
  chibiOn: { en: "ちびモード ON! Chibi mode activated", id: "ちびモード ON! Mode chibi aktif" },
  chibiOff: { en: "ちびモード OFF · Chibi mode off", id: "ちびモード OFF · Mode chibi mati" },
  konamiHint: { en: "Psst…", id: "Psst…" },
  classLabel: { en: "Class", id: "Kelas" },

  breadcrumb: { en: "Breadcrumb", id: "Breadcrumb" },
  crumbHome: { en: "Home", id: "Beranda" },
  crumbWork: { en: "Work", id: "Karya" },
  viewLive: { en: "View live", id: "Lihat live" },
  repo: { en: "GitHub repository", id: "Repository GitHub" },
  otherProjects: { en: "Other projects", id: "Proyek lain" },
  prev: { en: "← Previous", id: "← Sebelumnya" },
  next: { en: "Next →", id: "Berikutnya →" },

  lostTitle: { en: "404: You got lost", id: "404: Kamu tersesat" },
  lostText: {
    en: "This page isn't on the Neo-Tokyo map.",
    id: "Halaman ini tidak ada di peta Neo-Tokyo.",
  },
  lostBack: { en: "Back home", id: "Kembali ke beranda" },
} satisfies Record<string, L10n>;

export type DictKey = keyof typeof dict;

export const translate = (lang: Lang) => (key: DictKey) => dict[key][lang];
