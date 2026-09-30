# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import io
import itertools
import json
import os
import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.sixth_sense.i18n import STRINGS
from otmetki.features.sixth_sense.model import SixthSense, format_sixth_sense, icon_path, to_native
from otmetki.features.sixth_sense.model.constants import TICK_SOUND
from otmetki.features.sixth_sense.model.preview import preview_text
from otmetki.features.sixth_sense.settings import SCHEMA
from otmetki.features.sixth_sense.settings.constants import ICON_SETS

ASSETS_DIR = os.path.join(_support.MODPACK_DIR, 'assets')
SHIPPED_ICON_SETS = ICON_SETS[1:]
LAMP_64 = '<img src="img://gui/maps/icons/otmetki/sixth_sense/icons/lamp_64.png" width="64" height="64"/>'


def shipped_files():
    with io.open(os.path.join(ASSETS_DIR, 'assets.json'), encoding='utf-8') as handle:
        sets = json.load(handle)['sets']

    paths = set()
    for item in sets:
        target = item['target'][len('res/'):]
        for name in os.listdir(os.path.join(ASSETS_DIR, *item['files'].split('/'))):
            paths.add(target + '/' + name)
    return paths


def translator(language='ru'):
    return _support.translator(STRINGS, language)


def settings_with(**values):
    return Settings(values, SCHEMA)


def lamp_lit_at(moment):
    lamp = SixthSense()
    lamp.observed(True, moment)
    return lamp


def lamp_put_out():
    lamp = lamp_lit_at(10.0)
    lamp.observed(False, 14.0)
    return lamp


class LampTest(unittest.TestCase):

    def test_detection_lights_the_lamp(self):
        lamp = SixthSense()

        change = lamp.observed(True, 10.0)

        assert change == 'show'

    def test_a_repeated_detection_changes_nothing(self):
        lamp = lamp_lit_at(10.0)

        change = lamp.observed(True, 11.0)

        assert change is None

    def test_elapsed_counts_whole_seconds_since_the_detection(self):
        lamp = lamp_lit_at(10.0)

        elapsed = lamp.elapsed(13.7)

        assert elapsed == 3

    def test_losing_the_detection_hides_the_lamp(self):
        lamp = lamp_lit_at(10.0)

        change = lamp.observed(False, 14.0)

        assert change == 'hide'

    def test_losing_the_detection_again_changes_nothing(self):
        lamp = lamp_put_out()

        change = lamp.observed(False, 15.0)

        assert change is None

    def test_a_lamp_that_is_out_has_no_elapsed_time(self):
        lamp = lamp_put_out()

        elapsed = lamp.elapsed(15.0)

        assert elapsed is None

    def test_a_new_detection_lights_the_lamp_again(self):
        lamp = lamp_put_out()

        change = lamp.observed(True, 20.0)

        assert change == 'show'

    def test_reset_puts_the_lamp_out(self):
        lamp = lamp_lit_at(20.0)

        lamp.reset()

        assert not lamp.lit


class ExpiryTest(unittest.TestCase):

    def test_no_own_time_never_expires(self):
        lamp = lamp_lit_at(10.0)

        is_expired = lamp.expired(15.0, 0)

        assert not is_expired

    def test_the_lamp_stays_before_the_own_time(self):
        lamp = lamp_lit_at(10.0)

        is_expired = lamp.expired(15.0, 10)

        assert not is_expired

    def test_the_lamp_expires_at_the_own_time(self):
        lamp = lamp_lit_at(10.0)

        is_expired = lamp.expired(20.0, 10)

        assert is_expired


