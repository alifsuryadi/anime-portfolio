import { CanvasTexture, LinearFilter, SRGBColorSpace } from "three";

/**
 * Anime face parts drawn once on 2D canvases and used as textures on small
 * planes over the face. Everything here is an original design.
 */

const LASH = "#24123f";

function make(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const c = canvas.getContext("2d")!;
  draw(c);
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.minFilter = LinearFilter;
  tex.anisotropy = 4;
  return tex;
}

function sparkle(c: CanvasRenderingContext2D, x: number, y: number, r: number) {
  c.beginPath();
  c.moveTo(x, y - r);
  c.quadraticCurveTo(x, y, x + r, y);
  c.quadraticCurveTo(x, y, x, y + r);
  c.quadraticCurveTo(x, y, x - r, y);
  c.quadraticCurveTo(x, y, x, y - r);
  c.fill();
}

/** Big sparkly eye (drawn as the character's right eye; mirror UVs for the left). */
export function eyeOpen() {
  return make(256, 320, (c) => {
    const cx = 128;
    const cy = 182;
    // white
    c.fillStyle = "#ffffff";
    c.beginPath();
    c.ellipse(cx, cy, 98, 120, 0, 0, Math.PI * 2);
    c.fill();
    // iris: violet -> magenta -> soft pink glow at the bottom
    const g = c.createLinearGradient(0, cy - 112, 0, cy + 112);
    g.addColorStop(0, "#2a1660");
    g.addColorStop(0.45, "#6b3fd6");
    g.addColorStop(0.8, "#ff6fa5");
    g.addColorStop(1, "#ffd1e6");
    c.fillStyle = g;
    c.beginPath();
    c.ellipse(cx, cy + 6, 84, 110, 0, 0, Math.PI * 2);
    c.fill();
    // iris rim
    c.strokeStyle = "#1a0b3a";
    c.lineWidth = 7;
    c.stroke();
    // pupil
    c.fillStyle = "#14082e";
    c.beginPath();
    c.ellipse(cx, cy - 4, 36, 52, 0, 0, Math.PI * 2);
    c.fill();
    // lower glow arc
    c.strokeStyle = "rgba(255,240,250,0.85)";
    c.lineWidth = 6;
    c.beginPath();
    c.ellipse(cx, cy + 10, 62, 82, 0, Math.PI * 0.2, Math.PI * 0.8);
    c.stroke();
    // highlights
    c.fillStyle = "#ffffff";
    c.beginPath();
    c.ellipse(cx + 36, cy - 52, 30, 38, -0.4, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.ellipse(cx - 40, cy + 54, 13, 13, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#bff9ff";
    sparkle(c, cx - 30, cy - 30, 18);
    // upper lash with a flick at the outer corner
    c.fillStyle = LASH;
    c.beginPath();
    c.moveTo(14, 104);
    c.quadraticCurveTo(cx, 22, 238, 84);
    c.lineTo(254, 58);
    c.lineTo(244, 108);
    c.quadraticCurveTo(cx, 52, 26, 124);
    c.closePath();
    c.fill();
    // lower lash hint
    c.lineWidth = 6;
    c.strokeStyle = LASH;
    c.beginPath();
    c.moveTo(190, 280);
    c.quadraticCurveTo(212, 262, 222, 236);
    c.stroke();
  });
}

/** ^ ^ happy eye. */
export function eyeHappy() {
  return make(256, 320, (c) => {
    c.strokeStyle = LASH;
    c.lineWidth = 26;
    c.lineCap = "round";
    c.beginPath();
    c.moveTo(40, 200);
    c.quadraticCurveTo(128, 70, 216, 200);
    c.stroke();
  });
}

/** Closed, relaxed eye (blink). */
export function eyeClosed() {
  return make(256, 320, (c) => {
    c.strokeStyle = LASH;
    c.lineWidth = 22;
    c.lineCap = "round";
    c.beginPath();
    c.moveTo(36, 170);
    c.quadraticCurveTo(128, 250, 220, 170);
    c.stroke();
    c.lineWidth = 10;
    c.beginPath();
    c.moveTo(212, 176);
    c.lineTo(240, 150);
    c.stroke();
  });
}

/** Small "ω" cat mouth. */
export function mouthCat() {
  return make(128, 64, (c) => {
    c.strokeStyle = "#5a1d3a";
    c.lineWidth = 9;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.beginPath();
    c.moveTo(18, 20);
    c.quadraticCurveTo(40, 54, 64, 24);
    c.quadraticCurveTo(88, 54, 110, 20);
    c.stroke();
  });
}

/** Open happy mouth (D shape with tongue). */
export function mouthOpen() {
  return make(128, 96, (c) => {
    c.fillStyle = "#7a1838";
    c.beginPath();
    c.moveTo(20, 18);
    c.quadraticCurveTo(64, 30, 108, 18);
    c.quadraticCurveTo(100, 88, 64, 88);
    c.quadraticCurveTo(28, 88, 20, 18);
    c.fill();
    c.fillStyle = "#ff8fb3";
    c.beginPath();
    c.ellipse(64, 74, 26, 14, 0, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = "#5a1d3a";
    c.lineWidth = 6;
    c.lineJoin = "round";
    c.beginPath();
    c.moveTo(20, 18);
    c.quadraticCurveTo(64, 30, 108, 18);
    c.quadraticCurveTo(100, 88, 64, 88);
    c.quadraticCurveTo(28, 88, 20, 18);
    c.stroke();
  });
}

/** Little "o" of surprise. */
export function mouthO() {
  return make(96, 96, (c) => {
    c.fillStyle = "#7a1838";
    c.strokeStyle = "#5a1d3a";
    c.lineWidth = 6;
    c.beginPath();
    c.ellipse(48, 48, 22, 28, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
  });
}

/** Soft blush with anime hatch lines. */
export function blush() {
  return make(128, 64, (c) => {
    const g = c.createRadialGradient(64, 32, 4, 64, 32, 60);
    g.addColorStop(0, "rgba(255,111,165,0.75)");
    g.addColorStop(1, "rgba(255,111,165,0)");
    c.fillStyle = g;
    c.beginPath();
    c.ellipse(64, 32, 60, 28, 0, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = "rgba(214,60,120,0.8)";
    c.lineWidth = 5;
    c.lineCap = "round";
    for (const x of [40, 60, 80]) {
      c.beginPath();
      c.moveTo(x + 8, 18);
      c.lineTo(x - 4, 44);
      c.stroke();
    }
  });
}
