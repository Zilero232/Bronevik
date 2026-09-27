from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.core.settings import Settings
from otmetki.features.hangar_tweaks.model import REFUSE_BERTHS, REFUSE_LOCKED, REFUSE_NOTHING, plan_crew_unload, plan_demount, to_native
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


class QuickActionsTest(unittest.TestCase):

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


if __name__ == '__main__':
    unittest.main()
