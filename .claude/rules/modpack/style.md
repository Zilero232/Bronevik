---
paths:
  - "apps/modpack/**/*.py"
---

<!-- Editing rules for the «Три отметки» modpack (Python), loaded automatically on edit. -->
<!-- Modpack specifics in apps/modpack/CLAUDE.md and README.md. Keep them in sync. -->

# Code style — modpack (Python): style

## Style

- Names: `snake_case` functions/modules, `PascalCase` classes, `UPPER_CASE` constants
  in a `constants.py` of the concern. Settings keys `snake_case`.
- One public responsibility per module; functions small and pure where possible.
  Side effects (hooks, timers, network, disk) only in `client/` or core services.
- No comments explaining what code does; names do that. Docstrings only on public
  core APIs used by features.
- Errors: never let an exception escape a game hook — core wraps handlers and logs.
  Features raise normally in `model`.
- Logging through `core.log.get_logger(__name__)`, never `print`.
- Strings shown to the player come from `i18n/` (ru and en in sync).
