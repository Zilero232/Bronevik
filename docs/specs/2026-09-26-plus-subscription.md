# Plus subscription — design spec

Date: 2026-09-26. Status: approved; WP1–WP7 and WP9 implemented. Pending: WP0 (the Lesta letter) and WP8 (new Plus features). See §8.

Related: [2026-09-24-otmetki-design.md](2026-09-24-otmetki-design.md), [../product/features.md](../product/features.md) (§15, §18, §19 were updated to follow this spec), [../research/data/lesta-api.md](../research/data/lesta-api.md), [../research/competitors/market.md](../research/competitors/market.md).

## 0. Decision

The product has **exactly one paid thing: the Plus subscription**, modelled on Dota Plus. Nothing else takes money:

- no paid developer-API tiers;
- no payments for coaching through our site;
- no one-off purchases, no gifts, no donations flow, no clan tiers, no separate "overlays Pro";
- no purchasable currency (the Plus reward currency is earned only).

Money from viewers to streamers (DonationAlerts in `streamers`) is not our revenue and stays as is: it never touches our payment account.

## 1. Research: what Plus-style subscriptions sell

Sources: prior knowledge of these products, **not re-verified today**. Prices are indicative only.

| Product | What the subscription gives | Lesson for us |
|---|---|---|
| **Dota Plus** (Valve, ~$4/mo, cheaper per month for 6/12 months) | Hero levels and per-hero challenges; Shards currency earned by playing, spent on cosmetics; guides and item/skill build suggestions from match data (Plus Assistant); post-game analysis and match insights (lane result, compare to similar-rank players); relics/trackers (stat counters on heroes); seasonal rewards and terrains; one-time hero-level badges | Progression + depth for **your own** games + cosmetics. Basic stats stay free in the client |
| **tomato.gg** (Patreon tiers) | Ad-free, supporter badge, early/extra features | Ad-free is the headline — we cannot sell that (we have no ads at all) |
| **Dotabuff Plus** | Ad-free, deep filters on your own matches, match analysis, badge | Depth on your own data |
| **OP.GG / Mobalytics Plus / Blitz Pro** | Ad-free, premium overlays, advanced personal analytics, AI-ish coaching tips, cosmetics in the app | Overlays + personal analytics + cosmetics |
| **Overwolf apps** | Ad-free subscription on top of an ad-funded free app | Same model — not open to us |
| **wotinspector** | Premium for extra replay features **[unverified]** | Replay storage and analysis is sellable |
| **Faceit Premium** | Missions, points, seasonal rewards, cosmetics | Missions + seasons drive retention |
| **lebwa.tv «Левша Плюс»** (299 ₽) | Ad-free, extras on a RU WoT site | The RU price anchor: ~200–300 ₽/month |

Takeaways:

1. Nobody paywalls basic lookups. Profiles, leaderboards and core stats are free everywhere.
2. Without ad-free as a lever, Plus has to be **depth on your own data, capacity, progression and cosmetics** — exactly the Dota Plus mix.
3. Dota Plus never sells an in-match advantage in ranked play. We adopt the same rule for the mod (§2.3).

## 2. Positioning

### 2.1 Name

The product will be renamed to «Три отметки». Every user-facing and payment-facing string reads the brand from one place:

- Server and shared code: a new `BRAND` constant in `packages/schemas/src/common/brand/brand.constants.ts`:
  ```ts
  export const BRAND = { name: 'Три отметки', plusName: 'Три отметки Плюс' } as const;
  ```
  `PAYMENT_DESCRIPTION` in `apps/web/server/src/modules/billing/config/plans.config.ts` and the email digest template build their strings from it.
- Client: `shared/i18n/locales/{ru,en}/brand.json` gets a `plus` key; all UI text uses `brand.name` / `brand.plus`, never a literal.

The rename then touches only these two places.

### 2.2 Plan and periods

One plan, three billing periods. Prices are proposals; yearly stays the best deal.

| Period | Price | Per month | Saving |
|---|---|---|---|
| Monthly | 199 ₽ | 199 ₽ | — |
| Quarterly (new) | 529 ₽ | 176 ₽ | ~11% |
| Yearly | 1 990 ₽ | 166 ₽ | ~17% |

Kept from the existing billing (YooKassa, saved card, auto-renew, cancel/resume, payment history):

