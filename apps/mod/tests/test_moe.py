import unittest

import _support  # noqa: F401
from otmetki.moe import (
    EMA_K,
    BattleTotals,
    ThresholdCurve,
    combined_damage,
    next_level,
    project,
    project_moving_avg,
    rating_to_percent,
    required_battle_damage,
)

API = {'tank_id': 1, 'thresholds': {'65': 2000, '85': 2600, '95': 3100, '100': 4200}}


class MoeMathTest(unittest.TestCase):

    def test_combined_uses_best_assist(self):
        self.assertEqual(combined_damage(1000, 300, 500, 200), 1500)
        self.assertEqual(combined_damage(1000, 0, 0, 700), 1700)

    def test_ema(self):
        self.assertAlmostEqual(EMA_K, 2.0 / 101)
        self.assertAlmostEqual(project_moving_avg(2000, 2000), 2000)
        self.assertAlmostEqual(project_moving_avg(2000, 4020), 2040)

    def test_required_damage_inverts_ema(self):
        needed = required_battle_damage(2500, 2600)
        self.assertAlmostEqual(project_moving_avg(2500, needed), 2600)
        self.assertEqual(required_battle_damage(3000, 2600), 0.0)

    def test_rating_to_percent(self):
        self.assertEqual(rating_to_percent(8712), 87.12)


class CurveTest(unittest.TestCase):

    def setUp(self):
        self.curve = ThresholdCurve.from_api(API)

    def test_interpolation(self):
        self.assertEqual(self.curve.percent_for(0), 0.0)
        self.assertAlmostEqual(self.curve.percent_for(2000), 65.0)
        self.assertAlmostEqual(self.curve.percent_for(2300), 75.0)
        self.assertAlmostEqual(self.curve.percent_for(1000), 32.5)
        self.assertEqual(self.curve.percent_for(99999), 100.0)

    def test_inverse(self):
        self.assertAlmostEqual(self.curve.damage_for(75.0), 2300)
        self.assertAlmostEqual(self.curve.damage_for(95.0), 3100)
        for percent in (10.0, 65.0, 80.0, 99.0):
            self.assertAlmostEqual(self.curve.percent_for(self.curve.damage_for(percent)), percent)

    def test_dense_curve_and_garbage(self):
        curve = ThresholdCurve.from_api({
            'thresholds': {'65': 2000, 'x': 1, '85': 'bad'},
            'curve': [{'percent': 50, 'damage': 1700}, {'percent': 70, 'damage': 1600}, {'percent': 95, 'damage': 3000}],
        })
        self.assertEqual(curve.points, [(0.0, 0.0), (50.0, 1700.0), (65.0, 2000.0), (95.0, 3000.0)])
        self.assertIsNone(ThresholdCurve.from_api({'thresholds': {}}))
        self.assertIsNone(ThresholdCurve.from_api(None))

    def test_next_level(self):
        self.assertEqual(next_level(10.0, self.curve), 65.0)
        self.assertEqual(next_level(65.0, self.curve), 85.0)
        self.assertEqual(next_level(94.99, self.curve), 95.0)
        self.assertIsNone(next_level(95.0, self.curve))


class ProjectionTest(unittest.TestCase):

    def test_projection(self):
        totals = BattleTotals()
        totals.add('damage', 1500)
        totals.add('radio', 400)
        totals.add('track', 600)
        self.assertFalse(totals.add('unknown', 100))
        self.assertFalse(totals.add('damage', -5))
        curve = ThresholdCurve.from_api(API)
        result = project(2500, 81.5, totals, curve)
        self.assertEqual(result['combined_damage'], 2100)
        self.assertEqual(result['target_level'], 85.0)
        self.assertEqual(result['target_avg'], 2600)
        expected_needed = required_battle_damage(2500, 2600)
        self.assertEqual(result['damage_needed'], int(-(-expected_needed // 1)))
        self.assertEqual(result['damage_remaining'], result['damage_needed'] - 2100)
        self.assertAlmostEqual(result['projected_percent'], round(curve.percent_for(project_moving_avg(2500, 2100)), 2))

    def test_reached(self):
        totals = BattleTotals()
        totals.add('damage', 9000)
        result = project(2550, 84.0, totals, ThresholdCurve.from_api(API))
        self.assertEqual(result['damage_remaining'], 0)
        self.assertGreater(result['projected_percent'], 85.0)

    def test_without_curve(self):
        totals = BattleTotals()
        totals.add('damage', 100)
        result = project(2000, 70.0, totals, None)
        self.assertIsNone(result['projected_percent'])
        self.assertIsNone(result['damage_remaining'])
        self.assertEqual(result['combined_damage'], 100)


if __name__ == '__main__':
    unittest.main()
