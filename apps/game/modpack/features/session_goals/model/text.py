# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, COLOR_UP, font, format_number, format_percent
from .constants import ACTION_REFRESH, ACTION_SITE, DONE_MARK, PERCENT_METRICS, SITE_PATH, TITLE_SIZE_STEP
from .goals import battle_goals, damage_needed, is_done, progress


def value_text(metric, value):
    if value is None:
        return u'-'
    if metric in PERCENT_METRICS:
        return format_percent(value)
    return format_number(value)


def goal_label(goal, translate, vehicle_name=None):
    target = value_text(goal['metric'], goal['target'])
    label = translate('goal_metric_' + goal['metric'], target=target)
    if not goal.get('tank_id') or not vehicle_name:
        return label
    return translate('goal_on_tank', goal=label, vehicle=vehicle_name)


def hangar_line(goal, translate, vehicle_name, size):
    label = font(goal_label(goal, translate, vehicle_name), COLOR_MUTED, size)
    if is_done(goal):
        return u'%s %s' % (label, font(DONE_MARK, COLOR_UP, size))

    share = progress(goal)
    state = value_text(goal['metric'], goal.get('current'))
    if share is not None:
        state = u'%s (%d%%)' % (state, int(round(share * 100)))
    return u'%s %s' % (label, font(state, COLOR_NEUTRAL, size))


def format_hangar(goals, settings, translate, vehicle_names):
    shown = goals[:settings.get('max_goals')]
    if not shown:
        return None

    size = settings.get('font_size')
    lines = [font(translate('goals_title'), COLOR_NEUTRAL, size + TITLE_SIZE_STEP)]
    for goal in shown:
        vehicle_name = vehicle_names.get(goal.get('tank_id'))
        lines.append(hangar_line(goal, translate, vehicle_name, size))
    return u'\n'.join(lines)


def battle_line(goal, translate, live_damage, size):
    label = goal_label(goal, translate)
    need = damage_needed(goal, live_damage)
    if need == 0:
        return font(translate('goals_battle_done', goal=label), COLOR_UP, size)
    if need is not None:
        return font(translate('goals_battle_damage', goal=label, need=format_number(need)), COLOR_NEUTRAL, size)

    current = goal.get('current')
    if goal['metric'] == 'battles' and current is not None:
        text = translate('goals_battle_count', goal=label, number=format_number(current + 1))
    else:
        text = translate('goals_battle_now', goal=label, current=value_text(goal['metric'], current))
    return font(text, COLOR_NEUTRAL, size)


def format_battle(goals, tank_id, live_damage, settings, translate):
    shown = battle_goals(goals, tank_id)[:settings.get('max_goals')]
    if not shown:
        return None
    size = settings.get('font_size')
    return u'\n'.join(battle_line(goal, translate, live_damage, size) for goal in shown)


def format_done(goal, translate, vehicle_name=None):
    return translate('goals_done_notice', goal=goal_label(goal, translate, vehicle_name))


def page_actions(translate):
    return [
        {'id': ACTION_REFRESH, 'label': translate('goals_refresh'), 'confirm': None},
        {'id': ACTION_SITE, 'label': translate('goals_site'), 'link': SITE_PATH, 'confirm': None},
    ]
