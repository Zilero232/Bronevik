from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import call
from ....core.log import log_exception

# RU 1.45 client source: gui/shared/gui_items/dossier/stats.py, the random-battle stats of a vehicle dossier
# (the max15x15 block) expose getMaxDamage / getMaxAssisted / getMaxFrags / getMaxXp; the carousel's own tooltip
# and the vehicle's achievements page read the same block.
GETTERS = (('damage', 'getMaxDamage'), ('assist', 'getMaxAssisted'), ('frags', 'getMaxFrags'), ('xp', 'getMaxXp'))


def selected_stats():
    from CurrentVehicle import g_currentVehicle

    item = g_currentVehicle.item
    if item is None:
        return None, None

    dossier = g_currentVehicle.getDossier()
    if dossier is None:
        return item, None
    return item, dossier.getRandomStats()


def selected_records():
    try:
        item, stats = selected_stats()
    except Exception:
        log_exception('personal best: dossier')
        return None, {}

    if stats is None:
        return getattr(item, 'intCD', None), {}
    return item.intCD, dict((metric, call(stats, name)) for metric, name in GETTERS)
