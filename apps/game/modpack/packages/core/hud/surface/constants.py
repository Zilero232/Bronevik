from __future__ import absolute_import, division, print_function, unicode_literals

# The Gameface HUD page (ui-web `hud` entry, packages/ui/gameface/hud.html) and its view model: one string
# property with the whole HUD as JSON, one command the page sends its messages through.
HUD_PROTOCOL_VERSION = 1
HUD_STATE_PROPERTY = 'state'
HUD_SEND_COMMAND = 'send'
HUD_MESSAGE_ARG = 'message'
HUD_COMMANDS = ('ready', 'moved')
HUD_MAX_MESSAGE_CHARS = 4 * 1024
HUD_RES_MAP_ID = 'otmetki/ui/hud'

SPACE_BATTLE = 'battle'
SPACE_LOBBY = 'lobby'

ALIGN_X = ('left', 'center', 'right')
ALIGN_Y = ('top', 'center', 'bottom')
POSITION_LIMIT = 4000

# GUIFlash label props -> the page's panel keys, with the value a panel has when a prop was never sent.
PANEL_KEYS = (
    ('text', 'text', ''),
    ('x', 'x', 0),
    ('y', 'y', 0),
    ('alignX', 'align_x', 'left'),
    ('alignY', 'align_y', 'top'),
    ('alpha', 'alpha', 1.0),
    ('drag', 'drag', False),
    ('border', 'border', False),
    ('visible', 'visible', True),
)
