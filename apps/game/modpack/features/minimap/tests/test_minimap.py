from __future__ import absolute_import, division, print_function, unicode_literals

import re
import unittest

import _support  # noqa: F401
from otmetki.core.native_settings import setting_names
from otmetki.core.settings import Settings
from otmetki.features.minimap.model import ACCOUNT_FIELDS, FIELDS, to_account, to_native
from otmetki.features.minimap.settings import SCHEMA, SETTINGS

FORBIDDEN = re.compile(r'enemy|lost|direction|barrel|gun|tracer|arty|destroy|spot|transparen(?!cy$)', re.I)


class MinimapTest(unittest.TestCase):

    def test_defaults_change_nothing(self):
        assert to_native(Settings(None, SCHEMA).to_dict()) == {}
        assert SETTINGS == ('minimap_tweaks',)

    def test_values_map_to_client_settings(self):
        values = Settings({'size': '3', 'transparency': '40', 'vehicle_names': 'alt', 'view_range': 'on', 'max_view_range': 'off',
                           'draw_range': 'native'}, SCHEMA).to_dict()
        assert to_native(values) == {'minimapAlpha': 40, 'showVehModelsOnMap': 1, 'minimapViewRange': True, 'minimapMaxViewRange': False}
        assert to_account(values) == {'minimapSize': 3}

    def test_size_goes_to_account_settings_not_the_settings_core(self):
        assert setting_names(ACCOUNT_FIELDS) == ('minimapSize',)
        assert 'minimapSize' not in setting_names(FIELDS)
        assert to_account(Settings(None, SCHEMA).to_dict()) == {}

    def test_out_of_range_is_ignored(self):
        assert Settings({'size': '9', 'vehicle_names': 'enemies'}, SCHEMA).to_dict()['size'] == 'native'

    def test_only_vanilla_minimap_options(self):
        assert setting_names(FIELDS) == ('minimapAlpha', 'minimapDrawRange', 'minimapMaxViewRange', 'minimapViewRange', 'showVehModelsOnMap')
        for name in setting_names(FIELDS) + setting_names(ACCOUNT_FIELDS):
            assert not FORBIDDEN.search(name), name


if __name__ == '__main__':
    unittest.main()
