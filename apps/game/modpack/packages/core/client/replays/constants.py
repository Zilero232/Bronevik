from __future__ import absolute_import, division, print_function, unicode_literals

# RU 1.45 client source (client/BattleReplay.py): the private __replayDir is set once to './replays' and never
# reassigned, so the mod uses the same folder without reading the private attribute.
DEFAULT_REPLAY_DIR = 'replays'
