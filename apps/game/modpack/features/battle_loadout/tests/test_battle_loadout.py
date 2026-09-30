# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.battle_loadout.i18n import STRINGS
from otmetki.features.battle_loadout.model import (
    clean_device,
    clean_devices,
    format_panel,
    icons_found,
    loadout_summary,
    overlay_of,
)
from otmetki.features.battle_loadout.model.preview import preview_text
from otmetki.features.battle_loadout.settings import SCHEMA, SETTINGS

ARTEFACTS = 'img://gui/maps/icons/artefact/'
BONUSES = 'img://gui/maps/icons/quests/bonuses/small/'


def turbocharger(**flags):
    raw = {'name': u'Турбонагнетатель', 'effect': u'+10 % к скорости', 'icon': ('turbocharger', 0, 0), 'bonus': True}
    raw.update(flags)
    return raw


def ventilation():
    icon = '../maps/icons/artefact/improvedVentilation.png'
    return {'name': u'Вентиляция', 'effect': None, 'icon': icon, 'deluxe': True}


def directive(**flags):
    raw = {'name': u'Директива', 'effect': u'Усиливает досылатель', 'icon': 'rammer', 'booster': 'boost'}
    raw.update(flags)
    return raw


def translator(language='ru'):
    return _support.translator(STRINGS, language)


class DeviceTest(unittest.TestCase):

    def test_a_device_gets_its_client_icon_effect_and_marks(self):
        device = clean_device(turbocharger())

        assert device == {
            'name': u'Турбонагнетатель',
            'effect': u'+10 % к скорости',
            'icon': ARTEFACTS + 'turbocharger.png|otmetki:module',
            'overlay': None,
            'bonus': True,
            'boosted': False,
            'attention': False,
            'active': False,
            'used': False,
        }

    def test_a_device_from_a_path_without_an_effect(self):
        device = clean_device(ventilation())

        assert device['icon'] == ARTEFACTS + 'improvedVentilation.png|otmetki:module'
        assert device['effect'] == u''

    def test_a_device_without_an_icon_gets_the_fallback_glyph(self):
        device = clean_device(turbocharger(icon=None))

        assert device['icon'] == 'otmetki:module'

    def test_nameless_and_broken_entries_are_dropped(self):
        raw = [turbocharger(), ventilation(), {'name': u'  ', 'icon': 'rammer'}, None]

        names = [device['name'] for device in clean_devices(raw)]

        assert names == [u'Турбонагнетатель', u'Вентиляция']

    def test_the_row_keeps_at_most_six_items(self):
        devices = clean_devices([turbocharger()] * 9)

        assert len(devices) == 6

    def test_no_devices_from_nothing(self):
        assert clean_devices(None) == []


class OverlayTest(unittest.TestCase):

    def test_a_deluxe_device_wears_the_plus_mark(self):
        assert overlay_of({'deluxe': True}) == BONUSES + 'equipmentPlus_overlay.png'

    def test_a_modernized_device_wears_the_mark_of_its_level(self):
        assert overlay_of({'modernized': True, 'level': 2}) == BONUSES + 'equipmentModernized_2_overlay.png'

    def test_a_modernized_level_out_of_range_gets_no_mark(self):
        assert overlay_of({'modernized': True, 'level': 9}) is None

    def test_an_upgraded_trophy_device_wears_the_upgraded_trophy_mark(self):
        assert overlay_of({'trophy': 'upgraded'}) == BONUSES + 'equipmentTrophyUpgraded_overlay.png'

    def test_a_plain_device_gets_no_mark(self):
        assert overlay_of({}) is None


