from __future__ import absolute_import, division, print_function, unicode_literals

import re

# RU 1.45 client source: hangar spaces are the folders under res/spaces with a space.settings/hangarSettings
# (gui.ClientHangarSpace._readHangarSettings), addressed as 'spaces/<folder>' in lower case.
SPACES_PREFIX = 'spaces/'
SPACE_NAME = re.compile(r'^[a-z0-9_]{1,64}$')

ACTION_CHOOSE = 'choose'
ACTION_NATIVE = 'native'
ROW_NATIVE = 'native'
LAYOUT_GALLERY = 'gallery'

# RU 1.45 client: the spaces it ships (gui/hangars.xml names the mode ones) in the order the page lists them; each
# has its hangar_space_name_<folder> string. Any other folder gets a title made from its name.
KNOWN_SPACES = (
    'h08_mt_hangar',
    'h08_mt_hangar_wt',
    'h14_mt_wt_2025',
    'h16_mt_museum',
    'h00_armory_yard',
    'h33_comp7',
    'h33_battle_royale_2021',
    'h20_wot_bday',
)
NAME_KEY = 'hangar_space_name_%s'
# Developer and test spaces the client also ships (hangar_mt_lite_editor, 1006_3d_styles_test): never listed.
HIDDEN_MARKERS = ('test', 'editor')
HANGAR_NUMBER = re.compile(r'^h\d+_')
MT_PREFIX = 'mt_'

# The client has no pictures of its hangar spaces: these are the RU 1.45 client's own art of the event or mode the
# space belongs to (thematic art, not a render of the hangar); a space without one gets the window's drawn fallback.
WHITE_TIGER_ART = 'img://white_tiger/gui/maps/icons/welcome/background.png'
PREVIEWS = {
    'h08_mt_hangar_wt': WHITE_TIGER_ART,
    'h14_mt_wt_2025': WHITE_TIGER_ART,
    'h33_battle_royale_2021': 'img://battle_royale/gui/maps/intro/chapter_common.png',
    'h00_armory_yard': 'img://armory_yard/gui/maps/icons/shop/intro/slide_1.png',
}

# What choosing a hangar does now: the default hangar reloads, is already the one loaded, waits for the space
# being loaded, or waits for the regular hangar (a mode or event hangar is open, or the player is in battle).
PLAN_RELOAD = 'reload'
PLAN_LOADED = 'loaded'
PLAN_WAIT = 'wait'
PLAN_LATER = 'later'
