# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.companion.i18n import STRINGS as COMPANION_STRINGS
from otmetki.companion.i18n import Translator
from otmetki.core.i18n import Catalog
from otmetki.features.session_stats.i18n import STRINGS
from otmetki.features.session_stats.model import (
    SessionAggregator,
    format_session_panel,
    format_session_plain,
    session_widget,
)


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


def three_battle_session():
    session = SessionAggregator(idle_seconds=3600)
    session.add(battle('win', 1000), 1000)
    session.add(battle('loss', 3000, alive=False), 1500)
    session.add(battle('draw', 2000, tank_id=2), 2000)
    return session


def saved_session(totals):
    return {'session_id': 'x', 'started_at': 0, 'last_activity_at': 0, 'totals': totals}


def english():
    return Translator('en', Catalog(COMPANION_STRINGS, STRINGS))


def panel_summary(**fields):
    summary = {'battles': 2, 'win_rate': 50.0, 'avg_damage': 1000.0, 'wn8': None}
    summary.update(fields)
    return summary


class SessionTest(unittest.TestCase):

    def test_battles_within_the_idle_time_share_the_session_id(self):
        session = SessionAggregator(idle_seconds=3600)

        first = session.add(battle('win', 1000), 1000)
        second = session.add(battle('loss', 3000, alive=False), 1500)

        assert first == second

    def test_counts_the_results(self):
        summary = three_battle_session().summary(2000)

        assert summary['battles'] == 3
        assert summary['wins'] == 1
        assert summary['losses'] == 1
        assert summary['draws'] == 1

    def test_rates_are_percents(self):
        summary = three_battle_session().summary(2000)

        assert summary['win_rate'] == 33.33
        assert summary['survival_rate'] == 66.67
        assert summary['hit_rate'] == 80.0
        assert summary['pen_rate'] == 75.0

    def test_averages_the_damage_and_the_assist(self):
        summary = three_battle_session().summary(2000)

        assert summary['avg_damage'] == 2000.0
        assert summary['avg_assist'] == 150.0

    def test_sums_the_credits(self):
        summary = three_battle_session().summary(2000)

        assert summary['credits_total'] == 90000

    def test_keeps_the_totals_per_vehicle(self):
        summary = three_battle_session().summary(2000)

        assert summary['vehicles'] == {
            '1': {'battles': 2, 'wins': 1, 'damage_dealt': 4000},
            '2': {'battles': 1, 'wins': 0, 'damage_dealt': 2000},
        }

    def test_has_no_wn8_before_the_server_answers(self):
        summary = three_battle_session().summary(2000)

        assert summary['wn8'] is None

    def test_an_idle_gap_starts_a_new_session_id(self):
        session = SessionAggregator(idle_seconds=600)
        first = session.add(battle(), 0)

        second = session.add(battle(), 601)

        assert first != second

    def test_an_idle_gap_starts_the_counters_over(self):
        session = SessionAggregator(idle_seconds=600)
        session.add(battle(), 0)

        session.add(battle(), 601)

        assert session.summary(601)['battles'] == 1

    def test_an_uncounted_bonus_type_keeps_the_session_alive(self):
        session = SessionAggregator(idle_seconds=600)
        first = session.add(battle(bonus_type=2), 0)

        second = session.add(battle(), 500)
        third = session.add(battle(), 1000)

        assert second == first
        assert third == first

    def test_an_uncounted_bonus_type_stays_out_of_the_counters(self):
        session = SessionAggregator(idle_seconds=600)
        session.add(battle(bonus_type=2), 0)

        session.add(battle(), 500)
        session.add(battle(), 1000)

        assert session.summary(1000)['battles'] == 2

    def test_an_empty_session_has_no_rates(self):
        summary = SessionAggregator().summary(0)

        assert summary['battles'] == 0
        assert summary['win_rate'] is None
        assert summary['avg_damage'] is None


