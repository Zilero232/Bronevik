# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.storage import MemoryFile
from otmetki.features.marks_history.i18n import STRINGS
from otmetki.features.marks_history.model import MarksHistory, build_page, hangar_widget, panel_text, vehicle_label
from otmetki.features.marks_history.settings import SCHEMA, SETTINGS

T0 = 1790000000


def battle(arena, rating, marks=2, avg=2600, damage=2000, radio=500, occurred=T0):
    return {
        'arena_unique_id': str(arena),
        'occurred_at': occurred,
        'result': 'win',
        'vehicle': {'tank_id': 1, 'name': 'ussr:R04_T-34', 'tier': 5},
        'stats': {'damage_dealt': damage, 'damage_assisted_radio': radio, 'damage_assisted_track': 100},
        'moe': {'damage_rating': rating, 'moving_avg_damage': avg, 'marks_on_gun': marks},
    }


def snapshot():
    return {
        'tank_id': 1,
        'name': 'ussr:R04_T-34',
        'tier': 5,
        'damage_rating': 8400,
        'moving_avg_damage': 2500,
        'marks_on_gun': 1,
    }


def translator(language='ru'):
    return _support.translator(STRINGS, language)


def empty_history(store=None):
    return MarksHistory(store or MemoryFile(), max_entries=10)


def recorded_history(store=None):
    history = empty_history(store)
    history.record_snapshot(snapshot(), T0 - 100)
    history.record_battle(battle(1, 8520, marks=2, occurred=T0))
    history.record_battle(battle(2, 8610, occurred=T0 + 600), label=u'Т-34')
    return history


def two_battles():
    history = empty_history()
    history.record_battle(battle(1, 8400, marks=1, occurred=T0))
    history.record_battle(battle(2, 8520, marks=2, occurred=T0 + 600))
    return history


class VehicleLabelTest(unittest.TestCase):

    def test_the_label_drops_the_nation_and_the_item_code(self):
        assert vehicle_label('ussr:R04_T-34') == 'T-34'
        assert vehicle_label('germany:G89_Leopard1') == 'Leopard1'
        assert vehicle_label('usa:A120_M48A5') == 'M48A5'

    def test_no_name_is_an_empty_label(self):
        assert vehicle_label(None) == ''


class RecordTest(unittest.TestCase):

    def test_a_new_snapshot_is_recorded(self):
        history = empty_history()

        assert history.record_snapshot(snapshot(), T0 - 100) is not None

    def test_an_unchanged_snapshot_is_not_recorded_again(self):
        history = empty_history()
        history.record_snapshot(snapshot(), T0 - 100)

        assert history.record_snapshot(snapshot(), T0 - 50) is None

    def test_a_battle_is_recorded(self):
        history = empty_history()

        assert history.record_battle(battle(1, 8520, occurred=T0)) is not None

    def test_a_battle_of_the_same_arena_is_recorded_once(self):
        history = empty_history()
        history.record_battle(battle(1, 8520, occurred=T0))

        assert history.record_battle(battle(1, 8520, occurred=T0)) is None

    def test_a_battle_without_dossier_values_is_not_recorded(self):
        history = empty_history()

        assert not history.record_battle({'vehicle': {'tank_id': 1}, 'moe': None})

    def test_a_vehicle_keeps_the_last_max_entries(self):
        history = empty_history()

        for index in range(15):
            history.record_battle(battle(index, 8000 + index, occurred=T0 + index))

        assert len(history.vehicle(1)['entries']) == 10


class SummaryTest(unittest.TestCase):

    def test_summary_of_the_recorded_battles(self):
        summary = recorded_history().summary(1, 5)

        assert summary['label'] == u'Т-34'
        assert summary['percent'] == 86.1
        assert summary['marks'] == 2
        assert summary['last_delta'] == 0.9
        assert summary['trend'] == 2.1
        assert summary['trend_battles'] == 2

    def test_a_new_mark_is_dated_by_the_battle_that_reached_it(self):
        summary = recorded_history().summary(1, 5)

        assert summary['reached'] == {'2': T0}

    def test_a_saved_history_reads_back(self):
        store = MemoryFile()
        recorded_history(store).save()

        again = MarksHistory(store)

        assert again.summary(1, 1)['trend'] == 0.9

    def test_a_cleared_vehicle_has_no_summary(self):
        history = recorded_history()

        assert history.clear(1)
        assert history.summary(1, 5) is None


class PageTest(unittest.TestCase):

    def test_page_row_of_a_vehicle(self):
        row = build_page(two_battles(), translator(), 5, 50)['rows'][0]

        assert row['id'] == '1'
        assert row['title'] == 'T-34'
        assert row['badge'] == '+1.20%'
        assert row['actions'][0]['id'] == 'clear'

    def test_page_details_list_the_reached_marks_then_the_entries(self):
        details = build_page(two_battles(), translator(), 5, 50)['rows'][0]['details']

        assert details[0]['label'] == u'2-я отметка'
        assert '85.20%' in details[1]['value']
        assert '+1.20%' in details[1]['value']

    def test_an_empty_history_is_an_empty_page(self):
        page = build_page(empty_history(), translator(), 5, 50)

        assert page['rows'] == []
        assert page['empty']


class PanelTest(unittest.TestCase):

    def test_panel_shows_the_percent_and_the_last_change(self):
        text = panel_text(two_battles().summary(1, 5), translator('en'))

        assert '85.20%' in text
        assert '+1.20%' in text

    def test_card_shows_the_percent_and_the_last_change(self):
        data = hangar_widget(two_battles().summary(1, 5), translator('en'))['data']

        assert data['value'] == '85.20%'
        assert data['rows'][0]['value'] == '+1.20%'
        assert data['rows'][0]['tone'] == 'good'


class SettingsTest(unittest.TestCase):

    def test_the_config_switch(self):
        assert SETTINGS == ('hangar_marks_history',)

    def test_the_settings_keys(self):
        assert sorted(SCHEMA.defaults) == ['max_entries', 'page_rows', 'show_panel', 'trend_battles']

    def test_both_languages_have_the_same_keys(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
