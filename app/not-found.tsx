import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" data-scene="detail" className="relative z-10 grid min-h-[100svh] place-items-center px-4 text-center">
      <div>
        <p lang="ja" aria-hidden="true" className="font-jp text-7xl font-bold text-sakura">迷子</p>
        <h1 className="mt-4 font-display text-4xl">404: Kamu tersesat</h1>
        <p className="mt-3 text-muted">Halaman ini tidak ada di peta Neo-Tokyo.</p>
        <Link href="/" className="btn-neon mt-8">Kembali ke beranda</Link>
      </div>
    </main>
  );
}
