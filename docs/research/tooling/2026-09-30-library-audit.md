# Modpack library audit: TypeScript pages and Python (2026-09-30)

Scope: `apps/game/modpack` only: the `ui-web` pages (React 19 after the Preact migration, `chrome94`, one IIFE per page in Gameface) and the Python code (2.7 game packages, Python 3 tooling). The site, server, workspace packages and the Rust manager are audited separately. This is a plan; no code was changed.

It follows [2026-09-30-modpack-ui-packages.md](2026-09-30-modpack-ui-packages.md) (the "UI packages" doc below), which measured the bundle cost of each candidate against the Preact build. The tree was read while the React migration was in progress, so line numbers may shift. Size figures come from the UI packages doc unless a new measurement is given.

## 1. What already changed since the UI packages doc

- The pages run on React 19. `@siberiacancode/reactuse` is declared and used: `useWindowEvent` ×6, `useInterval` ×3. `use-window-event` is gone. `preact/compat` is gone too, so reactuse now costs only its hooks (≈0.5 KB gz, already paid).
- React 19.2 `useEffectEvent` (11 uses) replaces the "latest callback ref" pattern, so reactuse `useLatest` (UI packages doc #5) is no longer needed.
- `script.target` is `chrome94` (UI packages doc #1 is done).
- remeda is used for `clamp`, `isDeepEqual`, `sortBy` (×2), `uniqueBy`, `reverse`, `meanBy`, `groupBy`, `funnel`, `entries` and `countBy`. zod/mini parses the protocol (32 imports). clsx is used in 60 files. nanostores and date-fns are declared.
- Still open from the UI packages doc: `lightFormat`, `createThrottle`, `compareTitles`, `filter-replays` `compare`, `matchesOf`, `round2`/`toRem`, the `reduce` sums, `hit-panel` `reverse().find`, `$view` spreads, and the test harness.
- The Python game code already vendors `six` 1.17.0, `blinker` 1.5, `attrs` 21.4.0 and `enum34` 1.1.10 through `tools/vendor/vendor.py`. The script pins each wheel by sha256, rewrites imports to relative ones, and has a `--check` mode. `attrs` is used in 13 classes, `enum34` in 2 modules, `blinker` in `core/events` and `six` behind `core/compat`.

## 2. TypeScript: `ui-web`, ranked

"Lines" means lines removed, estimated. "Size" is the cost on the page, gzip.

| # | Replacement | Where | Lines | Size | Compat / risk | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | date-fns `format` → **`lightFormat`** | `entities/replays/lib/format-replay/format-replay.ts:1` | 0 (1 changed) | **−5.3 KB gz** on index (drops the en-US locale) | Same package; `marks-report` already uses `lightFormat` | **Replace** |
| 2 | **remeda `funnel`** (`triggerAt: 'both'`, last-value reducer, `flush()` on release) | `shared/lib/throttle` (18 + types), `widgets/hud-editor/model/hooks/use-hud-editor/use-hud-editor.ts:11,18` | ≈25 | +≈0.1 KB gz (already bundled: `funnel` is in use) | Also sends the last position after a pause, which the current gate drops | **Replace**. Remove the `createThrottle` line from "Kept on purpose". |
| 3 | **`@testing-library/react`** 16.3.3 `renderHook`/`render`/`act`/`waitFor` (already a root devDependency) | `shared/lib/testing/render-hook` (45), `shared/lib/testing/mount` (16), and the 38 test files that import them | ≈55 + simpler tests | 0 (never bundled) | Declare it in `@otmetki/modpack` devDependencies from the catalog (move the pin to `catalog`) | **Replace** |
| 4 | **remeda `sortBy`** with key tuples | `entities/window-state/lib/components/components.ts:18` `compareTitles` (script rank, then normalised title); `entities/replays/lib/filter-replays/filter-replays.ts:54` `compare` (nulls last as the first key, `desc` per key) | ≈24 | ≈0 (`sortBy` already bundled) | Stable sort, same order | **Replace** |
| 5 | **reactuse `useDocumentEvent` / `useEventListener` / `useWindowEvent` / `useInterval`** | `widgets/window-frame/model/hooks/use-page-mouse` (6 add/remove pairs → 3 `useDocumentEvent` with `{ capture }` + 3 `useWindowEvent`; the `last === event` guard stays); `shared/lib/use-thumb-drag` (`mousedown` on the thumb via the ref form of `useEventListener`); `widgets/replays-browser/model/hooks/use-virtual-list:55` (`resize`); `widgets/hud-overlay/model/hooks/use-hovered-panel:31` (`setInterval`) | ≈35 | 0 (hooks already bundled) | `useEventListener` takes one event per call. Handlers that call `preventDefault` need `{ passive: false }`. Check drag, release and wheel in a live client (the diag lines cover them). | **Replace** |
| 6 | remeda **`round`, `sumBy`, `findLast`, `mapValues`** | `shared/lib/page-diag:20` `round2`, `widgets/window-frame/lib/frame/frame.ts:102` `toRem`; the sums in `team-hp-view.ts:23`, `dock.ts:54`, `choice-layout.ts:6`; `hit-panel.ts:8,11` (`[...targets].reverse().find`); `font-safe` + `font-safe-state` (two walkers merged into one `mapValues`) | ≈20 | ≈+0.3 KB gz | Use remeda's `findLast`: the native one is behind a flag in V8 9.4 | **Replace** |
| 7 | Native **`String#matchAll`** | `shared/lib/rich-text/rich-text.ts:20` `matchesOf` | ≈10 | 0 | V8 9.4 has it; the `chrome94` target is set | **Replace** (not a package) |
| 8 | nanostores **`map` + `setKey`** | `entities/window-state/model/store/store.ts:25,62`, `model/scroll/scroll.ts:20` | ≈3 | +0.14 KB gz | Same package | **Replace** |
| 9 | **ts-pattern** 5.9.0 `match().exhaustive()` | `widgets/component-card/ui/components/FieldControl/FieldControl.tsx` (the `field.type` if-chain falls through to `TextField` for any new type), `ViewStatus.tsx`, `browser-view.ts`, `use-undo-toast` `describe` | ≈0 | 1.8 KB gz (`match`), 2.8 KB with `P` | ES2017-safe apart from `.at(-1)`, which V8 9.4 has. There is no `switch` statement anywhere in `ui-web`. | **Keep (optional)**. A final `field.type satisfies never` gives the same exhaustiveness for 0 bytes; add ts-pattern only if unions with guards multiply. |
| 10 | remeda `mapValues` / `fromEntries` | `app/dev/mock-bridge/apply-message.ts:44` `reduce` | ≈4 | 0 (dev only) | — | Replace when touched |

### Evaluated and rejected for `ui-web`

| Candidate | Evidence | Verdict |
| --- | --- | --- |
| valibot 1.5.0 / zod/mini | zod/mini already parses every protocol message and widget payload (32 modules). Switching saves a few KB but duplicates the site's zod contracts. | Keep zod/mini |
| clsx / class-variance-authority | clsx is in 60 files. No `styles[variant]` maps exist, so cva has nothing to replace. | clsx stays; cva no |
| `@tanstack/react-virtual` 3.14.13 | Same core as `virtual-core`: 7.2 KB gz, `ResizeObserver`, px vs the rem scale, `scroll` events vs the wheel glide (UI packages doc §3) | Keep `use-virtual-list` |
| `@floating-ui/react` 0.27.20 | Tooltips go through the engine's native tooltip bridge (`use-tooltip`). No custom popover positioning exists; `Confirm` is inline. | No |
| react-aria 3.52 / `@base-ui/react` 1.8 | react-aria's i18n layer needs `Intl`, which Gameface lacks. base-ui brings Floating UI, `ResizeObserver` and focus management that Cohtml has not been verified for. Each costs tens of KB gz for ~6 simple controls (toggle, segmented, input, button). | No |
| react-hook-form 7.89 (≈9 KB gz) / reactuse `useField` | The profile and account drafts are one field each; settings fields apply on change through the bridge, with no submit. | No |
| reactuse `useTimeout` | `use-flash` and `use-undo-toast` restart on a key, not on the delay (UI packages doc §3) | Keep |
| reactuse `useDraggable` / `useHotkeys` / `useKeyPress` | Drag is rem-scaled with snapping and clamping (`hud-geometry`, `gesture`). Keys: same `event.code` doubt as tinykeys. | Keep |
| tinykeys 4.0.1 | "Kept on purpose" `find-key`: unchanged | Keep |
| motion, htmlparser2, fuse.js, uFuzzy | UI packages doc §3: unchanged by React | Keep |

## 3. Python 2.7: the game packages (`packages/`, `features/`)

Constraints: pure Python, a py2.7 wheel on PyPI, vendored through `tools/vendor/vendor.py` (sha256 pin, relative-import rewrite, licence, `--check`). Every vendored library ships in every install and is compiled by the OWG compiler.

Survey of the ≈6,100 lines of runtime code (excluding vendor and tests):

- 182 classes with `__init__`. Only 13 assign nothing but copied arguments. Most are stateful services (`IngestSender`, `Outbox`, `ReplayUploader`, `WindowController`), where attrs would not remove logic.
- There is no `namedtuple` and no hand-written `__eq__`/`__repr__`/`__hash__`. There is no `setdefault(...).append` grouping and no `defaultdict`. There is one hand-rolled signal (`core/events.OrderedSignal`), and it is built on blinker.
- There are 121 `isinstance(x, dict)` checks. They are lenient field-by-field parsers: `core/me/parse.py` turns a bad field into `None` and keeps the row. That is the fair-play, never-crash contract.

| # | Candidate (last py2.7 release) | Where | Lines | Verdict |
| --- | --- | --- | --- | --- |
| P1 | **attrs** 21.4.0 (already vendored) | the pure value holders not yet on attrs: `ui/components/catalog.py:17` `FeatureInfo` (the file already imports attr), `features/replay_manager/model/page.py:97` `PageContext`, `core/moe/targets.py:53` `_Battle`, `core/hud/surface/push.py:4` `FramePush` | ≈12 | **Replace** (0 new bytes) |
| P2 | enum34 1.1.10 (vendored) | Constant groups are already `Enum`s where they are compared (`Outcome`, `JobResult`). The other all-constant classes are attrs specs. | 0 | Nothing left |
| P3 | `schema` 0.7.x / voluptuous 0.11.7 (last py2) | `core/settings.Schema` (86: typed merge, clamp, choices, silently ignore bad keys), `core/me/parse.py` and the payload parsers | + | **Keep**. Both reject a whole document on the first bad value; ours nulls one field. Emulating that takes an `Or(..., Use(lambda _: None))` per field, which is longer. voluptuous's current line needs Python ≥3.9. |
| P4 | toolz 0.10.0 / funcy 1.x (last py2 lines; toolz ≥0.11 and funcy 2.x dropped 2.7) | no `groupby`/`partition`/`pluck`/`memoize` helpers found; one local `compact` (`battle_results/model/page.py:9`, domain-specific) | 0 | **No**. Nothing to replace, and it would be an unmaintained py2 fork in every install. |
| P5 | `typing` 3.10.0.0 backport | Only useful with a type checker; the toolchain runs ruff (py37 target) and vermin, not mypy | 0 | **No** |
| P6 | `singledispatch` (py2 line 3.7.0, needs six) | no type-dispatch chains found | 0 | **No** |
| P7 | `backoff` (py2 releases are decorator/generator based) | `core/net/backoff.backoff_delay` (10 lines, pure, Retry-After aware, used by the outbox and the upload queue) | 0 | **Keep**. The callers schedule retries on the game's ticker, not with `time.sleep`. |
| P8 | six (vendored) | `core/compat` wraps `ensure_*` so it also accepts non-strings; `keyword_options` is in "Kept on purpose" | 0 | Keep |

Summary: the game runtime has no significant custom code left that a py2.7 package would shorten. The vendoring mechanism already exists; adding another library to every player's install is not worth it for the savings found.

## 4. Python 3: host tooling (`tools/`, ≈3,800 lines without tests)

Two runtimes are involved. `tools/build/build.py` and `tools/run_tests.py` run on a bare Python 3 (the release action calls `python tools/build/build.py` before installing uv, and `run_tests.py` also runs on 2.7). `setupkit` and `most` run under `uv run` (release action, CI `uv run --locked pytest`).

| # | Candidate | Where | Lines | Risk | Verdict |
| --- | --- | --- | --- | --- | --- |
| T1 | **jsonschema** (already a dev dependency; Draft 7, as `_support.schema_validator` uses it) plus a new `catalog/catalog.schema.json` | `tools/build/setupkit/manifest/catalog.py` (399): `_Reader.text`/`https`/`sha256`/`size`/`flag`/`required_by`, unknown-field checks, the id, version and package-id patterns | ≈150 (the file-existence, mask, cross-reference and preset checks stay) | `iter_errors` collects every problem, as `CatalogError` does now. Messages become schema paths (`components/3/title/ru`) instead of `components[3].title.ru`. The schema also documents `catalog.json` for the manager and the МОСТ tooling. setupkit tests run through `run_tests.py` on a bare Python would need the same optional-import skip `_support` already uses. | **Replace** (medium safety) |
| T2 | pydantic 2.13 (`alias_generator=to_camel`, frozen models) | `setupkit/manifest/model.py` (195) + `catalog.py` | ≈200 | Adds `pydantic-core`, a compiled wheel. Rewrites the model the manager contract depends on. model.py says "plain dataclasses: bare Python 3". | **No**: T1 gets most of the gain without a new dependency |
| T3 | rich 15 / typer 0.27 | 5 `argparse` CLIs, `print` reports in `most/__main__.py` | ≈10 | `build.py` must stay stdlib-only | **No** |
| T4 | more-itertools 11 / attrs 26 | tooling already uses frozen `dataclasses`; no hand-written chunking or windowing found | 0 | — | **No** |

## 5. "Kept on purpose" changes

- **Remove** `createThrottle` from the `ui-web` entry: remeda `funnel` has `flush()` (#2).
- **Reword** the `rich-text` entry: size is the only reason left (htmlparser2 22.5 KB gz). The `Object.hasOwn` argument is void on V8 9.4. `matchesOf` → `matchAll` (#7).
- **Add** (Python): `core/settings.Schema` and the lenient payload parsers (`core/me/parse.py`, `companion/payload`) over `schema`/voluptuous, because they null a bad field instead of rejecting the document (P3). Add `core/net/backoff` over `backoff` (P7).
- All other entries (`isRecord`, `hud-format`, `smooth-scroll`, `find-key`, `Ticker`, `keyword_options`) are unchanged by the React migration.

## 6. Order

1. `lightFormat` (#1), remeda `funnel` (#2) and `sortBy` (#4). Rebuild both pages and compare sizes.
2. The reactuse event and interval hooks (#5), after the React migration lands. Do a live check in the client.
3. The remeda small functions, `matchAll`, `setKey` (#6–#8).
4. The `@testing-library/react` migration of the 38 test files (#3). It can run in parallel, since it only changes tests.
5. attrs for the four value holders (P1).
6. Optional: the catalog JSON Schema (T1).

## 7. Method

- Imports were counted with grep over `ui-web/src` (tests excluded). The Python class and constant survey used an `ast` walk over `packages/` and `features/`, excluding `vendor` and `tests`.
- Versions were checked on 2026-09-30 with `npm view` and the PyPI JSON API: ts-pattern 5.9.0, `@floating-ui/react` 0.27.20, `@tanstack/react-virtual` 3.14.13, reactuse 1.0.17, react-aria 3.52.1, base-ui 1.8.0, tinykeys 4.0.1, valibot 1.5.0, react-hook-form 7.89.0. On PyPI, toolz 1.1.0, voluptuous 0.16.0 and singledispatch 4.1.2 need Python ≥3.9. `typing` 3.10.0.0 is the last backport, from 2021. attrs 26.1, pydantic 2.13.5, more-itertools 11.1, rich 15 and typer 0.27 need Python ≥3.9 or ≥3.10.
- The reactuse API was read from its 1.0.17 `.d.ts` files: `useEventListener(target, event, listener, options)` takes one event per call; `useDocumentEvent` and `useWindowEvent` are wrappers.
- No new bundle measurements were made; the size figures come from the UI packages doc §7, and the reactuse figure there excluded `preact/compat`.
