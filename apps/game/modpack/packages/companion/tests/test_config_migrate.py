# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.companion.config import Config, user_set_tokens
from otmetki.companion.config.constants import (
    DROPPED_SECTIONS,
    LAYOUT_PLACES_SECTION,
    MERGED_SECTIONS,
    MIGRATION_REVISION,
    RETIRED_VALUES,
)
from otmetki.companion.config.migrate import migrated

CHAT_FILTER_DEFAULTS = {'timestamps': True, 'hide_repeats': True, 'x': 0}


def schema_defaults(section):
    return CHAT_FILTER_DEFAULTS if section == 'chat_filter' else None


def stored(**switches):
    return dict(switches, defaults_revision=2)


def migrate(config, components=None):
    return migrated(config, components or {}, schema_defaults)


class MergedSwitchesTest(unittest.TestCase):

    def test_the_log_is_on_when_only_the_hit_log_was_on(self):
        config, _ = migrate(stored(battle_damage_log=False, battle_hit_log=True))

        self.assertTrue(config['battle_damage_log'])

    def test_the_progress_plate_is_on_when_the_main_gun_panel_was_on(self):
        config, _ = migrate(stored(battle_main_gun=True))

        self.assertTrue(config['battle_progress'])

    def test_the_progress_plate_stays_off_when_none_of_its_panels_was_on(self):
        config, _ = migrate(stored(battle_main_gun=False, battle_efficiency=False, battle_personal_best=False))

        self.assertNotIn('battle_progress', config)

    def test_the_clock_switch_keeps_the_hangar_clock_on(self):
        config, _ = migrate(stored(hangar_info=False, battle_clock=True))

        self.assertTrue(config['hangar_info'])


class GuardTest(unittest.TestCase):

    def test_a_configured_chat_filter_is_recorded_as_the_players_choice(self):
        config, _ = migrate(stored(battle_chat_filter=True), {'chat_filter': {'timestamps': False, 'x': 0}})

        self.assertIn('battle_chat_filter', user_set_tokens(config['user_set']))

    def test_a_configured_chat_filter_stays_on_after_the_upgrade(self):
        config, _ = migrate(stored(battle_chat_filter=True), {'chat_filter': {'timestamps': False, 'x': 0}})

        self.assertTrue(Config(config).get('battle_chat_filter'))

    def test_a_chat_filter_moved_but_not_configured_is_turned_off(self):
        config, _ = migrate(stored(battle_chat_filter=True), {'chat_filter': {'timestamps': True, 'x': 40}})

        self.assertFalse(Config(config).get('battle_chat_filter'))

    def test_an_untouched_switch_takes_the_new_default(self):
        config, _ = migrate(stored(hangar_cleaner=True))

        self.assertFalse(Config(config).get('hangar_cleaner'))

    def test_a_switch_the_player_set_in_the_window_is_kept(self):
        config, _ = migrate(dict(stored(hangar_cleaner=True), user_set='hangar_cleaner'))

        self.assertTrue(Config(config).get('hangar_cleaner'))


class SectionsTest(unittest.TestCase):

    def test_the_sections_of_removed_components_go(self):
        components = dict((name, {'font_size': 14}) for name in DROPPED_SECTIONS)

        _, migrated_components = migrate(stored(), components)

        self.assertEqual(migrated_components, {})

    def test_a_moved_value_the_player_changed_is_copied(self):
        for (old_section, old_key, old_default), (new_section, new_key) in MERGED_SECTIONS:
            changed = self.changed_value(old_default)

            _, components = migrate(stored(), {old_section: {old_key: changed}})

            self.assertEqual(components[new_section][new_key], changed)

    def test_a_moved_value_left_at_its_default_is_not_copied(self):
        for (old_section, old_key, old_default), (new_section, new_key) in MERGED_SECTIONS:
            _, components = migrate(stored(), {old_section: {old_key: old_default}})

            self.assertNotIn(new_key, components.get(new_section, {}))

    def test_a_value_left_at_its_old_default_takes_the_new_one(self):
        for section, key, old, new in RETIRED_VALUES:
            _, components = migrate(stored(), {section: {key: old}})

            self.assertEqual(components[section][key], new)

    def test_a_value_the_player_set_keeps_its_old_default(self):
        for section, key, old, _ in RETIRED_VALUES:
            config = dict(stored(), user_set='%s.%s' % (section, key))

            _, components = migrate(config, {section: {key: old}})

            self.assertEqual(components[section][key], old)

    def test_the_clock_strip_left_at_its_old_place_moves_above_the_carousel(self):
        old = {'x': -16, 'y': 76, 'align_x': 'right', 'align_y': 'top'}

        _, components = migrate(stored(), {'hangar_info': old})

        self.assertEqual(components['hangar_info'], {'x': 0, 'y': -196, 'align_x': 'left', 'align_y': 'bottom'})

    def test_a_clock_strip_the_player_moved_stays(self):
        moved = {'x': 40, 'y': 76, 'align_x': 'right', 'align_y': 'top'}

        _, components = migrate(stored(), {'hangar_info': moved})

        self.assertEqual(components['hangar_info'], moved)

    def test_the_battle_type_places_of_removed_panels_go(self):
        places = {'comp7': dict((name, {'x': 1}) for name in DROPPED_SECTIONS)}

        _, components = migrate(stored(), {LAYOUT_PLACES_SECTION: places})

        self.assertEqual(components[LAYOUT_PLACES_SECTION], {'comp7': {}})

    @staticmethod
    def changed_value(default):
        if isinstance(default, bool):
            return not default
        if isinstance(default, int):
            return default + 1
        return '%s!' % default


class SwitchedPartsTest(unittest.TestCase):

    def test_a_goals_card_the_player_switched_off_stays_off_in_the_session_card(self):
        _, components = migrate(stored(hangar_session_goals=False))

        self.assertFalse(components['session_stats']['show_goals'])

    def test_the_progress_rows_follow_the_panels_the_player_had_on(self):
        _, components = migrate(stored(battle_main_gun=True, battle_efficiency=False, battle_personal_best=False))

        self.assertEqual(
            components['battle_progress'],
            {'row_main_gun': True, 'row_record': False, 'row_wn8': False},
        )

    def test_the_progress_rows_keep_their_defaults_when_no_panel_was_on(self):
        _, components = migrate(stored(battle_main_gun=False))

        self.assertNotIn('battle_progress', components)


class ScopeTest(unittest.TestCase):

    def test_a_fresh_install_is_left_alone(self):
        config, components = migrate({}, {'hit_log': {'x': 1}})

        self.assertEqual((config, components), ({}, {'hit_log': {'x': 1}}))

    def test_a_file_at_the_revision_is_left_alone(self):
        config = {'defaults_revision': MIGRATION_REVISION, 'battle_hit_log': True, 'battle_damage_log': False}

        migrated_config, _ = migrate(config)

        self.assertFalse(migrated_config['battle_damage_log'])


if __name__ == '__main__':
    unittest.main()
