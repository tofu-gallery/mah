# Mah on Tofu

Mah is ffalt's open-source Mahjong Solitaire game, with multiple board layouts and tile sets, a layout editor, daily challenges, and browser-local saved games. This fork preserves the upstream name, artwork, logo, favicon, and application source.

## How Tofu runs it

- **Framework preset:** `static`.
- **Site root for importing/copying:** `tofu-site/`. Copy this directory, not the repository root, into a new Tofu app. Its `index.html` is the application entry page.
- **Hosting build command:** none. The static site is prebuilt and committed so copying it requires neither Node 26 nor an Angular preset.
- **Source build:** Node.js >=26, `npm ci`, then `node tools/tofu-package.mjs`, from the repository root. This runs the upstream Angular production builder with base URL `/`, emits `dist/`, and packages it into `tofu-site/`. Use the root `package-lock.json` unchanged.
- **Source-build output:** `dist/`; **deployable output:** `tofu-site/`.
- **Environment variables:** none. Angular CLI analytics is disabled by the build wrapper and upstream configuration.
- **Database, server, account, API key:** none. Preferences, saved games, statistics, and custom layouts live in the visitor's browser local storage. Clearing browser storage loses them, and they do not sync across devices.
- **Local verification server:** `python3 -m http.server 8427 --bind 127.0.0.1 --directory tofu-site`.

Despite the initial gallery classification, the current upstream is an Angular application, not a standalone Vite SPA. Vite is present in its development/test dependencies. Do not select the Vite preset for this source repository. The gallery entry must set its source root to `tofu-site/` and use the static preset.

## Adaptations and reasons

Only additive files are introduced; the upstream application files and lockfile remain untouched.

- `tofu-build-config.json` keeps the released name **Mah**, enables the built-in editor and daily challenge, and uses the deployed site's own root URL for metadata. The optional Kyodai tile-image catalog stays off because it points to third-party archive images; the bundled tile sets work locally.
- `tools/tofu-package.mjs` wraps the upstream Angular production build, preserving any local custom build config. It packages static files and license/credit notices, and changes only the generated manifest's ID to `/`, so an installed copy belongs to its own origin rather than upstream's GitHub Pages origin.
- `tofu-site/` holds the verified static build. It is the copyable gallery payload. `source.json` links to the upstream commit and the adapted source tag; rebuild this directory whenever source changes.
- `TOFU.md` describes deployment, provenance, and license limits.

No tracking, analytics scripts, advertising, remote font hosting, or Tofu-owned service credentials are added. Runtime asset requests use the deployed origin. Upstream attribution and help links remain available and are ordinary user-initiated external navigation.

## Upstream and licenses

- Upstream: https://github.com/ffalt/mah
- Upstream branch: `main`
- Base upstream commit: `45a6f34ac4cc8a3dc2967b6f9f227f04828f3aae`
- Fork: https://github.com/tofu-gallery/mah
- Adaptations: `tofu` branch; verified release tag: `pin/2026-10-23`.
- `main` remains the upstream mirror, without adaptation commits.

The application is MIT, copyright (c) 2016 ffalt. `LICENSE` is unchanged and copied to the static payload as `LICENSE.txt`. The font is SIL OFL, copied as `FONT-LICENSE.txt`; font and icon credits are also included. Bundled artwork is **not all MIT**: upstream's `src/assets/svg/README.md` lists CC BY 4.0, CC BY-SA 4.0, GPL-3.0, public-domain, and other credited artwork. Keep all of these credits and source files. The same asset README files are preserved in the static build and the full corresponding source remains available in this public fork. Do not advertise the whole asset bundle as MIT-only.

## Verification

Verified locally on 2026-10-23 using Node.js 26.12.1 and npm 11.21.1. No Tofu deployment was performed.

Exact commands used on the verification machine:

```sh
npm exec --yes --package=node@26.12.1 --package=npm@11 -- npm --prefix /private/tmp/gallery-batch2/mah ci --no-audit --no-fund
/Users/MacbookPro/.local/bin/tofu-build-lock npm exec --yes --package=node@26.12.1 -- node /private/tmp/gallery-batch2/mah/tools/tofu-package.mjs
python3 -m http.server 8427 --bind 127.0.0.1 --directory /private/tmp/gallery-batch2/mah/tofu-site
curl --fail --silent --show-error --output /private/tmp/gallery-batch2/mah/local/verification/root.html --write-out 'mah root HTTP %{http_code}\n' http://127.0.0.1:8427/
curl --fail --silent --show-error --output /private/tmp/gallery-batch2/mah/local/verification/boards.json --write-out 'mah boards HTTP %{http_code}\n' http://127.0.0.1:8427/assets/data/boards.json
curl --fail --silent --show-error --output /private/tmp/gallery-batch2/mah/local/verification/main.js --write-out 'mah main bundle HTTP %{http_code}\n' http://127.0.0.1:8427/main-E2F3GYX5.js
curl --fail --silent --show-error --output /private/tmp/gallery-batch2/mah/local/verification/manifest.json --write-out 'mah manifest HTTP %{http_code}\n' http://127.0.0.1:8427/assets/app/manifest.json
```

`tofu-build-lock` above only serializes builds on the shared verification machine; elsewhere use `node tools/tofu-package.mjs` directly under Node >=26.

- Dependency installation: exit 0, 544 packages; upstream lockfile unchanged. npm reported install-script approval warnings, which did not prevent the build.
- Angular production build: exit 0, 3.078 seconds; initial JavaScript/CSS bundle 628.39 kB raw. Packaged site: 534 files, approximately 12 MB on disk.
- HTTP checks: `/`, the main JavaScript bundle, board data, and manifest all returned 200.
- Real browser checks with the gstack `/browse` skill and Aside: tutorial loads; skip tutorial opens board selection; selecting Turtle renders 144 tiles; reopening shows the saved-game continuation; Hint highlights a pair; keyboard activation of both tiles produces `Matched. 142 tiles remaining.`
- Browser console errors: `[]`. External resource requests during initial load and gameplay: `[]`.
- Viewports 1440x900 and 375x812: document scroll dimensions equal viewport dimensions; inspected screenshots show the game and controls fit, with the upstream portrait board rotation on mobile.
- Unit-test suite and production deployment were not run; the checks above cover installation, production compilation, local HTTP serving, and the core game flow.

Screenshots remain local under `local/verification/` (ignored by the upstream `.gitignore`), including `mah-desktop-played.jpg` and `mah-mobile-played.jpg`. Upstream licenses, source, package manifest, and lockfile were checked unchanged before committing.
