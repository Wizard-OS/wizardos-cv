import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
const routes = [
  'en/',
  'es/',
  ...['en', 'es'].flatMap((lang) =>
    ['blog/', 'work/smart-cities/', 'work/abitab/', 'work/tropix/'].map((route) => lang + '/' + route)
  ),
];
let checks = 0;
for (const route of routes) {
  const html = await readFile(path.join(root, route, 'index.html'), 'utf8');
  assert.match(html, new RegExp('<html[^>]+lang="' + route.slice(0, 2) + '"'));
  checks++;
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, route + ': one h1');
  checks++;
  assert.match(html, /wizardos2011@gmail.com/);
  checks++;
  assert.match(html, /hreflang="en"/);
  assert.match(html, /hreflang="es"/);
  checks += 2;
  assert.ok(!html.includes('Writing starts here') && !html.includes('La escritura empieza aquí'), 'Draft leaked');
  checks++;
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const [pathname, hash] = href.split('#');
    const target = path.resolve(root, '.' + pathname, path.extname(pathname) ? '' : 'index.html');
    assert.ok(target.startsWith(root + path.sep), 'Link escapes output directory');
    const info = await stat(target).catch(() => null);
    assert.ok(info?.isFile(), route + ': missing target ' + href);
    checks++;
    if (hash) {
      const linked = target === path.join(root, route, 'index.html') ? html : await readFile(target, 'utf8');
      assert.ok(linked.includes('id="' + hash + '"'), route + ': missing anchor ' + href);
      checks++;
    }
  }
}
const index = await readFile(path.join(root, 'index.html'), 'utf8');
assert.ok(index.includes('/en/'), 'Root redirects to English');
checks++;
assert.ok((await stat(path.join(root, 'og.png'))).size > 0);
checks++;
assert.ok((await stat(path.join(root, 'documents/Osvaldo_Cintra_Garcia_CV.pdf'))).size > 0);
checks++;
console.log('Passed ' + checks + ' build assertions across ' + routes.length + ' bilingual pages.');
