import type { Viewport } from "next";
import "@/app/globals.css";
import { dela, jakarta, zen } from "@/lib/fonts";
import { htmlLang, translate, type Lang } from "@/lib/i18n";
import { jsonLdString, siteJsonLd } from "@/lib/seo";
import { Providers } from "@/components/Providers";
import { LangProvider } from "@/components/LangProvider";
import { Navbar } from "@/components/ui/Navbar";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

export const viewport: Viewport = {
  themeColor: "#0B0B14",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/** Shared <html> shell for both locale root layouts. */
export function RootDocument({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const t = translate(lang);
  return (
    <html
      lang={htmlLang[lang]}
      className={`${dela.variable} ${zen.variable} ${jakarta.variable}`}
      suppressHydrationWarning
    >
      {/* Browser extensions (e.g. ColorZilla's cz-shortcut-listen) add attributes to
          <body> before hydration. This only ignores <body>'s own attributes. */}
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(siteJsonLd(lang)) }}
        />
        <a
          href="#main"
          className="bg-paper text-ink sr-only z-[100] px-4 py-2 font-bold focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {t("skip")}
        </a>
        <noscript>
          <style>{`.loader{display:none!important}.gacha-card .gacha-inner{transform:none!important}`}</style>
        </noscript>
        <LangProvider lang={lang}>
          <Providers>
            <LoadingScreen />
            <Navbar />
            {children}
          </Providers>
        </LangProvider>
        <div className="grain" aria-hidden="true" />
        {/* Shared SVG filters (manga panel ripple). */}
        <svg width="0" height="0" aria-hidden="true" className="absolute">
          <filter id="ripple">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.04"
              numOctaves="1"
              seed="3"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="6s"
                values="0.012 0.04;0.02 0.06;0.012 0.04"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" />
          </filter>
        </svg>
      </body>
    </html>
  );
}
