# Streamer directory and streamer settings — design spec

Date: 2026-09-26. Status: draft for review. Nothing implemented.

Related: [2026-09-24-otmetki-design.md](2026-09-24-otmetki-design.md), [2026-09-26-plus-subscription.md](2026-09-26-plus-subscription.md), [../product/features.md](../product/features.md) §14, [../research/data/lesta-api.md](../research/data/lesta-api.md), [../research/competitors/market.md](../research/competitors/market.md).

## 0. Summary

Two linked features on top of the existing `streamers` module:

1. **«Блогеры и стримеры»** — a public directory of RU «Мир танков» creators: platforms, live status, what they play right now, Lesta stats from our own data, favourite tanks, marks. Two kinds of entries: **claimed** (the creator owns the profile) and **editorial** (public info only, with a «Это вы? Заберите профиль» flow and a one-click removal on request).
2. **«Настройки стримеров»** — structured game settings per creator (graphics, controls, zoom, sight, markers, minimap, sound, hardware, modpack), a comparison view, and aggregates («что ставят топ-игроки»). We **never host third-party mods, modpacks or screenshots**. "Download" means applying settings through our own mod, or a link to the author's official download.

Principles:

- **Link out, don't copy.** Numbers and facts ("sniper sensitivity 0.35", "zoom x2/x4/x8/x16") are not copyrightable; screenshots, videos, config files and modpacks are. We store facts with a source link and never rehost the media.
- **The creator is in control.** An editorial entry is removed at the creator's request. A claimed profile shows only what the creator chose to publish.
- **Fair play.** We never list, link to or "recommend" a mod from Lesta's forbidden categories (§2.4). Every sight/mod entry passes a moderator fair-play check before it is public.
- **No mock data.** An empty directory or a creator without settings shows an empty state, not placeholders.

## 1. Research

Verified 2026-09-26 by web search unless marked **[unverified]**. Items marked **[legal check]** need a lawyer's reading before launch.

### 1.1 What creators publish, where, and in what form

| Creator | What is public | Where | Form | Can we host a copy? |
|---|---|---|---|---|
| **Jove** (Джов) | Modpack «Моды от Джова» (~20 M downloads per taverna.gg): alternative sights (Jove, Atotik, Murazor, demon2957), damage panels, PMOD (zoom, chat filters), XVM, WoT Tweaker Plus, replay manager, skins with penetration zones, voice packs. In-hangar «Настройки модификаций» menu. Personal game settings: only in videos. | joves-modpack.ru (official, FAQ says "all links on the homepage"); mirrors on tankist.net, wotsite.net, wotspeak.org etc. | Installer | **No.** No licence or redistribution terms are published. Link to joves-modpack.ru only |
| **Near_You** (Near_You Team) | Modpack: team hangar, one-key server-sight toggle, dynamic zoom x16–x25, penetration calculator | Official site/social links **[unverified which]**; many mirrors | Installer | **No.** Link out |
| **Amway921** | Modpack (~4.5 M downloads): tweaker, optimisations, newcomer-friendly presets | Mirrors on tankist.net **[official URL unverified]** | Installer | **No** |
| **Левша / LeBwa** | «Модпак Левши»: free and paid versions; also tank builds, marks, live streams on the site, «Левша Плюс» | lebwa.tv/hub/modpack-lebwa | Installer | **No.** Also a direct competitor (market.md) |
| **Korben Dallas** | Modpack that **auto-applies Korben's own client settings** (sight, markers, graphics) but leaves resolution and mouse sensitivity untouched; FPS-light | Mirrors (mirtankov.su, wotsite.net) **[official URL unverified]** | Installer | **No.** But it proves the demand for "apply a streamer's settings" |
| **ПРОТанки** (Юша) | Modpack with a «Как у Юши» preset, "FPS-friendly" preset, keeps old settings on reinstall | protanki site, tanki.maeu.ru **[official status unverified]**; Boosty | Installer with presets | **No** |
| **NIDIN** | A full "client settings" page: graphics, sound, controls (random, Steel Hunter, Натиск, Линия фронта), sights (arcade/sniper/arty/outline), markers, battle interface | nidin.ru/game-settings, nidin.ru/mods | **Screenshots only**, © nidin.ru 2024–2026, no downloadable file | **No copy of screenshots.** We may enter the values as facts with a source link, or — better — invite NIDIN to claim the profile |
| **Aslain, OldSkool ProMod** | Community modpacks (not streamers) | own sites | Installer | **No** |
| Inspirer, Evil_GrannY, Blady, Vspishka, Granni, Protanki team members | No structured settings page found. Settings appear in YouTube videos ("мои настройки") and stream Q&A **[not exhaustively checked]** | YouTube, VK, Telegram | Video | Enter facts editorially with a timestamped video link; prefer claims |

Takeaways:

