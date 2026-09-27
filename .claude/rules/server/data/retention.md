---
paths:
  - "apps/server/**/*.ts"
---

<!-- Compressed editing rules for the server app (API and worker), loaded automatically on edit. -->
<!-- Server specifics in apps/server/CLAUDE.md; API terms in docs/research/data/lesta-api.md. Keep them in sync. -->

# Code style — server: data retention

## Data retention is a Lesta term

Purge jobs, deletion requests (`PurgeGuardService`) and the Timescale retention
policies (`TIMESCALE` in `config/timescale.constants.ts`) are not optional.
