/**
 * Generates public/contours.svg: a static contour map of the same terrain the WebGL scene draws.
 * It is the first paint for everyone, and the permanent background in the simple (no-3D) view.
 */
import { contours } from 'd3-contour';
import { writeFileSync } from 'node:fs';
import { roughHeight } from '../src/lib/terrain.ts';

const W = 200;
const H = 112;
const X_SPAN = 60; // world units across the grid
const Z_SPAN = (X_SPAN * H) / W;
const STEP = 1 / 3.2; // matches the shader's contour frequency

const values = new Float64Array(W * H);
for (let j = 0; j < H; j++) {
  for (let i = 0; i < W; i++) {
    const x = (i / (W - 1) - 0.5) * X_SPAN;
    const z = (j / (H - 1) - 0.5) * Z_SPAN;
    values[j * W + i] = roughHeight(x, z);
  }
}

const levels: number[] = [];
for (let k = 1; k < 18; k++) levels.push(k * STEP);

const gen = contours().size([W, H]).thresholds(levels);
const result = gen(Array.from(values));

const r = (n: number) => Math.round(n * 10) / 10;
function pathOf(coords: number[][][][]): string {
  let d = '';
  for (const poly of coords) {
    for (const ring of poly) {
      ring.forEach((pt, idx) => {
        d += `${idx === 0 ? 'M' : 'L'}${r(pt[0]!)} ${r(pt[1]!)}`;
      });
      d += 'Z';
    }
  }
  return d;
}

let minor = '';
let major = '';
result.forEach((c, i) => {
  const d = pathOf(c.coordinates as number[][][][]);
  if ((i + 1) % 5 === 0) major += d;
  else minor += d;
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="8 6 ${W - 16} ${H - 12}" preserveAspectRatio="xMidYMid slice" fill="none" stroke-linejoin="round">
<path d="${minor}" stroke="#35D6CF" stroke-opacity="0.34" stroke-width="0.8" vector-effect="non-scaling-stroke"/>
<path d="${major}" stroke="#35D6CF" stroke-opacity="0.85" stroke-width="1.5" vector-effect="non-scaling-stroke"/>
</svg>
`;
writeFileSync(new URL('../public/contours.svg', import.meta.url), svg);
console.log(`contours.svg ${(svg.length / 1024).toFixed(1)} KB, ${levels.length} levels`);
