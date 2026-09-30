# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _feedback as fb
import _support  # noqa: F401
from otmetki.core.battle_tally import (
    EFFICIENCY_KEYS,
    EVENT_KEYS,
    MARKER_OUTCOMES,
    BattleTally,
    Counters,
    assist_with_stun,
    efficiency_totals,
    own_damage,
)
from otmetki.core.client.game import values_by_name
from otmetki.core.compat import call
from otmetki.core.shells import shell_code

K = fb.BATTLE_EVENT_TYPE
EFFICIENCY_TYPE = fb.PERSONAL_EFFICIENCY_TYPE
ENEMY = 202
ENEMY_2 = 203
ALLY = 11
KINDS = values_by_name(K, EVENT_KEYS)
MARKERS = values_by_name(fb.FEEDBACK_EVENT_ID, MARKER_OUTCOMES)
EFFICIENCY = values_by_name(EFFICIENCY_TYPE, EFFICIENCY_KEYS)
BATTLE_MARKERS = (
    'VEHICLE_ARMOR_PIERCED',
    'VEHICLE_RICOCHET',
    'VEHICLE_HIT',
    'VEHICLE_CRITICAL_HIT',
    'VEHICLE_ARMOR_SCREEN_BLOCKED',
)


def is_enemy(vehicle_id):
    return vehicle_id in (ENEMY, ENEMY_2)


def dealt_events():
    return [
        fb.damage(K.DAMAGE, ENEMY, 390, shell=fb.SHELL['ARMOR_PIERCING']),
        fb.crits(K.CRIT, ENEMY, 2),
        fb.damage(K.DAMAGE, ENEMY_2, 120, shell=fb.SHELL['HE_MODERN']),
        fb.damage(K.DAMAGE, ENEMY_2, 60, shell=fb.SHELL['HE_MODERN']),
    ]


def assist_and_received_events():
    return [
        fb.damage(K.RADIO_ASSIST, ENEMY, 300),
        fb.damage(K.TRACK_ASSIST, ENEMY_2, 150),
        fb.damage(K.STUN_ASSIST, ENEMY, 80),
        fb.damage(K.TANKING, ENEMY, 440, shell=fb.SHELL['ARMOR_PIERCING_CR']),
        fb.damage(K.RECEIVED_DAMAGE, ENEMY, 310, shell=fb.SHELL['HOLLOW_CHARGE']),
        fb.damage(K.RECEIVED_DAMAGE, ENEMY, 45, reason='fire'),
        fb.damage(K.RECEIVED_DAMAGE, ALLY, 20, reason='ramming'),
        fb.event(K.KILL, ENEMY_2),
    ]


def played_battle():
    tally = BattleTally()
    for name in BATTLE_MARKERS:
        tally.add_marker(MARKERS[getattr(fb.FEEDBACK_EVENT_ID, name)])
    tally.add_events(dealt_events(), KINDS, is_enemy)
    tally.add_events(assist_and_received_events(), KINDS, is_enemy)
    return tally


def vanilla_totals():
    totals = {
        EFFICIENCY_TYPE.DAMAGE: 900,
        EFFICIENCY_TYPE.ASSIST_DAMAGE: 450,
        EFFICIENCY_TYPE.RECEIVED_CRITICAL_HITS: 3,
    }
    return efficiency_totals(totals, EFFICIENCY)


def mixed_damage_events():
    return [
        fb.damage(K.DAMAGE, ENEMY, 390),
        fb.damage(K.DAMAGE, ALLY, 50),
        fb.damage(K.RADIO_ASSIST, ENEMY, 300),
        fb.damage(K.DAMAGE, ENEMY_2, 120),
    ]


def damage_and_frags_counters():
    return Counters(('damage', 'frags'))


class Target(object):

    def double(self, value):
        return value * 2

    def broken(self):
        raise RuntimeError('client API drift')


class FixtureTest(unittest.TestCase):

    def test_packed_damage_decodes_like_the_client(self):
        packed = fb.damage(K.DAMAGE, ENEMY, 390, shell=fb.SHELL['ARMOR_PIERCING'], gold=True)

        extra = packed.getExtra()

        assert extra.getDamage() == 390
        assert extra.isShot()
        assert not extra.isFire()
        assert extra.isShellGold()
        assert shell_code(extra.getShellType()) == 'ap'

    def test_fire_damage_has_no_shell(self):
        packed = fb.damage(K.RECEIVED_DAMAGE, ENEMY, 40, reason='fire')

        assert packed.getExtra().getShellType() is None

    def test_packed_crits_decode_their_count(self):
        packed = fb.crits(K.CRIT, ENEMY, 2)

        assert packed.getExtra().getCritsCount() == 2

    def test_every_marker_name_is_a_client_feedback_id(self):
        assert len(MARKERS) == len(MARKER_OUTCOMES)

    def test_marker_ids_map_to_outcomes(self):
        assert MARKERS[fb.FEEDBACK_EVENT_ID.VEHICLE_ARMOR_PIERCED] == 'pen'
        assert MARKERS[fb.FEEDBACK_EVENT_ID.VEHICLE_CRITICAL_HIT_CHASSIS] == 'tracks'


