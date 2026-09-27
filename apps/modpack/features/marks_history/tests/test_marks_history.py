# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.storage import MemoryFile
from otmetki.features.marks_history.i18n import STRINGS
from otmetki.features.marks_history.model import MarksHistory, build_page, panel_text, vehicle_label
from otmetki.features.marks_history.settings import SCHEMA, SETTINGS

T0 = 1790000000


def battle(arena, rating, marks=2, avg=2600, damage=2000, radio=500, occurred=T0):
    return {'arena_unique_id': str(arena), 'occurred_at': occurred, 'result': 'win',
            'vehicle': {'tank_id': 1, 'name': 'ussr:R04_T-34', 'tier': 5},
            'stats': {'damage_dealt': damage, 'damage_assisted_radio': radio, 'damage_assisted_track': 100},
            'moe': {'damage_rating': rating, 'moving_avg_damage': avg, 'marks_on_gun': marks}}


def translator(language='ru'):
    return _support.translator(STRINGS, language)


class HistoryTest(unittest.TestCase):

    def setUp(self):
        self.store = MemoryFile()
        self.history = MarksHistory(self.store, max_entries=10)

    def test_label(self):
        assert vehicle_label('ussr:R04_T-34') == 'T-34'
        assert vehicle_label('germany:G89_Leopard1') == 'Leopard1'
        assert vehicle_label('usa:A120_M48A5') == 'M48A5'
        assert vehicle_label(None) == ''

    def test_battles_snapshots_and_marks(self):
        snapshot = {'tank_id': 1, 'name': 'ussr:R04_T-34', 'tier': 5, 'damage_rating': 8400, 'moving_avg_damage': 2500, 'marks_on_gun': 1}
        assert self.history.record_snapshot(snapshot, T0 - 100) is not None
        assert self.history.record_snapshot(snapshot, T0 - 50) is None
        assert self.history.record_battle(battle(1, 8520, marks=2, occurred=T0)) is not None
        assert self.history.record_battle(battle(1, 8520, occurred=T0)) is None
        assert self.history.record_battle(battle(2, 8610, occurred=T0 + 600), label=u'Т-34') is not None
        summary = self.history.summary(1, 5)
        assert summary['label'] == u'Т-34' and summary['percent'] == 86.1 and summary['marks'] == 2
        assert summary['last_delta'] == 0.9 and summary['trend'] == 2.1 and summary['trend_battles'] == 2
        assert summary['reached'] == {'2': T0}
        self.history.save()
        again = MarksHistory(self.store)
        assert again.summary(1, 1)['trend'] == 0.9

    def test_limits_and_clear(self):
        for index in range(15):
            self.history.record_battle(battle(index, 8000 + index, occurred=T0 + index))
        assert len(self.history.vehicle(1)['entries']) == 10
        assert self.history.clear(1) and self.history.summary(1, 5) is None
        assert not self.history.record_battle({'vehicle': {'tank_id': 1}, 'moe': None})

    def test_page_and_panel(self):
        self.history.record_battle(battle(1, 8400, marks=1, occurred=T0))
        self.history.record_battle(battle(2, 8520, marks=2, occurred=T0 + 600))
        page = build_page(self.history, translator(), 5, 50)
        row = page['rows'][0]
        assert row['id'] == '1' and row['title'] == 'T-34' and row['badge'] == '+1.20%'
        assert row['details'][0]['label'] == u'2-я отметка'
        assert '85.20%' in row['details'][1]['value'] and '+1.20%' in row['details'][1]['value']
        assert row['actions'][0]['id'] == 'clear'
        text = panel_text(self.history.summary(1, 5), translator('en'))
        assert '85.20%' in text and '+1.20%' in text
        empty = build_page(MarksHistory(MemoryFile()), translator(), 5, 50)
        assert empty['rows'] == [] and empty['empty']

    def test_settings(self):
        assert SETTINGS == ('hangar_marks_history',)
        assert sorted(SCHEMA.defaults) == ['max_entries', 'page_rows', 'show_panel', 'trend_battles']
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
