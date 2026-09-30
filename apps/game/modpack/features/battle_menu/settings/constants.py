from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'battle_menu_entry'
SECTION = 'battle_menu'
GROUP = 'battle'

# The stock Esc menu (RU 1.45 sources-as3 gui_battle IngameMenu.as) is a centred window of a header, the server line,
# four IconTextBigButtons and the bug report panel; the button sits right under it. UNVERIFIED on Lesta 1.45: the
# window's height at every interface scale, hence the offset is the player's.
DEFAULTS = {
    'x': 0,
    'y': 230,
    'scale': 100,
}
LIMITS = {'x': (-900, 900), 'y': (-500, 500), 'scale': (50, 200)}
