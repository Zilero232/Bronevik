# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import os
import unittest

import _support
from otmetki.companion.binding import Credentials
from otmetki.core.me import REFRESH_AFTER_BATTLE_S, device_body
from otmetki.features.session_stats.model import (
    Announced,
    SiteData,
    is_done,
    parse_goals,
    parse_overview,
    progress,
)
from otmetki.features.session_stats.model.constants import GOALS_KEY, OVERVIEW_KEY

ACCOUNT = 12345678
T0 = 1790000000.0


def example(name):
    return _support.load_json(os.path.join(_support.CONTRACT_DIR, 'examples', name))


def goals():
    return parse_goals(example('goals.example.json'), ACCOUNT)


def average_damage_goal():
    return goals()[0]


def moe_goal():
    return goals()[1]


def battles_goal():
    return goals()[2]


def malformed_goals():
    return [
        {'id': 'x', 'metric': 'fun', 'status': 'active', 'target': 1},
        {'id': 'y', 'metric': 'wn8', 'status': 'cancelled', 'target': 1},
        {'id': 'z', 'metric': 'wn8', 'status': 'active', 'target': 'a'},
        {'id': 7, 'metric': 'wn8', 'status': 'active', 'target': 1},
    ]


def overview_example():
    return example('ratings-overview.example.json')


def stored_site():
    site = SiteData(ACCOUNT)
    site.store_overview({'overall': None})
    return site


class GoalsParseTest(unittest.TestCase):

    def test_contract(self):
        request = _support.schema_validator('goals.schema.json', 'deviceRequest')
        answer = _support.schema_validator('goals.schema.json', 'goals')
        if request is None:
            self.skipTest('jsonschema not installed')

        request.validate(device_body(Credentials('dev_goals', 's' * 40, ACCOUNT)))
        answer.validate(example('goals.example.json'))

    def test_parses_the_own_goals(self):
        parsed = goals()

        assert [goal['metric'] for goal in parsed] == ['avgDamage', 'moe', 'battles']

    def test_keeps_the_tank_of_a_tank_goal(self):
        assert moe_goal()['tank_id'] == 1

    def test_goals_of_another_account_are_dropped(self):
        assert parse_goals(example('goals.example.json'), ACCOUNT + 1) == []

    def test_no_answer_means_no_goals(self):
        assert parse_goals(None, ACCOUNT) == []

    def test_drops_malformed_and_finished_goals(self):
        data = example('goals.example.json')
        data['goals'].extend(malformed_goals())

        parsed = parse_goals(data, ACCOUNT)

        assert len(parsed) == 3


class GoalProgressTest(unittest.TestCase):

    def test_progress_is_the_share_between_baseline_and_target(self):
        assert round(progress(average_damage_goal()), 3) == 0.56

    def test_a_goal_below_its_target_is_not_done(self):
        assert not is_done(average_damage_goal())

    def test_an_achieved_goal_is_done(self):
        assert is_done(battles_goal())

    def test_an_achieved_goal_is_complete(self):
        assert progress(battles_goal()) == 1.0

    def test_no_progress_without_a_current_value(self):
        assert progress(dict(average_damage_goal(), current=None)) is None

    def test_an_active_goal_at_its_target_is_done(self):
        assert is_done(dict(moe_goal(), current=85.0))


class AnnouncedTest(unittest.TestCase):

    def test_goals_done_at_the_first_read_are_not_announced(self):
        announced = Announced()

        assert announced.newly_done(goals()) == []

    def test_a_goal_done_after_the_first_read_is_announced(self):
        announced = Announced()
        announced.newly_done(goals())
        done = dict(average_damage_goal(), current=3100.0)

        fresh = announced.newly_done([done])

        assert [goal['id'] for goal in fresh] == [done['id']]

    def test_a_goal_is_announced_once(self):
        announced = Announced()
        announced.newly_done(goals())
        done = dict(average_damage_goal(), current=3100.0)
        announced.newly_done([done])

        assert announced.newly_done([done]) == []

    def test_a_restored_list_announces_new_goals_at_once(self):
        announced = Announced()
        announced.newly_done(goals())
        again = Announced(announced.to_list())

        fresh = again.newly_done([dict(moe_goal(), current=90.0)])

        assert fresh


class OverviewParseTest(unittest.TestCase):

    def test_the_overview_example_matches_the_contract(self):
        validator = _support.schema_validator('ratings.schema.json', 'overview')
        if validator is None:
            self.skipTest('jsonschema not installed')

        validator.validate(overview_example())

    def test_reads_the_account_ratings(self):
        overall = parse_overview(overview_example(), ACCOUNT)['overall']

        assert overall['wn8'] == {'value': 1850.4, 'tier': 'good'}

    def test_reads_the_account_facts(self):
        overall = parse_overview(overview_example(), ACCOUNT)['overall']

        assert (overall['win_rate'], overall['avg_damage']) == (53.41, 1654.2)

    def test_leaves_the_session_out(self):
        assert sorted(parse_overview(overview_example(), ACCOUNT)) == ['overall']

    def test_an_overview_of_another_account_is_dropped(self):
        assert parse_overview(overview_example(), ACCOUNT + 1) is None

    def test_an_overview_without_a_bound_account_is_dropped(self):
        assert parse_overview(overview_example(), None) is None

    def test_an_overview_that_is_not_an_object_is_dropped(self):
        assert parse_overview(['not', 'an', 'object'], ACCOUNT) is None

    def test_an_untracked_account_has_no_ratings_yet(self):
        data = {'account_id': ACCOUNT, 'nickname': None, 'overall': None, 'session': None}

        assert parse_overview(data, ACCOUNT) == {'overall': None}


class SiteDataTest(unittest.TestCase):

    def test_a_new_site_wants_both_reads(self):
        site = SiteData(ACCOUNT)

        assert [site.wants(key, T0) for key in (GOALS_KEY, OVERVIEW_KEY)] == [True, True]

    def test_a_missing_overview_keeps_the_stored_one(self):
        site = stored_site()

        site.store_overview(None)

        assert site.overview == {'overall': None}

    def test_a_battle_reads_both_again_after_a_delay(self):
        site = SiteData(ACCOUNT)
        site.done([GOALS_KEY, OVERVIEW_KEY])

        site.after_battle(T0)

        assert not site.wants(GOALS_KEY, T0 + REFRESH_AFTER_BATTLE_S - 1)
        assert site.wants(OVERVIEW_KEY, T0 + REFRESH_AFTER_BATTLE_S)

    def test_ingest_answer_expedites_a_stale_overview(self):
        site = SiteData(ACCOUNT)
        site.after_battle(T0)

        site.expedite(OVERVIEW_KEY)

        assert site.wants(OVERVIEW_KEY, T0)

    def test_reset_forgets_the_account_data(self):
        site = stored_site()
        site.goals = goals()

        site.reset(ACCOUNT + 1)

        assert (site.account_id, site.goals, site.overview) == (ACCOUNT + 1, [], None)


if __name__ == '__main__':
    unittest.main()
