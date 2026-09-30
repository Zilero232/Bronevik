from __future__ import absolute_import, division, print_function, unicode_literals

import io
import json
import os
import unittest

import _support
from otmetki.core.native_settings import merge_value
from otmetki.core.settings import Settings
from otmetki.features.crosshair.i18n import STRINGS
from otmetki.features.crosshair.model import mark_html, mark_image, mark_offset, shows_in, to_native
from otmetki.features.crosshair.model.constants import MARK_COLORS, MARK_FILES, MARK_RENDITIONS, PRESET_PARTS
from otmetki.features.crosshair.model.preview import preview_text
from otmetki.features.crosshair.settings import SCHEMA, SETTINGS
from otmetki.features.crosshair.settings.constants import MARKS

ASSETS_DIR = os.path.join(_support.MODPACK_DIR, 'assets')

# The parts of the game's own "Reticle" settings tab, RU 1.45 client source (options.AimSetting): an opacity 0-100,
# or a style index below the number of styles the settings window offers (AimSetting.VIRTUAL_OPTIONS).
OPACITY_PARTS = (
    'net',
    'centralTag',
    'mixing',
    'gunTag',
    'reloader',
    'reloaderTimer',
    'condition',
    'cassette',
    'zoomIndicator',
)
STYLE_COUNTS = {'netType': 4, 'centralTagType': 14, 'mixingType': 4, 'gunTagType': 15}


def shipped_images():
    with io.open(os.path.join(ASSETS_DIR, 'assets.json'), encoding='utf-8') as handle:
        sets = json.load(handle)['sets']
    paths = set()
    for item in sets:
        folder = os.path.join(ASSETS_DIR, *item['files'].split('/'))
        client_folder = item['target'][len('res/'):]
        for name in os.listdir(folder):
            paths.add(client_folder + '/' + name)
    return paths


def native(values):
    return to_native(Settings(values, SCHEMA).to_dict())


def is_valid_part_value(part, value):
    if part in OPACITY_PARTS:
        return 0 <= value <= 100
    if part in STYLE_COUNTS:
        return 0 <= value < STYLE_COUNTS[part]
    return False


class PresetTest(unittest.TestCase):

    def test_defaults_change_nothing(self):
        assert native(None) == {}

    def test_the_component_switch_is_crosshair_presets(self):
        assert SETTINGS == ('crosshair_presets',)

    def test_a_preset_for_both_modes_sets_both_reticles(self):
        result = native({'preset': 'minimal'})

        assert sorted(result) == ['arcade', 'sniper']
        assert result['arcade'] == PRESET_PARTS['minimal']

    def test_a_sniper_only_preset_sets_the_sniper_reticle_and_the_server_reticle(self):
        result = native({'preset': 'clean', 'modes': 'sniper', 'server_reticle': 'on'})

        assert sorted(result) == ['sniper', 'useServerAim']
        assert result['useServerAim'] is True

    def test_presets_only_set_reticle_parts_within_the_game_ranges(self):
        for name, parts in PRESET_PARTS.items():
            for part, value in parts.items():
                assert is_valid_part_value(part, value), (name, part, value)

    def test_a_preset_keeps_the_players_other_parts(self):
        current = {'net': 50, 'netType': 2, 'centralTag': 100, 'custom': 7}

        merged = merge_value(current, PRESET_PARTS['clean'])

        assert merged['netType'] == 2
        assert merged['custom'] == 7
        assert merged['net'] == 0

    def test_a_plain_value_replaces_the_players_value(self):
        assert merge_value(True, False) is False


