from __future__ import absolute_import, division, print_function, unicode_literals

from . import HitLog, format_hit_log
from .constants import PREVIEW_HITS


def preview_log(now=0.0):
    log = HitLog()
    for index, (target, vehicle, outcome, damage, shell, hp) in enumerate(PREVIEW_HITS):
        moment = now + index * 10.0
        if damage is None:
            log.add_result(target, outcome, moment, vehicle)
            continue
        log.add_damage(target, damage, moment, vehicle, shell)
        log.set_health(target, hp, moment)
    return log


def preview_text(settings, translate):
    return format_hit_log(preview_log(), settings, translate)
