# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import os
import unittest

import _support
from otmetki.companion.binding import Credentials
from otmetki.core.me import device_body
from otmetki.core.settings import Settings
from otmetki.features.session_goals.i18n import STRINGS
from otmetki.features.session_goals.model import (Announced, damage_needed, format_battle, format_done, format_hangar, is_done, page_actions,
                                                  parse_goals, progress)
from otmetki.features.session_goals.model.preview import preview_text
from otmetki.features.session_goals.settings import SCHEMA, SETTINGS

ACCOUNT = 12345678


def example():
    return _support.load_json(os.path.join(_support.CONTRACT_DIR, 'examples', 'goals.example.json'))


def translator(language='ru'):
    return _support.translator(STRINGS, language)


def goals():
    return parse_goals(example(), ACCOUNT)


class ParseTest(unittest.TestCase):

    def test_contract(self):
        request = _support.schema_validator('goals.schema.json', 'deviceRequest')
        answer = _support.schema_validator('goals.schema.json', 'goals')
        if request is None:
            self.skipTest('jsonschema not installed')
        request.validate(device_body(Credentials('dev_goals', 's' * 40, ACCOUNT)))
        answer.validate(example())

    def test_parses_own_goals_only(self):
        parsed = goals()
        assert [goal['metric'] for goal in parsed] == ['avgDamage', 'moe', 'battles']
        assert parsed[1]['tank_id'] == 1 and parsed[0]['battles'] == 12
        assert parse_goals(example(), ACCOUNT + 1) == [] and parse_goals(None, ACCOUNT) == []

    def test_drops_malformed_and_finished_goals(self):
        data = example()
        data['goals'].append({'id': 'x', 'metric': 'fun', 'status': 'active', 'target': 1})
        data['goals'].append({'id': 'y', 'metric': 'wn8', 'status': 'cancelled', 'target': 1})
        data['goals'].append({'id': 'z', 'metric': 'wn8', 'status': 'active', 'target': 'a'})
        data['goals'].append({'id': 7, 'metric': 'wn8', 'status': 'active', 'target': 1})
        assert len(parse_goals(data, ACCOUNT)) == 3


class ProgressTest(unittest.TestCase):

    def test_progress_and_done(self):
        avg, moe, battles = goals()
        assert round(progress(avg), 3) == round((2740.4 - 2410) / (3000 - 2410), 3)
        assert not is_done(avg) and is_done(battles) and progress(battles) == 1.0
        assert progress(dict(avg, current=None)) is None
        assert is_done(dict(moe, current=85.0))

    def test_damage_needed_for_the_average(self):
        avg = goals()[0]
        assert damage_needed(avg) == int(round(3000 * 13 - 2740.4 * 12))
        assert damage_needed(avg, 10 ** 6) == 0
        assert damage_needed(goals()[1]) is None
        assert damage_needed(dict(avg, battles=0, current=0.0)) == 3000

    def test_announces_each_goal_once_after_the_first_read(self):
        announced = Announced()
        assert announced.newly_done(goals()) == []
        done = dict(goals()[0], current=3100.0)
        assert [goal['id'] for goal in announced.newly_done([done])] == [done['id']]
        assert announced.newly_done([done]) == []
        again = Announced(announced.to_list())
        assert again.newly_done([dict(goals()[1], current=90.0)])


class FormatTest(unittest.TestCase):

    def test_hangar_label(self):
        text = format_hangar(goals(), Settings({}, SCHEMA), translator(), {1: u'T-34'})
        assert u'Цели' in text and u'Ср. урон 3 000' in text and u'2 740 (56%)' in text
        assert u'Отметка 85.00% на T-34' in text and u'✓' in text
        assert format_hangar([], Settings({}, SCHEMA), translator(), {}) is None
        assert format_hangar(goals(), Settings({'max_goals': 1}, SCHEMA), translator(), {}).count('\n') == 1

    def test_battle_line_only_for_goals_this_battle_moves(self):
        settings = Settings({}, SCHEMA)
        text = format_battle(goals(), 1, 1000, settings, translator('en'))
        need = int(round(3000 * 13 - 2740.4 * 12)) - 1000
        assert 'Avg damage 3 000: %s damage needed this battle' % u'{:,}'.format(need).replace(',', ' ') in text
        assert 'MoE 85.00%: now 84.60%' in text and 'Battles' not in text
        assert 'MoE' not in format_battle(goals(), 2, 0, settings, translator('en'))
        assert 'already does it' in format_battle(goals(), 2, 10 ** 6, settings, translator('en'))

    def test_notice_actions_preview_and_strings(self):
        assert format_done(goals()[1], translator(), u'T-34') == u'Три отметки: цель выполнена — Отметка 85.00% на T-34'
        assert [action['id'] for action in page_actions(translator())] == ['refresh', 'site']
        assert u'нужно' in preview_text(Settings({}, SCHEMA), translator())
        assert SETTINGS == ('hangar_session_goals',)
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
