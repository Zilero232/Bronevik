# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import format_number
from ....core.hud.icons import glyph
from ....core.hud.widget import card, card_row
from . import battle_goals, damage_needed, goal_label, is_done, progress, value_text
from .constants import CARD_WIDTH


def hangar_row(goal, translate, vehicle_name):
    label = goal_label(goal, translate, vehicle_name)
    if is_done(goal):
        return card_row(label, translate('goals_done_value'), status='done', tone_name='success')
    return card_row(label, value_text(goal['metric'], goal.get('current')), status='active', progress=progress(goal), progress_tone='gold')


def hangar_widget(goals, settings, translate, vehicle_names):
    shown = goals[:settings.get('max_goals')]
    if not shown:
        return None
    rows = [hangar_row(goal, translate, vehicle_names.get(goal.get('tank_id'))) for goal in shown]
    return card(translate('goals_title'), glyph('target'), rows, rail='progress', width=CARD_WIDTH)


def battle_row(goal, translate, live_damage):
    label = goal_label(goal, translate)
    need = damage_needed(goal, live_damage)
    if need == 0:
        return card_row(label, translate('goals_done_value'), status='done', tone_name='success')
    if need is not None:
        return card_row(label, format_number(need), status='active', note=translate('goals_need_note'))
    if goal['metric'] == 'battles' and goal.get('current') is not None:
        return card_row(label, u'#%s' % format_number(goal['current'] + 1), status='active')
    return card_row(label, value_text(goal['metric'], goal.get('current')), status='active')


def battle_widget(goals, tank_id, live_damage, settings, translate):
    shown = battle_goals(goals, tank_id)[:settings.get('max_goals')]
    if not shown:
        return None
    return card(translate('goals_title'), glyph('target'), [battle_row(goal, translate, live_damage) for goal in shown], rail='progress',
                width=CARD_WIDTH)
