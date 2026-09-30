# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _feedback as fb
import _support  # noqa: F401
from otmetki.core.battle_tally import EFFICIENCY_KEYS, EVENT_KEYS, MARKER_OUTCOMES, BattleTally, Counters, assist_with_stun, efficiency_totals, own_damage
from otmetki.core.compat import call
from otmetki.core.client.game import values_by_name
from otmetki.core.shells import shell_code

K = fb.BATTLE_EVENT_TYPE
ENEMY = 202
ENEMY_2 = 203
ALLY = 11
KINDS = values_by_name(K, EVENT_KEYS)
MARKERS = values_by_name(fb.FEEDBACK_EVENT_ID, MARKER_OUTCOMES)
EFFICIENCY = values_by_name(fb.PERSONAL_EFFICIENCY_TYPE, EFFICIENCY_KEYS)


def is_enemy(vehicle_id):
    return vehicle_id in (ENEMY, ENEMY_2)


class FixtureTest(unittest.TestCase):

    def test_packed_damage_decodes_like_the_client(self):
        extra = fb.damage(K.DAMAGE, ENEMY, 390, shell=fb.SHELL['ARMOR_PIERCING'], gold=True).getExtra()
        assert (extra.getDamage(), extra.isShot(), extra.isFire(), extra.isShellGold()) == (390, True, False, True)
        assert shell_code(extra.getShellType()) == 'ap'
        assert fb.damage(K.RECEIVED_DAMAGE, ENEMY, 40, reason='fire').getExtra().getShellType() is None
        assert fb.crits(K.CRIT, ENEMY, 2).getExtra().getCritsCount() == 2

    def test_every_marker_name_is_a_client_feedback_id(self):
        assert len(MARKERS) == len(MARKER_OUTCOMES)
        assert MARKERS[fb.FEEDBACK_EVENT_ID.VEHICLE_ARMOR_PIERCED] == 'pen'
        assert MARKERS[fb.FEEDBACK_EVENT_ID.VEHICLE_CRITICAL_HIT_CHASSIS] == 'tracks'


