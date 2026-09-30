from __future__ import absolute_import, division, print_function, unicode_literals

# Context keys of the stock GUI events (RU 1.45 client source: SharedPage._toggleGuiVisible,
# ClassicPage._handleToggleFullStats).
GUI_VISIBLE = 'visible'
FULL_STATS_DOWN = 'isDown'
# GameEvent.SHOW_EXTENDED_INFO (battle_control/event_dispatcher.showExtendedInfo, RU 1.45): Alt down or up.
EXTENDED_INFO_DOWN = 'isDown'
# The app bus event our panels with an alternate (Alt) mode follow: `held` is True while Alt is down.
EXTENDED_INFO_EVENT = 'battle_extended_info'
# GameEvent.BATTLE_LOADING (RU 1.45 client source: app_factory._toggleBattleLoading): the loading screen with the team
# lists shown or gone.
LOADING_SHOWN = 'isShown'
# AvatarInputHandler events (RU 1.45 client source: control_modes.PostMortemControlMode): the post-mortem camera moves
# to the killer and back. (event, shown).
KILLER_VISION_EVENTS = (('onPostmortemKillerVisionEnter', True), ('onPostmortemKillerVisionExit', False))
