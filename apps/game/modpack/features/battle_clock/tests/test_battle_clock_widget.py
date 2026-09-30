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
    return time.strptime('2026-09-29 21:47:05', '%Y-%m-%d %H:%M:%S')


def widget_data(values, time_left=702):
    settings = Settings(values, SCHEMA)
    return clock_widget(clock_values(moment(), settings, 'battle', time_left), settings)['data']


class ClockWidgetTest(unittest.TestCase):

    def test_the_widget_carries_the_local_time_and_the_timer(self):
        data = widget_data({'date_format': '%d.%m'})

        assert data == {'time': '21:47', 'date': '29.09', 'timer': '11:42', 'big_timer': False, 'icon': 'otmetki:clock'}

    def test_a_switched_off_timer_is_empty_even_when_it_replaces_the_stock_one(self):
        data = widget_data({'replace_timer': True, 'show_timer': False})

        assert data['timer'] == ''

    def test_the_preview_is_a_fixture_for_the_page(self):
        assert _support.widget_fixture('battle_clock', preview_widget(Settings({}, SCHEMA), moment()))


if __name__ == '__main__':
    unittest.main()
