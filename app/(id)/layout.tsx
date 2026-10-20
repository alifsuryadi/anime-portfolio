import type { Metadata } from "next";
import { RootDocument } from "@/components/site/RootDocument";
import { siteMetadata } from "@/lib/seo";

export { viewport } from "@/components/site/RootDocument";

export const metadata: Metadata = siteMetadata("id");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootDocument lang="id">{children}</RootDocument>;
}
