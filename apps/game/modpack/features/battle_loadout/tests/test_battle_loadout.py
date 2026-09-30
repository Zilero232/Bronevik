# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.battle_loadout.i18n import STRINGS
from otmetki.features.battle_loadout.model import clean_device, clean_devices, format_panel, overlay_of, set_badges
from otmetki.features.battle_loadout.model.constants import MAX_ITEMS
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

    def test_nameless_and_broken_entries_are_dropped(self):
        raw = [turbocharger(), ventilation(), {'name': u'  ', 'icon': 'rammer'}, None]

        names = [device['name'] for device in clean_devices(raw)]

        assert names == [u'Турбонагнетатель', u'Вентиляция']

    def test_the_row_keeps_at_most_max_items(self):
        devices = clean_devices([turbocharger()] * (MAX_ITEMS + 3))

        assert len(devices) == MAX_ITEMS

    def test_no_devices_from_nothing(self):
        assert clean_devices(None) == []

    def test_overlays_of_special_devices(self):
        assert overlay_of({'deluxe': True}) == BONUSES + 'equipmentPlus_overlay.png'
        assert overlay_of({'modernized': True, 'level': 2}) == BONUSES + 'equipmentModernized_2_overlay.png'
        assert overlay_of({'modernized': True, 'level': 9}) is None
        assert overlay_of({'trophy': 'upgraded'}) == BONUSES + 'equipmentTrophyUpgraded_overlay.png'
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


class SetBadgeTest(unittest.TestCase):

    def test_the_active_set_of_each_switchable_group_in_badge_order(self):
        raw = {'consumables': {'index': 0, 'total': 2}, 'devices': {'index': 1, 'total': 2}}

        badges = set_badges(raw, translator())

        assert badges == [{'group': 'devices', 'text': u'набор 2/2'}, {'group': 'consumables', 'text': u'снаряды 1/2'}]

    def test_the_badge_in_english(self):
        badges = set_badges({'devices': {'index': 0, 'total': 2}}, translator('en'))

        assert badges == [{'group': 'devices', 'text': u'set 1/2'}]

    def test_no_badge_for_a_group_without_a_switch_or_with_broken_indexes(self):
        raw = {
            'devices': {'index': 2, 'total': 2},
            'consumables': {'index': 0, 'total': 1},
            'other': {'index': 0, 'total': 2},
        }

        assert set_badges(raw, translator()) == []

    def test_no_badge_for_a_boolean_index(self):
        assert set_badges({'devices': {'index': True, 'total': 2}}, translator()) == []

    def test_no_badges_from_nothing(self):
        assert set_badges(None, translator()) == []


class FormatTest(unittest.TestCase):

    def test_the_set_badge_leads_the_icon_row(self):
        badges = set_badges({'devices': {'index': 0, 'total': 2}}, translator())

        text = format_panel(clean_devices([turbocharger()]), badges, Settings({}, SCHEMA))

        icon = u'<img src="img://gui/maps/icons/artefact/turbocharger.png" width="45" height="45"/>'
        assert text.startswith(u'набор 1/2 ' + icon)

    def test_icons_carry_the_bonus_star_and_the_attention_mark_instead_of_names(self):
        devices = clean_devices([turbocharger(), directive(attention=True)])

        text = format_panel(devices, [], Settings({}, SCHEMA))

        assert u'★' in text
        assert u'!' in text
        assert u'Турбонагнетатель' not in text

    def test_the_preview_follows_the_icon_size(self):
        text = preview_text(Settings({'icon_size': 24}, SCHEMA), translator())

        assert text.count('width="24"') == 5


class SettingsTest(unittest.TestCase):

    def test_pinned_over_the_stock_consumables(self):
        defaults = SCHEMA.defaults

        assert SETTINGS == ('battle_loadout',)
        assert (defaults['x'], defaults['y'], defaults['align_x'], defaults['align_y']) == (0, -64, 'center', 'bottom')
        assert defaults['pinned'] is True
        assert (-200, -66, 'center', 'bottom') in SCHEMA.retired

    def test_icons_the_size_of_the_stock_equipment_icons(self):
        assert SCHEMA.defaults['icon_size'] == 45


if __name__ == '__main__':
    unittest.main()
