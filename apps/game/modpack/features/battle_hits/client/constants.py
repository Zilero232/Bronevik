from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud.panel import dock_layout

# The shots come from core.client.battle.on_own_shot (the player's own vehicle only). Drawing their points on the
# hangar's 3D model needs its collision boxes and could not be checked without the client, so the hangar shows a
# schematic instead.
# RU 1.45 common/BattleFeedbackCommon.BATTLE_EVENT_TYPE: the own feedback's received damage (the attacker is the
# target id).
KIND_BY_EVENT = (('RECEIVED_DAMAGE', 'received'),)
HANGAR_PANEL = 'otmetki.battle_hits'
LAYOUT = dock_layout('hangar_left')
