from __future__ import absolute_import, division, print_function, unicode_literals

import re

from ...core.compat import string_types, to_text
from .constants import API_PREFIX, LOCAL_HOSTS, LOCAL_SITE_URL, SITE_URL

_SAFE_PATH = re.compile(r'^/(?!/)[A-Za-z0-9/_.~%?=&-]*$')


def site_url(server_url):
    """The site next to the API: https://api.<host> -> https://<host>; a local API -> the local site."""
    if not isinstance(server_url, string_types):
        return SITE_URL
    server_url = to_text(server_url).rstrip('/')
    if server_url.startswith(API_PREFIX):
        return 'https://' + server_url[len(API_PREFIX):]
    for host in LOCAL_HOSTS:
        if server_url.startswith(host):
            return LOCAL_SITE_URL
    return SITE_URL


def site_link(server_url, path):
    """An absolute link to a page of our site, or None: the window may only open site-relative paths."""
    if not isinstance(path, string_types) or not _SAFE_PATH.match(to_text(path)):
        return None
    return site_url(server_url) + to_text(path)
