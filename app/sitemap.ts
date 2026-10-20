import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { localePath } from "@/lib/i18n";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = ["/", ...projects.map((p) => `/projects/${p.slug}`)];
  return paths.flatMap((path) => {
    const languages = {
      en: `${siteUrl}${localePath("en", path)}`,
      id: `${siteUrl}${localePath("id", path)}`,
    };
    return (["en", "id"] as const).map((lang) => ({
      url: languages[lang],
      lastModified: now,
      changeFrequency: path === "/" ? ("monthly" as const) : ("yearly" as const),
      priority: path === "/" ? 1 : 0.7,
      alternates: { languages },
    }));
  });
}
