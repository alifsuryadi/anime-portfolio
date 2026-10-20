// Placeholder manga-style project cover: node scripts/make-cover.mjs <slug> "<Name>" "<role>" "<accent hex>"
// Replace the output with a real screenshot (public/projects/<slug>.webp) when you have one.
import sharp from "sharp";

const [slug, name, role, accent = "#FF6FA5"] = process.argv.slice(2);
const W = 1600;
const H = 1000;
const lines = Array.from({ length: 48 }, (_, i) => {
  const a = (i / 48) * Math.PI * 2;
  return `<line x1="${W / 2}" y1="${H / 2}" x2="${W / 2 + Math.cos(a) * 1400}" y2="${H / 2 + Math.sin(a) * 1400}" stroke="#0B0B14" stroke-width="${i % 3 ? 3 : 7}" opacity="0.18"/>`;
}).join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><pattern id="d" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="3" fill="#0B0B14" opacity="0.14"/></pattern></defs>
  <rect width="100%" height="100%" fill="#F5EFE6"/>
  ${lines}
  <rect width="100%" height="100%" fill="url(#d)"/>
  <circle cx="${W / 2}" cy="${H / 2}" r="300" fill="${accent}"/>
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="#0B0B14" stroke-width="16"/>
  <text x="${W / 2}" y="${H / 2 + 40}" text-anchor="middle" font-family="Arial Black, Helvetica, sans-serif" font-weight="900" font-size="${name.length > 8 ? 150 : 200}" fill="#0B0B14">${name}</text>
  <text x="${W / 2}" y="${H / 2 + 150}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="56" letter-spacing="6" fill="#0B0B14">${role.toUpperCase()}</text>
</svg>`;
await sharp(Buffer.from(svg)).webp({ quality: 84 }).toFile(`public/projects/${slug}.webp`);
console.log(`public/projects/${slug}.webp`);
