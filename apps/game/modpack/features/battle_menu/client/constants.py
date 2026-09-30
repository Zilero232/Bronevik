from __future__ import absolute_import, division, print_function, unicode_literals

# RU 1.45 client source: gui/Scaleform/daapi/view/battle/shared/ingame_menu.py. The Esc menu is a Scaleform window
# (ingameMenu.swf, WindowLayer.TOP_WINDOW, modal) with four fixed buttons in its SWF; nothing can join them without a
# Flash patch, so the button lives on the HUD page for as long as the menu is populated.
MENU_MODULE = 'gui.Scaleform.daapi.view.battle.shared.ingame_menu'
MENU_CLASS = 'IngameMenu'
POPULATE_METHOD = '_populate'
DISPOSE_METHOD = '_dispose'
