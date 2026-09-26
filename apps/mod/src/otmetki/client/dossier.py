from __future__ import absolute_import

from CurrentVehicle import g_currentVehicle
from dossiers2.ui.achievements import ACHIEVEMENT_BLOCK

from ..moe import MIN_TIER


def _battles(dossier):
    stats = dossier.getRandomStats()
    for name in ('getBattlesCountVer2', 'getBattlesCount'):
        getter = getattr(stats, name, None)
        if getter is not None:
            return getter()
    return None


def current_vehicle_moe():
    item = g_currentVehicle.item
    if item is None or item.level < MIN_TIER:
        return None
    dossier = g_currentVehicle.getDossier()
    if dossier is None:
        return None
    rating = dossier.getRecordValue(ACHIEVEMENT_BLOCK.TOTAL, 'damageRating')
    moving_avg = dossier.getRecordValue(ACHIEVEMENT_BLOCK.TOTAL, 'movingAvgDamage')
    if not moving_avg:
        return None
    return {
        'tank_id': item.intCD,
        'name': item.name,
        'tier': item.level,
        'damage_rating': rating,
        'moving_avg_damage': moving_avg,
        'marks_on_gun': dossier.getRecordValue(ACHIEVEMENT_BLOCK.TOTAL, 'marksOnGun'),
        'battles': _battles(dossier),
    }


def current_vehicle_id():
    item = g_currentVehicle.item
    return item.intCD if item is not None else None
