# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import math
import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.death_card.i18n import STRINGS
from otmetki.features.death_card.model import DeathWatch, format_card, sector_of
from otmetki.features.death_card.model.preview import preview_text
from otmetki.features.death_card.settings import SCHEMA, SETTINGS


def translator(language='ru'):
    return _support.translator(STRINGS, language)


class SectorTest(unittest.TestCase):

    def test_hull_sides(self):
        assert sector_of(0.0, 0.0) == 'front'
        assert sector_of(math.pi / 2, 0.0) == 'right'
        assert sector_of(math.pi, 0.0) == 'rear'
        assert sector_of(-math.pi / 2, 0.0) == 'left'
        assert sector_of(math.pi / 4, 0.0) == 'front_right'
        assert sector_of(math.pi + 0.1, math.pi) == 'front'
        assert sector_of(0.0, math.pi / 2) == 'left'
        assert sector_of(None, 0.0) is None and sector_of(1.0, None) is None


class DeathWatchTest(unittest.TestCase):

    def test_the_killing_shot_its_modules_and_side(self):
        watch = DeathWatch()
        watch.hit('KV-1', 'heavyTank', 'he', 300, 'shot', 10.0)
        assert watch.module('engine', 'critical', 30.0)
        watch.hit('Pz. IV', 'mediumTank', 'ap', 390, 'shot', 50.0)
        assert watch.module('ammoBay', 'destroyed', 50.2)
        assert not watch.module('engine', 'normal', 50.2) and not watch.module('turret', 'critical', 50.2)
        watch.hit_direction('rear_left', 50.1)
        card = watch.killed('Pz. IV', 'mediumTank', 50.3)
        assert card['attacker'] == 'Pz. IV' and card['class'] == 'medium' and card['shell'] == 'ap' and card['damage'] == 390
        assert card['modules'] == ['ammoBay'] and card['sector'] == 'rear_left'

    def test_a_fire_death_names_the_kill_feed_killer(self):
        watch = DeathWatch()
        watch.hit(None, None, None, 60, 'fire', 10.0)
        card = watch.killed('T-34', 'mediumTank', 11.0)
        assert card['source'] == 'fire' and card['attacker'] == 'T-34'

    def test_an_old_shot_is_not_the_killing_one(self):
        watch = DeathWatch()
        watch.hit('KV-1', 'heavyTank', 'he', 300, 'shot', 10.0)
        watch.hit_direction('front', 10.0)
        card = watch.killed('T-34', 'mediumTank', 60.0)
        assert card['attacker'] == 'T-34' and card['damage'] == 0 and card['sector'] is None and card['shell'] is None


class FormatTest(unittest.TestCase):

    def test_card(self):
        watch = DeathWatch()
        watch.hit('Pz. IV', 'mediumTank', 'ap', 390, 'shot', 50.0)
        watch.module('ammoBay', 'destroyed', 50.1)
        watch.hit_direction('rear', 50.0)
        text = format_card(watch.killed(None, None, 50.2), Settings({}, SCHEMA), translator())
        assert u'Вас уничтожил: СТ Pz. IV' in text and u'ББ · урон 390' in text
        assert u'Повреждено: боеукладка' in text and u'↓ выстрел сзади' in text
        short = format_card(watch.card, Settings({'show_modules': False, 'show_direction': False}, SCHEMA), translator('en'))
        assert 'Destroyed by MT Pz. IV' in short and 'ammo rack' not in short and 'rear' not in short
        assert format_card(None, Settings({}, SCHEMA), translator()) is None
        unknown = format_card(DeathWatch().killed(None, None, 1.0), Settings({}, SCHEMA), translator())
        assert u'неизвестный' in unknown

    def test_preview_settings_and_strings(self):
        assert u'Вас уничтожил' in preview_text(Settings({}, SCHEMA), translator())
        assert SETTINGS == ('battle_death_card',)
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
