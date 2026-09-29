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
from otmetki.features.crosshair.model.constants import (MARK_COLORS, MARK_FILES, MARK_RENDITIONS, OPACITY_PARTS, PRESET_PARTS, RETICLE_PARTS,
                                                        STYLE_COUNTS, STYLE_PARTS)
from otmetki.features.crosshair.model.preview import preview_text
from otmetki.features.crosshair.settings import SCHEMA, SETTINGS
from otmetki.features.crosshair.settings.constants import MARKS

ASSETS_DIR = os.path.join(_support.MODPACK_DIR, 'assets')


def shipped_images():
    with io.open(os.path.join(ASSETS_DIR, 'assets.json'), encoding='utf-8') as handle:
        sets = json.load(handle)['sets']
    paths = set()
    for item in sets:
        for name in os.listdir(os.path.join(ASSETS_DIR, *item['files'].split('/'))):
            paths.add(item['target'][len('res/'):] + '/' + name)
    return paths


class CrosshairTest(unittest.TestCase):

    def test_defaults_change_nothing(self):
        assert to_native(Settings(None, SCHEMA).to_dict()) == {}
        assert SETTINGS == ('crosshair_presets',)

    def test_preset_per_mode(self):
        both = to_native(Settings({'preset': 'minimal'}, SCHEMA).to_dict())
        assert sorted(both) == ['arcade', 'sniper'] and both['arcade'] == PRESET_PARTS['minimal']
        sniper = to_native(Settings({'preset': 'clean', 'modes': 'sniper', 'server_reticle': 'on'}, SCHEMA).to_dict())
        assert sorted(sniper) == ['sniper', 'useServerAim'] and sniper['useServerAim'] is True

    def test_presets_only_touch_the_reticle_parts_of_the_game_settings(self):
        for name, parts in PRESET_PARTS.items():
            assert set(parts) <= set(RETICLE_PARTS), name
            for part, value in parts.items():
                if part in OPACITY_PARTS:
                    assert 0 <= value <= 100, (name, part)
                else:
                    assert part in STYLE_PARTS and 0 <= value < STYLE_COUNTS[part], (name, part)

    def test_a_preset_keeps_the_players_other_parts(self):
        current = {'net': 50, 'netType': 2, 'centralTag': 100, 'custom': 7}
        merged = merge_value(current, PRESET_PARTS['clean'])
        assert merged['netType'] == 2 and merged['custom'] == 7 and merged['net'] == 0
        assert merge_value(True, False) is False



class CentreMarkTest(unittest.TestCase):

    def test_every_mark_ships_in_every_rendition(self):
        shipped = shipped_images()
        assert set(MARKS) == set(MARK_FILES) | set(['none'])
        for mark in MARK_FILES:
            for size in MARK_RENDITIONS:
                for color in MARK_COLORS:
                    assert mark_image(mark, size, color) in shipped, (mark, size, color)

    def test_one_colour_marks_come_in_the_chosen_colour(self):
        assert mark_image('tint_ring', 48, 'green').endswith('/tinted/tint_ring_green_64.png')
        assert mark_image('tint_ring', 48, 'bogus').endswith('/tinted/tint_ring_white_64.png')
        assert mark_image('ring', 48, 'green').endswith('/otmetki/ring_64.png')
        assert Settings({'mark_color': 'purple'}, SCHEMA).get('mark_color') == 'white'
        assert 'tint_brackets_red_128.png' in preview_text(Settings({'mark': 'tint_brackets', 'mark_size': 100, 'mark_color': 'red'}, SCHEMA), None)

    def test_image_picks_the_rendition_not_below_the_size(self):
        assert mark_image('dot', 48).endswith('/otmetki/dot_64.png')
        assert mark_image('kenney_scope', 100).endswith('/kenney/crosshair-196_128.png')
        assert mark_image('dot', 200).endswith('_128.png')
        assert mark_image('none', 48) is None and mark_html('none', 48) == ''
        assert mark_html('ring', 32) == '<img src="img://gui/maps/icons/otmetki/crosshair/otmetki/ring_64.png" width="32" height="32"/>'

    def test_mark_hides_the_game_centre_only_when_asked(self):
        values = Settings({'mark': 'cross', 'modes': 'sniper'}, SCHEMA).to_dict()
        assert to_native(values) == {'sniper': {'centralTag': 0}}
        values = Settings({'mark': 'cross', 'preset': 'contrast', 'mark_hides_centre': False}, SCHEMA).to_dict()
        assert to_native(values)['arcade'] == PRESET_PARTS['contrast']
        assert to_native(Settings({'mark': 'dot', 'preset': 'classic'}, SCHEMA).to_dict())['arcade']['centralTag'] == 0

    def test_mark_follows_the_reticle(self):
        settings = Settings({'x': 2, 'y': -3}, SCHEMA)
        assert mark_offset((960, 400), (1920, 1080), 1.0, settings) == (2, -143)
        assert mark_offset((640, 360), (1920, 1080), 1.5, Settings({}, SCHEMA)) == (0, 0)
        assert shows_in('both', True, False) and shows_in('sniper', False, True)
        assert not shows_in('sniper', True, False) and not shows_in('both', False, False)

    def test_settings_and_strings(self):
        settings = Settings({'mark': 'laser', 'mark_size': 999}, SCHEMA)
        assert settings.get('mark') == 'none' and settings.get('mark_size') == 128
        assert settings.get('drag') is False and settings.get('align_x') == 'center'
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])
        for mark in MARKS:
            assert 'crosshair_mark_' + mark in STRINGS['ru']
        assert preview_text(Settings({'mark': 'triad'}, SCHEMA), None).startswith('<img src="img://')


if __name__ == '__main__':
    unittest.main()
