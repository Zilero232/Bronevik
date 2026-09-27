from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.core.native_settings import merge_value
from otmetki.core.settings import Settings
from otmetki.features.crosshair.model import to_native
from otmetki.features.crosshair.model.constants import OPACITY_PARTS, PRESET_PARTS, RETICLE_PARTS, STYLE_MAX, STYLE_PARTS
from otmetki.features.crosshair.settings import SCHEMA, SETTINGS


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
                    assert part in STYLE_PARTS and 0 <= value <= STYLE_MAX, (name, part)

    def test_a_preset_keeps_the_players_other_parts(self):
        current = {'net': 50, 'netType': 2, 'centralTag': 100, 'custom': 7}
        merged = merge_value(current, PRESET_PARTS['clean'])
        assert merged['netType'] == 2 and merged['custom'] == 7 and merged['net'] == 0
        assert merge_value(True, False) is False


if __name__ == '__main__':
    unittest.main()
