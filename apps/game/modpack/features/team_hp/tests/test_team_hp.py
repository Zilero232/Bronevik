# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.team_hp.i18n import STRINGS
from otmetki.features.team_hp.model import TeamHp, bar, format_panel, format_team_hp, icon_row, score_pair
from otmetki.features.team_hp.model.preview import preview_text
from otmetki.features.team_hp.model.strip import strip_options
from otmetki.features.team_hp.settings import SCHEMA

ALL_ON = {'icons': True, 'tiers': True}
NO_TIERS = {'icons': True, 'tiers': False}


def translator(language='ru'):
    return _support.translator(STRINGS, language)


def battle():
    teams = TeamHp(own_team=1)
    teams.add(1, 1, 1000)
    teams.add(2, 1, 1500)
    teams.add(3, 2, 1200)
    teams.add(4, 2, 800, alive=False)
    return teams


class TeamHpTest(unittest.TestCase):

    def test_totals(self):
        values = battle().values()

        assert (values['allies_hp'], values['allies_max'], values['allies_alive']) == (2500, 2500, 2)
        assert (values['enemies_hp'], values['enemies_max'], values['enemies_alive']) == (1200, 2000, 1)
        assert (values['allies_frags'], values['enemies_frags']) == (1, 0)
        assert values['diff'] == 1300

    def test_health_updates_are_clamped_and_report_a_change(self):
        teams = battle()

        assert teams.set_health(3, 400)
        assert not teams.set_health(3, 400)
        assert teams.set_health(1, -50)
        assert teams.vehicles[1]['hp'] == 0
        assert not teams.set_health(2, 99999)
        assert not teams.set_health(99, 10)

    def test_a_kill_counts_once(self):
        teams = battle()

        assert teams.kill(2)
        assert not teams.kill(2)
        assert teams.values()['enemies_frags'] == 1

    def test_readd_keeps_known_hp(self):
        teams = battle()
        teams.set_health(3, 700)

        teams.add(3, 2, 1200)

        assert teams.vehicles[3]['hp'] == 700

    def test_rejects_vehicles_without_max_hp_or_id(self):
        teams = battle()

        assert not teams.add(5, 2, 0)
        assert not teams.add('x', 2, 100)

    def test_bar(self):
        assert bar(50, 100, 10, '#FFFFFF').count('|') == 10
        assert '>|||||</font>' in bar(50, 100, 10, '#FFFFFF')
        assert '>||||||||||</font>' in bar(5, 0, 10, '#FFFFFF')


class StockTeamHealthTest(unittest.TestCase):

    def test_the_stock_totals_win_over_the_arena_sums(self):
        teams = battle()

        teams.set_team_health(2300, 900, 2500, 1200)

        values = teams.values()
        assert (values['allies_hp'], values['allies_max']) == (2300, 2500)
        assert (values['enemies_hp'], values['enemies_max']) == (900, 1200)
        assert values['diff'] == 1400

    def test_the_arena_keeps_the_alive_counts_and_frags(self):
        teams = battle()

        teams.set_team_health(2300, 900, 2500, 1200)

        values = teams.values()
        assert values['enemies_alive'] == 1
        assert values['allies_frags'] == 1

    def test_the_arena_sums_stay_for_the_full_team_max(self):
        teams = battle()

        teams.set_team_health(2300, 900, 2500, 1200)

        assert teams.totals(False)['max'] == 2000

    def test_repeated_totals_are_no_change(self):
        teams = battle()
        teams.set_team_health(2300, 900, 2500, 1200)

        assert not teams.set_team_health(2300, 900, 2500, 1200)

    def test_ignores_totals_that_are_not_numbers(self):
        teams = battle()

        assert not teams.set_team_health(None, 900, 2500, 1200)
        assert teams.health(True) == {'hp': 2500, 'max': 2500}


