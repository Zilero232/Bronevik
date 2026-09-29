from __future__ import absolute_import, division, print_function, unicode_literals

# RU 1.45 client source (CombatSelectedArea.py): the game's own ground circle, a PyTerrainSelectedArea with this visual on
# an empty model, raised 0.5 m over the terrain. UNVERIFIED on Lesta 1.45: that the visual ships with the client and that
# a Servo on the own vehicle's matrix keeps it under the tank (live checklist).
CIRCLE_VISUAL = 'content/Interface/CheckPoint/CheckPoint.visual'
OVER_TERRAIN_HEIGHT = 0.5
CUT_OFF_DISTANCE = 5.0
ENTITY_RETRY_S = 1.0
ENTITY_ATTEMPTS = 10
