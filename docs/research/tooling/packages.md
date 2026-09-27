# Ready-made packages: research (September 2026)

Rule: use a maintained package first and write custom code only when nothing fits. Versions, release dates and weekly downloads were checked on the npm registry, GitHub API and crates.io on 2026-09-24. "dl/wk" means weekly npm downloads.

## 1. Replay parsing (.mtreplay / .wotreplay)

| Option | Lang / licence | Activity | Fit |
|---|---|---|---|
| [uwuny/mtreplay-analyzer](https://github.com/uwuny/mtreplay-analyzer) | JS (in-browser) / **AGPL-3.0** | pushed 2026-09-13, 0 stars | The only parser we found that decodes Lesta `.mtreplay` in full: movement map, 3D hits, stats. **AGPL:** if we copy its code into a server, AGPL's network clause means we must publish the source of the whole service. Use it only to confirm our output, not as code. |
| [rajesh-rahul/wot-battle-results-parser](https://github.com/rajesh-rahul/wot-battle-results-parser) (crate `wot_replay_parser`) | Rust / MIT | repo pushed 2025-09; crate 0.2.2 (2022) | Best permissive base. Reads `.def` files per client version and decodes position, avatar and chat packets for WoT 0.9.12–1.26.1. It has no Lesta support. |
| [evido/wotreplay-parser](https://github.com/evido/wotreplay-parser) | C++ / BSD-3 | pushed 2026-06, 124 stars | Decodes packets and draws heatmaps and images. Old codebase, useful as a reference. |
| kosh04/wotreplay (Go), Phalynx/WoT-Replay-To-JSON (Py, GPL, 2015) | – | stale | Skip. |

**Recommendation:** build a separate **Rust service, forked from `wot_replay_parser` (MIT)**. Feed it Lesta `.def` entity definitions from the `RU` branch of `unicum-gg/wot.src` or `izeberg/wot-src` (see §2). The NestJS side sends jobs to it over BullMQ, or calls it over HTTP or gRPC. For the P1 MVP, parse only the plain JSON header blocks (battle results) in TypeScript inside the worker. Clean-room rule: nobody who works on our parser should copy AGPL code.

## 2. Client data mining (specs, equipment, crew, field mods, maps, minimaps)

| Option | Licence | Activity | Fit |
|---|---|---|---|
| [unicum-gg/wot.build](https://github.com/unicum-gg/wot.build) + mirrors [wot.src](https://github.com/unicum-gg/wot.src) (branches `RU`, `PT_RU`), [wot.maps](https://github.com/unicum-gg/wot.maps) / [wot.assets](https://github.com/unicum-gg/wot.assets) / [wot.models](https://github.com/unicum-gg/wot.models) (branches `Lesta`, `Lesta_PT`) | no licence file; the assets belong to Lesta | all pushed 2026-09-24 | **Exact fit.** Pulls straight from the Lesta update CDN with no client installed. Converts packed XML to text and decompiles `.pyc`. Minimaps are exported as HD WebP (DDS decoded) together with marker atlases. Armor comes out as named plates from Havok collision data, and models as glTF. Also writes `vehicles.json` indexes. It is TypeScript, so it fits our stack. |
| [izeberg/wot-src](https://github.com/izeberg/wot-src) | none | bot-updated, pushed 2026-09-24, branches incl. `RU` | Backup source for XML and scripts. |
| StranikS-Scan/WorldOfTanks-Decompiled | none | WG only (up to 1.18.1) | Skip for Lesta. |
| Mikeyzy/WoT_ModDevTools (`clientUnpacker.py`) | GPL-2.0 | 2025-04 | Only if we unpack a local client ourselves. |

**Recommendation:** run a scheduled `files-ingest` job that shallow-clones the `RU` branch of `wot.src` and the `Lesta` branch of `wot.maps`/`wot.models`. It parses the XML with `fast-xml-parser` and writes versioned snapshots into Postgres, so patch diffs become the "buffed / nerfed" feature. If the mirrors go stale, vendor or fork `wot.build`: there is no licence file, so ask the author first. Minimaps come from `wot.maps`. The 3D armor viewer reads glTF from `wot.models`.

## 3. WN8 expected values and MoE thresholds (verified)

| Data | URL | Notes |
|---|---|---|
| WN8 exp, **Lesta** | `https://static.modxvm.com/wn8-data-exp/json/lesta/wn8exp.json` | HTTP 200, 972 vehicles, `header.version` 2026-09-23, updated daily (Last-Modified 2026-09-24). Also available as a dated file: `.../lesta/wn8exp-YYYY-MM-DD.json`. Fields: `IDNum, expDef, expFrag, expSpot, expDamage, expWinRate`. |
| WN8 exp, WG | `https://static.modxvm.com/wn8-data-exp/json/wn8exp.json` | For comparison only. `/ru/` returns 404. |
| MoE (gun marks) | `https://poliroid.me/gunmarks/api/ru/vehicles` (optionally `/65,85,95`) | Undocumented JSON used by the poliroid site: `{status, meta:{count:800}, data:[{id, marks:{65,85,95}}]}`. Realm `ru` = Lesta. Undocumented, so **ask Poliroid for permission**, cache daily and credit the source. |
| Fallback | our own DB | Once we have enough samples, compute MoE and expected values ourselves (we already need them for cohort analytics). |

## 4. NestJS integrations

| Need | Package | Version / date | dl/wk | Note |
|---|---|---|---|---|
| Queues | `@nestjs/bullmq` + `bullmq` | 12.0.0 (08-27) / 6.3.8 (09-18) | 1.3M | Standard choice. |
| Queue UI | `@bull-board/nestjs` + `@bull-board/api` | 9.10.1 (09-12) | 285k | Mount behind admin auth. |
| Cron | BullMQ `upsertJobScheduler` (primary); `@nestjs/schedule` 12.0.2 | 09-14 | 3.4M | Use BullMQ schedulers for distributed jobs. `@nestjs/schedule` only for per-instance tasks. |
| OpenAPI → SDK | `@nestjs/swagger` → **`@hey-api/openapi-ts`** 0.99.0 (06-22, 3.4M) | alt: `orval` 8.37 (1.6M, generates TanStack Query hooks), `openapi-typescript` 7.13 + `openapi-fetch` | – | hey-api for the public SDK; orval if we want generated React Query hooks. |
| API keys + metering | **`@better-auth/api-key`** 1.7.5 | 09-14 | – | Per-key rate limit and remaining count. Log usage into a Timescale hypertable. `@unkey/api` if we ever outsource this. |
| Rate limit | `@nestjs/throttler` 6.7.1 + `@nest-lab/throttler-storage-redis` 1.2.0 | 09-24 / 02-03 | 381k | Redis storage shared across instances. |
| Webhooks out | `standardwebhooks` 1.1.1 (signing) + BullMQ retries | 08-28 | – | Enough for us. Svix (`svix` 2.5.0, server MIT) only if volume grows. |
| Lesta ID login | **custom better-auth plugin** | – | – | Lesta `auth/login` redirects back with `access_token, account_id, nickname, expires_at` in the query string. There is no `code`, so the `genericOAuth` callback, which expects a code exchange, does not fit cleanly. Write a small plugin with `createAuthEndpoint` (`/lesta/start`, `/lesta/callback`) that checks the token server-side (`account/info` with `access_token`, or `auth/prolongate`), then calls `internalAdapter` to create or link the account and sets the session cookie. SIWE is a similar existing plugin to use as a model. |
| Telegram login | `better-auth-telegram` 2.0.1 (07-29, 1.5k) | peer `better-auth >=1.6.22 <1.7.0` | – | **Does not support better-auth 1.7 yet.** Pin better-auth 1.6.x, wait for an update, or write about 100 lines ourselves (HMAC check of Login Widget / initData). |

## 5. Frontend

| Need | Pick | Version / date, dl/wk | Notes |
|---|---|---|---|
| Command palette | `cmdk` | 1.1.1 (2025-03), 33M | Stable; supports React 19. |
| Charts | **`@visx/*`** | 4.0.0 (2026-06), 354k | Low-level building blocks plus `motion` give the custom animated look we want. `recharts` 3.10 (42M) for quick admin charts. |
| Tables | `@tanstack/react-table` 9.2.4 + `@tanstack/react-virtual` 3.14.13 | 15M | v9 is new, so check migration notes. |
| OG images | `next/og` (built-in; `@vercel/og`/`satori` 0.33.5, MPL-2.0) | 09-22 | MPL-2.0 is fine to use unmodified. |
| Tactics board | **`react-konva`** 19.3 + `konva` 10.7 + **`yjs`** 13.6 (+ `y-websocket`/Hocuspocus) | 1.5M / 6M | **tldraw 5.4 needs a licence key in production** (commercial or approved hobby licence). `@excalidraw/excalidraw` 0.18.1 (MIT) is an alternative if a free-hand whiteboard is enough. Liveblocks (Apache client, paid SaaS) is optional. |
| 2D replay player | `pixi.js` 8.21 (803k) | 09-17 | WebGL handles thousands of sprites. `@pixi/react` 8.0.5 is optional. |
| 3D armor | `three` 0.186 + `@react-three/fiber` 9.8 + `@react-three/drei` 10.7 | 4M | Loads glTF from `wot.models`. |
| Tech tree | `@xyflow/react` 12.12 (8.2M) + `@dagrejs/dagre` 3.1 (MIT) | 09-24 | Or `elkjs` 0.12 (EPL-2.0/GPL, fine unmodified) for better layered layout. |
| Animated numbers | `@number-flow/react` 0.6.2 (1.2M) + `motion` 13.4 | 07-18 | – |
| Confetti | `canvas-confetti` 1.9.4 (ISC, 6M) | 2025-10 | – |
| Telegram Mini App | **`@tma.js/sdk-react`** 3.0.23 | 07-14 | The `@telegram-apps/*` packages were renamed to `@tma.js/*`; the old package's last release was 2025-10. |
| PWA | `serwist` 9.5.12 + **`@serwist/turbopack`** (Next 16 builds with Turbopack by default) or `@serwist/next` (webpack) | 07-22 | – |

## 6. Bots and streaming

| Platform | Pick | Version / date, dl/wk | Notes |
|---|---|---|---|
| Telegram | `grammy` 1.46 (3.8M) + `@grammyjs/menu` 1.5, `@grammyjs/conversations` 2.1.1, `@grammyjs/runner`, `@grammyjs/auto-retry`, `@grammyjs/i18n` 1.1.2 (2024, Fluent) | 08-26 | For inline mode, grammY core `bot.inlineQuery` is enough. |
| Discord | `discord.js` 14.27 (Apache-2.0) | 07-15 | – |
| VK | `vk-io` 4.10.1 | 2025-10, 3k | De-facto standard; slow but alive. |
| Twitch | **`@twurple/chat` + `@twurple/api`/`easy-bot`** 8.2.0 | 09-13, 754k | `tmi.js` is dead (last release 2021). |
| VK Video Live (ex-VK Play Live) | Official **DevAPI** (opened 2025-03). Chat: `vklive-message-client` 5.3.2 (MIT, 2025-02) | – | Use DevAPI OAuth for anything official. |
| DonationAlerts | `@donation-alerts/api` + `/events` + `/auth` 4.0.0 (MIT, 2025-03) | small but complete | Handles OAuth and Centrifugo subscriptions for you. Uses the `centrifuge` 5.7 client underneath. |
| YouTube live chat | `youtubei.js` 18.1 (130k, active) or the official Data API `liveChatMessages` (quota-heavy) | 09-22 | YouTube is throttled in Russia, so treat it as a low priority. |

## 7. Payments (YooKassa)

There is **no official Node SDK** (`@yookassa/sdk` 0.0.3 is a third-party placeholder with 36 dl/wk). Community options: `yookassa-sdk-node` 0.7.0 (2026-08, TS), `@appigram/yookassa-node` 1.1.13 (2026-06), `nestjs-yookassa` 2.3.6 (2026-02, Nest 11 peer). `@a2seven/yoo-checkout` has had no release since 2022. **Recommendation:** YooKassa API v3 is small (payments, refunds, receipts, webhooks), so either write a thin typed `fetch` client or use `nestjs-yookassa`. Check webhook source IPs against the YooKassa list and always re-fetch the payment before trusting its status.

## 8. Scraping (shop, news, bonus codes)

| Need | Pick | Notes |
|---|---|---|
| News | **RSS: `https://tanki.su/ru/rss/news/`** (verified, RSS 2.0) + `rss-parser` 3.13 (2023, stable) or `fast-xml-parser` | No scraping needed. |
| Static pages | `cheerio` 1.2.0 (2026-01) + `fetch` | Shop and bonus-code pages. |
| JS-rendered / crawl queues | `crawlee` 3.18.1 + `playwright` 1.63 | Run these in a **Node** worker container; Playwright and Crawlee support on Bun is not guaranteed. |

## Recommended stack

- **Replays:** Rust service forked from `wot_replay_parser` (MIT) with Lesta `.def` files; MVP parses the JSON header in TypeScript. Treat mtreplay-analyzer (AGPL) as a reference only.
- **Game data:** `unicum-gg/wot.src` (`RU`), plus `wot.maps` / `wot.models` (`Lesta`), ingested with `fast-xml-parser`.
- **Ratings:** modxvm Lesta `wn8exp.json` (daily); poliroid gunmarks API (after permission); later our own values.
- **Backend:** `@nestjs/bullmq`, `@bull-board/nestjs`, BullMQ job schedulers, `@nestjs/throttler` + `@nest-lab/throttler-storage-redis`, `@nestjs/swagger` → `@hey-api/openapi-ts`, `@better-auth/api-key`, `standardwebhooks`.
- **Auth:** custom better-auth plugin for Lesta ID. Telegram via `better-auth-telegram` once it supports 1.7, otherwise our own HMAC check.
- **Frontend:** `cmdk`, `@visx/*` + `motion`, `@tanstack/react-table` + `react-virtual`, `next/og`, `react-konva` + `yjs`, `pixi.js`, `three` + R3F + drei, `@xyflow/react` + dagre/elkjs, `@number-flow/react`, `canvas-confetti`, `@tma.js/sdk-react`, `@serwist/turbopack`.
- **Bots:** `grammy` + plugins, `discord.js`, `vk-io`, `@twurple/*`, VK Video Live DevAPI, `@donation-alerts/*`, `youtubei.js`.
- **Payments:** thin YooKassa v3 client or `nestjs-yookassa`.
- **Scraping:** tanki.su RSS, `cheerio`, and `crawlee` + `playwright` in a Node container.
