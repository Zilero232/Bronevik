# First production deploy

A checklist for the first rollout of Три отметки to `https://triotmetki.ru` (site) and `https://api.triotmetki.ru` (API, developer API `/v1`, auth, mod ingest). Later deploys are the same workflow run with nothing but the image changes.

What runs where:

- **CI and images.** [.github/workflows/deploy.yml](../../.github/workflows/deploy.yml) is started by hand (`workflow_dispatch`). It runs `verify`, `test`, the mod suite and the e2e smoke, builds `ghcr.io/<owner>/otmetki-client` and `otmetki-server`, and then deploys to the VPS.
- **The VPS** keeps no clone of the repo. Every run copies [docker-compose.yml](../../docker-compose.yml) and [infra/caddy/Caddyfile](../../infra/caddy/Caddyfile) into `DEPLOY_PATH`, runs `docker compose pull`, runs `bun run db:deploy` in a one-off `server` container, runs `docker compose up -d`, and waits for `otmetki-server` and `otmetki-client` to report healthy.
- **The stack:** Caddy (80/443, Let's Encrypt), then client (Next standalone, :3000), then server (API, :4000). The worker runs from the same server image. Postgres/TimescaleDB listens on loopback `127.0.0.1:5432` only. Redis runs with AOF and `noeviction`.

## 1. Before the first run

### Accounts and external applications

- [ ] **Lesta API: register our own application** at [developers.lesta.ru](https://developers.lesta.ru). Use the **Server** type and add the VPS public IP to the allowed IPs. Put its id in `LESTA_APPLICATION_ID`.
  - Never reuse a key from another project or a personal test key. The limits and the terms ([docs/research/lesta-api.md](../research/lesta-api.md)) apply per application.
  - Allow the Lesta ID (OpenID) redirect to `https://api.triotmetki.ru/auth/lesta/callback`.
  - `LESTA_RPS` is the total across all processes: 20 per registered IP. Raise it only after you add IPs to the application.
  - Without a key, production does **not** start the mock. The worker starts degraded: it logs a warning and runs no Lesta jobs.
- [ ] **DNS:** `A`/`AAAA` records for `triotmetki.ru` and `api.triotmetki.ru` point at the VPS. Ports 80, 443/tcp and 443/udp are open. Caddy needs port 80 for the HTTP-01 challenge.
- [ ] **Optional integrations.** Every one of these can stay empty; an empty value switches the feature off:
  - Telegram bot (`TELEGRAM_*`; webhook `https://api.triotmetki.ru/telegram/webhook`);
  - Discord application (`DISCORD_*`);
  - VK community, VK Mini App and VK ID (`VK_*`; Callback API `https://api.triotmetki.ru/vk/callback`);
  - Twitch application (`TWITCH_*`; OAuth callback `/streamers/integrations/twitch/callback` on the API);
  - DonationAlerts (`/streamers/integrations/donation-alerts/callback`);
  - VK Video Live and YouTube keys;
  - SMTP;
  - VAPID keys (`bunx web-push generate-vapid-keys`);
  - S3 bucket for replays (`REPLAY_STORAGE=s3`).

  Social sign-in callbacks follow better-auth: `https://api.triotmetki.ru/auth/callback/<provider>`.
- [ ] **YooKassa:** only when checkout opens (see §5). Its webhook goes to `https://api.triotmetki.ru/billing/webhook`.

### GitHub repository secrets

Set these under Settings → Secrets and variables → Actions, in the `production` environment where you can:

| Secret | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://api.triotmetki.ru`. The value is baked into the client image at build time, so changing it later means rebuilding the image. |
| `DEPLOY_SSH_HOST`, `DEPLOY_SSH_USER`, `DEPLOY_SSH_PORT` (optional, default 22) | the VPS |
| `DEPLOY_SSH_KEY` (preferred) or `DEPLOY_SSH_PASSWORD` | SSH credentials |
| `DEPLOY_PATH` | directory with the compose file, for example `/opt/otmetki` |

The workflow passes `GIT_COMMIT_SHA=${{ github.sha }}` to the client image by itself. With `NEXT_PUBLIC_APP_VERSION` (the root `package.json` version), it forms the service worker's precache revision. A client built without it (for example a local `docker compose build`) keeps the same revision across builds, so returning visitors keep stale precached files. When you build by hand, export `GIT_COMMIT_SHA=$(git rev-parse HEAD)` first. The server image takes no build arguments.

The VPS must be able to pull from ghcr. Make the packages public, or run `docker login ghcr.io` once on the VPS with a read-only token.

### The VPS `.env` (in `DEPLOY_PATH`)

Start from [.env.example](../../.env.example). The server and worker containers read `./.env` (`env_file`). Compose itself overrides `DATABASE_URL`, `DIRECT_URL` and `REDIS_URL` to reach the containers by name, and forces `NODE_ENV=production` on the server and worker.

- [ ] `NODE_ENV=production`. Once `API_URL` is not a local host, `validateEnv` refuses to boot while `NODE_ENV` is unset.
- [ ] **Secrets.** Generate fresh values with `openssl rand -base64 32`:
  - `BETTER_AUTH_SECRET`: at least 32 characters.
  - `MOD_INGEST_SECRET`: the root of every mod device key. Rotating it unbinds every device.
  - In production, the server **refuses to start** when either secret still looks like a development placeholder. The check matches `change-me`, `changeme`, `dev-secret`, `dev-mod-secret`, `test-secret`, `example` or `placeholder` (`ENV_GUARD` in `apps/server/src/config/env/env.constants.ts`), so copying `.env.example` unchanged fails loudly.
- [ ] `API_URL=https://api.triotmetki.ru`, `WEB_URL=https://triotmetki.ru`. `CORS_ORIGINS` stays empty unless another origin needs the API.
- [ ] `TRUSTED_PROXIES`: leave it empty for the stock stack. The only hop is Caddy, which sends a single-entry `X-Forwarded-For`, and the default trusts one hop. Once a CDN or load balancer sits in front of Caddy, list its IPs or CIDRs (comma-separated). If you skip that, rate limits and the better-auth IP checks see the proxy's IP as every client's.
- [ ] `DATABASE_POOL_MAX`: leave it unset at first. The API then keeps 10 connections and the worker sizes its pool from its queue concurrency (`WORKER_DATABASE.poolMax`). Set it only when Postgres `max_connections` is tight. The variable applies per process, so the API and the worker each take that many.
- [ ] `POSTGRES_USER`, `POSTGRES_PASSWORD` (strong), `POSTGRES_DB`, `SITE_DOMAIN=triotmetki.ru`, `API_DOMAIN=api.triotmetki.ru`. Compose reads them for Postgres and Caddy.
- [ ] `LESTA_APPLICATION_ID`, `LESTA_RPS`. `LESTA_MOCK` has no effect in production.
- [ ] `EMAIL_FROM` on our domain (for example `Три отметки <noreply@triotmetki.ru>`), with SPF and DKIM for the SMTP provider. `VAPID_SUBJECT=mailto:admin@triotmetki.ru`.
- [ ] `BULL_BOARD_PASSWORD`: Caddy returns 404 for `/admin/queues` on the public host anyway. Reach bull-board through an SSH tunnel to the server container.
- [ ] `REPLAY_STORAGE=s3` and the `S3_*` values, or keep `local`. Local storage lives in the container's `.data`: mount a volume for it before you rely on it, because the compose file mounts none.

## 2. Database: `db:deploy` and its order

The deploy runs `docker compose run --rm --no-deps server bun run db:deploy` **before** `up -d`. That script runs three steps, in this order:

1. `bun scripts/timescale.ts --extensions` creates `pg_trgm` and `timescaledb` (the trigram indexes need them before `db push`). It also **drops a stale continuous aggregate**: `tank_daily_stats` carries a comment with the hash of `prisma/sql/timescale/003_continuous_aggregates.sql`. When the stored hash differs or is missing (always the case on the first run), the view is dropped here, so `prisma db push` can change the `tank_battle_delta` columns it depends on.
2. `prisma db push` syncs the schema. There are no migrations before production. A push that would lose data fails instead of running, and the deploy stops before any container restarts.
3. `bun run db:timescale` sets up hypertables, compression, `tank_snapshot_latest`, and the continuous aggregate (recreated, stamped with the new hash, backfilled in full), then applies the retention, compression and refresh policies from `TIMESCALE`. Every statement is idempotent.

`db:push` is the development twin: the same steps plus `prisma generate`. The image already generated the client during its build.

On the first run, or after an edit to `003_continuous_aggregates.sql`, the full backfill of `tank_daily_stats` makes step 3 slower. Keep that in mind for the SSH step timeout on a large database.

## 3. After the first successful run

- [ ] `https://api.triotmetki.ru/health` is green: database, Redis, worker heartbeat, and the Lesta breaker closed. The worker log says `registered N of M … job schedulers`, and no "degraded" warning appears.
- [ ] **Game data.** The API catalog fills from Lesta through the nightly encyclopedia sync. Builds, armor, personal missions and patch diffs need the client files import, `bun run gamedata:import` (`apps/server/scripts/gamedata-import.ts`). Run it once against the production database, for example from a checkout through an SSH tunnel to `127.0.0.1:5432`, with `GITHUB_TOKEN` set for the GitHub rate limit. Run it again after every game patch.
- [ ] Optional: `bun --filter @otmetki/server streamers:seed` loads the invited streamer list.
- [ ] Sign in with Lesta ID and with Telegram on the live site. Check that the footer shows the Lesta attribution on every page.
- [ ] Check `https://triotmetki.ru/sitemap.xml` and `/robots.txt`. The sitemap reads the API at build or request time, so it fills once the collector has data.

## 4. Game mod: rebuild for v2 signing

The API accepts only **v2** request signatures (`MOD_REQUEST.version = 'v2'`: HMAC over `v2\n<METHOD>\n<path>\n<timestamp>\n<nonce>\n<body>`, a 5-minute skew window and a one-time nonce). A mod package built before v2 signing is rejected, so every published `.wotmod` must be rebuilt:

- [ ] Check that `DEFAULT_SERVER_URL` in `apps/mod/src/otmetki/config.py` is `https://api.triotmetki.ru`.
- [ ] Bump `VERSION` in `apps/mod/src/otmetki/version.py`.
- [ ] Run `python apps/mod/build.py --require-pyc` (a release build, which needs Python 2.7).
- [ ] Publish the package on the site (`SITE.downloadUrl` is `https://triotmetki.ru/downloads/otmetki.wotmod`) and through МОСТ. See [apps/mod/README.md](../../apps/mod/README.md).
- [ ] Users bind their devices again with a code from `/me`. Devices bound in development do not exist in production.

## 5. Legal pages and Plus: fill before checkout opens

- [ ] `/privacy`, `/terms` and `/contacts` are **drafts**. They render a "draft" banner, and every `<todo>…</todo>` in `apps/client/shared/i18n/locales/{ru,en}/legal.json` (13 per language) must be filled before launch:
  - operator full name or company name, ИНН (TIN), ОГРН/ОГРНИП (PSRN), address and contact e-mail;
  - effective dates;
  - hosting provider and region;
  - payment provider name and refund terms;
  - retention period;
  - cookies and third-party list.

  Once they are filled, drop the draft notice.
- [ ] Plus checkout stays off (`PLUS.checkoutEnabled = false` in `packages/schemas/src/plus`) until Lesta confirms the model in writing (see [docs/research/lesta-api.md](../research/lesta-api.md#monetisation-status)). To open checkout:
  - set `YOOKASSA_*` and the webhook;
  - flip the flag and deploy.

  On the next API boot, `PlusLaunchService` notifies the users who asked to be told (`plusCheckoutOpen`) exactly once.

## 6. Rollback and routine

- The images are tagged only `:latest`. To roll back, re-run the workflow from the previous commit, or `docker compose pull` a pinned digest by hand.
- `db push` has no down-migrations. A schema change that drops a column is caught by the data-loss check above; resolve it by hand before you re-run the deploy.
- The Timescale retention policies and the `RETENTION` purge jobs are part of the Lesta terms. Do not switch them off to save time on a deploy.
