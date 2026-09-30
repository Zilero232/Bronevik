from __future__ import absolute_import, division, print_function, unicode_literals

# Marks of excellence exist from tier 5; lower tiers have no MoE record to send.
MIN_TIER = 5
# The tank's dossier MoE at the start of each own battle is kept until that battle's results arrive; the results of
# an arena older than the last BATTLE_SNAPSHOTS battles are no longer waited for (companion PLAYED_ARENAS_LIMIT).
BATTLE_SNAPSHOTS = 20
