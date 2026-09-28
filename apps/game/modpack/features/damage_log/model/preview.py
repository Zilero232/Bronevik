from __future__ import absolute_import, division, print_function, unicode_literals

from . import DamageLog, format_damage_log, format_last_hit
from .constants import PREVIEW_ENTRIES, PREVIEW_LAST_HIT


def preview_log():
    log = DamageLog()
    for kind, amount, vehicle, shell, source, vehicle_class in PREVIEW_ENTRIES:
        log.add(kind, amount, vehicle, shell, source, vehicle_class)
    return log


def preview_text(settings, translate):
    return format_damage_log(preview_log(), settings, translate)


def preview_last_hit(settings, translate):
    log = DamageLog()
    log.add(*PREVIEW_LAST_HIT)
    return format_last_hit(log.last('received'), settings, translate)
