# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import math

from ....core.compat import is_number
from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, COLOR_UP, font, format_number
from ....core.templates import render
from .constants import MIN_DAMAGE, MIN_SHARE_OF_ENEMY_HP

# Fair play: the own damage from the player's feedback, the enemy team's HP as the team HP panel reads it (max HP from
# the player panels' arena data, the HP the markers show). The team's damage is the HP the enemies lost, one number;
# who dealt it stays unknown, so the counter never claims the medal: the server alone knows the team's top damage.


def threshold(enemy_max):
    if not is_number(enemy_max) or enemy_max <= 0:
        return MIN_DAMAGE
    return max(MIN_DAMAGE, int(math.ceil(MIN_SHARE_OF_ENEMY_HP * enemy_max)))


def values(own_damage, enemies_max, enemies_hp):
    own = int(own_damage or 0)
    need = threshold(enemies_max)
    team = max(own, int(enemies_max or 0) - int(enemies_hp or 0))
    return {
        'damage': own,
        'need': need,
        'left': max(0, need - own),
        'team': team,
        'share': int(round(100.0 * own / team)) if team > 0 else 0,
        'reached': own >= need,
    }


def format_panel(state, settings, translate):
    size = settings.get('font_size')
    if settings.get('template'):
        return font(render(settings.get('template'), state), COLOR_NEUTRAL, size)
    shown = dict(state, damage=format_number(state['damage']), need=format_number(state['need']), left=format_number(state['left']),
                 team=format_number(state['team']))
    if state['reached']:
        head = font(translate('main_gun_reached', **shown), COLOR_UP, size)
    else:
        head = u'%s %s' % (font(translate('main_gun_progress', **shown), COLOR_NEUTRAL, size), font(translate('main_gun_left', **shown), COLOR_MUTED, size))
    lines = [head]
    if settings.get('show_team'):
        lines.append(font(translate('main_gun_team', **shown), COLOR_MUTED, max(8, size - 2)))
    return u'\n'.join(lines)
