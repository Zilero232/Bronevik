from __future__ import absolute_import, division, print_function, unicode_literals

import re
import unittest

import _support  # noqa: F401
from otmetki.core.settings import Settings
from otmetki.features.minimap.model import CLIENT_SETTINGS, to_native
from otmetki.features.minimap.settings import SCHEMA, SETTINGS

# Anything on Lesta's forbidden list would need a setting about enemies, directions, tracers or objects.
FORBIDDEN = re.compile(r'enemy|lost|direction|barrel|gun|tracer|arty|destroy|spot|transparen(?!cy$)', re.I)


class MinimapTest(unittest.TestCase):

    def test_defaults_change_nothing(self):
        assert to_native(Settings(None, SCHEMA).to_dict()) == {}
        assert SETTINGS == ('minimap_tweaks',)

    def test_values_map_to_client_settings(self):
        values = Settings({'size': '3', 'transparency': '40', 'vehicle_names': 'alt', 'view_range': 'on', 'max_view_range': 'off',
                           'draw_range': 'native'}, SCHEMA).to_dict()
        assert to_native(values) == {'minimapSize': 3, 'minimapAlpha': 40, 'showVehModelsOnMap': 1, 'minimapViewRange': True,
                                     'minimapMaxViewRange': False}

    def test_out_of_range_is_ignored(self):
        assert Settings({'size': '9', 'vehicle_names': 'enemies'}, SCHEMA).to_dict()['size'] == 'native'

    def test_only_vanilla_minimap_options(self):
        assert CLIENT_SETTINGS == ('minimapAlpha', 'minimapDrawRange', 'minimapMaxViewRange', 'minimapSize', 'minimapViewRange',
                                   'showVehModelsOnMap')
        for name in CLIENT_SETTINGS:
            assert not FORBIDDEN.search(name), name


if __name__ == '__main__':
    unittest.main()
