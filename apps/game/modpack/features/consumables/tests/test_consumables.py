# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.format import COLOR_MUTED
from otmetki.core.settings import Settings
from otmetki.features.consumables.i18n import STRINGS
from otmetki.features.consumables.model import ItemReading, Loadout, format_panel, shot_speed
from otmetki.features.consumables.model.preview import preview_loadout, preview_text
from otmetki.features.consumables.settings import SCHEMA, SETTINGS

MEDKIT = 1
EXTINGUISHER = 3
REPAIR_KIT = 2
APCR = 12


def translator(language='ru'):
    return _support.translator(STRINGS, language)


def panel_settings(**values):
    return Settings(values, SCHEMA)


def extinguisher(quantity=1, ready=True):
    return ItemReading(u'Огнетушитель', quantity, ready, 0)


def medkit(quantity=1, ready=True):
    return ItemReading(u'Аптечка', quantity, ready, 0)


def loadout_with_extinguisher():
    loadout = Loadout()
    loadout.set_item(EXTINGUISHER, extinguisher())
    return loadout


def panel_lines(loadout, settings, language='ru'):
    return format_panel(loadout, settings, translator(language)).split('\n')


class ItemTest(unittest.TestCase):

    def test_a_new_item_reports_a_change(self):
        loadout = Loadout()

        changed = loadout.set_item(EXTINGUISHER, extinguisher())

        assert changed

    def test_the_same_item_again_reports_no_change(self):
        loadout = loadout_with_extinguisher()

        changed = loadout.set_item(EXTINGUISHER, extinguisher())

        assert not changed

    def test_a_spent_item_reports_a_change(self):
        loadout = loadout_with_extinguisher()

        changed = loadout.set_item(EXTINGUISHER, extinguisher(quantity=0, ready=False))

        assert changed

    def test_items_keep_the_order_they_were_first_reported_in(self):
        loadout = loadout_with_extinguisher()
        loadout.set_item(MEDKIT, medkit())

        loadout.set_item(EXTINGUISHER, extinguisher(quantity=0))

        assert loadout.item_order == [3, 1]

    def test_an_item_without_an_id_is_ignored(self):
        loadout = Loadout()

        changed = loadout.set_item(0, ItemReading('x', 1, True, 0))

        assert not changed
        assert loadout.item_order == []

    def test_an_item_with_a_broken_id_is_ignored(self):
        loadout = Loadout()

        changed = loadout.set_item(None, ItemReading('x', 1, True, 0))

        assert not changed
        assert loadout.item_order == []

    def test_icons_come_from_descriptor_paths(self):
        loadout = Loadout()
        reading = ItemReading(u'x', 1, True, 0, icon=('../maps/icons/artefact/largeRepairkit.png', 'b'), total=0)

        loadout.set_item(7, reading)

        assert loadout.items[7]['icon'] == 'largeRepairkit'


class ShellTest(unittest.TestCase):

    def test_a_new_shell_reports_a_change(self):
        loadout = Loadout()

        changed = loadout.set_shell(11, 'ap', 32)

        assert changed

    def test_an_unknown_code_and_a_negative_quantity_are_cleaned(self):
        loadout = Loadout()

        loadout.set_shell(12, 'plasma', -4)

        assert loadout.shells[12] == {'code': None, 'quantity': 0, 'icon': None}

    def test_a_shell_update_without_an_icon_keeps_the_known_icon(self):
        loadout = Loadout()
        loadout.set_shell(8, 'ap', 3, 'ARMOR_PIERCING.png')

        loadout.set_shell(8, 'ap', 2)

        assert loadout.shells[8]['icon'] == 'ARMOR_PIERCING'


class CooldownTest(unittest.TestCase):

    def test_a_tick_counts_the_cooldown_down(self):
        loadout = preview_loadout()

        is_running = loadout.tick(0.5)

        assert is_running
        assert loadout.items[REPAIR_KIT]['remaining'] == 11.5

    def test_a_cooldown_stops_at_zero(self):
        loadout = preview_loadout()
        loadout.items[REPAIR_KIT]['remaining'] = 0.3

        is_running = loadout.tick(0.5)

        assert is_running
        assert loadout.items[REPAIR_KIT]['remaining'] == 0.0

    def test_a_tick_without_cooldowns_reports_nothing_running(self):
        loadout = preview_loadout()
        loadout.items[REPAIR_KIT]['remaining'] = 0.0

        is_running = loadout.tick(0.5)

        assert not is_running


