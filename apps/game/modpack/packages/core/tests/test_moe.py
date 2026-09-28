# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.core.format import COLOR_DOWN, COLOR_NEUTRAL, COLOR_UP, MARK_COLORS
from otmetki.core.moe import (EMA_K, PaceBook, ThresholdCache, ThresholdCurve, battle_combined, battles_to_reach, combined_damage,
                              moe_color, moe_macros, moe_state, next_level, project_moving_avg, rating_to_percent, required_battle_damage)
from otmetki.core.moe.constants import MAX_FORECAST_BATTLES, PACE_BATTLES, THRESHOLD_ERROR_TTL_S, THRESHOLD_TTL_S

API = {'tank_id': 1, 'thresholds': {'65': 2000, '85': 2600, '95': 3100, '100': 4200}}


def curve():
    return ThresholdCurve.from_api(API)


class EmaTest(unittest.TestCase):

    def test_combined_uses_best_assist(self):
        assert combined_damage(1000, 300, 500, 200) == 1500
        assert combined_damage(1000, 0, 0, 700) == 1700

    def test_ema_and_inverse(self):
        self.assertAlmostEqual(EMA_K, 2.0 / 101)
        self.assertAlmostEqual(project_moving_avg(2000, 4020), 2040)
        self.assertAlmostEqual(project_moving_avg(2500, required_battle_damage(2500, 2600)), 2600)
        assert required_battle_damage(3000, 2600) == 0.0
        assert rating_to_percent(8712) == 87.12
        assert rating_to_percent(None) is None

    def test_battles_to_reach(self):
        assert battles_to_reach(2600, 2600, None) == 0
        assert battles_to_reach(2500, 2600, 2600) is None
        assert battles_to_reach(2500, 2600, None) is None
        assert battles_to_reach(None, 2600, 3000) is None
        battles = battles_to_reach(2500, 2600, 3000)
        avg = 2500.0
        for _ in range(battles - 1):
            avg = project_moving_avg(avg, 3000)
        assert avg < 2600 <= project_moving_avg(avg, 3000)
        assert battles_to_reach(1000, 2999, 3000) is None or battles_to_reach(1000, 2999, 3000) <= MAX_FORECAST_BATTLES


class CurveTest(unittest.TestCase):

    def test_interpolation_both_ways(self):
        c = curve()
        assert c.percent_for(0) == 0.0
        self.assertAlmostEqual(c.percent_for(2300), 75.0)
        assert c.percent_for(99999) == 100.0
        for percent in (10.0, 65.0, 80.0, 99.0):
            self.assertAlmostEqual(c.percent_for(c.damage_for(percent)), percent)
        assert c.damage_for(101) is None

    def test_dense_curve_and_garbage(self):
        dense = ThresholdCurve.from_api({'thresholds': {'65': 2000, 'x': 1, '85': 'bad'},
                                         'curve': [{'percent': 50, 'damage': 1700}, {'percent': 70, 'damage': 1600}, {'percent': 95, 'damage': 3000}]})
        assert dense.points == [(0.0, 0.0), (50.0, 1700.0), (65.0, 2000.0), (95.0, 3000.0)]
        assert ThresholdCurve.from_api({'thresholds': {}}) is None
        assert ThresholdCurve.from_api(None) is None

    def test_next_level(self):
        levels = (65.0, 85.0, 95.0)
        assert next_level(10.0, curve(), levels) == 65.0
        assert next_level(94.99, curve(), levels) == 95.0
        assert next_level(95.0, curve(), levels) is None


