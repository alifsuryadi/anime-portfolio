import { profile } from "@/content/profile";
import type { Project } from "@/content/projects";

function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();

export const siteTitle = `${profile.name} | Full-Stack Developer Indonesia`;
export const siteDescription =
  "Portfolio Alif Suryadi, Full-Stack Developer & Machine Learning Enthusiast dari Indonesia. Membangun website dan aplikasi yang cepat, aksesibel, dan berbasis AI dengan React, Next.js, Go, Flutter, dan TensorFlow.";

export const keywords = [
  "Alif Suryadi",
  "Full-Stack Developer Indonesia",
  "Full-Stack Developer",
  "Machine Learning Engineer Indonesia",
  "Web Developer Indonesia",
  "React Developer",
  "Next.js Developer",
  "Portfolio",
];

export function personJsonLd() {
  return {
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: profile.name,
    alternateName: profile.nameJa,
    jobTitle: profile.role,
    description: profile.bio,
    email: `mailto:${profile.email}`,
    url: siteUrl,
    image: `${siteUrl}${profile.photo}`,
    nationality: { "@type": "Country", name: "Indonesia" },
    knowsAbout: ["Full-Stack Development", "Machine Learning", "React", "Next.js", "Go", "Flutter", "TensorFlow"],
    sameAs: [profile.github, profile.linkedin],
  };
}

export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      personJsonLd(),
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: `${profile.name} Portfolio`,
        inLanguage: "id-ID",
        author: { "@id": `${siteUrl}/#person` },
      },
    ],
  };
}

export function projectJsonLd(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${siteUrl}/projects/${project.slug}#work`,
    name: project.name,
    description: project.summary,
    url: `${siteUrl}/projects/${project.slug}`,
    image: `${siteUrl}${project.image}`,
    inLanguage: "id-ID",
    keywords: project.stack.join(", "),
    creator: { "@type": "Person", name: profile.name, url: siteUrl },
    ...(project.live ? { sameAs: [project.live, project.repo] } : { sameAs: [project.repo] }),
  };
}

/** Serialise JSON-LD safely for a <script> tag. */
export function jsonLdString(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
