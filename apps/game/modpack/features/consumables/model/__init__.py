# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import math

from ....core.compat import is_int, is_number, to_text
from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, COLOR_UP, font, format_number
from ....core.shells import SHELL_CODES
from .constants import READY_MARK, SEPARATOR

# Fair play: the own vehicle's consumables and shells, exactly what the client's own consumables panel shows. The
# reload of enemies is on Lesta's forbidden list and is never read.


class Loadout(object):
    """The own consumables ({name, quantity, ready, remaining}) and shells ({code, quantity}) in their slot order."""

    def __init__(self):
        self.items = {}
        self.item_order = []
        self.shells = {}
        self.shell_order = []

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


def format_panel(loadout, settings, translate):
    size = settings.get('font_size')
    lines = []
    if settings.get('show_consumables') and loadout.item_order:
        lines.append(SEPARATOR.join(item_text(loadout.items[int_cd], translate, size) for int_cd in loadout.item_order))
    if settings.get('show_shells') and loadout.shell_order:
        lines.append(SEPARATOR.join(shell_text(loadout.shells[int_cd], translate, size) for int_cd in loadout.shell_order))
    return u'\n'.join(lines) if lines else None