class DirectiveTest(unittest.TestCase):

    def test_a_directive_wears_the_stock_frame_over_its_artefact_icon(self):
        device = clean_device(directive())

        assert device['overlay'] == ARTEFACTS + 'battleBooster_overlay.png'
        assert device['icon'] == ARTEFACTS + 'rammer.png|otmetki:module'

    def test_a_directive_without_effect_on_the_tank_carries_the_attention_mark(self):
        device = clean_device(directive(attention=True))

        assert device['attention']

    def test_a_crew_directive_for_an_unlearnt_skill_wears_the_replace_frame(self):
        overlay = overlay_of({'booster': 'replace', 'deluxe': True})

        assert overlay == ARTEFACTS + 'battleBooster_replace_overlay.png'

    def test_an_unknown_directive_frame_is_left_out(self):
        assert overlay_of({'booster': 'other'}) is None

    def test_the_device_the_directive_boosts_is_marked(self):
        device = clean_device(turbocharger(boosted=True))

        assert device['boosted']


class ActiveStateTest(unittest.TestCase):

    def test_a_running_device_is_active(self):
        device = clean_device(turbocharger(active=True))

        assert device['active']
        assert not device['used']

    def test_a_spent_device_is_used(self):
        device = clean_device(turbocharger(used=1))

        assert device['used'] is True
        assert not device['active']


class FormatTest(unittest.TestCase):

    def test_the_row_is_the_client_icons_alone(self):
        text = format_panel(clean_devices([turbocharger(bonus=False)]), Settings({}, SCHEMA))

        assert text == u'<img src="img://gui/maps/icons/artefact/turbocharger.png" width="40" height="40"/>'

    def test_a_device_without_an_icon_keeps_a_mark_and_no_name(self):
        devices = clean_devices([turbocharger(icon=None, bonus=False)])

        text = format_panel(devices, Settings({}, SCHEMA))

        assert text == u'◆'

    def test_icons_carry_the_bonus_star_and_the_attention_mark_instead_of_names(self):
        devices = clean_devices([turbocharger(), directive(attention=True)])

        text = format_panel(devices, Settings({}, SCHEMA))

        assert u'★' in text
        assert u'!' in text
        assert u'Турбонагнетатель' not in text

    def test_the_preview_follows_the_icon_size(self):
        text = preview_text(Settings({'icon_size': 24}, SCHEMA), translator())

        assert text.count('width="24"') == 5


class SettingsTest(unittest.TestCase):

    def test_switch(self):
        assert SETTINGS == ('battle_loadout',)

    def test_placed_right_over_the_stock_consumables(self):
        defaults = SCHEMA.defaults

        assert defaults['x'] == 0
        assert defaults['y'] == -64
        assert defaults['align_x'] == 'center'
        assert defaults['align_y'] == 'bottom'

    def test_pinned_by_default(self):
        assert SCHEMA.defaults['pinned'] is True

    def test_an_older_default_place_is_retired(self):
        assert (-200, -66, 'center', 'bottom') in SCHEMA.retired

    def test_icons_fill_the_44_px_slot_of_the_design(self):
        assert SCHEMA.defaults['icon_size'] == 40


class SummaryTest(unittest.TestCase):

    def test_a_read_counts_the_devices_the_directives_and_the_icons_the_client_has(self):
        loadout = {'devices': [turbocharger(), ventilation()], 'directives': [directive()], 'reason': None}
        devices = clean_devices(loadout['devices'] + loadout['directives'])

        summary = loadout_summary(loadout, devices, lambda path: 'rammer' not in path)

        assert summary == 'battle_loadout: 2 devices, 1 directives, icons found 2'

    def test_an_empty_read_says_why(self):
        loadout = {'devices': [], 'directives': [], 'reason': 'no vehicle yet'}

        summary = loadout_summary(loadout, [], lambda path: True)

        assert summary == 'battle_loadout: nothing to show, no vehicle yet'

    def test_a_glyph_without_a_client_image_is_not_a_found_icon(self):
        devices = clean_devices([turbocharger(icon=None)])

        assert icons_found(devices, lambda path: True) == 0


if __name__ == '__main__':
    unittest.main()
