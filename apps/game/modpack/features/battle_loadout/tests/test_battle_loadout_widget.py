# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.battle_loadout.i18n import STRINGS
from otmetki.features.battle_loadout.model import clean_devices, set_badges
from otmetki.features.battle_loadout.model.constants import PREVIEW_DEVICES, PREVIEW_SETS
from otmetki.features.battle_loadout.model.preview import preview_widget
from otmetki.features.battle_loadout.model.widget import equipment_widget
from otmetki.features.battle_loadout.settings import SCHEMA


def translator():
    return _support.translator(STRINGS)


def preview_data():
    badges = set_badges(PREVIEW_SETS, translator())
    return equipment_widget(clean_devices(PREVIEW_DEVICES), badges, Settings({}, SCHEMA))['data']


class EquipmentWidgetTest(unittest.TestCase):

    def test_icons_take_the_size_setting(self):
        data = preview_data()

        assert data['size'] == 45

    def test_every_sample_item_is_drawn(self):
        items = preview_data()['items']

        assert len(items) == 5

    def test_an_item_carries_its_icon_and_the_tooltip_name(self):
        first = preview_data()['items'][0]

        assert first['icon'] == 'img://gui/maps/icons/artefact/turbocharger.png|otmetki:module'
        assert first['name'] == u'Турбонагнетатель'

    def test_marks_of_the_sample_items(self):
        items = preview_data()['items']

        assert items[0]['bonus']
        assert items[1]['overlay'] == 'img://gui/maps/icons/quests/bonuses/small/equipmentPlus_overlay.png'
        assert items[2]['boosted']
        assert items[3]['active']
        assert items[4]['overlay'] == 'img://gui/maps/icons/artefact/battleBooster_overlay.png'

    def test_the_set_badges_of_the_sample(self):
        sets = preview_data()['sets']

        assert sets == [
            {'group': 'devices', 'text': u'набор 2/2'},
            {'group': 'consumables', 'text': u'снаряды 1/2'},
        ]

    def test_fixture_for_the_page(self):
        widget = preview_widget(Settings({}, SCHEMA), translator())

        assert _support.widget_fixture('battle_loadout', widget)


if __name__ == '__main__':
    unittest.main()
