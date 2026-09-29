# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.battle_loadout.model import clean_loadout
from otmetki.features.battle_loadout.model.constants import PREVIEW_LOADOUT
from otmetki.features.battle_loadout.model.preview import preview_widget
from otmetki.features.battle_loadout.model.widget import loadout_widget
from otmetki.features.battle_loadout.settings import SCHEMA


class LoadoutWidgetTest(unittest.TestCase):

    def test_groups_with_client_icons_and_bonus(self):
        data = loadout_widget(clean_loadout(PREVIEW_LOADOUT), Settings({}, SCHEMA))['data']
        assert [group['kind'] for group in data['groups']] == ['devices', 'directives']
        assert data['groups'][0]['items'][0] == {'icon': 'img://gui/maps/icons/artefact/turbocharger.png', 'name': u'Турбонагнетатель', 'bonus': True}
        assert data['groups'][1]['items'][0]['icon'] is None and data['compact'] and data['size'] == 24

    def test_modifications_when_asked(self):
        data = loadout_widget(clean_loadout(PREVIEW_LOADOUT), Settings({'show_modifications': True, 'style': 'detailed'}, SCHEMA))['data']
        assert [group['kind'] for group in data['groups']] == ['devices', 'modifications', 'directives'] and not data['compact']

    def test_fixture_for_the_page(self):
        assert _support.widget_fixture('battle_loadout', preview_widget(Settings({}, SCHEMA), None))


if __name__ == '__main__':
    unittest.main()
