# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.tilt_guard.i18n import STRINGS
from otmetki.features.tilt_guard.model import TiltWatch, notice_text
from otmetki.features.tilt_guard.settings import SCHEMA, SETTINGS


def battle(result, damage=2000, bonus_type=1):
    return {'bonus_type': bonus_type, 'result': result, 'stats': {'damage_dealt': damage}}


class TiltWatchTest(unittest.TestCase):

    def test_a_losing_streak_reminds_once_until_a_win(self):
        watch = TiltWatch()
        settings = Settings({'session_battles': 0, 'damage_drop': False}, SCHEMA)
        assert watch.add(battle('loss'), 0, settings) == [] and watch.add(battle('loss'), 10, settings) == []
        assert watch.add(battle('loss'), 20, settings) == ['streak']
        assert watch.add(battle('loss'), 30, settings) == []
        assert watch.add(battle('win'), 40, settings) == []
        for step in range(3):
            notices = watch.add(battle('loss'), 50 + step, settings)
        assert notices == ['streak']
        assert watch.add(battle('loss', bonus_type=2), 60, settings) == [] and watch.streak == 3

    def test_a_long_session_and_a_new_one_after_a_gap(self):
        watch = TiltWatch(idle_s=100)
        settings = Settings({'loss_streak': 0, 'session_battles': 3, 'damage_drop': False}, SCHEMA)
        assert [watch.add(battle('win'), step, settings) for step in range(3)] == [[], [], ['long']]
        assert watch.add(battle('win'), 3, settings) == []
        assert watch.add(battle('win'), 500, settings) == [] and watch.summary()['battles'] == 1

    def test_a_damage_drop(self):
        watch = TiltWatch()
        settings = Settings({'loss_streak': 0, 'session_battles': 0}, SCHEMA)
        for step in range(5):
            assert watch.add(battle('win', 3000), step, settings) == []
        for step in range(4):
            watch.add(battle('win', 1000), 10 + step, settings)
        assert watch.add(battle('draw', 1000), 20, settings) == ['damage']
        assert watch.summary() == {'battles': 10, 'streak': 0, 'recent': 1000, 'earlier': 3000}
        assert watch.add(battle('win', 500), 21, settings) == []

    def test_texts_settings_and_strings(self):
        summary = {'battles': 30, 'streak': 3, 'recent': 1000, 'earlier': 3000}
        translate = _support.translator(STRINGS)
        assert u'3 поражений подряд' in notice_text('streak', summary, translate)
        assert u'(1000)' in notice_text('damage', summary, translate)
        assert SETTINGS == ('hangar_tilt_guard',)
        assert Settings({'loss_streak': 50}, SCHEMA).get('loss_streak') == 10
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
