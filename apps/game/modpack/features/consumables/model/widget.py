from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud.icons import artefact_icon, shell_icon
from ....core.hud.widget import widget
from . import stats_ids, stats_values
from .constants import KIND, SEPARATOR

# Fair play: the own vehicle's consumables and shells, the icons and cooldowns the stock consumables panel shows.


def slot(item):
    return {
        'icon': artefact_icon(item.get('icon')),
        'quantity': item['quantity'],
        'remaining': round(item['remaining'], 1),
        'total': round(item['total'], 1),
        'ready': item['ready'] and item['quantity'] > 0,
    }


def ammo_icon(item):
    return shell_icon(item.get('icon'), kind='battle_ammo')


def shell(loadout, int_cd):
    item = loadout.shells[int_cd]
    return {
        'icon': ammo_icon(item),
        'quantity': item['quantity'],
        'current': int_cd == loadout.current,
    }


def stats(loadout, int_cd, translate):
    return {
        'icon': ammo_icon(loadout.shells[int_cd]),
        'current': int_cd == loadout.current,
        'text': SEPARATOR.join(stats_values(loadout.stats[int_cd], translate)),
    }


def slots_of(loadout, settings):
    if not settings.get('show_consumables'):
        return []
    return [slot(loadout.items[int_cd]) for int_cd in loadout.item_order]


def shells_of(loadout, settings):
    if not settings.get('show_shells'):
        return []
    return [shell(loadout, int_cd) for int_cd in loadout.shell_order]


def stats_of(loadout, settings, translate):
    if not settings.get('show_shell_stats'):
        return []
    return [stats(loadout, int_cd, translate) for int_cd in stats_ids(loadout, settings)]


def consumables_widget(loadout, settings, translate):
    return widget(KIND, {
        'slots': slots_of(loadout, settings),
        'shells': shells_of(loadout, settings),
        'stats': stats_of(loadout, settings, translate),
    })
