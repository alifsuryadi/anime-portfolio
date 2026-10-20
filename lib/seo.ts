import type { Metadata } from "next";
import { profile } from "@/content/profile";
import type { Project } from "@/content/projects";
import { localePath, ogLocale, schemaLang, type L10n, type Lang } from "@/lib/i18n";

function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();

export const siteTitle: L10n = {
  en: `${profile.name} | Full-Stack Developer from Indonesia`,
  id: `${profile.name} | Full-Stack Developer Indonesia`,
};
export const siteDescription: L10n = {
  en: "Alif Suryadi is a Full-Stack & Machine Learning Engineer from Indonesia, Fullstack Developer at PT Fox Global Intertech (Foxion Technologies), building systems for Biro Klasifikasi Indonesia, and founder & CEO of Livales. Serverless backends on GCP and AWS, React/Next.js frontends, Laravel and Go, and AI/ML systems.",
  id: "Alif Suryadi adalah Full-Stack & Machine Learning Engineer dari Indonesia, Fullstack Developer di PT Fox Global Intertech (Foxion Technologies), membangun sistem untuk Biro Klasifikasi Indonesia, serta founder & CEO Livales. Backend serverless di GCP dan AWS, frontend React/Next.js, Laravel dan Go, serta sistem AI/ML.",
};

export const keywords = [
  "Alif Suryadi",
  "Full-Stack Developer Indonesia",
  "Full-Stack Developer",
  "Full Stack Engineer Jakarta",
  "Machine Learning Engineer Indonesia",
  "Software Engineer AI/ML",
  "Laravel Developer",
  "Web Developer Indonesia",
  "React Developer",
  "Next.js Developer",
  "Portfolio",
];

/** hreflang alternates for a locale-neutral path like "/" or "/projects/x". */
export function alternates(lang: Lang, path: string): Metadata["alternates"] {
  return {
    canonical: localePath(lang, path),
    languages: {
      en: localePath("en", path),
      id: localePath("id", path),
      "x-default": localePath("en", path),
    },
  };
}

export function siteMetadata(lang: Lang): Metadata {
  return {
    metadataBase: new URL(siteUrl),
    title: { default: siteTitle[lang], template: `%s | ${profile.name}` },
    description: siteDescription[lang],
    keywords,
    authors: [{ name: profile.name, url: siteUrl }],
    creator: profile.name,
    alternates: alternates(lang, "/"),
    openGraph: {
      type: "website",
      locale: ogLocale[lang],
      alternateLocale: lang === "en" ? ogLocale.id : ogLocale.en,
      url: localePath(lang, "/"),
      siteName: `${profile.name} Portfolio`,
      title: siteTitle[lang],
      description: siteDescription[lang],
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle[lang],
      description: siteDescription[lang],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    formatDetection: { telephone: false },
  };
}

export function personJsonLd(lang: Lang) {
  return {
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: profile.name,
    alternateName: profile.nameJa,
    jobTitle: profile.role,
    description: profile.bio[lang],
    email: `mailto:${profile.email}`,
    url: siteUrl,
    image: `${siteUrl}${profile.photo}`,
    nationality: { "@type": "Country", name: "Indonesia" },
    knowsAbout: [
      "Full-Stack Development",
      "Machine Learning",
      "Natural Language Processing",
      "React",
      "Next.js",
      "Laravel",
      "Go",
      "AWS",
      "Google Cloud Platform",
      "TensorFlow",
    ],
    worksFor: [
      {
        "@type": "Organization",
        name: "PT Fox Global Intertech",
        alternateName: "Foxion Technologies",
      },
      { "@type": "Organization", name: "Livales", url: "https://livales.com/" },
    ],
    alumniOf: { "@type": "CollegeOrUniversity", name: profile.education.school },
    sameAs: [profile.github, profile.linkedin],
  };
}

export function siteJsonLd(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      personJsonLd(lang),
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: `${profile.name} Portfolio`,
        inLanguage: ["en-US", "id-ID"],
        author: { "@id": `${siteUrl}/#person` },
      },
    ],
  };
}

export function projectJsonLd(project: Project, lang: Lang) {
  const url = `${siteUrl}${localePath(lang, `/projects/${project.slug}`)}`;
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${url}#work`,
    name: project.name,
    description: project.summary[lang],
    url,
    image: `${siteUrl}${project.image}`,
    inLanguage: schemaLang[lang],
    ...(project.stack.length ? { keywords: project.stack.join(", ") } : {}),
    creator: { "@id": `${siteUrl}/#person` },
    sameAs: [project.live, project.repo].filter(Boolean),
  };
}

/** Serialise JSON-LD safely for a <script> tag. */
export function jsonLdString(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
