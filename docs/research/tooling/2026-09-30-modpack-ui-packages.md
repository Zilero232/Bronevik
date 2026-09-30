# Modpack UI: packages instead of custom code (2026-09-30)

Scope: `apps/game/modpack/ui-web` (Preact 10 pages in Coherent Gameface: `index.html` settings window, `hud.html` battle HUD). Goal: find the custom code a maintained package can replace, measure what each package costs on each page, and check that it runs on the client's engine. This is a plan only; no code was changed.

The tree was read at 15:30–16:30 on 2026-09-30 while another agent was editing `ui-web` (files were moving, e.g. `widget-registry` to `entities/hud-widgets/registry`). Line counts are from that snapshot. The committed build (15:22) was 239,399 B / 72,616 B gz (`index.html`) and 117,707 B / 36,472 B gz (`hud.html`).

## 1. The engine is known now

"Gameface runs an unknown V8" (modpack README, In-game UI) is no longer true for Lesta 1.45:

| Evidence | Finding |
| --- | --- |
| `D:\Games\Tanki\win64\v8.dll`, version string in the binary | **V8 9.4.146.24** (Chrome 94, Sept 2021) |
| `win64\cohtml.WindowsDesktop.dll` file version | **Cohtml 1.29.4.2** (`gui/gameface/js/cohtml.js` says `VERSION = [2, 0, 0, 0]`) |
| `v8.dll` strings | built **without ICU**: no `NumberFormat`, `PluralRules`, `RelativeTimeFormat`, `Segmenter`. So `Intl` is absent, as the README says. `String#normalize` without ICU returns the string unchanged. |
| `v8.dll` harmony flags | `harmony_array_find_last` is still a flag (off by default in 9.4), so **no native `findLast`/`findLastIndex`**. `Object.hasOwn` (9.3) and `Array#at` (9.2) ship. |
| live `python.log`, session 15:03, installed `net.triotmetki.ui_0.6.1.mtmod` | That build calls `stack.at(-1)` on every render of the always-mounted `UndoToast`, and remeda's `Object.hasOwn` sits in both pages. The settings window opened, rendered, was dragged and scrolled, and Gameface logged **no JS error**. Gameface does log JS errors to this file: the only one is 388× `e.hasAttribute is not a function` from an older build at 11:30. |

Consequences:

- The pages already ship ES2019–ES2022 built-ins: `Array#at` in `actions.ts`, `use-undo-toast.ts`, `scroll-metrics.ts` and remeda's `pipe`; `Object.hasOwn` in remeda `isDeepEqual`; `replaceAll` in `components.ts` and `marks-report.ts`; `flatMap`; `Object.fromEntries`. They are safe on V8 9.4, but the README's "rich-text avoids `matchAll`, `Object.hasOwn` and `Array#at`" guards against nothing.
- The real ceiling is **chrome94**: ES2021 syntax and built-ins plus `Array#at`, `Object.hasOwn`, `Error.cause` and class static blocks. It excludes `findLast`, `toSorted`, `structuredClone` (a web API), `Intl`, `Array.fromAsync` and `Promise.withResolvers`.
- DOM quirks are Cohtml's, not V8's, and stay unknown: no `hasAttribute`, `event.code` not known to exist, ResizeObserver not verified. Libraries that touch the DOM still need a live check.

## 2. Ranked replacements

Size cost is the added minified + gzip (`-9`) bytes, measured on scratch bundles (§7). "Both" means the code is on both pages.

