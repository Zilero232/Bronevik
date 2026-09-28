# Plus: free tiers and monthly meters — decision

Date: 2026-09-28. Status: infrastructure and two meters implemented (§6); the rest of §3 are proposals waiting for the owner (§8).

Related: [2026-09-26-plus-subscription.md](2026-09-26-plus-subscription.md) (the one-subscription model this refines), [../research/data/lesta-api.md](../research/data/lesta-api.md) (the terms), [../product/features.md](../product/features.md).

## 0. Decision

The owner asked to make the free tier leaner and to charge for heavy features, for example 3D armor at 10–20 views a month without Plus. The model stays **one Dota-Plus-like subscription «Плюс»**, no ads, no other paid products. What changes:

1. **Meters instead of walls.** A heavy feature is free up to a **monthly allowance per account**, anonymous visitors get a smaller allowance (or must sign in), Plus is unlimited. A meter shows the feature working first and asks for money only once the visitor has used it: that converts better than a teaser, and it keeps a sample of the paid depth in front of every free user.
2. **SEO surface stays free and unmetered.** Player, tank, clan pages, basic stats, marks thresholds, news, tree, leaderboards and the armor thicknesses as text are the growth engine and a Lesta condition. Nothing that a crawler indexes is metered; the metered part is always the interactive or compute-heavy layer on top.
3. **Plus = depth, history, convenience, live tools, heavy compute, unlimited use** — exactly as the 2026-09-26 spec says; meters add "unlimited use" as the fifth lever.

## 1. Audit: every gate as of 2026-09-28 (before this change)

Sources: `packages/schemas/src/plus` (`PLUS_FEATURES`, `PLUS_LIMITS`, `PLUS_TRIAL`, `PLUS.checkoutEnabled = false`), `apps/web/server/src/modules/billing` (`EntitlementsService`, `@RequiresPlus` + `PlusGuard`), every call of `isPlus` / `assertFeature` / `assertWithinLimit` / `limit` on the server, `features/plus/plus-gate` on the client. The **modpack and the manager have no Plus flags at all**: the mod reads only its own data through `/mod/me/*`, which is free.

### 1.1 Hard gates (`@RequiresPlus` / `assertFeature`)

| Feature | Endpoint / code | Anonymous | Free account | Plus |
|---|---|---|---|---|
| Personal analytics overview and per-tank | `GET me/analytics/overview`, `tanks/:tankId` (`analytics`) | — | teaser | yes |
| Map advisor, platoon chemistry | `me/analytics/maps`, `platoons` (`mapAdvisor`) | — | teaser | yes |
| Personal honest-RNG | `me/analytics/rng` (`battleAnalysis`) | — | teaser | yes |
| Detailed battle analysis | `me/analytics/battles/:id/analysis` (`battleAnalysis`) | — | teaser | yes |
| Own economy, own learning curve | `tanks/economy/me`, `tanks/:id/learning-curve/me` (`analytics`) | — | teaser | yes |
| Recommended-build history | `builds/:id/recommended-build/history` (`analytics`) | — | teaser | yes |
| Own per-mode stats | `modes/me` (`analytics`) | — | teaser | yes |
| Missions plan | `me/missions/plan` (`progression`) | — | teaser | yes |
| Tank challenges | `me/progression/challenges` (`progression`) | — | teaser | yes |
| Analytics export (derived data) | `me/export/analytics` (`analyticsExport`) | — | teaser (raw export free) | yes |
| Supertest «my tanks» | `supertest/mine` (`supertest`) | — | teaser | yes |
| Private competitions | `CompetitionService` (`privateCompetitions`) | — | public only | yes |
| Streamer go-live alerts | `StreamerFollowService` (`streamerAlerts`) | — | follow without alerts | yes |
| Hourly watchlist digest | `WatchlistService` (`priorityPolling`) | — | daily/weekly | yes |
| Plus cosmetics, premium overlay themes | `CosmeticsService` (`cosmetics`, `overlays`) | — | standard | yes |

