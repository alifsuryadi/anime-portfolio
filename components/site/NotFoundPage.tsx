import Link from "next/link";
import { localePath, translate, type Lang } from "@/lib/i18n";

export function NotFoundPage({ lang }: { lang: Lang }) {
  const t = translate(lang);
  return (
    <main
      id="main"
      data-scene="detail"
      className="relative z-10 grid min-h-[100svh] place-items-center px-4 text-center"
    >
      <div>
        <p lang="ja" aria-hidden="true" className="font-jp text-sakura text-7xl font-bold">
          迷子
        </p>
        <h1 className="font-display mt-4 text-4xl">{t("lostTitle")}</h1>
        <p className="text-muted mt-3">{t("lostText")}</p>
        <Link href={localePath(lang, "/")} className="btn-neon mt-8">
          {t("lostBack")}
        </Link>
      </div>
    </main>
  );
}
