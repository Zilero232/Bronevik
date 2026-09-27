import json
import unittest

import _support
from otmetki.core.codec import decode_json, encode_json
from otmetki.companion.payload import (
    PayloadError,
    battle_outcome,
    build_battle_event,
    build_envelope,
    build_battle_start_event,
    build_moe_distribution_event,
    build_moe_snapshot_event,
    build_queue_event,
)


class BattleEventTest(unittest.TestCase):

    def setUp(self):
        self.results = _support.battle_results()
        self.event = build_battle_event(self.results, {
            'vehicle_name': 'ussr:R04_T-34',
            'vehicle_tier': 5,
            'map_name': '05_prohorovka',
            'queue_time_s': 12.5,
            'session_id': 'abc',
        })

    def test_identity_fields(self):
        event = self.event
        self.assertEqual(event['type'], 'battle_result')
        self.assertEqual(event['event_id'], 'battle:1152921504606847123')
        self.assertEqual(event['arena_unique_id'], '1152921504606847123')
        self.assertEqual(event['arena_type_id'], 5)
        self.assertEqual(event['bonus_type'], 1)
        self.assertEqual(event['duration_s'], 402)
        self.assertEqual(event['occurred_at'], 1790000402)
        self.assertEqual(event['vehicle'], {'tank_id': 1, 'name': 'ussr:R04_T-34', 'tier': 5})
        self.assertEqual(event['queue_time_s'], 12.5)
        self.assertEqual(event['session_id'], 'abc')

    def test_stats(self):
        stats = self.event['stats']
        self.assertEqual(stats['damage_dealt'], 2150)
        self.assertEqual(stats['damage_assisted_radio'], 640)
        self.assertEqual(stats['damage_assisted_track'], 310)
        self.assertEqual(stats['damage_blocked'], 900)
        self.assertEqual(stats['frags'], 2)
        self.assertEqual(stats['spotted'], 3)
        self.assertEqual(stats['shots'], 12)
        self.assertEqual(stats['piercing_enemy_hits'], 7)
        self.assertEqual(stats['credits'], 48000)
        self.assertEqual(stats['xp'], 1150)
        self.assertTrue(stats['is_alive'])
        self.assertFalse(stats['is_premium'])

    def test_result_and_moe(self):
        self.assertEqual(self.event['result'], 'win')
        self.assertEqual(self.event['moe'], {'marks_on_gun': 2, 'damage_rating': 8712, 'moving_avg_damage': 2610})

    def test_outcomes(self):
        self.assertEqual(battle_outcome(0, 1), 'draw')
        self.assertEqual(battle_outcome(1, 1), 'win')
        self.assertEqual(battle_outcome(2, 1), 'loss')

    def test_no_moe_for_low_tier(self):
        results = _support.battle_results()
        results['personal'][1]['damageRating'] = 0
        self.assertIsNone(build_battle_event(results)['moe'])

    def test_never_leaks_other_players(self):
        serialized = json.dumps(build_envelope([self.event], 'dev', 12345678, '0.1.0', '1.45', 1790000500, 'b1'))
        for foreign in ('98765', '87654321', 'enemy_player_secret', '4321', '2849'):
            self.assertNotIn(foreign, serialized)

    def test_solo_battle_has_no_platoon(self):
        self.assertIsNone(self.event['platoon'])
        self.assertIsNone(self.event['shots'])

    def test_platoon_lists_only_own_team_mates(self):
        results = _support.battle_results()
        results['players']['12345678']['prebattleID'] = 77
        results['players']['23456789'] = {'name': 'platoon_friend_nick', 'team': 1, 'prebattleID': 77}
        results['players']['87654321']['prebattleID'] = 77
        event = build_battle_event(results)
        self.assertEqual(event['platoon'], {'size': 2, 'mates': [23456789]})
        self.assertNotIn('platoon_friend_nick', json.dumps(event))

    def test_shots_pass_through_from_extras(self):
        shot = {'damage': 402, 'nominal': 390, 'shell': 'armor_piercing', 'outcome': 'damage', 'distance_m': None, 'fatal': False}
        event = build_battle_event(_support.battle_results(), {'shots': [shot, 'junk']})
        self.assertEqual(event['shots'], [shot])

    def test_achievements_resolve_names_with_mastery_first(self):
        results = _support.battle_results()
        vehicle = results['personal'][1]
        vehicle['markOfMastery'] = 4
        vehicle['achievements'] = [11, 12, 'junk', 99, 11]
        names = {11: 'warrior', 12: 'invader'}
        event = build_battle_event(results, {'achievement_name': names.get})
        self.assertEqual(event['achievements'], ['markOfMastery', 'warrior', 'invader'])

    def test_achievements_empty_without_resolver(self):
        results = _support.battle_results()
        results['personal'][1]['achievements'] = [11]
        results['personal'][1]['markOfMastery'] = 0
        self.assertEqual(build_battle_event(results)['achievements'], [])

    def test_economy_costs(self):
        results = _support.battle_results()
        vehicle = results['personal'][1]
        vehicle['freeXP'] = 57
        vehicle['autoRepairCost'] = 4200
        vehicle['autoLoadCost'] = (1800, 0)
        vehicle['autoEquipCost'] = [3000, 0, 0]
        stats = build_battle_event(results)['stats']
        self.assertEqual(stats['free_xp'], 57)
        self.assertEqual(stats['repair_cost'], 4200)
        self.assertEqual(stats['ammo_cost'], 1800)
        self.assertEqual(stats['consumables_cost'], 3000)

    def test_economy_costs_absent(self):
        results = _support.battle_results()
        results['personal'][1]['autoLoadCost'] = None
        stats = build_battle_event(results)['stats']
        self.assertNotIn('ammo_cost', stats)

    def test_rejects_garbage(self):
        with self.assertRaises(PayloadError):
            build_battle_event({})
        with self.assertRaises(PayloadError):
            build_battle_event({'arenaUniqueID': 5, 'personal': {'avatar': {}}})

    def test_list_wrapped_vehicle(self):
        results = _support.battle_results()
        results['personal'][1] = [results['personal'][1]]
        self.assertEqual(build_battle_event(results)['stats']['damage_dealt'], 2150)