- **Trial (new flow; the `trialing` status and `trialStartedAt` column already exist):** 7 days, no card, once per user **and** once per linked Lesta account (stops twink farming). Needs a linked Lesta account. It does not auto-convert. The Plus page and the gates offer it.
- **Referral days (exists, `REFERRAL.bonusDays = 30`):** the referrer gets 30 days when the referred user pays for the first time. New: the referred user gets a 14-day trial instead of 7.
- **Promo codes (exist):** `freeDays` codes are redeemed in the billing cabinet; `discountPercent` codes apply at checkout. The `product` column on `PromoCode` goes away because there is only one product.
- **Cancellation:** access lasts until `currentPeriodEnd`. No partial refunds from the UI; support handles refunds manually.

### 2.3 Principles for the split

1. **Core stats stay free.** Anyone's profile, tank stats, recent periods, marks and thresholds, leaderboards, server tank analytics, the encyclopedia, tools, clans and community stay free. This is a Lesta condition and it is also our growth engine.
2. **Plus sells our work, not Lesta data.** Gated items are analytics we compute, data from our mod and replays, our storage, compute (AI) and cosmetics. Raw Lesta API data is never behind the paywall. Exporting your own raw stats stays free.
3. **Plus is about you.** Deep analytics apply to the subscriber's **own linked accounts**. We do not sell analytics about other players.
4. **No in-battle advantage for money.** In-battle mod features (MoE %, session panel) are identical for Free and Plus. Plus mod features run only in the hangar or after the battle, and use only your own data. The fair-play rules in CLAUDE.md apply unchanged.
5. **No ads anywhere, for anyone.** Once we charge, the whole site is a "paid app" under the Lesta terms.
6. **Locked, not hidden.** Free users see what Plus adds, as a teaser in place (§4.4).

## 3. Feature split

Legend — **Exists**: already implemented (module shown). **New**: to build. **Change**: exists, the gate changes.

### 3.1 Stays free

| Area | Free for everyone | Module |
|---|---|---|
| Search, profiles, Versus | Everything: summary, WN8/EFF/Броня-Индекс, recent 24h/7d/30d/60d/1000, tank table, achievements, nickname/clan history | `players`, `search`, `compare` — Exists |
| Marks | Threshold table, **threshold history**, mastery thresholds, "battles to next mark" projection, in-battle MoE % in the mod, threshold-drop notifications (with a watch limit, §3.2) | `marks`, `mod`, `notifications` — Exists |
| Server analytics | Tank table, WR diff, tier list, patch impact, pulse | `tanks`, `pulse`, `leaderboards` — Exists |
| Knowledge | Encyclopedia, tree, compare tanks, build calculator, armor, maps, tactics board, calculators | `gamedata`, `builds`, `tree`, `maps`, `tactics` — Exists |
| Sessions | Daily sessions, live session (API polling every 15 min), live session with the mod, session cards, the Telegram session report | `mod`, `collector`, `telegram` — Exists |
| Personal basics | Charts over the **last 90 days**, activity calendar, top-3 insights ("why I lose" summary), next-mark hint, weekly site challenges, Wrapped, signature, feed and leagues | `players`, `social` — Change (window, §3.2) |
| Replays | Upload, parse, 2D player, public links, search, best of the week. Storage quota (§3.2) | `replays` — Exists |
| Streamers | 2 OBS overlays with standard themes, chat commands, verifiable challenges, streamer page | `streamers` — Exists |
| Clans and community | Clan pages, **clan workspace** (attendance, calendar, recruit funnel, officer reports), platoons, recruiting, tournaments, guides, community builds, **coaching listing** (§5.3) | `clans`, `clan-workspace`, `platoons`, `recruiting`, `tournaments`, `guides`, `community-builds`, `coaching` — Exists |
| Shop and events | Shop archive, bonus codes, drops, events calendar, news | `shop`, `events` — Exists |
| Bots | Telegram commands and notifications | `telegram`, `notifications` — Exists |
| Developer API | Free keys with rate limits; free "community" limits granted manually to public free apps | `developer`, `public-api` — Change (§5.2) |
| Data portability | CSV/JSON export of your own raw stats | `me` — New |
| Account | Up to 2 linked Lesta accounts, 3 active goals, 200 favourites, 500 follows | `me`, `social` — Change (limits) |

### 3.2 Plus

