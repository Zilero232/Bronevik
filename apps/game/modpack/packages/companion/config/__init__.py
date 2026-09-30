from __future__ import absolute_import, division, print_function, unicode_literals

from ...core.compat import string_types
from ...core.settings import Schema, Settings
from .constants import (CHOICES, DEFAULTS, DEFAULT_SERVER_URL, DEFAULTS_REVISION, FEATURES, LIMITS, LOCAL_HOSTS, OPT_IN_FEATURES,  # noqa: F401
                        RETIRED_DEFAULTS, SHARE_CHANNELS)


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


def upgraded(values):
    """A stored config with the switches still at a retired default moved to the new one, stamped with the current revision
    (None, a fresh config, stays None: it takes today's defaults)."""
    if not isinstance(values, dict):
        return values
    revision = values.get('defaults_revision')
    revision = revision if isinstance(revision, int) and not isinstance(revision, bool) else 0
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
