/**
 * Generates the favicon set from the logo mark: public/favicon.svg, favicon-32.png, apple-touch-icon.png,
 * icon-192.png, icon-512.png. The social image (og-image.png) is rendered from scripts/og-template.html;
 * see README.md for the one-line command.
 */
import { writeFileSync } from 'node:fs';
import sharp from 'sharp';

const mark = (size, pad, radius) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="${radius}" fill="#0A1628"/>
  <g transform="translate(${pad} ${pad}) scale(${(32 - pad * 2) / 32})" fill="none" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round">
    <path d="M3 10 L16 3 L29 10 L16 17 Z" stroke="#35D6CF" fill="#35D6CF" fill-opacity="0.16"/>
    <path d="M3 16 L16 23 L29 16" stroke="#F2EFE5"/>
    <path d="M3 22 L16 29 L29 22" stroke="#E3A94B"/>
  </g>
</svg>`;

writeFileSync('public/favicon.svg', mark(32, 0, 6));

const png = async (file, size, pad, radius) => {
  await sharp(Buffer.from(mark(size, pad, radius)), { density: 384 }).resize(size, size).png().toFile(file);
};

await png('public/favicon-32.png', 32, 0, 6);
// Apple and manifest icons are full-bleed squares: the OS applies its own mask.
await png('public/apple-touch-icon.png', 180, 3, 0);
await png('public/icon-192.png', 192, 3, 0);
await png('public/icon-512.png', 512, 3, 0);
console.log('icons written');
