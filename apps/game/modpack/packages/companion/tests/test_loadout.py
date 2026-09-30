from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.codec import decode_json, encode_json
from otmetki.companion.loadout import LoadoutTracker, gameplay_id_of, normalize_loadout
from otmetki.companion.payload import build_battle_event, build_envelope

RAW = {
    'optional_devices': [4601, None, 4857, 'x', 9, 10],
    'consumables': [1531, 1275, None],
    'directives': [None],
    'shells': [
        {'shell_id': 6145, 'count': 30},
        {'shell_id': 6145, 'count': 5},
        {'shell_id': 6401, 'count': -1},
        'bad',
    ],
    'field_modifications': ['improvedRammer_1', 'bad name', 'improvedRammer_1'],
    'crew': [
        {'role': 'commander', 'skills': ['commander_sixthSense', 'repair']},
        {'role': None, 'skills': ['x']},
        {'role': 'gunner', 'skills': None},
    ],
}


def queued_tracker(tank_id, **kwargs):
    tracker = LoadoutTracker(**kwargs)
    tracker.queued(tank_id, RAW)
    return tracker


class NormalizeLoadoutTest(unittest.TestCase):

    def setUp(self):
        self.loadout = normalize_loadout(RAW, (3 << 16) | 5)

    def test_keeps_slot_order_and_blanks_invalid_ids(self):
        self.assertEqual(self.loadout['optional_devices'], [4601, None, 4857, None])
        self.assertEqual(self.loadout['consumables'], [1531, 1275, None])
        self.assertEqual(self.loadout['directives'], [None])

    def test_keeps_the_first_valid_count_per_shell(self):
        self.assertEqual(self.loadout['shells'], [{'shell_id': 6145, 'count': 30}])

    def test_drops_invalid_and_repeated_field_modifications(self):
        self.assertEqual(self.loadout['field_modifications'], ['improvedRammer_1'])

    def test_keeps_crew_members_with_a_role(self):
        self.assertEqual(self.loadout['crew'], [
            {'role': 'commander', 'skills': ['commander_sixthSense', 'repair']},
            {'role': 'gunner', 'skills': []},
        ])

    def test_gameplay_id_comes_from_the_arena_type(self):
        self.assertEqual(self.loadout['gameplay_id'], 3)

    def test_no_dict_is_no_loadout(self):
        self.assertIsNone(normalize_loadout(None))

    def test_only_empty_slots_is_no_loadout(self):
        self.assertIsNone(normalize_loadout({'optional_devices': [None, None], 'crew': []}))


class GameplayIdTest(unittest.TestCase):

    def test_a_plain_arena_type_has_gameplay_zero(self):
        self.assertEqual(gameplay_id_of(5), 0)

    def test_no_arena_type_has_no_gameplay(self):
        self.assertIsNone(gameplay_id_of(None))

    def test_a_negative_arena_type_has_no_gameplay(self):
        self.assertIsNone(gameplay_id_of(-1))


class LoadoutTrackerTest(unittest.TestCase):

    def test_attaches_the_queued_loadout_to_the_battle_of_the_same_tank(self):
        tracker = queued_tracker(1)

        attached = tracker.battle_started(100, 1)

        self.assertTrue(attached)
        self.assertEqual(tracker.take(100, 1), RAW)

    def test_a_taken_loadout_is_gone(self):
        tracker = queued_tracker(1)
        tracker.battle_started(100, 1)
        tracker.take(100, 1)

        self.assertIsNone(tracker.take(100, 1))

    def test_ignores_a_loadout_of_another_tank(self):
        tracker = queued_tracker(1)

        attached = tracker.battle_started(100, 2)

        self.assertFalse(attached)
        self.assertIsNone(tracker.take(100, 2))

    def test_keeps_a_bounded_number_of_arenas(self):
        tracker = LoadoutTracker(max_arenas=2)

        for arena_id in (1, 2, 3):
            tracker.queued(7, RAW)
            tracker.battle_started(arena_id, 7)

        self.assertIsNone(tracker.take(1, 7))
        self.assertEqual(tracker.take(3, 7), RAW)


class BattleEventLoadoutTest(unittest.TestCase):

    def test_battle_event_carries_the_normalized_loadout(self):
        event = build_battle_event(_support.battle_results(), {'loadout': RAW})

        self.assertEqual(event['loadout']['optional_devices'], [4601, None, 4857, None])

    def test_battle_event_without_loadout(self):
        event = build_battle_event(_support.battle_results(), {})

        self.assertIsNone(event['loadout'])

    def test_matches_contract(self):
        validator = _support.schema_validator('ingest.schema.json')
        if validator is None:
            self.skipTest('jsonschema is not installed')
        extras = {'vehicle_name': 'ussr:R04_T-34', 'vehicle_tier': 5, 'loadout': RAW}
        event = build_battle_event(_support.battle_results(), extras)

        envelope = decode_json(encode_json(build_envelope([event], 'dev_1', 12345678, '0.1.0', '1.45.0', 1790000500)))

        self.assertEqual(sorted(validator.iter_errors(envelope), key=str), [])


if __name__ == '__main__':
    unittest.main()
