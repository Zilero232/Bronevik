# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.battle_loadout.i18n import STRINGS
from otmetki.features.battle_loadout.model import LoadoutBook, clean_loadout, format_panel, icon_path
from otmetki.features.battle_loadout.model.constants import MAX_TANKS
from otmetki.features.battle_loadout.model.preview import preview_text
from otmetki.features.battle_loadout.settings import SCHEMA, SETTINGS

LOADOUT = {
    'devices': [{'name': u'Турбонагнетатель', 'icon': '../maps/icons/artefact/turbocharger.png', 'bonus': True},
                {'name': u'Вентиляция', 'icon': '../maps/icons/artefact/ventilation.png', 'bonus': False}, None],
    'modifications': [u'Обзор', None, 7],
    'directives': [{'name': u'Боевое братство', 'icon': 'gui/maps/icons/artefact/brotherhood.png'}],
}


def translator(language='ru'):
    return _support.translator(STRINGS, language)


class LoadoutTest(unittest.TestCase):

    def test_icon_paths_stay_under_the_client_maps(self):
        assert icon_path('../maps/icons/artefact/turbocharger.png') == 'gui/maps/icons/artefact/turbocharger.png'
        assert icon_path('gui/maps/icons/artefact/x.png') == 'gui/maps/icons/artefact/x.png'
        assert icon_path('../../../evil.png') is None and icon_path('gui/maps/x.swf') is None and icon_path(None) is None
        assert icon_path('gui/maps/<b>.png') is None

    def test_clean_drops_what_is_not_a_named_item(self):
        loadout = clean_loadout(LOADOUT)
        assert [item['name'] for item in loadout['devices']] == [u'Турбонагнетатель', u'Вентиляция']
        assert loadout['devices'][0]['bonus'] and not loadout['devices'][1]['bonus']
        assert loadout['modifications'] == [u'Обзор']
        assert clean_loadout(None) == {'devices': [], 'modifications': [], 'directives': []}

    def test_book_keeps_the_last_tanks(self):
        book = LoadoutBook()
        assert book.put(1, LOADOUT) and not book.put(1, LOADOUT)
        for tank_id in range(2, MAX_TANKS + 3):
            book.put(tank_id, LOADOUT)
        assert book.get(1) is None and book.get(MAX_TANKS + 2) is not None and not book.put(0, LOADOUT)


class FormatTest(unittest.TestCase):

    def test_detailed_and_compact(self):
        loadout = clean_loadout(LOADOUT)
        detailed = format_panel(loadout, Settings({'style': 'detailed', 'show_icons': False, 'show_modifications': True}, SCHEMA), translator())
        assert u'Оборудование: ' in detailed and u'Турбонагнетатель ★' in detailed and u'Модернизация: ' in detailed
        assert u'Инструкции: ' in detailed and 'img://' not in detailed
        compact = format_panel(loadout, Settings({}, SCHEMA), translator())
        assert 'img://gui/maps/icons/artefact/turbocharger.png' in compact and u'Турбонагнетатель' not in compact
        assert u'Обзор' not in compact
        only_directives = format_panel(loadout, Settings({'show_devices': False}, SCHEMA), translator())
        assert 'brotherhood.png' in only_directives and 'turbocharger' not in only_directives
        assert format_panel(clean_loadout({}), Settings({}, SCHEMA), translator()) is None
        assert format_panel(None, Settings({}, SCHEMA), translator()) is None

    def test_preview_settings_and_strings(self):
        assert u'★' in preview_text(Settings({'style': 'detailed'}, SCHEMA), translator())
        assert SETTINGS == ('battle_loadout',)
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
