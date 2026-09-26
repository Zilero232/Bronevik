from .compat import is_int, is_number, string_types, to_text

DEFAULT_SERVER_URL = 'https://api.otmetki.app'

FEATURES = (
    'send_battle_results',
    'send_moe_snapshots',
    'send_moe_distribution',
    'send_queue_times',
    'battle_moe_panel',
    'hangar_session_panel',
)

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
    'battle_moe_panel': True,
    'hangar_session_panel': True,
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


def _coerce(key, default, value):
    if isinstance(default, bool):
        return value if isinstance(value, bool) else None
    if is_int(default):
        if not is_number(value):
            return None
        value = int(value)
        low, high = LIMITS.get(key, (None, None))
        if low is not None:
            value = max(low, min(high, value))
        return value
    if isinstance(default, string_types):
        if not isinstance(value, string_types):
            return None
        value = to_text(value).strip()
        if key == 'server_url':
            if not is_valid_server_url(value):
                return None
            value = value.rstrip('/')
        return value
    return None


class Config(object):

    def __init__(self, values=None):
        self.values = dict(DEFAULTS)
        if values:
            self.update(values)

    def update(self, values):
        changed = []
        if not isinstance(values, dict):
            return changed
        for key, value in values.items():
            if key not in DEFAULTS:
                continue
            coerced = _coerce(key, DEFAULTS[key], value)
            if coerced is None:
                continue
            if self.values.get(key) != coerced:
                self.values[key] = coerced
                changed.append(key)
        return sorted(changed)

    def get(self, key):
        return self.values.get(key, DEFAULTS.get(key))

    def is_enabled(self, feature):
        return bool(self.values.get('enabled')) and bool(self.values.get(feature))

    @property
    def server_url(self):
        return self.values['server_url']

    def endpoint(self, path):
        return self.server_url + '/' + path.lstrip('/')

    def to_dict(self):
        return dict(self.values)