class BattleTallyTest(unittest.TestCase):

    def test_counts_markers_events_and_edge_cases(self):
        values = played_battle().values()

        assert values['hits'] == 5
        assert values['pens'] == 2
        assert values['ricochets'] == 1
        assert values['dealt'] == 570
        assert values['damaging_hits'] == 3
        assert values['assist'] == 450
        assert values['stun'] == 80
        assert values['blocked'] == 440
        assert values['received'] == 375

    def test_ally_damage_and_assist_are_not_counted(self):
        tally = BattleTally()
        events = [fb.damage(K.DAMAGE, ALLY, 50), fb.damage(K.RADIO_ASSIST, ALLY, 90)]

        added = tally.add_events(events, KINDS, is_enemy)

        assert added == 0
        assert tally.values()['dealt'] == 0

    def test_zero_damage_and_unknown_kinds_add_nothing(self):
        tally = BattleTally()
        events = [fb.damage(K.DAMAGE, ENEMY, 0), fb.event(K.MULTI_STUN, ENEMY, 3)]

        tally.add_events(events, KINDS, is_enemy)

        assert tally.values()['dealt'] == 0

    def test_vanilla_totals_are_a_floor_after_own_death(self):
        tally = played_battle()

        raised = tally.apply_vanilla(vanilla_totals())

        assert raised
        assert tally.values()['dealt'] == 900

    def test_the_same_vanilla_totals_again_change_nothing(self):
        tally = played_battle()
        tally.apply_vanilla(vanilla_totals())

        assert not tally.apply_vanilla(vanilla_totals())

    def test_summary_lines(self):
        tally = played_battle()
        tally.hooked('onPlayerFeedbackReceived', True)
        tally.hooked('onTotalEfficiencyUpdated', False)

        line, detail = tally.summary()

        assert line == 'battle: hits 5, pens 2, dealt 570, blocked 440, assist 450, stun 80, received 375'
        assert 'markers [crit 1, no_pen 1, pen 1, ricochet 1, spaced 1]' in detail
        assert 'onTotalEfficiencyUpdated MISSING' in detail
        assert 'kills 1' in detail


class EfficiencyTotalsTest(unittest.TestCase):

    def test_efficiency_totals_ignore_unknown_types_and_missing_values(self):
        totals = {EFFICIENCY_TYPE.STUN: 80, 999: 5, EFFICIENCY_TYPE.DAMAGE: None}

        assert efficiency_totals(totals, EFFICIENCY) == {'stun': 80}

    def test_no_totals_are_empty(self):
        assert efficiency_totals(None, EFFICIENCY) == {}


class OwnDamageTest(unittest.TestCase):

    def test_own_damage_sums_only_the_damage_to_enemies(self):
        assert own_damage(mixed_damage_events(), K.DAMAGE, is_enemy) == 510

    def test_no_damage_kind_sums_nothing(self):
        assert own_damage(mixed_damage_events(), None, is_enemy) == 0

    def test_no_events_sum_nothing(self):
        assert own_damage(None, K.DAMAGE, is_enemy) == 0


class AssistWithStunTest(unittest.TestCase):

    def test_adds_the_stun_to_the_assist(self):
        assert assist_with_stun(300, 80) == 380

    def test_missing_stun_keeps_the_assist(self):
        assert assist_with_stun(300, None) == 300

    def test_missing_assist_stays_missing(self):
        assert assist_with_stun(None, 80) is None


class CountersTest(unittest.TestCase):

    def test_add_counts_a_positive_amount(self):
        assert damage_and_frags_counters().add('damage', 390.0)

    def test_add_ignores_zero(self):
        assert not damage_and_frags_counters().add('damage', 0)

    def test_add_ignores_a_missing_amount(self):
        assert not damage_and_frags_counters().add('damage', None)

    def test_add_ignores_an_unknown_counter(self):
        assert not damage_and_frags_counters().add('assist', 10)

    def test_add_without_an_amount_counts_one(self):
        counters = damage_and_frags_counters()

        added = counters.add('frags')

        assert added
        assert counters.values == {'damage': 0, 'frags': 1}

    def test_raise_to_a_lower_summary_keeps_the_count(self):
        counters = damage_and_frags_counters()
        counters.add('damage', 390.0)

        assert not counters.raise_to('damage', 300)

    def test_raise_to_a_higher_summary_takes_it(self):
        counters = damage_and_frags_counters()
        counters.add('damage', 390.0)

        raised = counters.raise_to('damage', 700)

        assert raised
        assert counters.values == {'damage': 700, 'frags': 0}

    def test_raise_to_ignores_a_non_number(self):
        assert not damage_and_frags_counters().raise_to('frags', 'x')


class CallTest(unittest.TestCase):

    def test_call_returns_the_method_result(self):
        assert call(Target(), 'double', None, 21) == 42

    def test_call_falls_back_on_a_failing_method(self):
        assert call(Target(), 'broken', 'fallback') == 'fallback'

    def test_call_falls_back_without_a_target(self):
        assert call(None, 'double', 0) == 0
