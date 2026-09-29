# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import sys
import types
import unittest

import _support  # noqa: F401
from otmetki.core.client.game import type_compact_descr, vehicle_class_tag, vehicle_info, vehicle_short_name

STUBBED = ('items', 'items.vehicles')


class VehicleType(object):
    name = 'ussr:R04_T-34'
    level = 5
    shortUserString = u'Т-34'
    classTag = 'mediumTank'


def get_vehicle_type(compact_descr):
    # RU 1.45 items.vehicles.getVehicleType: an int or a long is a type id, anything else a packed descriptor.
    if type(compact_descr) not in (int, type(10 ** 20)):
        raise TypeError('parsed as a packed descriptor')
    if compact_descr != 1:
        raise KeyError(compact_descr)
    return VehicleType()


class VehicleTypeTest(unittest.TestCase):

    def setUp(self):
        self.saved = dict((name, sys.modules.get(name)) for name in STUBBED)
        items = types.ModuleType(str('items'))
        items.__path__ = []
        vehicles = types.ModuleType(str('items.vehicles'))
        vehicles.getVehicleType = get_vehicle_type
        items.vehicles = vehicles
        sys.modules['items'], sys.modules['items.vehicles'] = items, vehicles

    def tearDown(self):
        for name, module in self.saved.items():
            if module is None:
                sys.modules.pop(name, None)
            else:
                sys.modules[name] = module

    def test_only_positive_ints_reach_the_client(self):
        assert type_compact_descr(1) == 1
        assert type_compact_descr('1') == 1 and type(type_compact_descr('1')) is int
        for bad in (None, True, 0, -3, 1.0, 'T-34', '', b'\x01\x02'):
            assert type_compact_descr(bad) is None, bad

    def test_names_of_a_type_id_given_as_a_digit_string(self):
        assert vehicle_short_name('1') == u'Т-34'
        assert vehicle_class_tag(1) == 'mediumTank'
        assert vehicle_info(1) == ('ussr:R04_T-34', 5)

    def test_unknown_ids_read_as_missing(self):
        assert vehicle_short_name(2) is None
        assert vehicle_class_tag(None) is None
        assert vehicle_info('x') == (None, None)


if __name__ == '__main__':
    unittest.main()
