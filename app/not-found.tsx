import Link from "next/link";

export default function NotFound() {
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
        <h1 className="font-display mt-4 text-4xl">404: Kamu tersesat</h1>
        <p className="text-muted mt-3">Halaman ini tidak ada di peta Neo-Tokyo.</p>
        <Link href="/" className="btn-neon mt-8">
          Kembali ke beranda
        </Link>
      </div>
    </main>
  );
}
