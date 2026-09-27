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

    def test_zoom_presets_and_toggles(self):
        values = Settings({'zoom_steps': 'x2_x25', 'dynamic_camera': 'off', 'horizontal_stabilization': 'on'}, SCHEMA).to_dict()
        assert to_native(values) == {'zoomSteps': [2, 4, 8, 16, 25], 'dynamicCamera': False, 'horStabilizationSnp': True}

    def test_no_camera_config_overrides(self):
        assert setting_names(FIELDS) == ('dynamicCamera', 'horStabilizationSnp', 'zoomSteps')
        assert set(SCHEMA.defaults) == set(['preset', 'zoom_steps', 'dynamic_camera', 'horizontal_stabilization'])
        assert Settings({'zoom_steps': 'x2_x50'}, SCHEMA).get('zoom_steps') == 'native'


    def test_presets_fill_native_fields_only(self):
        values = Settings({'preset': 'sniper'}, SCHEMA).to_dict()
        assert to_native(values) == {'zoomSteps': [2, 4, 8, 16, 25], 'dynamicCamera': False, 'horStabilizationSnp': True}
        values = Settings({'preset': 'dynamic', 'zoom_steps': 'x2_x16'}, SCHEMA).to_dict()
        assert to_native(values) == {'zoomSteps': [2, 4, 8, 16], 'dynamicCamera': True, 'horStabilizationSnp': True}
        assert Settings({'preset': 'pmod'}, SCHEMA).get('preset') == 'native'


if __name__ == '__main__':
    unittest.main()
