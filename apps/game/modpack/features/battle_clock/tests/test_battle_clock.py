# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import time
import unittest

import _support
from otmetki.core.format import format_moment, format_timer
from otmetki.core.settings import Settings
from otmetki.features.battle_clock.i18n import STRINGS
from otmetki.features.battle_clock.model import clock_values, format_battle_clock, timer_seconds
from otmetki.features.battle_clock.model.preview import preview_text
from otmetki.features.battle_clock.settings import SCHEMA


def moment():
    return time.struct_time((2026, 9, 27, 21, 5, 9, 6, 270, 0))


def translator(language='ru'):
    return _support.translator(STRINGS, language)


def settings(values=None):
    return Settings(values, SCHEMA)


class TimerSecondsTest(unittest.TestCase):

    def test_the_battle_timer_truncates_the_seconds_left(self):
        assert timer_seconds('battle', 1000.0, 700.2) == 299

    def test_the_prebattle_countdown_is_timed(self):
        assert timer_seconds('prebattle', 1000.0, 990.0) == 10

    def test_a_timer_past_its_end_shows_zero(self):
        assert timer_seconds('battle', 1000.0, 1200.0) == 0

    def test_an_untimed_period_has_no_timer(self):
        assert timer_seconds('afterbattle', 1000.0, 900.0) is None

    def test_an_unknown_end_has_no_timer(self):
        assert timer_seconds('battle', None, 900.0) is None


class FormatTest(unittest.TestCase):

    def test_a_timer_reads_as_minutes_and_seconds(self):
        assert format_timer(300) == '05:00'

    def test_a_timer_under_a_minute_keeps_the_zero_minutes(self):
        assert format_timer(59) == '00:59'

    def test_no_timer_reads_as_nothing(self):
        assert format_timer(None) == ''

    def test_a_moment_is_formatted_by_its_pattern(self):
        assert format_moment('%H:%M', moment()) == '21:05'

    def test_an_empty_pattern_formats_nothing(self):
        assert format_moment('', moment()) == ''


class PanelTest(unittest.TestCase):

    def test_the_values_carry_the_time_date_timer_and_period(self):
        chosen = settings({'clock_format': '%H:%M:%S', 'date_format': '%d.%m'})

        values = clock_values(moment(), chosen, 'battle', 125)

        assert values == {'time': '21:05:09', 'date': '27.09', 'timer': '02:05', 'period': 'battle'}

    def test_the_timer_template_adds_the_battle_timer(self):
        chosen = settings({'clock_format': '%H:%M:%S', 'date_format': '%d.%m'})
        values = clock_values(moment(), chosen, 'battle', 125)

        text = format_battle_clock(values, chosen, translator())

        assert '27.09 21:05:09   бой 02:05' in text

    def test_without_a_timer_the_panel_shows_the_time(self):
        defaults = settings({})
        values = clock_values(moment(), defaults)

        text = format_battle_clock(values, defaults, translator('en'))

        assert '>21:05</font>' in text

    def test_a_switched_off_timer_is_empty(self):
        chosen = settings({'show_timer': False})

        values = clock_values(moment(), chosen, 'battle', 125)

        assert values['timer'] == ''

    def test_the_players_template_replaces_the_default(self):
        chosen = settings({'show_timer': False, 'template': '[{time}|{timer}]'})
        values = clock_values(moment(), chosen, 'battle', 125)

        text = format_battle_clock(values, chosen, translator())

        assert '[21:05|]' in text


class SettingsTest(unittest.TestCase):

    def test_an_unknown_clock_format_falls_back_to_the_default(self):
        assert settings({'clock_format': '%s rm -rf'}).get('clock_format') == '%H:%M'

    def test_a_listed_date_format_is_kept(self):
        assert settings({'date_format': '%Y-%m-%d'}).get('date_format') == '%Y-%m-%d'

    def test_both_languages_have_the_same_strings(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


class PreviewTest(unittest.TestCase):

    def test_the_preview_shows_the_current_time(self):
        assert '21:05' in preview_text(settings({}), translator(), moment())

    def test_the_preview_shows_a_sample_timer(self):
        assert '07:00' in preview_text(settings({}), translator(), moment())


if __name__ == '__main__':
    unittest.main()
