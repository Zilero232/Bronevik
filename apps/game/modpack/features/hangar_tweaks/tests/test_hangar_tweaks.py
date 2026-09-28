from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.core.settings import Settings
from otmetki.features.hangar_tweaks.model import (REFUSE_BERTHS, REFUSE_LOCKED, REFUSE_NOTHING, plan_crew_return, plan_crew_unload, plan_demount,
                                                  plan_style_removal, scale_index, to_native, with_interface_scale)
from otmetki.features.hangar_tweaks.settings import SCHEMA, SETTINGS


class CarouselTest(unittest.TestCase):

    def test_native_keeps_the_game_value(self):
        assert to_native(Settings(None, SCHEMA).to_dict()) == {}

    def test_rows_and_tiles(self):
        values = Settings({'carousel_rows': 'double', 'carousel_tiles': 'small'}, SCHEMA).to_dict()
        assert to_native(values) == {'carouselType': 1, 'doubleCarouselType': 1}

    def test_three_rows_is_not_an_option(self):
        assert Settings({'carousel_rows': 'triple'}, SCHEMA).get('carousel_rows') == 'native'
        assert SETTINGS == ('hangar_tweaks',)


class InterfaceScaleTest(unittest.TestCase):

    def test_native_and_unknown_scales_are_left_alone(self):
        options = [0.0, 1.0, 1.25, 1.5, 2.0]
        assert with_interface_scale({'carouselType': 1}, 'native', options) == {'carouselType': 1}
        assert with_interface_scale({}, 'x1_75', options) == {}
        assert with_interface_scale({}, 'x1_5', []) == {}

    def test_choice_becomes_the_index_the_screen_offers(self):
        options = [0.0, 1.0, 1.25, 1.5, 2.0]
        assert scale_index(options, 'auto') == 0 and scale_index(options, 'x2') == 4
        assert with_interface_scale({'carouselType': 1}, 'x1_25', options) == {'carouselType': 1, 'interfaceScale': 2}
        assert Settings({'interface_scale': 'x3'}, SCHEMA).get('interface_scale') == 'native'


class QuickActionsTest(unittest.TestCase):

    def test_style_removal(self):
        assert plan_style_removal({'locked': False, 'style': True}) is None
        assert plan_style_removal({'locked': True, 'style': True}) == REFUSE_LOCKED
        assert plan_style_removal({'locked': False, 'style': False}) == REFUSE_NOTHING


    def test_demount_only_removable(self):
        vehicle = {'locked': False, 'devices': [{'slot': 0, 'removable': True}, None, {'slot': 2, 'removable': False},
                                                {'slot': 3, 'removable': True}]}
        assert plan_demount(vehicle) == ([0, 3], None)

    def test_demount_refusals(self):
        assert plan_demount({'locked': True, 'devices': [{'slot': 0, 'removable': True}]}) == ([], REFUSE_LOCKED)
        assert plan_demount({'locked': False, 'devices': [{'slot': 0, 'removable': False}]}) == ([], REFUSE_NOTHING)
        assert plan_demount({'locked': False}) == ([], REFUSE_NOTHING)

    def test_crew_unload(self):
        assert plan_crew_unload({'locked': False, 'crew': 4}, None) == (4, None)
        assert plan_crew_unload({'locked': False, 'crew': 4}, 10) == (4, None)
        assert plan_crew_unload({'locked': False, 'crew': 4}, 3) == (0, REFUSE_BERTHS)
        assert plan_crew_unload({'locked': True, 'crew': 4}, 10) == (0, REFUSE_LOCKED)
        assert plan_crew_unload({'locked': False, 'crew': 0}, 10) == (0, REFUSE_NOTHING)

    def test_crew_return(self):
        assert plan_crew_return({'locked': False, 'last_crew': True}) is None
        assert plan_crew_return({'locked': True, 'last_crew': True}) == REFUSE_LOCKED
        assert plan_crew_return({'locked': False, 'last_crew': False}) == REFUSE_NOTHING


if __name__ == '__main__':
    unittest.main()
