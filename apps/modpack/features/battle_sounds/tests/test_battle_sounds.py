from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.core.settings import Settings
from otmetki.features.battle_sounds.i18n import STRINGS
from otmetki.features.battle_sounds.model import KillFeed, SoundPicker, device_change, device_event
from otmetki.features.battle_sounds.settings import EVENTS, SCHEMA, SETTINGS


class DeviceTest(unittest.TestCase):

    def test_events(self):
        assert device_event('ammoBay', 'critical') == 'ammo_rack'
        assert device_event('ammoBay', 'destroyed') == 'ammo_rack'
        assert device_event('engine', 'critical') == 'module_critical'
        assert device_event('leftTrack0', 'destroyed') == 'module_destroyed'
        assert device_event('gunner1', 'destroyed') == 'crew_injured'
        assert device_event('commander', 'critical') is None
        assert device_event('engine', 'repaired') is None and device_event('engine', 'normal') is None
        assert device_event(None, 'critical') is None

    def test_value_shape(self):
        assert device_change(('engine', 'critical', 'critical')) == ('engine', 'critical')
        assert device_change(True) == (None, None)


class KillFeedTest(unittest.TestCase):

    def test_first_blood_frag_death(self):
        feed = KillFeed(7)
        assert feed.killed(20, 30) == ['first_blood']
        assert feed.killed(21, 7) == ['own_frag']
        assert feed.killed(7, 22) == ['own_death']
        assert KillFeed(7).killed(21, 7) == ['first_blood', 'own_frag']


class PickerTest(unittest.TestCase):

    def test_cooldown_and_empty(self):
        picker = SoundPicker(Settings({'fire': 'mod_fire', 'cooldown_s': 3}, SCHEMA))
        assert picker.pick('fire', 10.0) == 'mod_fire'
        assert picker.pick('fire', 11.0) is None
        assert picker.pick('fire', 13.5) == 'mod_fire'
        assert picker.pick('ammo_rack', 13.5) is None

    def test_names_are_restricted(self):
        settings = Settings({'fire': 'bad name', 'own_frag': 'ok_01'}, SCHEMA)
        assert settings.get('fire') == '' and settings.get('own_frag') == 'ok_01'
        assert SETTINGS == ('battle_sounds',)

    def test_every_event_has_a_label(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])
        for event in EVENTS:
            assert 'battle_sounds_' + event in STRINGS['ru']


if __name__ == '__main__':
    unittest.main()
