from __future__ import absolute_import, division, print_function, unicode_literals

COMPANION_ID = 'companion'

GROUP_DATA = 'data'
GROUP_HANGAR = 'hangar'
GROUP_BATTLE = 'battle'
GROUPS = (GROUP_DATA, GROUP_HANGAR, GROUP_BATTLE)

COMPANION_SWITCH = 'enabled'
# The companion's own config.json keys (no feature claims them in its settings.SETTINGS).
COMPANION_KEYS = (
    'send_battle_results',
    'send_moe_snapshots',
    'send_moe_distribution',
    'send_queue_times',
    'send_loadouts',
    'send_shots',
    'share_settings',
    'settings_target',
    'settings_anonymous_stats',
    'settings_include_resolution',
    'settings_include_sensitivity',
    'flush_interval_seconds',
)
# Never editable in the window: connection, one-shot actions and the language (the header switches it).
HIDDEN_CONFIG_KEYS = ('server_url', 'bind_code', 'settings_action', 'language')

ACTION_SETTINGS_EXPORT = 'settings_export'
ACTION_SETTINGS_RESTORE = 'settings_restore'
COMPANION_ACTIONS = (ACTION_SETTINGS_EXPORT, ACTION_SETTINGS_RESTORE)

# Groups of the features that predate `GROUP` in a feature's settings.
KNOWN_GROUPS = {
    'marks_panel': GROUP_BATTLE,
    'session_stats': GROUP_HANGAR,
    'replay_upload': GROUP_DATA,
}

# Panel keys the HUD editor owns; the card shows the rest (alpha, font size, border, the panel's own).
PANEL_POSITION_KEYS = ('x', 'y', 'align_x', 'align_y', 'drag')
