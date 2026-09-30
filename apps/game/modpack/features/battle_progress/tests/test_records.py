# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import os
import unittest

import _support
from otmetki.features.battle_progress.model.constants import MAX_TANKS, STORE_FILE
from otmetki.features.battle_progress.model.records import RecordBook, event_values

INGEST_EXAMPLE = os.path.join(_support.CONTRACT_DIR, 'examples', 'ingest.example.json')


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

    def test_keeps_the_personal_best_file_name(self):
        assert STORE_FILE % 7 == 'personal_best_7.json'

    def test_reads_the_personal_best_file_format(self):
        saved = {'tanks': {'1': {'damage': 5100}, '2849': {'frags': 4}}, 'order': [2849, 1]}

        book = RecordBook(saved)

        assert book.to_dict() == saved

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


class EventValuesTest(unittest.TestCase):

    def test_use_own_stats(self):
        values = event_values(ingest_battle_result())

        assert values == {'damage': 2150, 'assist': 950, 'frags': 2, 'xp': 1150}

    def test_assist_counts_stun_as_the_dossier_does(self):
        values = event_values(assist_event())

        assert values['assist'] == 900


if __name__ == '__main__':
    unittest.main()
