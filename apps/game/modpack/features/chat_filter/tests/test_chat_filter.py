# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import time
import unittest

import _support  # noqa: F401
from otmetki.core.settings import Settings
from otmetki.features.chat_filter.i18n import STRINGS
from otmetki.features.chat_filter.model import ChatFilter, normalize, parse_words, stamp
from otmetki.features.chat_filter.settings import SCHEMA, SETTINGS


def chat(**values):
    return ChatFilter(Settings(values, SCHEMA))


class ChatFilterTest(unittest.TestCase):

    def test_duplicates(self):
        filter_ = chat(rate_limit=0)
        assert filter_.allow_message('a', u'Все на базу!', 0.0)
        assert not filter_.allow_message('a', u'<font>все  на базу!</font>', 10.0)
        assert filter_.allow_message('b', u'все на базу!', 10.0)
        assert filter_.allow_message('a', u'все на базу!', 45.0)
        assert filter_.hidden == 1

    def test_rate_limit(self):
        filter_ = chat(rate_limit=2, rate_window_s=10, filter_duplicates=False)
        assert filter_.allow_message('a', '1', 0.0)
        assert filter_.allow_message('a', '2', 1.0)
        assert not filter_.allow_message('a', '3', 2.0)
        assert filter_.allow_message('a', '4', 30.0)

    def test_words(self):
        filter_ = chat(block_words=u'нуб, Рак ;бот')
        assert parse_words(u'нуб, Рак ;бот') == (u'нуб', u'рак', u'бот')
        assert not filter_.allow_message('a', u'Ты РАК', 0.0)
        assert filter_.allow_message('a', u'go A', 1.0)

    def test_commands(self):
        filter_ = chat(rate_limit=1, rate_window_s=10)
        assert filter_.allow_command('a', 0.0)
        assert not filter_.allow_command('a', 1.0)
        assert chat(rate_limit=1, filter_commands=False).allow_command('a', 1.0)

    def test_stamp(self):
        now = time.mktime((2026, 9, 27, 18, 5, 9, 0, 0, -1))
        assert stamp('hi', '%H:%M', now).endswith(' hi') and '[18:05]' in stamp('hi', '%H:%M', now)
        assert stamp('hi', '', now) == 'hi'

    def test_settings(self):
        settings = Settings({'rate_limit': 99, 'timestamp_format': '%s'}, SCHEMA)
        assert settings.get('rate_limit') == 20 and settings.get('timestamp_format') == '%H:%M:%S'
        assert normalize(None) == '' and SETTINGS == ('battle_chat_filter',)
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
