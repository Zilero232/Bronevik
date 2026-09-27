from ...core.compat import string_types
from ...core.settings import Schema, Settings
from .constants import CHOICES, DEFAULTS, DEFAULT_SERVER_URL, FEATURES, LIMITS, LOCAL_HOSTS, OPT_IN_FEATURES  # noqa: F401


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
