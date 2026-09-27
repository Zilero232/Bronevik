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


class PlanTest(unittest.TestCase):

    def test_native_changes_nothing(self):
        assert wanted(Settings(None, SCHEMA).to_dict()) == {}
        assert plan([vehicle(1)], Settings(None, SCHEMA).to_dict()) == ([], REFUSE_UNSET)

    def test_only_differences(self):
        values = Settings({'auto_repair': 'on', 'auto_load': 'on', 'auto_boosters': 'off'}, SCHEMA).to_dict()
        requests, refusal = plan([vehicle(1), vehicle(2, auto_load=True), vehicle(3, locked=True)], values)
        assert refusal is None
        assert requests == [(1, 'auto_load', True)]

    def test_refusals(self):
        values = {'auto_repair': 'on'}
        assert plan([vehicle(1)], values) == ([], REFUSE_NOTHING)
        assert plan([vehicle(1, locked=True)], values) == ([], REFUSE_LOCKED)
        assert plan([], values) == ([], REFUSE_NOTHING)

    def test_settings(self):
        assert Settings({'auto_repair': 'maybe'}, SCHEMA).get('auto_repair') == 'native'
        assert SETTINGS == ('hangar_auto_resupply',)
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