class BattleTallyTest(unittest.TestCase):

    def battle(self):
        tally = BattleTally()
        for name in ('VEHICLE_ARMOR_PIERCED', 'VEHICLE_RICOCHET', 'VEHICLE_HIT', 'VEHICLE_CRITICAL_HIT', 'VEHICLE_ARMOR_SCREEN_BLOCKED'):
            tally.add_marker(MARKERS[getattr(fb.FEEDBACK_EVENT_ID, name)])
        tally.add_events([
            fb.damage(K.DAMAGE, ENEMY, 390, shell=fb.SHELL['ARMOR_PIERCING']),
            fb.crits(K.CRIT, ENEMY, 2),
            fb.damage(K.DAMAGE, ENEMY_2, 120, shell=fb.SHELL['HE_MODERN']),
            fb.damage(K.DAMAGE, ENEMY_2, 60, shell=fb.SHELL['HE_MODERN']),
        ], KINDS, is_enemy)
        tally.add_events([
            fb.damage(K.RADIO_ASSIST, ENEMY, 300),
            fb.damage(K.TRACK_ASSIST, ENEMY_2, 150),
            fb.damage(K.STUN_ASSIST, ENEMY, 80),
            fb.damage(K.TANKING, ENEMY, 440, shell=fb.SHELL['ARMOR_PIERCING_CR']),
            fb.damage(K.RECEIVED_DAMAGE, ENEMY, 310, shell=fb.SHELL['HOLLOW_CHARGE']),
            fb.damage(K.RECEIVED_DAMAGE, ENEMY, 45, reason='fire'),
            fb.damage(K.RECEIVED_DAMAGE, ALLY, 20, reason='ramming'),
            fb.event(K.KILL, ENEMY_2),
        ], KINDS, is_enemy)
        return tally

    def test_counts_markers_events_and_edge_cases(self):
        values = self.battle().values()
        assert (values['hits'], values['pens'], values['ricochets']) == (5, 2, 1)
        assert values['dealt'] == 570
        assert values['damaging_hits'] == 3
        assert (values['assist'], values['stun'], values['blocked']) == (450, 80, 440)
        assert values['received'] == 375

    def test_ally_damage_and_assist_are_not_counted(self):
        tally = BattleTally()
        assert tally.add_events([fb.damage(K.DAMAGE, ALLY, 50), fb.damage(K.RADIO_ASSIST, ALLY, 90)], KINDS, is_enemy) == 0
        assert tally.values()['dealt'] == 0

    def test_zero_damage_and_unknown_kinds_add_nothing(self):
        tally = BattleTally()
        tally.add_events([fb.damage(K.DAMAGE, ENEMY, 0), fb.event(K.MULTI_STUN, ENEMY, 3)], KINDS, is_enemy)
        assert tally.values()['dealt'] == 0

    def test_vanilla_totals_are_a_floor_after_own_death(self):
        tally = self.battle()
        totals = {fb.PERSONAL_EFFICIENCY_TYPE.DAMAGE: 900, fb.PERSONAL_EFFICIENCY_TYPE.ASSIST_DAMAGE: 450,
                  fb.PERSONAL_EFFICIENCY_TYPE.RECEIVED_CRITICAL_HITS: 3}
        assert tally.apply_vanilla(efficiency_totals(totals, EFFICIENCY))
        assert not tally.apply_vanilla(efficiency_totals(totals, EFFICIENCY))
        assert tally.values()['dealt'] == 900

    def test_summary_lines(self):
        tally = self.battle()
        tally.hooked('onPlayerFeedbackReceived', True)
        tally.hooked('onTotalEfficiencyUpdated', False)
        line, detail = tally.summary()
        assert line == 'battle: hits 5, pens 2, dealt 570, blocked 440, assist 450, stun 80, received 375'
        assert 'markers [crit 1, no_pen 1, pen 1, ricochet 1, spaced 1]' in detail
        assert 'onTotalEfficiencyUpdated MISSING' in detail
        assert 'kills 1' in detail

    def test_efficiency_totals_ignore_unknown_types(self):
        assert efficiency_totals({fb.PERSONAL_EFFICIENCY_TYPE.STUN: 80, 999: 5, fb.PERSONAL_EFFICIENCY_TYPE.DAMAGE: None}, EFFICIENCY) == {'stun': 80}
        assert efficiency_totals(None, EFFICIENCY) == {}


class OwnCountersTest(unittest.TestCase):

    def test_own_damage_sums_only_the_damage_to_enemies(self):
        events = [
            fb.damage(K.DAMAGE, ENEMY, 390),
            fb.damage(K.DAMAGE, ALLY, 50),
            fb.damage(K.RADIO_ASSIST, ENEMY, 300),
            fb.damage(K.DAMAGE, ENEMY_2, 120),
        ]
        assert own_damage(events, K.DAMAGE, is_enemy) == 510
        assert own_damage(events, None, is_enemy) == 0
        assert own_damage(None, K.DAMAGE, is_enemy) == 0

    def test_assist_with_stun_adds_only_two_numbers(self):
        assert assist_with_stun(300, 80) == 380
        assert assist_with_stun(300, None) == 300
        assert assist_with_stun(None, 80) is None

    def test_counters_add_positive_amounts_and_raise_to_the_summary(self):
        counters = Counters(('damage', 'frags'))
        assert counters.add('damage', 390.0)
        assert not counters.add('damage', 0)
        assert not counters.add('damage', None)
        assert not counters.add('assist', 10)
        assert counters.add('frags')
        assert not counters.raise_to('damage', 300)
        assert counters.raise_to('damage', 700)
        assert not counters.raise_to('frags', 'x')
        assert counters.values == {'damage': 700, 'frags': 1}


class CallTest(unittest.TestCase):

    def test_call_falls_back_on_a_missing_or_failing_method(self):
        class Target(object):
            def double(self, value):
                return value * 2

            def broken(self):
                raise RuntimeError('client API drift')

        assert call(Target(), 'double', None, 21) == 42
        assert call(Target(), 'broken', 'fallback') == 'fallback'
        assert call(None, 'double', 0) == 0
