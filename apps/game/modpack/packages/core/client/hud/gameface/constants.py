from __future__ import absolute_import, division, print_function, unicode_literals

# gui.impl.gen_utils.INVALID_RES_ID (RU 1.45 client source); openwg_gameface.res_id_by_key returns it for an
# unknown or not yet validated key.
INVALID_RES_ID = -1

# The wulf layer of the HUD window, the one GUIFlash 0.6 loads its Flash view into (WindowLayer.WINDOW).
# UNVERIFIED on Lesta 1.45: its order against the Scaleform battle page and the hangar's own windows.
WINDOW_LAYER = 'WINDOW'

# skeletons.gui.app_loader.GuiGlobalSpaceID names (RU 1.45 client source) the HUD window may live in. A window
# opened before them (the login screen, while the lobby app is still being created) was never seen in the
# hangar in the 1.45.0.0 live test; the one opened after the battle space was entered drew.
READY_SPACES = ('LOBBY', 'BATTLE')

# openwg_gameface.RESTART_FLAG_FILE (1.2.2, Lesta): the file in the client's working folder that marks the restart it
# triggered after writing a new res_map.json.
RESTART_FLAG_FILE = 'res_map_restart'
