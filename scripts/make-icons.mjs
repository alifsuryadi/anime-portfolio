// Rasterises app/icon.svg into the PNG/ICO sizes browsers and Google expect.
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";

const svg = await readFile("app/icon.svg");
const png = (size) => sharp(svg, { density: 512 }).resize(size, size).png().toBuffer();

await writeFile("public/icon-192.png", await png(192));
await writeFile("public/icon-512.png", await png(512));
await writeFile("app/apple-icon.png", await png(180));

// favicon.ico with an embedded 48px PNG (Google requires >= 48px, square).
const ico48 = await png(48);
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header.writeUInt8(48, 6);
header.writeUInt8(48, 7);
header.writeUInt8(0, 8);
header.writeUInt8(0, 9);
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(ico48.length, 14);
header.writeUInt32LE(22, 18);
await writeFile("app/favicon.ico", Buffer.concat([header, ico48]));
console.log("icons written");
