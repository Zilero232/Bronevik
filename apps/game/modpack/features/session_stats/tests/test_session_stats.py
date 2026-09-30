# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.companion.i18n import STRINGS as COMPANION_STRINGS
from otmetki.companion.i18n import Translator
from otmetki.core.i18n import Catalog
from otmetki.features.session_stats.i18n import STRINGS
from otmetki.features.session_stats.model import format_session_panel, format_session_plain
from otmetki.features.session_stats.model import SessionAggregator, session_widget


def battle(result='win', damage=1000, bonus_type=1, tank_id=1, alive=True, arena_id=None):
    return {
        'arena_unique_id': None if arena_id is None else str(arena_id),
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
        summary = session.summary(2000)
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
        self.assertEqual(session.summary(601)['battles'], 1)

    def test_uncounted_bonus_type_keeps_session_alive(self):
        session = SessionAggregator(idle_seconds=600)
        first = session.add(battle(bonus_type=2), 0)
        second = session.add(battle(), 500)
        third = session.add(battle(), 1000)
        self.assertEqual(first, second)
        self.assertEqual(second, third)
        self.assertEqual(session.summary(1000)['battles'], 2)

    def test_empty_summary(self):
        summary = SessionAggregator().summary(0)
        self.assertEqual(summary['battles'], 0)
        self.assertIsNone(summary['win_rate'])
        self.assertIsNone(summary['avg_damage'])

    def test_server_summary_only_for_current_session(self):
        session = SessionAggregator()
        session_id = session.add(battle(), 0)
        self.assertFalse(session.set_server_summary('other', {'wn8': 1500}))
        self.assertTrue(session.set_server_summary(session_id, {'wn8': 1712.6}))
        self.assertEqual(session.summary(0)['wn8'], 1713.0)

    def test_roundtrip(self):
        session = SessionAggregator()
        session_id = session.add(battle(), 100)
        restored = SessionAggregator()
        self.assertTrue(restored.load(session.to_dict()))
        self.assertEqual(restored.session_id, session_id)
        self.assertEqual(restored.summary(100), session.summary(100))
        self.assertFalse(SessionAggregator().load({'session_id': 'x'}))
        self.assertFalse(SessionAggregator().load(None))


class RecentTest(unittest.TestCase):

    def test_keeps_the_last_ten_results_oldest_first(self):
        session = SessionAggregator()
        results = ['draw', 'loss'] + ['win', 'loss'] * 5

        for moment, result in enumerate(results):
            session.add(battle(result), moment)

        recent = session.summary(20)['recent']
        assert recent == ['win', 'loss', 'win', 'loss', 'win', 'loss', 'win', 'loss', 'win', 'loss']

    def test_leaves_uncounted_battles_out(self):
        session = SessionAggregator()

        session.add(battle('loss', bonus_type=2), 0)
        session.add(battle('win'), 1)

        assert session.summary(1)['recent'] == ['win']

    def test_restores_the_strip_without_unknown_results(self):
        session = SessionAggregator()
        session.add(battle('win'), 0)
        data = session.to_dict()
        data['recent'] = ['win', 'nope', 'loss']
        restored = SessionAggregator()

        restored.load(data)

        assert restored.summary(0)['recent'] == ['win', 'loss']


class PendingTest(unittest.TestCase):

    def test_counts_started_random_battles(self):
        session = SessionAggregator()

        session.started(11, 1, 0)
        session.started(12, 1, 10)
        session.started(13, 2, 20)

        assert session.summary(30)['pending'] == 2

    def test_results_end_the_wait(self):
        session = SessionAggregator()
        session.started(11, 1, 0)
        session.started(12, 1, 10)

        session.results_arrived(11)

        assert session.summary(30)['pending'] == 1

    def test_a_recorded_battle_ends_its_wait(self):
        session = SessionAggregator()
        session.started(12, 1, 10)

        session.add(battle(arena_id=12), 40)

        assert session.summary(40)['pending'] == 0

    def test_keeps_waiting_until_the_limit(self):
        session = SessionAggregator()

        session.started(11, 1, 0)

        assert session.pending_count(1800) == 1

    def test_forgets_results_that_never_came(self):
        session = SessionAggregator()

        session.started(11, 1, 0)

        assert session.pending_count(1801) == 0

    def test_battle_start_opens_the_session(self):
        session = SessionAggregator()

        session.started(11, 1, 100)

        assert session.started_at == 100


class ResetTest(unittest.TestCase):

    def test_starts_a_new_session_id(self):
        session = SessionAggregator()
        first = session.add(battle('win'), 0)

        second = session.reset(10)

        assert second != first

    def test_empties_the_counters_and_the_strip(self):
        session = SessionAggregator()
        session.add(battle('win'), 0)

        session.reset(10)

        summary = session.summary(10)
        assert summary['battles'] == 0
        assert summary['recent'] == []
        assert summary['started_at'] == 10

    def test_stops_waiting_for_earlier_battles(self):
        session = SessionAggregator()
        session.started(11, 1, 0)

        session.reset(10)

        assert session.summary(10)['pending'] == 0

    def test_results_of_earlier_battles_stay_out(self):
        session = SessionAggregator()
        session.started(11, 1, 0)
        session.reset(10)

        session_id = session.add(battle('win', arena_id=11), 20)

        assert session_id is None
        assert session.summary(20)['battles'] == 0

    def test_later_battles_count(self):
        session = SessionAggregator()
        session.started(11, 1, 0)
        session.reset(10)
        session.add(battle('win', arena_id=11), 20)

        session.add(battle('loss', arena_id=12), 30)

        assert session.summary(30)['recent'] == ['loss']

    def test_an_idle_gap_keeps_the_waiting_battles(self):
        session = SessionAggregator(idle_seconds=600)
        session.add(battle(), 0)
        session.started(11, 1, 5000)

        session.add(battle('win', arena_id=11), 5100)

        assert session.summary(5100)['battles'] == 1


class SessionPanelTest(unittest.TestCase):

    def test_same_keys(self):
        self.assertEqual(sorted(STRINGS['ru'].keys()), sorted(STRINGS['en'].keys()))

    def test_session_panel(self):
        translate = Translator('en', Catalog(COMPANION_STRINGS, STRINGS))
        summary = {'battles': 5, 'win_rate': 60.0, 'avg_damage': 2100.0, 'wn8': None}
        self.assertIn(u'60.00%', format_session_panel(summary, translate))
        self.assertEqual(format_session_plain(summary, translate), u'Session: Battles 5, Win rate 60.00%, Avg dmg 2 100, WN8 -')

    def test_panel_shows_the_strip(self):
        translate = Translator('en', Catalog(COMPANION_STRINGS, STRINGS))
        summary = {'battles': 2, 'win_rate': 50.0, 'avg_damage': 1000.0, 'wn8': None, 'recent': ['win', 'loss']}

        text = format_session_panel(summary, translate)

        assert u'Last</font>: <font color="#7CD35B">W</font> <font color="#E3564A">L</font>' in text

    def test_panel_shows_the_pending_count(self):
        translate = Translator('en', Catalog(COMPANION_STRINGS, STRINGS))
        summary = {'battles': 2, 'win_rate': 50.0, 'avg_damage': 1000.0, 'wn8': None, 'pending': 3}

        text = format_session_panel(summary, translate)

        assert u'Awaiting results: 3' in text

    def test_panel_without_recent_battles_has_no_strip(self):
        translate = Translator('en', Catalog(COMPANION_STRINGS, STRINGS))
        summary = {'battles': 2, 'win_rate': 50.0, 'avg_damage': 1000.0, 'wn8': None, 'recent': [], 'pending': 0}

        text = format_session_panel(summary, translate)

        assert u'Last' not in text
        assert u'Awaiting' not in text

    def test_widget_draws_the_strip(self):
        translate = Translator('en', Catalog(COMPANION_STRINGS, STRINGS))
        summary = {'battles': 2, 'recent': ['win', 'draw', 'loss'], 'pending': 0}

        data = session_widget(summary, translate)['data']

        assert data['strip'] == ['good', 'muted', 'bad']

    def test_widget_adds_the_pending_row(self):
        translate = Translator('en', Catalog(COMPANION_STRINGS, STRINGS))
        summary = {'battles': 2, 'recent': [], 'pending': 1}

        data = session_widget(summary, translate)['data']

        assert [row['text'] for row in data['rows']] == [u'Awaiting results: 1']

    def test_widget_without_waiting_battles_has_no_rows(self):
        translate = Translator('en', Catalog(COMPANION_STRINGS, STRINGS))
        summary = {'battles': 2, 'recent': [], 'pending': 0}

        data = session_widget(summary, translate)['data']

        assert data['rows'] == []

if __name__ == '__main__':
    unittest.main()
