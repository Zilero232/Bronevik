from __future__ import absolute_import, division, print_function, unicode_literals

import itertools
import unittest

from otmetki.features.damage_log.model import Hit
from otmetki.features.damage_log.model.shots import ShotLog, own_shot_health

OWN_VEHICLE = 101
TIGER = 202
IS = 303


class VehicleInfo(object):

    def __init__(self, vehicle_id):
        self.vehicleID = vehicle_id


def shot_log():
    return ShotLog(itertools.count(1))


def add_damage(log, target, amount, at, **details):
    return log.add_damage(amount, Hit(vehicle_id=target, at=at, **details))


def merged_pen():
    log = shot_log()
    log.add_result(TIGER, 'pen', 10.0, 'Tiger')
    add_damage(log, TIGER, 390, 10.5, shell='ap', gold=True)
    log.add_crits(TIGER, 2, 10.6)
    log.set_health(TIGER, 1110, 10.7)
    return log


def mixed_battle():
    log = shot_log()
    log.add_result(TIGER, 'pen', 1.0, 'Tiger')
    add_damage(log, TIGER, 390, 1.1)
    log.add_result(IS, 'ricochet', 3.0, 'IS')
    log.add_result(TIGER, 'crit', 6.0, 'Tiger')
    add_damage(log, TIGER, 410, 6.1)
    log.set_health(TIGER, 300, 6.2)
    log.add_result(TIGER, 'spaced', 9.0, 'Tiger')
    return log


class ShotLogTest(unittest.TestCase):

    def test_result_damage_crits_and_health_of_one_shot_merge_into_one_entry(self):
        log = merged_pen()

        entry = log.entries[0]
        assert len(log.entries) == 1
        assert entry['outcome'] == 'pen'
        assert entry['damage'] == 390
        assert entry['crits'] == 2
        assert entry['hp'] == 1110
        assert entry['shell'] == 'ap'
        assert entry['gold']

    def test_damage_without_a_marker_makes_a_pen(self):
        log = shot_log()

        added = add_damage(log, TIGER, 200, 1.0, vehicle='Tiger')

        assert added
        assert log.entries[0]['outcome'] == 'pen'
        assert log.entries[0]['vehicle'] == 'Tiger'

    def test_fire_damage_is_a_row_of_its_own(self):
        log = shot_log()
        log.add_result(TIGER, 'no_pen', 1.0)

        add_damage(log, TIGER, 30, 1.1, source='fire')

        assert [(entry['outcome'], entry['source']) for entry in log.entries] == [('no_pen', 'shot'), (None, 'fire')]

    def test_a_marker_does_not_join_fire_damage(self):
        log = shot_log()
        add_damage(log, TIGER, 30, 1.0, source='fire')

        log.add_result(TIGER, 'pen', 1.1)

        assert len(log.entries) == 2

    def test_a_shell_without_a_code_is_not_gold(self):
        log = shot_log()

        add_damage(log, TIGER, 200, 1.0, shell='weird', gold=True)

        assert not log.entries[0]['gold']

    def test_damage_after_the_merge_window_is_a_new_entry(self):
        log = shot_log()
        log.add_result(TIGER, 'ricochet', 1.0, 'Tiger')
        log.add_result(IS, 'no_pen', 1.2, 'IS')

        add_damage(log, TIGER, 150, 5.0)

        assert [entry['outcome'] for entry in log.entries] == ['ricochet', 'no_pen', 'pen']

    def test_crits_after_the_merge_window_are_dropped(self):
        log = shot_log()
        log.add_result(IS, 'no_pen', 1.2, 'IS')

        assert not log.add_crits(IS, 1, 10.0)

    def test_health_after_the_merge_window_is_dropped(self):
        log = shot_log()
        log.add_result(IS, 'no_pen', 1.2, 'IS')

        assert not log.set_health(IS, 5, 10.0)

    def test_he_splash_on_a_no_pen_keeps_the_outcome(self):
        log = shot_log()
        log.add_result(TIGER, 'no_pen', 1.0)

        add_damage(log, TIGER, 45, 1.3, shell='he')

        assert log.entries[0]['outcome'] == 'no_pen'
        assert log.entries[0]['damage'] == 45

    def test_marker_after_the_damage_event_names_the_same_hit(self):
        log = shot_log()
        add_damage(log, TIGER, 390, 1.0, vehicle='Tiger', shell='ap')

        log.add_result(TIGER, 'crit', 1.2, 'Tiger')

        assert len(log.entries) == 1
        assert log.entries[0]['outcome'] == 'crit'
        assert log.entries[0]['damage'] == 390

    def test_a_second_marker_after_the_merged_one_is_a_new_hit(self):
        log = shot_log()
        add_damage(log, TIGER, 390, 1.0, vehicle='Tiger', shell='ap')
        log.add_result(TIGER, 'crit', 1.2, 'Tiger')

        log.add_result(TIGER, 'ricochet', 1.5)

        assert len(log.entries) == 2

    def test_damage_skips_a_ricochet_of_the_same_target(self):
        log = shot_log()
        log.add_result(TIGER, 'ricochet', 1.0)

        add_damage(log, TIGER, 300, 1.5)

        assert [(entry['outcome'], entry['damage']) for entry in log.entries] == [('ricochet', None), ('pen', 300)]

    def test_two_shots_in_one_window_keep_their_damage(self):
        log = shot_log()
        log.add_result(TIGER, 'pen', 1.0)
        log.add_result(TIGER, 'pen', 1.4)

        add_damage(log, TIGER, 390, 1.5)
        add_damage(log, TIGER, 400, 1.6)

        assert sorted(entry['damage'] for entry in log.entries) == [390, 400]

    def test_rejects_an_unknown_outcome(self):
        assert not shot_log().add_result(TIGER, 'lucky', 1.0)

    def test_rejects_a_result_without_a_target(self):
        assert not shot_log().add_result(None, 'pen', 1.0)

    def test_rejects_zero_damage(self):
        assert not add_damage(shot_log(), TIGER, 0, 1.0)

    def test_rejects_zero_crits(self):
        assert not shot_log().add_crits(TIGER, 0, 1.0)

    def test_rejects_health_that_is_not_a_number(self):
        assert not shot_log().set_health(TIGER, 'x', 1.0)

    def test_describe_keeps_the_class_and_the_max_hp(self):
        log = shot_log()

        log.describe(TIGER, 'heavyTank', 1500)

        assert log.targets[TIGER] == {'class': 'heavyTank', 'max': 1500}


