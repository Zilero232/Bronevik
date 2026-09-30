from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.companion.shots import MAX_SHOTS, ShotLog, build_shot, nominal_for, normalize_shell
from otmetki.core.shells.constants import BATTLE_LOG_SHELL_NAMES
from otmetki.core.vendor.enum34 import IntEnum

BATTLE_LOG_SHELL_TYPES = IntEnum(
    'BATTLE_LOG_SHELL_TYPES',
    [(name, index) for index, name in enumerate(BATTLE_LOG_SHELL_NAMES)],
)
BATTLE_LOG_KINDS = (
    (BATTLE_LOG_SHELL_TYPES.ARMOR_PIERCING, 'armor_piercing'),
    (BATTLE_LOG_SHELL_TYPES.ARMOR_PIERCING_FSDS, 'armor_piercing_cr'),
    (BATTLE_LOG_SHELL_TYPES.HOLLOW_CHARGE_DF, 'hollow_charge'),
    (BATTLE_LOG_SHELL_TYPES.HE_MODERN, 'high_explosive'),
    (BATTLE_LOG_SHELL_TYPES.SMOKE, 'unknown'),
    (int(BATTLE_LOG_SHELL_TYPES.ARMOR_PIERCING_CR), 'armor_piercing_cr'),
)

OPTIONS = [('ARMOR_PIERCING', 390, False), ('ARMOR_PIERCING_CR', 390, True), ('HIGH_EXPLOSIVE', 510, False)]


def armor_piercing_hit():
    return build_shot(100, 100, 'armor_piercing')


class ShellTest(unittest.TestCase):

    def test_normalizes_a_client_kind_name(self):
        self.assertEqual(normalize_shell('ARMOR_PIERCING'), 'armor_piercing')

    def test_keeps_a_contract_kind(self):
        self.assertEqual(normalize_shell('hollow_charge'), 'hollow_charge')

    def test_battle_log_shell_types_members(self):
        kinds = [(member, normalize_shell(member)) for member, _ in BATTLE_LOG_KINDS]

        self.assertEqual(kinds, list(BATTLE_LOG_KINDS))

    def test_member_matches_descriptor_kind_for_nominal(self):
        shell = normalize_shell(BATTLE_LOG_SHELL_TYPES.HE_LEGACY_STUN)

        self.assertEqual(nominal_for(OPTIONS, shell), 510)

    def test_an_unknown_kind_name_is_unknown(self):
        self.assertEqual(normalize_shell('FLAME'), 'unknown')

    def test_no_kind_is_unknown(self):
        self.assertEqual(normalize_shell(None), 'unknown')


class NominalTest(unittest.TestCase):

    def test_nominal_prefers_matching_gold_flag(self):
        self.assertEqual(nominal_for(OPTIONS, 'armor_piercing_cr', True), 390)

    def test_nominal_without_a_gold_flag_takes_the_first_match(self):
        self.assertEqual(nominal_for(OPTIONS, 'high_explosive'), 510)

    def test_no_nominal_for_a_kind_the_gun_does_not_fire(self):
        self.assertIsNone(nominal_for(OPTIONS, 'hollow_charge'))

    def test_no_nominal_without_options(self):
        self.assertIsNone(nominal_for(None, 'armor_piercing'))


class BuildShotTest(unittest.TestCase):

    def test_valid_shot(self):
        shot = build_shot(402, 390, 'armor_piercing', distance_m=212.4)

        self.assertEqual(shot, {
            'damage': 402,
            'nominal': 390,
            'shell': 'armor_piercing',
            'outcome': 'damage',
            'distance_m': 212,
            'fatal': False,
        })

    def test_rejects_negative_damage(self):
        self.assertIsNone(build_shot(-1, 390, 'armor_piercing'))

    def test_rejects_an_unknown_outcome(self):
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
            log.add(armor_piercing_hit())

        shots = log.take()

        self.assertEqual(len(shots), MAX_SHOTS)

    def test_take_empties_the_log(self):
        log = ShotLog()
        log.add(armor_piercing_hit())
        log.take()

        self.assertEqual(log.take(), [])

    def test_mark_fatal_flags_the_shot_and_ignores_an_unknown_index(self):
        log = ShotLog()
        log.add(armor_piercing_hit())

        log.mark_fatal(0)
        log.mark_fatal(5)

        self.assertTrue(log.take()[0]['fatal'])


if __name__ == '__main__':
    unittest.main()
