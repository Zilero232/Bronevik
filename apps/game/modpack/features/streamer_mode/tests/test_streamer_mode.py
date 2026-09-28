# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.streamer_mode.i18n import STRINGS
from otmetki.features.streamer_mode.model import PanelToggle, blocked_labels, hides_chat, hotkey_of
from otmetki.features.streamer_mode.model.constants import HOTKEY_CHOICES, PRIVATE_HANGAR_LABELS
from otmetki.features.streamer_mode.settings import SCHEMA, SETTINGS


class StreamerModeTest(unittest.TestCase):

    def test_hotkeys(self):
        assert hotkey_of('ctrl_shift_h') == ('KEY_H', ('KEY_LCONTROL', 'KEY_LSHIFT'))
        assert hotkey_of('f10') == ('KEY_F10', ())
        assert hotkey_of('none') == (None, ()) and hotkey_of('bogus') == (None, ())
        assert Settings({'hotkey': 'bogus'}, SCHEMA).get('hotkey') == 'ctrl_shift_h'

    def test_private_mode(self):
        assert blocked_labels(Settings({}, SCHEMA)) == ()
        assert blocked_labels(Settings({'private': True}, SCHEMA)) == PRIVATE_HANGAR_LABELS
        assert blocked_labels(Settings({'private': True, 'hide_hangar_stats': False}, SCHEMA)) == ()
        assert hides_chat(Settings({'private': True}, SCHEMA), True)
        assert not hides_chat(Settings({'private': True}, SCHEMA), False)
        assert not hides_chat(Settings({'private': True, 'hide_chat': False}, SCHEMA), True)

    def test_toggle(self):
        toggle = PanelToggle()
        assert toggle.toggle() and not toggle.toggle() and toggle.toggle()
        assert toggle.battle_started(True) and not toggle.battle_started(False)

    def test_settings_and_strings(self):
        assert SETTINGS == ('streamer_mode',)
        for choice in HOTKEY_CHOICES:
            assert 'streamer_mode_hotkey_' + choice in STRINGS['ru']
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])
        assert _support.translator(STRINGS, 'en')('streamer_mode_hidden', hotkey='F9').endswith('(F9 brings them back)')


if __name__ == '__main__':
    unittest.main()
