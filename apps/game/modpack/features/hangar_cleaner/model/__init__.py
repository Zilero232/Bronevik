from __future__ import absolute_import, division, print_function, unicode_literals

from .constants import CLIENT_VERSION, EVENT_ENTRIES, OFFER_BANNERS, SWITCHES, TEASER, VERIFIED_CLIENTS  # noqa: F401

# Fair play: hangar only and cosmetic. Left out: CSS injection into Gameface hangar views (selectors change
# every patch and cannot be verified without the live client).


def hides(element, values, enabled):
    key = SWITCHES.get(element)
    return bool(enabled and key and values.get(key))


def client_major_minor(version):
    match = CLIENT_VERSION.search(version or '')
    if match is None:
        return None
    return int(match.group(1)), int(match.group(2))


def private_overrides_allowed(version):
    return client_major_minor(version) in VERIFIED_CLIENTS
