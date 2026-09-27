# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.core.i18n import Catalog, Translator
from otmetki.core.settings import Settings
from otmetki.features.sixth_sense.i18n import STRINGS
from otmetki.features.sixth_sense.model import SixthSense, format_sixth_sense
from otmetki.features.sixth_sense.settings import SCHEMA


def translator(language='ru'):
    return Translator(Catalog(STRINGS), language)


class LampTest(unittest.TestCase):

    def test_transitions(self):
        lamp = SixthSense()
        assert lamp.observed(True, 10.0) == 'show'
        assert lamp.observed(True, 11.0) is None
        assert lamp.elapsed(13.7) == 3
        assert lamp.observed(False, 14.0) == 'hide'
        assert lamp.observed(False, 15.0) is None
        assert lamp.elapsed(15.0) is None
        assert lamp.observed(True, 20.0) == 'show'
        assert lamp.count == 2
        lamp.reset()
        assert not lamp.lit

    def test_expiry(self):
        lamp = SixthSense()
        lamp.observed(True, 10.0)
        assert not lamp.expired(15.0, 0)
        assert not lamp.expired(15.0, 10)
        assert lamp.expired(20.0, 10)


class FormatTest(unittest.TestCase):

    def lit(self):
        lamp = SixthSense()
        lamp.observed(True, 100.0)
        return lamp

    def test_default_text_and_timer(self):
        text = format_sixth_sense(self.lit(), Settings({}, SCHEMA), translator(), 104.2)
        assert 'Вас засветили!' in text
        assert '4 с' in text

    def test_icon_replaces_default_text(self):
        settings = Settings({'icon': 'gui/maps/icons/otmetki/lamp.png', 'icon_size': 64, 'show_timer': False}, SCHEMA)
        text = format_sixth_sense(self.lit(), settings, translator('en'), 101.0)
        assert text == '<img src="img://gui/maps/icons/otmetki/lamp.png" width="64" height="64"/>'

    def test_settings_are_restricted(self):
        settings = Settings({'icon': '../"><script>', 'sound_event': 'bad event', 'color': 'red', 'hide_after_s': 600}, SCHEMA)
        assert settings.get('icon') == ''
        assert settings.get('sound_event') == ''
        assert settings.get('color') == '#F2B25B'
        assert settings.get('hide_after_s') == 60
        assert Settings({'sound_event': 'otmetki_lamp_01'}, SCHEMA).get('sound_event') == 'otmetki_lamp_01'

    def test_strings_in_sync(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
