// Builds tiny self-hosted font subsets so the Japanese fonts don't ship
// hundreds of @font-face blocks. Re-run after adding new Japanese text:
//   npm run fonts
// It scans app/, components/, content/ and lib/ for every non-ASCII glyph.
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join, extname } from "node:path";

const ROOTS = ["app", "components", "content", "lib"];
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if ([".ts", ".tsx"].includes(extname(p))) out.push(p);
  }
  return out;
}

const files = (await Promise.all(ROOTS.map(walk))).flat();
const glyphs = new Set();
for (const f of files)
  for (const ch of await readFile(f, "utf8")) if (ch.codePointAt(0) > 0x2fff) glyphs.add(ch);
const ascii = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join("");
const jp = [...glyphs].sort().join("") + "・…ー「」！？";

async function fetchFont(family, weight, text, out) {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}&display=swap`;
  const css = await (await fetch(url, { headers: { "User-Agent": UA } })).text();
  const src = css.match(/url\((https:[^)]+)\)/)?.[1];
  if (!src) throw new Error(`No font url for ${family}: ${css.slice(0, 200)}`);
  const buf = Buffer.from(
    await (await fetch(src, { headers: { "User-Agent": UA } })).arrayBuffer(),
  );
  await writeFile(out, buf);
  console.log(`${out}: ${(buf.length / 1024).toFixed(1)} KB`);
}

await mkdir("assets/fonts", { recursive: true });
await fetchFont(
  "Dela Gothic One",
  400,
  ascii + "·→←↑↓–—’",
  "assets/fonts/dela-gothic-one-latin.woff2",
);
await fetchFont(
  "Zen Kaku Gothic New",
  700,
  ascii + jp,
  "assets/fonts/zen-kaku-gothic-new-700-subset.woff2",
);
console.log(`${glyphs.size} Japanese glyphs`);
