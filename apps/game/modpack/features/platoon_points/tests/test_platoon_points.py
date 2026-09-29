# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.platoon_points.i18n import STRINGS
from otmetki.features.platoon_points.model import Platoon, points, rules_of
from otmetki.features.platoon_points.model.preview import preview_platoon, preview_text, preview_widget
from otmetki.features.platoon_points.model.widget import points_widget
from otmetki.features.platoon_points.settings import SCHEMA, SETTINGS


def translator(language='ru'):
    return _support.translator(STRINGS, language)


class PointsTest(unittest.TestCase):

    def test_rules(self):
        rules = rules_of(Settings({}, SCHEMA))
        assert rules == {'damage': 100, 'assist': 200, 'frag': 2, 'alive': 1}
        assert points(rules, 2450, 610, 2, True) == 24 + 3 + 4 + 1
        assert points(rules, None, None, 1, False) == 2

    def test_mates_score_only_what_the_stock_ui_shows(self):
        platoon = Platoon()
        platoon.add(1, u'Вы', True, 'heavyTank', 2000)
        platoon.add(2, u'Друг', False, 'lightTank', 1000)
        assert platoon.is_platoon()
        assert platoon.add_own('damage', 1000) and not platoon.add_own('frags', 1) and not platoon.add_own('damage', -1)
        assert platoon.killed(9, 2, True) and not platoon.killed(9, 5, True)
        assert platoon.set_health(2, 400) and not platoon.set_health(2, 400) and not platoon.set_health(7, 1)
        rows = platoon.rows(rules_of(Settings({}, SCHEMA)))
        assert rows[0]['own'] and rows[0]['damage'] == 1000 and rows[0]['points'] == 11
        assert rows[1]['damage'] is None and rows[1]['assist'] is None and rows[1]['frags'] == 1 and rows[1]['points'] == 3
        assert platoon.killed(2, 99, False) and platoon.members[2]['hp'] == 0
        assert [row['own'] for row in platoon.rows(rules_of(Settings({}, SCHEMA)), False)] == [True]

    def test_summary_is_a_floor(self):
        platoon = Platoon()
        platoon.add_own('damage', 300)
        assert platoon.apply_summary(900, 100) and not platoon.apply_summary(900, 100)
        assert platoon.own_totals() == (900, 100)

    def test_widget_and_preview(self):
        data = points_widget(preview_platoon(), Settings({}, SCHEMA))['data']
        assert data['total'] == sum(row['points'] for row in data['rows'])
        assert data['rows'][0]['cls'].startswith('img://gui/maps/icons/vehicleTypes/green/heavyTank.png')
        assert data['rows'][1]['damage'] is None
        assert u'Итого' in preview_text(Settings({}, SCHEMA), translator())
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en']) and SETTINGS == ('battle_platoon_points',)
        assert _support.widget_fixture('platoon_points', preview_widget(Settings({}, SCHEMA), None))


if __name__ == '__main__':
    unittest.main()
