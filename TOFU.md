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

Apart from the background-pattern change below, only additive files are introduced; the lockfile and every other upstream file remain untouched.

- `tofu-build-config.json` keeps the released name **Mah**, enables the built-in editor and daily challenge, and uses the deployed site's own root URL for metadata. The optional Kyodai tile-image catalog stays off because it points to third-party archive images; the bundled tile sets work locally.
- `tools/tofu-package.mjs` wraps the upstream Angular production build, preserving any local custom build config. It packages static files and license/credit notices, drops the legacy `.eot` font file (next bullet), and changes only the generated manifest's ID to `/`, so an installed copy belongs to its own origin rather than upstream's GitHub Pages origin.
- **No `.eot` file in `tofu-site/`.** The Angular build copies `media/kulim-park-v4-latin-ext_latin-regular-GKGAVQBN.eot`, the Internet Explorer 6-8 format of the Kulim Park font. Tofu's Free static lane refuses a whole site that holds one file of a type it does not serve, and `.eot` is one, so the first pin (`pin/2026-10-23`) could not run on the Free plan. `tools/tofu-package.mjs` now deletes every `.eot` from the packaged site and removes the two references to it: the standalone IE9 line `src:url("./media/...GKGAVQBN.eot");` and the entry `url("./media/...GKGAVQBN.eot?#iefix") format("embedded-opentype")`, both in the inline critical CSS of `index.html` and in `styles-BR5DHJFZ.css` (171 bytes out of each file, nothing else touched). The same `@font-face` keeps its `woff2`, `woff`, `ttf` and `svg` sources, so the font looks the same: every current browser loads the `woff2` file, and no browser that can run this Angular app reads `.eot`. The upstream font stylesheet `src/fonts/kulim-park/css/kulim-park.css` is unchanged, and the font's SIL OFL text stays as `FONT-LICENSE.txt`. If the build is repeated, the packager's `dropEmbeddedOpentype` step stops with an error rather than ship a site that still points at an `.eot`.
- **30 fewer background patterns.** Tofu's Free static lane publishes at most 500 files per site (the Markdown notes it leaves out do not count), and the first pin published 528. With the `.eot` gone that is still 527, of which 375 are the background-pattern files in `assets/patterns/` that the app fetches one at a time when someone picks one under Settings > Background > Pattern monster. Upstream lists them in `generatePatternList()` in `src/app/service/pattern.service.ts` and its own spec (`pattern.service.spec.ts`) requires that list and `src/assets/patterns/*.json` to match, so this fork removes the same 30 from both: the 21 holiday patterns (`christmas-bells-1`, `christmas-gift`, `christmas-pattern-1` to `-7`, `christmas-tree-1`, `christmas-tree-balls`, `halloween-1` to `-7`, `santa-claus`, `candy-cane-1`, `snowflakes-1`) and `triangles-17` to `-25`. The picker now lists 345 patterns instead of 375. All 40 languages, every board, tile set, theme and background image are unchanged, and `src/assets/patterns/README.md` (the pattern.monster MIT credit) stays. The packaged site is now 503 files, 497 of them published, so only three more could be added back before it passes the lane's limit; a rebuild with this source reproduces it.
- `tofu-site/` holds the verified static build. It is the copyable gallery payload. `source.json` links to the upstream commit and the adapted source tag; rebuild this directory whenever source changes.
- `TOFU.md` describes deployment, provenance, and license limits.

No tracking, analytics scripts, advertising, remote font hosting, or Tofu-owned service credentials are added. Runtime asset requests use the deployed origin. Upstream attribution and help links remain available and are ordinary user-initiated external navigation.

## Upstream and licenses

- Upstream: https://github.com/ffalt/mah
- Upstream branch: `main`
- Base upstream commit: `45a6f34ac4cc8a3dc2967b6f9f227f04828f3aae`
- Fork: https://github.com/tofu-gallery/mah
- Adaptations: `tofu` branch; verified release tag: `pin/2026-10-23.1`. The earlier tag `pin/2026-10-23` is kept as it was; it still contains the `.eot` file and the 528 published files that Tofu's Free static lane refuses, so use `pin/2026-10-23.1`.
- `main` remains the upstream mirror, without adaptation commits.

The application is MIT, copyright (c) 2016 ffalt. `LICENSE` is unchanged and copied to the static payload as `LICENSE.txt`. The font is SIL OFL, copied as `FONT-LICENSE.txt`; font and icon credits are also included. Bundled artwork is **not all MIT**: upstream's `src/assets/svg/README.md` lists CC BY 4.0, CC BY-SA 4.0, GPL-3.0, public-domain, and other credited artwork. Keep all of these credits and source files. The same asset README files are preserved in the static build and the full corresponding source remains available in this public fork. Do not advertise the whole asset bundle as MIT-only.

