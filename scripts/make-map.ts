/**
 * Builds the Impact Map geometry: src/site/impact/map-data.json. Run with `npm run map` after changing
 * src/content/places.ts. The output is committed, so builds do not need to run this.
 *
 * Bangladesh: geoBoundaries gbOpen ADM3 (upazila) boundaries, CC BY 4.0, via the bd-geojson package.
 * Upazilas without a division in that file take the division most of their neighbours share, so the
 * division borders close properly. Region: Natural Earth via world-atlas (public domain).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { geoArea, geoConicEqualArea, geoMercator, geoPath, geoCentroid } from 'd3-geo';
import { feature, mesh, merge, neighbors } from 'topojson-client';
import { topology } from 'topojson-server';
import { presimplify, simplify, quantile } from 'topojson-simplify';
import { PLACES } from '../src/content/places';

// Read straight from node_modules: these packages do not export their data files.
const read = (p: string) => JSON.parse(readFileSync(`node_modules/${p}`, 'utf8'));
const round = (n: number) => Math.round(n * 10) / 10;
const trim = (d: string | null) => (d ?? '').replace(/(\d+\.\d)\d+/g, '$1');
// Whole pixels: enough for hairlines and background shapes.
const whole = (d: string | null) => (d ?? '').replace(/(-?\d+)\.(\d)\d*/g, (_, i: string, f: string) => String(Number(i) + (Number(f) >= 5 ? (i.startsWith('-') ? -1 : 1) : 0)));

/* --------------------------------- Bangladesh --------------------------------- */

const bdGeo = read('bd-geojson/src/data/bangladesh.geojson');
// The file follows the GeoJSON right-hand rule (exterior rings anticlockwise); d3-geo expects the opposite and
// would read each polygon as the whole globe minus the upazila. Reverse any ring set whose area exceeds a hemisphere.
for (const f of bdGeo.features) {
  const polys: number[][][][] = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  for (const poly of polys) {
    if (geoArea({ type: 'Polygon', coordinates: poly } as any) > 2 * Math.PI) poly.forEach((ring) => ring.reverse());
  }
}
let bdTopo: any = topology({ upazilas: bdGeo }, 1e5);
bdTopo = presimplify(bdTopo);
bdTopo = simplify(bdTopo, quantile(bdTopo, 0.12));
const geoms: any[] = bdTopo.objects.upazilas.geometries;

// Give every upazila a division: the majority division of its labelled neighbours, repeated until stable.
const nbrs = neighbors(geoms);
const division = geoms.map((g) => (g.properties.division_name as string) || '');
for (let pass = 0; pass < 10 && division.some((d) => !d); pass++) {
  division.forEach((d, i) => {
    if (d) return;
    const tally = new Map<string, number>();
    for (const j of nbrs[i]!) if (division[j]) tally.set(division[j]!, (tally.get(division[j]!) ?? 0) + 1);
    const best = [...tally.entries()].sort((a, b) => b[1] - a[1])[0];
    if (best) division[i] = best[0];
  });
}
const missing = division.filter((d) => !d).length;
if (missing) throw new Error(`${missing} upazilas still without a division`);

const BD_W = 520;
const BD_H = 640;
const bdOutline = merge(bdTopo, geoms);
const bdProj = geoMercator().fitExtent([[16, 16], [BD_W - 16, BD_H - 16]], bdOutline);
const bdPath = geoPath(bdProj);

const outline = trim(bdPath(bdOutline));
const upazilaMesh = whole(bdPath(mesh(bdTopo, bdTopo.objects.upazilas, (a: any, b: any) => a !== b)));
const idx = new Map(geoms.map((g, i) => [g, i]));
const divisionMesh = trim(
  bdPath(mesh(bdTopo, bdTopo.objects.upazilas, (a: any, b: any) => a !== b && division[idx.get(a)!] !== division[idx.get(b)!])),
);

const divBn: Record<string, string> = {};
for (const g of geoms) if (g.properties.division_name) divBn[g.properties.division_name] = g.properties.division_bn_name;
const divisions = [...new Set(division)].sort().map((name) => {
  const shape = merge(bdTopo, geoms.filter((_, i) => division[i] === name));
  const [x, y] = bdProj(geoCentroid(shape))!;
  return { name, bn: divBn[name] ?? name, x: round(x), y: round(y) };
});

const upazilaFeatures = (feature(bdTopo, bdTopo.objects.upazilas) as any).features as any[];
const sites: Record<string, [number, number]> = {};
for (const [key, place] of Object.entries(PLACES)) {
  if (place.kind !== 'site') continue;
  let lonLat: [number, number] | undefined;
  if (place.upazila) {
    const f = upazilaFeatures.find((u) => u.properties.name === place.upazila);
    if (!f) throw new Error(`upazila ${place.upazila} not found for ${key}`);
    lonLat = geoCentroid(f) as [number, number];
  } else if (place.lon !== undefined && place.lat !== undefined) lonLat = [place.lon, place.lat];
  if (!lonLat) throw new Error(`no position for ${key}`);
  const [x, y] = bdProj(lonLat)!;
  sites[key] = [round(x), round(y)];
}

/* ----------------------------------- Region ----------------------------------- */

const world = read('world-atlas/countries-50m.json');
const coarse = read('world-atlas/countries-110m.json');
const all = (feature(world, world.objects.countries) as any).features as any[];
const allCoarse = (feature(coarse, coarse.objects.countries) as any).features as any[];

const countryKeys = Object.entries(PLACES).filter(([, p]) => p.isoNumeric);
const scope = countryKeys.map(([key, p]) => ({ key, place: p, f: all.find((f) => f.id === p.isoNumeric) }));
for (const s of scope) if (!s.f) throw new Error(`country ${s.key} not in world-atlas`);

const RG_W = 800;
const RG_H = 560;
const rgProj = geoConicEqualArea()
  .parallels([10, 45])
  .rotate([-88, 0])
  .fitExtent([[24, 24], [RG_W - 24, RG_H - 24]], { type: 'FeatureCollection', features: scope.map((s) => s.f) } as any);
const rgPath = geoPath(rgProj);
const inScope = new Set(scope.map((s) => s.place.isoNumeric));
const context = allCoarse
  .filter((f) => {
    if (inScope.has(f.id)) return false;
    const b = rgPath.bounds(f);
    return b[1][0] > -40 && b[0][0] < RG_W + 40 && b[1][1] > -40 && b[0][1] < RG_H + 40;
  })
  .map((f) => whole(rgPath(f)))
  .filter(Boolean);
const countries = scope.map(({ key, place, f }) => {
  const [cx, cy] = rgProj(geoCentroid(f))!;
  return { key, name: place.label, d: whole(rgPath(f)), cx: round(cx), cy: round(cy) };
});

const out = {
  attribution: {
    bangladesh: 'Boundaries: geoBoundaries (gbOpen ADM3), CC BY 4.0; underlying data BBS / OCHA ROAP.',
    region: 'Countries: Natural Earth via world-atlas (public domain).',
  },
  bd: { width: BD_W, height: BD_H, outline, divisions: divisionMesh, upazilas: upazilaMesh, labels: divisions, sites },
  region: { width: RG_W, height: RG_H, context, countries },
};

mkdirSync('src/site/impact', { recursive: true });
writeFileSync('src/site/impact/map-data.json', JSON.stringify(out));
console.log(
  `map written: outline ${outline.length}, divisions ${divisionMesh.length}, upazilas ${upazilaMesh.length}, region ${countries.length} countries + ${context.length} context; sites`,
  sites,
);
