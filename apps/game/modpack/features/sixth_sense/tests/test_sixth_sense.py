# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import io
import json
import os
import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.sixth_sense.i18n import STRINGS
from otmetki.features.sixth_sense.model import SixthSense, format_sixth_sense, icon_path, to_native
from otmetki.features.sixth_sense.settings.constants import ICON_SETS
from otmetki.features.sixth_sense.model.preview import preview_text
from otmetki.features.sixth_sense.settings import SCHEMA


ASSETS_DIR = os.path.join(_support.MODPACK_DIR, 'assets')


def shipped_files():
    with io.open(os.path.join(ASSETS_DIR, 'assets.json'), encoding='utf-8') as handle:
        sets = json.load(handle)['sets']
    paths = set()
    for item in sets:
        for name in os.listdir(os.path.join(ASSETS_DIR, *item['files'].split('/'))):
            paths.add(item['target'][len('res/'):] + '/' + name)
    return paths


def translator(language='ru'):
    return _support.translator(STRINGS, language)


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
        text = format_sixth_sense(self.lit(), Settings({'icon_set': 'custom'}, SCHEMA), translator(), 104.2)
        assert 'Вас засветили!' in text
        assert '4 с' in text

    def test_icon_replaces_default_text(self):
        settings = Settings({'icon_set': 'custom', 'icon': 'gui/maps/icons/otmetki/lamp.png', 'icon_size': 64, 'show_timer': False}, SCHEMA)
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

    def test_shipped_icon_by_default_and_its_pulse(self):
        settings = Settings({'show_timer': False}, SCHEMA)
        lamp = self.lit()
        bright = format_sixth_sense(lamp, settings, translator(), 100.2)
        assert bright == '<img src="img://gui/maps/icons/otmetki/sixth_sense/icons/lamp_64.png" width="64" height="64"/>'
        assert 'lamp_dim_64.png' in format_sixth_sense(lamp, settings, translator(), 100.7)
        assert 'lamp_64.png' in format_sixth_sense(lamp, settings, translator(), 101.1)
        steady = Settings({'pulse': False, 'icon_size': 100}, SCHEMA)
        assert icon_path(steady, True).endswith('/lamp_128.png')

    def test_every_icon_ships_with_its_dimmed_frame(self):
        shipped = shipped_files()
        for icon_set in ICON_SETS[1:]:
            for size in (32, 100):
                for dimmed in (False, True):
                    path = icon_path(Settings({'icon_set': icon_set, 'icon_size': size}, SCHEMA), dimmed)
                    assert path in shipped, path
        assert 'audioww/sixthSense.mp3' in shipped and 'audioww/sixthSense_off.mp3' in shipped

    def test_lamp_sound_is_the_game_setting(self):
        assert to_native(Settings({}, SCHEMA).to_dict()) == {}
        assert to_native(Settings({'lamp_sound': 'otmetki'}, SCHEMA).to_dict()) == {'bulbVoices': 2}
        assert to_native(Settings({'lamp_sound': 'lightbulb'}, SCHEMA).to_dict()) == {'bulbVoices': 0}
        for value in ICON_SETS:
            assert 'sixth_sense_icon_set_' + value in STRINGS['en']

    def test_preview(self):
        assert preview_text(Settings({}, SCHEMA), translator('en'))


if __name__ == '__main__':
    unittest.main()
