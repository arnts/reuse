#!/usr/bin/env node
// Genererer elegante SVG-plassholdere i merkevarens palett.
// Kjør: node scripts/generate-placeholders.mjs

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', 'public', 'images');

const PALETTE = {
  cream: '#F5EFE6',
  creamWarm: '#EDE3D3',
  clay: '#B85C3F',
  clayDark: '#9A4A30',
  ochre: '#C9A55C',
  ochreDark: '#A88841',
  moss: '#2C4A3E',
  ink: '#2C2825',
  paper: '#FFFFFF',
};

// Mulberry32 deterministic PRNG — gjenskapbar utseende
function rng(seed) {
  return function () {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashStringToSeed(str) {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash = (hash ^ str.charCodeAt(i)) * 16777619;
  }
  return Math.abs(hash);
}

const palettes = [
  [PALETTE.cream, PALETTE.clay, PALETTE.ochre, PALETTE.moss],
  [PALETTE.creamWarm, PALETTE.ochre, PALETTE.clay, PALETTE.moss],
  [PALETTE.cream, PALETTE.moss, PALETTE.ochre, PALETTE.clayDark],
  [PALETTE.creamWarm, PALETTE.clay, PALETTE.moss, PALETTE.ochreDark],
  [PALETTE.cream, PALETTE.ochre, PALETTE.moss, PALETTE.clay],
];

function pick(rand, arr) {
  return arr[Math.floor(rand() * arr.length)];
}

function generateAbstract(name, w, h) {
  const seed = hashStringToSeed(name);
  const rand = rng(seed);
  const palette = palettes[seed % palettes.length];
  const [bg, c1, c2, c3] = palette;

  const shapes = [];
  const variant = seed % 5;

  if (variant === 0) {
    // Sirkler i komposisjon
    const cx1 = rand() * w * 0.8;
    const cy1 = rand() * h * 0.8;
    const r1 = Math.min(w, h) * (0.3 + rand() * 0.25);
    shapes.push(`<circle cx="${cx1}" cy="${cy1}" r="${r1}" fill="${c1}" opacity="0.85"/>`);
    const r2 = Math.min(w, h) * (0.18 + rand() * 0.18);
    shapes.push(
      `<circle cx="${rand() * w}" cy="${rand() * h}" r="${r2}" fill="${c2}" opacity="0.7"/>`
    );
    const r3 = Math.min(w, h) * 0.1;
    shapes.push(
      `<circle cx="${rand() * w}" cy="${rand() * h}" r="${r3}" fill="${c3}" opacity="0.8"/>`
    );
  } else if (variant === 1) {
    // Organisk bue + sirkel
    const cx = w * (0.3 + rand() * 0.4);
    const cy = h * (0.3 + rand() * 0.4);
    shapes.push(
      `<circle cx="${cx}" cy="${cy}" r="${Math.min(w, h) * 0.42}" fill="${c1}" opacity="0.9"/>`
    );
    shapes.push(
      `<path d="M0,${h * 0.7} Q${w / 2},${h * (0.4 + rand() * 0.3)} ${w},${h * 0.6} L${w},${h} L0,${h} Z" fill="${c2}" opacity="0.65"/>`
    );
    shapes.push(
      `<circle cx="${w * 0.85}" cy="${h * 0.18}" r="${Math.min(w, h) * 0.08}" fill="${c3}"/>`
    );
  } else if (variant === 2) {
    // Geometriske flater — terrakotta/oker
    shapes.push(
      `<rect x="0" y="${h * 0.55}" width="${w}" height="${h * 0.45}" fill="${c1}" opacity="0.85"/>`
    );
    shapes.push(
      `<circle cx="${w * (0.4 + rand() * 0.2)}" cy="${h * 0.45}" r="${Math.min(w, h) * (0.22 + rand() * 0.1)}" fill="${c2}"/>`
    );
    shapes.push(
      `<rect x="${w * 0.1}" y="${h * 0.15}" width="${w * 0.18}" height="${w * 0.18}" fill="${c3}" opacity="0.75" transform="rotate(${rand() * 30 - 15} ${w * 0.19} ${h * 0.24})"/>`
    );
  } else if (variant === 3) {
    // Bølgete linjer over flate
    shapes.push(
      `<rect x="0" y="${h * 0.4}" width="${w}" height="${h * 0.6}" fill="${c1}" opacity="0.9"/>`
    );
    for (let i = 0; i < 4; i++) {
      const y = h * (0.45 + i * 0.13);
      shapes.push(
        `<path d="M0,${y} Q${w / 4},${y - 14} ${w / 2},${y} T${w},${y}" fill="none" stroke="${c2}" stroke-width="2" opacity="${0.55 - i * 0.1}"/>`
      );
    }
    shapes.push(
      `<circle cx="${w * 0.78}" cy="${h * 0.25}" r="${Math.min(w, h) * 0.13}" fill="${c3}" opacity="0.9"/>`
    );
  } else {
    // Trekanter og blader
    const c = pick(rand, [c1, c2]);
    shapes.push(
      `<path d="M${w * 0.5},${h * 0.15} Q${w * 0.85},${h * 0.5} ${w * 0.5},${h * 0.85} Q${w * 0.15},${h * 0.5} ${w * 0.5},${h * 0.15} Z" fill="${c}" opacity="0.85"/>`
    );
    shapes.push(
      `<circle cx="${w * 0.2}" cy="${h * 0.25}" r="${Math.min(w, h) * 0.09}" fill="${c3}"/>`
    );
    shapes.push(
      `<circle cx="${w * 0.85}" cy="${h * 0.78}" r="${Math.min(w, h) * 0.12}" fill="${c2}" opacity="0.8"/>`
    );
  }

  // Kornete tekstur (subtil)
  const grain = `
    <filter id="grain-${seed}">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${seed % 100}"/>
      <feColorMatrix values="0 0 0 0 0.17 0 0 0 0 0.16 0 0 0 0 0.15 0 0 0 0.06 0"/>
      <feComposite in2="SourceGraphic" operator="in"/>
    </filter>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" role="img">
  <defs>${grain}</defs>
  <rect width="${w}" height="${h}" fill="${bg}"/>
  ${shapes.join('\n  ')}
  <rect width="${w}" height="${h}" fill="black" filter="url(#grain-${seed})" opacity="0.4"/>
</svg>`;
}

function generatePortrait(name) {
  const seed = hashStringToSeed(name);
  const rand = rng(seed);
  const palette = palettes[seed % palettes.length];
  const [bg, , , accent] = palette;
  const skin = '#D9A98A';
  const hair = pick(rand, ['#3A2A1F', '#5A3F2A', '#8B6E4F', '#2C2825']);
  const shirt = pick(rand, [PALETTE.clay, PALETTE.moss, PALETTE.ochre]);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img">
  <rect width="400" height="400" fill="${bg}"/>
  <circle cx="200" cy="200" r="140" fill="${accent}" opacity="0.18"/>
  <ellipse cx="200" cy="380" rx="180" ry="80" fill="${shirt}"/>
  <ellipse cx="200" cy="170" rx="70" ry="80" fill="${skin}"/>
  <ellipse cx="200" cy="120" rx="80" ry="55" fill="${hair}"/>
  <ellipse cx="200" cy="170" rx="68" ry="35" fill="${hair}" opacity="0.4"/>
  <circle cx="178" cy="175" r="3.5" fill="${PALETTE.ink}"/>
  <circle cx="222" cy="175" r="3.5" fill="${PALETTE.ink}"/>
  <path d="M188,200 Q200,205 212,200" stroke="${PALETTE.ink}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <rect width="400" height="400" fill="black" opacity="0.04"/>
</svg>`;
}

function ensureDir(p) {
  mkdirSync(p, { recursive: true });
}

function write(rel, content) {
  const path = join(ROOT, rel);
  ensureDir(dirname(path));
  writeFileSync(path, content);
  console.log('  ✓', rel);
}

console.log('Genererer plassholderbilder…\n');

// Hero
write('hero/hero-main.svg', generateAbstract('hero-main', 800, 1000));

// Audiences
write('audiences/pedagoger.svg', generateAbstract('audiences-pedagoger', 600, 450));
write('audiences/familier.svg', generateAbstract('audiences-familier', 600, 450));
write('audiences/bedrifter.svg', generateAbstract('audiences-bedrifter', 600, 450));
write('audiences/fellesskap.svg', generateAbstract('audiences-fellesskap', 600, 450));

// Services
const services = [
  'kurs',
  'veiledning',
  'studiebesok',
  'foredrag',
  'bursdag',
  'workshop',
  'lek',
  'teambuilding',
  'baerekraft',
  'apne',
  'kveldskurs',
];
services.forEach((s) => write(`services/${s}.svg`, generateAbstract(`service-${s}`, 800, 500)));

// Team
write('team/caroline.svg', generatePortrait('caroline'));
write('team/ann-helen.svg', generatePortrait('ann-helen-2'));

// Gallery (16 images)
for (let i = 1; i <= 16; i++) {
  write(`gallery/${String(i).padStart(2, '0')}.svg`, generateAbstract(`gallery-${i}`, 600, 600));
}

// Favicon
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="${PALETTE.cream}"/>
  <circle cx="16" cy="16" r="11" fill="none" stroke="${PALETTE.clay}" stroke-width="1.5"/>
  <path d="M9,16 Q16,7 23,16 Q16,25 9,16 Z" fill="${PALETTE.clay}" opacity="0.85"/>
  <circle cx="16" cy="16" r="2.5" fill="${PALETTE.ochre}"/>
</svg>`;
writeFileSync(join(ROOT, '..', 'favicon.svg'), favicon);
console.log('  ✓ favicon.svg');

// Open Graph image
const og = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${PALETTE.cream}"/>
      <stop offset="100%" stop-color="${PALETTE.creamWarm}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1050" cy="120" r="180" fill="${PALETTE.ochre}" opacity="0.55"/>
  <circle cx="120" cy="540" r="140" fill="${PALETTE.clay}" opacity="0.45"/>
  <text x="80" y="280" font-family="Georgia, serif" font-size="60" fill="${PALETTE.ink}">REuse Atelier</text>
  <text x="80" y="370" font-family="Georgia, serif" font-style="italic" font-size="42" fill="${PALETTE.clay}">Skapende gjenbruk i Oslo</text>
  <text x="80" y="440" font-family="sans-serif" font-size="26" fill="${PALETTE.ink}">Workshops · Kurs · Bursdager · Teambuilding</text>
  <line x1="80" y1="490" x2="280" y2="490" stroke="${PALETTE.moss}" stroke-width="3"/>
</svg>`;
writeFileSync(join(ROOT, '..', 'og-image.svg'), og);
console.log('  ✓ og-image.svg');

// robots.txt
const robots = `User-agent: *
Allow: /

Sitemap: \${SITE}/sitemap-index.xml
`;
writeFileSync(join(ROOT, '..', 'robots.txt'), robots);
console.log('  ✓ robots.txt');

console.log('\nFerdig.');
