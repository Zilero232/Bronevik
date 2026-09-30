from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud.icons import class_icon, glyph
from ....core.hud.widget import widget
from . import rules_of
from .constants import KIND, MEMBER_KEYS


def member(row):
    shown = dict((key, row[key]) for key in MEMBER_KEYS)
    shown['cls'] = class_icon(row['class'], 'green')
    return shown


def points_widget(platoon, settings):
    rules = rules_of(settings)
    rows = platoon.rows(rules, settings.get('show_platoon'))
    return widget(KIND, {
        'rows': [member(row) for row in rows],
        'total': sum(row['points'] for row in rows),
        'rules': rules,
        'icon': glyph('points'),
    })
