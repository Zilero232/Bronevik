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


class GunStateTest(unittest.TestCase):

    def test_reload_and_clip(self):
        gun = GunState()
        assert gun.set_reload(7.8, 7.8) and not gun.set_reload(7.8, 7.8)
        assert gun.tick(0.5) and abs(gun.left - 7.3) < 1e-9
        assert gun.set_reload(0, 7.8) and not gun.tick(0.1)
        assert gun.set_clip(4) and not gun.set_clip(4) and gun.set_clip(None) and gun.clip == 1
        assert gun.set_in_clip(3) and gun.set_in_clip(-1) and gun.in_clip is None

    def test_total_never_below_the_time_left(self):
        gun = GunState()
        gun.set_reload(5.0, None)
        assert gun.total == 5.0
        gun.set_reload(9.0, 2.0)
        assert gun.total == 9.0


class FormatTest(unittest.TestCase):

    def test_panel(self):
        text = format_panel(preview_gun(), Settings({}, SCHEMA), translator())
        assert u'Перезарядка 3.2 с' in text and u'Кассета 3/4' in text and '|' in text

    def test_ready_bar_and_template(self):
        gun = preview_gun()
        gun.set_reload(0, 7.8)
        assert u'Орудие готово' not in format_panel(gun, Settings({}, SCHEMA), translator())
        assert 'Gun ready' in format_panel(gun, Settings({'show_ready': True}, SCHEMA), translator('en'))
        gun.set_clip(1)
        assert format_panel(gun, Settings({}, SCHEMA), translator()) is None
        assert bar(0, 7.8).count('|') == BAR_WIDTH and bar(3.9, 7.8).count('|') == BAR_WIDTH
        custom = format_panel(preview_gun(), Settings({'template': '{left}/{total} {in_clip}'}, SCHEMA), translator())
        assert '3.2/7.8 3' in custom

    def test_preview_settings_and_strings(self):
        assert u'3.2' in preview_text(Settings({}, SCHEMA), translator())
        assert SETTINGS == ('battle_reload_timer',)
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
