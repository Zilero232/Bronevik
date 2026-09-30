# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import math
import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.death_card.i18n import STRINGS
from otmetki.features.death_card.model import DeathWatch, format_card, sector_of
from otmetki.features.death_card.model.preview import preview_text
from otmetki.features.death_card.model.widget import card_widget
from otmetki.features.death_card.settings import SCHEMA, SETTINGS


def translator(language='ru'):
    return _support.translator(STRINGS, language)


def default_settings():
    return Settings({}, SCHEMA)


def watch_with_an_earlier_and_a_killing_shot():
    watch = DeathWatch()
    watch.hit('KV-1', 'heavyTank', 'he', 300, 'shot', 10.0)
    watch.module('engine', 'critical', 30.0)
    watch.hit('Pz. IV', 'mediumTank', 'ap', 390, 'shot', 50.0)
    watch.module('ammoBay', 'destroyed', 50.2)
    watch.hit_direction('rear_left', 50.1)
    return watch


def watch_with_an_old_shot():
    watch = DeathWatch()
    watch.hit('KV-1', 'heavyTank', 'he', 300, 'shot', 10.0)
    watch.hit_direction('front', 10.0)
    return watch


def killing_blow_card():
    watch = DeathWatch()
    watch.hit('Pz. IV', 'mediumTank', 'ap', 390, 'shot', 50.0)
    watch.module('ammoBay', 'destroyed', 50.1)
    watch.hit_direction('rear', 50.0)
    return watch.killed(None, None, 50.2)


def unknown_death_card():
    return DeathWatch().killed(None, None, 1.0)


class SectorTest(unittest.TestCase):

    def test_a_hit_straight_ahead_is_the_front(self):
        assert sector_of(0.0, 0.0) == 'front'

    def test_a_quarter_turn_clockwise_is_the_right(self):
        assert sector_of(math.pi / 2, 0.0) == 'right'

    def test_half_a_turn_is_the_rear(self):
        assert sector_of(math.pi, 0.0) == 'rear'

    def test_a_quarter_turn_anticlockwise_is_the_left(self):
        assert sector_of(-math.pi / 2, 0.0) == 'left'

    def test_an_eighth_of_a_turn_is_the_front_right(self):
        assert sector_of(math.pi / 4, 0.0) == 'front_right'

    def test_the_side_is_relative_to_the_hull(self):
        assert sector_of(math.pi + 0.1, math.pi) == 'front'

    def test_a_turned_hull_moves_the_side(self):
        assert sector_of(0.0, math.pi / 2) == 'left'

    def test_an_unknown_hit_yaw_has_no_side(self):
        assert sector_of(None, 0.0) is None

    def test_an_unknown_hull_yaw_has_no_side(self):
        assert sector_of(1.0, None) is None


class ModuleTest(unittest.TestCase):

    def test_a_critical_module_is_recorded(self):
        assert DeathWatch().module('engine', 'critical', 30.0)

    def test_a_module_back_to_normal_is_not_recorded(self):
        assert not DeathWatch().module('engine', 'normal', 50.2)

    def test_an_unknown_module_is_not_recorded(self):
        assert not DeathWatch().module('turret', 'critical', 50.2)


