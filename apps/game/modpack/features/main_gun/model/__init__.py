# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import math

from ....core.compat import is_number
from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, font, format_number
from ....core.templates import render
from .constants import FAILED, MIN_DAMAGE, MIN_SHARE_OF_ENEMY_HP, PROGRESS, REACHED, STATE_LOOKS, UNREACHABLE

# Fair play: the own damage from the player's feedback, the enemy team's HP as the stock score strip shows it (max HP
# from the player panels' arena data, the HP left the client's BattleFieldCtrl counts), and whether an own shot hit an
# ally from the client's own «Попадание в союзника» message, never who. The team's damage is the HP the enemies lost,
# one number; who dealt it stays unknown, so the counter never claims the medal: the server alone knows the team's top
# damage.


def threshold(enemy_max):
    if not is_number(enemy_max) or enemy_max <= 0:
        return MIN_DAMAGE
    return max(MIN_DAMAGE, int(math.ceil(MIN_SHARE_OF_ENEMY_HP * enemy_max)))


# Out of reach only on proof: the enemies' known HP is never below what they really have (an unseen enemy keeps its
# last known HP), so less of it than the damage still needed cannot be made up.
def medal_status(damage, need, remaining, hit_ally):
    if hit_ally:
        return FAILED
    if damage >= need:
        return REACHED
    if remaining < need - damage:
        return UNREACHABLE
    return PROGRESS


def values(own_damage, enemies_max, enemies_hp, hit_ally=False):
    damage = int(own_damage or 0)
    need = threshold(enemies_max)
    remaining = max(0, int(enemies_hp or 0))
    team = max(damage, int(enemies_max or 0) - remaining)

    return {
        'damage': damage,
        'need': need,
        'left': max(0, need - damage),
        'remaining': remaining,
        'team': team,
        'share': int(round(100.0 * damage / team)) if team > 0 else 0,
        'status': medal_status(damage, need, remaining, hit_ally),
    }


def shown_numbers(state):
    shown = dict(state)
    for key in ('damage', 'need', 'left', 'remaining', 'team'):
        shown[key] = format_number(state[key])
    return shown


def status_line(state, translate, size):
    look = STATE_LOOKS[state['status']]
    shown = shown_numbers(state)

    line = font(translate(look['line'], **shown), look['color'], size)
    if look['tail'] is None:
        return line
    return u'%s %s' % (line, font(translate(look['tail'], **shown), COLOR_MUTED, size))


def format_panel(state, settings, translate):
    size = settings.get('font_size')
    if settings.get('template'):
        return font(render(settings.get('template'), state), COLOR_NEUTRAL, size)

    lines = [status_line(state, translate, size)]
    if settings.get('show_team'):
        team_line = translate('main_gun_team', **shown_numbers(state))
        lines.append(font(team_line, COLOR_MUTED, max(8, size - 2)))
    return u'\n'.join(lines)
