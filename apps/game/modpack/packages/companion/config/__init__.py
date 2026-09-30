from __future__ import absolute_import, division, print_function, unicode_literals

from ...core.compat import is_int, string_types
from ...core.settings import Schema, Settings
from .constants import (  # noqa: F401
    CHOICES,
    DEFAULT_SERVER_URL,
    DEFAULTS,
    DEFAULTS_REVISION,
    FEATURES,
    LIMITS,
    LOCAL_HOSTS,
    OPT_IN_FEATURES,
    RETIRED_DEFAULTS,
)


def is_valid_server_url(url):
    if not isinstance(url, string_types):
        return False
    url = url.strip()
    if url.startswith('https://') and len(url) > len('https://'):
        return True
    return any(_is_on_host(url, host) for host in LOCAL_HOSTS)


def _is_on_host(url, host):
    return url == host or url.startswith(host + ':') or url.startswith(host + '/')


def normalize_server_url(url):
    return url.rstrip('/') if is_valid_server_url(url) else None


SCHEMA = Schema(DEFAULTS, choices=CHOICES, limits=LIMITS, normalizers={'server_url': normalize_server_url})


# A fresh config (None) stays None: it takes today's defaults, so only a stored one is upgraded.
def upgraded(values):
    if not isinstance(values, dict):
        return values
    revision = values.get('defaults_revision')
    if not is_int(revision):
        revision = 0
    upgraded_values = dict(values, defaults_revision=DEFAULTS_REVISION)
    for since, key, old, new in RETIRED_DEFAULTS:
        if revision < since and values.get(key) == old:
            upgraded_values[key] = new
    return upgraded_values


class Config(Settings):

    schema = SCHEMA

    def __init__(self, values=None):
        Settings.__init__(self, upgraded(values))

    @property
    def server_url(self):
        return self.values['server_url']

    def endpoint(self, path):
        return self.server_url + '/' + path.lstrip('/')
