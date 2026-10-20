// Self-host the Draco and Basis (KTX2) decoders that ship with three.js.
import { cp, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";

const pairs = [
  ["node_modules/three/examples/jsm/libs/draco/gltf", "public/draco"],
  ["node_modules/three/examples/jsm/libs/basis", "public/basis"],
];
for (const [from, to] of pairs) {
  if (!existsSync(from)) continue;
  await mkdir(to, { recursive: true });
  await cp(from, to, { recursive: true });
}
console.log("decoders copied");