| # | Package / change | Replaces | Lines removed | Size cost | Compat verdict |
| --- | --- | --- | --- | --- | --- |
| 1 | **Build target `es2017` → `chrome94`** (`config/vite/vite.constants.ts` `script.target`) | esbuild's syntax lowering: `?.`/`??` rewritten to `(t=…)==null?void 0:…`, object-spread helpers `w(w({},t),…)`, `??=` | 0 (unlocks `matchAll`, see #7) | **index −7.8 KB / −2.2 KB gz; hud −4.4 KB / −1.2 KB gz** (real Vite builds of the current tree) | V8 9.4 = Chrome 94. Add the built-in guard from §6 step 1 so nothing newer slips in. |
| 2 | **date-fns `format` → `lightFormat`** | `entities/replays/lib/format-replay` `formatMoment` (`'dd.MM.yyyy HH:mm'` needs no locale). `format` pulls in the whole en-US locale: `January`, `less than a second` are in index.html. | 1 changed line | **index −5.3 KB gz** (`format`+locale 6.3 KB gz vs `lightFormat` 0.9 KB gz, which `marks-report` already uses) | Pure functions, ES5 built-ins. |
| 3 | **`@testing-library/preact`** 3.2.4 (dev only) | `shared/lib/testing/render-hook` (51), `shared/lib/testing/mount` (20; keep `imageSources`, 3 lines, as a test util) | ≈68, plus simpler call sites in 38 test files (`result.current`, `act`, `waitFor` instead of `current()`, `run()`, `settle()`) | 0 (never bundled) | Uses `preact/test-utils` like ours. Brings `screen` queries, which the repo's client tests already use via `@testing-library/react`. |
| 4 | **remeda, more of it** (already in both bundles; 11 more functions measured at +0.66 KB gz, realistic set ≈+0.4 KB gz) | `funnel` (`triggerAt: 'both'`, last-value `reducer`, `flush()` on mouse-up) for `shared/lib/throttle` (18) in `use-stage-drag`/`use-hud-editor`, and it adds the trailing send the current throttle drops; `sortBy` with key tuples for `components.ts` `compareTitles` (−14) and `filter-replays.ts` `compare` (−10, nulls-last as the first key); `mapValues` in `font-safe` `fontSafeData`, merged with the duplicate walker in `font-safe-state` `safeValue` (−10); `round(x, 2)` for `page-diag` `round2`, `frame` `toRem`, `panel-size` `wheelScale`, `figure` `percent`; `sumBy` in `team-hp-view`, `dock` `liftedTop`, `choice-layout`; `findLast` in `hit-panel` (2×`[...targets].reverse().find`) | ≈60 | ≈+0.4 KB gz, both | Already shipping. Use remeda's `findLast`: the native one is off in V8 9.4. |
| 5 | **`@siberiacancode/reactuse`** 1.0.17 through `preact/compat` (`@preact/preset-vite` already aliases `react` → `preact/compat`; `reactAliasesEnabled` defaults to true) | `useEventListener`: `shared/lib/use-window-event` (21, deleted), the 6 add/remove pairs in `use-page-mouse` (`target(document)` + `capture`), the window and thumb listeners in `use-thumb-drag` (with its `draggedRef`/`thumbDownRef` juggling), `resize` in `use-viewport`, `use-hud-screen`, `use-virtual-list`. `useInterval`: `use-scroll-area`, `use-viewport`, `use-hud-screen`, `use-hovered-panel`. `useLatest` for the hand-kept "latest callback" refs (`use-escape-layer`, `use-wheel-scroll`, `use-scroll-area`). | ≈90 | **+2.8 KB gz per page** (preact/compat 2.3 KB, hooks 0.5 KB). After #1 and #2 the net is still −4.7 KB gz on index and +1.6 KB gz on hud. | No ES2018+ built-ins in the bundle. Hooks are plain `addEventListener`/`setInterval`. Pass `window` by omitting the target (it defaults to `window`) or through `target(window)`: a bare `window` is not a target. Pass `{ passive: false }` where the handler calls `preventDefault`. It is the same library the site uses. |
| 6 | **nanostores `map`** (already installed) | `$view.set({ ...$view.get(), x })` in `store.ts` (`openSection`, `setContextFilter`, `toggleExpanded`) → `setKey` | ≈3 | +0.14 KB gz, index | Same package. |
| 7 | **Native `String#matchAll`** (no package; possible after #1) | `rich-text` `matchesOf` (10 lines) | ≈10 | 0 | V8 9.4 has it. Keep the parser itself (§4). |
| 8 | **`ts-pattern`** 5.9.0 (root catalog) — optional, settings page only | Union dispatch: `FieldControl.tsx` (`field.type`), `ViewStatus.tsx` / `ReplaysBrowser.tsx` (`BrowserView`), `use-undo-toast` `describe` (`UndoEntry.kind`), dev `mock-bridge/apply-message`. The tone ladders (`marks-report` `toneOf` = `marks-panel` `deltaTone`, `arty-view` `heatTone`) are better served by one shared `signTone` helper than by `match`. | ≈0 (buys `.exhaustive()` on unions that grow) | `match` alone 1.8 KB gz; with `P` 2.8 KB gz | ES2017-safe apart from one `.at(-1)`, which V8 9.4 has. Not for `hud.html`: its only dispatch is `settleDrag`, and `satisfies never` gives the same check for free. |

Net effect of 1–7 (8 left out): index ≈ −4.2 KB gz, hud ≈ +2.0 KB gz, ≈ 230 lines removed. #1 and #2 pay for #5.

## 3. Rejected, with evidence

| Package | Would replace | Measured | Why not |
| --- | --- | --- | --- |
| `@tanstack/virtual-core` 3.17.11 | `use-virtual-list` (80) + `visible-range` (23) | 24.3 KB / **7.2 KB gz** (≈ +10 % of index gz) | Rows are fixed-height, so `visibleRange` is 10 lines of arithmetic. virtual-core measures with `ResizeObserver` (7 uses; guarded, but without it the viewport is read once, and Cohtml support is unverified), works in px while the list converts through the rem scale (`pixelsPerUnit`), and follows `scroll` events while our box scrolls through the wheel glide. The adapter code (`observeElementRect`, `scrollToFn`, the scale) would be about as long as what it replaces. Also contains one `new Proxy`, which V8 has. |
| `fuse.js` 7.5.0 (`fuse.js/basic`) | `components.ts` `searchComponents` substring search | 10.0 KB gz (8.3 KB basic) | Too big for a search over ~60 cards, and fuzzy scoring changes a specified behaviour: from two letters, open every matching card with only the matching settings. |
| `@leeoniya/ufuzzy` 1.0.19 | same | 4.4 KB gz | Uses `Intl` (2×) and `matchAll`; there is no `Intl` in Gameface. |
| `@nozbe/microfuzz` 1.0.0 | same | 1.7 KB gz | Compatible, but its accent folding is `normalize('NFD')`, a no-op without ICU, so the `ё`→`е` folding stays ours. It turns substring into fuzzy matching; revisit only if players ask for typo tolerance. |
| `@tweenjs/tween.js` 25 / `popmotion` 11.0.5 / `animejs` 4.5 / `motion` 13.4 | `smooth-scroll` (84) | 3.7 / 5.6 / 12.7 / 21.2 KB gz | The glide extends a running glide on the next notch, aborts when anything else writes `scrollTop` (a thumb drag) and writes whole pixels. None does that without a wrapper that keeps most of the 61-line core. popmotion has been unmaintained since 2022. |
| `htmlparser2` 12.0.0 | `rich-text` (230) | 53.4 KB / **22.5 KB gz** (+62 % of hud gz) | Compatible now (`Object.hasOwn` is fine on V8 9.4), but still too big for the HUD page. |
| `tinykeys` 4.0.1 | `find-key` (34) | 1.0 KB gz | Matches on `event.code` / `getModifierState`. That is a Cohtml DOM question, not a V8 one, and still unverified. `find-key` reads `keyCode` as the client's own bundles do. |
| `mitt` / `nanoevents` | — | 0.2 KB gz | No hand-rolled emitter ships: the only listener list is the dev mock (`gameface/mock`, 5 lines, not bundled). |
| `@preact/signals` 2.11 | — | +2.8 KB gz | Would duplicate nanostores. |
| any number formatter | `hud-format` (65) | — | `Intl.NumberFormat` is absent (no ICU). The formatters that avoid `Intl` (numeral and co.) are bigger than 65 lines of our own rules: thin-space groups, `k` from 100,000, decimal comma. |
| reactuse `useTimeout` | `use-flash`, `use-undo-toast` timers | — | Both reset on a value (`key`, `lastId`); `useTimeout` restarts only when the delay changes. |
| remeda `isPlainObject` | `is-record` (1) | — | Rejects Gameface's engine-bound objects (unchanged). |

## 4. «Kept on purpose» re-check (`.claude/rules/shared/dependencies/reuse-libraries.md`)

| Entry | Verdict | New evidence |
| --- | --- | --- |
| `shared/lib/rich-text` | **Keep**, reword | Size is the only reason left (22.5 KB gz). Drop the `Object.hasOwn`/ES2022 argument: V8 9.4 has `Object.hasOwn`. Replace `matchesOf` with `matchAll` (#7). |
| `createThrottle` "(a forced flush remeda `funnel` lacks)" | **Remove** | remeda 2.50 `funnel` returns `{ call, cancel, flush, isIdle }`; `flush()` runs the pending call at once. `triggerAt: 'both'` with a last-value reducer also sends the last position after a pause in the drag, which the current throttle drops until mouse-up (#4). |
| `isRecord` | Keep | unchanged |
| `hud-format` (no `Intl`) | Keep, with evidence | `v8.dll` 9.4.146.24 has no ICU. |
| `shared/lib/smooth-scroll` | Keep, update numbers | tween.js 3.7 KB gz, popmotion 5.6, anime 12.7, motion 21.2 (§3). |
| `shared/lib/find-key` | Keep | unchanged |

## 5. Inventory (custom modules, lines without `index.ts` and tests)

Verdict key: **pkg** = replace per §2; **native** = drop for a built-in; **stays** = domain logic or a Gameface workaround that no package covers.

| Module | Lines | What it does | Verdict |
| --- | --- | --- | --- |
| `shared/lib/rich-text` | 230 | GUIFlash HTML subset → safe runs | stays (§4); `matchesOf` → native |
| `shared/lib/hud-geometry` | 141 | anchors, clamp, drag snap, placement thirds | stays (remeda `clamp` already) |
| `shared/lib/wheel-scroll` | 128 | wheel step, thumb maths, legacy `wheelDelta` | stays (Gameface wheel quirks) |
| `shared/lib/use-thumb-drag` | 96 | scrollbar thumb drag | **pkg** reactuse `useEventListener` |
| `shared/lib/smooth-scroll` | 84 | 200 ms glide | stays (§3) |
| `shared/lib/use-scroll-area` | 81 | measures, wheel, settle (`funnel`) | **pkg** `useInterval`, `useLatest` |
| `shared/lib/hud-format` | 65 | numbers without `Intl` | stays |
| `shared/lib/ui-sounds` | 61 | hover/click sounds by delegation | stays (engine sound API) |
| `shared/lib/font-safe` | 57 | glyph look-alikes | **pkg** remeda `mapValues`; merge with `font-safe-state` |
| `shared/lib/icon-sprite` | 56 | sprite cell → style | stays |
| `shared/lib/testing/render-hook`, `mount` | 51 + 20 | hook/component test harness | **pkg** `@testing-library/preact` |
| `shared/lib/escape-stack` | 46 | ranked Esc layers | stays (priority stack, not an emitter) |
| `shared/lib/dom/mount-once` | 44 | mount guard | stays; **bug:** calls `hasAttribute`, which Gameface elements lack (the 388 log errors at 11:30); use a module `WeakSet` or `dataset` |
| `shared/lib/use-field-escape`, `use-escape-layer` | 41 + 26 | Esc for fields/popovers | `useLatest` in `use-escape-layer` |
| `shared/lib/scroll-metrics` | 40 | box metrics with Gameface fallbacks | stays |
| `shared/lib/use-tooltip` | 40 | native tooltip bridge | stays |
| `shared/lib/find-key` | 34 | Ctrl+F by keyCode | stays (§3) |
| `shared/lib/hud-widget`, `hud-icon`, `hud-screen`, `hud-glyph`, `hud-bar`, `hud-pointer`, `radial`, `run-style`, `fit-scale`, `use-fit-scale` | 33, 26, 23, 9, 6, 6, 17, 14, 10, 26 | small HUD helpers | stay (`clamp` already remeda) |
| `shared/lib/page-diag` | 27 | one diag line per kind | `round2` → remeda `round` |
| `shared/lib/use-wheel-scroll` | 22 | wheel binding ref | `useLatest` |
| `shared/lib/use-window-event` | 21 | window listener hook | **pkg** delete for `useEventListener` |
| `shared/lib/throttle` | 18 | time gate | **pkg** delete for remeda `funnel` |
| `shared/lib/clamp-int`, `use-flash`, `dom/on-dom-ready`, `on-distinct`, `enter-key`, `is-record` | 18, 18, 16, 12, 9, 1 | small utilities | stay |
| `entities/replays/lib/filter-replays` | 111 | filter + sort + active count | **pkg** remeda `sortBy` for `compare` |
| `entities/replays/lib/replay-facets`, `replay-summary`, `parse-replays-page` | 67, 36, 51 | facets (remeda already), means, cached zod parse | stay |
| `entities/replays/lib/format-replay` | 23 | counts, durations, dates | **pkg** `lightFormat` (#2) |
| `entities/window-state/lib/components` | 119 | sorting, search, values | **pkg** remeda `sortBy` for `compareTitles` |
| `entities/window-state/lib/apply-feed` | 67 | feed snapshot/delta by id | stays (protocol) |
| `entities/window-state/lib/font-safe-state` | 25 | state walker with kept keys | merge into `font-safe` |
| `entities/window-state/model/*` | 102 + 98 + 59 + 31 + 22 | atoms, undo, feed, scroll | `map` + `setKey` for `$view` |
| `entities/hud-widgets/*/lib/*-view` | 17–158 | data → view models (team HP, marks, logs…) | stay; `sumBy` in `team-hp-view`, shared `signTone` for the tone ladders |
| `entities/hud-widgets/registry/lib/widget-registry` | 69 | widget kind → parser | stays |
| `widgets/hud-overlay/lib/dock`, `label-layout` | 136, 124 | docked columns, label layout | stay; `sumBy` in `liftedTop`; three copies of rect overlap/contains (`dock`, `label-layout`, `hit-panel`, `window-frame/lib/hit`) belong in `hud-geometry` |
| `widgets/hud-overlay/lib/hit-panel` | 35 | top-most hit | remeda `findLast` |
| `widgets/hud-overlay/lib/*` (rest) | 15–54 | drag motion, input area, sizes | stay; `panel-size` → remeda `round` |
| `widgets/hud-overlay/model/hooks/*` | 27–111 | overlay wiring | `use-panel-drag`, `use-wheel-resize` via `useEventListener`; `use-hud-screen`, `use-hovered-panel` via `useInterval` |
| `widgets/window-frame/lib/frame` | 176 | frame clamp/centre/zoom | stays; `toRem` → remeda `round` |
| `widgets/window-frame/model/hooks/use-page-mouse`, `use-viewport` | 54, 47 | document+window mouse, viewport poll | **pkg** `useEventListener`, `useInterval` |
| `widgets/replays-browser/model/hooks/use-virtual-list` | 80 | fixed-row virtual list | stays (§3); `resize` via `useEventListener` |
| `widgets/replays-browser/*` (rest) | 14–64 | view, labels, prompts, options | stay; `ViewStatus`/`BrowserView` dispatch is the ts-pattern candidate (#8) |
| `widgets/component-card/*` | 8–109 | card layout, fields, marks report | stay; `FieldControl` is the ts-pattern candidate; `figure` → remeda `round` |
| `widgets/hud-editor/model/hooks/*` | 82 + 51 | editor stage drag | `createThrottle` → `funnel` |
| `widgets/{profiles,account,header,sidebar,component-list,undo-toast}` hooks | 11–57 | form drafts, nav | stay (one-field drafts; a form library is not worth it, not measured) |
| `app/settings/*` | 21–53 | boot, escape answer | stays |

## 6. Implementation order

1. **Target and guard.** Set `script.target: 'chrome94'` and extend `config/vite/_tests/gameface-bundle.test.ts` to fail on built-ins V8 9.4 lacks (`findLast`, `findLastIndex`, `toSorted`/`toReversed`/`toSpliced`, `structuredClone`, `Intl.`, `fromAsync`, `withResolvers`, `groupBy` as a static). Send a `diag` line once per open with the engine's feature probe (`'at' in []`, `Object.hasOwn`, `typeof Intl`, `'findLast' in []`), so a client patch that changes the engine shows in `python.log`. Rewrite the README's es2017 and "unknown V8" sentences and the rich-text note. Rebuild and commit `packages/ui/gameface`.
2. **`lightFormat`** in `format-replay` (−5.3 KB gz on index).
3. **remeda sweep** (#4): `funnel` for the HUD editor throttle, then `sortBy`, `mapValues` (merging the two font-safe walkers), `round`, `sumBy`, `findLast`. Remove the `createThrottle` line from «Kept on purpose».
4. **`@testing-library/preact`** as a modpack devDependency, then migrate the 38 test files off `shared/lib/testing/{render-hook,mount}`.
5. **reactuse** (#5): add it to the modpack dependencies from the catalog (move it to the root `catalog` if the site's pin differs), then switch `use-window-event` callers, `use-page-mouse`, `use-thumb-drag`, the viewport, screen and hover polls and the latest-refs. Check the listeners in a live client session (the `diag` lines for mousedown, drag, release and wheel already cover it).
6. **`matchAll`** in `rich-text`; `map`/`setKey` for `$view`.
7. Optional: **ts-pattern** on the settings page's union dispatch; a shared `signTone`; one rect-geometry module for the four overlap/contains copies.
8. Fix `mount-once`'s `hasAttribute` along the way (not a package change).

## 7. Method

- Scratch project in the session scratchpad (`uipkg/proj`): each candidate is imported and used the way `ui-web` would. It is bundled by esbuild 0.28.2 (`bundle`, `minify`, `format: 'iife'`, `target: 'es2017'`, `react` aliased to `preact/compat`), gzipped at level 9, and diffed against a Preact baseline (5.5 KB gz) or the current remeda/nanostores set. The output was grepped for `Object.hasOwn`, `.at(`, `structuredClone`, `Intl`, `Proxy`, `WeakRef`, `findLast`, `replaceAll`, `matchAll`, `toSorted`, `queueMicrotask`, `ResizeObserver`, `hasAttribute`, `.matches(` and others.
- Target sizes come from the real Vite build of the tree (`vite build -c ui-web/vite.config.ts --mode production|hud --target es2017|chrome94 --outDir <scratch>`); only the deltas are used, because the tree was being edited.
- Engine facts come from `D:\Games\Tanki\win64\{v8.dll,cohtml.WindowsDesktop.dll}`, `res/packages/gui-part2.pkg` `gui/gameface/js/cohtml.js`, the installed `net.triotmetki.ui_0.6.1.mtmod` and `D:\Games\Tanki\python.log` (2026-09-30).
