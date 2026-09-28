# First production deploy

A checklist for the first rollout of Три отметки to `https://triotmetki.ru` (site) and `https://api.triotmetki.ru` (API, developer API `/v1`, auth, mod ingest). Later deploys are the same workflow run with nothing but the image changes.

What runs where:

- **CI and images.** [.github/workflows/deploy.yml](../../.github/workflows/deploy.yml) is started by hand (`workflow_dispatch`). It runs `verify`, `test`, the mod suite and the e2e smoke, builds `ghcr.io/<owner>/otmetki-client` and `otmetki-server`, and then deploys to the VPS.
- **The VPS** keeps no clone of the repo. Every run copies [docker-compose.yml](../../docker-compose.yml), [docker-compose.demo.yml](../../docker-compose.demo.yml), [infra/caddy/Caddyfile](../../infra/caddy/Caddyfile) and [infra/caddy/demo.caddy](../../infra/caddy/demo.caddy) into `DEPLOY_PATH`. The files keep their repository paths, because compose bind-mounts `./infra/caddy/Caddyfile`. The run then does `docker compose pull`, runs `bun run db:deploy` in a one-off `server` container, runs `docker compose up -d`, and waits for `otmetki-server` and `otmetki-client` to report healthy.
- **The stack:** Caddy (80/443, Let's Encrypt), then client (Next standalone, :3000), then server (API, :4000).
  - The worker runs from the same server image.
  - Postgres/TimescaleDB listens on loopback `127.0.0.1:5432` only.
  - Redis runs with AOF and `noeviction`.
  - `backup` dumps the database every night (§6).
  - The server and the worker share the `serverdata` volume for local replays and armor models.
  - Every container logs to json-file with rotation (10 MB × 5).
- **Keyless demo:** until the Lesta key exists, the same stack can run on generated data. See [§7 «Демо-деплой без ключей»](#7-демо-деплой-без-ключей-keyless-demo).

## 0. Go-live checklist

This is the status of every area at the last audit. **Ready** means the piece is in the repo and was checked. **Blocked** means it waits on you: an account, a key, a document or a decision.

| Area | Status | What is left |
|---|---|---|
| Images (client, server/worker): multi-stage, non-root, HEALTHCHECK | Ready | — |
| Compose: restart policies, volumes, log rotation, loopback-only Postgres, Redis AOF + `noeviction` | Ready | — |
| TimescaleDB extensions, hypertables, policies (`db:deploy`) | Ready | — |
| Schema sync without data loss (`prisma db push` without `--accept-data-loss`) | Ready | — |
| Caddy: TLS for both hosts, HSTS, security headers, zstd/gzip, SSE excluded, bull-board 404 | Ready | DNS (below) |
| Client CSP, sitemap, robots, service worker revision (`GIT_COMMIT_SHA`) | Ready | The `NEXT_PUBLIC_SITE_URL` secret |
| Nightly `pg_dump` with rotation | Ready | An off-host copy (§6) |
| Keyless demo (`docker-compose.demo.yml`) | Ready | — |
| Health: `/health` (database, Redis, worker heartbeat, Lesta breaker) | Ready | An external uptime monitor on `https://api.triotmetki.ru/health` and `https://triotmetki.ru/` (UptimeRobot, Healthchecks.io or similar) |
| **Lesta application**: `LESTA_APPLICATION_ID`, the VPS IP allow-listed, the OpenID redirect | Blocked | Register at developers.lesta.ru (§1) |
| **DNS**: `A`/`AAAA` for `triotmetki.ru` and `api.triotmetki.ru`; ports 80, 443/tcp and 443/udp open | Blocked | The registrar and the VPS firewall |
| **GitHub secrets**: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`, `DEPLOY_SSH_*`, `DEPLOY_PATH` | Blocked | Settings → Secrets (§1) |
| **VPS `.env` secrets**: `BETTER_AUTH_SECRET`, `MOD_INGEST_SECRET`, `INTERNAL_API_TOKEN`, `POSTGRES_PASSWORD`, `BULL_BOARD_PASSWORD` | Blocked | Generate them on the VPS (§1) |
| ghcr access from the VPS | Blocked | Make the packages public, or run `docker login ghcr.io` with a read-only token |
| **YooKassa**: `YOOKASSA_*`, the webhook | Blocked, not needed for launch | Checkout stays off (`PLUS.checkoutEnabled`) until Lesta confirms the model (§5) |
| **Bots and streamer integrations**: Telegram, Discord, VK, Twitch, DonationAlerts, VK Video Live, YouTube | Blocked, optional | Each one is off while its token is empty |
| **SMTP**: `SMTP_*`, `EMAIL_FROM`, SPF/DKIM | Blocked, optional | Email is off while `SMTP_HOST` is empty. Leave it empty rather than copying the Mailpit values from `.env.example` |
| Web push (`VAPID_*`) | Optional | `bunx web-push generate-vapid-keys` |
| Replays in S3 (`REPLAY_STORAGE=s3`, `S3_*`) | Optional | Local storage on the `serverdata` volume works. S3 also takes replays off the single disk |
| **Legal pages**: operator name, ИНН, ОГРН/ОГРНИП, address, dates, hosting, payments, retention, cookies | Blocked | 13 `<todo>` per language (§5) |
| **Manager updater signing**: `TAURI_SIGNING_PRIVATE_KEY`, `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` | Blocked | Without the key, `manager.yml` still builds the installer but skips the updater archive and its `.sig`, so installed managers cannot update themselves. The key's public half must match `plugins.updater.pubkey` in `tauri.conf.json` |
| Windows code signing of the manager installer | Not set up | The NSIS installer ships unsigned, and SmartScreen warns on the first run |
| Modpack release (`modpack.yml`) | Ready | It needs no secrets. The v2 rebuild and publishing are in §4 |

## 1. Before the first run

### Accounts and external applications

- [ ] **Lesta API: register our own application** at [developers.lesta.ru](https://developers.lesta.ru). Use the **Server** type and add the VPS public IP to the allowed IPs. Put its id in `LESTA_APPLICATION_ID`.
  - Never reuse a key from another project or a personal test key. The limits and the terms ([docs/research/data/lesta-api.md](../research/data/lesta-api.md)) apply per application.
  - Allow the Lesta ID (OpenID) redirect to `https://api.triotmetki.ru/auth/lesta/callback`.
  - `LESTA_RPS` is the total across all processes: 20 per registered IP. Raise it only after you add IPs to the application.
  - Without a key, production does **not** start the mock. The worker starts degraded: it logs a warning and runs no Lesta jobs. The one exception is the explicit demo (`DEMO_MODE=true`, §7).
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
| `NEXT_PUBLIC_SITE_URL` | `https://triotmetki.ru`. Canonical URLs, hreflang, the sitemap and robots.txt are built from it; baked into the client image at build time like the API URL. |
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
  - `INTERNAL_API_TOKEN`: at least 32 characters, no default. Compose passes the same value to the client container (server-only, never `NEXT_PUBLIC_`); the Next server sends it as `x-otmetki-internal-token` with the visitor's IP (`x-otmetki-client-ip`) on every server-side API call, so SSR, prefetches and the entity-presence check are rate-limited per visitor instead of sharing the Next server's bucket. A signed call without a visitor IP (cached renders) gets the separate internal bucket (`THROTTLE.internalLimit`). The API accepts the token only from a loopback/private peer or a `TRUSTED_PROXIES` entry, and Caddy drops the header from its access log. `docker compose` refuses to start without it; rotating it means restarting the client and the server together.
  - In production, the server **refuses to start** when any of these secrets still looks like a development placeholder. The check matches `change-me`, `changeme`, `dev-secret`, `dev-mod-secret`, `test-secret`, `example` or `placeholder` (`ENV_GUARD` in `apps/web/server/src/config/env/env.constants.ts`), so copying `.env.example` unchanged fails loudly.
- [ ] `API_URL=https://api.triotmetki.ru`, `WEB_URL=https://triotmetki.ru`. `CORS_ORIGINS` stays empty unless another origin needs the API.
- [ ] `TRUSTED_PROXIES`: leave it empty for the stock stack. The only hop is Caddy, which sends a single-entry `X-Forwarded-For`, and the default trusts one hop. Once a CDN or load balancer sits in front of Caddy, list its IPs or CIDRs (comma-separated). If you skip that, rate limits and the better-auth IP checks see the proxy's IP as every client's.
- [ ] `DATABASE_POOL_MAX`: leave it unset at first. The API then keeps 10 connections and the worker sizes its pool from its queue concurrency (`WORKER_DATABASE.poolMax`). Set it only when Postgres `max_connections` is tight. The variable applies per process, so the API and the worker each take that many.
- [ ] `POSTGRES_USER`, `POSTGRES_PASSWORD` (strong: use `openssl rand -hex 24`, because the password goes into a connection URL and base64's `/` and `+` break it), `POSTGRES_DB`, `SITE_DOMAIN=triotmetki.ru`, `API_DOMAIN=api.triotmetki.ru`. Compose reads them for Postgres and Caddy.
- [ ] `LESTA_APPLICATION_ID`, `LESTA_RPS`. `LESTA_MOCK` has no effect in production. `DEMO_MODE` and `COMPOSE_FILE` must be absent, because they belong to the demo (§7).
- [ ] `EMAIL_FROM` on our domain (for example `Три отметки <noreply@triotmetki.ru>`), with SPF and DKIM for the SMTP provider. `VAPID_SUBJECT=mailto:admin@triotmetki.ru`.
- [ ] `BULL_BOARD_PASSWORD`: Caddy returns 404 for `/admin/queues` on the public host anyway. Reach bull-board through an SSH tunnel to the server container.
- [ ] `REPLAY_STORAGE=s3` and the `S3_*` values, or keep `local`. Local storage lives in `.data` on the `serverdata` volume, which the server and the worker share.
- [ ] `SMTP_HOST` stays empty unless a real provider is set up. `.env.example` carries the Mailpit values for development.

## 2. Database: `db:deploy` and its order

The deploy first runs `docker compose up -d --wait postgres redis`, so the database is up and healthy even on the very first run. It then runs `docker compose run --rm --no-deps server bun run db:deploy` **before** `up -d`. That script runs three steps, in this order:

1. `bun scripts/timescale.ts --extensions` creates `pg_trgm` and `timescaledb` (the trigram indexes need them before `db push`). It also **drops a stale continuous aggregate**: `tank_daily_stats` carries a comment with the hash of `prisma/sql/timescale/003_continuous_aggregates.sql`. When the stored hash differs or is missing (always the case on the first run), the view is dropped here, so `prisma db push` can change the `tank_battle_delta` columns it depends on.
2. `prisma db push` syncs the schema. There are no migrations before production. A push that would lose data fails instead of running, and the deploy stops before any container restarts.
3. `bun run db:timescale` sets up hypertables, compression, `tank_snapshot_latest`, and the continuous aggregate (recreated, stamped with the new hash, backfilled in full), then applies the retention, compression and refresh policies from `TIMESCALE`. Every statement is idempotent.

`db:push` is the development twin: the same steps plus `prisma generate`. The image already generated the client during its build.

On the first run, or after an edit to `003_continuous_aggregates.sql`, the full backfill of `tank_daily_stats` makes step 3 slower. Keep that in mind for the SSH step timeout on a large database.

## 3. After the first successful run

- [ ] `https://api.triotmetki.ru/health` is green: database, Redis, worker heartbeat, and the Lesta breaker closed. The worker log says `registered N of M … job schedulers`, and no "degraded" warning appears.
- [ ] **Game data.** The API catalog fills from Lesta through the nightly encyclopedia sync. Builds, armor, personal missions and patch diffs need the client files import, `bun run gamedata:import` (`apps/web/server/scripts/gamedata-import.ts`). Run it once against the production database, for example from a checkout through an SSH tunnel to `127.0.0.1:5432`, with `GITHUB_TOKEN` set for the GitHub rate limit. Run it again after every game patch.
- [ ] Optional: `bun --filter @otmetki/server streamers:seed` loads the invited streamer list.
- [ ] Sign in with Lesta ID and with Telegram on the live site. Check that the footer shows the Lesta attribution on every page.
- [ ] Check `https://triotmetki.ru/sitemap.xml` and `/robots.txt`. The sitemap reads the API at build or request time, so it fills once the collector has data.

## 4. Game mod: rebuild for v2 signing

The API accepts only **v2** request signatures (`MOD_REQUEST.version = 'v2'`: HMAC over `v2\n<METHOD>\n<path>\n<timestamp>\n<nonce>\n<body>`, a 5-minute skew window and a one-time nonce). A mod package built before v2 signing is rejected, so every published package must be rebuilt:

- [ ] Check that `DEFAULT_SERVER_URL` in `apps/game/modpack/packages/companion/config.py` is `https://api.triotmetki.ru`.
- [ ] Bump `VERSION` in `apps/game/modpack/packages/companion/version.py` (and in `packages/core/version.py` and `features/<id>/__init__.py` for the packages that changed).
- [ ] Run `python apps/game/modpack/tools/build/build.py --single --require-pyc` (a release build: one `otmetki.<version>.mtmod`; it needs `owg_python_compiler` or Python 2.7, see [apps/game/modpack/README.md](../../apps/game/modpack/README.md#build)).
- [ ] Publish the package on the site as `https://triotmetki.ru/downloads/otmetki.mtmod` (`MOD_DISTRIBUTION.packagesUrl` in `apps/web/client/shared/config/site`, the /mod page's «скачать пакеты вручную») and through МОСТ ([most-publishing.md](most-publishing.md)); set `MOD_DISTRIBUTION.mostUrl` once the МОСТ entry is live. See [apps/game/modpack/README.md](../../apps/game/modpack/README.md).
- [ ] Build the component catalogue (`modpack.yml` manual run, `modpack-catalog` artifact) and the manager (`manager.yml` manual run), add the release to the index, and publish the manager installer as `https://triotmetki.ru/downloads/otmetki-manager-setup.exe` (`MOD_DISTRIBUTION.managerUrl`, the /mod page's primary download). Steps: [apps/game/manager/README.md «Releases»](../../apps/game/manager/README.md#releases-manual-for-now).
- [ ] Users bind their devices again with a code from `/me`. Devices bound in development do not exist in production.

## 5. Legal pages and Plus: fill before checkout opens

- [ ] `/privacy`, `/terms` and `/contacts` are **drafts**. They render a "draft" banner, and every `<todo>…</todo>` in `apps/web/client/shared/i18n/locales/{ru,en}/legal.json` (13 per language) must be filled before launch:
  - operator full name or company name, ИНН (TIN), ОГРН/ОГРНИП (PSRN), address and contact e-mail;
  - effective dates;
  - hosting provider and region;
  - payment provider name and refund terms;
  - retention period;
  - cookies and third-party list.

  Once they are filled, drop the draft notice.
- [ ] Plus checkout stays off (`PLUS.checkoutEnabled = false` in `packages/schemas/src/plus`) until Lesta confirms the model in writing (see [docs/research/data/lesta-api.md](../research/data/lesta-api.md#monetisation-status)). To open checkout:
  - set `YOOKASSA_*` and the webhook;
  - flip the flag and deploy.

  On the next API boot, `PlusLaunchService` notifies the users who asked to be told (`plusCheckoutOpen`) exactly once.

## 6. Rollback and routine

- The images are tagged only `:latest`. To roll back, re-run the workflow from the previous commit, or `docker compose pull` a pinned digest by hand.
- **Backups.** The `backup` service ([prodrigestivill/postgres-backup-local](https://github.com/prodrigestivill/docker-postgres-backup-local)) runs `pg_dump -Fc` at 04:00 container time into the `pgbackups` volume. It keeps 7 daily, 4 weekly and 6 monthly dumps. The newest is always `/backups/last/<db>-latest.dump`.
  - The dumps sit on the same disk as the database, so copy them off the host. For example, run a nightly cron on another machine: `ssh vps 'cd /opt/otmetki && docker compose cp backup:/backups/last/otmetki-latest.dump -' > otmetki-$(date +%F).dump`.
  - To restore into an empty database, TimescaleDB needs its restore mode:

    ```sh
    docker compose stop server worker
    docker compose exec -T postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c 'SELECT timescaledb_pre_restore();'
    docker compose exec -T postgres pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --no-owner < otmetki.dump
    docker compose exec -T postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c 'SELECT timescaledb_post_restore();'
    docker compose up -d
    ```

  - Rehearse the restore once before launch. An untested backup is not a backup.
- **Logs.** Read them with `docker compose logs -f server worker`. Every service rotates its log at 10 MB × 5 files. Caddy's access log drops `access_token`, `token`, `code` and `state` from query strings.
- `db push` has no down-migrations. A schema change that drops a column is caught by the data-loss check above; resolve it by hand before you re-run the deploy.
- The Timescale retention policies and the `RETENTION` purge jobs are part of the Lesta terms. Do not switch them off to save time on a deploy.

## 7. Демо-деплой без ключей (keyless demo)

Until the Lesta key exists, the site can run publicly on generated data. The override [docker-compose.demo.yml](../../docker-compose.demo.yml) changes four things:

- **`DEMO_MODE=true` on the server and the worker.** A production build then serves the in-process Lesta mock: generated players, clans and battles, and Lesta ID sign-in through a player picker at `/dev/lesta/…` on the API host. The worker runs every Lesta job against the mock, so the data keeps moving.
- **`demo-seed`, a one-shot container from the server image.** It runs `db:deploy` and then [scripts/demo-seed.ts](../../apps/web/server/scripts/demo-seed.ts):
  - while `vehicle` is empty, it imports the game catalog from the public client-data repositories (`gamedata:import`: GitHub, no key);
  - while `player` is empty, it runs `dev-seed`: WN8 expected values from XVM, 600 accounts × 90 days of history, clans, mod battles and the nightly aggregates.

  Every later `up` finds the rows and exits in seconds. The server and the worker start only after it succeeds, because the mock builds its world from the catalog once, at boot.
- **Caddy mounts [infra/caddy/demo.caddy](../../infra/caddy/demo.caddy).** Every response of both hosts carries `X-Robots-Tag: noindex, nofollow, noarchive`, and robots.txt is `Disallow: /`. No page's own metadata can override this.
- **The client is built with `NEXT_PUBLIC_DEMO_MODE=true`**, so every site page shows the «Демо-данные» banner.

**Guards:**

- The server and the worker refuse to boot with `DEMO_MODE=true` while `LESTA_APPLICATION_ID`, `YOOKASSA_SHOP_ID` or `YOOKASSA_SECRET_KEY` is set. The placeholder-secret check still applies.
- At boot the API and the worker log `DEMO_MODE is on: every player, clan and battle … is generated`.
- The deploy workflow fails before it touches the stack when its `demo` input disagrees with the compose files that the VPS `.env` selects.
- Payments stay off: `PLUS.checkoutEnabled = false`, and there are no YooKassa keys. Email, bots and push are off while their keys are empty.

### Commands

1. **DNS and GitHub secrets**, as in §1. The demo needs every secret except the Lesta application.
2. **The VPS `.env`** in `DEPLOY_PATH`, for example `/opt/otmetki`. This is the whole file; everything else defaults to off:

   ```sh
   mkdir -p /opt/otmetki && cd /opt/otmetki
   cat > .env <<EOF
   COMPOSE_FILE=docker-compose.yml:docker-compose.demo.yml
   NODE_ENV=production
   SITE_DOMAIN=triotmetki.ru
   API_DOMAIN=api.triotmetki.ru
   API_URL=https://api.triotmetki.ru
   WEB_URL=https://triotmetki.ru
   POSTGRES_USER=otmetki
   POSTGRES_PASSWORD=$(openssl rand -hex 24)
   POSTGRES_DB=otmetki
   BETTER_AUTH_SECRET=$(openssl rand -base64 32)
   MOD_INGEST_SECRET=$(openssl rand -base64 32)
   INTERNAL_API_TOKEN=$(openssl rand -base64 32)
   BULL_BOARD_PASSWORD=$(openssl rand -hex 16)
   # Optional: a GitHub token with no scopes lifts the API limit for the catalog import.
   GITHUB_TOKEN=
   # Optional: a quicker first boot.
   # DEMO_SEED_ARGS=--accounts 300 --days 30
   EOF
   chmod 600 .env
   ```

   `LESTA_APPLICATION_ID` and `YOOKASSA_*` must stay absent or empty. `DATABASE_URL`, `DIRECT_URL` and `REDIS_URL` come from compose.
3. **Deploy with the demo input.** In Actions → deploy → Run workflow, tick `demo`, or run:

   ```sh
   gh workflow run deploy.yml -f demo=true
   ```

   The first `up -d` waits for `demo-seed`. `db:deploy`, the catalog import and the seed take from several minutes to tens of minutes, and the SSH step allows 40. Follow it on the VPS:

   ```sh
   cd /opt/otmetki && docker compose logs -f demo-seed
   ```

4. **Check it:**

   ```sh
   curl -s https://api.triotmetki.ru/health                # database, redis, worker heartbeat: up
   curl -sI https://triotmetki.ru | grep -i x-robots-tag   # noindex, nofollow, noarchive
   curl -s https://triotmetki.ru/robots.txt                # Disallow: /
   docker compose logs server | grep DEMO_MODE
   ```

   Open the site. The banner is at the top of every page, `/players` and `/tanks` have data, and «Войти через Lesta ID» opens the mock picker.

To re-seed the demo from scratch, run `docker compose run --rm demo-seed sh -c 'bun scripts/dev-seed.ts --reset'`, then `docker compose restart server worker`.

### From the demo to production

Generated players must not mix with real ones, so the switch starts from an empty database:

1. Run `cd /opt/otmetki && docker compose down`, then remove the data volumes: `docker volume rm otmetki_pgdata otmetki_redisdata otmetki_serverdata otmetki_pgbackups`. The prefix is the directory name; check it with `docker volume ls`.
2. In `.env`, delete `COMPOSE_FILE` and `DEMO_SEED_ARGS`. Then fill in everything from §1, starting with `LESTA_APPLICATION_ID`.
3. Run the deploy workflow **without** `demo`, then do §3. Run `gamedata:import` again, because the catalog went with the database.
4. Check that `curl -sI https://triotmetki.ru | grep -i x-robots-tag` prints nothing and that robots.txt lists the sitemap.
