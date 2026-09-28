---
paths:
  - "apps/game/modpack/**/*.py"
---

<!-- Editing rules for the «Три отметки» modpack (Python), loaded automatically on edit. -->
<!-- Modpack specifics in apps/game/modpack/CLAUDE.md and README.md. Keep them in sync. -->

# Code style — modpack (Python): the 2/3 subset

## Runtime

The game client runs **Python 2.7** (BigWorld). Packages ship as compiled `.pyc`
inside `.mtmod` archives under `mods/<version>/`. Tests and tooling run on Python 3
(uv workspace). Code must run on both, so write the common subset.

## Python 2/3 subset

- `from __future__ import absolute_import, division, print_function, unicode_literals` in every
  module of `packages/` and `features/`, tests included. A literal a Python 2 C API needs as
  `str` goes through `str('...')` or `core.compat.to_native` (struct formats, `type()` names,
  `BigWorld.fetchURL` arguments). `tools/` is host tooling and does not need it.
- Text vs bytes through `six` (`six.text_type`, `six.ensure_text`); no f-strings, no
  `nonlocal`, no keyword-only args, no `async`, no walrus, no type annotations —
  use `# type:` comments.
- Classes inherit `object`. `super(Cls, self)`.
- `vermin` must report a minimum of 2.7 for runtime packages; ruff targets py37 with
  pyupgrade off.