class ServerSummaryTest(unittest.TestCase):

    def test_is_refused_for_another_session(self):
        session = SessionAggregator()
        session.add(battle(), 0)

        accepted = session.set_server_summary('other', {'wn8': 1500})

        assert not accepted

    def test_sets_the_rounded_wn8_of_the_current_session(self):
        session = SessionAggregator()
        session_id = session.add(battle(), 0)

        accepted = session.set_server_summary(session_id, {'wn8': 1712.6})

        assert accepted
        assert session.summary(0)['wn8'] == 1713.0

    def test_a_wn8_that_is_not_a_number_is_left_out(self):
        session = SessionAggregator()
        session_id = session.add(battle(), 0)

        session.set_server_summary(session_id, {'wn8': 'n/a'})

        assert session.summary(0)['wn8'] is None


class PersistenceTest(unittest.TestCase):

    def test_a_saved_session_restores_its_id(self):
        session = SessionAggregator()
        session_id = session.add(battle(), 100)
        restored = SessionAggregator()

        loaded = restored.load(session.to_dict())

        assert loaded
        assert restored.session_id == session_id

    def test_a_saved_session_restores_its_summary(self):
        session = SessionAggregator()
        session.add(battle(), 100)
        restored = SessionAggregator()

        restored.load(session.to_dict())

        assert restored.summary(100) == session.summary(100)

    def test_a_session_without_times_is_refused(self):
        assert not SessionAggregator().load({'session_id': 'x'})

    def test_nothing_saved_is_refused(self):
        assert not SessionAggregator().load(None)

    def test_counters_that_are_not_numbers_restore_as_zero(self):
        restored = SessionAggregator()

        restored.load(saved_session({'battles': 'many', 'wins': 2}))

        totals = restored.to_dict()['totals']
        assert totals['battles'] == 0
        assert totals['wins'] == 2


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

    def test_strings_are_in_sync(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])

    def test_panel_shows_the_win_rate(self):
        summary = panel_summary(battles=5, win_rate=60.0, avg_damage=2100.0)

        text = format_session_panel(summary, english())

        assert u'60.00%' in text

    def test_plain_line_lists_every_value(self):
        summary = panel_summary(battles=5, win_rate=60.0, avg_damage=2100.0)

        text = format_session_plain(summary, english())

        assert text == u'Session: Battles 5, Win rate 60.00%, Avg dmg 2 100, WN8 -'

    def test_panel_shows_the_strip(self):
        summary = panel_summary(recent=['win', 'loss'])

        text = format_session_panel(summary, english())

        assert u'Last</font>: <font color="#7CD35B">W</font> <font color="#E3564A">L</font>' in text

    def test_panel_shows_the_pending_count(self):
        summary = panel_summary(pending=3)

        text = format_session_panel(summary, english())

        assert u'Awaiting results: 3' in text

    def test_panel_without_recent_battles_has_no_strip(self):
        summary = panel_summary(recent=[], pending=0)

        text = format_session_panel(summary, english())

        assert u'Last' not in text

    def test_panel_without_waiting_battles_has_no_pending_line(self):
        summary = panel_summary(recent=[], pending=0)

        text = format_session_panel(summary, english())

        assert u'Awaiting' not in text

    def test_widget_draws_the_strip(self):
        summary = {'battles': 2, 'recent': ['win', 'draw', 'loss'], 'pending': 0}

        data = session_widget(summary, english())['data']

        assert data['strip'] == ['good', 'muted', 'bad']

    def test_widget_adds_the_pending_row(self):
        summary = {'battles': 2, 'recent': [], 'pending': 1}

        data = session_widget(summary, english())['data']

        assert [row['text'] for row in data['rows']] == [u'Awaiting results: 1']

    def test_widget_without_waiting_battles_has_no_rows(self):
        summary = {'battles': 2, 'recent': [], 'pending': 0}

        data = session_widget(summary, english())['data']

        assert data['rows'] == []


if __name__ == '__main__':
    unittest.main()
