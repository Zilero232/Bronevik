from __future__ import absolute_import, division, print_function, unicode_literals

UPLOAD_TIMEOUT_S = 120.0
STARTED_KEEP = 20
# account_helpers.settings_core.settings_constants.GAME.REPLAY_ENABLED (RU 1.45 client source): 0 off,
# 1 last battle, 2 all; an unknown name reads as missing and the mod then just looks for a file.
REPLAY_SETTING = 'replayEnabled'
