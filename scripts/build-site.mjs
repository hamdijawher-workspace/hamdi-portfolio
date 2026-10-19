import { cpSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import './validate-site.mjs';

const root = resolve(import.meta.dirname, '..');
const output = join(root, 'dist');
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
const publicFiles = readdirSync(root).filter(name => name.endsWith('.html'));
for (const name of [...publicFiles, 'assets', 'css', 'js', 'work', 'robots.txt', 'sitemap.xml']) {
  cpSync(join(root, name), join(output, name), { recursive: true });
}
console.log('Static portfolio built in dist/; build scripts and configuration are excluded.');
