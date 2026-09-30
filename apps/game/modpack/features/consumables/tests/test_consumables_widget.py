# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.consumables.i18n import STRINGS
from otmetki.features.consumables.model.preview import preview_loadout, preview_widget
from otmetki.features.consumables.model.widget import consumables_widget
from otmetki.features.consumables.settings import SCHEMA

AMMO_ICONS = 'img://gui/maps/icons/ammopanel/battle_ammo/'


def translator():
    return _support.translator(STRINGS, 'ru')


def preview_data(**settings):
    return consumables_widget(preview_loadout(), Settings(settings, SCHEMA), translator())['data']


class ConsumablesWidgetTest(unittest.TestCase):

    def test_a_ready_slot_carries_its_artefact_icon(self):
        medkit = preview_data(show_consumables=True)['slots'][0]

        assert medkit == {
            'icon': 'img://gui/maps/icons/artefact/smallMedkit.png',
            'quantity': 1,
            'remaining': 0.0,
            'total': 90.0,
            'ready': True,
        }

    def test_a_slot_on_cooldown_carries_the_time_left_and_is_not_ready(self):
        repair = preview_data(show_consumables=True)['slots'][1]

        assert repair['remaining'] == 12.0
        assert repair['total'] == 90.0
        assert not repair['ready']

    def test_the_loaded_shell_is_marked_current(self):
        shell = preview_data()['shells'][0]

        assert shell == {'icon': AMMO_ICONS + 'ARMOR_PIERCING.png|otmetki:damage', 'quantity': 32, 'current': True}

    def test_a_shell_carries_its_battle_ammo_icon(self):
        shell = preview_data()['shells'][1]

        assert shell['icon'].startswith(AMMO_ICONS + 'ARMOR_PIERCING_CR_PREMIUM.png')

    def test_stats_are_off_by_default(self):
        data = preview_data(show_consumables=True)

        assert data['stats'] == []

    def test_defaults_leave_the_stock_bar_alone(self):
        data = preview_data(show_shell_stats=True)

        assert data['slots'] == []
        assert len(data['shells']) == 3

    def test_the_loaded_shell_gets_its_stats(self):
        stats = preview_data(show_shell_stats=True)['stats'][0]

        assert stats['text'] == u'258 мм · урон 390 · 1 000 м/с'
        assert stats['current']

    def test_fixture_for_the_page(self):
        widget = preview_widget(Settings({'show_consumables': True, 'show_shell_stats': True}, SCHEMA), translator())

        assert _support.widget_fixture('consumables', widget)


if __name__ == '__main__':
    unittest.main()
