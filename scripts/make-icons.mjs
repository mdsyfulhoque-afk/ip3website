/**
 * Generates the favicon set from IP3's logo: the large "P" is cut from public/brand/ip3-logo-reversed.png
 * (ivory on transparent) and set on the midnight brand square. Writes public/favicon.svg, favicon-32.png,
 * apple-touch-icon.png, icon-192.png and icon-512.png. The social image (og-image.png) is rendered from
 * scripts/og-template.html; see README.md for the one-line command.
 *
 * public/brand/ip3-logo.png and ip3-logo-reversed.png were made from the supplied logo by turning its white
 * background transparent (colour-to-alpha), keeping the green "CONSULTING" band and its white letters intact.
 */
import { writeFileSync } from 'node:fs';
import sharp from 'sharp';

// The "P" (with its swirl) occupies columns 0–97 of the cropped logo; column 97–101 is clear.
const P_WIDTH = 97;
const { height } = await sharp('public/brand/ip3-logo-reversed.png').metadata();
const cut = await sharp('public/brand/ip3-logo-reversed.png').extract({ left: 0, top: 0, width: P_WIDTH, height }).png().toBuffer();
const glyph = await sharp(cut).trim().png().toBuffer();

const icon = async (size, pad, radius) => {
  const inner = Math.round(size * (1 - pad * 2));
  const p = await sharp(glyph).resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="#0A1628"/></svg>`);
  return sharp(bg).composite([{ input: p, gravity: 'center' }]).png().toBuffer();
};

const write = async (file, size, pad, radius) => writeFileSync(file, await icon(size, pad, radius));

await write('public/favicon-32.png', 32, 0.06, 6);
// Apple and manifest icons are full-bleed squares: the OS applies its own mask.
await write('public/apple-touch-icon.png', 180, 0.14, 0);
await write('public/icon-192.png', 192, 0.14, 0);
await write('public/icon-512.png', 512, 0.14, 0);

const svgPng = await icon(64, 0.06, 12);
writeFileSync(
  'public/favicon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 64 64"><image width="64" height="64" href="data:image/png;base64,${svgPng.toString('base64')}"/></svg>\n`,
);
console.log('icons written');
