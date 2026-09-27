---
paths:
  - "apps/client/**/*.{ts,tsx}"
---

<!-- Compressed editing rules for the web client, loaded automatically on edit. -->
<!-- Full reasoning in apps/client/CLAUDE.md and docs/guides/client/segments.md; keep them in sync. -->

# Code style — client: no mocks

## No mocks

No mock data layer, fixture fallback or fake latency. Every request goes through
`fromServer` (`shared/api/source`); with no data a screen shows its empty state, with
the API down its error state with a retry.
