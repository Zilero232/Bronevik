from __future__ import absolute_import, division, print_function, unicode_literals

MODS_LIST_ID = 'otmetki'
ICON_PATH = 'gui/gameface/mods/triotmetki/ui/icon.png'
BROWSER_OPENERS = ('openWebBrowser', 'wg_openWebBrowser')

# The settings button on the Gameface HUD page: its own section of components.json, docked top right under the
# hangar's top bar and above hangar_info. UNVERIFIED on Lesta 1.45: that the top bar ends above y=64 at scale 1.0.
BUTTON_ALIAS = 'otmetki.ui.button'
BUTTON_SECTION = 'hangar_button'
BUTTON_DEFAULTS = {
    'x': -24,
    'y': 72,
    'align_x': 'right',
    'align_y': 'top',
    'scale': 100,
}
BUTTON_LAYOUT_KEYS = ('x', 'y', 'align_x', 'align_y', 'scale')

# Ctrl+Shift+T in the hangar opens the window (and ends the on-screen HUD edit mode).
HOTKEY = 'KEY_T'
HOTKEY_MODIFIERS = ('KEY_LCONTROL', 'KEY_LSHIFT')

# The companion config.json key of the panel edit modifier (core.hud.modifier modes).
MODIFIER_KEY = 'hud_modifier'
