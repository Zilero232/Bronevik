# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.tilt_guard.i18n import STRINGS
from otmetki.features.tilt_guard.model import TiltWatch, notice_text
from otmetki.features.tilt_guard.model.constants import NOTICES
from otmetki.features.tilt_guard.settings import SCHEMA, SETTINGS

STREAK_ONLY = {'session_battles': 0, 'damage_drop': False}
LONG_ONLY = {'loss_streak': 0, 'session_battles': 3, 'damage_drop': False}
DAMAGE_ONLY = {'loss_streak': 0, 'session_battles': 0}
SUMMARY = {'battles': 30, 'streak': 3, 'recent': 1000, 'earlier': 3000}


def battle(result, damage=2000, bonus_type=1):
    return {'bonus_type': bonus_type, 'result': result, 'stats': {'damage_dealt': damage}}


def settings(values):
    return Settings(values, SCHEMA)


def watch_after(results, values, idle_s=None):
    watch = TiltWatch() if idle_s is None else TiltWatch(idle_s=idle_s)
    for moment, result in enumerate(results):
        watch.add(battle(result), moment, settings(values))
    return watch


def watch_after_a_damage_drop():
    watch = TiltWatch()
    for step in range(5):
        watch.add(battle('win', 3000), step, settings(DAMAGE_ONLY))
    for step in range(4):
        watch.add(battle('win', 1000), 10 + step, settings(DAMAGE_ONLY))
    return watch


def translate():
    return _support.translator(STRINGS)


class LossStreakTest(unittest.TestCase):

    def test_two_losses_are_no_streak_yet(self):
        watch = watch_after(['loss'], STREAK_ONLY)

        assert watch.add(battle('loss'), 10, settings(STREAK_ONLY)) == []

    def test_the_third_loss_in_a_row_reminds(self):
        watch = watch_after(['loss', 'loss'], STREAK_ONLY)

        assert watch.add(battle('loss'), 20, settings(STREAK_ONLY)) == ['streak']

    def test_the_streak_reminds_only_once(self):
        watch = watch_after(['loss', 'loss', 'loss'], STREAK_ONLY)

        assert watch.add(battle('loss'), 30, settings(STREAK_ONLY)) == []

    def test_a_win_ends_the_streak_without_a_reminder(self):
        watch = watch_after(['loss', 'loss', 'loss', 'loss'], STREAK_ONLY)

        assert watch.add(battle('win'), 40, settings(STREAK_ONLY)) == []

    def test_a_new_streak_after_a_win_reminds_again(self):
        watch = watch_after(['loss', 'loss', 'loss', 'loss', 'win', 'loss', 'loss'], STREAK_ONLY)

        assert watch.add(battle('loss'), 50, settings(STREAK_ONLY)) == ['streak']

    def test_a_battle_of_another_type_does_not_remind(self):
        watch = watch_after(['loss', 'loss', 'loss'], STREAK_ONLY)

        assert watch.add(battle('loss', bonus_type=2), 60, settings(STREAK_ONLY)) == []

    def test_a_battle_of_another_type_leaves_the_streak(self):
        watch = watch_after(['loss', 'loss', 'loss'], STREAK_ONLY)

        watch.add(battle('loss', bonus_type=2), 60, settings(STREAK_ONLY))

        assert watch.streak == 3


class LongSessionTest(unittest.TestCase):

    def test_battles_under_the_limit_do_not_remind(self):
        watch = watch_after(['win'], LONG_ONLY, idle_s=100)

        assert watch.add(battle('win'), 1, settings(LONG_ONLY)) == []

    def test_the_battle_at_the_limit_reminds(self):
        watch = watch_after(['win', 'win'], LONG_ONLY, idle_s=100)

        assert watch.add(battle('win'), 2, settings(LONG_ONLY)) == ['long']

    def test_the_long_session_reminds_only_once(self):
        watch = watch_after(['win', 'win', 'win'], LONG_ONLY, idle_s=100)

        assert watch.add(battle('win'), 3, settings(LONG_ONLY)) == []

    def test_a_gap_starts_a_new_session(self):
        watch = watch_after(['win', 'win', 'win', 'win'], LONG_ONLY, idle_s=100)

        watch.add(battle('win'), 500, settings(LONG_ONLY))

        assert watch.summary()['battles'] == 1


class DamageDropTest(unittest.TestCase):

    def test_steady_damage_does_not_remind(self):
        watch = TiltWatch()
        for step in range(4):
            watch.add(battle('win', 3000), step, settings(DAMAGE_ONLY))

        assert watch.add(battle('win', 3000), 4, settings(DAMAGE_ONLY)) == []

    def test_a_clear_drop_reminds(self):
        watch = watch_after_a_damage_drop()

        assert watch.add(battle('draw', 1000), 20, settings(DAMAGE_ONLY)) == ['damage']

    def test_the_summary_compares_recent_and_earlier_damage(self):
        watch = watch_after_a_damage_drop()

        watch.add(battle('draw', 1000), 20, settings(DAMAGE_ONLY))

        assert watch.summary() == {'battles': 10, 'streak': 0, 'recent': 1000, 'earlier': 3000}

    def test_the_drop_reminds_only_once(self):
        watch = watch_after_a_damage_drop()
        watch.add(battle('draw', 1000), 20, settings(DAMAGE_ONLY))

        assert watch.add(battle('win', 500), 21, settings(DAMAGE_ONLY)) == []


class NoticeTextTest(unittest.TestCase):

    def test_the_streak_notice_names_the_losses(self):
        assert u'3 поражений подряд' in notice_text('streak', SUMMARY, translate())

    def test_the_damage_notice_names_the_recent_damage(self):
        assert u'(1000)' in notice_text('damage', SUMMARY, translate())

    def test_every_notice_has_a_text(self):
        for key in NOTICES:
            assert notice_text(key, SUMMARY, translate()), key

    def test_every_notice_has_an_english_string(self):
        for key in NOTICES:
            assert 'tilt_guard_' + key in STRINGS['en']


class SettingsTest(unittest.TestCase):

    def test_the_component_switch_is_hangar_tilt_guard(self):
        assert SETTINGS == ('hangar_tilt_guard',)

    def test_the_loss_streak_is_capped(self):
        assert settings({'loss_streak': 50}).get('loss_streak') == 10

    def test_both_languages_have_the_same_strings(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