class CurrentShellTest(unittest.TestCase):

    def test_switching_the_loaded_shell_reports_a_change(self):
        loadout = preview_loadout()

        changed = loadout.set_current(APCR)

        assert changed

    def test_the_same_loaded_shell_again_reports_no_change(self):
        loadout = preview_loadout()
        loadout.set_current(APCR)

        changed = loadout.set_current(APCR)

        assert not changed

    def test_a_broken_shell_id_clears_the_loaded_shell(self):
        loadout = preview_loadout()

        changed = loadout.set_current('x')

        assert changed
        assert loadout.current is None

    def test_no_shell_after_no_shell_reports_no_change(self):
        loadout = preview_loadout()
        loadout.set_current('x')

        changed = loadout.set_current(None)

        assert not changed


class StatsTest(unittest.TestCase):

    def test_stats_take_the_first_penetration_and_round_the_damage(self):
        loadout = Loadout()

        changed = loadout.set_stats(11, (258, 250), 390.4, 1000)

        assert changed
        assert loadout.stats[11] == {'penetration': 258, 'damage': 390, 'speed': 1000}

    def test_the_same_stats_again_report_no_change(self):
        loadout = Loadout()
        loadout.set_stats(11, (258, 250), 390.4, 1000)

        changed = loadout.set_stats(11, [258], 390, 1000)

        assert not changed

    def test_broken_stats_are_left_empty(self):
        loadout = Loadout()

        changed = loadout.set_stats(12, None, -1, 'x')

        assert changed
        assert loadout.stats[12] == {'penetration': None, 'damage': None, 'speed': None}


class ShotSpeedTest(unittest.TestCase):

    def test_is_the_shot_speed_over_the_projectile_speed_factor(self):
        assert shot_speed(800.0, 0.8) == 1000

    def test_is_none_without_a_shot_speed(self):
        assert shot_speed(None, 0.8) is None

    def test_is_none_without_a_factor(self):
        assert shot_speed(800.0, 0) is None


class FormatTest(unittest.TestCase):

    def test_the_first_line_shows_the_consumables_with_cooldowns_and_ready_marks(self):
        first, _ = panel_lines(preview_loadout(), panel_settings(show_consumables=True))

        assert u'Аптечка' in first
        assert u'Ремкомплект 12 с' in first
        assert u'✓' in first

    def test_the_second_line_shows_the_shells_left(self):
        _, second = panel_lines(preview_loadout(), panel_settings(show_consumables=True))

        assert u'ББ 32' in second
        assert u'БП 12' in second
        assert u'ОФ 6' in second

    def test_a_spent_consumable_is_muted_with_zero_left(self):
        loadout = preview_loadout()
        loadout.set_item(MEDKIT, medkit(quantity=0, ready=False))

        text = format_panel(loadout, panel_settings(show_consumables=True), translator())

        assert u'<font color="%s" size="14">Аптечка ×0</font>' % COLOR_MUTED in text

    def test_without_consumables_only_the_shells_line_is_left(self):
        lines = panel_lines(preview_loadout(), panel_settings(show_consumables=False), 'en')

        assert len(lines) == 1
        assert 'AP 32' in lines[0]

    def test_an_empty_loadout_shows_nothing(self):
        text = format_panel(Loadout(), panel_settings(show_consumables=True), translator())

        assert text is None


class ShellStatsFormatTest(unittest.TestCase):

    def test_stats_are_off_by_default(self):
        text = format_panel(preview_loadout(), panel_settings(show_consumables=True), translator())

        assert u'258' not in text

    def test_the_loaded_shell_gets_a_stats_line(self):
        settings = panel_settings(show_consumables=True, show_shell_stats=True)

        lines = panel_lines(preview_loadout(), settings)

        assert len(lines) == 3
        assert u'ББ:' in lines[2]
        assert u'258 мм' in lines[2]
        assert u'урон 390' in lines[2]
        assert u'1 000 м/с' in lines[2]

    def test_every_type_gets_a_stats_line(self):
        settings = panel_settings(show_consumables=True, show_shell_stats=True, shell_stats='all')

        lines = panel_lines(preview_loadout(), settings, 'en')

        assert len(lines) == 5
        assert u'330 mm' in lines[3]
        assert u'750 m/s' in lines[4]

    def test_the_stats_line_follows_the_loaded_shell(self):
        loadout = preview_loadout()
        loadout.set_current(APCR)

        lines = panel_lines(loadout, panel_settings(show_consumables=True, show_shell_stats=True))

        assert u'БП:' in lines[2]


class PanelTest(unittest.TestCase):

    def test_the_preview_shows_the_sample_shells(self):
        text = preview_text(panel_settings(show_consumables=True), translator())

        assert u'ББ 32' in text

    def test_switch(self):
        assert SETTINGS == ('battle_consumables',)

    def test_strings_in_sync(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