class CentreMarkImageTest(unittest.TestCase):

    def test_the_mark_choices_are_the_shipped_marks_and_none(self):
        assert set(MARKS) == set(MARK_FILES) | set(['none'])

    def test_every_mark_ships_in_every_rendition_and_colour(self):
        shipped = shipped_images()

        for mark in MARK_FILES:
            for size in MARK_RENDITIONS:
                for color in MARK_COLORS:
                    assert mark_image(mark, size, color) in shipped, (mark, size, color)

    def test_a_one_colour_mark_comes_in_the_chosen_colour(self):
        assert mark_image('tint_ring', 48, 'green').endswith('/tinted/tint_ring_green_64.png')

    def test_an_unknown_colour_falls_back_to_white(self):
        assert mark_image('tint_ring', 48, 'bogus').endswith('/tinted/tint_ring_white_64.png')

    def test_a_full_colour_mark_ignores_the_colour(self):
        assert mark_image('ring', 48, 'green').endswith('/otmetki/ring_64.png')

    def test_the_settings_reject_an_unknown_colour(self):
        assert Settings({'mark_color': 'purple'}, SCHEMA).get('mark_color') == 'white'

    def test_the_image_is_the_smallest_rendition_not_below_the_size(self):
        assert mark_image('dot', 48).endswith('/otmetki/dot_64.png')
        assert mark_image('kenney_scope', 100).endswith('/kenney/crosshair-196_128.png')

    def test_a_size_above_every_rendition_takes_the_largest(self):
        assert mark_image('dot', 200).endswith('_128.png')

    def test_no_mark_has_no_image(self):
        assert mark_image('none', 48) is None

    def test_no_mark_has_no_html(self):
        assert mark_html('none', 48) == ''

    def test_the_html_is_an_image_at_the_chosen_size(self):
        html = mark_html('ring', 32)

        assert html == '<img src="img://gui/maps/icons/otmetki/crosshair/otmetki/ring_64.png" width="32" height="32"/>'


class CentreMarkReticleTest(unittest.TestCase):

    def test_a_mark_hides_the_game_centre_of_its_reticles(self):
        assert native({'mark': 'cross', 'modes': 'sniper'}) == {'sniper': {'centralTag': 0}}

    def test_a_mark_keeps_the_game_centre_when_not_asked_to_hide_it(self):
        result = native({'mark': 'cross', 'preset': 'contrast', 'mark_hides_centre': False})

        assert result['arcade'] == PRESET_PARTS['contrast']

    def test_hiding_the_centre_overrides_the_preset(self):
        result = native({'mark': 'dot', 'preset': 'classic'})

        assert result['arcade']['centralTag'] == 0

    def test_the_mark_follows_the_reticle_plus_the_players_offset(self):
        settings = Settings({'x': 2, 'y': -3}, SCHEMA)

        assert mark_offset((960, 400), (1920, 1080), 1.0, settings) == (2, -143)

    def test_the_screen_centre_is_divided_by_the_interface_scale(self):
        assert mark_offset((640, 360), (1920, 1080), 1.5, Settings({}, SCHEMA)) == (0, 0)

    def test_both_modes_show_in_arcade(self):
        assert shows_in('both', True, False)

    def test_sniper_mode_shows_in_sniper(self):
        assert shows_in('sniper', False, True)

    def test_sniper_mode_hides_in_arcade(self):
        assert not shows_in('sniper', True, False)

    def test_nothing_shows_outside_arcade_and_sniper(self):
        assert not shows_in('both', False, False)


class CentreMarkSettingsTest(unittest.TestCase):

    def test_an_unknown_mark_falls_back_to_none(self):
        assert Settings({'mark': 'laser'}, SCHEMA).get('mark') == 'none'

    def test_the_mark_size_is_capped(self):
        assert Settings({'mark_size': 999}, SCHEMA).get('mark_size') == 128

    def test_the_mark_is_centred_and_not_dragged(self):
        settings = Settings(None, SCHEMA)

        assert settings.get('drag') is False
        assert settings.get('align_x') == 'center'

    def test_both_languages_have_the_same_strings(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])

    def test_every_mark_has_a_label(self):
        for mark in MARKS:
            assert 'crosshair_mark_' + mark in STRINGS['ru']

    def test_the_preview_is_the_mark_image(self):
        text = preview_text(Settings({'mark': 'triad'}, SCHEMA), None)

        assert text.startswith('<img src="img://')

    def test_the_preview_uses_the_chosen_colour_and_rendition(self):
        settings = Settings({'mark': 'tint_brackets', 'mark_size': 100, 'mark_color': 'red'}, SCHEMA)

        assert 'tint_brackets_red_128.png' in preview_text(settings, None)


if __name__ == '__main__':
    unittest.main()
