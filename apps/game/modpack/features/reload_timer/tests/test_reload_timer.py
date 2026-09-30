# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.reload_timer.i18n import STRINGS
from otmetki.features.reload_timer.model import GunState, bar, format_panel
from otmetki.features.reload_timer.model.constants import BAR_WIDTH
from otmetki.features.reload_timer.model.preview import preview_gun, preview_text
from otmetki.features.reload_timer.settings import SCHEMA, SETTINGS


def translator(language='ru'):
    return _support.translator(STRINGS, language)


def settings(**values):
    return Settings(values, SCHEMA)


def reloading_gun():
    gun = GunState()
    gun.set_reload(7.8, 7.8)
    return gun


def ready_gun():
    gun = preview_gun()
    gun.set_reload(0, 7.8)
    return gun


class ReloadTest(unittest.TestCase):

    def test_a_new_reload_changes_the_state(self):
        assert GunState().set_reload(7.8, 7.8) is True

    def test_the_same_reload_changes_nothing(self):
        assert reloading_gun().set_reload(7.8, 7.8) is False

    def test_a_tick_counts_down(self):
        gun = reloading_gun()

        ticked = gun.tick(0.5)

        assert ticked is True
        assert abs(gun.left - 7.3) < 1e-9

    def test_a_loaded_gun_does_not_tick(self):
        gun = reloading_gun()
        gun.set_reload(0, 7.8)

        assert gun.tick(0.1) is False

    def test_total_takes_the_time_left_without_a_base_value(self):
        gun = GunState()

        gun.set_reload(5.0, None)

        assert gun.total == 5.0

    def test_total_never_below_the_time_left(self):
        gun = GunState()

        gun.set_reload(9.0, 2.0)

        assert gun.total == 9.0


class ClipTest(unittest.TestCase):

    def test_a_new_clip_size_changes_the_state(self):
        assert GunState().set_clip(4) is True

    def test_the_same_clip_size_changes_nothing(self):
        gun = GunState()
        gun.set_clip(4)

        assert gun.set_clip(4) is False

    def test_an_unknown_clip_size_is_one_shell(self):
        gun = GunState()
        gun.set_clip(4)

        changed = gun.set_clip(None)

        assert changed is True
        assert gun.clip == 1

    def test_shells_in_the_clip_are_counted(self):
        assert GunState().set_in_clip(3) is True

    def test_an_unknown_shell_count_clears_the_count(self):
        gun = GunState()
        gun.set_in_clip(3)

        changed = gun.set_in_clip(-1)

        assert changed is True
        assert gun.in_clip is None


class FormatTest(unittest.TestCase):

    def test_reload_line_with_the_bar_and_the_clip(self):
        text = format_panel(preview_gun(), settings(), translator())

        assert u'Перезарядка 3.2 с' in text
        assert u'Кассета 3/4' in text
        assert '|' in text

    def test_a_ready_gun_is_not_announced_by_default(self):
        text = format_panel(ready_gun(), settings(), translator())

        assert u'Орудие готово' not in text

    def test_a_ready_gun_is_announced_when_switched_on(self):
        text = format_panel(ready_gun(), settings(show_ready=True), translator('en'))

        assert 'Gun ready' in text

    def test_a_ready_single_shot_gun_shows_nothing(self):
        gun = ready_gun()
        gun.set_clip(1)

        assert format_panel(gun, settings(), translator()) is None

    def test_a_loaded_gun_fills_the_bar(self):
        assert bar(0, 7.8).count('|') == BAR_WIDTH

    def test_the_bar_always_has_its_full_width(self):
        assert bar(3.9, 7.8).count('|') == BAR_WIDTH

    def test_custom_template(self):
        text = format_panel(preview_gun(), settings(template='{left}/{total} {in_clip}'), translator())

        assert '3.2/7.8 3' in text


class SettingsTest(unittest.TestCase):

    def test_preview_text(self):
        assert u'3.2' in preview_text(settings(), translator())

    def test_settings_switch(self):
        assert SETTINGS == ('battle_reload_timer',)

    def test_strings_in_both_languages(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
