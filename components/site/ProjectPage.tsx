import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/projects";
import { profile } from "@/content/profile";
import { localePath, ogLocale, translate, type Lang } from "@/lib/i18n";
import { alternates, jsonLdString, projectJsonLd, siteUrl } from "@/lib/seo";
import { DecodeText } from "@/components/anim/DecodeText";

export const projectParams = () => projects.map((p) => ({ slug: p.slug }));

export function projectMetadata(slug: string, lang: Lang): Metadata {
  const p = getProject(slug);
  if (!p) return {};
  const title = `${p.name}: ${p.role}`;
  const path = `/projects/${p.slug}`;
  return {
    title,
    description: p.summary[lang],
    alternates: alternates(lang, path),
    openGraph: {
      type: "article",
      locale: ogLocale[lang],
      url: localePath(lang, path),
      title: `${title} | ${profile.name}`,
      description: p.summary[lang],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${profile.name}`,
      description: p.summary[lang],
    },
  };
}

export function ProjectPage({ slug, lang }: { slug: string; lang: Lang }) {
  const p = getProject(slug);
  if (!p) notFound();
  const t = translate(lang);
  const i = projects.findIndex((x) => x.slug === p.slug);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  const href = (path: string) => localePath(lang, path);
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("crumbHome"), item: `${siteUrl}${href("/")}` },
      {
        "@type": "ListItem",
        position: 2,
        name: t("crumbWork"),
        item: `${siteUrl}${href("/#projects")}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: p.name,
        item: `${siteUrl}${href(`/projects/${p.slug}`)}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(projectJsonLd(p, lang)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumb) }}
      />
      <main id="main" data-scene="detail" className="relative z-10 px-4 pt-28 pb-24 md:px-8">
        <article className="mx-auto max-w-5xl">
          <nav aria-label={t("breadcrumb")} className="text-muted text-sm">
            <ol className="flex flex-wrap gap-2">
              <li>
                <Link href={href("/")} className="hover:text-cyan">
                  {t("crumbHome")}
                </Link>{" "}
                /
              </li>
              <li>
                <Link href={href("/#projects")} className="hover:text-cyan">
                  {t("crumbWork")}
                </Link>{" "}
                /
              </li>
              <li aria-current="page" className="text-paper">
                {p.name}
              </li>
            </ol>
          </nav>

          <header className="mt-8 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="text-sakura text-sm font-bold tracking-widest">{p.role}</p>
              <h1 className="font-display mt-2 text-5xl leading-[0.9] md:text-7xl">{p.name}</h1>
            </div>
            <DecodeText
              text={p.jp}
              className="vertical-jp text-cyan hidden text-4xl font-bold md:block"
            />
          </header>

          <div className="border-paper bg-paper relative mt-10 aspect-[16/9] overflow-hidden border-4 shadow-[12px_12px_0_var(--sakura)]">
            <Image
              src={p.image}
              alt={p.imageAlt[lang]}
              fill
              priority
              sizes="(min-width: 1024px) 64rem, 100vw"
              className="object-cover object-top"
            />
          </div>

          <div className="mt-12 grid gap-10 md:grid-cols-12">
            <div className="bg-ink/70 text-paper/90 space-y-4 rounded-sm text-lg leading-relaxed backdrop-blur-sm md:col-span-8">
              <p className="text-paper font-semibold">{p.summary[lang]}</p>
              {p.description[lang].map((d) => (
                <p key={d}>{d}</p>
              ))}
            </div>
            <aside className="md:col-span-4">
              <h2 className="text-muted text-sm font-bold tracking-widest uppercase">Tech stack</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <li key={s} className="chip">
                    {s}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3">
                {p.live && (
                  <a
                    href={p.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-neon"
                    data-magnetic
                  >
                    {t("viewLive")} <span aria-hidden="true">↗</span>
                    <span className="sr-only">{t("newTab")}</span>
                  </a>
                )}
                <a
                  href={p.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-neon btn-neon--cyan"
                  data-magnetic
                >
                  {t("repo")} <span aria-hidden="true">↗</span>
                  <span className="sr-only">{t("newTab")}</span>
                </a>
              </div>
            </aside>
          </div>

          <nav
            aria-label={t("otherProjects")}
            className="border-line mt-20 grid gap-4 border-t pt-8 sm:grid-cols-2"
          >
            <Link
              href={href(`/projects/${prev.slug}`)}
              className="group border-line hover:border-sakura border-2 p-5"
            >
              <span className="text-muted text-xs">{t("prev")}</span>
              <span className="font-display group-hover:text-sakura mt-1 block text-2xl">
                {prev.name}
              </span>
            </Link>
            <Link
              href={href(`/projects/${next.slug}`)}
              className="group border-line hover:border-cyan border-2 p-5 text-right"
            >
              <span className="text-muted text-xs">{t("next")}</span>
              <span className="font-display group-hover:text-cyan mt-1 block text-2xl">
                {next.name}
              </span>
            </Link>
          </nav>
        </article>
      </main>
    </>
  );
}
