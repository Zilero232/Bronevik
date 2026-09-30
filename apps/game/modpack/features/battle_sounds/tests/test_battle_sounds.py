from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.core.settings import Settings
from otmetki.features.battle_sounds.i18n import STRINGS
from otmetki.features.battle_sounds.model import KillFeed, SoundPicker, device_change, device_event
from otmetki.features.battle_sounds.settings import EVENTS, SCHEMA, SETTINGS


def picker_after_fire():
    picker = SoundPicker(Settings({'fire': 'mod_fire', 'cooldown_s': 3}, SCHEMA))
    picker.pick('fire', 10.0)
    return picker


def feed_after_first_blood():
    feed = KillFeed(7)
    feed.killed(20, 30)
    return feed


class DeviceTest(unittest.TestCase):

    def test_a_critical_ammo_rack_is_the_ammo_rack_event(self):
        assert device_event('ammoBay', 'critical') == 'ammo_rack'

    def test_a_destroyed_ammo_rack_is_the_ammo_rack_event(self):
        assert device_event('ammoBay', 'destroyed') == 'ammo_rack'

    def test_a_critical_module(self):
        assert device_event('engine', 'critical') == 'module_critical'

    def test_a_destroyed_module_with_a_numbered_name(self):
        assert device_event('leftTrack0', 'destroyed') == 'module_destroyed'

    def test_a_destroyed_crew_member_is_injured(self):
        assert device_event('gunner1', 'destroyed') == 'crew_injured'

    def test_a_critical_crew_member_plays_nothing(self):
        assert device_event('commander', 'critical') is None

    def test_a_repaired_module_plays_nothing(self):
        assert device_event('engine', 'repaired') is None

    def test_a_normal_module_plays_nothing(self):
        assert device_event('engine', 'normal') is None

    def test_no_device_plays_nothing(self):
        assert device_event(None, 'critical') is None

    def test_the_change_is_the_device_and_its_state(self):
        assert device_change(('engine', 'critical', 'critical')) == ('engine', 'critical')

    def test_a_value_of_another_shape_is_no_change(self):
        assert device_change(True) == (None, None)


class KillFeedTest(unittest.TestCase):

    def test_the_first_kill_is_first_blood(self):
        assert KillFeed(7).killed(20, 30) == ['first_blood']

    def test_an_own_frag_after_first_blood(self):
        assert feed_after_first_blood().killed(21, 7) == ['own_frag']

    def test_the_own_death(self):
        assert feed_after_first_blood().killed(7, 22) == ['own_death']

    def test_an_own_first_frag_is_both_events(self):
        assert KillFeed(7).killed(21, 7) == ['first_blood', 'own_frag']


class PickerTest(unittest.TestCase):

    def test_a_chosen_sound_plays(self):
        picker = SoundPicker(Settings({'fire': 'mod_fire', 'cooldown_s': 3}, SCHEMA))

        assert picker.pick('fire', 10.0) == 'mod_fire'

    def test_the_same_sound_waits_for_its_cooldown(self):
        assert picker_after_fire().pick('fire', 11.0) is None

    def test_the_sound_plays_again_after_its_cooldown(self):
        assert picker_after_fire().pick('fire', 13.5) == 'mod_fire'

    def test_an_event_without_a_sound_plays_nothing(self):
        assert picker_after_fire().pick('ammo_rack', 13.5) is None


class SettingsTest(unittest.TestCase):

    def test_a_sound_name_with_a_space_is_dropped(self):
        assert Settings({'fire': 'bad name'}, SCHEMA).get('fire') == ''

    def test_a_plain_sound_name_is_kept(self):
        assert Settings({'own_frag': 'ok_01'}, SCHEMA).get('own_frag') == 'ok_01'

    def test_the_component_switch_is_battle_sounds(self):
        assert SETTINGS == ('battle_sounds',)

    def test_both_languages_have_the_same_strings(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])

    def test_every_event_has_a_label(self):
        for event in EVENTS:
            assert 'battle_sounds_' + event in STRINGS['ru']


if __name__ == '__main__':
    unittest.main()
