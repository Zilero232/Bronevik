from __future__ import absolute_import, division, print_function, unicode_literals

# Settings-core names (account_helpers.settings_core.settings_constants, RU 1.45 client source); an
# unknown name is never written. Every one of them is a vanilla option of the game's own settings window
# (Battle / Minimap), so nothing here shows what the client does not.
TRANSPARENCY = 'minimapAlpha'
VEHICLE_NAMES = 'showVehModelsOnMap'
VIEW_RANGE = 'minimapViewRange'
MAX_VIEW_RANGE = 'minimapMaxViewRange'
DRAW_RANGE = 'minimapDrawRange'
# Not a settings-core option: RU 1.45 client source keeps the size in AccountSettings (MINIMAP_SIZE,
# account_helpers/AccountSettings.py), index 0..5 clamped by the battle minimap
# (gui/Scaleform/daapi/view/battle/shared/minimap/settings.py), the value its own +/- keys change.
SIZE = 'minimapSize'

VEHICLE_NAME_MODES = {'never': 0, 'alt': 1, 'always': 2}
