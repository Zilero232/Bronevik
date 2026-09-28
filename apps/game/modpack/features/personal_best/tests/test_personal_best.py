# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import os
import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.personal_best.i18n import STRINGS
from otmetki.features.personal_best.model import LiveBattle, RecordBook, beaten, event_values, format_card, format_line
from otmetki.features.personal_best.model.constants import MAX_TANKS
from otmetki.features.personal_best.model.preview import preview_text
from otmetki.features.personal_best.settings import SCHEMA, SETTINGS, SWITCH


def translator(language='ru'):
    return _support.translator(STRINGS, language)


def live(**values):
    battle = LiveBattle()
    for metric, value in values.items():
        battle.add(metric, value)
    return battle


class RecordBookTest(unittest.TestCase):

    def test_keeps_the_largest_value_of_every_source(self):
        book = RecordBook()
        assert book.merge(1, {'damage': 5100, 'assist': 900, 'frags': 0, 'xp': None})
        assert book.merge(1, {'damage': 4800, 'assist': 1400})
        assert not book.merge(1, {'damage': 5100})
        assert book.get(1) == {'damage': 5100, 'assist': 1400}
        assert not book.merge(0, {'damage': 1}) and not book.merge(2, {'damage': -5})
        assert book.get(2) == {}

    def test_round_trip_and_bad_data(self):
        book = RecordBook()
        book.merge(1, {'damage': 5100})
        book.merge(2849, {'frags': 4})
        again = RecordBook(book.to_dict())
        assert again.get(1) == {'damage': 5100} and again.get(2849) == {'frags': 4}
        assert RecordBook({'tanks': {'x': {'damage': 1}, '3': 'nope'}}).tanks == {}
        assert RecordBook(['not', 'a', 'dict']).tanks == {}

    def test_is_capped(self):
        book = RecordBook()
        for tank_id in range(1, MAX_TANKS + 11):
            book.merge(tank_id, {'damage': 100})
        assert len(book.tanks) == MAX_TANKS and 1 not in book.tanks and MAX_TANKS + 10 in book.tanks

    def test_drops_the_tank_seen_least_recently_even_after_a_reload(self):
        book = RecordBook()
        for tank_id in range(1, MAX_TANKS + 1):
            book.merge(tank_id, {'damage': 100})
        book.merge(1, {'damage': 50})
        again = RecordBook(book.to_dict())
        again.merge(MAX_TANKS + 1, {'damage': 100})
        assert 1 in again.tanks and 2 not in again.tanks and len(again.tanks) == MAX_TANKS


class BattleTest(unittest.TestCase):

    def test_event_values_use_own_stats(self):
        events = _support.load_json(os.path.join(_support.CONTRACT_DIR, 'examples', 'ingest.example.json'))['events']
        event = [item for item in events if item['type'] == 'battle_result'][0]
        values = event_values(event)
        assert values == {'damage': 2150, 'assist': 950, 'frags': 2, 'xp': 1150}

    def test_beaten_needs_a_known_record(self):
        assert beaten({}, {'damage': 9000}) == []
        assert beaten({'damage': 6812, 'xp': 2740}, {'damage': 7050, 'xp': 2000, 'frags': 5}) == [('damage', 6812, 7050)]

    def test_live_battle(self):
        battle = live(damage=390, frags=1)
        assert not battle.add('xp', 5) and not battle.add('damage', 0)
        assert battle.raise_to('damage', 2150) and not battle.raise_to('damage', 100)
        assert battle.values == {'damage': 2150, 'assist': 0, 'frags': 1}


class FormatTest(unittest.TestCase):

    def test_line_counts_down_and_celebrates(self):
        settings = Settings({}, SCHEMA)
        text = format_line({'damage': 6812}, live(damage=5612), settings, translator())
        assert u'рекорд (урон) 6 812' in text and u'осталось 1 200' in text
        beaten_text = format_line({'damage': 6812}, live(damage=7050), settings, translator('en'))
        assert 'New record (damage): 7 050 (+238)' in beaten_text

    def test_metrics_switches_and_template(self):
        record = {'damage': 6812, 'assist': 5120, 'frags': 6}
        settings = Settings({'show_damage': False, 'show_frags': True, 'template': '{metric}:{current}/{record}'}, SCHEMA)
        text = format_line(record, live(frags=2), settings, translator('en'))
        assert 'frags:2/6' in text and 'damage' not in text
        assert format_line({}, live(damage=100), Settings({}, SCHEMA), translator()) is None

    def test_card(self):
        text = format_card([('damage', 6812, 7050), ('xp', 2740, 2900)], u'T-34', translator())
        assert text == u'Три отметки: новый рекорд на T-34 — урон 7 050 (было 6 812), опыт 2 900 (было 2 740)'

    def test_preview_settings_and_strings(self):
        assert u'осталось 1 200' in preview_text(Settings({}, SCHEMA), translator())
        assert SETTINGS == (SWITCH,) == ('battle_personal_best',)
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])
        for key in SCHEMA.defaults:
            if key.startswith(('show_', 'sound', 'template')):
                assert 'personal_best_' + key in STRINGS['ru'], key


if __name__ == '__main__':
    unittest.main()
