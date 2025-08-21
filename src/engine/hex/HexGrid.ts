import type { Hex } from "../types";

export function axialToPixel(h: Hex, HEX_SIZE: number) {
  const x = HEX_SIZE * (Math.sqrt(3) * (h.q + h.r / 2));
  const y = HEX_SIZE * (1.5 * h.r);
  return { x, y };
}

export function pixelToAxial(x: number, y: number, HEX_SIZE: number): Hex {
  const qf = (Math.sqrt(3) / 3 * x - 1 / 3 * y) / HEX_SIZE;
  const rf = (2 / 3 * y) / HEX_SIZE;

  let x_c = qf;
  let z_c = rf;
  let y_c = -x_c - z_c;

  let rx = Math.round(x_c);
  let ry = Math.round(y_c);
  let rz = Math.round(z_c);

  const x_diff = Math.abs(rx - x_c);
  const y_diff = Math.abs(ry - y_c);
  const z_diff = Math.abs(rz - z_c);

  if (x_diff > y_diff && x_diff > z_diff) {
    rx = -ry - rz;
  } else if (y_diff > z_diff) {
    ry = -rx - rz;
  } else {
    rz = -rx - ry;
  }
  return { q: rx, r: rz };
}

export function hexDist(a: Hex, b: Hex) {
  return Math.max(
    Math.abs(a.q - b.q),
    Math.abs(a.r - b.r),
    Math.abs(a.q + a.r - b.q - b.r)
  );
}

export function inBounds(h: Hex, w: number, hgt: number) {
  return h.q >= 0 && h.q < w && h.r >= 0 && h.r < hgt;
}
