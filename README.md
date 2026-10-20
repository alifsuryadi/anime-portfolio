# Alif Suryadi · Neo-Tokyo at Dusk (東京の黄昏)

Portfolio Alif Suryadi, Full-Stack Developer & Machine Learning Enthusiast dari Indonesia.
Konsepnya: kamu masuk ke dunia anime. Sebuah rooftop di Neo-Tokyo saat senja, dengan
kuil torii kecil, sakura yang tertiup angin, dan karakter chibi yang menemani dari hero
sampai footer.

Next.js 15 (App Router, SSG) · TypeScript · Tailwind CSS v4 · three / React Three Fiber /
drei / postprocessing · @pixiv/three-vrm · GSAP + ScrollTrigger · Lenis · Motion · Zod.

## Menjalankan

```bash
npm install        # juga menyalin decoder Draco/KTX2 ke public/ (postinstall)
npm run dev        # http://localhost:3000
npm run build      # build SSG produksi
npm run lint
npm run typecheck
```

Variabel lingkungan (lihat `.env.example`):

| Nama                       | Fungsi                                                                                                      |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`     | URL kanonis (canonical, sitemap, OG, JSON-LD). Di Vercel otomatis jatuh ke `VERCEL_PROJECT_PRODUCTION_URL`. |
| `NEXT_PUBLIC_FORMSPREE_ID` | ID form Formspree. Kalau kosong, form kontak membuka email yang sudah terisi (mailto).                      |

Deploy: import repo ini di Vercel, tanpa konfigurasi tambahan. Set `NEXT_PUBLIC_SITE_URL`
ke domain final supaya canonical dan sitemap benar.

## Dua bahasa (EN / ID)

English adalah bahasa default di `/`, Bahasa Indonesia di `/id` (termasuk `/id/projects/<slug>`).
Tiap bahasa punya root layout sendiri (`app/(en)` dan `app/(id)`) supaya `<html lang>`,
metadata, Open Graph locale, dan JSON-LD sesuai. Semua halaman memasang `hreflang`
(`en`, `id`, `x-default`), dan sitemap memuat kedua versi beserta alternatifnya.

- Teks UI ada di `dict` dalam `lib/i18n.ts` (selalu isi `en` dan `id`).
- Konten di `content/*.ts` memakai nilai `L10n` (`{ en, id }`).
- Komponen server memakai `translate(lang)`, komponen client memakai `useT()` / `useLang()`.
- Tombol **EN / ID** di navbar pindah ke halaman yang sama di bahasa lain, termasuk section yang sedang dibuka.

## Arsitektur

```
app/                (en)/ dan (id)/id/: root layout per bahasa, page, projects/[slug] (SSG),
                    opengraph-image (next/og), 404; plus sitemap, robots, manifest, ikon
components/
  site/             RootDocument, HomePage, ProjectPage, NotFoundPage (dipakai kedua bahasa)
  three/            Scene (satu <Canvas> global), CameraRig, Character (VRM / chibi),
                    ChibiModel, faceTextures (mata/mulut/blush anime), VrmModel, SakuraField, SkillOrbs, Torii, Rooftop,
                    Skyline, Sky, ShootingStars, Effects, choreo.ts (driver pose)
  anim/             KanjiScramble, DecodeText, SplitText, CursorFollower,
                    SectionTransition, SectionTitle, Backdrop
  sections/         Hero, About, Skills, Projects, Experience, Contact, Footer
  ui/               Navbar, LoadingScreen, TiltCard, SkillTree, ProjectsTrack,
                    Timeline, ContactForm, StatBars, ChibiArt, StaticCharacter
content/            profile, projects, skills, experience, japanese-phrases
lib/                i18n, scenes.config.ts, gsap, lenis, quality, scroll-state, seo, og, fonts
assets/             subset font (dibuat oleh `npm run fonts`)
public/             projects/, models/, sequences/, CV, ikon
```

Alur data:

1. `SmoothScroll` menjalankan Lenis yang tersinkron dengan ScrollTrigger, lalu menulis
   progres scroll ke `scrollState` (objek mutable, tidak memicu render React).
2. Setiap elemen `data-scene="…"` adalah satu _key_. `scrollState.sectionFloat` (mis. `2.4`
   = 40% dari section 2 ke 3) dipakai `CameraRig` dan `CharacterDriver` untuk mem-blend
   kamera, posisi, pose, dan ekspresi dari `lib/scenes.config.ts`.
3. Canvas WebGL dimuat dengan `dynamic(..., { ssr: false })` setelah browser idle, jadi
   HTML hasil SSG (semua teks, proyek, heading) tampil duluan dan LCP berasal dari HTML.

### Mode kualitas

| Mode   | Kapan                                                                                                     | Isi                                                                                                   |
| ------ | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| High   | Desktop dengan GPU                                                                                        | Semua efek: bloom, chromatic aberration (naik saat scroll cepat), vignette, grain, 500 kelopak sakura |
| Low    | HP / layar sempit / CPU atau RAM kecil, atau `PerformanceMonitor` mendeteksi FPS turun                    | Tanpa post-processing, ±160 kelopak                                                                   |
| Static | `prefers-reduced-motion`, tombol "Animasi" dimatikan, tidak ada WebGL, atau renderer software (tanpa GPU) | Tanpa canvas: ilustrasi chibi 2D, transisi dan teks decode dimatikan                                  |

Tombol **Animasi** di navbar menyimpan pilihan pengguna di `localStorage`. Untuk menguji
mode tertentu di perangkat apa pun, tambahkan `?quality=high`, `?quality=low`, atau
`?quality=static` ke URL.

## Konsep tiap section

| Section         | Momen interaktif                                                                                                                                                                                                             |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero 始まり     | Karakter di tengah rooftop, langit senja shader (matahari bergaris, awan fbm). Huruf nama "melompat" saat disentuh kursor, `KanjiScramble` men-decode peran, scroll indicator berbentuk kunai.                               |
| About 自己紹介  | Karakter pindah ke kanan dan melambai. Kartu profil karakter (SSR, kelas "Full-Stack Mage", stat bar) miring 3D mengikuti kursor dengan kilau holo.                                                                          |
| Skills 技術     | Pose "cast", orb tiap cabang skill mengorbit karakter. Skill tree ala RPG: hover menyalakan jalur dan orb 3D yang sesuai, klik membuka deskripsi.                                                                            |
| Projects 作品   | Halaman manga kertas, panel horizontal yang di-pin. Hover: halftone hitam-putih jadi berwarna + distorsi (SVG displacement). Masuk/keluar dengan panel wipe. Canvas di-pause selama halaman kertas menutupi layar.           |
| Experience 経験 | Timeline jalur kereta Tokyo: kereta mini berjalan ikut scroll dan menyalakan stasiun. Karakter berjalan menyamping, langkahnya mengikuti kecepatan scroll.                                                                   |
| Contact 連絡    | Karakter menghadap kamera dan tersenyum dengan balon "お待ちしています!". Form tervalidasi Zod, tombol magnetic, link sosial efek glitch.                                                                                    |
| Footer 終わり   | Malam: kamera menghadap torii, karakter bersorak. Klik langit untuk bintang jatuh, gerakkan kursor untuk meniup sakura, ありがとう men-decode, tombol kembali-ke-atas berbentuk kunai. Easter egg: Konami code → mode chibi. |

Global: cursor titik + hitodama (roh api kecil bermata) dengan pegas dan jejak kelopak
sakura. Kursor membesar dengan 見る di atas link, jadi lingkaran panah di atas panel proyek,
dan menempel di tombol magnetic. Di layar sentuh diganti efek ripple. Transisi antar
section: ledakan speed lines + flash singkat saat scroll cepat.

## Mengganti karakter (VRM)

Sekarang situs memakai **karakter chibi prosedural** (`components/three/ChibiModel.tsx`),
desain original bergaya moe: rambut lavender dengan twin tail dan pita sakura, headphone
telinga kucing, mata besar berkilau, mulut "ω", hoodie kebesaran, dan rok lipit. Wajahnya
digambar sebagai tekstur canvas di `components/three/faceTextures.ts` (ganti warna iris,
bentuk mulut, atau blush di sana), dan rig-nya sama seperti VRM. Ilustrasi 2D yang sama
ada di `components/ui/ChibiArt.tsx`. Jangan memakai karakter anime berhak cipta.
Untuk memakai model VRM:

1. Buat karakter original di [VRoid Studio](https://vroid.com/en/studio) (atau pakai model
   berlisensi yang mengizinkan penggunaan seperti ini) dan ekspor sebagai `.vrm`.
2. (Opsional, disarankan) kompres supaya < 5 MB, mis. dengan
   [gltf-transform](https://gltf-transform.dev): `gltf-transform optimize in.vrm out.vrm --compress meshopt --texture-compress ktx2`.
   Loader sudah mendukung Draco, meshopt, dan KTX2 (decoder di-host sendiri di `public/draco` dan `public/basis`).
3. Simpan di `public/models/character.vrm`.
4. Di `lib/scenes.config.ts`, set `character.vrmUrl = "/models/character.vrm"` (dan
   `vrmScale` kalau perlu).
5. Tambahkan lisensi model di `CREDITS.md`.

Pose, ekspresi (`happy`, `surprised`, `relaxed`, kedip otomatis), posisi, dan kamera tiap
section ada di `lib/scenes.config.ts`. Model VRM dan chibi membaca driver yang sama, jadi
mengganti model tidak butuh refactor. Kepala menoleh ke kursor dan mata memakai VRM `lookAt`.
Rambut/rok VRM bergoyang lewat spring bone bawaan (`vrm.update`).

### Fallback image sequence (opsional)

Untuk perangkat tanpa GPU, `StaticCharacter` bisa men-scrub image sequence ke `<canvas>`:
taruh frame di `public/sequences/character/frame_0001.webp …` dan `manifest.json`:

```json
{ "frames": 120, "pattern": "/sequences/character/frame_%04d.webp", "width": 600, "height": 900 }
```

lalu set `character.sequenceManifest = "/sequences/character/manifest.json"`. Tanpa itu,
dipakai ilustrasi SVG `ChibiArt` (tetap tanpa animasi untuk pengguna `prefers-reduced-motion`).

## Menambah proyek

1. Taruh gambar di `public/projects/<slug>.webp` (rasio bebas, idealnya 16:10, ≥ 1200 px).
2. Tambahkan entri di `content/projects.ts` (`slug`, `name`, `jp`, `role`, `summary`,
   `description`, `stack`, `repo`, `live?`, `image`, `imageAlt`, `accent`).
3. Halaman `/projects/<slug>`, OG image, sitemap, dan JSON-LD `CreativeWork` dibuat otomatis.
4. Kalau `jp` memakai kanji baru, jalankan `npm run fonts` (lihat di bawah).

## Teks Jepang dan font

Font display (Dela Gothic One, Latin saja) dan Jepang (Zen Kaku Gothic New 700) adalah
subset kecil yang di-host sendiri lewat `next/font/local`. Ini menurunkan CSS dari ±280 KB
ke ±47 KB dan membuat FCP mobile < 1 detik. **Setelah menambah teks Jepang baru**, jalankan:

```bash
npm run fonts   # memindai app/, components/, content/, lib/ dan membuat ulang assets/fonts/*
```

Semua teks Jepang dekoratif diberi `aria-hidden` + `lang="ja"`, dan selalu ada terjemahan
yang terlihat atau teks `sr-only`.

## SEO, performa, aksesibilitas

- Semua halaman SSG; konten bisa dibaca tanpa JavaScript (loader punya failsafe CSS dan disembunyikan via `<noscript>`).
- Metadata per halaman, canonical, Open Graph, Twitter Card, OG image dinamis bergaya anime (`next/og`).
- JSON-LD: `Person` + `WebSite` (layout), `CreativeWork` + `BreadcrumbList` (detail proyek).
- `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, favicon/ikon lengkap (`npm run icons`).
- Satu `<h1>` per halaman, skip link, fokus terlihat, semua interaksi bisa dengan keyboard
  (panel proyek ikut bergeser saat difokus), GSAP `matchMedia` untuk reduced motion.
- Semua ScrollTrigger dibersihkan oleh `useGSAP`; geometry/material three.js di-dispose saat unmount; render di-pause saat tab tersembunyi.

Lighthouse (build produksi, Chromium headless di container tanpa GPU, jadi diukur dalam
mode Static):

|         | Performance | Accessibility | Best Practices | SEO |
| ------- | ----------- | ------------- | -------------- | --- |
| Mobile  | 94          | 100           | 100            | 100 |
| Desktop | 100         | 100           | 100            | 100 |

Belum diuji: mode High/Low di GPU sungguhan, Safari, Firefox, dan HP kelas menengah.
Jalankan Lighthouse sekali lagi di perangkat nyata setelah deploy.

## Hal yang perlu kamu lengkapi

- `content/experience.ts`: periode dan organisasi untuk stasiun yang belum punya `period`.
  Isinya hanya fakta yang sudah publik di portfolio lama.
- `content/profile.ts`: angka stat bar adalah placeholder penilaian diri, sesuaikan.
- Model VRM (opsional), lihat di atas.
- `NEXT_PUBLIC_SITE_URL` dan `NEXT_PUBLIC_FORMSPREE_ID` di Vercel.

Lisensi aset: lihat [`CREDITS.md`](./CREDITS.md).
