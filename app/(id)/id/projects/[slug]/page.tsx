import type { Metadata } from "next";
import { ProjectPage, projectMetadata, projectParams } from "@/components/site/ProjectPage";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = projectParams;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return projectMetadata((await params).slug, "id");
}

export default async function Page({ params }: Props) {
  return <ProjectPage slug={(await params).slug} lang="id" />;
}
