# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import math

from ....core.compat import is_int, is_number, to_text
from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, COLOR_UP, font, format_number
from ....core.hud.icons import item_name
from ....core.shells import SHELL_CODES
from ....core.vendor import attr
from .constants import READY_MARK, SEPARATOR, STAT_KEYS, UNKNOWN

# Fair play: the own vehicle's consumables and shells, exactly what the client's own consumables panel shows. The
# reload of enemies is on Lesta's forbidden list and is never read. The shell stats are the own gun's, the numbers the
# vanilla shell tooltip shows in battle (consumables_panel._makeShellTooltip, RU 1.45).


# The shell velocity in m/s the game shows: the shot speed divided by the projectile speed factor.
def shot_speed(raw, factor):
    if not is_number(raw) or not is_number(factor):
        return None
    if raw <= 0 or factor <= 0:
        return None
    return int(round(raw / factor))


def first_value(value):
    if isinstance(value, (tuple, list)):
        value = value[0] if value else None
    if not is_number(value) or value <= 0:
        return None
    return int(round(value))


def _count(value):
    return int(value) if is_int(value) and value >= 0 else 0


def _seconds(value):
    return float(value) if is_number(value) and value > 0 else 0.0


def _is_slot(int_cd):
    return is_int(int_cd) and int_cd != 0


def _replace(entries, int_cd, entry):
    changed = entries.get(int_cd) != entry
    entries[int_cd] = entry
    return changed


@attr.s
class ItemReading(object):

    name = attr.ib()
    quantity = attr.ib()
    ready = attr.ib()
    remaining = attr.ib()
    icon = attr.ib(default=None)
    total = attr.ib(default=None)


def clean_item(reading):
    remaining = _seconds(reading.remaining)
    return {
        'name': to_text(reading.name) if reading.name else UNKNOWN,
        'quantity': _count(reading.quantity),
        'ready': bool(reading.ready),
        'remaining': remaining,
        'icon': item_name(reading.icon),
        'total': max(_seconds(reading.total), remaining),
    }


class Loadout(object):

    def __init__(self):
        self.items = {}
        self.item_order = []
        self.shells = {}
        self.shell_order = []
        self.stats = {}
        self.current = None

    def set_item(self, int_cd, reading):
        if not _is_slot(int_cd):
            return False

        if int_cd not in self.items:
            self.item_order.append(int_cd)
        return _replace(self.items, int_cd, clean_item(reading))

    def set_shell(self, int_cd, code, quantity, icon=None):
        if not _is_slot(int_cd):
            return False

        known = self.shells.get(int_cd) or {}
        shell = {
            'code': code if code in SHELL_CODES else None,
            'quantity': _count(quantity),
            'icon': item_name(icon) or known.get('icon'),
        }
        if int_cd not in self.shells:
            self.shell_order.append(int_cd)
        return _replace(self.shells, int_cd, shell)

    def set_stats(self, int_cd, penetration, damage, speed):
        if not _is_slot(int_cd):
            return False

        stats = {
            'penetration': first_value(penetration),
            'damage': first_value(damage),
            'speed': speed if is_int(speed) and speed > 0 else None,
        }
        return _replace(self.stats, int_cd, stats)

    def set_current(self, int_cd):
        current = int_cd if is_int(int_cd) else None
        changed = current != self.current
        self.current = current
        return changed

    def tick(self, seconds):
        is_running = False
        for item in self.items.values():
            if item['remaining'] > 0:
                item['remaining'] = max(0.0, item['remaining'] - seconds)
                is_running = True
        return is_running


def item_text(item, translate, size):
    if item['quantity'] <= 0:
        return font(u'%s ×0' % item['name'], COLOR_MUTED, size)

    if item['remaining'] > 0:
        seconds = int(math.ceil(item['remaining']))
        return font(translate('cons_cooldown', name=item['name'], seconds=seconds), COLOR_MUTED, size)

    if item['ready']:
        mark = READY_MARK if item['quantity'] == 1 else u'×%d' % item['quantity']
        return u'%s %s' % (font(item['name'], COLOR_NEUTRAL, size), font(mark, COLOR_UP, size))

    return font(item['name'], COLOR_MUTED, size)


def shell_label(shell, translate):
    if not shell['code']:
        return UNKNOWN
    return translate('cons_shell_' + shell['code'])


def shell_text(shell, translate, size):
    color = COLOR_NEUTRAL if shell['quantity'] > 0 else COLOR_MUTED
    text = u'%s %s' % (shell_label(shell, translate), format_number(shell['quantity']))
    return font(text, color, size)


def stats_values(stats, translate):
    return [
        translate(string_key, value=format_number(stats[stat]))
        for stat, string_key in STAT_KEYS
        if stats.get(stat)
    ]


def stats_text(shell, stats, translate, size, current):
    values = stats_values(stats, translate)
    if not values:
        return None

    label_color = COLOR_NEUTRAL if current else COLOR_MUTED
    label = font(shell_label(shell, translate) + u':', label_color, size)
    return u'%s %s' % (label, font(SEPARATOR.join(values), COLOR_MUTED, size))


def stats_ids(loadout, settings):
    if settings.get('shell_stats') == 'all':
        return [int_cd for int_cd in loadout.shell_order if int_cd in loadout.stats]

    current = loadout.current
    if current in loadout.stats and current in loadout.shells:
        return [current]
    return []


def stats_lines(loadout, settings, translate, size):
    lines = []
    for int_cd in stats_ids(loadout, settings):
        is_current = int_cd == loadout.current
        line = stats_text(loadout.shells[int_cd], loadout.stats[int_cd], translate, size, is_current)
        if line:
            lines.append(line)
    return lines


def items_line(loadout, translate, size):
    texts = [item_text(loadout.items[int_cd], translate, size) for int_cd in loadout.item_order]
    return SEPARATOR.join(texts)


def shells_line(loadout, translate, size):
    texts = [shell_text(loadout.shells[int_cd], translate, size) for int_cd in loadout.shell_order]
    return SEPARATOR.join(texts)


def format_panel(loadout, settings, translate):
    size = settings.get('font_size')

    lines = []
    if settings.get('show_consumables') and loadout.item_order:
        lines.append(items_line(loadout, translate, size))
    if settings.get('show_shells') and loadout.shell_order:
        lines.append(shells_line(loadout, translate, size))
    if settings.get('show_shell_stats'):
        lines.extend(stats_lines(loadout, settings, translate, size))

    return u'\n'.join(lines) if lines else None
