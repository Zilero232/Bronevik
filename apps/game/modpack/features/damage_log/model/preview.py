from __future__ import absolute_import, division, print_function, unicode_literals

from . import DamageLog, format_damage_log, format_last_hit
from .constants import PREVIEW_ENTRIES, PREVIEW_LAST_HIT, PREVIEW_SHELLS
from .widget import damage_log_widget, last_hit_widget


def preview_log():
    log = DamageLog()
    for kind, amount, vehicle, shell, source, vehicle_class in PREVIEW_ENTRIES:
        name, gold = PREVIEW_SHELLS.get(shell, (None, False))
        log.add(kind, amount, vehicle, shell, source, vehicle_class, shell_name=name, gold=gold)
    log.entries[-1]['ammo_rack'] = True
    return log


def preview_text(settings, translate):
    return format_damage_log(preview_log(), settings, translate)


def preview_last_hit(settings, translate):
    return format_last_hit(preview_hit(), settings, translate)


def preview_hit():
    log = DamageLog()
    log.add(*PREVIEW_LAST_HIT, shell_name='HE_MODERN')
    return log.last('received')


def preview_widget(settings, translate):
    return damage_log_widget(preview_log(), settings)


def preview_last_hit_widget(settings, translate):
    return last_hit_widget(preview_hit(), settings)
