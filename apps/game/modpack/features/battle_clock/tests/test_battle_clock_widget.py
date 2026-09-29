# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import time
import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.battle_clock.model import clock_values
from otmetki.features.battle_clock.model.preview import preview_widget
from otmetki.features.battle_clock.model.widget import clock_widget
from otmetki.features.battle_clock.settings import SCHEMA



def moment():
    return time.strptime("2026-09-29 21:47:05", "%Y-%m-%d %H:%M:%S")


class ClockWidgetTest(unittest.TestCase):

    def test_local_time_and_the_timer(self):
        settings = Settings({'date_format': '%d.%m'}, SCHEMA)
        data = clock_widget(clock_values(moment(), settings, 'battle', 702), settings)['data']
        assert data == {'time': '21:47', 'date': '29.09', 'timer': '11:42', 'big_timer': False, 'icon': 'otmetki:clock'}
        replaced = Settings({'replace_timer': True, 'show_timer': False}, SCHEMA)
        assert clock_widget(clock_values(moment(), replaced, 'battle', 702), replaced)['data']['timer'] == ''

    def test_fixture_for_the_page(self):
        assert _support.widget_fixture('battle_clock', preview_widget(Settings({}, SCHEMA), moment()))


if __name__ == '__main__':
    unittest.main()