class EnvelopeTest(unittest.TestCase):

    def test_envelope_is_canonical_json(self):
        event = build_queue_event(1, 33.333, 'arena', 1790000000, 1)
        envelope = build_envelope([event], 'dev', 42, '0.1.0', u'1.45.0', 1790000001, 'batch-1')
        body = encode_json(envelope)
        self.assertEqual(decode_json(body), envelope)
        self.assertNotIn(b' ', body)
        self.assertEqual(body, encode_json(decode_json(body)))
        self.assertEqual(envelope['events'][0]['wait_s'], 33.3)

    def test_battle_start_event_carries_only_own_tank(self):
        event = build_battle_start_event(1790000000.7, 1)
        self.assertEqual(event['type'], 'battle_start')
        self.assertEqual(event['occurred_at'], 1790000000)
        self.assertEqual(event['tank_id'], 1)
        self.assertIsNone(build_battle_start_event(1790000000, 'x')['tank_id'])

    def test_envelope_requires_device(self):
        with self.assertRaises(PayloadError):
            build_envelope([], '', 1, '0.1.0', '', 0)

    def test_matches_contract(self):
        validator = _support.schema_validator('ingest.schema.json')
        if validator is None:
            self.skipTest('jsonschema is not installed')
        events = [
            build_battle_event(_support.battle_results(), {'vehicle_name': 'ussr:R04_T-34', 'vehicle_tier': 5, 'map_name': '05_prohorovka', 'session_id': 's'}),
            build_moe_snapshot_event(1, 8712, 2610, 2, 350, 1790000000),
            build_moe_distribution_event(1, 1000, [100, 400, 900], 1790000000),
            build_queue_event(1, 20, 'dequeued', 1790000000, None),
        ]
        envelope = decode_json(encode_json(build_envelope(events, 'dev_1', 12345678, '0.1.0', '1.45.0', 1790000500)))
        errors = sorted(validator.iter_errors(envelope), key=str)
        self.assertEqual(errors, [])

    def test_example_matches_contract(self):
        validator = _support.schema_validator('ingest.schema.json')
        if validator is None:
            self.skipTest('jsonschema is not installed')
        example = _support.load_json(_support.CONTRACT_DIR + '/examples/ingest.example.json')
        self.assertEqual(sorted(validator.iter_errors(example), key=str), [])


if __name__ == '__main__':
    unittest.main()
