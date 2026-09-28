from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.core.native_settings import setting_names
from otmetki.core.settings import Settings
from otmetki.features.camera.model import FIELDS, to_native
from otmetki.features.camera.settings import SCHEMA, SETTINGS


class CameraTest(unittest.TestCase):

    def test_defaults_change_nothing(self):
        assert to_native(Settings(None, SCHEMA).to_dict()) == {}
        assert SETTINGS == ('camera_tweaks',)

    def test_sniper_zoom_and_toggles(self):
        values = Settings({'sniper_zoom': 'x8', 'dynamic_camera': 'off', 'horizontal_stabilization': 'on'}, SCHEMA).to_dict()
        assert to_native(values) == {'sniperZoom': 3, 'dynamicCamera': False, 'horStabilizationSnp': True}
        assert to_native(Settings({'sniper_zoom': 'remember'}, SCHEMA).to_dict()) == {'sniperZoom': 0}

    def test_no_camera_config_overrides(self):
        assert setting_names(FIELDS) == ('dynamicCamera', 'horStabilizationSnp', 'sniperZoom')
        assert set(SCHEMA.defaults) == set(['preset', 'sniper_zoom', 'dynamic_camera', 'horizontal_stabilization'])
        assert Settings({'sniper_zoom': 'x25'}, SCHEMA).get('sniper_zoom') == 'native'


    def test_presets_fill_native_fields_only(self):
        values = Settings({'preset': 'sniper'}, SCHEMA).to_dict()
        assert to_native(values) == {'sniperZoom': 3, 'dynamicCamera': False, 'horStabilizationSnp': True}
        values = Settings({'preset': 'dynamic', 'sniper_zoom': 'x4'}, SCHEMA).to_dict()
        assert to_native(values) == {'sniperZoom': 2, 'dynamicCamera': True, 'horStabilizationSnp': True}
        assert Settings({'preset': 'pmod'}, SCHEMA).get('preset') == 'native'


if __name__ == '__main__':
    unittest.main()
