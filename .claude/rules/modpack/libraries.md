---
paths:
  - "apps/modpack/**/*.py"
---

<!-- Editing rules for the «Три отметки» modpack (Python), loaded automatically on edit. -->
<!-- Modpack specifics in apps/modpack/CLAUDE.md and README.md. Keep them in sync. -->

# Code style — modpack (Python): libraries

## Libraries before custom code

Vendored under `core/vendor` with pinned py2.7-compatible versions: `six` (text/bytes,
iteration, metaclasses), `blinker` (signals/event bus), `attrs` (data models),
`enum34` (enums), `typing` (type comments). Use the standard library otherwise
(`json`, `logging`, `collections`, `functools`, `itertools`). Do not hand-roll what
these do. Add a new vendored lib only with a pinned version that supports 2.7 and
a licence that allows redistribution.
