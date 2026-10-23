// Tofu addition: package the upstream Angular production build for static hosting.
// The original source and npm lockfile remain the authority for rebuilding it.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const customConfig = path.join(root, 'custom-build-config.json');
const previousConfig = fs.existsSync(customConfig) ? fs.readFileSync(customConfig) : undefined;
let built = false;
try {
  fs.copyFileSync(path.join(root, 'tofu-build-config.json'), customConfig);
  const result = spawnSync(process.execPath, [
    path.join(root, 'node_modules/@angular/cli/bin/ng.js'),
    'build', '--configuration', 'production', '--aot', '--base-href', '/'
  ], { cwd: root, stdio: 'inherit', env: { ...process.env, NG_CLI_ANALYTICS: 'false' } });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Angular build failed (${result.status ?? result.signal})`);
  built = true;
} finally {
  if (previousConfig === undefined) fs.rmSync(customConfig, { force: true });
  else fs.writeFileSync(customConfig, previousConfig);
}

// Tofu's Free static lane serves no .eot file, and only Internet Explorer 6-8 ever read one.
// Drop the file and its two CSS references; the woff2, woff, ttf and svg sources of the same font stay.
function dropEmbeddedOpentype(site) {
  for (const name of fs.readdirSync(site, { recursive: true })) {
    const file = path.join(site, name);
    if (name.endsWith('.eot')) {
      fs.rmSync(file);
    } else if (/\.(css|html)$/.test(name)) {
      const text = fs.readFileSync(file, 'utf8');
      const stripped = text
        .replace(/src:url\("[^"]*\.eot"\);/g, '')
        .replace(/url\("[^"]*\.eot\?#iefix"\) format\("embedded-opentype"\),/g, '');
      if (stripped.includes('.eot')) throw new Error(`${name} still points at an .eot file`);
      if (stripped !== text) fs.writeFileSync(file, stripped);
    }
  }
}

if (built) {
  const output = path.join(root, 'tofu-site');
  fs.rmSync(output, { recursive: true, force: true });
  fs.cpSync(path.join(root, 'dist'), output, { recursive: true });
  dropEmbeddedOpentype(output);
  fs.copyFileSync(path.join(root, 'LICENSE'), path.join(output, 'LICENSE.txt'));
  fs.copyFileSync(path.join(root, 'src/fonts/kulim-park/SIL Open Font License.txt'), path.join(output, 'FONT-LICENSE.txt'));
  fs.copyFileSync(path.join(root, 'src/fonts/README.md'), path.join(output, 'FONT-CREDITS.md'));
  fs.copyFileSync(path.join(root, 'src/app/components/icons/README.md'), path.join(output, 'ICON-CREDITS.md'));
  const manifestPath = path.join(output, 'assets/app/manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  // Each installed copy belongs to its own origin instead of the upstream website.
  manifest.id = '/';
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  fs.writeFileSync(path.join(output, 'source.json'), JSON.stringify({
    name: 'Mah',
    upstream: 'https://github.com/ffalt/mah',
    upstreamCommit: '45a6f34ac4cc8a3dc2967b6f9f227f04828f3aae',
    adaptedSource: 'https://github.com/tofu-gallery/mah/tree/pin/2026-10-23.1',
    license: 'MIT (application); artwork and fonts retain their separate upstream licenses',
    rebuild: 'npm ci && node tools/tofu-package.mjs (Node >=26)'
  }, null, 2) + '\n');
  console.log(`Static site ready: ${output}`);
}
