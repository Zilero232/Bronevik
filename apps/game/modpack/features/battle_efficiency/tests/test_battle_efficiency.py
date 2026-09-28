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


class Wn8Test(unittest.TestCase):

    def test_an_expected_battle_scores_1565(self):
        totals = {'damage': 1180, 'spot': 1.42, 'frag': 0.98, 'def': 0.75}
        assert wn8(totals, EXPECTED) == 1565

    def test_ratios_are_capped_and_floored(self):
        assert wn8({'damage': 0, 'spot': 0, 'frag': 0, 'def': 0}, EXPECTED) == 145
        big_frags = wn8({'damage': 1180, 'spot': 0, 'frag': 10, 'def': 0}, EXPECTED)
        assert big_frags == int(round(980 + 210 * 1.2 + 145))
        assert wn8({'damage': 2360, 'spot': 3, 'frag': 2, 'def': 0}, EXPECTED) > 2000
        assert wn8({'damage': 1000, 'spot': 1, 'frag': 1, 'def': 0}, None) is None
        assert wn8({'damage': 1000, 'spot': 1, 'frag': 1, 'def': 0}, dict(EXPECTED, spot=0, frag=0, **{'def': 0})) is not None

    def test_totals(self):
        totals = BattleTotals()
        assert totals.add('damage', 390) and totals.add('spot') and not totals.add('xp', 1) and not totals.add('frag', 0)
        assert totals.raise_to('damage', 2150) and not totals.raise_to('damage', 5)
        assert totals.values == {'damage': 2150, 'spot': 1, 'frag': 0, 'def': 0}


class PanelTest(unittest.TestCase):

    def test_state_from_the_site_row(self):
        state = panel_state({'damage': 1506, 'spot': 1, 'frag': 1, 'def': 0}, row())
        assert state['average'] == 1204.5 and state['tank_wn8'] == 2104.9 and state['delta'] == 25
        assert state['wn8'] == wn8({'damage': 1506, 'spot': 1, 'frag': 1, 'def': 0}, EXPECTED)
        empty = panel_state({'damage': 10, 'spot': 0, 'frag': 0, 'def': 0}, None)
        assert empty['wn8'] is None and empty['delta'] is None

    def test_a_zero_average_shows_no_damage_line(self):
        state = panel_state({'damage': 500, 'spot': 0, 'frag': 0, 'def': 0}, dict(row(), avg_damage=0.0))
        assert state['average'] is None and state['delta'] is None
        assert format_panel(state, Settings({}, SCHEMA), translator()) is not None
        assert format_panel(state, Settings({'show_wn8': False}, SCHEMA), translator()) is None

    def test_format(self):
        state = panel_state({'damage': 1500, 'spot': 1, 'frag': 1, 'def': 0}, dict(row(), avg_damage=1200.0))
        text = format_panel(state, Settings({}, SCHEMA), translator())
        assert u'WN8 боя ≈' in text and u'(на танке 2 105)' in text and u'Урон 1 500 / ср. 1 200' in text and '(+25%)' in text
        assert COLOR_UP in text
        low = format_panel(panel_state({'damage': 300, 'spot': 0, 'frag': 0, 'def': 0}, row()), Settings({'show_wn8': False}, SCHEMA), translator('en'))
        assert 'WN8' not in low and '(-75%)' in low and COLOR_DOWN in low
        plain = format_panel(state, Settings({'colored': False, 'template': '{wn8}/{delta}'}, SCHEMA), translator())
        assert '/+25%' in plain
        assert format_panel(panel_state({'damage': 1, 'spot': 0, 'frag': 0, 'def': 0}, {}), Settings({}, SCHEMA), translator()) is None

    def test_preview_settings_and_strings(self):
        assert u'WN8 боя' in preview_text(Settings({}, SCHEMA), translator())
        assert SETTINGS == ('battle_efficiency',)
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
