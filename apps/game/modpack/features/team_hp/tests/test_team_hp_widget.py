# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.team_hp.model.preview import preview_teams, preview_widget
from otmetki.features.team_hp.model.widget import team_hp_widget
from otmetki.features.team_hp.settings import SCHEMA


class TeamHpWidgetTest(unittest.TestCase):

    def test_bar_pair_carries_both_sides_and_the_score(self):
        payload = team_hp_widget(preview_teams(), Settings({}, SCHEMA))
        data = payload['data']
        assert payload['kind'] == 'team_hp' and payload['v'] == 1
        assert data['allies'] == {'hp': 3200, 'max': 5300, 'alive': 2, 'count': 3, 'frags': 2}
        assert data['enemies']['hp'] == 900 and data['enemies']['frags'] == 1
        assert data['vehicles'] == {'allies': [], 'enemies': []}
        assert data['diff'] == 2300 and data['show_score'] is True

    def test_icon_strip_tints_classes_by_side(self):
        data = team_hp_widget(preview_teams(), Settings({'style': 'icons', 'show_diff': False}, SCHEMA))['data']
        assert data['diff'] is None
        allies, enemies = data['vehicles']['allies'], data['vehicles']['enemies']
        assert allies[0]['icon'].startswith('img://gui/maps/icons/vehicleTypes/green/mediumTank.png')
        assert enemies[0]['icon'] == 'img://gui/maps/icons/vehicleTypes/red/at-spg.png|otmetki:class_td'
        assert enemies[2]['icon'].startswith('img://gui/maps/icons/vehicleTypes/red/spg.png')
        assert [vehicle['alive'] for vehicle in enemies] == [True, False, False]

    def test_every_style_is_known_to_the_schema(self):
        for style in ('full', 'segments', 'icons', 'compact', 'minimal', 'numbers', 'bars'):
            assert Settings({'style': style}, SCHEMA).get('style') == style

    def test_fixture_for_the_page(self):
        payload = preview_widget(Settings({'style': 'icons'}, SCHEMA), None)
        assert _support.widget_fixture('team_hp', payload)


if __name__ == '__main__':
    unittest.main()
