# Lesta API — reference (verified 2026-09-24)

Source: developers.lesta.ru (`/api/methods/`, guide, rules/agreement). Items marked **[unverified]** need a live key to confirm.

## Basics
- Base URL: `https://api.tanki.su/wot/<group>/<method>/`
- Accepts GET and POST.
- Version header: `X-Api-Version: 2.80.0`.
- CORS: `*`.
- Common params:
  - `application_id` (required)
  - `language` (default `ru`)
  - `fields`: comma-separated, dot-nested, `-` excludes, max 100
  - `access_token`
  - `extra`
- Response: `{status, meta:{count}, data:{<id>: ...}}`
- Errors come as `error.{code,message,field,value}`:
  - `INVALID_APPLICATION_ID`, `REQUEST_LIMIT_EXCEEDED`, `ACCOUNT_ID_LIST_LIMIT_EXCEEDED` (all 407)
  - the `demo` key is blocked

## Methods (wot)
- **account**: list, info, tanks, achievements
- **auth**: login, prolongate, logout
- **tanks**: stats, achievements, mastery
- **encyclopedia**:
  - current: vehicles, vehicleprofile, vehicleprofiles, modules, achievements, info, arenas, provisions, personalmissions, boosters, badges, crewroles, crewskills
  - legacy: tanks, tankinfo, tank*
- **clans**: list, info, accountinfo, glossary, messageboard, memberhistory
- **globalmap**: fronts, provinces, claninfo, clanprovinces, clanbattles, seasons, season*, events, event*, info
- **stronghold**: claninfo, clanreserves, activateclanreserve
- **ratings**: types, dates, accounts, neighbors, top
- **clanratings**: types, dates, clans, neighbors, top

### Key methods
- **account/list**
  - `search` (≤24 chars); `type` = `startswith` (≥3 chars) or `exact` (up to 100 names); `limit` ≤ 100.
- **account/info**
  - Up to 100 `account_id`.
  - Top-level fields: nickname, clan_id, global_rating, created_at, last_battle_time, logout_at, updated_at.
  - Statistics blocks: `statistics.{all,random,clan,company,team,regular_team,stronghold_*,globalmap_*,epic,fallout,ranked_*}`.
  - `private.*` requires a token.
  - `extra`: `statistics.random`, `statistics.epic`, `statistics.ranked_*`, `private.garage`, `private.rented`, `private.boosters`, `private.personal_missions`.
- **account/tanks**
  - Up to 100 `account_id` + up to 100 `tank_id`.
  - Returns `tank_id`, `mark_of_mastery` (0–4), `statistics.{battles,wins}`.
  - **Cheap change detector.**
- **tanks/stats**
  - **One** `account_id`, up to 100 `tank_id`.
  - `extra`: random, epic, ranked_*.
  - Fields: mark_of_mastery, max_frags, max_xp, plus blocks all, random, …
  - Block fields: battles, wins, losses, draws, xp, battle_avg_xp, damage_dealt, damage_received, frags, spotted, capture_points, dropped_capture_points, hits, shots, piercings, piercings_received, explosion_hits, direct_hits_received, no_damage_direct_hits_received, avg_damage_blocked, tanking_factor, survived_battles, stun_number, stun_assisted_damage.
  - `in_garage` and `frags` need a token.
- **tanks/achievements**
  - One account, up to 100 tanks.
  - `achievements.marksOnGun` 0–3 **[unverified on Lesta]**.
  - **No MoE percentage in the API.**
- **tanks/mastery**
  - `distribution` = damage | xp, `percentile` up to 10 values.
  - Server percentiles per tank. These are not MoE thresholds.
- **encyclopedia/vehicles**
  - Filters: nation, type, tier.
  - `page_no`, `limit` ≤ 100.
- **auth/login** (OpenID via Lesta ID)
  - Params: `redirect_uri`, `expires_at` ≤ 2 weeks, `display`, `nofollow=1`.
  - Tokens are refreshed with `auth/prolongate`.

## Limits
- Server app: 20 rps per registered IP, up to 5 IPs per app, so about 100 rps max.
- Standalone (client) app: 10 rps per IP.
- Up to 10 apps per account.
- Higher limits: ask support. They want to see rps, `fields` usage and your caching.
- Batch sizes: 100 ids for account/info, account/tanks and account/achievements. tanks/stats takes a single account.
- Cache everything ourselves. Encyclopedia changes per patch; stats change after battles.

## Differences vs Wargaming API
Missing on Lesta:
- `account/wtr`
- `wgn/*`, including `servers/info` (no online counter)

Other differences:
- Single realm.
- Separate `application_id`.

## Terms of use (developers.lesta.ru/documentation/rules/agreement/) — must comply
- **Licence**: non-exclusive, revocable, public apps only.
- **Free app**: ads allowed; ads unrelated to Lesta need their approval; donations allowed.
- **Paid app or in-app purchases**: **ads forbidden**; donations allowed.
- **Forbidden**:
  - commercial distribution of API data
  - derivative works without written consent
  - reselling the API
  - implying affiliation with Lesta
  - Lesta-like UI
  - indefinite storage of data copies
  - passing data to search engines or ad networks
  - asking users for Lesta email or password
  - passing personal data to third parties
  - bots and proxies
- **Required in the UI**:
  - developer copyright + «© Леста Игры. Все права защищены»
  - prominent link to the official game site
  - "data source: Леста Игры"
  - prominent link to the Lesta Support Center
  - a logout button when auth is used
- **Deletion**: delete data on Lesta's request; don't keep stale data.

### Monetisation status
Our only paid product is the Plus subscription ([Plus spec](../../specs/2026-09-26-plus-subscription.md)); the API and core stats stay free and there are no ads. Checkout stays disabled (`PLUS.checkoutEnabled = false` in `packages/schemas/src/plus`) until Lesta confirms the model in writing, as described in the Plus spec §6; trials and promo days work meanwhile. When the reply arrives, record it here (date, sender, verbatim answer, including the history-window question).

## Community data
- **WN8 expected values (Lesta)**: modxvm.com/en/wn8-expected-values-lesta. Daily, JSON/CSV, but behind Cloudflare.
  - Alternatives: tankist.net/services/wn8, kttc.ru/wot/ru/info/wn8etv.
- **MoE thresholds**: poliroid.me/gunmarks (RU/BY cluster, no public API); kttc mirrors it.
  - Long-term: compute our own from mod data.
- **Libraries**:
  - WgLestaAPI (Python, small).
  - Node `lesta-mt-api` is abandoned; we write our own thin TS client.
