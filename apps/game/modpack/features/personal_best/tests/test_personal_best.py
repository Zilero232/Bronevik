# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import os
import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.personal_best.i18n import STRINGS
from otmetki.features.personal_best.model import LiveBattle, RecordBook, beaten, event_values, format_card, format_line
from otmetki.features.personal_best.model.constants import KIND_BY_EVENT, MAX_TANKS
from otmetki.features.personal_best.model.preview import preview_text
from otmetki.features.personal_best.settings import SCHEMA, SETTINGS, SWITCH

INGEST_EXAMPLE = os.path.join(_support.CONTRACT_DIR, 'examples', 'ingest.example.json')
LABELLED_SETTING_PREFIXES = ('show_', 'sound', 'template')


def translator(language='ru'):
    return _support.translator(STRINGS, language)


def settings_with(**values):
    return Settings(values, SCHEMA)


def live(**values):
    battle = LiveBattle()
    for metric, value in values.items():
        battle.add(metric, value)
    return battle


def book_with(records):
    book = RecordBook()
    for tank_id, values in records:
        book.merge(tank_id, values)
    return book


def full_book():
    return book_with((tank_id, {'damage': 100}) for tank_id in range(1, MAX_TANKS + 1))


def ingest_battle_result():
    events = _support.load_json(INGEST_EXAMPLE)['events']
    return [item for item in events if item['type'] == 'battle_result'][0]


def assist_event():
    return {'stats': {
        'damage_dealt': 100,
        'damage_assisted_radio': 300,
        'damage_assisted_track': 200,
        'damage_assisted_stun': 400,
    }}


class RecordBookMergeTest(unittest.TestCase):

    def test_a_first_record_is_a_change(self):
        book = RecordBook()

        is_changed = book.merge(1, {'damage': 5100, 'assist': 900, 'frags': 0, 'xp': None})

        assert is_changed

    def test_a_better_value_of_one_metric_is_a_change(self):
        book = book_with([(1, {'damage': 5100, 'assist': 900})])

        is_changed = book.merge(1, {'damage': 4800, 'assist': 1400})

        assert is_changed

    def test_no_better_value_is_no_change(self):
        book = book_with([(1, {'damage': 5100})])

        is_changed = book.merge(1, {'damage': 5100})

        assert not is_changed

    def test_keeps_the_largest_value_of_every_source(self):
        book = book_with([
            (1, {'damage': 5100, 'assist': 900, 'frags': 0, 'xp': None}),
            (1, {'damage': 4800, 'assist': 1400}),
        ])

        record = book.get(1)

        assert record == {'damage': 5100, 'assist': 1400}

    def test_rejects_tank_id_zero(self):
        book = RecordBook()

        is_changed = book.merge(0, {'damage': 1})

        assert not is_changed

    def test_rejects_negative_values(self):
        book = RecordBook()

        is_changed = book.merge(2, {'damage': -5})

        assert not is_changed

    def test_a_rejected_record_leaves_the_tank_unknown(self):
        book = book_with([(2, {'damage': -5})])

        record = book.get(2)

        assert record == {}


class RecordBookStorageTest(unittest.TestCase):

    def test_round_trip_keeps_every_tank(self):
        book = book_with([(1, {'damage': 5100}), (2849, {'frags': 4})])

        again = RecordBook(book.to_dict())

        assert again.get(1) == {'damage': 5100}
        assert again.get(2849) == {'frags': 4}

    def test_skips_tanks_with_a_bad_id_or_record(self):
        book = RecordBook({'tanks': {'x': {'damage': 1}, '3': 'nope'}})

        assert book.tanks == {}

    def test_ignores_data_that_is_not_a_dict(self):
        book = RecordBook(['not', 'a', 'dict'])

        assert book.tanks == {}


class RecordBookCapTest(unittest.TestCase):

    def test_keeps_at_most_the_cap(self):
        book = full_book()

        book.merge(MAX_TANKS + 1, {'damage': 100})

        assert len(book.tanks) == MAX_TANKS

    def test_drops_the_tank_seen_least_recently(self):
        book = full_book()

        book.merge(MAX_TANKS + 1, {'damage': 100})

        assert 1 not in book.tanks

    def test_keeps_the_newest_tank(self):
        book = full_book()

        book.merge(MAX_TANKS + 1, {'damage': 100})

        assert MAX_TANKS + 1 in book.tanks

    def test_a_tank_seen_again_survives_a_reload(self):
        book = full_book()
        book.merge(1, {'damage': 50})
        again = RecordBook(book.to_dict())

        again.merge(MAX_TANKS + 1, {'damage': 100})

        assert 1 in again.tanks

    def test_the_next_least_recent_tank_goes_after_a_reload(self):
        book = full_book()
        book.merge(1, {'damage': 50})
        again = RecordBook(book.to_dict())

        again.merge(MAX_TANKS + 1, {'damage': 100})

        assert 2 not in again.tanks
        assert len(again.tanks) == MAX_TANKS


