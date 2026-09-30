# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.team_hp.model import TeamHp
from otmetki.features.team_hp.model.preview import preview_teams, preview_widget
from otmetki.features.team_hp.model.strip import strip_rows
from otmetki.features.team_hp.model.widget import team_hp_widget
from otmetki.features.team_hp.settings import SCHEMA

ALL_ON = {'icons': True, 'tiers': True}
NO_TIERS = {'icons': True, 'tiers': False}
NO_ICONS = {'icons': False, 'tiers': False}


def strip_data(options, style='icons'):
    return team_hp_widget(preview_teams(), Settings({'style': style}, SCHEMA), options)['data']


def one_tier_battle():
    teams = TeamHp(own_team=1)
    teams.add(1, 1, 1000, level=8)
    teams.add(2, 1, 1000, level=8)
    teams.add(3, 2, 1000, level=8)
    return teams


class TeamHpWidgetTest(unittest.TestCase):

    def test_bar_pair_carries_both_sides_and_the_score(self):
        payload = team_hp_widget(preview_teams(), Settings({}, SCHEMA), ALL_ON)

        data = payload['data']
        assert payload['kind'] == 'team_hp'
        assert payload['v'] == 1
        assert data['allies'] == {'hp': 3200, 'max': 5300, 'alive': 2, 'count': 3, 'frags': 2}
        assert data['enemies']['hp'] == 900
        assert data['enemies']['frags'] == 1
        assert data['vehicles'] == {'allies': [], 'enemies': []}
        assert data['diff'] == 2300
        assert data['show_score'] is True

    def test_carries_the_alive_score_toggle(self):
        payload = team_hp_widget(preview_teams(), Settings({'show_alive': True}, SCHEMA), ALL_ON)

        assert payload['data']['score_alive'] is True

    def test_side_hp_is_the_stock_team_health_once_fed(self):
        teams = preview_teams()
        teams.set_team_health(3000, 800, 5300, 5200)

        data = team_hp_widget(teams, Settings({}, SCHEMA), ALL_ON)['data']

        assert data['allies']['hp'] == 3000
        assert data['enemies'] == {'hp': 800, 'max': 5200, 'alive': 1, 'count': 3, 'frags': 1}

    def test_icon_strip_tints_classes_by_side(self):
        data = strip_data(NO_TIERS)

        allies, enemies = data['vehicles']['allies'], data['vehicles']['enemies']
        assert allies[0]['icon'].startswith('img://gui/maps/icons/vehicleTypes/green/mediumTank.png')
        assert enemies[0]['icon'] == 'img://gui/maps/icons/vehicleTypes/red/at-spg.png|otmetki:class_td'
        assert enemies[2]['icon'].startswith('img://gui/maps/icons/vehicleTypes/red/spg.png')
        assert [vehicle['alive'] for vehicle in enemies] == [True, False, False]

    def test_icons_follow_the_stock_vehicle_icons_option(self):
        data = strip_data(NO_ICONS)

        assert [vehicle['icon'] for vehicle in data['vehicles']['allies']] == [None, None, None]

    def test_tier_grouping_orders_the_strip_by_tier_from_the_centre(self):
        data = strip_data(ALL_ON)

        assert [vehicle['max'] for vehicle in data['vehicles']['allies']] == [2000, 1800, 1500]

    def test_tier_grouping_labels_each_group_start(self):
        data = strip_data(ALL_ON)

        assert [vehicle['tier'] for vehicle in data['vehicles']['enemies']] == ['X', 'IX', 'VIII']

    def test_segments_carry_the_tier_groups_too(self):
        data = strip_data(ALL_ON, style='segments')

        assert [vehicle['tier'] for vehicle in data['vehicles']['allies']] == ['X', 'IX', 'VIII']

    def test_without_tier_grouping_the_arena_order_stays_unlabelled(self):
        data = strip_data(NO_TIERS)

        assert [vehicle['max'] for vehicle in data['vehicles']['allies']] == [1800, 1500, 2000]
        assert [vehicle['tier'] for vehicle in data['vehicles']['allies']] == [None, None, None]

    def test_one_tier_battle_shows_no_tier_labels(self):
        rows = strip_rows(one_tier_battle(), True, ALL_ON)

        assert [tier for _, tier in rows] == [None, None]

    def test_every_style_is_known_to_the_schema(self):
        for style in ('full', 'segments', 'icons', 'compact', 'minimal', 'numbers', 'bars'):
            assert Settings({'style': style}, SCHEMA).get('style') == style

    def test_fixture_for_the_page(self):
        payload = preview_widget(Settings({'style': 'icons'}, SCHEMA), None)

        assert _support.widget_fixture('team_hp', payload)


if __name__ == '__main__':
    unittest.main()
