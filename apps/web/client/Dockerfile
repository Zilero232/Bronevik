# syntax=docker/dockerfile:1
#
# Three Marks web client — Next.js server.
#
# The build context MUST be the monorepo root: the client depends on workspace
# packages (@otmetki/*) and the root lockfile. Build from the repo root:
#   docker build -f apps/web/client/Dockerfile -t otmetki-client .
#
# The image runs the Next.js server itself (`output: 'standalone'`) rather than
# a static export: pages render per request, so metadata and public stats pages
# reflect the database instead of build time. Caddy sits in front, terminates
# TLS and compresses responses.
#
# NEXT_PUBLIC_* values are inlined into the browser bundle at build time and
# must be passed as build args — they are not secrets, they ship to the browser.

FROM oven/bun:1.3.1 AS build
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# Manifests first, so the install layer stays cached until a package.json or
# the lockfile changes. --frozen-lockfile validates the on-disk workspace
# topology against bun.lock, so every workspace manifest has to be present —
# even those this image never builds.
COPY package.json bun.lock tsconfig.json ./
COPY apps/web/client/package.json ./apps/web/client/package.json
COPY apps/game/modpack/package.json ./apps/game/modpack/package.json
COPY apps/web/server/package.json ./apps/web/server/package.json
COPY packages/gamedata/package.json ./packages/gamedata/package.json
COPY packages/icons/package.json ./packages/icons/package.json
COPY packages/logger/package.json ./packages/logger/package.json
COPY packages/ratings/package.json ./packages/ratings/package.json
COPY packages/schemas/package.json ./packages/schemas/package.json
COPY packages/sdk/package.json ./packages/sdk/package.json

# Lifecycle scripts are off: the server's postinstall runs `prisma generate` and
# the sdk's runs `openapi-ts`, neither of which the client image needs.
# The retry loop wipes the download cache between attempts, which survives a
# registry hiccup that corrupts a tarball mid-download (IntegrityCheckFailed);
# the third failure fails the build instead of carrying on with a broken tree.
RUN for attempt in 1 2 3; do \
      bun install --frozen-lockfile --ignore-scripts && break; \
      [ "$attempt" = 3 ] && exit 1; \
      echo "bun install attempt $attempt failed; clearing cache and retrying"; \
      rm -rf /root/.bun/install/cache ~/.bun/install/cache; \
    done

# Declared after the install, so a different API URL does not invalidate the
# cached dependency layer.
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

# Salts the service-worker precache revision of the manifest and PWA icons, so
# a deploy refreshes them even when the package version stays the same.
ARG GIT_COMMIT_SHA
ENV GIT_COMMIT_SHA=${GIT_COMMIT_SHA}

# Every workspace package the client imports (directly or through another
# package) ships TypeScript source that Next compiles in place.
COPY packages/gamedata ./packages/gamedata
COPY packages/icons ./packages/icons
COPY packages/ratings ./packages/ratings
COPY packages/schemas ./packages/schemas
COPY apps/web/client ./apps/web/client

# public/ is not traced into standalone; creating it keeps the runner's COPY
# valid either way.
RUN bun --filter @otmetki/client build \
    && test -f apps/web/client/.next/standalone/apps/web/client/server.js \
    && mkdir -p apps/web/client/public

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nextjs -G nodejs

# `output: 'standalone'` traces the runtime dependencies into .next/standalone,
# laid out from `outputFileTracingRoot` — the monorepo root — so the server
# entrypoint keeps its apps/web/client prefix. static/ and public/ are not traced
# and are copied in beside it.
COPY --from=build --chown=nextjs:nodejs /app/apps/web/client/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/apps/web/client/.next/static ./apps/web/client/.next/static
COPY --from=build --chown=nextjs:nodejs /app/apps/web/client/public ./apps/web/client/public

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "apps/web/client/server.js"]