class BattleTest(unittest.TestCase):

    def test_event_values_use_own_stats(self):
        event = ingest_battle_result()

        values = event_values(event)

        assert values == {'damage': 2150, 'assist': 950, 'frags': 2, 'xp': 1150}

    def test_assist_counts_stun_as_the_dossier_does(self):
        # dossiers2 battle_results_processors (RU 1.45): maxAssisted = track + radio + stun.
        values = event_values(assist_event())

        assert values['assist'] == 900

    def test_the_live_line_counts_stun_assist(self):
        assert ('STUN_ASSIST', 'assist') in KIND_BY_EVENT

    def test_beaten_needs_a_known_record(self):
        broken = beaten({}, {'damage': 9000})

        assert broken == []

    def test_beaten_lists_only_the_metrics_above_their_record(self):
        broken = beaten({'damage': 6812, 'xp': 2740}, {'damage': 7050, 'xp': 2000, 'frags': 5})

        assert broken == [('damage', 6812, 7050)]


class LiveBattleTest(unittest.TestCase):

    def test_xp_is_not_a_live_metric(self):
        battle = live(damage=390, frags=1)

        is_changed = battle.add('xp', 5)

        assert not is_changed

    def test_adding_zero_is_no_change(self):
        battle = live(damage=390, frags=1)

        is_changed = battle.add('damage', 0)

        assert not is_changed

    def test_raising_to_a_larger_total_is_a_change(self):
        battle = live(damage=390, frags=1)

        is_changed = battle.raise_to('damage', 2150)

        assert is_changed

    def test_raising_to_a_smaller_total_is_no_change(self):
        battle = live(damage=2150, frags=1)

        is_changed = battle.raise_to('damage', 100)

        assert not is_changed

    def test_the_values_carry_every_live_metric(self):
        battle = live(damage=390, frags=1)

        battle.raise_to('damage', 2150)

        assert battle.values == {'damage': 2150, 'assist': 0, 'frags': 1}


class FormatTest(unittest.TestCase):

    def test_line_shows_the_record(self):
        text = format_line({'damage': 6812}, live(damage=5612), settings_with(), translator())

        assert u'рекорд (урон) 6 812' in text

    def test_line_counts_down_to_the_record(self):
        text = format_line({'damage': 6812}, live(damage=5612), settings_with(), translator())

        assert u'осталось 1 200' in text

    def test_line_celebrates_a_beaten_record(self):
        text = format_line({'damage': 6812}, live(damage=7050), settings_with(), translator('en'))

        assert 'New record (damage): 7 050 (+238)' in text

    def test_template_renders_each_switched_on_metric(self):
        settings = settings_with(show_damage=False, show_frags=True, template='{metric}:{current}/{record}')

        text = format_line({'damage': 6812, 'assist': 5120, 'frags': 6}, live(frags=2), settings, translator('en'))

        assert 'frags:2/6' in text

    def test_a_switched_off_metric_is_left_out(self):
        settings = settings_with(show_damage=False, show_frags=True, template='{metric}:{current}/{record}')

        text = format_line({'damage': 6812, 'assist': 5120, 'frags': 6}, live(frags=2), settings, translator('en'))

        assert 'damage' not in text

    def test_no_known_record_draws_nothing(self):
        text = format_line({}, live(damage=100), settings_with(), translator())

        assert text is None

    def test_card(self):
        text = format_card([('damage', 6812, 7050), ('xp', 2740, 2900)], u'T-34', translator())

        assert text == u'Три отметки: новый рекорд на T-34 — урон 7 050 (было 6 812), опыт 2 900 (было 2 740)'

    def test_preview_counts_down_to_the_record(self):
        text = preview_text(settings_with(), translator())

        assert u'осталось 1 200' in text


class SettingsTest(unittest.TestCase):

    def test_the_switch_is_the_only_setting(self):
        assert SETTINGS == (SWITCH,)

    def test_the_switch_name(self):
        assert SWITCH == 'battle_personal_best'

    def test_strings_in_sync(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])

    def test_every_player_setting_has_a_label(self):
        labelled = [key for key in SCHEMA.defaults if key.startswith(LABELLED_SETTING_PREFIXES)]

        for key in labelled:
            assert 'personal_best_' + key in STRINGS['ru'], key


if __name__ == '__main__':
    unittest.main()