### 1.2 Soft gates (numbers)

| Limit | Anonymous | Free | Plus | Where enforced |
|---|---|---|---|---|
| Linked Lesta accounts | — | 2 | 10 | `LestaAccountsService` |
| Active goals | — | 3 | 10 | `GoalsService` |
| Watched tanks (threshold drops) | — | 10 | 300 | `FollowService` |
| Watched players | — | 10 | 100 | `WatchlistService` |
| OBS overlays | — | 2 (rest paused) | 20 | `OverlayService`, `overlay-pause` |
| Stored replays | — | 50 | 1 000 | `ReplayUploadService` |
| Streamer follows | — | 3 | 200 | `StreamerFollowService` |
| History charts | 90 days | 90 days | whole window (730 d), own linked account only | `PlayerHistoryService.policyFor` |
| Evening playlist size | — | `PLAYLIST.freeSize` | `plusSize` | `PlaylistService` |
| Collection cadence | — | 15 min | 5 min | collector tracking |
| Developer API | — | 10 000/day, 5 rps, 1 webhook | 50 000/day, 10 rps, 5 webhooks | `API_TIER_LIMITS`, `ApiTierService` |
| Discord WN8-tier roles, weekly officer report | — | off | on (binder's Plus) | `discord-*` services |
| Shop «return» alerts | — | off | on | `OfferScrapeService` |
| Tank XP / levels, «Гильзы», seasons | view | view, no XP | earn | `progression` |
| AI reviews | — | 1/week (declared, **no AI coach yet**) | 5/day | `PLUS_LIMITS.aiReviews` only |

### 1.3 Free and ungated for everyone (incl. anonymous)

Search, player pages (summary, ratings, recent periods, tanks, achievements, nickname history, career, sessions), clan pages, tank pages and `/vehicles`, marks tables and threshold history, tree, maps, leaderboards, pulse, news, shop archive, events, guides, tactics, compare (up to 6 players / 6 tanks), build calculator, tank math, **3D armor viewer (unlimited, publicly cached)**, replays (browse), best battles, the mod (`/mod/me/*`), Telegram/VK/Discord bot commands.

### 1.4 Pricing, waitlist, legal

- `PLUS_PLANS`: 199 ₽/month, 529 ₽/quarter, 1 990 ₽/year; trial 7 days (14 with a referral), once per user and per Lesta account.
- `PLUS.checkoutEnabled = false` until the Lesta reply; the Plus page offers the trial, promo codes and the «узнать об открытии оплаты» waitlist (`plusCheckoutOpen` broadcast in `notifications`).
- `/terms` («Подписка «Плюс»») did not list features — it points to the Plus page. `/privacy` listed only the session cookie.
- `/plus` featured: priority polling, overlays, progression, private competitions, analytics export, supertest mine, cosmetics; the limits table rendered `PLUS_LIMITS`.

## 2. Principles for the redesign

1. **Indexable = free.** Anything a crawler reads (SSR HTML, metadata, sitemaps) is never metered. Meters sit only on client-side fetches of heavy data or on `/me/*`.
2. **Metered by distinct subject.** One "use" is one distinct thing (a tank, a battle), not a request: reloading, rotating the model or coming back the same day never costs another use.
3. **Anonymous sees it work, then signs in.** Anonymous allowances are small, so signing in (free) is the first conversion; Plus is the second.
4. **Server is authoritative.** The client only displays the counter; the endpoint that returns the heavy payload consumes the meter, so the quota cannot be bypassed by the client.
5. **Never gate what Lesta requires free, never pay-to-win.** Raw Lesta data, core stats and anything in battle stay free; the mod keeps no Plus features in battle (fair-play rules unchanged). Plus sells our compute, our storage and convenience.
6. **Own data only.** Deep analytics stay about the subscriber's own accounts.

## 3. The matrix after the change

Legend: **✔ implemented now**, **→ proposed** (follow-up, needs the owner's yes where marked in §8).

### 3.1 Meters (per calendar month, Moscow time)

| Feature | Anonymous | Free account | Plus | Unit | Status |
|---|---|---|---|---|---|
| **3D armor viewer** | 3 per device cookie, and at most 9 per network (IP) | **15** | unlimited | a distinct tank; the same tank again within 24 h is free | ✔ |
| **Detailed battle analysis** (was Plus-only) | — (sign in) | **3** | unlimited | a distinct battle | ✔ |
| Personal honest-RNG | — | 1 view / month | unlimited | a month | → |
| Map advisor | — | 1 map / month | unlimited | a distinct map | → |
| Compare players/tanks **beyond 2 items** (2 stays free and indexable) | 5 | 30 | unlimited | a distinct comparison set | → |
| Replay parse of uploads | 0 (sign in) | 20 | 300 | an uploaded replay | → (storage cap stays 50/1 000) |
| AI coach (when built) | — | 2 | 5/day fair use | a review | → replaces `PLUS_LIMITS.aiReviews` |
| Recommended-build history | — | 3 tanks | unlimited | a distinct tank | → |

### 3.2 Numbers (capacity) — proposed changes

| Limit | Free now → proposed | Plus | Why |
|---|---|---|---|
| Watched tanks | 10 → **5** | 300 | Alerts cost polling; 5 covers the marks you are grinding |
| Watched players | 10 → **5** | 100 | Same |
| Goals | 3 → 3 | 10 | Keep |
| Streamer follows | 3 → 3 | 200 | Keep |
| Stored replays | 50 → **25** (new uploads only; existing kept read-only per §4.5 of the Plus spec) | 1 000 | Storage cost. **Do not lower before the overflow job is changed**: `REPLAY_OVERFLOW.keep` reads the same number and would delete more |
| History charts, own account | 90 days | whole window | Keep 90 d: public charts are SEO and the history window is the Lesta question (Plus spec §3.2 note) |
| API keys | 10 000/day, 5 rps → **5 000/day**, 5 rps | 50 000, 10 rps | Personal use is far below 5 000; community apps get `community` for free |
| Overlays | 2 → 2 | 20 | Keep: streamers are the marketing channel |
| Mod features that call the server | free | free | Own data, fair play; hangar extras (briefing, playlist in hangar) will be Plus when built |

### 3.3 Stays free for everyone (SEO and Lesta)

Player, clan and tank pages with basic stats and recent periods; marks tables, thresholds and threshold history; mastery thresholds; news; tech tree; leaderboards; maps; encyclopedia specs **including armor thicknesses as text** on the tank page (and the new intro on `/t/:slug/armor`); pulse; events; shop archive; guides; tactics; compare of 2 items; build calculator; tank math; replay browsing; raw data export; the mod's in-battle features; bot commands.

## 4. Conversion touchpoints

- **Armor page**: a status line «3D-просмотров осталось: N из M. Лимит обновится 1 октября» with a link — anonymous: «Войдите — будет 15 в месяц»; free: «Без лимита с Плюсом». When exhausted: a limit screen (title, audience-specific text, then the stock `PlusTeaser` with `feature: 'armor3d'`, which already switches between «Войти», «Попробовать 7 дней», «Оформить Плюс» and the promo/waitlist while checkout is off).
- **Battle analysis**: free users get the real analysis 3 times a month; the 4th shows the existing `battleAnalysis` teaser in place.
- **/plus**: «3D-броня без лимита» is the first featured card; the limits table gets month rows for every meter plus a note on the Moscow reset and the anonymous allowance.
- Next (→): an e-mail/Telegram nudge when a free user hits a meter for the second month in a row; a meter summary on `/me/billing`.

## 5. Edge cases

| Case | Behaviour |
|---|---|
| Reset | Calendar month in **Europe/Moscow** (`TIME.zone`): `usagePeriod(now)` names the month `yyyy-MM` and resets at 00:00 MSK on the 1st. Counter keys expire a day after the reset. |
| Same subject again | A `seen` key per (meter, month, owner, subject) with a 24 h TTL: reopening within a day is free; after a day it counts again. The key includes the month, so a new month counts the first open again. |
| Allowance used up | Tanks already opened within the last 24 h still open; a new one is refused with `403 SUBSCRIPTION_REQUIRED` and `details: { feature, limit }`. A refused open is rolled back and never spends the allowance. |
| Trial | `trial` is a Plus state (`isPlusState`): unlimited while it lasts. |
| Downgrade / expiry | The audience is read per request from `EntitlementsService` (60 s cache): the free allowance applies immediately; uses during Plus were never counted, so the free month starts at 0. |
| Upgrade mid-month | Unlimited at once; the counter stays and is irrelevant. |
| Grace (`pastDue`) | Plus. |
| Anonymous → signs in | The account starts with its own counter (the device's is not merged: signing in is the conversion we want). |
| Multiple accounts | Each account has its allowance. It costs a Lesta ID per account, the trial is once per Lesta account, and 15 tank views gain little; the IP scope applies only to anonymous visitors so that shared/CGNAT networks do not block signed-in users. Revisit if abuse shows up in the counters. |
| Cookies refused / cleared | The server issues a signed `otmetki_device` cookie (httpOnly, SameSite=Lax, 400 days, HMAC with `BETTER_AUTH_SECRET`); without it the visitor is still counted by a hashed IP with 3× the device allowance. A forged cookie fails the HMAC and is replaced. |
| Crawlers | Never metered and never shown a limit screen: the page's metadata, heading, intro and attribution are SSR; the client skips the 3D fetch when `isbot(navigator.userAgent)` matches. A UA spoofing a bot gains nothing: the server meters every request by identity, not by UA. |
| Redis down | Fails open (logs a warning, lets the open through), like the public API rate limiter. |
| Shared caches | The armor response is `Cache-Control: private, max-age=3600` (was `public`), and the API-side `CacheInterceptor` no longer wraps it (it would have skipped the meter); the geometry is kept in a small in-process LRU instead. |
| Privacy | IPs are stored only as an HMAC prefix inside Redis keys that expire; the device id is random. `/privacy` now mentions the technical device cookie. No new database table, so no retention rule is needed. |

## 6. What is implemented

**Shared contract** — `packages/schemas/src/usage/`: `USAGE_METERS` (the one constants object: `armor3d` 3/15/∞, `battleAnalysis` 0/3/∞), `USAGE_METER_KEYS`, `usageLimit`, `usageSchema` (`{ audience, resetsAt, meters[] }`). `PLUS_FEATURES` gains `armor3d`.

**Server** — new module `apps/web/server/src/modules/usage/`:

- `UsageMeterService.consume({ meter, actor, subject })` — Plus bypass, `SET NX EX` for the per-subject dedupe, `INCR` + `EXPIREAT` per scope in one `MULTI`, rollback and `403 SUBSCRIPTION_REQUIRED` over the limit, fail-open on a Redis error; `usage(actor)` for the snapshot. Redis counters rather than a Prisma table: the counters are short-lived, self-expiring and hot, and a table would need a retention rule and a write per open. `rate-limiter-flexible` (already used by the public API) was considered and not used: its windows start at the first hit, while these reset on the Moscow calendar month and need a per-subject dedupe.
- `lib/usage-period` (Moscow month and reset), `lib/meter-scopes` (user scope, or device + IP scopes for anonymous; key builders; state), `lib/device-token` (sign/verify the device cookie, hash the IP).
- `UsageActorGuard` + `@MeteredUsage()` + `@CurrentUsageActor()` — resolves `{ userId, deviceId, ipHash }` and issues the cookie.
- `GET /me/usage` (`@AllowAnonymous`, `no-store`) → `usageSchema`.
- Armor: the route moved to `tanks/tank-armor.controller.ts` (no `CacheInterceptor`); `TankArmorService.open` resolves the tank, loads the model (404 never spends a view), consumes `armor3d` with the numeric tank id as the subject, returns the model.
- Battle analysis: `@RequiresPlus('battleAnalysis')` removed from `me/analytics/battles/:id/analysis`; `BattleReviewService.analysis` consumes `battleAnalysis` after the analysis is built. `me/analytics/rng` stays Plus-only.

**Client**

- `entities/plus/usage` — `useUsageMeter({ meter, enabled })` over `GET /me/usage` (`QUERY_KEYS.me.usage`, credentials on).
- `shared/lib/use-is-crawler` (`isbot`), `entities/armor/armor-model`: `useArmorModel({ idOrSlug, enabled })`, credentials on, no retries on 403/404.
- `views/tank-armor`: `useTankArmorPage` (armor first, then the usage snapshot, so the counter reflects the open), `ArmorIntro` (SSR text with a link to the tank file), `ArmorQuota`, `ArmorLimit` (reuses `PlusTeaser`).
- `views/my-battle`: the analysis panel is no longer wrapped in `PlusGate`; the server decides.
- `/plus`: `armor3d` benefit card, month rows for every meter and the reset note in the limits table, FAQ «Что остаётся бесплатным?»; `plus.gate.armor3d`; `/terms` Plus section mentions monthly allowances and the Moscow reset; `/privacy` mentions the device cookie. ru + en.
- Internal OpenAPI spec and the generated client were regenerated (`bun run api:generate`).

**Tests** — `usage-period`, `device-token`, `meter-scopes`, `UsageMeterService` (limits, 24 h dedupe, re-open after exhaustion, no spend on refusal, Moscow reset, Plus bypass, anonymous device and IP scopes, fail-open), `TankArmorService.open`, an HTTP suite for `GET /tanks/:idOrSlug/armor` (cookie issue, forged cookie, anonymous/free/Plus through the real guard and meter), `BattleReviewService.analysis` metering, `useUsageMeter`, `useIsCrawler`, `usageLimit`.

## 7. Follow-ups

1. The → rows of §3.1: honest-RNG, map advisor, compare >2, replay parse, AI coach, build history — each is one `consume` call in its service plus a `USAGE_METERS` entry; the client gets `useUsageMeter` and the existing teaser.
2. The §3.2 number changes once approved; the replay overflow job first (`REPLAY_OVERFLOW.keep` must not drop with the free limit).
3. A remaining-counter line on the battle page (`useUsageMeter({ meter: 'battleAnalysis' })`), and a meters block on `/me/billing`.
4. Server-render the armor plate summary (hull/turret front, side, rear) as text on `/t/:slug/armor`, so the page carries its own indexable content even when the viewer is not loaded.
5. Metrics: count `consume` refusals per meter and audience (Prometheus via `MetricsService` or the pino log) to tune the numbers.
6. Mention the new meters in the Lesta letter (WP0 of the Plus spec): 3D armor geometry is from the game client (unicum-gg mirror), not the Lesta API, and the text specs stay free.
7. `docs/product/features.md` §19 — add the meters once the owner confirms §8.

## 8. Needs the owner's decision

1. **Numbers**: armor 3 anonymous / 15 free (implemented); battle analysis 3 free (implemented — this *loosens* a Plus-only wall into a taste; say if it should stay Plus-only).
2. The §3.2 cuts (watched tanks and players 10 → 5, stored replays 50 → 25, API 10 000 → 5 000/day).
3. Whether compare beyond 2 items should be metered at all (it is indexable today only for pairs).
4. Whether the history window for one's own account should drop below 90 days (recommendation: no, see §3.2).
