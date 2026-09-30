from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.core.settings import Settings
from otmetki.features.auto_resupply.i18n import STRINGS
from otmetki.features.auto_resupply.model import REFUSE_LOCKED, REFUSE_NOTHING, REFUSE_UNSET, plan, wanted
from otmetki.features.auto_resupply.settings import SCHEMA, SETTINGS


def vehicle(inv_id, locked=False, **flags):
    base = {'auto_repair': True, 'auto_load': False, 'auto_equip': False, 'auto_boosters': None}
    base.update(flags)
    return {'inv_id': inv_id, 'locked': locked, 'flags': base}


def chosen(values):
    return Settings(values, SCHEMA).to_dict()


class PlanTest(unittest.TestCase):

    def test_native_wants_nothing(self):
        assert wanted(chosen(None)) == {}

    def test_native_is_refused_as_unset(self):
        assert plan([vehicle(1)], chosen(None)) == ([], REFUSE_UNSET)

    def test_only_the_flags_that_differ_are_sent(self):
        values = chosen({'auto_repair': 'on', 'auto_load': 'on', 'auto_boosters': 'off'})
        vehicles = [vehicle(1), vehicle(2, auto_load=True), vehicle(3, locked=True)]

        assert plan(vehicles, values) == ([(1, 'auto_load', True)], None)

    def test_flags_already_as_wanted_are_nothing_to_do(self):
        assert plan([vehicle(1)], {'auto_repair': 'on'}) == ([], REFUSE_NOTHING)

    def test_only_locked_vehicles_are_refused(self):
        assert plan([vehicle(1, locked=True)], {'auto_repair': 'on'}) == ([], REFUSE_LOCKED)

    def test_no_vehicles_are_nothing_to_do(self):
        assert plan([], {'auto_repair': 'on'}) == ([], REFUSE_NOTHING)


class SettingsTest(unittest.TestCase):

    def test_an_unknown_value_falls_back_to_native(self):
        assert Settings({'auto_repair': 'maybe'}, SCHEMA).get('auto_repair') == 'native'

    def test_the_component_switch_is_hangar_auto_resupply(self):
        assert SETTINGS == ('hangar_auto_resupply',)

    def test_both_languages_have_the_same_strings(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
