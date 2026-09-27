from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import as_int, is_int
from ....core.format import COLOR_DOWN, COLOR_UP, font, format_number
from ....core.templates import render
from .constants import RANDOM_BONUS_TYPE, RESULT_COLORS
from .page import build_page, compact, page_actions, session_of  # noqa: F401


def moe_percent(damage_rating):
    return round(damage_rating / 100, 2) if is_int(damage_rating) else None


def build_summary(event, moe_before=None, map_label=None):
    stats = event.get('stats') or {}
    vehicle = event.get('vehicle') or {}
    moe = event.get('moe') or {}
    radio = as_int(stats.get('damage_assisted_radio'))
    track = as_int(stats.get('damage_assisted_track'))
    stun = as_int(stats.get('damage_assisted_stun'))
    summary = {
        'result': event.get('result'),
        'bonus_type': event.get('bonus_type'),
        'vehicle': vehicle.get('name') or '',
        'tier': vehicle.get('tier'),
        'map': map_label or event.get('map_name') or '',
        'xp': as_int(stats.get('xp')),
        'credits': as_int(stats.get('credits')),
        'damage': as_int(stats.get('damage_dealt')),
        'assist': radio + track + stun,
        'assist_radio': radio,
        'assist_track': track,
        'assist_stun': stun,
        'blocked': as_int(stats.get('damage_blocked')),
        'frags': as_int(stats.get('frags')),
        'spotted': as_int(stats.get('spotted')),
        'marks_on_gun': moe.get('marks_on_gun'),
        'moe_percent': moe_percent(moe.get('damage_rating')),
        'moe_delta': None,
        'moving_avg': moe.get('moving_avg_damage'),
        'moving_avg_delta': None,
        'marks_delta': None,
        'arena': event.get('arena_unique_id'),
        'time': event.get('occurred_at'),
        'duration': as_int(event.get('duration_s')),
        'free_xp': as_int(stats.get('free_xp')),
        'repair': as_int(stats.get('repair_cost')),
        'ammo': as_int(stats.get('ammo_cost')),
        'consumables': as_int(stats.get('consumables_cost')),
        'shots': as_int(stats.get('shots')),
        'hits': as_int(stats.get('direct_enemy_hits')),
        'pens': as_int(stats.get('piercing_enemy_hits')),
        'life_time': as_int(stats.get('life_time_s')),
        'alive': bool(stats.get('is_alive')),
    }
    summary['net_credits'] = summary['credits'] - summary['repair'] - summary['ammo'] - summary['consumables']
    before = moe_before or {}
    if summary['moe_percent'] is not None and is_int(before.get('damage_rating')) and before.get('damage_rating') > 0:
        summary['moe_delta'] = round(summary['moe_percent'] - moe_percent(before['damage_rating']), 2)
    if is_int(summary['moving_avg']) and is_int(before.get('moving_avg_damage')):
        summary['moving_avg_delta'] = summary['moving_avg'] - before['moving_avg_damage']
    if is_int(summary['marks_on_gun']) and is_int(before.get('marks_on_gun')):
        summary['marks_delta'] = summary['marks_on_gun'] - before['marks_on_gun']
    return summary


def counts(summary, bonus_types):
    return bonus_types == 'all' or summary.get('bonus_type') == RANDOM_BONUS_TYPE


def signed(value, percent=False):
    if value is None:
        return ''
    text = ('%.2f%%' % value) if percent else format_number(value)
    return ('+' + text) if value > 0 else text


def colored(text, color, enabled):
    return font(text, color) if enabled and color else text


def delta(value, colors, percent=False):
    color = COLOR_UP if value is not None and value > 0 else (COLOR_DOWN if value is not None and value < 0 else None)
    return colored(signed(value, percent), color, colors)


def macro_values(summary, translate):
    values = dict(summary)
    values.update({
        'result': translate('br_result_' + (summary.get('result') or 'draw')),
        'moe_percent': '%.2f%%' % summary['moe_percent'] if summary.get('moe_percent') is not None else '',
        'moe_delta': signed(summary.get('moe_delta'), True),
        'moving_avg_delta': signed(summary.get('moving_avg_delta')),
        'marks_delta': signed(summary.get('marks_delta')),
    })
    return values


def format_summary(summary, settings, translate):
    colors = settings.get('colored')
    if settings.get('template'):
        return render(settings.get('template'), macro_values(summary, translate))
    head = translate('br_head', result=translate('br_result_' + (summary.get('result') or 'draw')), vehicle=summary['vehicle'],
                     map=summary['map'])
    lines = [colored(head, RESULT_COLORS.get(summary.get('result')), colors)]
    if settings.get('show_economy'):
        lines.append(translate('br_economy', xp=format_number(summary['xp']), credits=format_number(summary['credits'])))
    if settings.get('show_combat'):
        lines.append(translate('br_combat', damage=format_number(summary['damage']), assist=format_number(summary['assist']),
                               blocked=format_number(summary['blocked']), frags=summary['frags'], spotted=summary['spotted']))
    if settings.get('show_marks') and summary.get('moe_percent') is not None:
        line = translate('br_marks', percent='%.2f%%' % summary['moe_percent'], marks=summary.get('marks_on_gun') or 0)
        if summary.get('moe_delta') is not None:
            line += ' (%s)' % delta(summary['moe_delta'], colors, True)
        if summary.get('moving_avg_delta') is not None:
            line += ', ' + translate('br_moving_avg', delta=delta(summary['moving_avg_delta'], colors))
        lines.append(line)
    return '\n'.join(lines)