1. **Nobody publishes machine-readable settings.** The market standard is a modpack installer with a "like the streamer" preset, or screenshots. A structured, comparable, per-field settings database is new for RU tanks (no prosettings-for-tanks exists; prosettings.com covers CS/Valorant/Apex etc., not WoT).
2. **Modpacks are the creators' main asset** and often monetised (Boosty, paid tiers, installer ads/partners). Hosting or mirroring them would be copyright infringement and would antagonise the very people we want to claim profiles. We link to the official page only.
3. The Korben "apply my settings" pattern is the thing users want. We can offer it legally through **our own mod** applying **standard client settings only** (§3.5), because a set of numbers is not the creator's copyrighted work, and for claimed profiles the creator publishes it himself.

### 1.2 How the client stores settings

- **File:** `%APPDATA%\Lesta\MirTankov\preferences.xml` (Lesta support: when clearing the cache, delete everything in `MirTankov` **except** `preferences.xml` to keep settings). Copying the file to another PC transfers the settings (community guides; WoT-era behaviour).
- **Format:** BigWorld DataSection XML. Plain tags hold device and graphics values (`windowedWidth`, `fullscreenWidth`, `fov`, `triplebuffering`, `enablePostMortemEffect`, graphics quality levels). Most gameplay settings under `scriptsPreferences` are stored as **base64-encoded Python pickles** (WoT behaviour) **[unverified on Lesta 1.45]**.
- **Personal data inside:** the `loginPage` section keeps the login and, with "remember me", an auth token; other sections carry account-specific keys **[unverified on Lesta — confirm on a real file before building WP6]**. Consequences:
  - we **never accept the raw file on the server**;
  - parsing happens **in the browser** with a whitelist; only the extracted structured values are sent;
  - pickled blobs are never unpickled with a general unpickler (code execution risk). Use a data-only reader (npm `pickleparser` **[check maintenance]**) or skip them and rely on the mod export (§3.5).
