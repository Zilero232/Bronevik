from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.core.native_settings import setting_names
from otmetki.core.settings import Settings
from otmetki.features.camera.model import FIELDS, to_native
from otmetki.features.camera.settings import SCHEMA, SETTINGS


def native(values):
    return to_native(Settings(values, SCHEMA).to_dict())


class CameraTest(unittest.TestCase):

    def test_defaults_change_nothing(self):
        assert native(None) == {}

    def test_the_component_switch_is_camera_tweaks(self):
        assert SETTINGS == ('camera_tweaks',)

    def test_the_zoom_and_the_toggles_map_to_the_client_settings(self):
        result = native({'sniper_zoom': 'x8', 'dynamic_camera': 'off', 'horizontal_stabilization': 'on'})

        assert result == {'sniperZoom': 3, 'dynamicCamera': False, 'horStabilizationSnp': True}

    def test_remember_the_last_zoom_is_zero(self):
        assert native({'sniper_zoom': 'remember'}) == {'sniperZoom': 0}


class NoCameraConfigTest(unittest.TestCase):

    def test_only_the_games_own_options_are_written(self):
        assert setting_names(FIELDS) == ('dynamicCamera', 'horStabilizationSnp', 'sniperZoom')

    def test_the_settings_are_the_preset_and_the_games_options(self):
        assert set(SCHEMA.defaults) == set(['preset', 'sniper_zoom', 'dynamic_camera', 'horizontal_stabilization'])

    def test_a_zoom_the_game_does_not_offer_falls_back_to_native(self):
        assert Settings({'sniper_zoom': 'x25'}, SCHEMA).get('sniper_zoom') == 'native'


class PresetTest(unittest.TestCase):

    def test_a_preset_fills_the_native_fields(self):
        assert native({'preset': 'sniper'}) == {'sniperZoom': 3, 'dynamicCamera': False, 'horStabilizationSnp': True}

    def test_a_chosen_field_wins_over_the_preset(self):
        result = native({'preset': 'dynamic', 'sniper_zoom': 'x4'})

        assert result == {'sniperZoom': 2, 'dynamicCamera': True, 'horStabilizationSnp': True}

    def test_an_unknown_preset_falls_back_to_native(self):
        assert Settings({'preset': 'pmod'}, SCHEMA).get('preset') == 'native'


if __name__ == '__main__':
    unittest.main()