| # | Feature | Free | Plus | Source | Status / module |
|---|---|---|---|---|---|
| 1 | **Full personal history** | Charts over the last 90 days | The whole stored window (up to the retention limit, 24 months today), per-tank history, patch overlay | DB | Change: a query-window gate in `players/services/player-history.service.ts`. **Lesta check, see note** |
| 2 | **Deep personal analytics** | Top-3 insights | Full "why I lose" breakdown; performance by hour and weekday; tilt detector; personal patch analysis; tank learning curve; premium-account payoff; account economy charts | DB, API private | Change: `players/lib/insights`, `players/lib/playtime`; New for the rest |
| 3 | **Map and platoon advisor** | — (locked teaser) | WR/damage/survival by map × class × spawn side; "maps to avoid"; platoon chemistry (solo vs each platoon mate) | MOD + DB | New (features.md §23 #3, #4) |
| 4 | **Post-battle deep analysis** | Battle result card | Shot by shot, damage rolls vs the theoretical ±25%, penetration by distance and shell, timeline, comparison to the top 10% on that tank | MOD / REPLAY | New, on `mod` ingest + `replays` parser |
| 5 | **AI coach** (Claude API) | 1 session or replay review per week | Up to 5 per day (fair use), plus "Ask the bot" in Telegram | DB + REPLAY | New. Cost-driven quota |
| 6 | **MoE tracker Plus** | In-battle MoE % (mod), projection, next-mark hint | Per-battle MoE % history graph for each tank; "evening playlist" (tanks closest to a mark, first win of the day not taken); full next-mark recommender; MoE graph widget for OBS | MOD + DB | Change: `players/lib/next-mark`, `me/services/my-marks.service.ts`; New: playlist |
| 7 | **Priority collection** | Linked accounts polled every 15 min (`TRACKING.intervals.activeMinutes`) | Every 5 min (`subscriberMinutes`), first in the dispatch queue | API | Exists: `collector/tracking` (unify the entitled statuses, §5.4) |
| 8 | **Tank levels and challenges** (Dota Plus hero levels) | Tank level is shown, but XP accrues only with Plus | Tank XP from each tracked battle, levels 1–25 per tank; 3 rotating challenges per tank ("3 battles with 4000+ damage on the IS-7"), checked via the API or mod | DB/MOD | New module `progression` |
| 9 | **«Гильзы» currency** (Shards) | — | Earned from challenges and levels, **never sold**; spent only on site cosmetics (#12) | DB | New, in `progression` |
| 10 | **Plus seasons** | Season page visible | A quarterly reward track (aligned with the quarterly period): cosmetics, a seasonal badge, Wrapped-style season recap | DB | New, in `progression` |
| 11 | **OBS overlays Plus** | 2 overlays, standard themes | 20 overlays, premium themes, the theme builder (colours, fonts, animations), MoE graph and challenge-progress widgets | MOD/API | Exists: `OVERLAY.freeLimit/plusLimit` in `streamers/config/overlay.config.ts`; New: themes |
| 12 | **Profile cosmetics** (on our site only, never in the game) | Standard profile, basic cover | Plus badge, frames, animated covers, nickname accent, extra signature backgrounds, badge showcase slots | USER | New, in `social` + `progression` |
| 13 | **Capacity** | 2 linked accounts, 3 goals, 10 watched tanks for threshold drops, 50 stored replays | 10 accounts, 10 goals, 300 watched tanks, 1 000 stored replays, mod auto-upload goes first in the parse queue | — | Change: `me/config/me.config.ts`, `replays/config`, `notifications/config/watchers.config.ts` |
| 14 | **Analytics export** | Raw own stats (free, §3.1) | CSV/JSON export of **derived** data: sessions, analytics tables, per-battle mod data | DB/MOD | New, in `me` |
| 15 | **Personal API limits** | 10 000 req/day, 5 rps, 1 webhook | 50 000 req/day, 10 rps, 5 webhooks, personal non-commercial use only (in the API terms) | — | Change (§5.2) |
| 16 | **Early access** | — | Beta features behind `FEATURES` flags with an `earlyAccess` audience | — | New: flag audience in `apps/web/server/src/config/features.constants.ts` |
| 17 | **Hangar mod extras** (hangar only) | Session panel, MoE % | Hangar map briefing (#22 in features §23: your WR on the map, strong positions for your class), the evening playlist in the hangar. **Needs a МОСТ fair-play review before release** | MOD | New |

**Note on #1 (history window).** The snapshots are copies of Lesta data. Gating how far back you can see them is the one Plus item that comes closest to "commercial distribution of API data". Retention is the same for everyone (Plus does not store raw data longer), so we sell the analysis view, not the data. It still goes into the letter to Lesta (§6, WP0) as an explicit question. **Fallback if Lesta objects:** the full history becomes free, and Plus keeps only the analytics layered on it (#2, #6).

## 4. Entitlement design

### 4.1 One entitlement

- `SubscriptionProduct` shrinks to the single value `plus`. `PLUS_SUBSCRIPTION.product = 'plus'` stays the key.
- The source of truth is `isEntitled` in `apps/web/server/src/modules/billing/lib/period/period.ts`: status is in `entitledStatuses` (`active`, `trialing`, `pastDue`) and `currentPeriodEnd > now`.
- `collector/tracking/config/tracking.config.ts` (`subscriberProducts`, `subscriberStatuses`) and `tracking-announce.service.ts` stop duplicating the rule. They import `PLUS_SUBSCRIPTION` from `billing` and also check `currentPeriodEnd`. Today `subscriberStatuses` leaves out `pastDue`, which drops a user during the grace period.

### 4.2 Shared contract (`packages/schemas/src/plus/`)

```ts
export const PLUS_FEATURES = ['history', 'analytics', 'mapAdvisor', 'battleAnalysis', 'aiCoach', 'moeTracker',
  'priorityPolling', 'progression', 'overlays', 'cosmetics', 'analyticsExport', 'apiLimits', 'earlyAccess', 'hangarExtras'] as const;

export const PLUS_LIMITS = {
  linkedAccounts: { free: 2, plus: 10 },
  goals: { free: 3, plus: 10 },
  watchedTanks: { free: 10, plus: 300 },
  overlays: { free: 2, plus: 20 },
  storedReplays: { free: 50, plus: 1_000 },
  historyDays: { free: 90, plus: null },
  aiReviews: { free: { per: 'week', count: 1 }, plus: { per: 'day', count: 5 } }
} as const;

export const PLUS_GRACE = { pastDueDays: 3, overflowReadOnlyDays: 180 } as const;
```

- `plusStateSchema`: `{ state: 'none' | 'trial' | 'active' | 'grace' | 'expired', periodEnd, graceEndsAt, trialAvailable }`. It is added to `billingStatusSchema` next to `isPlus`.
- `SUBSCRIPTION_REQUIRED` and `PLAN_LIMIT_REACHED` (they exist in `errors.constants.ts`) get details `{ feature: PlusFeature, limit?: number }`, so the client can show the right teaser.
- The client and server read the same `PLUS_LIMITS`, so a teaser never promises a number the server does not enforce.

### 4.3 Server

- `billing/services/entitlements.service.ts` → `EntitlementsService` gets:
  - `plusState(userId)`, cached for 60 s (LRU, like `DeveloperPlanService` today) and invalidated by the webhook, renewal and expiry handlers;
  - `limit(userId, key)` → the number from `PLUS_LIMITS`;
  - `syncTracking(userId)` becomes two-way: it downgrades `trackingTier` back to the normal cadence on expiry.
- New `billing/guards/plus.guard.ts` + `billing/decorators/requires-plus.decorator.ts`: `@RequiresPlus('analytics')` = `applyDecorators(SetMetadata(...), UseGuards(PlusGuard))`. It throws `AppForbiddenException('SUBSCRIPTION_REQUIRED', ..., { feature })`. Use it for whole endpoints (deep analytics, analytics export, battle analysis).
- Soft gates (limits, windows) call `entitlements.limit(...)` inside the service, the way `OverlayService.create` does today.
- New `billing/services/trial.service.ts` + a `POST me/billing/trial` endpoint. It writes `status: 'trialing'` and `trialStartedAt`, and records the trial in a new `PlusTrial` table keyed by `accountId` (`@@id([accountId])`, `userId`, `startedAt`).
- Payment strings use `BRAND.plusName`.

### 4.4 Client

- Move `views/plus/model/hooks/use-plus-access` to **`entities/plus/model/hooks/use-plus/`**, because every layer needs it and views cannot be imported by other layers. It returns `{ isSignedIn, isPlus, state, limits, isPending }`.
- **`features/plus/`** (new):
  - `PlusGate`: `feature`, `children`, optional `fallback`. It renders `children` or `PlusTeaser`.
  - `PlusTeaser`: a locked card in place of the content. Icon, title, 2–3 lines on what it shows, CTA «Попробовать 7 дней» (or «Оформить», or «Войти» for guests). **No fake numbers and no blurred sample data** (the no-mocks rule): a static illustration only.
  - `LimitReached`: an inline notice "3 of 3 goals — Plus gives 10".
  - `PlusBadge`: a small "Плюс" chip on locked tabs and menu items.
- Gating rules:
  - A locked section keeps its place in the layout, and a locked tab stays in the tab bar with a chip.
  - The server stays authoritative. On a `SUBSCRIPTION_REQUIRED` response the client renders `PlusTeaser` for `details.feature`.
  - A locked feature is never removed from the navigation.
- All strings go in `shared/i18n/locales/{ru,en}/plus.json` under `gate.<feature>.*`.

### 4.5 Grace period and expiry

| State | Access |
|---|---|
| `trialing` | Full Plus until the trial ends. The banner counts down the days |
| `active` + `cancelAtPeriodEnd` | Full Plus until `currentPeriodEnd` |
| `pastDue` (renewal failed) | Full Plus for `RENEWAL.pastDueGraceDays = 3` (exists). Billing banner «обновите карту» |
| `expired` / `canceled` | Free. **Nothing is deleted on expiry** |

What happens to Plus-created things on expiry (read-only, never lost):

- **History and analytics:** the data stays. Views go back to the 90-day window and the teasers. Resubscribing restores everything at once.
- **Overlays over the free limit:** the 2 oldest keep working. The others are paused: the public URL shows a neutral "overlay paused" frame, never broken HTML mid-stream, and they stay editable. Premium themes fall back to the default theme.
- **Goals, watched tanks, linked accounts over the limit:** kept read-only, with no new ones until under the limit. Linked accounts over the limit stop getting priority polling but keep their data.
- **Replays over the quota:** kept read-only for `PLUS_GRACE.overflowReadOnlyDays` (180 days), then the newest 50 are kept and the rest deleted, with a notification 14 days and 1 day before.
- **Tank levels, «Гильзы», cosmetics:** levels and balance are frozen (no XP accrues). Owned cosmetics stay owned. Plus-only cosmetics are hidden from the public profile until you resubscribe.
- **API keys:** limits drop to the free tier within the plan-cache TTL (≤ 5 min). Webhook endpoints over the free limit are disabled, not deleted.
- **Collection cadence:** back to 15 min (`syncTracking` downgrade).

## 5. What to remove or change in the current code

### 5.1 Billing and schema (`apps/web/server/prisma/schema/billing.prisma`)

- `SubscriptionProduct`: drop `clanPanel`, `developerPro`, `overlaysPro`, leaving only `plus`.
- `SubscriptionPlan`: `monthly | quarterly | yearly` (drop `halfYearly`, add `quarterly`).
- `Subscription.clanId`: drop (it was for the clan-panel product).
- `PaymentKind` enum and `Payment.kind`: drop (`donation` and `coaching` go away; every payment is a subscription payment).
- `Payment.product`, `PromoCode.product`: drop.
- Add the `PlusTrial` model.
- Sync with `bun run db:push` (no migrations before production).

Code changes that follow:

- `billing/config/plans.config.ts`: add `PLUS_PLANS.quarterly` (3 months, 529 ₽); `PAYMENT_DESCRIPTION` from `BRAND`.
- `billing/lib/promo-check/*`: drop the `wrongProduct` branch. `PROMO_REJECTION_CODE.wrongProduct` goes too.
- `billing/lib/pricing`, `services/checkout.service.ts`, `renewal.service.ts`, `webhook.service.ts`, `subscription.service.ts`: handle `quarterly`, and remove `product`/`kind` from the payment writes.
- `billing/index.ts`: stop exporting `YooKassaClient`. After §5.3 only billing uses it.
- `packages/schemas/src/billing/billing.schemas.ts`:
  - `plusPlanSchema` = `['monthly', 'quarterly', 'yearly']`;
  - `subscriptionPlanSchema` = the same values (later merged into `plusPlanSchema`, which the subscription reuses);
  - add the `plusStateSchema` fields to `billingStatusSchema`.

### 5.2 Developer API: free for everyone, Plus = higher personal limits

- Delete `apps/web/server/src/modules/developer/developer-plans.controller.ts` (`GET /developer/plans`). Replace it with `GET /developer/tiers`: public and informational, limits only, no prices.
- Replace `developer/services/developer-plan.service.ts` with `ApiTierService`. The tier is `community` (admin-granted through key metadata, which replaces `partner`), `plus` (from `EntitlementsService.plusState`) or `free`.
- Remove `DEVELOPER_PLAN` from `developer/config/developer.config.ts`.
- Rename `API_PLANS` → `API_TIERS`.
- `developer/lib/api-key/api-key.ts`: `keyPlanOf` → `keyTierOf`.
- `developer/services/api-keys.service.ts`, `api-usage-report.service.ts`, `webhook-endpoints.service.ts`: `plan` → `tier`.
- `public-api/services/api-rate-limit.service.ts`, `public-api/guards/api-key.guard.ts`: limiter per tier.
- `packages/schemas/src/developer/`:
  - `apiPlanSchema` (`free|pro|partner`) → `apiTierSchema` (`free|plus|community`);
  - `API_PLAN_LIMITS` → `API_TIER_LIMITS` = `{ free: 10k/5/1, plus: 50k/10/5, community: 2M/100/50 }`;
  - `ApiPlan*` types → `ApiTier*`;
  - the `plan` field in `apiKeySchema`, `apiUsageSchema` and `developerOverviewSchema` → `tier`.
- API terms page: the public API is free. Plus limits are for personal use. Public free community apps apply for `community` limits at no cost. Reselling our API or putting it behind a paywall is forbidden (mirrors the Lesta terms).
- Client `views/developers`:
  - delete `ui/components/PlansTable` and `config/plans.constants.ts`;
  - add a `TiersTable` (no prices; the Plus row links to `/plus`);
  - `model/hooks/use-current-plan` → `use-api-tier`;
  - update `LimitFigures`.
- Client `views/developer-cabinet`: in `CabinetHeader` and `ApiKeyRow`, the plan badge becomes a tier badge. The upsell becomes «Плюс повышает личные лимиты».
- i18n `developers.json`, `developer.json`: remove Pro/Partner pricing copy.
- Regenerate `apps/web/client/shared/api/openapi/internal.json` and `shared/api/generated/*`.

### 5.3 Coaching: free listing + contact/booking, no payments through us

- Delete `apps/web/server/src/modules/coaching/services/coaching-payment.service.ts` and its export.
- `coaching.controller.ts`: remove `POST orders/:id/pay` and `POST orders/:id/confirm-payment`, and the `CheckoutDto` import.
- `coaching/dto/coaching.schemas.ts`: remove the checkout schema.
  - `priceRub` becomes optional and informational (`priceNote`: "from 500 ₽ / agreed with the coach").
  - `upsertCoachSchema` gets `contacts` (Telegram, Discord, VK links).
- `coaching/config/coaching.config.ts`: drop `returnPath`, `product`, `currency`, `settleLookbackDays`.
- `community-maintenance/processors/community.processor.ts` and `config/community-maintenance.config.ts`: drop the `settleCoaching` job and the `CoachingPaymentService` injection.
- `community.prisma`:
  - `CoachingOrderStatus` = `requested | accepted | completed | cancelled` (drop `paid`, `disputed`);
  - drop `CoachingOrder.paymentId`;
  - `CoachProfile.priceRub` and `CoachingOffer.priceRub` become `Decimal?`;
  - add `CoachProfile.contacts Json?`.
- Flow: the student sends a booking request (with an optional replay). The coach accepts and then sees the student's contact. Payment is arranged directly and off-site. The coach marks the order completed, and the student leaves a review.
- The UI carries a disclaimer: «Оплата — напрямую тренеру, сайт не участвует в расчётах».
- No coaching client views exist yet, so there is nothing to remove on the client. The future UI follows this flow.

### 5.4 Other gates and flows

- `streamers/services/overlay.service.ts`: `isPro` is stamped at creation and is wrong after expiry.
  - Drop `Overlay.isPro` (`streamers.prisma`) and `isPro` from `packages/schemas/src/streamers/streamers.schemas.ts`.
  - Compute the paused state at read time from `plusState` and the overlay's age rank.
  - The limits come from `PLUS_LIMITS.overlays` instead of `OVERLAY.freeLimit/plusLimit`.
- `collector/tracking/config/tracking.config.ts` + `services/tracking-announce.service.ts`: use the billing entitlement rule (§4.1).
- `me/config/me.config.ts`: `GOALS.maxActive` becomes per-tier from `PLUS_LIMITS.goals`. Add the linked-account limit in `me/services/linked-accounts.service.ts`.
- `views/plus/config/plus-benefits.constants.ts`: `['history', 'charts', 'overlays', 'polling', 'export', 'clan']` → the new list from §3.2. `clan` goes: the clan workspace stays free. `export` becomes "analytics export".
- `views/plus`:
  - add quarterly to `PlanTable` and to `lib/plan-pricing`;
  - add the trial CTA;
  - FAQ: what stays free, no ads, Lesta attribution, what happens on expiry.
- `views/billing`: `StatusPanel/StatusCard` handles the `trial` and `grace` states, and `lib/renewal` handles `quarterly`.
- `docs/product/features.md`:
  - §15 (coaching "payment through the site" → free listing);
  - §18 (tiers Free/Pro/Partner → free + Plus limits + community);
  - §19 (the Plus list; drop "clan tiers" and "donations (Boosty)");
  - the design spec §2.4 wording stays.

## 6. Launch prerequisites

1. **Written confirmation from Lesta** (support / developers.lesta.ru contact) before the first charge. The letter describes:
   - the single subscription;
   - that gated features are our own analytics, mod/replay data, storage, AI and cosmetics;
   - that core stats are free and there are no ads;
   - the specific question about the history window (§3.2 note);
   - that the free public API has personal Plus limits.

   Keep the reply in `docs/research/data/lesta-api.md`. Until it arrives, checkout stays behind a feature flag, and trials and promo days still work.
2. МОСТ fair-play review of the hangar mod extras (#17) before they ship.
3. Legal pages: offer (оферта) for the subscription, refund policy, API terms (§5.2), coaching disclaimer (§5.3).

## 7. Work packages

| WP | Scope | Main paths | Depends on |
|---|---|---|---|
| **WP0** Lesta letter | Draft and send the letter; `FEATURES.plusCheckout` flag (off) | `docs/research/data/lesta-api.md`, `apps/web/server/src/config/features.constants.ts` | — |
| **WP1** Schema cleanup | §5.1 enums, columns, `PlusTrial`; `BRAND` constant; quarterly plan; promo product removal | `apps/web/server/prisma/schema/{billing,community,streamers}.prisma`, `apps/web/server/src/modules/billing/**`, `packages/schemas/src/{billing,common/brand}` | — |
| **WP2** Entitlement core | `plusState`, cache + invalidation, `limit()`, `@RequiresPlus` + `PlusGuard`, two-way `syncTracking`, trial service + endpoint, `packages/schemas/src/plus` (`PLUS_FEATURES`, `PLUS_LIMITS`, `PLUS_GRACE`, `plusStateSchema`), error details | `apps/web/server/src/modules/billing/{services,guards,decorators}`, `packages/schemas/src/{plus,errors}`, `collector/tracking` | WP1 |
| **WP3** Developer API de-monetisation | §5.2 end to end, server + schemas + client + OpenAPI regen | `modules/developer/**`, `modules/public-api/**`, `packages/schemas/src/developer`, `apps/web/client/views/{developers,developer-cabinet}` | WP2 |
| **WP4** Coaching de-monetisation | §5.3 | `modules/coaching/**`, `modules/community-maintenance/**`, `prisma/schema/community.prisma` | WP1 |
| **WP5** Client gating kit | `entities/plus` (move `usePlusAccess` → `usePlus`), `features/plus` (`PlusGate`, `PlusTeaser`, `LimitReached`, `PlusBadge`), `plus.json` gate copy, `SUBSCRIPTION_REQUIRED` handler in `shared/api/http` | `apps/web/client/{entities,features}/plus`, `apps/web/client/shared/{api,i18n}` | WP2 |
| **WP6** Migrate existing gates | Overlays (drop `isPro`, pause logic), goals, linked accounts, watched tanks, replay quota, history window, polling, insights/playtime/next-mark depth; expiry jobs (overflow read-only, replay cleanup notices) | `modules/{streamers,me,notifications,replays,players,billing/processors}` | WP2, WP5 |
| **WP7** Plus page and billing UI | New benefits list, quarterly, trial CTA, FAQ, trial/grace states, brand keys | `apps/web/client/views/{plus,billing}`, `shared/i18n/locales/*/{plus,billing,brand}.json` | WP2, WP5 |
| **WP8a** Progression (Dota Plus core) | New `progression` module: tank XP/levels, per-tank challenges, «Гильзы» ledger (earn-only), quarterly season track, cosmetics inventory; profile cosmetics in `social` | `apps/web/server/src/modules/progression/**`, `prisma/schema/progression.prisma`, `packages/schemas/src/progression`, client `views/progression`, `widgets/player` | WP2 |
| **WP8b** Deep analytics | Full insights, hour/weekday performance, tilt, patch analysis, learning curve, map & platoon advisor, analytics export | `modules/players`, `modules/me`, new `modules/analytics` if `players` grows too large | WP2, mod data |
| **WP8c** Battle analysis + AI coach | Post-battle deep analysis on mod ingest/replays; AI coach with per-tier quota and response cache | `modules/{mod,replays}`, new `modules/coach-ai` | WP2 |
| **WP8d** Overlays and hangar extras | Premium themes, theme builder, MoE graph widget; mod hangar briefing/playlist after the МОСТ review | `modules/streamers`, `apps/web/client/views/{overlay,streamer-studio}`, `apps/game/modpack` | WP6 |
| **WP9** Docs | Update features.md §15/§18/§19 and the design spec phases; API terms page copy | `docs/**`, client legal views | WP3, WP4 |

Order: WP0 and WP1 in parallel → WP2 → WP3/WP4/WP5 in parallel → WP6/WP7 → WP8* → WP9. WP1–WP7 make the current product consistent with the one-subscription model. WP8* adds the new Plus value and can ship incrementally behind `earlyAccess`.

Verification per WP: `bun run verify` + targeted `bun run test` (limits, `isEntitled`, trial eligibility, expiry transitions, tier resolution) + `bun run lint:unused` after the removals.

## 8. Implementation notes

State after WP1–WP7 and WP9 (2026-09-26).

- **Shared contract:** `packages/schemas/src/plus` holds `PLUS` (with `PLUS.checkoutEnabled`, currently `false` until the Lesta reply, §6), `PLUS_FEATURES`, `PLUS_LIMITS`, `PLUS_GRACE`, `PLUS_TRIAL`, `plusStateSchema` and the `plusLimit` helper. `BRAND` lives in `packages/schemas/src/common/brand`. The flag replaces the `FEATURES.plusCheckout` idea from WP0.
- **Server core:** `apps/web/server/src/modules/billing`.
  - `EntitlementsService`: `plusState`, `refresh`, `isPlus`, `limit`, `assertFeature`, `assertWithinLimit`, `syncTracking`, with a 60 s LRU cache that the webhook, renewal and expiry handlers invalidate.
  - `@RequiresPlus(feature)` decorator + `PlusGuard` for whole endpoints.
  - `TrialService` + `POST me/billing/trial`.
  - `entitledSubscriptionWhere` is shared with collector tracking, so the `pastDue` grace period counts for priority polling.
- **Errors:** API errors carry `details: { feature?, limitKey?, limit? }`. New error codes: `CHECKOUT_UNAVAILABLE` (checkout while the flag is off) and `TRIAL_UNAVAILABLE`.
- **Existing gates:** overlays compute `isPaused` at read time (`Overlay.isPro` is dropped); goals use `PLUS_LIMITS.goals`.
- **Client kit:** `apps/web/client/entities/plus` (`usePlus`) and `apps/web/client/features/plus` (`PlusGate`, `PlusTeaser`, `LimitNotice`, `PlusBadge`). `LimitNotice` is the component §4.4 calls `LimitReached`.
- **Remaining:**
  - WP0: the Lesta letter; turn on `PLUS.checkoutEnabled` only after the written reply is stored in `docs/research/data/lesta-api.md`;
  - WP8a–d: progression, deep analytics, battle analysis and AI coach, overlay themes and hangar extras;
  - soft limits not yet enforced: linked accounts, watched tanks, stored replays, the history window;
  - the replay overflow cleanup job (§4.5) and its 14-day / 1-day notifications.
- **Free tiers and monthly meters** (3D armor, battle analysis, proposed cuts): [2026-09-28-plus-free-tiers.md](2026-09-28-plus-free-tiers.md).
