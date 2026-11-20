// export-character.mjs: write every character part as a standalone SVG (for Rive / After Effects / Lottie / Figma),
// plus parts-sheet.html (all parts laid out, like a model sheet).
//   node scripts/export-character.mjs [outDir]      default: assets/character/parts
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const out = path.resolve(process.argv[2] || path.join(root, 'assets/character/parts'));
mkdirSync(out, { recursive: true });
const ctx = {}; vm.createContext(ctx);
vm.runInContext(readFileSync(path.join(root, 'assets/avatar.js'), 'utf8') + '\n;this.AV_PARTS = AV_PARTS;', ctx);
const parts = ctx.AV_PARTS();
const names = Object.keys(parts);
for (const n of names) {
  const [svg, [x, y, w, h]] = parts[n];
  writeFileSync(path.join(out, n + '.svg'),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${w}" height="${h}"><!-- ${n}. Gốc toạ độ (0,0) = khớp xoay của bộ phận. -->${svg}</svg>\n`);
}
// parts sheet
const cols = 6, cw = 250, ch = 270;
const cells = names.map((n, i) => { const [svg, [x, y, w, h]] = parts[n]; const k = Math.min((cw - 30) / w, (ch - 50) / h, 1.6);
  const cx = (i % cols) * cw, cy = Math.floor(i / cols) * ch;
  return `<g transform="translate(${cx} ${cy})"><rect x="6" y="6" width="${cw - 12}" height="${ch - 12}" rx="10" fill="#fafafa" stroke="#e2e2e2"/><g transform="translate(${cw / 2 - (x + w / 2) * k} ${(ch - 28) / 2 - (y + h / 2) * k}) scale(${k})">${svg}</g><text x="${cw / 2}" y="${ch - 14}" font-size="14" text-anchor="middle" fill="#555" font-family="system-ui,sans-serif">${n}</text></g>`; }).join('');
const H = Math.ceil(names.length / cols) * ch;
writeFileSync(path.join(root, 'assets/character/parts-sheet.html'), `<!doctype html><meta charset="utf-8"><title>Character parts</title><body style="margin:0;background:#fff"><svg xmlns="http://www.w3.org/2000/svg" width="${cols * cw}" height="${H}" viewBox="0 0 ${cols * cw} ${H}">${cells}</svg>`);
console.log(`wrote ${names.length} parts to ${out}`);
