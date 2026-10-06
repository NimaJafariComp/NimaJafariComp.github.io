import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve('dist');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
assert(!html.includes('<!-- portfolio -->'), 'portfolio content must be rendered at build time');
assert.equal((html.match(/<h1\b/g) || []).length, 1);
for (const [, url] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  if (/^(?:https?:|mailto:|#|data:)/.test(url)) continue;
  const file = resolve(root, url.replace(/^\//, '').split(/[?#]/)[0]);
  assert(file.startsWith(`${root}/`) && existsSync(file), `missing built asset: ${url}`);
}
for (const path of ['404.html', 'robots.txt', 'sitemap.xml', 'assets/social-preview.jpg']) {
  assert(existsSync(resolve(root, path)), `missing launch asset: ${path}`);
}
console.log('Built HTML, local asset links, and launch files verified.');
