from __future__ import absolute_import, division, print_function, unicode_literals

import re

ALIAS_PREFIX = 'otmetki.hud.'

PANEL_DEFAULTS = {
    'x': 0,
    'y': 0,
    'align_x': 'center',
    'align_y': 'top',
    'alpha': 100,
    'font_size': 14,
    'drag': True,
    'border': False,
    'scale': 100,
}

PANEL_CHOICES = {
    'align_x': ('left', 'center', 'right'),
    'align_y': ('top', 'center', 'bottom'),
}

PANEL_LIMITS = {
    'x': (-4000, 4000),
    'y': (-4000, 4000),
    'alpha': (0, 100),
    'font_size': (8, 48),
    'scale': (50, 300),
}

LAYOUT_KEYS = ('x', 'y', 'align_x', 'align_y', 'alpha', 'drag', 'border', 'scale')
# The keys of a panel's place (its anchor and the offset from it).
PLACE_KEYS = ('x', 'y', 'align_x', 'align_y')

HEX_COLOR = re.compile(r'^#[0-9A-Fa-f]{6}$')
SOUND_EVENT = re.compile(r'^[A-Za-z0-9_]*$')
MAX_SOUND_EVENT = 64

# The renderer's anchor props after a drag, and the settings keys they are saved to.
MOVED_ALIGNS = (('alignX', 'align_x'), ('alignY', 'align_y'))

# Renderer props only the Gameface HUD page draws; GUIFlash's Flash labels are never sent them.
GAMEFACE_PROPS = ('scale', 'kind', 'widget', 'dock')

# Docked columns: panels at their group's anchor stack one under (or, for a bottom anchor, above) the other with DOCK_GAP
# between them, in `order`, so default places never overlap whatever each panel's height is. A panel the player moved
# (its place differs from the anchor) leaves the column. Keys are the panels' aliases (HUD panels `otmetki.hud.<id>`,
# hangar labels their own alias); every member's default place is its group's anchor (tools/tests check it).
DOCK_GAP = 6
# `reserve`: the strip at the far end of a column (design px from the bottom edge, or from the top one for a bottom
# anchor) a panel never enters: a top-anchored column first moves up (not above `ceiling`, design px from the top, when
# the group names one), then the next panel starts a new column beside the first. `stop_center` puts that strip's edge at a
# distance above the screen's middle instead.
# Battle anchors are in design px, the unit of the stock Scaleform battle page at every interface scale (RU 1.45 client
# source: AbstractApplication.as sets the stage to the screen over the scale; the Gameface root font size is the same scale,
# so 1 rem of the HUD page is 1 px of the battle page). The smallest battle screen the client allows is 2560x1440 at 1.5
# (1707x960 design px; gui/shared/utils/graphics.py _SCALES). Stock boxes they keep clear (gui_battle AS3 sources):
# the team lists (PlayersPanel: x 0 / W, 25 px rows from about y 45, at most 368 px wide with badges in the full mode),
# the score strip (fragCorrelationBar, centred at the top), the timer (battleTimer, 184 px at the top right), the damage
# panel (230 x about 240 at the bottom left) with the chat above it, the consumables (57 px slots, centred, 58 px from the
# bottom), the minimap (bottom right) and the sixth sense lamp (W/2 - 109, H/2 - 225).
DOCK_ANCHORS = {
    # Right of the stock damage panel, in the stock damage log's place (BattlePage.as: x 229, the damage panel's top + 3).
    'battle_left_bottom': {'x': 232, 'y': -6, 'align_x': 'left', 'align_y': 'bottom', 'reserve': 560},
    # Right of the left team list in its widest mode and under the score strip, above the damage log column.
    'battle_left_top': {'x': 372, 'y': 60, 'align_x': 'left', 'align_y': 'top', 'reserve': 290, 'ceiling': 60},
    # The mirror of the left column, left of the right team list and above the largest minimap.
    'battle_right_top': {'x': -372, 'y': 60, 'align_x': 'right', 'align_y': 'top', 'reserve': 420, 'ceiling': 60},
    # Right on top of the stock consumables panel (ConsumablesPanel.as: y = H - 58), centred with it.
    'battle_bottom_center': {'x': 0, 'y': -64, 'align_x': 'center', 'align_y': 'bottom', 'reserve': 560},
    # Under the team HP strip, in the middle of the screen's top edge; `stop_center`: the column ends that far above the
    # screen's middle, over the sixth sense lamp.
    'battle_top_center': {'x': 0, 'y': 60, 'align_x': 'center', 'align_y': 'top', 'reserve': 700, 'ceiling': 60, 'stop_center': 240},
    # Hangar: left column under the crew, right column under the vehicle parameters, both above the tank carousel.
    'hangar_left': {'x': 16, 'y': 440, 'align_x': 'left', 'align_y': 'top', 'reserve': 190},
    'hangar_right': {'x': -16, 'y': 570, 'align_x': 'right', 'align_y': 'top', 'reserve': 190},
}
DOCKS = {
    'otmetki.hud.damage_log': ('battle_left_bottom', 0),
    'otmetki.hud.last_hit': ('battle_left_bottom', 1),
    'otmetki.hud.marks_panel': ('battle_left_top', 0),
    'otmetki.hud.received_hits': ('battle_left_top', 1),
    'otmetki.hud.platoon_points': ('battle_left_top', 2),
    'otmetki.hud.personal_best': ('battle_left_top', 3),
    'otmetki.hud.hit_log': ('battle_right_top', 0),
    'otmetki.hud.arty_meter': ('battle_right_top', 1),
    'otmetki.hud.session_goals': ('battle_right_top', 2),
    'otmetki.hud.personal_missions': ('battle_right_top', 3),
    'otmetki.hud.battle_loadout': ('battle_bottom_center', 0),
    'otmetki.hud.consumables': ('battle_bottom_center', 1),
    'otmetki.hud.main_gun': ('battle_top_center', 0),
    'otmetki.hud.battle_efficiency': ('battle_top_center', 1),
    'otmetki.hud.hangar_marks': ('hangar_left', 0),
    'otmetki.marks_history': ('hangar_left', 1),
    'otmetki.battle_hits': ('hangar_left', 2),
    'otmetki.hangar_ratings': ('hangar_left', 3),
    'otmetki.session': ('hangar_right', 0),
    'otmetki.session_goals': ('hangar_right', 1),
    'otmetki.personal_missions': ('hangar_right', 2),
    'otmetki.platoon_helper': ('hangar_right', 3),
    'otmetki.comp7_helper': ('hangar_right', 4),
    'otmetki.event_trackers.triathlon': ('hangar_right', 5),
    'otmetki.event_trackers.caravan': ('hangar_right', 6),
}
