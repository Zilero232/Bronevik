# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import math

from ....core.compat import is_int, is_number, to_text
from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, COLOR_UP, font, format_number
from ....core.shells import SHELL_CODES
from .constants import READY_MARK, SEPARATOR

# Fair play: the own vehicle's consumables and shells, exactly what the client's own consumables panel shows. The
# reload of enemies is on Lesta's forbidden list and is never read. The shell stats are the own gun's, the numbers the
# vanilla shell tooltip shows in battle (consumables_panel._makeShellTooltip, RU 1.45).


def shot_speed(raw, factor):
    """The shell velocity in m/s the game shows: the shot speed divided by the projectile speed factor."""
    if not is_number(raw) or not is_number(factor) or raw <= 0 or factor <= 0:
        return None
    return int(round(raw / factor))


def first_value(value):
    if isinstance(value, (tuple, list)):
        value = value[0] if value else None
    return int(round(value)) if is_number(value) and value > 0 else None


class Loadout(object):
    """The own consumables ({name, quantity, ready, remaining}) and shells ({code, quantity}) in their slot order."""

    def __init__(self):
        self.items = {}
        self.item_order = []
        self.shells = {}
        self.shell_order = []
        self.stats = {}
        self.current = None

    def set_item(self, int_cd, name, quantity, ready, remaining):
        if not is_int(int_cd) or not int_cd:
            return False
        item = {
            'name': to_text(name) if name else u'?',
            'quantity': int(quantity) if is_int(quantity) and quantity >= 0 else 0,
            'ready': bool(ready),
            'remaining': float(remaining) if is_number(remaining) and remaining > 0 else 0.0,
        }
        if int_cd not in self.items:
            self.item_order.append(int_cd)
        changed = self.items.get(int_cd) != item
        self.items[int_cd] = item
        return changed

    def set_shell(self, int_cd, code, quantity):
        if not is_int(int_cd) or not int_cd:
            return False
        shell = {'code': code if code in SHELL_CODES else None, 'quantity': int(quantity) if is_int(quantity) and quantity >= 0 else 0}
        if int_cd not in self.shells:
            self.shell_order.append(int_cd)
        changed = self.shells.get(int_cd) != shell
        self.shells[int_cd] = shell
        return changed

    def set_stats(self, int_cd, penetration, damage, speed):
        if not is_int(int_cd) or not int_cd:
            return False
        stats = {'penetration': first_value(penetration), 'damage': first_value(damage), 'speed': speed if is_int(speed) and speed > 0 else None}
        changed = self.stats.get(int_cd) != stats
        self.stats[int_cd] = stats
        return changed

    def set_current(self, int_cd):
        current = int_cd if is_int(int_cd) else None
        changed = current != self.current
        self.current = current
        return changed

    def tick(self, seconds):
        running = False
        for item in self.items.values():
            if item['remaining'] > 0:
                item['remaining'] = max(0.0, item['remaining'] - seconds)
                running = True
        return running


def item_text(item, translate, size):
    if item['quantity'] <= 0:
        return font(u'%s ×0' % item['name'], COLOR_MUTED, size)
    if item['remaining'] > 0:
        return font(translate('cons_cooldown', name=item['name'], seconds=int(math.ceil(item['remaining']))), COLOR_MUTED, size)
    if item['ready']:
        mark = READY_MARK if item['quantity'] == 1 else u'×%d' % item['quantity']
        return u'%s %s' % (font(item['name'], COLOR_NEUTRAL, size), font(mark, COLOR_UP, size))
    return font(item['name'], COLOR_MUTED, size)


def shell_text(shell, translate, size):
    label = translate('cons_shell_' + shell['code']) if shell['code'] else u'?'
    color = COLOR_NEUTRAL if shell['quantity'] > 0 else COLOR_MUTED
    return font(u'%s %s' % (label, format_number(shell['quantity'])), color, size)


def stats_text(shell, stats, translate, size, current):
    label = translate('cons_shell_' + shell['code']) if shell['code'] else u'?'
    values = []
    if stats.get('penetration'):
        values.append(translate('cons_penetration', value=format_number(stats['penetration'])))
    if stats.get('damage'):
        values.append(translate('cons_damage', value=format_number(stats['damage'])))
    if stats.get('speed'):
        values.append(translate('cons_speed', value=format_number(stats['speed'])))
    if not values:
        return None
    return u'%s %s' % (font(label + u':', COLOR_NEUTRAL if current else COLOR_MUTED, size), font(SEPARATOR.join(values), COLOR_MUTED, size))


def stats_lines(loadout, settings, translate, size):
    if settings.get('shell_stats') == 'all':
        ids = [int_cd for int_cd in loadout.shell_order if int_cd in loadout.stats]
    else:
        ids = [loadout.current] if loadout.current in loadout.stats and loadout.current in loadout.shells else []
    lines = [stats_text(loadout.shells[int_cd], loadout.stats[int_cd], translate, size, int_cd == loadout.current) for int_cd in ids]
    return [line for line in lines if line]


def format_panel(loadout, settings, translate):
    size = settings.get('font_size')
    lines = []
    if settings.get('show_consumables') and loadout.item_order:
        lines.append(SEPARATOR.join(item_text(loadout.items[int_cd], translate, size) for int_cd in loadout.item_order))
    if settings.get('show_shells') and loadout.shell_order:
        lines.append(SEPARATOR.join(shell_text(loadout.shells[int_cd], translate, size) for int_cd in loadout.shell_order))
    if settings.get('show_shell_stats'):
        lines.extend(stats_lines(loadout, settings, translate, size))
    return u'\n'.join(lines) if lines else None
