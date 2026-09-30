from __future__ import absolute_import, division, print_function, unicode_literals

import time

from ....core.compat import is_int, is_number, to_text
from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, COLOR_UP, font, format_moment, format_number
from ....core.templates import render
from .constants import CLOCK_SIZE_STEP, DETAIL_SEPARATOR
from .ping import ping_color, valid_ping
from .site import armor_actions, tank_slug  # noqa: F401
from .widget import info_widget


def _is_tier_range(tiers):
    if not isinstance(tiers, (list, tuple)) or len(tiers) != 2:
        return False
    return all(is_int(tier) for tier in tiers)


def tiers_text(tiers, translate):
    if not _is_tier_range(tiers):
        return u''
    low, high = tiers
    if low == high:
        return translate('hangar_info_tier', tier=low)
    return translate('hangar_info_tiers', low=low, high=high)


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


def _detail_color(part, values):
    if part == values['training'] and values['accelerated']:
        return COLOR_UP
    return COLOR_MUTED


def vehicle_line(values, settings):
    details = [part for part in (values['tiers'], values['crew'], values['training']) if part]
    if not details:
        return None

    size = settings.get('font_size')
    parts = [font(part, _detail_color(part, values), size) for part in details]
    head = u''
    if values['vehicle']:
        head = font(values['vehicle'], COLOR_NEUTRAL, size) + u': '
    return head + DETAIL_SEPARATOR.join(parts)


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


def _clock_line(values, size):
    head = values['time']
    if values['date']:
        head = '%s  %s' % (values['time'], values['date'])
    return font(head, COLOR_NEUTRAL, size + CLOCK_SIZE_STEP)


def _server_line(info, values, settings, translate):
    size = settings.get('font_size')
    details = []
    if settings.get('show_server') and values['server']:
        details.append(font(values['server'], COLOR_NEUTRAL, size))
    if settings.get('show_ping') and values['ping']:
        details.append(font(values['ping'], ping_color(valid_ping(info.get('ping'))), size))
    if settings.get('show_online') and values['online']:
        details.append(font(translate('hangar_info_online', online=values['online']), COLOR_MUTED, size))
    return DETAIL_SEPARATOR.join(details)


def format_info(info, settings, translate, now):
    values = macro_values(info, settings, translate, now)
    if settings.get('template'):
        return render(settings.get('template'), values)

    lines = [
        _clock_line(values, settings.get('font_size')),
        _server_line(info, values, settings, translate),
        vehicle_line(values, settings),
    ]
    return '\n'.join(line for line in lines if line)


def layout_of(settings):
    return {
        'x': settings.get('x'),
        'y': settings.get('y'),
        'alignX': settings.get('align_x'),
        'alignY': settings.get('align_y'),
        'scale': round(settings.get('scale') / 100, 2),
    }


# None with a custom template: the player's own text is drawn as is.
def format_widget(info, settings, translate, now):
    if settings.get('template'):
        return None
    values = macro_values(info, settings, translate, now)
    return info_widget(info, values, settings, translate, valid_ping(info.get('ping')))
