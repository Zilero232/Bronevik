# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import time
import unittest

import _support  # noqa: F401
from otmetki.core.i18n import Catalog, Translator
from otmetki.core.settings import Settings
from otmetki.features.battle_clock.i18n import STRINGS
from otmetki.features.battle_clock.model import clock_values, format_battle_clock, format_timer, strftime, timer_seconds
from otmetki.features.battle_clock.settings import SCHEMA


def moment():
    return time.struct_time((2026, 9, 27, 21, 5, 9, 6, 270, 0))


def translator(language='ru'):
    return Translator(Catalog(STRINGS), language)


class ClockTest(unittest.TestCase):

    def test_timer(self):
        assert timer_seconds('battle', 1000.0, 700.2) == 300
        assert timer_seconds('prebattle', 1000.0, 990.0) == 10
        assert timer_seconds('battle', 1000.0, 1200.0) == 0
        assert timer_seconds('afterbattle', 1000.0, 900.0) is None
        assert timer_seconds('battle', None, 900.0) is None
        assert format_timer(300) == '05:00'
        assert format_timer(59) == '00:59'
        assert format_timer(None) == ''

    def test_strftime(self):
        assert strftime('%H:%M', moment()) == '21:05'
        assert strftime('', moment()) == ''

    def test_panel(self):
        settings = Settings({'clock_format': '%H:%M:%S', 'date_format': '%d.%m'}, SCHEMA)
        values = clock_values(moment(), settings, 'battle', 125)
        assert values == {'time': '21:05:09', 'date': '27.09', 'timer': '02:05', 'period': 'battle'}
        text = format_battle_clock(values, settings, translator())
        assert '27.09 21:05:09   бой 02:05' in text
        plain = format_battle_clock(clock_values(moment(), Settings({}, SCHEMA)), Settings({}, SCHEMA), translator('en'))
        assert '>21:05</font>' in plain

    def test_timer_off_and_template(self):
        settings = Settings({'show_timer': False, 'template': '[{time}|{timer}]'}, SCHEMA)
        values = clock_values(moment(), settings, 'battle', 125)
        assert values['timer'] == ''
        assert '[21:05|]' in format_battle_clock(values, settings, translator())

    def test_formats_are_choices(self):
        settings = Settings({'clock_format': '%s rm -rf', 'date_format': '%Y-%m-%d'}, SCHEMA)
        assert settings.get('clock_format') == '%H:%M'
        assert settings.get('date_format') == '%Y-%m-%d'

    def test_strings_in_sync(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
