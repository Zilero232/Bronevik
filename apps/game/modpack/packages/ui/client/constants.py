from __future__ import absolute_import, division, print_function, unicode_literals

MODS_LIST_ID = 'otmetki'
ICON_PATH = 'gui/gameface/mods/triotmetki/ui/icon.png'
BROWSER_OPENERS = ('openWebBrowser', 'wg_openWebBrowser')

# Hangar Gameface views the "Three Marks" button is injected into, tried in order (module, class). RU 1.45
# client source: gui/impl/lobby/crew/hangar_crew_widget.py HangarCrewWidget(ViewImpl) with _onLoading, and
# frameworks/wulf/view/view.py setChildView(resourceID, view); the 1.45 hangar has no gui.impl HangarView.
# None importable -> ModsList and the hotkey.
BUTTON_HOSTS = (
    ('gui.impl.lobby.crew.hangar_crew_widget', 'HangarCrewWidget'),
)

# Ctrl+Shift+T in the hangar opens the window (and ends the on-screen HUD edit mode).
HOTKEY = 'KEY_T'
HOTKEY_MODIFIERS = ('KEY_LCONTROL', 'KEY_LSHIFT')
