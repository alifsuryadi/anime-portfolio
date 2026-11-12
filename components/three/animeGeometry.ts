import {
  BufferGeometry,
  CylinderGeometry,
  LatheGeometry,
  SphereGeometry,
  SplineCurve,
  Vector2,
  Vector3,
} from "three";

/** Cranium radius. Chin sits at about -1.22 R, crown at +R. */
export const HEAD_R = 0.115;

/** Face decal patch: ±FACE_PHI around the front, from the brow line down to the chin. */
export const FACE_PHI = 0.95;
export const FACE_THETA: [start: number, length: number] = [0.95, 1.75];

/**
 * Unit sphere -> anime head. Below the eye line the sides pull in toward a
 * narrow jaw and the bottom pole slides forward to become a pointed chin.
 */
function shapeHead(p: Vector3) {
  let { x, y, z } = p;
  if (y < 0) {
    const t = -y;
    x *= 1 - 0.44 * Math.pow(t, 1.6);
    z = z > 0 ? z * (1 - 0.1 * t * t) : z * (1 - 0.5 * Math.pow(t, 1.3));
    z += 0.5 * t * t;
    y *= 1.22;
  }
  x *= 0.94;
  if (z > 0) z *= 0.97;
  return p.set(x * HEAD_R, y * HEAD_R, z * HEAD_R);
}

function deform(geo: BufferGeometry, fn: (p: Vector3) => void) {
  const pos = geo.attributes.position;
  const p = new Vector3();
  for (let i = 0; i < pos.count; i++) {
    p.fromBufferAttribute(pos, i);
    fn(p);
    pos.setXYZ(i, p.x, p.y, p.z);
  }
  geo.computeVertexNormals();
  return geo;
}

export const headGeo = () => deform(new SphereGeometry(1, 48, 36), (p) => void shapeHead(p));

/** Curved patch that hugs the face, so eyes and mouth wrap instead of floating as flat cards. */
export const faceGeo = (lift = 1.01) =>
  deform(
    new SphereGeometry(1, 28, 24, Math.PI / 2 - FACE_PHI, FACE_PHI * 2, ...FACE_THETA),
    (p) => void shapeHead(p).multiplyScalar(lift),
  );

/** Smooth surface of revolution from [radius, y] points (ascending y). */
export function lathe(points: [r: number, y: number][], segments = 20, depth = 1) {
  const curve = new SplineCurve(points.map(([r, y]) => new Vector2(r, y)));
  const pts = curve.getPoints(points.length * 5).map((p) => p.setX(Math.max(0, p.x)));
  const geo = new LatheGeometry(pts, segments);
  if (depth !== 1) {
    geo.scale(1, 1, depth);
    geo.computeVertexNormals();
  }
  return geo;
}

/**
 * One lock of hair: a flat spike hanging down from the origin, `width` across and
 * `thick` deep at its widest, ending in a point. `bend` sweeps the tip sideways, `curl` toward ±z.
 */
export function strand(width: number, length: number, thick: number, bend = 0, curl = 0) {
  const geo = new LatheGeometry(
    [
      [0, -1],
      [0.13, -0.84],
      [0.32, -0.58],
      [0.47, -0.32],
      [0.5, -0.14],
      [0.38, -0.02],
      [0, 0.05],
    ].map(([r, y]) => new Vector2(r, y)),
    7,
  );
  return deform(geo, (p) => {
    const t = Math.max(0, -p.y);
    p.set(p.x * width + bend * length * t * t, p.y * length, p.z * thick + curl * length * t * t);
  });
}

/** Knife-pleated skirt: every other hem vertex is tucked in, faces are flat shaded. */
export function pleatedSkirt(top: number, hem: number, height: number, pleats = 16) {
  const geo = new CylinderGeometry(top, hem, height, pleats * 2, 1, true);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    if (pos.getY(i) > 0) continue;
    const a = Math.atan2(pos.getZ(i), pos.getX(i));
    const k = Math.round(((a + Math.PI) / (Math.PI * 2)) * pleats * 2);
    if (k % 2) pos.setXYZ(i, pos.getX(i) * 0.9, pos.getY(i) + 0.006, pos.getZ(i) * 0.9);
  }
  const flat = geo.toNonIndexed();
  flat.computeVertexNormals();
  geo.dispose();
  return flat;
}
