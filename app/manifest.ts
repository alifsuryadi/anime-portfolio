import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} | Full-Stack Developer`,
    short_name: "Alif",
    description: profile.role,
    start_url: "/",
    display: "standalone",
    background_color: "#0B0B14",
    theme_color: "#0B0B14",
    lang: "en",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
