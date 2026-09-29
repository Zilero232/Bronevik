from __future__ import absolute_import, division, print_function, unicode_literals

from . import Loadout, format_panel
from .constants import PREVIEW_CURRENT, PREVIEW_ITEMS, PREVIEW_SHELLS, PREVIEW_STATS


def preview_loadout():
    loadout = Loadout()
    for int_cd, name, quantity, ready, remaining in PREVIEW_ITEMS:
        loadout.set_item(int_cd, name, quantity, ready, remaining)
    for int_cd, code, quantity in PREVIEW_SHELLS:
        loadout.set_shell(int_cd, code, quantity)
    for int_cd, penetration, damage, speed in PREVIEW_STATS:
        loadout.set_stats(int_cd, penetration, damage, speed)
    loadout.set_current(PREVIEW_CURRENT)
    return loadout


def preview_text(settings, translate):
    return format_panel(preview_loadout(), settings, translate) or u''