- **Settings tabs in the client** (Lesta wiki «Настройки игры»): Игра (chat, battle interface, minimap, carousel…), Графика (resolution, preset «минимальная…ультра», SD/HD client, terrain/water/effects/lighting/vegetation, shadows, motion blur, tessellation), Звук, Управление (key bindings; sensitivity for arcade / sniper 0.01–1.5 and artillery 0.01–3.0), Прицел (arcade, sniper, artillery, outline), Маркеры (enemy, ally, destroyed; base and Alt), Прочее (damage indicator, sixth sense, battle events, map borders, battle report). Sniper zoom steps x2/x4/x8/x16/x25; FOV 70–120 with optional dynamic FOV.
- **Modpack configs:** each modpack keeps its own configs under `res_mods`/`mods/configs` (XVM: `res_mods/configs/xvm/*.xc`). Installers have their own preset systems (ПРОТанки «Как у Юши», Jove's in-hangar menu). They are the modpack author's work — we record *which* modpack and preset a creator uses, not the files.

### 1.3 What prosettings-style sites show, and what matters for tanks

prosettings.com per player: mouse (sens, DPI, polling), keybinds, crosshair, video settings, monitor/resolution/Hz, peripherals (mouse, pad, keyboard, headset, chair), real name, country, team. Directory by game and team, "recent players". **No source or verification date is shown** — we do better by showing a source link and "проверено DD.MM.YYYY" on every value.

For tanks the valuable fields are:

| Group | Fields |
|---|---|
| Display | Resolution, refresh rate, window mode, render (SD/HD), graphics preset + key overrides (effects, vegetation, shadows off/on, motion blur, tessellation), FPS cap, V-sync, triple buffering |
| Camera | FOV (and dynamic FOV range), post-mortem effect, sniper-mode dynamic camera, horizontal stabilisation |
| Controls | Sensitivity arcade / sniper / artillery, invert, mouse DPI and polling (hardware), key bindings of note (server sight toggle, auto-aim key, Alt markers) |
| Zoom | Enabled zoom steps (x2…x25), zoom mod (PMOD / Near_You x16–x25) |
| Sight | Arcade and sniper sight: reticle shape/colour, gun marker type (server/client), outline; third-party sight mod name + link (after fair-play check) |
| Markers | Enemy/ally markers base and Alt: HP bar, vehicle name, tier, icon, damage |
| Minimap | Size, transparency, view range circles, draw-range circle, fire sector of own SPG |
| Sound | Volume mix, sixth-sense sound, voice pack |
| Battle UI | Damage panel, damage log, battle efficiency ribbons, sixth sense icon |
| Hardware | CPU, GPU, RAM, monitor, mouse, pad, keyboard, headset, internet provider not collected |
| Mods | Modpack + version/preset, or "чистый клиент"; list of notable mods |

### 1.4 Live status APIs

| Platform | Endpoint | Auth | Notes |
|---|---|---|---|
| Twitch | Helix `GET /helix/streams?user_login=…` (up to 100 logins per call), `GET /helix/clips`, `GET /helix/schedule`, `GET /helix/users` | App access token (client credentials). `TWITCH_CLIENT_ID/SECRET` already in `env.schema.ts` | Game filter by `game_id` of «Мир танков» / "World of Tanks" category |
| VK Видео Live (ex VK Play Live) | DevAPI `POST /v1/channels` (batch by channel URL), `GET /v1/channel`, `GET /v1/catalog/online_channels?category_id=…&limit≤200` | App token **[verify grant type at dev.live.vkvideo.ru]** | Returns stream status, title, category, viewers, preview. DevAPI opened to all developers in 03.2025 |
| YouTube | Channel uploads RSS `youtube.com/feeds/videos.xml?channel_id=…` (free); live detection via Data API `search.list eventType=live` costs 100 quota units | API key | Poll live status only for claimed channels or rarely (every 10–15 min) |
| Trovo | Open API `get channel info` by username (Client-ID) **[unverified still used by RU tankers]** | Client ID | Low priority |
| Telegram, Boosty, VK group | No live status. Link only | — | We do not scrape t.me/s previews |

### 1.5 Legal constraints

- **Lesta API terms** (lesta-api.md): stats shown on cards are Lesta data → free, attribution footer, no ads, no "indefinite storage" of copies, deletion on request. Nothing new. Directory must not imply that the creators or Lesta endorse us.
- **Copyright:** modpacks, sight mods, screenshots, videos and config files belong to their authors. We store: facts (setting values), names, and links. Embeds are allowed only through the platform's own player (Twitch/VK/YouTube embed), never re-uploads.
- **Personal data (152-ФЗ):** creators are mostly known by handles, but some handles map to real names. Art. 10.1 (since 03.2021) requires separate consent for *distributing* personal data that a person made public **[legal check]**. Rules for editorial entries:
  - handle and public channel URLs only; **no real names, no photos we store, no city/age**;
  - avatar comes from the platform API at render time (not stored), or none;
  - Lesta nickname only if the creator publicly states it (source link stored), labelled «по открытым данным»;
  - a visible «Удалить мою страницу» / «Это вы?» link on every editorial entry; removal requests are honoured within 72 h and the entry is tombstoned (slug blocked from re-creation).
- **Fair play:** Lesta's forbidden list (support article 15152): enemy positions/lit markers beyond the client, enemy aim/trajectory, enemy reload timers, «умные» sights (auto-aim, weak-spot, lead calculation), object transparency, ally-spot markers on the field, gun direction on the minimap, nearest-enemy / off-screen enemy indicators, battle armour analysis (warned, to be banned). Penalties 7 d → 30 d → permanent. We link only to mods that are published on МОСТ **or** pass our moderator checklist (§2.4). Modpacks that bundle a "penetration zone skin" are fine today (skins), but in-battle armour analysis is not — the checklist says so explicitly.
- **Consent for featuring:** claimed = explicit consent. Editorial = public-interest directory of public channels with opt-out. We send no messages to creators without them contacting us, except one invitation through a public business contact if they list one.

## 2. Feature: «Блогеры и стримеры» directory

### 2.1 Entries

One `StreamerProfile` per creator, two kinds:

| | Claimed | Editorial |
|---|---|---|
| Created by | The creator in `/me/streamer` (exists today) | Moderator in the admin API |
| `userId` | Set | `null` |
| Lesta account | Verified: must be linked to the user through Lesta ID (exists today) | Public nickname with a `sourceUrl`; badge «не подтверждено» |
| Platforms | Creator enters; Twitch/VK verified through the existing OAuth integrations | Moderator enters, each with `sourceUrl` |
| Settings | Creator publishes | Moderator enters from public sources, each group with `sourceUrl` + `checkedAt` |
| Badge | «Подтверждён» | «Страница по открытым данным» + «Это вы? Заберите профиль» |

### 2.2 Claim flow

1. «Это вы?» → sign in with Lesta ID (our only login) → choose a proof:
   - **Platform OAuth** (preferred, instant): Twitch or VK Видео Live OAuth; the authorised channel must equal a channel on the entry. Twitch OAuth exists in `streamers/integrations`.
   - **Code in bio**: we show `otmetki-XXXXXX`; the creator puts it in the Twitch/VK/YouTube channel description or pins it in the Telegram channel; we check via API (Twitch `users.description`, VK `channel.description`, YouTube `channels.list snippet.description`) or a moderator checks Telegram manually.
   - **Manual**: moderator review with evidence (fallback).
2. On success the entry becomes claimed: `userId` set, editorial settings kept but marked «внесено редакцией» until the creator confirms or edits them. The creator can also **delete** the page entirely.
3. Conflicts: if the user already has a claimed profile, the claim merges links and settings into it and tombstones the editorial slug with a redirect.

### 2.3 Cards and pages

- **Directory `/streamers`** (see open question Q1 about the current landing): grid of cards. Filters: «в эфире», platform, «играет на танке X», tank type, has settings, claimed only. Sort: live first → viewers → WN8 → marks.
- **Card:** avatar (platform), handle, platform icons (Twitch, VK Видео Live, YouTube, Trovo, Telegram, Boosty), live pill with viewers and current tank («в эфире на Объект 279 (р)»), WN8 / WR / battles (our data), three-mark count, top-3 favourite tanks (most battles last 30 days), «Есть настройки» chip.
- **Streamer page `/s/[slug]`** (exists) gets tabs: Обзор (existing hero/links/stats + schedule + latest videos/clips), Настройки (§3), Танки (favourites, marks, MoE on tanks they stream), Сборки (their `Build` entries, if claimed).

### 2.4 Fair-play checklist for linked mods and sights

A moderator marks each `ModReference` (§5) as `approved` only if all hold:

1. Published on МОСТ, **or** the functionality is visibly a subset of the standard client (reticle shape/colour, zoom steps, hangar, sound, damage log of own damage, own session stats).
2. None of Lesta's forbidden categories (§1.5). Sights: no lead, auto-aim, weak-spot highlighting or "penetration indicator" that computes armour in battle.
3. Link goes to the author's official page (not a mirror/repack site).
4. A "last checked" date and client version; re-check on each major patch (a job flags entries older than the current `GameVersion`).

Modpacks are listed as "modpack X, preset Y" with a link to the official page; we do not audit the full content of a modpack but show a disclaimer: «Состав модпака определяет автор. Моды из запрещённых категорий приводят к блокировке».

## 3. Feature: «Настройки стримеров»

### 3.1 Data model (shape, in `@otmetki/schemas`)

`streamerSettingsSchema` — every group optional, every group carries provenance:

```ts
const provenance = { source: z.enum(['creator', 'editorial', 'mod', 'preferences']), sourceUrl: z.url().nullable(), checkedAt: isoDateTimeSchema };

const displaySettingsSchema = z.object({
  resolution: z.string().regex(/^\d{3,5}x\d{3,5}$/).optional(),
  refreshRate: z.number().int().min(30).max(540).optional(),
  windowMode: z.enum(['fullscreen', 'borderless', 'windowed']).optional(),
  client: z.enum(['sd', 'hd']).optional(),
  preset: z.enum(['minimum', 'low', 'medium', 'high', 'maximum', 'ultra', 'custom']).optional(),
  overrides: z.record(graphicsOptionSchema, z.string()).optional(),
  fpsCap: z.number().int().optional(),
  vsync: z.boolean().optional(),
  ...provenance
});
// cameraSettingsSchema: fov, dynamicFov [min,max], postMortem, sniperDynamicCamera, horizontalStabilisation
// controlsSettingsSchema: sensitivity { arcade, sniper, artillery }, invert, notableBinds
// zoomSettingsSchema: steps: z.array(z.enum(['x2','x4','x8','x16','x25'])), zoomModRef
// sightSettingsSchema: arcade/sniper { reticle, gunMarker: 'server'|'client', colour }, sightModRef
// markersSettingsSchema, minimapSettingsSchema, soundSettingsSchema, battleUiSettingsSchema
// hardwareSchema: cpu, gpu, ramGb, monitor, mouse, mouseDpi, pollingHz, pad, keyboard, headset
// modsSchema: { kind: 'clean' | 'modpack' | 'custom', modpackRef, preset, modRefs[] }
```

Enums of client options (`graphicsOptionSchema`, marker fields, minimap fields) live in `packages/schemas/src/streamer-settings/streamer-settings.constants.ts` as one `as const` object, so the form, the compare view, the aggregates and the mod applier use the same keys.

### 3.2 Entry

- **Claimed:** `/me/streamer` → new «Настройки игры» panel: a grouped form (react-hook-form + zod, one `use-streamer-settings-form` hook), plus two importers:
  - «Импорт из игры» via our mod (§3.5) — preferred;
  - «Импорт preferences.xml» — parsed in the browser (WP6).
  Each save creates a `StreamerSettingsVersion`, so the page shows «обновлено DD.MM» and a history diff.
- **Editorial:** moderator enters groups with `sourceUrl` (YouTube link with timestamp, nidin.ru page, VK post) and `checkedAt`.

### 3.3 Views

- **`/s/[slug]/settings`**: grouped read-only cards; every group shows its source and date; «Скопировать как текст»; «Применить через мод»; modpack/sight rows link to the official page.
- **`/streamers/settings`**: table of all creators with settings — columns sens (sniper), FOV, preset, zoom max, modpack, GPU; sortable (TanStack Table), filter by field.
- **Compare `/streamers/settings/compare?a=jove&b=near-you&me=1`**: 2–4 creators + optionally "мои настройки" (from the viewer's own mod export), diff highlighted per field.
- **Aggregates «Что ставят топ-игроки»**: per field distribution (e.g. "sniper sens: median 0.32, 60 % use x16 max zoom, 45 % play on 'medium' + effects high") for three cohorts: creators; top players by our rating (WN8 ≥ unicum band); everyone who shared. Data: creators' settings + **opt-in** mod exports. A cohort shows only with **k ≥ 20** contributors; individual non-creator settings are never shown.

### 3.4 "Download" — what we may offer

| Offer | Allowed? | How |
|---|---|---|
| Streamer's modpack / sight mod file | **No** | Link to the author's official page |
| Streamer's screenshots / video | **No** | Link, or platform embed |
| Streamer's raw preferences.xml | **No** (personal data, and the file is theirs) | — |
| Structured values as text / JSON | Yes (facts; for claimed profiles the creator publishes them) | «Скопировать» and `GET /streamers/:slug/settings.json` |
| Apply standard client settings | Yes | Our mod, hangar only, with preview, backup and one-click restore (§3.5) |
| Generated `preferences.xml` fragment | Not in v1 | Too fragile (pickled sections, version-specific); revisit if §3.5 cannot cover a group |

### 3.5 Mod: export and apply (hangar only)

- **Export:** in the hangar, «Поделиться настройками» reads standard client settings through the game's settings core (not the file), builds `streamerSettingsSchema`-compatible JSON **without** login/account keys, and sends it through the existing mod ingest (bound `ModDevice`). The user chooses the target: "my profile" (claimed creators), "private" (for compare with "мои настройки"), and a separate opt-in checkbox "учитывать анонимно в статистике".
- **Apply:** from `/s/[slug]/settings` → «Применить через мод» → the site stores a pending "apply request" for the user's device → the mod shows a hangar dialog with the diff, excluding resolution and sensitivity by default (Korben's precedent — hardware-specific) → on confirm it backs up current settings and applies. «Вернуть мои» restores the backup.
- Scope: only standard client settings (graphics, camera, zoom steps, sight/marker/minimap options, sound). **Never** installs or configures third-party mods. Fair-play neutral: identical to changing settings by hand.
- Python 2.7, `apps/game/modpack`; unit tests in the mod's suite; verify the settings-core API on the Lesta 1.45 client first **[unverified API names]**.

## 4. More feature ideas

| # | Feature | Data source | Effort | Tier |
|---|---|---|---|---|
| 1 | **Live now on tank X**: "в эфире на Об. 279 (р)", directory filter by tank; "who is streaming the tank I'm grinding" on tank pages | Twitch/VK live + our mod battle feed (`liveTankId`, exists) or Lesta `account/tanks` battle delta for public nicknames | M | Free |
| 2 | **Live alerts**: notify (Telegram/web push, existing `notifications`) when a followed creator goes live, optionally only on a given tank | Live poller + `StreamerFollow` | S | Free: 3 follows; Plus: unlimited + tank filter (capacity, per Plus §2.3) |
| 3 | **Schedules**: weekly schedule on card and page; "next stream in 2 h" | Claimed input (`schedule` Json exists) + Twitch `/helix/schedule` | S | Free |
| 4 | **Clips & videos**: latest YouTube uploads (RSS), top Twitch clips of the week in the МТ category, platform embeds only | YouTube RSS, Twitch clips API | S | Free |
| 5 | **Streamer builds**: creators publish tank loadouts (equipment, crew, consumables) as `Build` entries; "как у стримера" on tank pages | Existing `community-builds` + `packages/gamedata` | S | Free |
| 6 | **Sight/crosshair gallery** with fair-play check: preview images supplied by the author with permission (or none), description, link to official page, МОСТ badge, "проверено для 1.45" | Editorial + author submissions | M | Free |
| 7 | **Settings wizard**: "your GPU + monitor → recommended preset and overrides" and "sens like creators with similar DPI" | Creators' settings + opt-in mod FPS samples per preset (`fps` + GPU model string only) | L | Free basic; Plus: "your FPS by preset from your own battles" (own-data analytics) |
| 8 | **My settings history & impact** (own data): versions of your own settings and accuracy/damage before vs after a change | Mod export + our battle data | M | Plus (depth on own data) |
| 9 | **Marks race among creators**: leaderboard of creators by 3-marks count, MoE % on the tank they are streaming now | Our marks data | S | Free |
| 10 | **Twitch/VK panel with settings**: extension panel shows the streamer's settings and current tank under the player | features.md §14 #20 + settings API | M | Free for streamers |
| 11 | **Chat command `!settings` / `!sens`** in existing chat integrations, replying with a link and the key values | `chat-command` lib (exists) | S | Free |
| 12 | **Creator challenges on tanks** (exists) surfaced on cards: "принимает челленджи" chip | Existing `Challenge` | S | Free |

## 5. Data model (Prisma, `apps/web/server/prisma/schema/streamers.prisma`)

`db push`, no migrations (pre-prod). Changes:

```prisma
enum StreamerProfileKind {
  claimed
  editorial
  @@map("streamer_profile_kind")
}

enum StreamerPlatform {
  twitch
  vkVideoLive @map("vk_video_live")
  youtube
  trovo
  telegram
  boosty
  vk
  @@map("streamer_platform")
}

model StreamerProfile {
  id     String  @id @default(dbgenerated("gen_random_uuid()"))
  userId String? @unique @map("user_id")          // null for editorial
  kind   StreamerProfileKind @default(claimed)
  slug        String  @unique
  displayName String  @map("display_name")
  accountId   BigInt? @map("account_id")
  accountSourceUrl String? @map("account_source_url") // editorial only
  bio         String?
  schedule    Json?
  isLive        Boolean   @default(false) @map("is_live")
  liveTankId    Int?      @map("live_tank_id")
  liveViewers   Int?      @map("live_viewers")
  livePlatform  StreamerPlatform? @map("live_platform")
  liveCheckedAt DateTime? @map("live_checked_at") @db.Timestamptz(3)
  hiddenAt      DateTime? @map("hidden_at") @db.Timestamptz(3)   // removal request / tombstone
  // links Json is replaced by StreamerChannel rows
  ...timestamps, user relation (optional), channels, settings, claims
  @@index([kind, isLive])
}

model StreamerChannel {
  id         String @id @default(dbgenerated("gen_random_uuid()"))
  profileId  String @map("profile_id")
  platform   StreamerPlatform
  handle     String                   // normalised login / channel slug
  url        String
  externalId String? @map("external_id") // Twitch user id, VK channel id, YouTube channel id
  verifiedAt DateTime? @map("verified_at") @db.Timestamptz(3)
  sourceUrl  String?  @map("source_url")
  @@unique([platform, handle])
  @@index([profileId])
}

model StreamerClaim {
  id         String @id @default(dbgenerated("gen_random_uuid()"))
  profileId  String @map("profile_id")
  userId     String @map("user_id")
  method     String                   // 'oauth' | 'bio_code' | 'manual'
  code       String?
  status     ReportStatus             // reuse admin enum or a new one
  evidence   String?
  resolvedBy String? @map("resolved_by")
  createdAt / resolvedAt
  @@index([status])
}

model StreamerSettings {                // current published settings, one row per profile
  profileId String @id @map("profile_id")
  data      Json                        // streamerSettingsSchema, validated on write
  updatedAt DateTime @updatedAt
}

model StreamerSettingsVersion {
  id        String @id @default(dbgenerated("gen_random_uuid()"))
  profileId String @map("profile_id")
  data      Json
  source    String                      // creator | editorial | mod | preferences
  createdBy String? @map("created_by")
  createdAt DateTime @default(now())
  @@index([profileId, createdAt(sort: Desc)])
}

model PlayerSettingsShare {             // opt-in mod exports of ordinary users
  userId     String  @id @map("user_id")
  accountId  BigInt? @map("account_id")
  data       Json
  anonymousStats Boolean @default(false) @map("anonymous_stats")
  updatedAt  DateTime @updatedAt
}

model SettingsApplyRequest {            // site → mod "apply these settings"
  id        String @id @default(dbgenerated("gen_random_uuid()"))
  userId    String
  deviceId  String?
  profileId String
  groups    String[]
  status    String                      // pending | applied | rejected | expired
  createdAt / appliedAt
}

model ModReference {                    // modpacks, sight mods, zoom mods — links only
  id          String @id @default(dbgenerated("gen_random_uuid()"))
  kind        String                    // modpack | sight | zoom | other
  name        String
  author      String
  officialUrl String @map("official_url")
  onMost      Boolean @default(false) @map("on_most")
  fairPlay    ModerationStatus          // pending | published | hidden
  checkedGameVersionId Int? @map("checked_game_version_id")
  checkedAt   DateTime?
  notes       String?
}

model StreamerFollow {
  userId    String
  profileId String
  tankId    Int?
  createdAt DateTime @default(now())
  @@id([userId, profileId])
}
```

Aggregates: a materialised table `SettingsAggregate(cohort, field, bucket, count, computedAt)` recomputed daily by a worker job; cohorts with fewer than 20 contributors are not written.

Refactor note: `StreamerProfile` PK moves from `userId` to `id`; `Overlay`, `Challenge`, `StreamerIntegration` stay keyed by `userId` (they belong to a user, not to an entry). `streamer-profile.service.ts` switches `findUnique({ where: { userId } })` to the `userId` unique index — same call shape. `links` Json moves into `StreamerChannel` (data copy script in WP1; pre-prod so dropping the column is fine).

## 6. API (NestJS, `apps/web/server/src/modules/streamers`)

Public:
- `GET /streamers` — directory (filters: live, platform, tankId, hasSettings, kind; cursor pagination).
- `GET /streamers/live` — live-now list (cached 60 s).
- `GET /streamers/:slug` (exists) — add channels, favourite tanks, marks, live block.
- `GET /streamers/:slug/settings`, `GET /streamers/:slug/settings.json`, `GET /streamers/:slug/settings/history`.
- `GET /streamers/settings` (table), `GET /streamers/settings/compare?slugs=`, `GET /streamers/settings/aggregates?cohort=`.
- `POST /streamers/:slug/claim`, `POST /streamers/:slug/removal-request` (no auth required for removal requests; rate-limited, email or channel proof).

Claimed (`me`):
- `PUT /streamers/me/channels`, `PUT /streamers/me/settings`, `POST /streamers/me/settings/import` (structured payload from the browser parser).
- `POST /me/settings/apply` (create `SettingsApplyRequest`), `GET/PUT /me/settings/share`.
- `PUT /streamers/:slug/follow`, `DELETE …/follow`.

Mod ingest (`modules/mod`): `POST /mod/settings` (export), `GET /mod/settings/apply` (pending requests), `POST /mod/settings/apply/:id/result`.

Moderator (`@Roles([...MODERATION.roles])`, same pattern as `moderation.controller.ts`):
- `POST/PATCH/DELETE /admin/streamers` (editorial entries), `PUT /admin/streamers/:id/settings`, `GET/POST /admin/streamers/claims`, `GET/PATCH /admin/mod-references`.

Contracts: `packages/schemas/src/streamers/` (directory, channels, claims) and a new `packages/schemas/src/streamer-settings/` (settings, compare, aggregates, apply). Server DTOs in `streamers/dto/` via `createZodDto` as today.

Worker (`streamers-worker.module.ts`, `config/queue.config.ts`): new jobs `live-poll` (every 60 s: Twitch batch 100 logins, VK `POST /v1/channels` batch; YouTube every 15 min for claimed only), `live-tank` (every 30 s for live creators with a Lesta account: mod feed first, else `account/tanks` delta), `settings-aggregate` (daily), `mod-reference-recheck` (on new `GameVersion`). New lib pure functions with `_tests`: `lib/live-status` (merge platform responses → profile live state), `lib/settings-diff`, `lib/settings-aggregate` (k-threshold, bucketing), `lib/claim-code`.

## 7. Client (FSD, `apps/web/client`)

- `app/[locale]/(site)/streamers/page.tsx` → directory view; current landing moves to `app/[locale]/(site)/for-streamers/page.tsx` (Q1).
- `app/[locale]/(site)/streamers/settings/page.tsx`, `…/streamers/settings/compare/page.tsx`, `app/[locale]/(site)/s/[slug]/settings/page.tsx`.
- `views/streamers-directory/` (new; `ui/StreamersDirectoryPage`, components `StreamerCard`, `LivePill`, `DirectoryFilters`; `model/hooks/use-streamers-directory`; `config/directory.constants.ts`).
- `views/streamer-settings/` (per-creator settings page), `views/streamers-settings-table/`, `views/streamers-settings-compare/` (+ `lib/settings-diff` shared from `entities`).
- `views/streamer/` (exists): add tabs, `ClaimBanner` for editorial entries, `StreamerChannels` replaces `StreamerLinks`.
- `views/streamer-studio/ui/components/`: new `SettingsPanel`, `SettingsGroupFields/*`, `SettingsImportMod`, `SettingsImportXml`, `ChannelsPanel` (replaces `ProfileLinksFields`); hook `model/hooks/use-streamer-settings-form`.
- `entities/streamer/`: `ui/PlatformIcon`, `ui/SettingsValue`, `lib/settings-format`, `lib/preferences-parser` (browser-only whitelist parser; tests with a real anonymised fixture).
- `features/streamer/follow-streamer`, `features/streamer/claim-profile`, `features/streamer/apply-settings`.
- i18n namespaces: `streamers-directory`, `streamer-settings` in `shared/i18n/locales/{ru,en}`.
- Platform icons: `@otmetki/icons` (VK Видео Live, Boosty, Trovo if missing).

## 8. Work packages

| WP | Scope | Main paths | Effort |
|---|---|---|---|
| **WP0** | Legal: 152-ФЗ art. 10.1 reading for editorial entries; removal policy text; check one real Lesta `preferences.xml` for personal-data sections | docs only | S |
| **WP1** | Profile refactor: `id` PK, nullable `userId`, `kind`, `StreamerChannel`, `hiddenAt`; move `links` → channels; update `streamer-profile.service`, studio `ProfileLinksFields` → `ChannelsPanel` | `prisma/schema/streamers.prisma`, `streamers/services/streamer-profile.service.ts`, `packages/schemas/src/streamers`, `views/streamer-studio` | M |
| **WP2** | Live status: Twitch app token + Helix streams, VK Видео Live DevAPI channels, YouTube (claimed), `live-poll` job, `lib/live-status`; live tank from mod feed / `account/tanks` | `streamers/services/live-status.service.ts`, `streamers/processors`, `config/queue.config.ts`, `config/integrations.config.ts`, env `VK_LIVE_CLIENT_ID/SECRET`, `YOUTUBE_API_KEY` | M |
| **WP3** | Directory: API `GET /streamers`, `/streamers/live`; cards with our stats, favourite tanks, marks; landing move | `streamers.controller.ts`, new `streamer-directory.service.ts`, `views/streamers-directory`, `app/.../streamers`, `app/.../for-streamers` | M |
| **WP4** | Editorial + claims: admin endpoints, `StreamerClaim`, OAuth / bio-code / manual proofs, removal requests, tombstones | `streamers/services/streamer-claim.service.ts`, `streamers/controllers/admin-streamers.controller.ts`, `features/streamer/claim-profile` | M |
| **WP5** | Settings core: schemas + constants, `StreamerSettings(+Version)`, studio `SettingsPanel`, public settings page, table, compare, `ModReference` with fair-play workflow | `packages/schemas/src/streamer-settings`, `streamers/services/streamer-settings.service.ts`, `views/streamer-settings*`, `views/streamer-studio` | L |
| **WP6** | Browser `preferences.xml` import (whitelist; skip or safely read pickled blobs); fixture-based tests | `entities/streamer/lib/preferences-parser`, `SettingsImportXml` | M |
| **WP7** | Mod export/apply: settings-core reader/applier with backup, ingest endpoints, `SettingsApplyRequest`, `PlayerSettingsShare` | `apps/game/modpack`, `modules/mod`, `features/streamer/apply-settings` | L |
| **WP8** | Aggregates: daily job, k ≥ 20, cohorts (creators / top by rating / all opt-in), page section | `streamers/lib/settings-aggregate`, `processors`, `views/streamers-settings-table` | M |
| **WP9** | Extras from §4 in order: follows + alerts (2), schedules (3), clips/videos (4), `!settings` chat command (11), builds (5), marks race (9), sight gallery (6), wizard (7), own settings impact (8, Plus) | respective modules | S–L each |

Order: WP0 → WP1 → WP2 + WP3 (directory ships with claimed profiles only) → WP4 (editorial entries go live only after WP0) → WP5 → WP7 → WP6 → WP8 → WP9.

Verification per WP: `bun run verify`, targeted `bun run test` for new `lib/*` and services, `bun run test:modpack` for WP7; no `next build`.

## 9. Open questions

- **Q1.** `/streamers` today is the landing for streamer tools. Proposal: directory takes `/streamers`, landing moves to `/for-streamers`, linked from the directory header («Вы стример? Инструменты →»).
- **Q2.** Launch editorial entries at all, or only claimed + invitations? Editorial gives a full directory on day one but carries the 152-ФЗ risk (WP0).
- **Q3.** Should "Применить через мод" include sensitivity when both users report DPI? (Default: excluded.)
- **Q4.** Which RU creators to seed first (proposal: those with a public settings page or modpack preset — NIDIN, Korben, Jove, ПРОТанки/Юша, Near_You, Amway921, Левша — invited to claim).

## Sources

- Lesta support, cache and preferences: https://lesta.ru/support/ru/products/mt/article/34385/ ; tankist.net cache guide: https://tankist.net/utility/cache
- Lesta forbidden modifications: https://lesta.ru/support/ru/products/mt/article/15152/
- Lesta wiki, game settings: https://wiki.lesta.ru/ru/Мир_танков:Настройка_игры
- preferences.xml contents (WoT era): https://wot-news.com/track/post/ru/Knopka/1398437417
- Jove modpack: https://joves-modpack.ru/ , https://joves-modpack.ru/faq , https://tankist.net/modpacks/jove
- Near_You modpack: https://cyber.sports.ru/wotblitz/blogs/3417104.html
- Creator modpacks overview: https://taverna.gg/industry/guides/mody-v-mire-tankov-kakoe-mesto-zanimayut-reakcziya-razrabotchikov-i-top-luchshih/
- Korben modpack (applies his settings): https://mirtankov.su/mody/sborki-modov/modpak-korbena-dlya-world-of-tanks
- ПРОТанки presets: https://tankist.net/modpacks/protanki
- NIDIN client settings: https://nidin.ru/game-settings
- prosettings streamers: https://www.prosettings.com/team/streamers/
- VK Видео Live DevAPI: https://dev.live.vkvideo.ru/docs/method/channel , https://www.cnews.ru/news/line/2025-03-21_vk_video_live_otkryvaet_devapi

## Decisions (2026-09-26)

- **Q1.** The directory goes to `/streamers`. The streamer-tools landing moves to `/for-streamers`, and the old links redirect there.
- **Q2.** Only claimed profiles plus invitations go live. Editorial entries are built behind the `STREAMERS.editorialEnabled = false` flag. When the flag is on, an entry holds only a handle and public channel links, with removal on request. Turning the flag on waits for a legal review under 152-ФЗ art. 10.1.
- **Q3.** «Применить через мод» never touches sensitivity or resolution by default. The user opts in per setting group.
- **Q4.** The seed list is NIDIN, Korben, Jove, ПРОТанки, Near_You, Amway921 and Левша. It is used for invitations first, and for editorial entries only when the flag is on.
