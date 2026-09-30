from __future__ import absolute_import, division, print_function, unicode_literals

NATIVE = 'native'
ON = 'on'
OFF = 'off'
TRI_STATE = (NATIVE, ON, OFF)

# state.json keys of the one-time client presets (core.native_settings.initial): the client values a component replaced,
# per component, and per component the defaults revision whose presets it wrote (PENDING: a fresh install that has
# not reached the hangar with the switch on yet).
BACKUP_STATE_KEY = 'native_backup'
STAMP_STATE_KEY = 'native_initial_applied'
INITIAL_REVISION = 3
PENDING = 0
STEP_APPLY = 'apply'
STEP_NATIVE = 'native'

ACTION_RESTORE = 'native_restore'
ACTION_RECOMMENDED = 'native_recommended'
