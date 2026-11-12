import { CanvasTexture, SRGBColorSpace } from "three";

/**
 * The face is drawn like a cel: ink lines on 2D canvases, wrapped onto a curved
 * patch over the head (see `faceGeo`). Each canvas covers the whole face, so the
 * numbers below are canvas pixels, with the nose bridge at x = 256.
 * Everything here is an original design.
 */

const SIZE = 512;
const INK = "#2a1630";
const BROW = "#6a56a8";
const EYE_X = 116;
const EYE_Y = 240;
const EYE_SCALE = 1.22;

type Ctx = CanvasRenderingContext2D;

function make(draw: (c: Ctx) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const c = canvas.getContext("2d")!;
  c.lineCap = "round";
  c.lineJoin = "round";
  draw(c);
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** Draws `fn` for both eyes; x grows toward the outer corner on each side. */
function both(c: Ctx, fn: (c: Ctx) => void) {
  for (const dir of [-1, 1]) {
    c.save();
    c.translate(256 + dir * EYE_X, EYE_Y);
    c.scale(dir * EYE_SCALE, EYE_SCALE);
    fn(c);
    c.restore();
  }
}

function brow(c: Ctx, lift: number, tilt = 0) {
  c.strokeStyle = BROW;
  c.lineWidth = 5;
  c.beginPath();
  c.moveTo(-40, -58 - lift + tilt);
  c.quadraticCurveTo(4, -72 - lift, 48, -60 - lift - tilt);
  c.stroke();
}

/**
 * Open eye. `open` lowers the upper lid (1 = wide open), `iris` shrinks the
 * iris for a startled look.
 */
function openEye(c: Ctx, open: number, iris = 1) {
  const top = -36 * open;
  const bot = 20;
  const lid = () => {
    c.beginPath();
    c.moveTo(-44, 8);
    c.bezierCurveTo(-30, top - 4, 22, top - 8, 47, -8);
    c.bezierCurveTo(42, bot * 0.5, 24, bot, -2, bot);
    c.bezierCurveTo(-24, bot, -38, 17, -44, 8);
    c.closePath();
  };

  lid();
  c.fillStyle = "#fffafb";
  c.fill();

  c.save();
  lid();
  c.clip();
  // Shadow the lid casts on the eyeball.
  c.fillStyle = "rgba(146, 118, 176, 0.4)";
  c.fillRect(-50, top - 12, 100, 20);
  // Iris: plum at the top, rose in the middle, a pale crescent at the bottom.
  const g = c.createLinearGradient(0, -34, 0, 26);
  g.addColorStop(0, "#4a123c");
  g.addColorStop(0.5, "#c93f7c");
  g.addColorStop(1, "#ff9cc2");
  c.fillStyle = g;
  c.beginPath();
  c.ellipse(2, -5, 24 * iris, 31 * iris, 0, 0, Math.PI * 2);
  c.fill();
  c.strokeStyle = "#3a0f33";
  c.lineWidth = 4;
  c.stroke();
  c.fillStyle = "#2a0a26";
  c.beginPath();
  c.ellipse(2, -6, 9 * iris, 14 * iris, 0, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "rgba(255, 214, 232, 0.6)";
  c.beginPath();
  c.ellipse(2, 13 * iris, 13 * iris, 7 * iris, 0, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "#ffffff";
  c.beginPath();
  c.ellipse(-9, -17, 7, 9, -0.4, 0, Math.PI * 2);
  c.fill();
  c.beginPath();
  c.arc(12, 6, 3.5, 0, Math.PI * 2);
  c.fill();
  c.restore();

  // Upper lash: one tapered ink shape, heaviest at the outer corner.
  c.fillStyle = INK;
  c.beginPath();
  c.moveTo(-47, 11);
  c.bezierCurveTo(-31, top - 5, 22, top - 9, 47, -9);
  c.lineTo(62, -19);
  c.lineTo(54, -3);
  c.lineTo(60, 4);
  c.lineTo(46, 1);
  c.bezierCurveTo(26, top + 5, -24, top + 6, -41, 12);
  c.closePath();
  c.fill();
  // Lid crease and lower lash.
  c.strokeStyle = "rgba(42, 22, 48, 0.55)";
  c.lineWidth = 2.5;
  c.beginPath();
  c.moveTo(-28, top - 17);
  c.quadraticCurveTo(8, top - 27, 40, top - 16);
  c.stroke();
  c.strokeStyle = INK;
  c.lineWidth = 3;
  c.beginPath();
  c.moveTo(10, bot + 1);
  c.quadraticCurveTo(32, bot, 43, 5);
  c.stroke();
}

const eyes = (open: number, iris: number, browLift: number) => () =>
  make((c) =>
    both(c, (c) => {
      openEye(c, open, iris);
      brow(c, browLift);
    }),
  );

export const eyesOpen = eyes(1, 1, 0);
export const eyesHalf = eyes(0.62, 1, -3);
export const eyesWide = eyes(1.14, 0.82, 12);

/** Blink: a downward arc with the lashes swept out. */
export function eyesClosed() {
  return make((c) =>
    both(c, (c) => {
      c.strokeStyle = INK;
      c.lineWidth = 7;
      c.beginPath();
      c.moveTo(-44, 4);
      c.quadraticCurveTo(2, 24, 48, 0);
      c.stroke();
      c.lineWidth = 4;
      c.beginPath();
      c.moveTo(44, 3);
      c.lineTo(60, -6);
      c.moveTo(34, 10);
      c.lineTo(46, 18);
      c.stroke();
      brow(c, -4);
    }),
  );
}

/** Smiling eyes: upward arcs. */
export function eyesHappy() {
  return make((c) =>
    both(c, (c) => {
      c.strokeStyle = INK;
      c.lineWidth = 8;
      c.beginPath();
      c.moveTo(-43, 12);
      c.quadraticCurveTo(2, -30, 48, 10);
      c.stroke();
      brow(c, 4);
    }),
  );
}

/** The nose is a single shadow tick, the way it is inked in anime. */
function nose(c: Ctx) {
  c.strokeStyle = "#d58b8e";
  c.lineWidth = 3.5;
  c.beginPath();
  c.moveTo(259, 306);
  c.lineTo(254, 316);
  c.stroke();
}

const MOUTH_Y = 378;

export function mouthSmile() {
  return make((c) => {
    nose(c);
    c.strokeStyle = INK;
    c.lineWidth = 3.5;
    c.beginPath();
    c.moveTo(238, MOUTH_Y - 3);
    c.quadraticCurveTo(256, MOUTH_Y + 9, 274, MOUTH_Y - 3);
    c.stroke();
    c.strokeStyle = "rgba(213, 139, 142, 0.9)";
    c.lineWidth = 2.5;
    c.beginPath();
    c.moveTo(250, MOUTH_Y + 15);
    c.lineTo(262, MOUTH_Y + 15);
    c.stroke();
  });
}

export function mouthOpen() {
  return make((c) => {
    nose(c);
    const shape = () => {
      c.beginPath();
      c.moveTo(232, MOUTH_Y - 8);
      c.quadraticCurveTo(256, MOUTH_Y - 2, 280, MOUTH_Y - 8);
      c.quadraticCurveTo(276, MOUTH_Y + 24, 256, MOUTH_Y + 24);
      c.quadraticCurveTo(236, MOUTH_Y + 24, 232, MOUTH_Y - 8);
      c.closePath();
    };
    shape();
    c.fillStyle = "#8a2742";
    c.fill();
    c.save();
    shape();
    c.clip();
    c.fillStyle = "#ffffff";
    c.fillRect(230, MOUTH_Y - 10, 52, 10);
    c.fillStyle = "#ff8fae";
    c.beginPath();
    c.ellipse(256, MOUTH_Y + 22, 15, 9, 0, 0, Math.PI * 2);
    c.fill();
    c.restore();
    shape();
    c.strokeStyle = INK;
    c.lineWidth = 3.5;
    c.stroke();
  });
}

export function mouthO() {
  return make((c) => {
    nose(c);
    c.fillStyle = "#8a2742";
    c.strokeStyle = INK;
    c.lineWidth = 3.5;
    c.beginPath();
    c.ellipse(256, MOUTH_Y + 4, 8, 11, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
  });
}

/** Cheek blush with hatch lines; its opacity follows the expression. */
export function blush() {
  return make((c) => {
    for (const dir of [-1, 1]) {
      const x = 256 + dir * 128;
      const y = 304;
      c.save();
      c.translate(x, y);
      c.scale(1, 0.5);
      const g = c.createRadialGradient(0, 0, 4, 0, 0, 46);
      g.addColorStop(0, "rgba(255, 120, 150, 0.8)");
      g.addColorStop(1, "rgba(255, 120, 150, 0)");
      c.fillStyle = g;
      c.beginPath();
      c.arc(0, 0, 46, 0, Math.PI * 2);
      c.fill();
      c.restore();
      c.strokeStyle = "rgba(226, 84, 120, 0.75)";
      c.lineWidth = 3;
      for (const o of [-14, 0, 14]) {
        c.beginPath();
        c.moveTo(x + o + 5, y - 9);
        c.lineTo(x + o - 5, y + 9);
        c.stroke();
      }
    }
  });
}
