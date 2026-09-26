import unittest

import _support  # noqa: F401
from otmetki.shots import MAX_SHOTS, ShotLog, build_shot, nominal_for, normalize_shell

OPTIONS = [('ARMOR_PIERCING', 390, False), ('ARMOR_PIERCING_CR', 390, True), ('HIGH_EXPLOSIVE', 510, False)]


class ShellTest(unittest.TestCase):

    def test_normalizes_known_kinds(self):
        self.assertEqual(normalize_shell('ARMOR_PIERCING'), 'armor_piercing')
        self.assertEqual(normalize_shell('hollow_charge'), 'hollow_charge')

    def test_unknown_kind(self):
        self.assertEqual(normalize_shell('FLAME'), 'unknown')
        self.assertEqual(normalize_shell(None), 'unknown')

    def test_nominal_prefers_matching_gold_flag(self):
        self.assertEqual(nominal_for(OPTIONS, 'armor_piercing_cr', True), 390)
        self.assertEqual(nominal_for(OPTIONS, 'high_explosive'), 510)

    def test_nominal_missing_kind(self):
        self.assertIsNone(nominal_for(OPTIONS, 'hollow_charge'))
        self.assertIsNone(nominal_for(None, 'armor_piercing'))


class BuildShotTest(unittest.TestCase):

    def test_valid_shot(self):
        shot = build_shot(402, 390, 'armor_piercing', distance_m=212.4)
        self.assertEqual(shot, {'damage': 402, 'nominal': 390, 'shell': 'armor_piercing', 'outcome': 'damage', 'distance_m': 212, 'fatal': False})

    def test_rejects_negative_damage_and_unknown_outcome(self):
        self.assertIsNone(build_shot(-1, 390, 'armor_piercing'))
        self.assertIsNone(build_shot(10, 390, 'armor_piercing', outcome='ricochet'))

    def test_drops_out_of_range_nominal_and_distance(self):
        shot = build_shot(100, 0, 'bogus', distance_m=99999)
        self.assertIsNone(shot['nominal'])
        self.assertIsNone(shot['distance_m'])
        self.assertEqual(shot['shell'], 'unknown')


class ShotLogTest(unittest.TestCase):

    def test_caps_the_number_of_shots(self):
        log = ShotLog()
        for _ in range(MAX_SHOTS + 5):
            log.add(build_shot(100, 100, 'armor_piercing'))
        self.assertEqual(len(log.take()), MAX_SHOTS)
        self.assertEqual(log.take(), [])

    def test_mark_fatal(self):
        log = ShotLog()
        log.add(build_shot(100, 100, 'armor_piercing'))
        log.mark_fatal(0)
        log.mark_fatal(5)
        self.assertTrue(log.take()[0]['fatal'])


if __name__ == '__main__':
    unittest.main()
