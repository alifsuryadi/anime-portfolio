"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { bus } from "@/lib/scroll-state";
import { sectionTitles } from "@/content/japanese-phrases";
import { profile } from "@/content/profile";
import { useQuality } from "@/components/QualityProvider";

const links = [
  { id: "about", label: "Tentang" },
  { id: "skills", label: "Keahlian" },
  { id: "projects", label: "Karya" },
  { id: "experience", label: "Pengalaman" },
  { id: "contact", label: "Kontak" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const { motionOff, setMotionOff } = useQuality();
  const [active, setActive] = useState<string>("hero");
  const [open, setOpen] = useState(false);
  const home = pathname === "/";

  useEffect(() => bus.on("section", (d) => setActive((d as { to: string }).to)), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const href = (id: string) => (home ? `#${id}` : `/#${id}`);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        aria-label="Navigasi utama"
        className="mx-auto flex h-[var(--header-h)] max-w-7xl items-center justify-between gap-4 px-4 md:px-8"
      >
        <Link href="/" className="group flex items-center gap-2" aria-label={`${profile.name}, beranda`}>
          <span className="grid size-9 place-items-center bg-sakura font-jp text-lg font-bold text-ink transition-transform group-hover:-rotate-12">
            ア
          </span>
          <span className="hidden font-display text-sm tracking-wider sm:inline">ALIF SURYADI</span>
        </Link>

        <ul className="hidden items-center gap-1 rounded-full border border-line bg-ink/70 px-2 py-1 backdrop-blur-md lg:flex">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={href(l.id)}
                aria-current={home && active === l.id ? "true" : undefined}
                className={`group relative flex flex-col items-center rounded-full px-4 py-1.5 text-sm transition-colors ${
                  home && active === l.id ? "bg-paper text-ink" : "text-paper hover:text-cyan"
                }`}
              >
                <span lang="ja" aria-hidden="true" className="font-jp text-[0.6rem] leading-none opacity-70">
                  {sectionTitles[l.id].ja}
                </span>
                <span className="font-semibold">{l.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMotionOff(!motionOff)}
            aria-pressed={motionOff}
            className="flex h-10 items-center gap-2 rounded-full border border-line bg-ink/70 px-3 text-xs font-semibold backdrop-blur-md hover:border-cyan"
            title={motionOff ? "Nyalakan animasi" : "Matikan animasi"}
          >
            <span aria-hidden="true" className={`size-2.5 rounded-full ${motionOff ? "bg-muted" : "bg-cyan shadow-[0_0_8px_var(--neon-cyan)]"}`} />
            <span>{motionOff ? "Animasi mati" : "Animasi"}</span>
            <span className="sr-only">{motionOff ? ": mati, tekan untuk menyalakan" : ": nyala, tekan untuk mematikan"}</span>
          </button>
          <a
            href={profile.cv}
            download
            className="hidden h-10 items-center bg-paper px-4 text-sm font-bold text-ink hover:bg-cyan sm:flex"
            data-magnetic
          >
            CV
          </a>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-line bg-ink/70 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">{open ? "Tutup menu" : "Buka menu"}</span>
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h10M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="fixed inset-0 top-[var(--header-h)] bg-ink/95 backdrop-blur-lg lg:hidden">
          <ul className="flex flex-col gap-2 p-6">
            {links.map((l) => (
              <li key={l.id}>
                <a
                  href={href(l.id)}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline justify-between border-b border-line py-4 font-display text-3xl"
                >
                  {l.label}
                  <span lang="ja" aria-hidden="true" className="font-jp text-base text-sakura">
                    {sectionTitles[l.id].ja}
                  </span>
                </a>
              </li>
            ))}
            <li className="pt-4">
              <a href={profile.cv} download className="btn-neon">
                Unduh CV
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
