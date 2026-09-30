# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.hud.panel import dock_of, retired_reset
from otmetki.core.settings import Settings
from otmetki.features.main_gun.i18n import STRINGS
from otmetki.features.main_gun.model import format_panel, medal_status, threshold, values
from otmetki.features.main_gun.model.preview import preview_text
from otmetki.features.main_gun.model.widget import panel_widget
from otmetki.features.main_gun.settings import SCHEMA, SETTINGS


def translator(language='ru'):
    return _support.translator(STRINGS, language)


def threshold_row(state):
    return panel_widget(state, Settings({}, SCHEMA), translator())['data']['rows'][0]


class ThresholdTest(unittest.TestCase):

    def test_is_a_fifth_of_the_enemy_hp(self):
        assert threshold(14700) == 2940

    def test_a_fifth_of_the_enemy_hp_is_rounded_up(self):
        assert threshold(14701) == 2941

    def test_is_at_least_1000(self):
        assert threshold(3000) == 1000

    def test_is_1000_without_the_enemy_hp(self):
        assert threshold(None) == 1000


class MedalStatusTest(unittest.TestCase):

    def test_is_in_progress_while_the_enemies_have_enough_hp_left(self):
        assert medal_status(damage=1850, need=2940, remaining=8580, hit_ally=False) == 'progress'

    def test_is_reached_at_the_threshold(self):
        assert medal_status(damage=2940, need=2940, remaining=0, hit_ally=False) == 'reached'

    def test_is_unreachable_when_the_enemies_have_less_hp_left_than_still_needed(self):
        assert medal_status(damage=1850, need=2940, remaining=1089, hit_ally=False) == 'unreachable'

    def test_is_still_reachable_with_exactly_the_hp_still_needed(self):
        assert medal_status(damage=1850, need=2940, remaining=1090, hit_ally=False) == 'progress'

    def test_is_failed_once_an_own_shot_hit_an_ally(self):
        assert medal_status(damage=3100, need=2940, remaining=8580, hit_ally=True) == 'failed'


class ValuesTest(unittest.TestCase):

    def test_counts_the_damage_left_and_the_share_of_the_team_damage(self):
        state = values(1850, 14700, 8580)

        assert state == {
            'damage': 1850,
            'need': 2940,
            'left': 1090,
            'remaining': 8580,
            'team': 6120,
            'share': 30,
            'status': 'progress',
        }

    def test_team_damage_is_never_below_the_own_damage(self):
        state = values(900, 14700, 14700)

        assert state['team'] == 900

    def test_share_is_zero_without_team_damage(self):
        state = values(0, 0, 0)

        assert state['share'] == 0

    def test_carries_the_ally_hit(self):
        state = values(1850, 14700, 8580, hit_ally=True)

        assert state['status'] == 'failed'


class FormatTest(unittest.TestCase):

    def test_progress_line_shows_the_damage_left_and_the_team_share(self):
        text = format_panel(values(1850, 14700, 8580), Settings({}, SCHEMA), translator())

        assert u'Основной калибр 1 850 / 2 940' in text
        assert u'осталось 1 090' in text
        assert u'ваша доля 30%' in text

    def test_reached_line_without_the_team_line(self):
        text = format_panel(values(3100, 14700, 8580), Settings({'show_team': False}, SCHEMA), translator('en'))

        assert 'threshold 2 940 reached (3 100)' in text
        assert 'team damage' not in text

    def test_unreachable_line_names_the_damage_needed_and_the_enemy_hp_left(self):
        text = format_panel(values(1850, 14700, 900), Settings({}, SCHEMA), translator())

        assert u'Основной калибр недостижим: нужно ещё 1 090, у противника осталось 900' in text

    def test_failed_line_names_the_ally_hit(self):
        text = format_panel(values(1850, 14700, 8580, hit_ally=True), Settings({}, SCHEMA), translator('en'))

        assert 'High Caliber failed: an ally was hit' in text

    def test_a_custom_template_replaces_the_lines(self):
        settings = Settings({'template': '{damage}|{need}|{share}|{remaining}'}, SCHEMA)

        text = format_panel(values(1850, 14700, 8580), settings, translator())

        assert '1 850|2 940|30|8 580' in text


class WidgetTest(unittest.TestCase):

    def test_progress_row_carries_the_damage_left(self):
        row = threshold_row(values(1850, 14700, 8580))

        assert row['status'] == 'active'
        assert row['note'] == u'ещё 1 090'

    def test_unreachable_row_is_idle(self):
        row = threshold_row(values(1850, 14700, 900))

        assert row['status'] == 'idle'
        assert row['tone'] == 'muted'
        assert row['note'] == u'недостижим'

    def test_failed_row_is_marked_failed(self):
        row = threshold_row(values(1850, 14700, 8580, hit_ally=True))

        assert row['status'] == 'failed'
        assert row['tone'] == 'bad'
        assert row['note'] == u'провален'

    def test_card_value_takes_the_state_tone(self):
        payload = panel_widget(values(3100, 14700, 8580), Settings({}, SCHEMA), translator())

        assert payload['data']['value_tone'] == 'success'


class PanelTest(unittest.TestCase):

    def test_preview_shows_the_damage_left(self):
        text = preview_text(Settings({}, SCHEMA), translator())

        assert '1 090' in text

    def test_switch(self):
        assert SETTINGS == ('battle_main_gun',)

    def test_strings_in_sync(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])

    def test_defaults_to_the_right_top_column_off_the_stock_team_bases(self):
        dock = dock_of('otmetki.hud.main_gun', SCHEMA.defaults)

        assert dock['group'] == 'battle_right_top'
        assert dock['order'] == 4
        assert dock['reserve'] == 420

    def test_the_old_centre_place_moves_to_the_new_default(self):
        settings = Settings({'x': 0, 'y': 60, 'align_x': 'center', 'align_y': 'top'}, SCHEMA)

        reset = retired_reset(settings)

        assert reset == {'x': -372, 'y': 60, 'align_x': 'right', 'align_y': 'top'}


if __name__ == '__main__':
    unittest.main()
