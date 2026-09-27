---
paths:
  - "apps/modpack/**/*.py"
  - "apps/modpack/**/tests/**"
---

<!-- Editing rules for the «Три отметки» modpack (Python), loaded automatically on edit. -->
<!-- Modpack specifics in apps/modpack/CLAUDE.md and README.md. Keep them in sync. -->

# Code style — modpack (Python): tests

## Tests

`features/<id>/tests` and `packages/*/tests` with pytest (plain asserts); the stdlib
runner `tools/run_tests.py` must also pass. Pure logic fully tested; client glue
covered by the stubbed-client smoke test, including random load order.
Commands: `bun run test:modpack`, `uv run pytest`, `uv run ruff check .`, `vermin`.

## Where they live and how they run

The one exception is the game modpack: Python `unittest` suites in a `tests/` folder of each package (`apps/modpack/packages/*/tests`, `apps/modpack/features/*/tests`, `apps/modpack/tools/**/tests`), because the build packs the source folders into `.mtmod` packages and leaves `tests/` out.

The modpack — `bun run test:modpack` (`python apps/modpack/tools/run_tests.py`: every suite, no third-party packages, also runs on Python 2.7); `uv run pytest` in `apps/modpack` runs the same tests. The pure code is 2/3 compatible.
