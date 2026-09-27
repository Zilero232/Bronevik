from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.companion.shots import MAX_SHOTS, ShotLog, build_shot, nominal_for, normalize_shell
from otmetki.core.shells.constants import BATTLE_LOG_SHELL_NAMES
from otmetki.core.vendor.enum34 import IntEnum

BATTLE_LOG_SHELL_TYPES = IntEnum('BATTLE_LOG_SHELL_TYPES', [(name, index) for index, name in enumerate(BATTLE_LOG_SHELL_NAMES)])

OPTIONS = [('ARMOR_PIERCING', 390, False), ('ARMOR_PIERCING_CR', 390, True), ('HIGH_EXPLOSIVE', 510, False)]


class ShellTest(unittest.TestCase):

    def test_normalizes_known_kinds(self):
        self.assertEqual(normalize_shell('ARMOR_PIERCING'), 'armor_piercing')
        self.assertEqual(normalize_shell('hollow_charge'), 'hollow_charge')

    def test_battle_log_shell_types_members(self):
        self.assertEqual(normalize_shell(BATTLE_LOG_SHELL_TYPES.ARMOR_PIERCING), 'armor_piercing')
        self.assertEqual(normalize_shell(BATTLE_LOG_SHELL_TYPES.ARMOR_PIERCING_FSDS), 'armor_piercing_cr')
        self.assertEqual(normalize_shell(BATTLE_LOG_SHELL_TYPES.HOLLOW_CHARGE_DF), 'hollow_charge')
        self.assertEqual(normalize_shell(BATTLE_LOG_SHELL_TYPES.HE_MODERN), 'high_explosive')
        self.assertEqual(normalize_shell(BATTLE_LOG_SHELL_TYPES.SMOKE), 'unknown')
        self.assertEqual(normalize_shell(int(BATTLE_LOG_SHELL_TYPES.ARMOR_PIERCING_CR)), 'armor_piercing_cr')

    def test_member_matches_descriptor_kind_for_nominal(self):
        shell = normalize_shell(BATTLE_LOG_SHELL_TYPES.HE_LEGACY_STUN)
        self.assertEqual(nominal_for(OPTIONS, shell), 510)

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
