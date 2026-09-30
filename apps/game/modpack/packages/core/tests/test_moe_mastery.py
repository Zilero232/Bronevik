from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.core.moe import mastery_from_api, mastery_state, rating_change

MASTERY = {'class3': 540, 'class2': 710.4, 'class1': 960, 'ace': 1320}
API = {'tank_id': 1, 'thresholds': {'65': 2000}, 'mastery': MASTERY}


class MasteryFromApiTest(unittest.TestCase):

    def test_the_badges_go_from_the_third_class_to_the_ace(self):
        assert mastery_from_api(API) == ((1, 540), (2, 710), (3, 960), (4, 1320))

    def test_an_answer_without_mastery_has_none(self):
        assert mastery_from_api({'thresholds': {}}) is None
        assert mastery_from_api(None) is None

    def test_an_incomplete_block_is_dropped(self):
        assert mastery_from_api({'mastery': {'class3': 540, 'class2': 'x', 'class1': 960, 'ace': 1320}}) is None


class MasteryStateTest(unittest.TestCase):

    def test_the_badges_the_player_holds_are_reached(self):
        state = mastery_state(mastery_from_api(API), 2)

        assert [badge['reached'] for badge in state] == [True, True, False, False]
        assert state[3] == {'level': 4, 'xp': 1320, 'reached': False}

    def test_no_dossier_value_reaches_nothing(self):
        assert not any(badge['reached'] for badge in mastery_state(mastery_from_api(API), None))

    def test_no_thresholds_give_no_badges(self):
        assert mastery_state(None, 3) == []


class RatingChangeTest(unittest.TestCase):

    def test_the_change_is_the_rating_difference_in_percent(self):
        assert rating_change(8612, 8654) == 0.42

    def test_a_drop_is_negative(self):
        assert rating_change(8612, 8601) == -0.11

    def test_a_tank_without_a_record_has_no_change(self):
        assert rating_change(0, 8601) is None
        assert rating_change(None, 8601) is None
        assert rating_change(8612, None) is None


if __name__ == '__main__':
    unittest.main()
