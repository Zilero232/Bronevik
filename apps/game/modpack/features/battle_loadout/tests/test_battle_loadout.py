# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.core.settings import Settings
from otmetki.features.battle_loadout.model import clean_device, clean_devices, format_panel, overlay_of
from otmetki.features.battle_loadout.model.constants import MAX_ITEMS
from otmetki.features.battle_loadout.model.preview import preview_text
from otmetki.features.battle_loadout.settings import SCHEMA, SETTINGS

DEVICES = [
    {'name': u'Турбонагнетатель', 'effect': u'+10 % к скорости', 'icon': ('turbocharger', 0, 0), 'bonus': True},
    {'name': u'Вентиляция', 'effect': None, 'icon': '../maps/icons/artefact/improvedVentilation.png', 'deluxe': True},
    {'name': u'  ', 'icon': 'rammer'},
    None,
]


class DeviceTest(unittest.TestCase):

    def test_a_device_gets_its_client_icon_and_effect(self):
        device = clean_device(DEVICES[0])
        assert device == {'name': u'Турбонагнетатель', 'effect': u'+10 % к скорости', 'icon': 'img://gui/maps/icons/artefact/turbocharger.png|otmetki:module',
                          'overlay': None, 'bonus': True}
        assert clean_device(DEVICES[1])['icon'] == 'img://gui/maps/icons/artefact/improvedVentilation.png|otmetki:module'
        assert clean_device(DEVICES[1])['effect'] == u''

    def test_nameless_and_broken_entries_are_dropped(self):
        assert [device['name'] for device in clean_devices(DEVICES)] == [u'Турбонагнетатель', u'Вентиляция']
        assert len(clean_devices([DEVICES[0]] * (MAX_ITEMS + 3))) == MAX_ITEMS
        assert clean_devices(None) == []

    def test_overlays_of_special_devices(self):
        assert overlay_of({'deluxe': True}) == 'img://gui/maps/icons/quests/bonuses/small/equipmentPlus_overlay.png'
        assert overlay_of({'modernized': True, 'level': 2}) == 'img://gui/maps/icons/quests/bonuses/small/equipmentModernized_2_overlay.png'
        assert overlay_of({'modernized': True, 'level': 9}) is None
        assert overlay_of({'trophy': 'upgraded'}) == 'img://gui/maps/icons/quests/bonuses/small/equipmentTrophyUpgraded_overlay.png'
        assert overlay_of({}) is None


class FormatTest(unittest.TestCase):

    def test_icons_in_a_row_with_the_bonus_star(self):
        text = format_panel(clean_devices(DEVICES), Settings({}, SCHEMA))
        assert text.startswith(u'<img src="img://gui/maps/icons/artefact/turbocharger.png" width="32" height="32"/>')
        assert u'★' in text and u'Турбонагнетатель' not in text
        assert preview_text(Settings({'icon_size': 24}, SCHEMA), None).count('width="24"') == 3


class SettingsTest(unittest.TestCase):

    def test_pinned_over_the_stock_consumables(self):
        assert SETTINGS == ('battle_loadout',)
        defaults = SCHEMA.defaults
        assert (defaults['x'], defaults['y'], defaults['align_x'], defaults['align_y'], defaults['pinned']) == (0, -64, 'center', 'bottom', True)
        assert (-200, -66, 'center', 'bottom') in SCHEMA.retired


if __name__ == '__main__':
    unittest.main()
