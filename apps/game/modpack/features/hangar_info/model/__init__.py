from __future__ import absolute_import, division, print_function, unicode_literals

import time

from ....core.compat import is_int, is_number, to_text
from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, COLOR_UP, font, format_moment, format_number
from ....core.templates import render
from .constants import PING_BAD_COLOR, PING_GOOD_COLOR, PING_LOW_MS, PING_NORM_COLOR, PING_NORM_MS
from .site import armor_actions, tank_slug  # noqa: F401


def valid_ping(value):
    return int(value) if is_number(value) and value >= 0 else None


def ping_color(ping):
    if ping is None:
        return COLOR_MUTED
    if ping <= PING_LOW_MS:
        return PING_GOOD_COLOR
    if ping <= PING_NORM_MS:
        return PING_NORM_COLOR
    return PING_BAD_COLOR


def tiers_text(tiers, translate):
    if not isinstance(tiers, (list, tuple)) or len(tiers) != 2 or not all(is_int(tier) for tier in tiers):
        return u''
    low, high = tiers
    return translate('hangar_info_tier', tier=low) if low == high else translate('hangar_info_tiers', low=low, high=high)


def crew_text(info, translate):
    if not is_number(info.get('crew_xp')):
        return u''
    role = to_text(info.get('crew_role') or u'')
    key = 'hangar_info_crew_role' if role else 'hangar_info_crew'
    return translate(key, xp=format_number(info['crew_xp']), role=role)


def training_text(info, translate):
    accelerated = info.get('accelerated')
    if accelerated is None:
        return u''
    return translate('hangar_info_training_on' if accelerated else 'hangar_info_training_off')


def vehicle_line(values, settings):
    size = settings.get('font_size')
    details = [part for part in (values['tiers'], values['crew'], values['training']) if part]
    if not details:
        return None
    head = font(values['vehicle'], COLOR_NEUTRAL, size) + u': ' if values['vehicle'] else u''
    return head + u' | '.join(font(part, COLOR_UP if part == values['training'] and values['accelerated'] else COLOR_MUTED, size)
                              for part in details)


def macro_values(info, settings, translate, now):
    moment = time.localtime(now)
    ping = valid_ping(info.get('ping'))
    return {
        'vehicle': to_text(info.get('vehicle') or u''),
        'tiers': tiers_text(info.get('tiers'), translate),
        'crew': crew_text(info, translate),
        'training': training_text(info, translate),
        'accelerated': bool(info.get('accelerated')),
        'time': format_moment(settings.get('clock_format'), moment),
        'date': format_moment(settings.get('date_format'), moment),
        'server': to_text(info.get('server') or ''),
        'ping': '' if ping is None else translate('hangar_info_ms', ping=ping),
        'online': to_text(info.get('online') or ''),
        'region_online': to_text(info.get('region_online') or ''),
    }


def format_info(info, settings, translate, now):
    values = macro_values(info, settings, translate, now)
    if settings.get('template'):
        return render(settings.get('template'), values)
    size = settings.get('font_size')
    head = values['time'] if not values['date'] else '%s  %s' % (values['time'], values['date'])
    lines = [font(head, COLOR_NEUTRAL, size + 4)]
    details = []
    if settings.get('show_server') and values['server']:
        details.append(font(values['server'], COLOR_NEUTRAL, size))
    if settings.get('show_ping') and values['ping']:
        details.append(font(values['ping'], ping_color(valid_ping(info.get('ping'))), size))
    if settings.get('show_online') and values['online']:
        details.append(font(translate('hangar_info_online', online=values['online']), COLOR_MUTED, size))
    if details:
        lines.append(' | '.join(details))
    vehicle = vehicle_line(values, settings)
    if vehicle:
        lines.append(vehicle)
    return '\n'.join(lines)


def layout_of(settings):
    return {'x': settings.get('x'), 'y': settings.get('y'), 'alignX': settings.get('align_x'), 'alignY': settings.get('align_y')}
