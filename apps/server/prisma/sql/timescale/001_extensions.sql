-- Applied by `bun run db:timescale` after `prisma migrate`. Every file here is idempotent.
-- pg_trgm is also created by the Prisma `init` migration because the trigram indexes need it.

CREATE EXTENSION IF NOT EXISTS timescaledb;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
