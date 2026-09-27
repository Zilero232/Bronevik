from __future__ import absolute_import, division, print_function, unicode_literals

from .constants import EVENT_ENTRIES, OFFER_BANNERS, SWITCHES, TEASER  # noqa: F401

# Fair play: hangar only and cosmetic. Left out: CSS injection into Gameface hangar views (selectors change
# every patch and cannot be verified without the live client).


def hides(element, values, enabled):
    key = SWITCHES.get(element)
    return bool(enabled and key and values.get(key))
