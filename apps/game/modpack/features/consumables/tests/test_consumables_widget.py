# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.consumables.model import Loadout
from otmetki.features.consumables.model.preview import preview_loadout, preview_widget
from otmetki.features.consumables.model.widget import consumables_widget
from otmetki.features.consumables.i18n import STRINGS
from otmetki.features.consumables.settings import SCHEMA


def translator():
    return _support.translator(STRINGS, 'ru')


class ConsumablesWidgetTest(unittest.TestCase):

    def test_slots_with_cooldowns_and_shell_icons(self):
        data = consumables_widget(preview_loadout(), Settings({'show_consumables': True}, SCHEMA), translator())['data']
        medkit, repair, _ = data['slots']
        assert medkit == {'icon': 'img://gui/maps/icons/artefact/smallMedkit.png', 'quantity': 1, 'remaining': 0.0, 'total': 90.0, 'ready': True}
        assert (repair['remaining'], repair['total'], repair['ready']) == (12.0, 90.0, False)
        assert data['shells'][0] == {'icon': 'img://gui/maps/icons/ammopanel/battle_ammo/ARMOR_PIERCING.png|otmetki:damage', 'quantity': 32,
                                     'current': True}
        assert data['shells'][1]['icon'].startswith('img://gui/maps/icons/ammopanel/battle_ammo/ARMOR_PIERCING_CR_PREMIUM.png')
        assert data['stats'] == []

    def test_defaults_leave_the_stock_bar_alone(self):
        data = consumables_widget(preview_loadout(), Settings({'show_shell_stats': True}, SCHEMA), translator())['data']
        assert data['slots'] == [] and len(data['shells']) == 3
        assert data['stats'][0]['text'] == u'258 мм · урон 390 · 1 000 м/с' and data['stats'][0]['current']

    def test_icons_from_descriptor_paths(self):
        loadout = Loadout()
        loadout.set_item(7, u'x', 1, True, 0, ('../maps/icons/artefact/largeRepairkit.png', 'b'), 0)
        loadout.set_shell(8, 'ap', 3, 'ARMOR_PIERCING.png')
        loadout.set_shell(8, 'ap', 2)
        assert loadout.items[7]['icon'] == 'largeRepairkit' and loadout.shells[8]['icon'] == 'ARMOR_PIERCING'

    def test_fixture_for_the_page(self):
        assert _support.widget_fixture('consumables', preview_widget(Settings({'show_consumables': True, 'show_shell_stats': True}, SCHEMA), translator()))


if __name__ == '__main__':
    unittest.main()
