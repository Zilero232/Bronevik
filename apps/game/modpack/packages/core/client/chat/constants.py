from __future__ import absolute_import, division, print_function, unicode_literals

# RU 1.45: BattleLayout.addMessage(message, doFormatting) / addCommand(command) put every battle chat line
# and quick command on screen; _ChannelController._formatMessage builds the line (team, common, squad).
LAYOUT_MODULE = 'messenger.gui.Scaleform.channels.layout'
LAYOUT_CLASS = 'BattleLayout'
CONTROLLERS_MODULE = 'messenger.gui.Scaleform.channels.bw_chat2.battle_controllers'
CONTROLLER_CLASS = '_ChannelController'
