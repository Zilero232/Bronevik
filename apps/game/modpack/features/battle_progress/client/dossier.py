from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import call
from ....core.log import log_exception
from .constants import DOSSIER_GETTERS


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
        log_exception('battle progress: dossier')
        return None, {}

    if stats is None:
        return getattr(item, 'intCD', None), {}
    return item.intCD, dict((metric, call(stats, name)) for metric, name in DOSSIER_GETTERS)
