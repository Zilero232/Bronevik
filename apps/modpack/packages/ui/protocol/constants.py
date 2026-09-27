from __future__ import absolute_import, division, print_function, unicode_literals

PROTOCOL_VERSION = 1
MAX_MESSAGE_CHARS = 64 * 1024

STATE_PROPERTY = 'state'
SEND_COMMAND = 'send'
MESSAGE_ARG = 'message'

COMMANDS = (
    'ready',
    'close',
    'set',
    'action',
    'language',
    'bind',
    'open',
    'profile_save',
    'profile_load',
    'profile_rename',
    'profile_delete',
    'profile_export',
    'profile_import',
    'hud_edit',
    'hud_move',
    'hud_reset',
)

REQUIRED = {
    'set': ('component', 'key', 'value'),
    'action': ('component', 'action'),
    'language': ('language',),
    'bind': ('code',),
    'open': ('path',),
    'profile_save': ('name',),
    'profile_load': ('id',),
    'profile_rename': ('id', 'name'),
    'profile_delete': ('id',),
    'profile_export': ('id',),
    'profile_import': ('code',),
    'hud_edit': ('active',),
    'hud_move': ('panel', 'x', 'y'),
    'hud_reset': ('panel',),
}

BUTTON_MARKER = 'otmetkiButton'
BUTTON_MARKER_VALUE = 'otmetki'

RES_MAP_WINDOW = 'otmetki/ui/settings'
RES_MAP_BUTTON = 'otmetki/ui/button'
GAMEFACE_ROOT = 'coui://gui/gameface/mods/triotmetki/ui'
