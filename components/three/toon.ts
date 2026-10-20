import { DataTexture, NearestFilter, RedFormat } from "three";

let gradient: DataTexture | null = null;

/** 3-step ramp for MeshToonMaterial: the classic anime cel-shade look. */
export function toonGradient() {
  if (gradient) return gradient;
  const data = new Uint8Array([90, 170, 255]);
  gradient = new DataTexture(data, data.length, 1, RedFormat);
  gradient.minFilter = NearestFilter;
  gradient.magFilter = NearestFilter;
  gradient.needsUpdate = true;
  return gradient;
}

export const palette = {
  ink: "#0B0B14",
  night: "#1A1033",
  sakura: "#FF6FA5",
  cyan: "#3BF4FB",
  sunset: "#FF8A3D",
  paper: "#F5EFE6",
  hair: "#2B1A4F",
  hairHi: "#4A2F7D",
  skin: "#FFE3D3",
  hoodie: "#E9E3F7",
  hoodieShade: "#C9C0E3",
  vermilion: "#E8402A",
};
