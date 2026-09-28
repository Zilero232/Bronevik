from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.log import log_exception

# RU 1.45 client source: gui/shared/gui_items/dossier/stats.py, the random-battle stats of a vehicle dossier
# (the max15x15 block) expose getMaxDamage / getMaxAssisted / getMaxFrags / getMaxXp; the carousel's own tooltip
# and the vehicle's achievements page read the same block.
GETTERS = (('damage', 'getMaxDamage'), ('assist', 'getMaxAssisted'), ('frags', 'getMaxFrags'), ('xp', 'getMaxXp'))


def selected_records():
    try:
        from CurrentVehicle import g_currentVehicle
        item = g_currentVehicle.item
        dossier = g_currentVehicle.getDossier() if item is not None else None
        stats = dossier.getRandomStats() if dossier is not None else None
    except Exception:
        log_exception('personal best: dossier')
        return None, {}
    if stats is None:
        return getattr(item, 'intCD', None), {}
    values = {}
    for metric, name in GETTERS:
        getter = getattr(stats, name, None)
        try:
            values[metric] = getter() if getter is not None else None
        except Exception:
            values[metric] = None
    return item.intCD, values
