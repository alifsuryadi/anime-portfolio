import { renderOg, ogSize } from "@/lib/og";
import { getProject, projects } from "@/content/projects";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Alif Suryadi project";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug)!;
  return renderOg({ title: p.name, subtitle: p.role, jp: p.jp, kicker: "ALIF SURYADI · 作品" });
}
