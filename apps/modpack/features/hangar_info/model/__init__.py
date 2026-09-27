from __future__ import absolute_import, division, print_function, unicode_literals

import time

from ....core.compat import is_number, to_text
from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, font, format_moment
from ....core.templates import render
from .constants import PING_BAD_COLOR, PING_GOOD_COLOR, PING_LOW_MS, PING_NORM_COLOR, PING_NORM_MS


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


def macro_values(info, settings, translate, now):
    moment = time.localtime(now)
    ping = valid_ping(info.get('ping'))
    return {
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
    return '\n'.join(lines)


def layout_of(settings):
    return {'x': settings.get('x'), 'y': settings.get('y'), 'alignX': settings.get('align_x'), 'alignY': settings.get('align_y')}
