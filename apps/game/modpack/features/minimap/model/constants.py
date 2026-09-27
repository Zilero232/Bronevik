from __future__ import absolute_import, division, print_function, unicode_literals

# Client setting names (account_helpers.settings_core.settings_constants in the WoT-era client);
# UNVERIFIED on Lesta 1.45: an unknown name is never written. Every one of them is a vanilla option of
# the game's own settings window (Battle / Minimap), so nothing here shows what the client does not.
SIZE = 'minimapSize'
TRANSPARENCY = 'minimapAlpha'
VEHICLE_NAMES = 'showVehModelsOnMap'
VIEW_RANGE = 'minimapViewRange'
MAX_VIEW_RANGE = 'minimapMaxViewRange'
DRAW_RANGE = 'minimapDrawRange'

VEHICLE_NAME_MODES = {'never': 0, 'alt': 1, 'always': 2}
