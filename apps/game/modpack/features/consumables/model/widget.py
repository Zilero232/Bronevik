from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud.icons import artefact_icon, shell_icon
from ....core.hud.widget import widget
from . import stats_ids, stats_values
from .constants import KIND, SEPARATOR

# Fair play: the own vehicle's consumables and shells, the icons and cooldowns the stock consumables panel shows.


def slot(item):
    return {'icon': artefact_icon(item.get('icon')), 'quantity': item['quantity'], 'remaining': round(item['remaining'], 1),
            'total': round(item['total'], 1), 'ready': item['ready'] and item['quantity'] > 0}


def shell(loadout, int_cd):
    item = loadout.shells[int_cd]
    return {'icon': shell_icon(item.get('icon'), kind='battle_ammo'), 'quantity': item['quantity'], 'current': int_cd == loadout.current}


def stats(loadout, int_cd, translate):
    item = loadout.shells[int_cd]
    return {'icon': shell_icon(item.get('icon'), kind='battle_ammo'), 'current': int_cd == loadout.current,
            'text': SEPARATOR.join(stats_values(loadout.stats[int_cd], translate))}


def consumables_widget(loadout, settings, translate):
    return widget(KIND, {
        'slots': [slot(loadout.items[int_cd]) for int_cd in loadout.item_order] if settings.get('show_consumables') else [],
        'shells': [shell(loadout, int_cd) for int_cd in loadout.shell_order] if settings.get('show_shells') else [],
        'stats': [stats(loadout, int_cd, translate) for int_cd in stats_ids(loadout, settings)] if settings.get('show_shell_stats') else [],
    })
