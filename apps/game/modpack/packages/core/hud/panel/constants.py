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
DOCK_ANCHORS = {
    # Battle, 1080p design px. Right of the stock damage panel (x 230, about 190 px tall), in the stock damage log's place.
    'battle_left_bottom': {'x': 232, 'y': -6, 'align_x': 'left', 'align_y': 'bottom', 'reserve': 560},
    # Top left, right of the team list (about 200 px wide from 140 px down) and under the stock FPS and ping line.
    'battle_left_top': {'x': 208, 'y': 8, 'align_x': 'left', 'align_y': 'top', 'reserve': 360, 'ceiling': 8},
    # Left of the stock battle timer (top right, about 120 x 36 px).
    'battle_right_top': {'x': -128, 'y': 4, 'align_x': 'right', 'align_y': 'top', 'reserve': 560, 'ceiling': 4},
    # Under the team HP strip, in the middle of the screen's top edge; `stop_center`: the column ends that far above the
    # screen's middle, over the sixth sense lamp (the stock lamp sits about 225 px above the middle).
    'battle_top_center': {'x': 0, 'y': 60, 'align_x': 'center', 'align_y': 'top', 'reserve': 700, 'ceiling': 60, 'stop_center': 240},
    # Hangar: left column under the crew, right column under the vehicle parameters, both above the tank carousel.
    'hangar_left': {'x': 16, 'y': 440, 'align_x': 'left', 'align_y': 'top', 'reserve': 190},
    'hangar_right': {'x': -16, 'y': 570, 'align_x': 'right', 'align_y': 'top', 'reserve': 190},
}
DOCKS = {
    'otmetki.hud.damage_log': ('battle_left_bottom', 0),
    'otmetki.hud.marks_panel': ('battle_left_top', 0),
    'otmetki.hud.received_hits': ('battle_left_top', 1),
    'otmetki.hud.platoon_points': ('battle_left_top', 2),
    'otmetki.hud.battle_clock': ('battle_right_top', 0),
    'otmetki.hud.main_gun': ('battle_top_center', 0),
    'otmetki.hud.battle_efficiency': ('battle_top_center', 1),
    'otmetki.hud.personal_best': ('battle_top_center', 2),
    'otmetki.hud.session_goals': ('battle_top_center', 3),
    'otmetki.hud.personal_missions': ('battle_top_center', 4),
    'otmetki.hud.arty_meter': ('battle_top_center', 5),
    'otmetki.hud.hangar_marks': ('hangar_left', 0),
    'otmetki.marks_history': ('hangar_left', 1),
    'otmetki.battle_hits': ('hangar_left', 2),
    'otmetki.hangar_ratings': ('hangar_left', 3),
    'otmetki.session': ('hangar_right', 0),
    'otmetki.session_goals': ('hangar_right', 1),
    'otmetki.personal_missions': ('hangar_right', 2),
    'otmetki.platoon_helper': ('hangar_right', 3),
}