class ScoreTest(unittest.TestCase):

    def test_shows_frags_by_default(self):
        pair = score_pair(battle().values(), Settings({}, SCHEMA))

        assert pair == (1, 0)

    def test_shows_the_alive_vehicles_with_the_alive_toggle(self):
        pair = score_pair(battle().values(), Settings({'show_alive': True}, SCHEMA))

        assert pair == (2, 1)

    def test_alive_toggle_is_off_by_default(self):
        assert Settings({}, SCHEMA).get('show_alive') is False

    def test_bar_pair_line_carries_the_alive_score(self):
        settings = Settings({'show_alive': True}, SCHEMA)

        text = format_team_hp(battle().values(), settings, translator())

        assert '2 : 1' in text


class FormatTest(unittest.TestCase):

    def test_full(self):
        text = format_team_hp(battle().values(), Settings({}, SCHEMA), translator())

        assert '2 500' in text
        assert '1 200' in text
        assert '1 : 0' in text
        assert u'разница +1 300' in text

    def test_compact_has_no_bars_and_no_difference(self):
        settings = Settings({'style': 'compact', 'show_score': False}, SCHEMA)

        text = format_team_hp(battle().values(), settings, translator('en'))

        assert '|' not in text.replace('||', '')
        assert 'difference' not in text

    def test_bars_have_no_numbers(self):
        settings = Settings({'style': 'bars', 'show_diff': False}, SCHEMA)

        text = format_team_hp(battle().values(), settings, translator('en'))

        assert '2 500' not in text

    def test_custom_template(self):
        settings = Settings({'template': '{allies_hp}/{enemies_hp} ({diff})'}, SCHEMA)

        text = format_team_hp(battle().values(), settings, translator('en'))

        assert '2 500/1 200 (1 300)' in text

    def test_icon_row_style(self):
        teams = battle()
        teams.set_health(3, 600)

        text = format_panel(teams, Settings({'style': 'icons', 'icon_width': 4}, SCHEMA), translator(), ALL_ON)

        allies, score, enemies = text.split('   ')
        assert allies.count('|') == 8
        assert enemies.count('|') == 8
        assert '1 : 0' in score
        assert u'разница' not in text

    def test_icon_row_of_no_vehicles_is_empty(self):
        assert icon_row([], 3, '#FFFFFF') == ''

    def test_template_wins_over_the_icon_row(self):
        settings = Settings({'style': 'icons', 'template': '{allies_hp}'}, SCHEMA)

        text = format_panel(battle(), settings, translator(), ALL_ON)

        assert '2 500' in text

    def test_classes_and_order_from_the_arena(self):
        teams = TeamHp(own_team=1)
        teams.add(9, 2, 1000, kind='heavyTank')
        teams.add(4, 2, 800, kind=5)

        assert [vehicle['kind'] for vehicle in teams.team(False)] == ['heavyTank', None]
        assert teams.is_ally(9) is False
        assert teams.is_ally(77) is False

    def test_colors(self):
        settings = Settings({'ally_color': '#00ff00', 'enemy_color': 'blue'}, SCHEMA)

        assert settings.get('ally_color') == '#00FF00'
        assert settings.get('enemy_color') == '#E3564A'

    def test_strings_in_sync(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])

    def test_preview(self):
        text = preview_text(Settings({}, SCHEMA), translator('en'))

        assert '3 200' in text
        assert '900' in text
        assert '2 : 1' in text


class StripOptionsTest(unittest.TestCase):

    def test_both_on_without_an_answer_from_the_settings_core(self):
        assert strip_options(None) == ALL_ON

    def test_tier_grouping_follows_its_option(self):
        options = strip_options({'showVehiclesCounter': True, 'enableTierGrouping': False})

        assert options == NO_TIERS

    def test_tier_grouping_needs_the_vehicle_icons(self):
        options = strip_options({'showVehiclesCounter': False, 'enableTierGrouping': True})

        assert options == {'icons': False, 'tiers': False}


if __name__ == '__main__':
    unittest.main()
