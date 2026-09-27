from __future__ import absolute_import, division, print_function, unicode_literals

# Bus events of the HUD edit protocol (the HUD layer and its panels subscribe on app.bus):
#   hud_edit(active)       on-screen edit mode on/off: show every enabled panel with preview data, off: hide them
#   hud_describe(collect)  ask panels for their editor preview: collect(panel_id, preview=None, width=None, height=None)
EVENT_EDIT = 'hud_edit'
EVENT_DESCRIBE = 'hud_describe'

DEFAULT_WIDTH = 220
DEFAULT_HEIGHT = 40
MAX_SIZE = 2000
PREVIEW_MAX_CHARS = 400

POSITION_NUMBERS = ('x', 'y')
POSITION_ALIGNS = ('align_x', 'align_y')
