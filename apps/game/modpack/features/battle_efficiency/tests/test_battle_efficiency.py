# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import os
import unittest

import _support
from otmetki.core.format import COLOR_DOWN, COLOR_UP
from otmetki.core.me import tank_rows
from otmetki.core.settings import Settings
from otmetki.features.battle_efficiency.i18n import STRINGS
from otmetki.features.battle_efficiency.model import BattleTotals, format_panel, panel_state, wn8
from otmetki.features.battle_efficiency.model.preview import preview_text
from otmetki.features.battle_efficiency.settings import SCHEMA, SETTINGS

ACCOUNT = 12345678
EXPECTED = {'damage': 1180.0, 'spot': 1.42, 'frag': 0.98, 'def': 0.75, 'win_rate': 52.3}


def translator(language='ru'):
    return _support.translator(STRINGS, language)


def row():
    data = _support.load_json(os.path.join(_support.CONTRACT_DIR, 'examples', 'ratings-tanks.example.json'))
    data['account_id'] = ACCOUNT
    return tank_rows(data, ACCOUNT)[1]


def totals(damage=0, spot=0, frag=0, defence=0):
    return {'damage': damage, 'spot': spot, 'frag': frag, 'def': defence}


def settings(**values):
    return Settings(values, SCHEMA)


def good_battle_state():
    return panel_state(totals(damage=1500, spot=1, frag=1), dict(row(), avg_damage=1200.0))


def weak_battle_state():
    return panel_state(totals(damage=300), row())


def zero_average_state():
    return panel_state(totals(damage=500), dict(row(), avg_damage=0.0))


def counted_totals():
    battle = BattleTotals()
    battle.add('damage', 390)
    battle.add('spot')
    return battle


class Wn8Test(unittest.TestCase):

    def test_an_expected_battle_scores_1565(self):
        assert wn8(totals(damage=1180, spot=1.42, frag=0.98, defence=0.75), EXPECTED) == 1565

    def test_an_empty_battle_scores_the_win_part_only(self):
        assert wn8(totals(), EXPECTED) == 145

    def test_the_frag_ratio_is_capped_by_the_damage_ratio(self):
        assert wn8(totals(damage=1180, frag=10), EXPECTED) == 1377

    def test_a_strong_battle(self):
        assert wn8(totals(damage=2360, spot=3, frag=2), EXPECTED) == 4233

    def test_no_expected_values_no_estimate(self):
        assert wn8(totals(damage=1000, spot=1, frag=1), None) is None

    def test_zero_expected_values_count_as_zero_ratios(self):
        expected = dict(EXPECTED, spot=0, frag=0, **{'def': 0})

        assert wn8(totals(damage=1000, spot=1, frag=1), expected) == 933


class TotalsTest(unittest.TestCase):

    def test_known_counters_are_added(self):
        assert counted_totals().values == {'damage': 390, 'spot': 1, 'frag': 0, 'def': 0}

    def test_an_unknown_counter_is_not_added(self):
        assert BattleTotals().add('xp', 1) is False

    def test_a_zero_amount_is_not_added(self):
        assert BattleTotals().add('frag', 0) is False

    def test_the_summary_raises_the_damage(self):
        battle = counted_totals()

        raised = battle.raise_to('damage', 2150)

        assert raised is True
        assert battle.values['damage'] == 2150

    def test_a_lower_summary_changes_nothing(self):
        battle = counted_totals()

        assert battle.raise_to('damage', 5) is False


class PanelStateTest(unittest.TestCase):

    def test_state_from_the_site_row(self):
        state = panel_state(totals(damage=1506, spot=1, frag=1), row())

        assert state['average'] == 1204.5
        assert state['tank_wn8'] == 2104.9
        assert state['delta'] == 25
        assert state['wn8'] == 1846

    def test_without_a_row_there_is_no_estimate(self):
        state = panel_state(totals(damage=10), None)

        assert state['wn8'] is None
        assert state['delta'] is None

    def test_a_zero_average_has_no_delta(self):
        state = zero_average_state()

        assert state['average'] is None
        assert state['delta'] is None


class FormatTest(unittest.TestCase):

    def test_a_zero_average_still_shows_the_wn8_line(self):
        assert format_panel(zero_average_state(), settings(), translator()) is not None

    def test_a_zero_average_without_the_wn8_line_shows_nothing(self):
        assert format_panel(zero_average_state(), settings(show_wn8=False), translator()) is None

    def test_a_good_battle_line(self):
        text = format_panel(good_battle_state(), settings(), translator())

        assert u'WN8 боя ≈' in text
        assert u'(на танке 2 105)' in text
        assert u'Урон 1 500 / ср. 1 200' in text
        assert '(+25%)' in text
        assert COLOR_UP in text

    def test_a_weak_battle_line_in_red(self):
        text = format_panel(weak_battle_state(), settings(show_wn8=False), translator('en'))

        assert 'WN8' not in text
        assert '(-75%)' in text
        assert COLOR_DOWN in text

    def test_the_template_gets_the_signed_delta(self):
        text = format_panel(good_battle_state(), settings(colored=False, template='{wn8}/{delta}'), translator())

        assert '/+25%' in text

    def test_nothing_to_show_without_a_row(self):
        state = panel_state(totals(damage=1), {})

        assert format_panel(state, settings(), translator()) is None


class SettingsTest(unittest.TestCase):

    def test_preview_text(self):
        assert u'WN8 боя' in preview_text(settings(), translator())

    def test_settings_switch(self):
        assert SETTINGS == ('battle_efficiency',)

    def test_strings_in_both_languages(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
