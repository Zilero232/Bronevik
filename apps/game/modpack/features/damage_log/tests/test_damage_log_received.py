from __future__ import absolute_import, division, print_function, unicode_literals

import itertools
import unittest

from otmetki.features.damage_log.model import Hit
from otmetki.features.damage_log.model.constants import MAX_ENTRIES
from otmetki.features.damage_log.model.received import ReceivedLog, is_ricochet

PZ = 16
KV = 17
T34 = 18


def received_log():
    return ReceivedLog(itertools.count(1))


def pz(at=1.0, **details):
    return Hit(vehicle_id=PZ, vehicle='Pz. IV', vehicle_class='mediumTank', at=at, **details)


def kv(at=5.0, shell='ap'):
    return Hit(vehicle_id=KV, vehicle='KV-1', vehicle_class='heavyTank', shell=shell, at=at)


def segment(code, start=0x10, end=0x20):
    return code | (1 << 8) | (start << 16) | (end << 40)


class ReceivedLogTest(unittest.TestCase):

    def test_damage_keeps_the_attacker_the_shell_and_the_source(self):
        log = received_log()

        log.add_damage(390, pz(shell='he', gold=True, source='shot'))

        entry = log.entries[0]
        assert entry['outcome'] == 'pen'
        assert entry['damage'] == 390
        assert entry['vehicle'] == 'Pz. IV'
        assert entry['class'] == 'mediumTank'
        assert entry['shell'] == 'he'
        assert entry['gold']
        assert entry['source'] == 'shot'

    def test_an_unknown_class_and_source_are_dropped(self):
        log = received_log()

        log.add_damage(120, Hit(vehicle_class='warship', source='lava', at=1.0))

        assert log.entries[0]['class'] is None
        assert log.entries[0]['source'] is None

    def test_zero_damage_is_not_added(self):
        assert not received_log().add_damage(0, pz())

    def test_a_blocked_hit_keeps_the_blocked_damage(self):
        log = received_log()

        log.add_blocked(240, kv())

        assert log.entries[0]['outcome'] == 'blocked'
        assert log.entries[0]['damage'] == 240

    def test_keeps_the_last_entries(self):
        log = received_log()

        for index in range(MAX_ENTRIES + 5):
            log.add_damage(1, pz(at=float(index)))

        assert len(log.entries) == MAX_ENTRIES

    def test_rows_are_newest_first_and_keyed_by_their_order(self):
        log = received_log()
        log.add_damage(390, pz())
        log.add_blocked(240, kv())

        assert [row['id'] for row in log.rows()] == ['r2', 'r1']


class CritsTest(unittest.TestCase):

    def test_crits_right_after_a_pen_join_its_row(self):
        log = received_log()
        log.add_damage(390, pz())

        log.add_crits(pz(at=1.2), 2)

        assert len(log.entries) == 1
        assert log.entries[0]['crits'] == 2

    def test_crits_without_a_count_are_one(self):
        log = received_log()
        log.add_damage(390, pz())

        log.add_crits(pz(at=1.2), None)

        assert log.entries[0]['crits'] == 1

    def test_crits_long_after_the_pen_are_a_row_of_their_own(self):
        log = received_log()
        log.add_damage(390, pz())

        log.add_crits(pz(at=5.0), 1)

        assert [entry['outcome'] for entry in log.entries] == ['pen', 'crit']
        assert log.entries[1]['damage'] is None

    def test_a_crit_row_names_no_source(self):
        log = received_log()

        log.add_crits(pz(source='other'), 1)

        assert log.entries[0]['source'] is None


class RicochetTest(unittest.TestCase):

    def test_a_drawn_ricochet_turns_the_blocked_row(self):
        log = received_log()
        log.add_blocked(240, kv())

        turned = log.ricochet(kv(at=5.3))

        assert turned
        assert len(log.entries) == 1
        assert log.entries[0]['outcome'] == 'ricochet'
        assert log.entries[0]['damage'] == 240

    def test_a_drawn_ricochet_before_the_feedback_stands_as_its_own_row(self):
        log = received_log()

        log.ricochet(kv())

        assert log.entries[0]['outcome'] == 'ricochet'
        assert log.entries[0]['damage'] is None

    def test_blocked_damage_joins_an_earlier_ricochet(self):
        log = received_log()
        log.ricochet(kv())

        log.add_blocked(240, kv(at=5.2, shell='heat'))

        assert len(log.entries) == 1
        assert log.entries[0]['damage'] == 240
        assert log.entries[0]['shell'] == 'heat'

    def test_a_ricochet_takes_only_one_blocked_hit(self):
        log = received_log()
        log.ricochet(kv())
        log.add_blocked(240, kv(at=5.2))

        log.add_blocked(100, kv(at=5.4))

        assert [entry['outcome'] for entry in log.entries] == ['ricochet', 'blocked']

    def test_a_ricochet_from_another_attacker_does_not_turn_the_row(self):
        log = received_log()
        log.add_blocked(240, kv())

        log.ricochet(Hit(vehicle_id=T34, at=5.1))

        assert [entry['outcome'] for entry in log.entries] == ['blocked', 'ricochet']

    def test_a_late_ricochet_does_not_turn_the_row(self):
        log = received_log()
        log.add_blocked(240, kv())

        log.ricochet(kv(at=9.0))

        assert log.entries[0]['outcome'] == 'blocked'

    def test_a_ricochet_without_an_attacker_is_ignored(self):
        log = received_log()

        assert not log.ricochet(Hit(at=5.0))

    def test_a_shot_ending_in_a_ricochet_is_a_ricochet(self):
        assert is_ricochet([segment(4), segment(1)])

    def test_a_shot_ending_in_a_pen_is_not_a_ricochet(self):
        assert not is_ricochet([segment(1), segment(4)])

    def test_a_last_point_without_length_is_skipped(self):
        assert is_ricochet([segment(2), segment(4, 0x10, 0x10)])

    def test_no_points_is_not_a_ricochet(self):
        assert not is_ricochet([])

    def test_missing_points_is_not_a_ricochet(self):
        assert not is_ricochet(None)


class AmmoRackTest(unittest.TestCase):

    def test_ammo_rack_after_the_hit_marks_that_hit(self):
        log = received_log()
        log.add_damage(310, pz(at=20.0))

        marked = log.ammo_rack_hit(20.4)

        assert marked
        assert log.entries[-1]['ammo_rack']

    def test_ammo_rack_without_a_hit_nearby_marks_nothing_yet(self):
        log = received_log()
        log.add_damage(310, pz(at=20.0))

        assert not log.ammo_rack_hit(40.0)

    def test_ammo_rack_before_the_hit_marks_the_next_hit(self):
        log = received_log()
        log.ammo_rack_hit(40.0)

        log.add_damage(200, pz(at=40.9))

        assert log.entries[-1]['ammo_rack']

    def test_a_hit_long_after_the_ammo_rack_is_not_marked(self):
        log = received_log()
        log.ammo_rack_hit(40.0)

        log.add_damage(150, pz(at=60.0))

        assert not log.entries[-1]['ammo_rack']


if __name__ == '__main__':
    unittest.main()
