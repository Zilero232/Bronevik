import unittest

import _support  # noqa: F401
from bronevik.session import SessionAggregator


def battle(result='win', damage=1000, bonus_type=1, tank_id=1, alive=True):
    return {
        'bonus_type': bonus_type,
        'result': result,
        'vehicle': {'tank_id': tank_id},
        'stats': {
            'damage_dealt': damage,
            'damage_assisted_radio': 100,
            'damage_assisted_track': 50,
            'damage_assisted_stun': 0,
            'damage_blocked': 200,
            'frags': 1,
            'spotted': 2,
            'xp': 800,
            'credits': 30000,
            'shots': 10,
            'direct_enemy_hits': 8,
            'piercing_enemy_hits': 6,
            'is_alive': alive,
        },
    }


class SessionTest(unittest.TestCase):

    def test_aggregates(self):
        session = SessionAggregator(idle_seconds=3600)
        first = session.add(battle('win', 1000), 1000)
        second = session.add(battle('loss', 3000, alive=False), 1500)
        session.add(battle('draw', 2000, tank_id=2), 2000)
        self.assertEqual(first, second)
        summary = session.summary()
        self.assertEqual(summary['battles'], 3)
        self.assertEqual(summary['wins'], 1)
        self.assertEqual(summary['losses'], 1)
        self.assertEqual(summary['draws'], 1)
        self.assertEqual(summary['win_rate'], 33.33)
        self.assertEqual(summary['avg_damage'], 2000.0)
        self.assertEqual(summary['avg_assist'], 150.0)
        self.assertEqual(summary['survival_rate'], 66.67)
        self.assertEqual(summary['hit_rate'], 80.0)
        self.assertEqual(summary['pen_rate'], 75.0)
        self.assertEqual(summary['credits_total'], 90000)
        self.assertEqual(summary['vehicles']['1'], {'battles': 2, 'wins': 1, 'damage_dealt': 4000})
        self.assertIsNone(summary['wn8'])

    def test_idle_gap_starts_new_session(self):
        session = SessionAggregator(idle_seconds=600)
        first = session.add(battle(), 0)
        second = session.add(battle(), 601)
        self.assertNotEqual(first, second)
        self.assertEqual(session.summary()['battles'], 1)

    def test_uncounted_bonus_type_keeps_session_alive(self):
        session = SessionAggregator(idle_seconds=600)
        first = session.add(battle(bonus_type=2), 0)
        second = session.add(battle(), 500)
        third = session.add(battle(), 1000)
        self.assertEqual(first, second)
        self.assertEqual(second, third)
        self.assertEqual(session.summary()['battles'], 2)

    def test_empty_summary(self):
        summary = SessionAggregator().summary()
        self.assertEqual(summary['battles'], 0)
        self.assertIsNone(summary['win_rate'])
        self.assertIsNone(summary['avg_damage'])

    def test_server_summary_only_for_current_session(self):
        session = SessionAggregator()
        session_id = session.add(battle(), 0)
        self.assertFalse(session.set_server_summary('other', {'wn8': 1500}))
        self.assertTrue(session.set_server_summary(session_id, {'wn8': 1712.6}))
        self.assertEqual(session.summary()['wn8'], 1713.0)

    def test_roundtrip(self):
        session = SessionAggregator()
        session_id = session.add(battle(), 100)
        restored = SessionAggregator()
        self.assertTrue(restored.load(session.to_dict()))
        self.assertEqual(restored.session_id, session_id)
        self.assertEqual(restored.summary(), session.summary())
        self.assertFalse(SessionAggregator().load({'session_id': 'x'}))
        self.assertFalse(SessionAggregator().load(None))


if __name__ == '__main__':
    unittest.main()
