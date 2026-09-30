from __future__ import absolute_import, division, print_function, unicode_literals

COMPANION_ID = 'companion'

GROUP_DATA = 'data'
GROUP_HANGAR = 'hangar'
GROUP_BATTLE = 'battle'
GROUPS = (GROUP_DATA, GROUP_HANGAR, GROUP_BATTLE)

COMPANION_SWITCH = 'enabled'
COMPANION_KEYS = (
    'send_battle_results',
    'send_moe_snapshots',
    'send_queue_times',
    'send_loadouts',
    'send_shots',
    'share_settings',
    'settings_target',
    'settings_anonymous_stats',
    'settings_include_resolution',
    'settings_include_sensitivity',
    'flush_interval_seconds',
    'hud_modifier',
)
# Never editable in the window: connection, one-shot actions and the language (the header switches it).
HIDDEN_CONFIG_KEYS = ('server_url', 'bind_code', 'settings_action', 'language')

ACTION_SETTINGS_EXPORT = 'settings_export'
ACTION_SETTINGS_RESTORE = 'settings_restore'
COMPANION_ACTIONS = (ACTION_SETTINGS_EXPORT, ACTION_SETTINGS_RESTORE)

PANEL_POSITION_KEYS = ('x', 'y', 'align_x', 'align_y', 'drag', 'scale')

# The settings window's navigation: every component card sits on one section page. Profiles and the HUD editor are
# pages of their own (the page's SECTION constants), not component sections.
SECTION_BATTLE = 'battle'
SECTION_HANGAR = 'hangar'
SECTION_MARKS = 'marks'
SECTION_REPLAYS = 'replays'
SECTION_STREAMER = 'streamer'
SECTION_DATA = 'data'
SECTIONS = (SECTION_BATTLE, SECTION_HANGAR, SECTION_MARKS, SECTION_REPLAYS, SECTION_STREAMER, SECTION_DATA)

# Where a component shows anything: only in the hangar, only in battle, or in both. catalog/catalog.json carries the
# same `context` for the manager and the MOST bundler (packages/ui/tests/test_placement.py keeps both in step).
CONTEXT_HANGAR = 'hangar'
CONTEXT_BATTLE = 'battle'
CONTEXT_ANY = 'any'
CONTEXTS = (CONTEXT_HANGAR, CONTEXT_BATTLE, CONTEXT_ANY)

PLACEMENT = {
    'companion': (SECTION_DATA, CONTEXT_ANY),
    'marks_panel': (SECTION_MARKS, CONTEXT_BATTLE),
    'damage_log': (SECTION_BATTLE, CONTEXT_BATTLE),
    'last_hit': (SECTION_BATTLE, CONTEXT_BATTLE),
    'hit_log': (SECTION_BATTLE, CONTEXT_BATTLE),
    'team_hp': (SECTION_BATTLE, CONTEXT_BATTLE),
    'sixth_sense': (SECTION_BATTLE, CONTEXT_BATTLE),
    'battle_clock': (SECTION_BATTLE, CONTEXT_ANY),
    'personal_best': (SECTION_MARKS, CONTEXT_ANY),
    'main_gun': (SECTION_MARKS, CONTEXT_BATTLE),
    'battle_efficiency': (SECTION_MARKS, CONTEXT_BATTLE),
    'consumables': (SECTION_BATTLE, CONTEXT_BATTLE),
    'reload_timer': (SECTION_BATTLE, CONTEXT_BATTLE),
    'gun_arc': (SECTION_BATTLE, CONTEXT_BATTLE),
    'received_hits': (SECTION_BATTLE, CONTEXT_BATTLE),
    'death_card': (SECTION_BATTLE, CONTEXT_BATTLE),
    'bush_circle': (SECTION_BATTLE, CONTEXT_BATTLE),
    'arty_meter': (SECTION_BATTLE, CONTEXT_ANY),
    'platoon_points': (SECTION_BATTLE, CONTEXT_BATTLE),
    'battle_loadout': (SECTION_BATTLE, CONTEXT_BATTLE),
    'minimap': (SECTION_BATTLE, CONTEXT_BATTLE),
    'crosshair': (SECTION_BATTLE, CONTEXT_BATTLE),
    'camera': (SECTION_BATTLE, CONTEXT_BATTLE),
    'battle_sounds': (SECTION_BATTLE, CONTEXT_BATTLE),
    'chat_filter': (SECTION_STREAMER, CONTEXT_BATTLE),
    'streamer_mode': (SECTION_STREAMER, CONTEXT_ANY),
    'hangar_cleaner': (SECTION_STREAMER, CONTEXT_HANGAR),
    'session_stats': (SECTION_MARKS, CONTEXT_HANGAR),
    'battle_results': (SECTION_MARKS, CONTEXT_HANGAR),
    'marks_history': (SECTION_MARKS, CONTEXT_HANGAR),
    'hangar_ratings': (SECTION_MARKS, CONTEXT_HANGAR),
    'hangar_marks': (SECTION_MARKS, CONTEXT_HANGAR),
    'session_goals': (SECTION_MARKS, CONTEXT_ANY),
    'tilt_guard': (SECTION_MARKS, CONTEXT_HANGAR),
    'hangar_tweaks': (SECTION_HANGAR, CONTEXT_HANGAR),
    'hangar_info': (SECTION_HANGAR, CONTEXT_HANGAR),
    'battle_hits': (SECTION_HANGAR, CONTEXT_HANGAR),
    'personal_missions': (SECTION_HANGAR, CONTEXT_ANY),
    'platoon_helper': (SECTION_HANGAR, CONTEXT_HANGAR),
    'auto_resupply': (SECTION_HANGAR, CONTEXT_HANGAR),
    'notification_filter': (SECTION_HANGAR, CONTEXT_HANGAR),
    'replay_manager': (SECTION_REPLAYS, CONTEXT_HANGAR),
    'replay_upload': (SECTION_REPLAYS, CONTEXT_HANGAR),
}
