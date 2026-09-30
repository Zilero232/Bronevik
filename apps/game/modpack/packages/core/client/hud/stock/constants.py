from __future__ import absolute_import, division, print_function, unicode_literals

# Context keys of the stock GUI events (RU 1.45 client source: SharedPage._toggleGuiVisible, ClassicPage._handleToggleFullStats).
GUI_VISIBLE = 'visible'
FULL_STATS_DOWN = 'isDown'
# GameEvent.SHOW_EXTENDED_INFO (battle_control/event_dispatcher.showExtendedInfo, RU 1.45): Alt down or up.
EXTENDED_INFO_DOWN = 'isDown'
# The app bus event our panels with an alternate (Alt) mode follow: `held` is True while Alt is down.
EXTENDED_INFO_EVENT = 'battle_extended_info'
