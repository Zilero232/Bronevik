from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud.icons import class_icon, glyph
from ....core.hud.widget import widget
from . import rules_of
from .constants import KIND


def member(row):
    return {'name': row['name'], 'own': row['own'], 'points': row['points'], 'damage': row['damage'], 'assist': row['assist'],
            'frags': row['frags'], 'hp': row['hp'], 'max': row['max'], 'alive': row['alive'], 'cls': class_icon(row['class'], 'green')}


def points_widget(platoon, settings):
    rows = platoon.rows(rules_of(settings), settings.get('show_platoon'))
    return widget(KIND, {'rows': [member(row) for row in rows], 'total': sum(row['points'] for row in rows), 'rules': rules_of(settings),
                         'icon': glyph('points')})
