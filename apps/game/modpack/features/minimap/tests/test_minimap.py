from __future__ import absolute_import, division, print_function, unicode_literals

import re
import unittest

import _support  # noqa: F401
from otmetki.core.native_settings import setting_names
from otmetki.core.settings import Settings
from otmetki.features.minimap.model import ACCOUNT_FIELDS, FIELDS, to_account, to_native
from otmetki.features.minimap.settings import SCHEMA, SETTINGS

FORBIDDEN = re.compile(r'enemy|lost|direction|barrel|gun|tracer|arty|destroy|spot|transparen(?!cy$)', re.I)


def chosen_values():
    return Settings({
        'size': '3',
        'transparency': '40',
        'vehicle_names': 'alt',
        'view_range': 'on',
        'max_view_range': 'off',
        'draw_range': 'native',
    }, SCHEMA).to_dict()


class MinimapTest(unittest.TestCase):

    def test_defaults_change_nothing(self):
        assert to_native(Settings(None, SCHEMA).to_dict()) == {}

    def test_defaults_change_no_account_setting(self):
        assert to_account(Settings(None, SCHEMA).to_dict()) == {}

    def test_the_component_switch_is_minimap_tweaks(self):
        assert SETTINGS == ('minimap_tweaks',)

    def test_values_map_to_the_client_settings(self):
        assert to_native(chosen_values()) == {
            'minimapAlpha': 40,
            'showVehModelsOnMap': 1,
            'minimapViewRange': True,
            'minimapMaxViewRange': False,
        }

    def test_the_size_maps_to_the_account_setting(self):
        assert to_account(chosen_values()) == {'minimapSize': 3}

    def test_the_size_is_an_account_setting(self):
        assert setting_names(ACCOUNT_FIELDS) == ('minimapSize',)

    def test_the_size_is_not_a_settings_core_option(self):
        assert 'minimapSize' not in setting_names(FIELDS)

    def test_an_out_of_range_size_falls_back_to_native(self):
        assert Settings({'size': '9', 'vehicle_names': 'enemies'}, SCHEMA).to_dict()['size'] == 'native'

    def test_only_vanilla_minimap_options_are_written(self):
        expected = ('minimapAlpha', 'minimapDrawRange', 'minimapMaxViewRange', 'minimapViewRange', 'showVehModelsOnMap')

        assert setting_names(FIELDS) == expected

    def test_no_option_touches_enemy_information(self):
        for name in setting_names(FIELDS) + setting_names(ACCOUNT_FIELDS):
            assert not FORBIDDEN.search(name), name


if __name__ == '__main__':
    unittest.main()
