from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.core.settings import Settings
from otmetki.features.responsive_reticle.i18n import STRINGS
from otmetki.features.responsive_reticle.model import (
    TickCache,
    TickGate,
    argument_names,
    frame_time_diff,
    realm_of,
    relax_time,
    server_tick,
    skip_reason,
    supports_rotate,
)
from otmetki.features.responsive_reticle.settings import SCHEMA, SETTINGS
from otmetki.features.responsive_reticle.settings.constants import CHOICES


class Rotator(object):

    def lesta_rotate(self, shotPoint, timeDiff):
        return shotPoint, timeDiff

    def other_rotate(self, shotPoint, timeDiff, gunIndex):
        return gunIndex


class RealmTest(unittest.TestCase):

    def test_the_ru_realm_is_lesta(self):
        assert realm_of('RU') == 'lesta'

    def test_any_other_realm_is_wg(self):
        assert realm_of('EU') == 'wg'

    def test_an_unknown_realm_is_wg(self):
        assert realm_of(None) == 'wg'


class RotateSignatureTest(unittest.TestCase):

    def test_the_names_after_self_are_read_from_a_method(self):
        assert argument_names(Rotator.lesta_rotate) == ('shotPoint', 'timeDiff')

    def test_the_lesta_signature_is_supported_on_lesta(self):
        assert supports_rotate(argument_names(Rotator.lesta_rotate), 'lesta')

    def test_the_known_signature_is_expected_on_wg(self):
        assert supports_rotate(('shotPoint', 'timeDiff'), 'wg')

    def test_another_signature_keeps_the_component_off(self):
        assert not supports_rotate(argument_names(Rotator.other_rotate), 'lesta')

    def test_something_that_is_not_a_function_has_no_names(self):
        assert argument_names(None) == ()


class SkipTest(unittest.TestCase):

    def test_a_replay_is_skipped(self):
        assert skip_reason(True, (), None) == 'replay'

    def test_an_spg_is_skipped(self):
        assert skip_reason(False, frozenset(['SPG']), None) == 'artillery'

    def test_a_gun_without_traverse_is_skipped(self):
        assert skip_reason(False, (), 0.0) == 'fixed yaw'

    def test_a_tank_in_a_battle_runs(self):
        assert skip_reason(False, frozenset(['mediumTank']), None) is None


class FrameTest(unittest.TestCase):

    def test_the_server_tick_is_the_tenth_of_a_second(self):
        assert server_tick(12.34) == 123

    def test_no_clock_has_no_tick(self):
        assert server_tick(None) is None

    def test_a_frame_turns_by_the_time_since_the_last_turn(self):
        assert abs(frame_time_diff(10.016, 10.0) - 0.016) < 1e-9

    def test_a_frame_right_after_the_last_turn_is_skipped(self):
        assert frame_time_diff(10.0, 10.0) is None

    def test_a_long_pause_is_capped_like_the_stock_rotator(self):
        assert frame_time_diff(12.0, 10.0) == 0.2

    def test_a_rotator_that_never_turned_is_left_to_the_stock_tick(self):
        assert frame_time_diff(10.0, None) is None

    def test_the_instant_marker_relaxes_within_the_frame(self):
        assert relax_time('instant', 0.007) == 0.007

    def test_the_smooth_marker_relaxes_over_half_a_tick(self):
        assert relax_time('smooth', 0.007) == 0.05


class TickCacheTest(unittest.TestCase):

    def test_the_value_is_computed_once_per_tick(self):
        cache = TickCache()
        calls = []

        values = [cache.get(5, lambda: calls.append(1) or len(calls)) for _ in range(3)]

        assert values == [1, 1, 1]

    def test_a_new_tick_computes_again(self):
        cache = TickCache()
        cache.get(5, lambda: 'old')

        assert cache.get(6, lambda: 'new') == 'new'

    def test_a_cleared_cache_computes_again(self):
        cache = TickCache()
        cache.get(5, lambda: 'old')
        cache.clear()

        assert cache.get(5, lambda: 'new') == 'new'


class TickGateTest(unittest.TestCase):

    def test_the_first_call_of_a_tick_goes_through(self):
        assert TickGate().allow('client', 7)

    def test_a_second_call_in_the_same_tick_is_held(self):
        gate = TickGate()
        gate.allow('client', 7)

        assert not gate.allow('client', 7)

    def test_each_marker_has_its_own_gate(self):
        gate = TickGate()
        gate.allow('client', 7)

        assert gate.allow('dual_acc', 7)

    def test_the_next_tick_goes_through_again(self):
        gate = TickGate()
        gate.allow('client', 7)

        assert gate.allow('client', 8)


class SettingsTest(unittest.TestCase):

    def test_the_switch_is_battle_responsive_reticle(self):
        assert SETTINGS == ('battle_responsive_reticle',)

    def test_the_marker_follows_at_once_by_default(self):
        assert Settings({}, SCHEMA).get('follow') == 'instant'

    def test_every_follow_mode_has_a_label(self):
        for mode in CHOICES['follow']:
            assert 'responsive_reticle_follow_' + mode in STRINGS['en']

    def test_both_languages_have_the_same_strings(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
