from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.companion.marks.ledger import BattleSnapshots

SNAPSHOT = {'tank_id': 1, 'damage_rating': 8600, 'moving_avg_damage': 2550, 'marks_on_gun': 2}


def started(*arenas):
    ledger = BattleSnapshots(limit=2)
    for arena_id in arenas:
        ledger.battle_started(arena_id, dict(SNAPSHOT, damage_rating=8600 + arena_id))
    return ledger


class BattleSnapshotsTest(unittest.TestCase):

    def test_the_snapshot_of_a_battle_is_found_by_its_arena_as_text(self):
        assert started(7).before('7', 1)['damage_rating'] == 8607

    def test_a_later_dossier_read_does_not_change_a_taken_snapshot(self):
        snapshot = dict(SNAPSHOT)
        ledger = BattleSnapshots()
        ledger.battle_started(7, snapshot)
        snapshot['damage_rating'] = 8700

        assert ledger.before(7, 1)['damage_rating'] == 8600

    def test_another_tank_has_no_snapshot(self):
        assert started(7).before(7, 2) is None

    def test_a_tank_without_a_rating_is_not_kept(self):
        ledger = BattleSnapshots()
        ledger.battle_started(7, dict(SNAPSHOT, damage_rating=None))

        assert ledger.before(7, 1) is None

    def test_a_battle_without_an_arena_or_a_snapshot_is_not_kept(self):
        ledger = BattleSnapshots()
        ledger.battle_started(None, SNAPSHOT)
        ledger.battle_started(7, None)

        assert ledger.by_arena == {}

    def test_the_results_drop_the_snapshot(self):
        ledger = started(7)
        ledger.finished('7')

        assert ledger.before(7, 1) is None
        assert ledger.order == []

    def test_only_the_last_battles_are_kept(self):
        ledger = started(1, 2, 3)

        assert ledger.before(1, 1) is None
        assert ledger.before(3, 1)['damage_rating'] == 8603


if __name__ == '__main__':
    unittest.main()
