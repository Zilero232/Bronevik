from __future__ import absolute_import, division, print_function, unicode_literals

# RU 1.45 client source: gui/game_control/hangar_switch_controller.py. IHangarSpaceSwitchController keeps
# currentSceneName (constants.DEFAULT_HANGAR_SCENE outside event and mode hangars) and _defaultHangarSpaceConfig, whose
# setSpaceIdOverride(isPremium, path) / discardSpaceIdOverride(isPremium) the server's cmd_change_hangar notifications
# use for event hangars (its _spaceIdOverride dict holds them); processPossibleSceneChange() reloads the space it
# names. gui.ClientHangarSpace._HANGAR_CFGS maps every space path to its config once the lobby read them.
CONTROLLER_SKELETON = ('skeletons.gui.game_control', 'IHangarSpaceSwitchController')
DEFAULT_CONFIG_ATTR = '_defaultHangarSpaceConfig'
OVERRIDES_ATTR = '_spaceIdOverride'
HANGAR_CONFIGS = ('gui.ClientHangarSpace', '_HANGAR_CFGS')
DEFAULT_SCENE = ('constants', 'DEFAULT_HANGAR_SCENE')
HANGAR_SPACE_SKELETON = ('skeletons.gui.shared.utils', 'IHangarSpace')
# IHangarSpace.onSpaceCreate fires once a space finished loading; the switch controller itself waits for it
# (onLobbyInited -> _delayedProcessChange) before it reloads a space.
SPACE_CREATED = 'onSpaceCreate'
