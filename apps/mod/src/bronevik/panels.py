# -*- coding: utf-8 -*-
from .compat import is_number, to_text

COLOR_UP = '#7CD35B'
COLOR_DOWN = '#E3564A'
COLOR_NEUTRAL = '#F2EAD3'
COLOR_MUTED = '#A09A8B'


def _font(text, color, size=None):
    if size:
        return u'<font color="%s" size="%d">%s</font>' % (color, size, to_text(text))
    return u'<font color="%s">%s</font>' % (color, to_text(text))


def format_number(value):
    if not is_number(value):
        return u'-'
    return u'{:,}'.format(int(round(value))).replace(u',', u' ')


def format_percent(value):
    if not is_number(value):
        return u'-'
    return u'%.2f%%' % value


def format_moe_panel(projection, translate):
    current = projection.get('current_percent')
    projected = projection.get('projected_percent')
    lines = []
    head = u'%s %s' % (translate('moe_title'), format_percent(current))
    lines.append(_font(head, COLOR_NEUTRAL, 16))
    if projected is None:
        lines.append(_font(translate('moe_no_thresholds'), COLOR_MUTED))
    else:
        color = COLOR_UP if not is_number(current) or projected >= current else COLOR_DOWN
        lines.append(_font(u'%s: %s' % (translate('moe_projected'), format_percent(projected)), color, 14))
    level = projection.get('target_level')
    remaining = projection.get('damage_remaining')
    if level is not None and remaining is not None:
        level_text = u'%d' % int(level)
        if remaining <= 0:
            lines.append(_font(translate('moe_reached', level=level_text), COLOR_UP))
        else:
            lines.append(_font(translate('moe_need', level=level_text, damage=format_number(remaining)), COLOR_NEUTRAL))
    elif projected is not None:
        lines.append(_font(translate('moe_max'), COLOR_MUTED))
    return u'\n'.join(lines)


def format_session_panel(summary, translate):
    rows = [
        (translate('session_battles'), format_number(summary.get('battles'))),
        (translate('session_winrate'), format_percent(summary.get('win_rate'))),
        (translate('session_damage'), format_number(summary.get('avg_damage'))),
        (translate('session_wn8'), format_number(summary.get('wn8'))),
    ]
    lines = [_font(translate('session_title'), COLOR_NEUTRAL, 15)]
    for label, value in rows:
        lines.append(u'%s: %s' % (_font(label, COLOR_MUTED), _font(value, COLOR_NEUTRAL)))
    return u'\n'.join(lines)


def format_session_plain(summary, translate):
    return u'%s: %s %s, %s %s, %s %s, %s %s' % (
        translate('session_title'),
        translate('session_battles'), format_number(summary.get('battles')),
        translate('session_winrate'), format_percent(summary.get('win_rate')),
        translate('session_damage'), format_number(summary.get('avg_damage')),
        translate('session_wn8'), format_number(summary.get('wn8')),
    )
