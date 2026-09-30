# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import os
import unittest

import _support
from otmetki.companion.binding import Credentials
from otmetki.core.me import device_body
from otmetki.core.settings import Settings
from otmetki.features.session_goals.i18n import STRINGS
from otmetki.features.session_goals.model import (
    Announced,
    damage_needed,
    format_battle,
    format_done,
    format_hangar,
    is_done,
    page_actions,
    parse_goals,
    progress,
)
from otmetki.features.session_goals.model.preview import preview_text
from otmetki.features.session_goals.settings import SCHEMA, SETTINGS

ACCOUNT = 12345678


def example():
    return _support.load_json(os.path.join(_support.CONTRACT_DIR, 'examples', 'goals.example.json'))


def translator(language='ru'):
    return _support.translator(STRINGS, language)


def goals():
    return parse_goals(example(), ACCOUNT)


def average_damage_goal():
    return goals()[0]


def moe_goal():
    return goals()[1]


def battles_goal():
    return goals()[2]


def settings(**values):
    return Settings(values, SCHEMA)


def malformed_goals():
    return [
        {'id': 'x', 'metric': 'fun', 'status': 'active', 'target': 1},
        {'id': 'y', 'metric': 'wn8', 'status': 'cancelled', 'target': 1},
        {'id': 'z', 'metric': 'wn8', 'status': 'active', 'target': 'a'},
        {'id': 7, 'metric': 'wn8', 'status': 'active', 'target': 1},
    ]


class ParseTest(unittest.TestCase):

    def test_contract(self):
        request = _support.schema_validator('goals.schema.json', 'deviceRequest')
        answer = _support.schema_validator('goals.schema.json', 'goals')
        if request is None:
            self.skipTest('jsonschema not installed')

        request.validate(device_body(Credentials('dev_goals', 's' * 40, ACCOUNT)))
        answer.validate(example())

    def test_parses_the_own_goals(self):
        parsed = goals()

        assert [goal['metric'] for goal in parsed] == ['avgDamage', 'moe', 'battles']
        assert parsed[1]['tank_id'] == 1
        assert parsed[0]['battles'] == 12

    def test_goals_of_another_account_are_dropped(self):
        assert parse_goals(example(), ACCOUNT + 1) == []

    def test_no_answer_means_no_goals(self):
        assert parse_goals(None, ACCOUNT) == []

    def test_drops_malformed_and_finished_goals(self):
        data = example()
        data['goals'].extend(malformed_goals())

        parsed = parse_goals(data, ACCOUNT)

        assert len(parsed) == 3


class ProgressTest(unittest.TestCase):

    def test_progress_is_the_share_between_baseline_and_target(self):
        assert round(progress(average_damage_goal()), 3) == 0.56

    def test_a_goal_below_its_target_is_not_done(self):
        assert not is_done(average_damage_goal())

    def test_an_achieved_goal_is_done_and_complete(self):
        goal = battles_goal()

        assert is_done(goal)
        assert progress(goal) == 1.0

    def test_no_progress_without_a_current_value(self):
        assert progress(dict(average_damage_goal(), current=None)) is None

    def test_an_active_goal_at_its_target_is_done(self):
        assert is_done(dict(moe_goal(), current=85.0))

    def test_damage_needed_keeps_the_average_on_target(self):
        assert damage_needed(average_damage_goal()) == 6115

    def test_no_damage_needed_once_the_battle_already_reaches_it(self):
        assert damage_needed(average_damage_goal(), 10 ** 6) == 0

    def test_only_an_average_damage_goal_needs_damage(self):
        assert damage_needed(moe_goal()) is None

    def test_the_first_battle_needs_the_target_itself(self):
        assert damage_needed(dict(average_damage_goal(), battles=0, current=0.0)) == 3000


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


class HangarTextTest(unittest.TestCase):

    def test_hangar_label(self):
        text = format_hangar(goals(), settings(), translator(), {1: u'T-34'})

        assert u'Цели' in text
        assert u'Ср. урон 3 000' in text
        assert u'2 740 (56%)' in text
        assert u'Отметка 85.00% на T-34' in text
        assert u'✓' in text

    def test_no_hangar_label_without_goals(self):
        assert format_hangar([], settings(), translator(), {}) is None

    def test_the_hangar_label_shows_up_to_max_goals(self):
        text = format_hangar(goals(), settings(max_goals=1), translator(), {})

        assert text.count('\n') == 1


class BattleTextTest(unittest.TestCase):

    def test_battle_line_for_the_goals_this_tank_moves(self):
        text = format_battle(goals(), 1, 1000, settings(), translator('en'))

        assert 'Avg damage 3 000: 5 115 damage needed this battle' in text
        assert 'MoE 85.00%: now 84.60%' in text
        assert 'Battles' not in text

    def test_a_goal_of_another_tank_is_left_out(self):
        text = format_battle(goals(), 2, 0, settings(), translator('en'))

        assert 'MoE' not in text

    def test_a_battle_that_reaches_the_average_says_so(self):
        text = format_battle(goals(), 2, 10 ** 6, settings(), translator('en'))

        assert 'already does it' in text


class PageTest(unittest.TestCase):

    def test_done_notice(self):
        notice = format_done(moe_goal(), translator(), u'T-34')

        assert notice == u'Три отметки: цель выполнена — Отметка 85.00% на T-34'

    def test_page_offers_refresh_and_the_site(self):
        actions = page_actions(translator())

        assert [action['id'] for action in actions] == ['refresh', 'site']

    def test_preview_shows_the_damage_needed(self):
        assert u'нужно' in preview_text(settings(), translator())

    def test_the_config_switch(self):
        assert SETTINGS == ('hangar_session_goals',)

    def test_both_languages_have_the_same_keys(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