## Verification

Verified on 2026-10-23. No Tofu deployment was performed.

### After the Free-lane fixes (`pin/2026-10-23.1`)

- Before the changes, Tofu's static-lane check of this fork's `tofu` branch (the GitHub import of `tofu-site/`, read with Tofu's own file-type and safety predicates) counted 534 files, 528 of them published, and refused the site for exactly one file type, the `.eot`; its safety check passed with 0 findings. A finished site may publish at most 500 files, so the 528 were over the limit as well.
- With the unchanged source and the `.eot` step in place, a real rebuild (`npm ci` from the unchanged lockfile, then `node tools/tofu-package.mjs` under Node.js 26.12.1) reproduced the committed `tofu-site/` byte for byte. Compared with the first pin, the `.eot` file is gone, `index.html` and `styles-BR5DHJFZ.css` each lost exactly the two `.eot` references (171 bytes each), and `source.json` names the new tag; nothing else changed.
- After the pattern change the same build succeeds (exit 0, 2.7 seconds; initial bundle 628.23 kB raw) and gives 503 files, 497 of them published; the main bundle and the lazy chunks get new content hashes, so `index.html` names the new main bundle. Upstream's `pattern.service.spec.ts` has two tests for the list and the files, `has a JSON file for every generated id` and `includes every JSON file in the generated list`: both pass. The other 10 tests in that file fail in this environment, with and without the change, with `TypeError: Cannot read properties of null (reading 'ngModule')` (vitest was run directly rather than through Angular's test builder; not investigated further). The rest of the unit-test suite was not run.
- Real browser on the final build (the gstack `/browse` skill driving Aside, with no saved site data): the tutorial dialog appears; Skip tutorial opens board selection; Turtle starts with `Stones:144`; both Kulim Park font faces report `loaded`, the interface text is set in Kulim Park, and the only font file requested is the `.woff2` (200), with no `.eot` request; Hint announces `10 matching pairs highlighted.`; keyboard activation (Enter) of the two highlighted Insect tiles announces `Matched. 142 tiles remaining.` and the counter reads `Stones: 142`; reopening shows the `Continue Saved Game` prompt. Console errors: `[]`.
- Settings > Background > Pattern monster lists 345 patterns, none of them holiday ones, with Triangles 1 to 16, 27 and 28; each of the 345 `assets/patterns/<id>.json` files returned 200 when fetched; choosing African 1 loads its file (200) and paints the board background. Console errors: `[]`.
- Viewports 1440x900 and 375x812: document scroll dimensions equal the viewport. Screenshots taken on the build before the pattern change show the game and controls fitting, with the upstream portrait board rotation on mobile.
- Network: every request the app made on the final build was to the local origin and returned 200. A further image request to a `yiban.io` host (status 0) came from a browser-extension overlay in the verification browser, not from the app: the name `yiban` does not appear anywhere under `tofu-site/`.

### First pin (`pin/2026-10-23`)

Verified locally using Node.js 26.12.1 and npm 11.21.1.

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
- Angular production build: exit 0, 3.078 seconds; initial JavaScript/CSS bundle 628.39 kB raw. Packaged site: 534 files, approximately 12 MB on disk (503 files since the `.eot` and 30 background patterns were removed).
- HTTP checks: `/`, the main JavaScript bundle, board data, and manifest all returned 200.
- Real browser checks with the gstack `/browse` skill and Aside: tutorial loads; skip tutorial opens board selection; selecting Turtle renders 144 tiles; reopening shows the saved-game continuation; Hint highlights a pair; keyboard activation of both tiles produces `Matched. 142 tiles remaining.`
- Browser console errors: `[]`. External resource requests during initial load and gameplay: `[]`.
- Viewports 1440x900 and 375x812: document scroll dimensions equal viewport dimensions; inspected screenshots show the game and controls fit, with the upstream portrait board rotation on mobile.
- Unit-test suite and production deployment were not run; the checks above cover installation, production compilation, local HTTP serving, and the core game flow.

Screenshots remain local under `local/verification/` (ignored by the upstream `.gitignore`), including `mah-desktop-played.jpg` and `mah-mobile-played.jpg`. Upstream licenses, source, package manifest, and lockfile were checked unchanged before committing.
