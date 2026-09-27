-- Applied by `bun run db:timescale` after `prisma db push`. Every file here is idempotent.
-- `bun run db:push` also runs this file alone before the push, because the trigram indexes need pg_trgm.

CREATE EXTENSION IF NOT EXISTS timescaledb;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
