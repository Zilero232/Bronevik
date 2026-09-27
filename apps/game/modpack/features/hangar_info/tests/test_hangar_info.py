# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import time
import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.hangar_info.i18n import STRINGS
from otmetki.features.hangar_info.model import format_info, layout_of, ping_color, valid_ping
from otmetki.features.hangar_info.model.constants import PING_BAD_COLOR, PING_GOOD_COLOR
from otmetki.features.hangar_info.settings import SCHEMA, SETTINGS

NOW = time.mktime((2026, 9, 27, 18, 5, 9, 0, 0, -1))
INFO = {'server': 'RU4', 'ping': 42, 'online': '81 234', 'region_online': None}


def translator(language='ru'):
    return _support.translator(STRINGS, language)


class HangarInfoTest(unittest.TestCase):

    def test_default_panel(self):
        text = format_info(INFO, Settings({}, SCHEMA), translator(), NOW)
        assert '18:05:09' in text and '27.09.2026' in text
        assert 'RU4' in text and u'42 мс' in text and '81 234' in text
        assert PING_GOOD_COLOR in text

    def test_switches_and_missing_values(self):
        settings = Settings({'show_server': False, 'show_online': False, 'date_format': '', 'clock_format': '%H:%M'}, SCHEMA)
        text = format_info({'server': 'RU4', 'ping': -1}, settings, translator('en'), NOW)
        assert text.count('\n') == 0 and '18:05' in text and 'RU4' not in text and 'ms' not in text

    def test_template(self):
        settings = Settings({'template': '{time} {server} {ping} {{x}'}, SCHEMA)
        assert format_info(INFO, settings, translator('en'), NOW) == '18:05:09 RU4 42 ms {x}'

    def test_ping(self):
        assert valid_ping(-1) is None and valid_ping(None) is None and valid_ping(80.4) == 80
        assert ping_color(200) == PING_BAD_COLOR and ping_color(10) == PING_GOOD_COLOR

    def test_settings(self):
        settings = Settings({'clock_format': '%s', 'x': 99999, 'align_x': 'middle'}, SCHEMA)
        assert settings.get('clock_format') == '%H:%M:%S'
        assert layout_of(settings) == {'x': 4000, 'y': 60, 'alignX': 'right', 'alignY': 'top'}
        assert SETTINGS == ('hangar_info',)

    def test_strings_in_sync(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
