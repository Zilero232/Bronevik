# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.format import COLOR_MUTED
from otmetki.core.settings import Settings
from otmetki.features.consumables.i18n import STRINGS
from otmetki.features.consumables.model import Loadout, format_panel
from otmetki.features.consumables.model.preview import preview_loadout, preview_text
from otmetki.features.consumables.settings import SCHEMA, SETTINGS


def translator(language='ru'):
    return _support.translator(STRINGS, language)


class LoadoutTest(unittest.TestCase):

    def test_items_keep_their_slot_order_and_report_changes(self):
        loadout = Loadout()
        assert loadout.set_item(3, u'Огнетушитель', 1, True, 0)
        assert loadout.set_item(1, u'Аптечка', 1, True, 0)
        assert not loadout.set_item(3, u'Огнетушитель', 1, True, 0)
        assert loadout.set_item(3, u'Огнетушитель', 0, False, 0)
        assert loadout.item_order == [3, 1]
        assert not loadout.set_item(0, 'x', 1, True, 0) and not loadout.set_item(None, 'x', 1, True, 0)

    def test_shells_and_bad_values(self):
        loadout = Loadout()
        assert loadout.set_shell(11, 'ap', 32)
        assert loadout.set_shell(12, 'plasma', -4)
        assert loadout.shells[12] == {'code': None, 'quantity': 0}

    def test_cooldowns_count_down(self):
        loadout = preview_loadout()
        assert loadout.tick(0.5) and loadout.items[2]['remaining'] == 11.5
        loadout.items[2]['remaining'] = 0.3
        assert loadout.tick(0.5) and loadout.items[2]['remaining'] == 0.0
        assert not loadout.tick(0.5)


class FormatTest(unittest.TestCase):

    def test_panel(self):
        text = format_panel(preview_loadout(), Settings({}, SCHEMA), translator())
        first, second = text.split('\n')
        assert u'Аптечка' in first and u'Ремкомплект 12 с' in first and u'✓' in first
        assert u'ББ 32' in second and u'БП 12' in second and u'ОФ 6' in second

    def test_empty_slots_and_switches(self):
        loadout = preview_loadout()
        loadout.set_item(1, u'Аптечка', 0, False, 0)
        assert u'<font color="%s" size="14">Аптечка ×0</font>' % COLOR_MUTED in format_panel(loadout, Settings({}, SCHEMA), translator())
        shells_only = format_panel(loadout, Settings({'show_consumables': False}, SCHEMA), translator('en'))
        assert 'AP 32' in shells_only and '\n' not in shells_only
        assert format_panel(Loadout(), Settings({}, SCHEMA), translator()) is None

    def test_preview_settings_and_strings(self):
        assert u'ББ 32' in preview_text(Settings({}, SCHEMA), translator())
        assert SETTINGS == ('battle_consumables',)
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
