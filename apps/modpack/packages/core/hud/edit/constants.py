from __future__ import absolute_import, division, print_function, unicode_literals

# Bus events of the HUD edit protocol (sent by the ui package's editor, handled by every HUD panel):
#   hud_edit(active)       on-screen edit mode on/off: show every enabled panel with preview data, off: hide them
#   hud_describe(collect)  ask panels for their editor preview: collect(panel_id, preview=None, width=None, height=None, enabled=False)
EVENT_EDIT = 'hud_edit'
EVENT_DESCRIBE = 'hud_describe'