class RowsTest(unittest.TestCase):

    def test_rows_are_newest_first(self):
        outcomes = [row['outcome'] for row in mixed_battle().rows()]

        assert outcomes == ['spaced', 'crit', 'ricochet', 'pen']

    def test_a_shot_row_is_keyed_by_its_order(self):
        ids = [row['id'] for row in mixed_battle().rows()]

        assert ids == ['s4', 's3', 's2', 's1']

    def test_groups_are_newest_target_first(self):
        groups = mixed_battle().grouped_rows()

        assert [group['vehicle'] for group in groups] == ['Tiger', 'IS']

    def test_a_group_sums_the_hits_of_its_target(self):
        tiger = mixed_battle().grouped_rows()[0]

        assert tiger['hits'] == 3
        assert tiger['damage'] == 800
        assert tiger['hp'] == 300
        assert tiger['outcome'] == 'spaced'

    def test_a_group_without_damage_has_none(self):
        ricochets = mixed_battle().grouped_rows()[1]

        assert ricochets['damage'] is None

    def test_a_group_is_keyed_anew_by_every_hit(self):
        log = mixed_battle()
        before = log.grouped_rows()[0]['id']

        log.add_result(TIGER, 'ricochet', 20.0)

        assert before != log.grouped_rows()[0]['id']


class OwnShotHealthTest(unittest.TestCase):

    def test_health_after_the_players_own_shot(self):
        assert own_shot_health((510, VehicleInfo(OWN_VEHICLE), 0), OWN_VEHICLE) == 510

    def test_nothing_after_an_allys_shot(self):
        assert own_shot_health((510, VehicleInfo(IS), 0), OWN_VEHICLE) is None

    def test_nothing_without_an_attacker(self):
        assert own_shot_health((510, None, 0), OWN_VEHICLE) is None

    def test_nothing_from_a_short_payload(self):
        assert own_shot_health((510,), OWN_VEHICLE) is None

    def test_nothing_from_a_bare_number(self):
        assert own_shot_health(510, OWN_VEHICLE) is None

    def test_nothing_before_the_own_vehicle_is_known(self):
        assert own_shot_health((510, VehicleInfo(OWN_VEHICLE), 0), None) is None


if __name__ == '__main__':
    unittest.main()
