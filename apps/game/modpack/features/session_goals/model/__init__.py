# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_int, string_types, to_text
from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, COLOR_UP, font, format_number, format_percent
from ....core.me import count, number, owned
from .constants import (ACHIEVED, ACTION_REFRESH, ACTION_SITE, ACTIVE, DONE_MARK, MAX_GOALS, MAX_REMEMBERED, METRICS, PERCENT_METRICS,
                        SHOWN_STATUSES, SITE_PATH, TITLE_SIZE_STEP)

# Fair play: the player's own goals and own progress; in battle only the own damage of this battle is added.


def parse_goal(item):
    if not isinstance(item, dict) or not isinstance(item.get('id'), string_types):
        return None
    metric, status = item.get('metric'), item.get('status')
    target = number(item.get('target'))
    if metric not in METRICS or status not in SHOWN_STATUSES or target is None:
        return None
    tank_id = item.get('tank_id')
    return {
        'id': to_text(item['id']),
        'metric': metric,
        'tank_id': int(tank_id) if is_int(tank_id) and tank_id > 0 else None,
        'target': target,
        'baseline': number(item.get('baseline')) or 0.0,
        'current': number(item.get('current')),
        'battles': count(item.get('battles')) or 0,
        'status': status,
    }


def parse_goals(data, account_id):
    if not owned(data, account_id) or not isinstance(data.get('goals'), list):
        return []
    goals = [parse_goal(item) for item in data['goals'][:MAX_GOALS]]
    return [goal for goal in goals if goal is not None]


def is_done(goal):
    current = goal.get('current')
    return goal['status'] == ACHIEVED or (goal['status'] == ACTIVE and current is not None and current >= goal['target'])


def progress(goal):
    current = goal.get('current')
    if current is None:
        return None
    if is_done(goal):
        return 1.0
    span = goal['target'] - goal['baseline']
    if span <= 0:
        return 0.0
    return max(0.0, min(1.0, (current - goal['baseline']) / span))


def damage_needed(goal, live_damage=0):
    if goal['metric'] != 'avgDamage' or goal.get('current') is None:
        return None
    battles = goal.get('battles') or 0
    need = goal['target'] * (battles + 1) - goal['current'] * battles
    return max(0, int(round(need - live_damage)))


class Announced(object):
    """The goals whose completion was already announced (so the sound plays once). Goals already done when the
    account is first read are remembered silently."""

    def __init__(self, data=None):
        self.ids = [to_text(item) for item in (data or []) if isinstance(item, string_types)] if isinstance(data, list) else []
        self.primed = bool(self.ids)

    def newly_done(self, goals):
        fresh = [goal for goal in goals if is_done(goal) and goal['id'] not in self.ids]
        self.ids.extend(goal['id'] for goal in fresh)
        del self.ids[:-MAX_REMEMBERED]
        primed, self.primed = self.primed, True
        return fresh if primed else []

    def to_list(self):
        return list(self.ids)


def value_text(metric, value):
    if value is None:
        return u'-'
    return format_percent(value) if metric in PERCENT_METRICS else format_number(value)


def goal_label(goal, translate, vehicle_name=None):
    label = translate('goal_metric_' + goal['metric'], target=value_text(goal['metric'], goal['target']))
    return translate('goal_on_tank', goal=label, vehicle=vehicle_name) if goal.get('tank_id') and vehicle_name else label


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
    lines.extend(hangar_line(goal, translate, vehicle_names.get(goal.get('tank_id')), size) for goal in shown)
    return u'\n'.join(lines)


def battle_line(goal, translate, live_damage, size):
    label = goal_label(goal, translate)
    need = damage_needed(goal, live_damage)
    if need is not None:
        text = translate('goals_battle_done', goal=label) if need == 0 else translate('goals_battle_damage', goal=label, need=format_number(need))
        return font(text, COLOR_UP if need == 0 else COLOR_NEUTRAL, size)
    if goal['metric'] == 'battles' and goal.get('current') is not None:
        return font(translate('goals_battle_count', goal=label, number=format_number(goal['current'] + 1)), COLOR_NEUTRAL, size)
    return font(translate('goals_battle_now', goal=label, current=value_text(goal['metric'], goal.get('current'))), COLOR_NEUTRAL, size)


def battle_goals(goals, tank_id):
    return [goal for goal in goals if goal['status'] == ACTIVE and not is_done(goal) and goal.get('tank_id') in (None, tank_id)]


def format_battle(goals, tank_id, live_damage, settings, translate):
    shown = battle_goals(goals, tank_id)[:settings.get('max_goals')]
    if not shown:
        return None
    return u'\n'.join(battle_line(goal, translate, live_damage, settings.get('font_size')) for goal in shown)


def format_done(goal, translate, vehicle_name=None):
    return translate('goals_done_notice', goal=goal_label(goal, translate, vehicle_name))


def page_actions(translate):
    return [
        {'id': ACTION_REFRESH, 'label': translate('goals_refresh'), 'confirm': None},
        {'id': ACTION_SITE, 'label': translate('goals_site'), 'link': SITE_PATH, 'confirm': None},
    ]
