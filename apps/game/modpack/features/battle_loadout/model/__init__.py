# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_int, string_types, to_text
from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, COLOR_WARN, font
from .constants import BONUS_MARK, ICON_PATH, ICON_PREFIX, IMG_ROOT, MAX_ITEMS, MAX_NAME, MAX_TANKS, SEPARATOR

# Fair play: the player's own tank only, read in the hangar from the player's own vehicle (what its equipment, field
# modification and directive slots show). The client does not tell anything about other vehicles' equipment and
# nothing is inferred.


def icon_path(raw):
    """The HUD image path of a client item icon, or None."""
    if not isinstance(raw, string_types):
        return None
    raw = to_text(raw)
    if raw.startswith(ICON_PREFIX):
        raw = IMG_ROOT + raw[len(ICON_PREFIX):]
    return raw if ICON_PATH.match(raw) and '..' not in raw else None


def clean_name(value):
    return to_text(value)[:MAX_NAME] if isinstance(value, string_types) and value else None


def clean_loadout(data):
    data = data if isinstance(data, dict) else {}
    devices = []
    for item in (data.get('devices') or [])[:MAX_ITEMS]:
        name = clean_name((item or {}).get('name'))
        if name:
            devices.append({'name': name, 'icon': icon_path(item.get('icon')), 'bonus': bool(item.get('bonus'))})
    directives = []
    for item in (data.get('directives') or [])[:MAX_ITEMS]:
        name = clean_name((item or {}).get('name'))
        if name:
            directives.append({'name': name, 'icon': icon_path(item.get('icon'))})
    modifications = [name for name in (clean_name(value) for value in (data.get('modifications') or [])[:MAX_ITEMS]) if name]
    return {'devices': devices, 'modifications': modifications, 'directives': directives}


def is_empty(loadout):
    return not (loadout['devices'] or loadout['modifications'] or loadout['directives'])


class LoadoutBook(object):
    """The hangar loadout of the last few own tanks, for the battle that starts on one of them."""

    def __init__(self):
        self.tanks = {}
        self.order = []

    def put(self, tank_id, data):
        if not is_int(tank_id) or tank_id <= 0:
            return False
        loadout = clean_loadout(data)
        if tank_id in self.order:
            self.order.remove(tank_id)
        self.order.append(tank_id)
        changed = self.tanks.get(tank_id) != loadout
        self.tanks[tank_id] = loadout
        while len(self.order) > MAX_TANKS:
            self.tanks.pop(self.order.pop(0), None)
        return changed

    def get(self, tank_id):
        return self.tanks.get(tank_id)


def image(path, size):
    return u'<img src="img://%s" width="%d" height="%d"/>' % (path, size, size)


def item_text(item, settings, compact):
    size = settings.get('font_size')
    icon = image(item['icon'], settings.get('icon_size')) if settings.get('show_icons') and item.get('icon') else None
    bonus = item.get('bonus')
    color = COLOR_WARN if bonus else COLOR_NEUTRAL
    if icon and compact:
        return icon + (font(BONUS_MARK, COLOR_WARN, size) if bonus else u'')
    name = item['name'] + (u' ' + BONUS_MARK if bonus else u'')
    return (icon + u' ' if icon else u'') + font(name, color, size)


def group_line(label, items, settings, translate, compact):
    size = settings.get('font_size')
    joined = (u' ' if compact and settings.get('show_icons') else SEPARATOR).join(items)
    if compact:
        return joined
    return font(translate(label) + u': ', COLOR_MUTED, size) + joined


def format_panel(loadout, settings, translate):
    if loadout is None or is_empty(loadout):
        return None
    compact = settings.get('style') == 'compact'
    size = settings.get('font_size')
    lines = []
    if settings.get('show_devices') and loadout['devices']:
        lines.append(group_line('battle_loadout_devices', [item_text(item, settings, compact) for item in loadout['devices']], settings, translate,
                                compact))
    if settings.get('show_modifications') and loadout['modifications']:
        names = [font(name, COLOR_NEUTRAL, size) for name in loadout['modifications']]
        lines.append(group_line('battle_loadout_modifications', names, settings, translate, False) if not compact else SEPARATOR.join(names))
    if settings.get('show_directives') and loadout['directives']:
        lines.append(group_line('battle_loadout_directives', [item_text(item, settings, compact) for item in loadout['directives']], settings,
                                translate, compact))
    return u'\n'.join(lines) if lines else None
