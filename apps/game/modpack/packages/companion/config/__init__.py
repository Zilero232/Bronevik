from __future__ import absolute_import, division, print_function, unicode_literals

from ...core.compat import string_types
from ...core.settings import Schema, Settings
from .constants import CHOICES, DEFAULTS, DEFAULT_SERVER_URL, FEATURES, LIMITS, LOCAL_HOSTS, OPT_IN_FEATURES, SHARE_CHANNELS  # noqa: F401


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

    schema = SCHEMA

    @property
    def server_url(self):
        return self.values['server_url']

    def endpoint(self, path):
        return self.server_url + '/' + path.lstrip('/')