class FormatTest(unittest.TestCase):

    def test_without_an_icon_the_default_text_shows(self):
        settings = settings_with(icon_set='custom')

        text = format_sixth_sense(lamp_lit_at(100.0), settings, translator(), 104.2)

        assert 'Вас засветили!' in text

    def test_the_timer_shows_the_seconds_since_the_detection(self):
        settings = settings_with(icon_set='custom')

        text = format_sixth_sense(lamp_lit_at(100.0), settings, translator(), 104.2)

        assert '4 с' in text

    def test_a_custom_icon_replaces_the_default_text(self):
        settings = settings_with(
            icon_set='custom',
            icon='gui/maps/icons/otmetki/lamp.png',
            icon_size=64,
            show_timer=False,
        )

        text = format_sixth_sense(lamp_lit_at(100.0), settings, translator('en'), 101.0)

        assert text == '<img src="img://gui/maps/icons/otmetki/lamp.png" width="64" height="64"/>'

    def test_the_shipped_lamp_is_the_default_icon(self):
        settings = settings_with(show_timer=False)

        text = format_sixth_sense(lamp_lit_at(100.0), settings, translator(), 100.2)

        assert text == LAMP_64

    def test_the_second_half_second_shows_the_dimmed_frame(self):
        settings = settings_with(show_timer=False)

        text = format_sixth_sense(lamp_lit_at(100.0), settings, translator(), 100.7)

        assert 'lamp_dim_64.png' in text

    def test_the_next_second_shows_the_bright_frame_again(self):
        settings = settings_with(show_timer=False)

        text = format_sixth_sense(lamp_lit_at(100.0), settings, translator(), 101.1)

        assert 'lamp_64.png' in text

    def test_without_the_pulse_the_icon_never_dims_and_picks_the_larger_rendition(self):
        settings = settings_with(pulse=False, icon_size=100)

        path = icon_path(settings, True)

        assert path == 'gui/maps/icons/otmetki/sixth_sense/icons/lamp_128.png'

    def test_preview_draws_something(self):
        text = preview_text(settings_with(), translator('en'))

        assert text


class SettingsTest(unittest.TestCase):

    def test_an_unsafe_icon_path_is_dropped(self):
        settings = settings_with(icon='../"><script>')

        assert settings.get('icon') == ''

    def test_an_invalid_sound_event_is_dropped(self):
        settings = settings_with(sound_event='bad event')

        assert settings.get('sound_event') == ''

    def test_a_valid_sound_event_is_kept(self):
        settings = settings_with(sound_event='otmetki_lamp_01')

        assert settings.get('sound_event') == 'otmetki_lamp_01'

    def test_an_invalid_color_falls_back_to_the_default(self):
        settings = settings_with(color='red')

        assert settings.get('color') == '#F2B25B'

    def test_the_own_time_is_capped_at_a_minute(self):
        settings = settings_with(hide_after_s=600)

        assert settings.get('hide_after_s') == 60

    def test_the_tick_sound_is_off_by_default(self):
        settings = settings_with()

        assert settings.get('tick_sound') is False


class LampSoundTest(unittest.TestCase):

    def test_the_game_keeps_its_own_sound_by_default(self):
        native = to_native(settings_with().to_dict())

        assert native == {}

    def test_the_otmetki_chime_is_the_game_user_sound(self):
        native = to_native(settings_with(lamp_sound='otmetki').to_dict())

        assert native == {'bulbVoices': 2}

    def test_the_first_game_lamp_is_its_first_sound(self):
        native = to_native(settings_with(lamp_sound='lightbulb').to_dict())

        assert native == {'bulbVoices': 0}


class StringsTest(unittest.TestCase):

    def test_both_languages_have_the_same_keys(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])

    def test_every_icon_set_has_a_label(self):
        for value in ICON_SETS:
            assert 'sixth_sense_icon_set_' + value in STRINGS['en'], value


class ShippedAssetsTest(unittest.TestCase):

    def test_every_icon_ships_with_its_dimmed_frame(self):
        shipped = shipped_files()

        for icon_set, size, dimmed in itertools.product(SHIPPED_ICON_SETS, (32, 100), (False, True)):
            path = icon_path(settings_with(icon_set=icon_set, icon_size=size), dimmed)
            assert path in shipped, path

    def test_the_lamp_sound_ships(self):
        shipped = shipped_files()

        assert 'audioww/sixthSense.mp3' in shipped

    def test_the_lamp_off_sound_ships(self):
        shipped = shipped_files()

        assert 'audioww/sixthSense_off.mp3' in shipped

    def test_the_countdown_tick_ships(self):
        shipped = shipped_files()

        assert 'audioww/' + TICK_SOUND + '.mp3' in shipped


if __name__ == '__main__':
    unittest.main()
