from __future__ import absolute_import, division, print_function, unicode_literals

# 2: the replays page left the settings state for the `feed` property (a snapshot, then only the changed items).
PROTOCOL_VERSION = 2
MAX_MESSAGE_CHARS = 64 * 1024

STATE_PROPERTY = 'state'
FEED_PROPERTY = 'feed'
SEND_COMMAND = 'send'
MESSAGE_ARG = 'message'

COMMANDS = (
    'ready',
    'close',
    'set',
    'set_many',
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
    'hud_reset_all',
    'window_layout',
    'feed',
    'diag',
)

REQUIRED = {
    'set': ('component', 'key', 'value'),
    'set_many': ('component', 'values'),
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
    'window_layout': ('x', 'y', 'width', 'height', 'zoom'),
    'feed': ('component', 'active'),
    'diag': ('text',),
}

# Commands that change nothing in the settings state: the window gets no new state for them.
QUIET_COMMANDS = ('feed', 'diag')

# A diag line from the page goes to otmetki.log cut to this many characters.
MAX_DIAG_CHARS = 400

RES_MAP_WINDOW = 'otmetki/ui/settings'
