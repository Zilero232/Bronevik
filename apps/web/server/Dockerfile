# syntax=docker/dockerfile:1
#
# Three Marks server — NestJS on the Bun runtime. One image, two processes:
#   bun src/main.ts     the API (default CMD)
#   bun src/worker.ts   the collector worker (docker-compose `worker` service)
#
# The build context MUST be the monorepo root, because the server depends on the
# @otmetki/* workspace packages. Build from the repo root with:
#   docker build -f apps/web/server/Dockerfile -t otmetki-server .
#
# Bun runs the TypeScript source directly, so there is no compile step: the
# image installs dependencies and generates the Prisma client.

FROM oven/bun:1.3.1 AS base
WORKDIR /app

# Manifests first, so the install layer is cached until a dependency changes.
# --frozen-lockfile validates the whole workspace topology, so every member
# listed in bun.lock needs its manifest here, even the ones the server never uses.
FROM base AS deps
COPY package.json bun.lock tsconfig.json ./
COPY apps/web/client/package.json ./apps/web/client/package.json
COPY apps/game/manager/package.json ./apps/game/manager/package.json
COPY apps/game/modpack/package.json ./apps/game/modpack/package.json
COPY apps/web/server/package.json ./apps/web/server/package.json
COPY packages/design-tokens/package.json ./packages/design-tokens/package.json
COPY packages/gamedata/package.json ./packages/gamedata/package.json
COPY packages/icons/package.json ./packages/icons/package.json
COPY packages/logger/package.json ./packages/logger/package.json
COPY packages/ratings/package.json ./packages/ratings/package.json
COPY packages/schemas/package.json ./packages/schemas/package.json
COPY packages/sdk/package.json ./packages/sdk/package.json

# Lifecycle scripts are off: the server's postinstall runs `prisma generate`
# before the schema is copied. Generation runs later, in the runner stage.
# --filter installs only the server and the workspace packages it depends on,
# not the client, the manager or their toolchains (Next, SWC, three.js...);
# --production leaves every devDependency out. The Prisma CLI and dotenv are
# regular dependencies because the deploy runs `db:deploy` in this image.
# The retry loop survives registry hiccups that corrupt a tarball mid-download;
# the third failure fails the build instead of carrying on with a broken tree.
RUN for attempt in 1 2 3; do \
      bun install --frozen-lockfile --ignore-scripts --production --filter @otmetki/server && break; \
      [ "$attempt" = 3 ] && exit 1; \
      echo "bun install attempt $attempt failed; clearing cache and retrying"; \
      rm -rf /root/.bun/install/cache ~/.bun/install/cache; \
    done

# The slim variant drops the build toolchain the full image carries. Prisma's
# schema engine (`db:deploy` runs `prisma db push` in this image) links against
# OpenSSL; without it Prisma guesses openssl-1.1.x and fetches the wrong engine.
FROM oven/bun:1.3.1-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Bun workspaces keep dependencies under each package's node_modules, so the
# whole installed tree comes over to keep the resolution graph intact.
COPY --from=deps /app /app

COPY packages/gamedata ./packages/gamedata
COPY packages/logger ./packages/logger
COPY packages/ratings ./packages/ratings
COPY packages/schemas ./packages/schemas
COPY apps/web/server ./apps/web/server

WORKDIR /app/apps/web/server

# prisma.config.ts reads DIRECT_URL; `generate` never connects, so a
# placeholder satisfies it without baking a secret into the image.
RUN DIRECT_URL="postgresql://placeholder" DATABASE_URL="postgresql://placeholder" bunx prisma generate

# The processes run as the unprivileged `bun` user of the base image; the
# local-disk store under .data (replays, armor models) is the only path it
# writes to. docker-compose.yml mounts the host downloads folder read-only at
# ./downloads for the modpack release index.
RUN mkdir -p .data && chown bun:bun .data

USER bun

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD bun -e "fetch('http://localhost:4000/health').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["bun", "src/main.ts"]