class KilledTest(unittest.TestCase):

    def test_the_killing_shot_names_its_attacker_shell_and_damage(self):
        card = watch_with_an_earlier_and_a_killing_shot().killed('Pz. IV', 'mediumTank', 50.3)

        assert card['attacker'] == 'Pz. IV'
        assert card['class'] == 'medium'
        assert card['shell'] == 'ap'
        assert card['damage'] == 390

    def test_only_the_modules_damaged_by_the_killing_shot_are_listed(self):
        card = watch_with_an_earlier_and_a_killing_shot().killed('Pz. IV', 'mediumTank', 50.3)

        assert card['modules'] == ['ammoBay']

    def test_the_side_of_the_killing_shot_is_kept(self):
        card = watch_with_an_earlier_and_a_killing_shot().killed('Pz. IV', 'mediumTank', 50.3)

        assert card['sector'] == 'rear_left'

    def test_a_fire_death_keeps_its_source(self):
        watch = DeathWatch()
        watch.hit(None, None, None, 60, 'fire', 10.0)

        card = watch.killed('T-34', 'mediumTank', 11.0)

        assert card['source'] == 'fire'

    def test_a_fire_death_names_the_kill_feed_killer(self):
        watch = DeathWatch()
        watch.hit(None, None, None, 60, 'fire', 10.0)

        card = watch.killed('T-34', 'mediumTank', 11.0)

        assert card['attacker'] == 'T-34'

    def test_an_old_shot_leaves_the_kill_feed_killer(self):
        card = watch_with_an_old_shot().killed('T-34', 'mediumTank', 60.0)

        assert card['attacker'] == 'T-34'

    def test_an_old_shot_brings_no_damage_shell_or_side(self):
        card = watch_with_an_old_shot().killed('T-34', 'mediumTank', 60.0)

        assert card['damage'] == 0
        assert card['shell'] is None
        assert card['sector'] is None

    def test_a_death_with_nothing_recorded_is_an_empty_card(self):
        card = unknown_death_card()

        assert card == {
            'attacker': None,
            'class': None,
            'shell': None,
            'damage': 0,
            'source': None,
            'at': 1.0,
            'modules': [],
            'sector': None,
        }


class FormatCardTest(unittest.TestCase):

    def test_the_title_names_the_killer_with_the_class(self):
        text = format_card(killing_blow_card(), default_settings(), translator())

        assert u'Вас уничтожил: СТ Pz. IV' in text

    def test_the_shot_line_shows_the_shell_and_the_damage(self):
        text = format_card(killing_blow_card(), default_settings(), translator())

        assert u'ББ · урон 390' in text

    def test_the_damaged_modules_are_listed(self):
        text = format_card(killing_blow_card(), default_settings(), translator())

        assert u'Повреждено: боеукладка' in text

    def test_the_direction_shows_an_arrow_and_the_side(self):
        text = format_card(killing_blow_card(), default_settings(), translator())

        assert u'↓ выстрел сзади' in text

    def test_modules_and_direction_can_be_hidden(self):
        settings = Settings({'show_modules': False, 'show_direction': False}, SCHEMA)

        text = format_card(killing_blow_card(), settings, translator('en'))

        assert 'Destroyed by MT Pz. IV' in text
        assert 'ammo rack' not in text
        assert 'rear' not in text

    def test_no_card_is_no_text(self):
        assert format_card(None, default_settings(), translator()) is None

    def test_an_unknown_killer_is_named_unknown(self):
        text = format_card(unknown_death_card(), default_settings(), translator())

        assert u'неизвестный' in text


class CardWidgetTest(unittest.TestCase):

    def test_the_rows_are_the_shell_the_modules_and_the_side(self):
        data = card_widget(killing_blow_card(), default_settings(), translator())['data']

        assert [row['text'] for row in data['rows']] == [u'ББ', u'боеукладка', u'сзади']

    def test_the_value_is_the_killing_damage(self):
        data = card_widget(killing_blow_card(), default_settings(), translator())['data']

        assert data['value'] == u'−390'

    def test_the_subtitle_is_the_killer(self):
        data = card_widget(killing_blow_card(), default_settings(), translator())['data']

        assert data['subtitle'] == u'Pz. IV'

    def test_no_card_is_no_widget(self):
        assert card_widget(None, default_settings(), translator()) is None


class PreviewAndSettingsTest(unittest.TestCase):

    def test_the_preview_is_a_death_card(self):
        assert u'Вас уничтожил' in preview_text(default_settings(), translator())

    def test_the_switch_is_the_battle_one(self):
        assert SETTINGS == ('battle_death_card',)

    def test_both_languages_have_the_same_strings(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
