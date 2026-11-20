// inline.mjs: bundle a page and its <script src="..."> files into ONE self-contained HTML file.
//   node inline.mjs assets/template.html video.html
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
const [, , src, out] = process.argv;
if (!src || !out) { console.log('usage: node inline.mjs page.html out.html'); process.exit(1); }
const dir = path.dirname(path.resolve(src));
const html = readFileSync(src, 'utf8').replace(/<script\s+src="([^"]+)"\s*><\/script>/g,
  (_, f) => `<script>\n${readFileSync(path.join(dir, f), 'utf8')}\n</script>`);
writeFileSync(out, html);
console.log('wrote', out, `(${(html.length / 1024).toFixed(0)} KB)`);