class StateTest(unittest.TestCase):

    def test_in_battle(self):
        state = moe_state(2500, 81.5, 2100, curve(), 3000, 0.5, 1)
        assert state['next_level'] == 85
        assert state['need'][65] == 0
        assert state['need'][85] == state['need_next'] == int(-(-(required_battle_damage(2500, 2600) - 2100) // 1))
        assert state['target_avg'] == {65: 2000, 85: 2600, 95: 3100, 100: 4200}
        start, after = curve().percent_for(2500), curve().percent_for(project_moving_avg(2500, 2100))
        self.assertAlmostEqual(state['delta'], round(81.5 + after - start, 2) - 81.5, places=2)
        assert state['ema_projected'] == int(round(project_moving_avg(2500, 2100)))
        assert state['battles'] == battles_to_reach(project_moving_avg(2500, 2100), 2600, 3000)
        assert state['step_need'] >= 0

    def test_reached_and_capped(self):
        state = moe_state(2550, 84.0, 90000, curve(), None, 1.0, 1)
        assert state['need_next'] == 0 and state['projected'] <= 100.0
        assert state['battles'] == 0

    def test_hangar_projects_nothing(self):
        state = moe_state(2500, 81.5, None, curve(), 3000)
        assert state['delta'] == 0.0 and state['projected'] == 81.5 and state['ema_projected'] == 2500
        assert state['need'][85] == int(-(-required_battle_damage(2500, 2600) // 1))
        assert state['battles'] == battles_to_reach(2500, 2600, 3000)

    def test_without_curve(self):
        state = moe_state(2000, 70.0, 100, None, None)
        assert state['projected'] is None and state['need'] == {} and not state['has_curve']
        assert moe_macros(state)['battles'] == '-'

    def test_last_mark_and_percent_from_the_curve(self):
        state = moe_state(3500, 96.0, 0, curve(), 5000)
        assert state['next_level'] is None and state['need'][95] == 0 and state['need'][100] > 0
        assert moe_state(2300, None, 0, curve(), None)['next_level'] == 85


class MacrosTest(unittest.TestCase):

    def test_text_values(self):
        values = moe_macros(moe_state(2500, 81.5, 2100, curve(), 1000, 0.5, 2))
        assert values['percent'] == '81.50' and values['marks'] == '2' and values['stars'] == u'★★'
        assert values['need65'] == u'✓' and values['next'] == '85' and values['target_next'] == '2 600'
        assert values['battles'] == u'∞' and values['step'] == '0.5'
        assert values['delta'].startswith('-') and moe_macros(moe_state(2500, 81.5, 5000, curve(), None))['delta'].startswith('+')
        assert moe_macros(moe_state(2500, 81.5, 2100, curve(), None))['battles'] == '-'

    def test_colors(self):
        up = moe_state(2500, 81.5, 5000, curve(), None)
        down = moe_state(2500, 81.5, 0, curve(), None)
        idle = moe_state(2500, 81.5, None, curve(), None)
        assert moe_color(up, 'delta') == COLOR_UP and moe_color(down, 'delta') == COLOR_DOWN and moe_color(idle, 'delta') == COLOR_NEUTRAL
        assert moe_color(up, 'off') == COLOR_NEUTRAL
        assert moe_color(idle, 'mark') == MARK_COLORS[1]
        assert moe_color(moe_state(3500, 96.0, None, curve(), None), 'mark') == MARK_COLORS[3]
        assert moe_color(moe_state(100, 10.0, None, None, None), 'mark') == MARK_COLORS[0]


def event(tank_id, arena, damage, radio=0, track=0, stun=0):
    return {'vehicle': {'tank_id': tank_id}, 'arena_unique_id': arena,
            'stats': {'damage_dealt': damage, 'damage_assisted_radio': radio, 'damage_assisted_track': track, 'damage_assisted_stun': stun}}


class PaceTest(unittest.TestCase):

    def test_pace_from_own_battles(self):
        book = PaceBook()
        assert battle_combined(event(1, 10, 1000, 300, 500)) == (1, 10, 1500)
        assert battle_combined({'vehicle': {}}) is None and battle_combined(None) is None
        assert book.record_event(event(1, 10, 1000, 300, 500))
        assert not book.record_event(event(1, 10, 1000))
        assert book.pace(1) is None
        book.record_event(event(1, 11, 2000))
        book.record_event(event(1, 12, 3000))
        assert book.pace(1) == (1500 + 2000 + 3000) / 3.0
        assert not book.record('x', 1, 5) and not book.record(1, 13, -1)

    def test_keeps_the_last_battles_and_round_trips(self):
        book = PaceBook()
        for arena in range(PACE_BATTLES + 5):
            book.record(7, arena, arena)
        assert book.battles(7) == PACE_BATTLES
        again = PaceBook(book.to_dict())
        assert again.pace(7) == book.pace(7)
        assert PaceBook({'1': [['bad']], '2': 'x'}).tanks == {}


class ThresholdCacheTest(unittest.TestCase):

    def test_ttl_and_pending(self):
        cache = ThresholdCache()
        assert cache.due(1, 0)
        cache.begin(1)
        assert not cache.due(1, 0)
        cache.store(1, curve(), 100)
        assert cache.get(1) is not None and not cache.due(1, 100 + THRESHOLD_TTL_S - 1) and cache.due(1, 100 + THRESHOLD_TTL_S)

    def test_failed_refresh_keeps_the_curve(self):
        cache = ThresholdCache()
        cache.store(1, curve(), 0)
        cache.store(1, None, THRESHOLD_TTL_S)
        assert cache.get(1) is not None
        assert not cache.due(1, THRESHOLD_TTL_S + THRESHOLD_ERROR_TTL_S - 1) and cache.due(1, THRESHOLD_TTL_S + THRESHOLD_ERROR_TTL_S)
        cache.store(2, None, 0)
        assert cache.get(2) is None and cache.due(2, THRESHOLD_ERROR_TTL_S)


if __name__ == '__main__':
    unittest.main()
