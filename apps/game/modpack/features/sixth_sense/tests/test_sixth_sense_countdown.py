# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.features.sixth_sense.model import SixthSense, lamp_duration
from otmetki.features.sixth_sense.model.constants import ENDED, OBSERVED


def lit_lamp(duration=10.0):
    lamp = SixthSense()
    lamp.vehicle_state(OBSERVED, True, 100.0, duration)
    return lamp


def ticks(lamp, moments):
    return [moment for moment in moments if lamp.tick_due(moment)]


class LampDurationTest(unittest.TestCase):

    def test_base_own_spotting_time_without_the_radio(self):
        duration = lamp_duration(0, 0.0)

        assert duration == 10.0

    def test_improved_radio_communication_in_a_plain_slot(self):
        duration = lamp_duration(0, 1.5)

        assert duration == 8.5

    def test_improved_radio_communication_in_its_specialisation_slot(self):
        duration = lamp_duration(0, 2.0)

        assert duration == 8.0

    def test_a_missing_attribute_counts_as_no_decrease(self):
        duration = lamp_duration(0, None)

        assert duration == 10.0

    def test_the_players_own_time_wins_over_the_vehicle(self):
        duration = lamp_duration(6, 2.0)

        assert duration == 6.0

    def test_never_below_zero(self):
        duration = lamp_duration(0, 12.0)

        assert duration == 0.0


class CountdownTest(unittest.TestCase):

    def test_seconds_left_drain_over_the_lamp_duration(self):
        lamp = lit_lamp(8.5)

        seconds_left = lamp.seconds_left(103.0)

        assert seconds_left == 5.5

    def test_one_tick_per_whole_second_down_to_one(self):
        lamp = lit_lamp(10.0)

        moments = [100.0 + half / 2.0 for half in range(0, 24)]

        assert ticks(lamp, moments) == [101.0, 102.0, 103.0, 104.0, 105.0, 106.0, 107.0, 108.0, 109.0]

    def test_ticks_follow_the_shown_number_of_a_fractional_duration(self):
        lamp = lit_lamp(8.5)

        moments = [100.0 + half / 2.0 for half in range(0, 6)]

        assert ticks(lamp, moments) == [100.5, 101.5, 102.5]

    def test_the_same_second_ticks_once(self):
        lamp = lit_lamp(10.0)
        lamp.tick_due(101.0)

        is_tick_due = lamp.tick_due(101.4)

        assert not is_tick_due

    def test_an_unlit_lamp_never_ticks(self):
        lamp = SixthSense()

        is_tick_due = lamp.tick_due(101.0)

        assert not is_tick_due

    def test_a_new_detection_restarts_the_countdown(self):
        lamp = lit_lamp(10.0)
        lamp.tick_due(105.0)
        lamp.vehicle_state(OBSERVED, False, 106.0)
        lamp.vehicle_state(OBSERVED, True, 200.0, 8.0)

        moments = [200.5, 201.0, 202.0]

        assert ticks(lamp, moments) == [201.0, 202.0]


class HideConditionsTest(unittest.TestCase):

    def test_detection_shows_the_lamp(self):
        lamp = SixthSense()

        change = lamp.vehicle_state(OBSERVED, True, 100.0, 10.0)

        assert change == 'show'
        assert lamp.duration == 10.0

    def test_losing_detection_hides_the_lamp(self):
        lamp = lit_lamp()

        change = lamp.vehicle_state(OBSERVED, False, 104.0)

        assert change == 'hide'
        assert not lamp.lit

    def test_switch_respawn_or_destruction_hides_the_lamp(self):
        lamp = lit_lamp()

        change = lamp.vehicle_state(ENDED, 0, 104.0)

        assert change == 'hide'
        assert not lamp.lit

    def test_the_lamp_lights_again_after_a_respawn(self):
        lamp = lit_lamp()
        lamp.vehicle_state(ENDED, 0, 104.0)

        change = lamp.vehicle_state(OBSERVED, True, 130.0, 10.0)

        assert change == 'show'

    def test_other_states_leave_the_lamp_alone(self):
        lamp = lit_lamp()

        change = lamp.vehicle_state(None, 1, 104.0)

        assert change is None
        assert lamp.lit

    def test_the_finished_round_puts_the_lamp_out_for_good(self):
        lamp = lit_lamp()
        lamp.finish()

        change = lamp.vehicle_state(OBSERVED, True, 110.0, 10.0)

        assert change is None
        assert not lamp.lit


if __name__ == '__main__':
    unittest.main()
