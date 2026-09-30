# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.battle_loadout.model import clean_devices
from otmetki.features.battle_loadout.model.constants import PREVIEW_DEVICES
from otmetki.features.battle_loadout.model.preview import preview_widget
from otmetki.features.battle_loadout.model.widget import equipment_widget
from otmetki.features.battle_loadout.settings import SCHEMA


class EquipmentWidgetTest(unittest.TestCase):

    def test_icons_with_tooltip_texts(self):
        data = equipment_widget(clean_devices(PREVIEW_DEVICES), Settings({}, SCHEMA))['data']
        assert data['size'] == 32 and len(data['items']) == 3
        first = data['items'][0]
        assert first['icon'] == 'img://gui/maps/icons/artefact/turbocharger.png|otmetki:module' and first['bonus']
        assert first['effect'] and first['name'] == u'Турбонагнетатель'
        assert data['items'][1]['overlay'].endswith('equipmentPlus_overlay.png')

    def test_fixture_for_the_page(self):
        assert _support.widget_fixture('battle_loadout', preview_widget(Settings({}, SCHEMA), None))


if __name__ == '__main__':
    unittest.main()
