from __future__ import absolute_import, division, print_function, unicode_literals

from . import DamageLog, format_damage_log
from .constants import PREVIEW_ENTRIES


def preview_log():
    log = DamageLog()
    for kind, amount, vehicle, shell in PREVIEW_ENTRIES:
        log.add(kind, amount, vehicle, shell)
    return log


def preview_text(settings, translate):
    return format_damage_log(preview_log(), settings, translate)
