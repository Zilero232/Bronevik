from __future__ import absolute_import, division, print_function, unicode_literals

MODS_LIST_ID = 'otmetki'
ICON_PATH = 'gui/gameface/mods/triotmetki/ui/icon.png'

# Hangar Gameface views the "Three Marks" button is injected into, tried in order (module, class).
# UNVERIFIED on Lesta 1.45: the first importable one wins; none importable -> ModsList and the hotkey.
BUTTON_HOSTS = (
    ('gui.impl.lobby.crew.hangar_crew_widget', 'HangarCrewWidget'),
    ('gui.impl.lobby.hangar.hangar_view', 'HangarView'),
)

# Ctrl+Shift+T in the hangar opens the window (and ends the on-screen HUD edit mode).
HOTKEY = 'KEY_T'
HOTKEY_MODIFIERS = ('KEY_LCONTROL', 'KEY_LSHIFT')
