---
paths:
  - "apps/server/**/*.ts"
---

<!-- Compressed editing rules for the server app (API and worker), loaded automatically on edit. -->
<!-- Server specifics in apps/server/CLAUDE.md; deploy env in docs/ops/deploy.md. Keep them in sync. -->

# Code style — server: environment and tunables

## Environment

`config/env/env.schema.ts` validates on boot and **throws** on a missing or malformed
variable. Only secrets, addresses, ports and connection strings are env; every
tunable is an `as const` object in `config/*.constants.ts` (`FEATURES`, `SOURCES`,
`LESTA`, `TIMESCALE`, `BULL_BOARD`). Schedules run by default; `FEATURES` holds
only flags that are actually switched off (`moePoliroid`), not always-true switches.
