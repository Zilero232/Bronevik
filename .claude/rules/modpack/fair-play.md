---
paths:
  - "apps/modpack/**/*.py"
---

<!-- Editing rules for the «Три отметки» modpack (Python), loaded automatically on edit. -->
<!-- Modpack specifics in apps/modpack/CLAUDE.md and README.md. Keep them in sync. -->

# Code style — modpack (Python): fair play

## Fair play — hard rule

Only what the client already shows the player. Nothing from Lesta's forbidden list:
no enemy reload timers, no aim direction, no arty trajectories or tracer-based
positions, no destroyed-object or lost-enemy markers, no smart crosshair / lead
calculation, no transparency changes, no in-battle armour analysis. When in doubt,
leave it out and document why.
