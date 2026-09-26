# syntax=docker/dockerfile:1
#
# Three Marks server — NestJS on the Bun runtime. One image, two processes:
#   bun src/main.ts     the API (default CMD)
#   bun src/worker.ts   the collector worker (docker-compose `worker` service)
#
# The build context MUST be the monorepo root, because the server depends on the
# @otmetki/* workspace packages. Build from the repo root with:
#   docker build -f apps/server/Dockerfile -t otmetki-server .
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
COPY apps/client/package.json ./apps/client/package.json
COPY apps/server/package.json ./apps/server/package.json
COPY packages/gamedata/package.json ./packages/gamedata/package.json
COPY packages/icons/package.json ./packages/icons/package.json
COPY packages/logger/package.json ./packages/logger/package.json
COPY packages/ratings/package.json ./packages/ratings/package.json
COPY packages/schemas/package.json ./packages/schemas/package.json
COPY packages/sdk/package.json ./packages/sdk/package.json

# Lifecycle scripts are off: the server's postinstall runs `prisma generate`
# before the schema is copied. Generation runs later, in the runner stage.
# The retry loop survives registry hiccups that corrupt a tarball mid-download;
# the third failure fails the build instead of carrying on with a broken tree.
RUN for attempt in 1 2 3; do \
      bun install --frozen-lockfile --ignore-scripts && break; \
      [ "$attempt" = 3 ] && exit 1; \
      echo "bun install attempt $attempt failed; clearing cache and retrying"; \
      rm -rf /root/.bun/install/cache ~/.bun/install/cache; \
    done

FROM base AS runner
ENV NODE_ENV=production

# Bun workspaces keep dependencies under each package's node_modules, so the
# whole installed tree comes over to keep the resolution graph intact.
COPY --from=deps /app /app

COPY packages/gamedata ./packages/gamedata
COPY packages/logger ./packages/logger
COPY packages/ratings ./packages/ratings
COPY packages/schemas ./packages/schemas
COPY apps/server ./apps/server

WORKDIR /app/apps/server

# prisma.config.ts reads DIRECT_URL; `generate` never connects, so a
# placeholder satisfies it without baking a secret into the image.
RUN DIRECT_URL="postgresql://placeholder" DATABASE_URL="postgresql://placeholder" bunx prisma generate

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD bun -e "fetch('http://localhost:4000/health').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["bun", "src/main.ts"]
