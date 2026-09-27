from ..core.compat import string_types
from ..core.settings import Schema, Settings

DEFAULT_SERVER_URL = 'https://api.triotmetki.ru'

FEATURES = (
    'send_battle_results',
    'send_moe_snapshots',
    'send_moe_distribution',
    'send_queue_times',
    'send_loadouts',
    'send_shots',
    'battle_moe_panel',
    'hangar_session_panel',
    'battle_damage_log',
    'battle_hit_log',
    'battle_clock',
    'battle_team_hp',
    'battle_sixth_sense',
    'hangar_battle_results',
    'hangar_replay_manager',
    'hangar_tweaks',
    'minimap_tweaks',
    'camera_tweaks',
    'crosshair_presets',
    'share_settings',
    'upload_replays',
    'publish_replays',
)

# Switches that stay off until the player turns them on.
OPT_IN_FEATURES = ('upload_replays', 'publish_replays')

DEFAULTS = {
    'enabled': True,
    'server_url': DEFAULT_SERVER_URL,
    'language': 'auto',
    'session_idle_minutes': 60,
    'flush_interval_seconds': 15,
    'bind_code': '',
    'send_battle_results': True,
    'send_moe_snapshots': True,
    'send_moe_distribution': True,
    'send_queue_times': True,
    'send_loadouts': True,
    'send_shots': True,
    'battle_moe_panel': True,
    'hangar_session_panel': True,
    'battle_damage_log': True,
    'battle_hit_log': True,
    'battle_clock': True,
    'battle_team_hp': True,
    'battle_sixth_sense': True,
    'hangar_battle_results': True,
    'hangar_replay_manager': True,
    'hangar_tweaks': True,
    'minimap_tweaks': True,
    'camera_tweaks': True,
    'crosshair_presets': True,
    'share_settings': True,
    'upload_replays': False,
    'publish_replays': False,
    'settings_action': '',
    'settings_target': 'private',
    'settings_anonymous_stats': False,
    'settings_include_resolution': False,
    'settings_include_sensitivity': False,
}

CHOICES = {
    'settings_action': ('', 'export', 'restore'),
    'settings_target': ('profile', 'private'),
}

LIMITS = {
    'session_idle_minutes': (10, 24 * 60),
    'flush_interval_seconds': (5, 600),
}

LOCAL_HOSTS = ('http://localhost', 'http://127.0.0.1')


def is_valid_server_url(url):
    if not isinstance(url, string_types):
        return False
    url = url.strip()
    if url.startswith('https://') and len(url) > len('https://'):
        return True
    for host in LOCAL_HOSTS:
        if url == host or url.startswith(host + ':') or url.startswith(host + '/'):
            return True
    return False


def normalize_server_url(url):
    return url.rstrip('/') if is_valid_server_url(url) else None


SCHEMA = Schema(DEFAULTS, choices=CHOICES, limits=LIMITS, normalizers={'server_url': normalize_server_url})


class Config(Settings):
    """The companion's config.json. The schema lists every switch, the features' included, so a switch
    survives a save while its feature package is not installed."""

    schema = SCHEMA

    @property
    def server_url(self):
        return self.values['server_url']

    def endpoint(self, path):
        return self.server_url + '/' + path.lstrip('/')
