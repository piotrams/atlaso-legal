// Regenerates all icon PNGs: node scripts/make-icons.js assets  (needs Playwright + Chromium)
const { chromium } = require('playwright');
const fs = require('fs');
const out = process.argv[2];

const C = 512;
function ticks(r1, r2, n, color, w) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const major = i % 6 === 0;
    const ri = major ? r1 - 14 : r1;
    s += `<line x1="${C + Math.cos(a) * ri}" y1="${C + Math.sin(a) * ri}" x2="${C + Math.cos(a) * r2}" y2="${C + Math.sin(a) * r2}" stroke="${color}" stroke-width="${major ? w * 1.6 : w}" stroke-linecap="round"/>`;
  }
  return s;
}
// D-pad as one path (plus shape with rounded ends)
function dpad(arm, len, rx, fill, stroke = '', sw = 0) {
  const h = arm / 2, L = len / 2;
  return `<path d="M${C - h + rx},${C - L} h${arm - 2 * rx} a${rx},${rx} 0 0 1 ${rx},${rx} V${C - h} H${C + L - rx} a${rx},${rx} 0 0 1 ${rx},${rx} v${arm - 2 * rx} a${rx},${rx} 0 0 1 -${rx},${rx} H${C + h} V${C + L - rx} a${rx},${rx} 0 0 1 -${rx},${rx} h-${arm - 2 * rx} a${rx},${rx} 0 0 1 -${rx},-${rx} V${C + h} H${C - L + rx} a${rx},${rx} 0 0 1 -${rx},-${rx} v-${arm - 2 * rx} a${rx},${rx} 0 0 1 ${rx},-${rx} H${C - h} V${C - L + rx} a${rx},${rx} 0 0 1 ${rx},-${rx} z" fill="${fill}" ${stroke ? `stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"` : ''}/>`;
}
function arrows(arm, len, color) {
  const L = len / 2 - 52, s = 26;
  const tri = (x, y, dx, dy) => {
    const px = -dy, py = dx;
    return `<path d="M${x + dx * s},${y + dy * s} L${x - dx * s * 0.6 + px * s},${y - dy * s * 0.6 + py * s} L${x - dx * s * 0.6 - px * s},${y - dy * s * 0.6 - py * s} z" fill="${color}"/>`;
  };
  return tri(C, C - L, 0, -1) + tri(C, C + L, 0, 1) + tri(C - L, C, -1, 0) + tri(C + L, C, 1, 0);
}

const defs = `
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#1B0B33"/><stop offset="0.55" stop-color="#2D0D45"/><stop offset="1" stop-color="#5A0F4D"/>
  </linearGradient>
  <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#FF3D8B" stop-opacity="0.55"/><stop offset="0.6" stop-color="#FF3D8B" stop-opacity="0.12"/><stop offset="1" stop-color="#FF3D8B" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#5EF0FF"/><stop offset="1" stop-color="#1FA3E0"/>
  </linearGradient>
  <linearGradient id="pad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#FFD0E4"/>
  </linearGradient>
  <filter id="neon" x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur stdDeviation="14" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
    <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity="0.55"/>
  </filter>
</defs>`;

// art scaled by k around center (for android safe zone)
function art(k, mono = false) {
  const W = mono ? '#fff' : null;
  const bolts = [45, 135, 225, 315].map((d) => {
    const a = (d * Math.PI) / 180, r = 352;
    return `<circle cx="${C + Math.cos(a) * r}" cy="${C + Math.sin(a) * r}" r="22" fill="${W || '#FFC94A'}"/>`;
  }).join('');
  return `<g transform="translate(${C} ${C}) scale(${k}) translate(${-C} ${-C})">
    ${mono ? '' : `<circle cx="${C}" cy="${C}" r="420" fill="url(#glow)"/>`}
    <circle cx="${C}" cy="${C}" r="352" fill="${mono ? 'none' : '#140822'}" fill-opacity="0.6" stroke="${W || 'url(#ring)'}" stroke-width="30" ${mono ? '' : 'filter="url(#neon)"'}/>
    ${bolts}
    <g ${mono ? '' : 'opacity="0.9"'}>${ticks(292, 316, 36, W || '#22D3EE', 7)}</g>
    <circle cx="${C}" cy="${C}" r="262" fill="none" stroke="${W || '#FF3D8B'}" stroke-width="10" ${mono ? '' : 'filter="url(#neon)"'}/>
    <g ${mono ? '' : 'filter="url(#shadow)"'}>${dpad(130, 400, 30, W || 'url(#pad)')}</g>
    ${mono ? '' : arrows(130, 400, '#FF3D8B')}
    <circle cx="${C}" cy="${C}" r="30" fill="${mono ? '#000' : '#2D0D45'}" ${mono ? 'fill-opacity="0"' : ''}/>
  </g>`;
}

const svg = (body, bg = true) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">${defs}${bg ? '<rect width="1024" height="1024" fill="url(#bg)"/>' : ''}${body}</svg>`;

const variants = {
  'icon.png': { svg: svg(art(1)), size: 1024, opaque: true },
  'splash-icon.png': { svg: svg(art(1), false), size: 1024 },
  // Android adaptive: content must sit in the inner 66% safe zone
  'android-icon-foreground.png': { svg: svg(art(0.62), false), size: 512 },
  'android-icon-background.png': { svg: svg(''), size: 512, opaque: true },
  'android-icon-monochrome.png': { svg: svg(art(0.62, true), false), size: 432 },
  'favicon.png': { svg: svg(art(1.08)), size: 48, opaque: true },
};

(async () => {
  const b = await chromium.launch();
  for (const [name, v] of Object.entries(variants)) {
    const p = await b.newPage({ viewport: { width: v.size, height: v.size } });
    await p.setContent(`<html><body style="margin:0;background:transparent">${v.svg.replace('width="1024" height="1024"', `width="${v.size}" height="${v.size}"`)}</body></html>`);
    await p.screenshot({ path: `${out}/${name}`, omitBackground: !v.opaque });
    await p.close();
  }
  fs.writeFileSync(`${out}/icon.svg`, variants['icon.png'].svg);
  await b.close();
})();
