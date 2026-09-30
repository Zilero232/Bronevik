from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.core.settings import Settings
from otmetki.features.auto_reserves.i18n import STRINGS
from otmetki.features.auto_reserves.model import (
    CHECK_EVERY_S,
    REFUSE_FULL,
    REFUSE_NOTHING,
    REFUSE_UNSET,
    is_due,
    pick,
    wanted_kinds,
)
from otmetki.features.auto_reserves.settings import DEFAULTS, SCHEMA, SETTINGS


def booster(booster_id, kind='credits', active=False, ready=True, value=50, expires=0):
    return {'id': booster_id, 'kind': kind, 'active': active, 'ready': ready, 'value': value, 'expires': expires}


def chosen(**values):
    return Settings(values, SCHEMA).to_dict()


class DefaultsTest(unittest.TestCase):

    def test_no_reserve_is_picked_by_default(self):
        assert wanted_kinds(chosen()) == []
        assert DEFAULTS['when'] == 'session'

    def test_nothing_is_activated_by_default(self):
        assert pick([booster(1)], chosen()) == ([], REFUSE_UNSET)

    def test_the_component_switch_is_hangar_auto_reserves(self):
        assert SETTINGS == ('hangar_auto_reserves',)

    def test_both_languages_have_the_same_strings(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


class PickTest(unittest.TestCase):

    def test_the_strongest_ready_reserve_of_a_picked_kind_goes_on(self):
        boosters = [booster(1, value=50), booster(2, value=100), booster(3, kind='xp', value=300)]

        assert pick(boosters, chosen(reserve_credits=True)) == ([2], None)

    def test_among_equals_the_one_that_expires_first_goes_on(self):
        boosters = [booster(1, expires=0), booster(2, expires=2000), booster(3, expires=1000)]

        assert pick(boosters, chosen(reserve_credits=True)) == ([3], None)

    def test_a_kind_already_on_is_left_alone(self):
        boosters = [booster(1, active=True, ready=False), booster(2)]

        assert pick(boosters, chosen(reserve_credits=True)) == ([], REFUSE_NOTHING)

    def test_reserves_not_ready_are_skipped(self):
        assert pick([booster(1, ready=False)], chosen(reserve_credits=True)) == ([], REFUSE_NOTHING)

    def test_no_more_than_the_free_slots(self):
        boosters = [
            booster(1, kind='xp', active=True, ready=False),
            booster(2, kind='free_xp', active=True, ready=False),
            booster(3, kind='credits'),
            booster(4, kind='crew_xp'),
        ]

        assert pick(boosters, chosen(reserve_credits=True, reserve_crew_xp=True)) == ([3], None)

    def test_every_slot_taken_is_refused_as_full(self):
        active = [booster(index, kind='xp', active=True, ready=False) for index in (1, 2, 3)]

        assert pick(active + [booster(9)], chosen(reserve_credits=True)) == ([], REFUSE_FULL)

    def test_broken_rows_are_dropped(self):
        rows = [None, {'id': 'x', 'kind': 'credits'}, {'id': 1, 'kind': 'gold'}, booster(True)]

        assert pick(rows, chosen(reserve_credits=True)) == ([], REFUSE_NOTHING)


class DueTest(unittest.TestCase):

    def test_the_first_hangar_of_the_session_is_due(self):
        assert is_due(chosen(), 100.0, 0.0, False)

    def test_after_the_session_start_only_the_expiry_mode_looks_again(self):
        assert not is_due(chosen(), 1000.0, 0.0, True)
        assert is_due(chosen(when='expiry'), CHECK_EVERY_S, 0.0, True)
        assert not is_due(chosen(when='expiry'), CHECK_EVERY_S - 1, 0.0, True)


if __name__ == '__main__':
    unittest.main()
