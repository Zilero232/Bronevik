# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.hit_log.i18n import STRINGS
from otmetki.features.hit_log.model import HitLog, format_hit_log, outcome_color, own_shot_health
from otmetki.features.hit_log.model.constants import OUTCOME_COLORS, OUTCOMES
from otmetki.features.hit_log.model.preview import preview_text
from otmetki.features.hit_log.settings import SCHEMA

OWN_VEHICLE = 101
TIGER = 202
IS = 303


class VehicleInfo(object):

    def __init__(self, vehicle_id):
        self.vehicleID = vehicle_id


def translator(language='ru'):
    return _support.translator(STRINGS, language)


def merged_pen():
    log = HitLog()
    log.add_result(TIGER, 'pen', 10.0, 'Tiger')
    log.add_damage(TIGER, 390, 10.5, shell='ap')
    log.add_crits(TIGER, 2, 10.6)
    log.set_health(TIGER, 1110, 10.7)
    return log


def mixed_battle():
    log = HitLog()
    log.add_result(TIGER, 'pen', 1.0, 'Tiger')
    log.add_damage(TIGER, 390, 1.1)
    log.add_result(IS, 'ricochet', 3.0, 'IS')
    log.add_result(TIGER, 'crit', 6.0, 'Tiger')
    log.add_damage(TIGER, 410, 6.1)
    log.set_health(TIGER, 300, 6.2)
    log.add_result(TIGER, 'spaced', 9.0, 'Tiger')
    return log


def pen_and_ricochet():
    log = HitLog()
    log.add_result(TIGER, 'pen', 1.0, 'Tiger')
    log.add_damage(TIGER, 390, 1.1, shell='apcr')
    log.add_result(IS, 'ricochet', 2.0, 'IS')
    return log


def pen_with_crits():
    log = pen_and_ricochet()
    log.add_crits(TIGER, 2, 1.2)
    log.set_health(TIGER, 1110, 1.3)
    return log


class HitLogTest(unittest.TestCase):

    def test_result_damage_crits_and_health_of_one_shot_merge_into_one_entry(self):
        log = merged_pen()

        entry = log.entries[0]
        assert len(log.entries) == 1
        assert entry['outcome'] == 'pen'
        assert entry['damage'] == 390
        assert entry['crits'] == 2
        assert entry['hp'] == 1110
        assert entry['shell'] == 'ap'

    def test_damage_without_a_marker_makes_a_pen(self):
        log = HitLog()

        added = log.add_damage(TIGER, 200, 1.0, 'Tiger')

        assert added
        assert log.entries[0]['outcome'] == 'pen'
        assert log.entries[0]['vehicle'] == 'Tiger'

    def test_damage_after_the_merge_window_is_a_new_entry(self):
        log = HitLog()
        log.add_result(TIGER, 'ricochet', 1.0, 'Tiger')
        log.add_result(IS, 'no_pen', 1.2, 'IS')

        log.add_damage(TIGER, 150, 5.0)

        assert [entry['outcome'] for entry in log.entries] == ['ricochet', 'no_pen', 'pen']
        assert log.entries[0]['damage'] is None

    def test_crits_after_the_merge_window_are_dropped(self):
        log = HitLog()
        log.add_result(IS, 'no_pen', 1.2, 'IS')

        assert not log.add_crits(IS, 1, 10.0)

    def test_health_after_the_merge_window_is_dropped(self):
        log = HitLog()
        log.add_result(IS, 'no_pen', 1.2, 'IS')

        assert not log.set_health(IS, 5, 10.0)

    def test_he_splash_on_a_no_pen_keeps_the_outcome(self):
        log = HitLog()
        log.add_result(TIGER, 'no_pen', 1.0)

        log.add_damage(TIGER, 45, 1.3, shell='he')

        assert log.entries[0]['outcome'] == 'no_pen'
        assert log.entries[0]['damage'] == 45

    def test_marker_after_the_damage_event_names_the_same_hit(self):
        log = HitLog()
        log.add_damage(TIGER, 390, 1.0, 'Tiger', 'ap')

        log.add_result(TIGER, 'crit', 1.2, 'Tiger')

        values = log.values()
        assert len(log.entries) == 1
        assert log.entries[0]['outcome'] == 'crit'
        assert log.entries[0]['damage'] == 390
        assert values['hits'] == 1
        assert values['pens'] == 1

    def test_a_second_marker_after_the_merged_one_is_a_new_hit(self):
        log = HitLog()
        log.add_damage(TIGER, 390, 1.0, 'Tiger', 'ap')
        log.add_result(TIGER, 'crit', 1.2, 'Tiger')

        log.add_result(TIGER, 'ricochet', 1.5)

        assert log.values()['hits'] == 2

    def test_damage_skips_a_ricochet_of_the_same_target(self):
        log = HitLog()
        log.add_result(TIGER, 'ricochet', 1.0)

        log.add_damage(TIGER, 300, 1.5)

        assert [(entry['outcome'], entry['damage']) for entry in log.entries] == [('ricochet', None), ('pen', 300)]

    def test_marker_names_the_damage_that_skipped_a_ricochet(self):
        log = HitLog()
        log.add_result(TIGER, 'ricochet', 1.0)
        log.add_damage(TIGER, 300, 1.5)

        log.add_result(TIGER, 'pen', 1.6)

        values = log.values()
        assert values['hits'] == 2
        assert values['pens'] == 1

    def test_two_shots_in_one_window_keep_their_damage(self):
        log = HitLog()
        log.add_result(TIGER, 'pen', 1.0)
        log.add_result(TIGER, 'pen', 1.4)

        log.add_damage(TIGER, 390, 1.5)
        log.add_damage(TIGER, 400, 1.6)

        assert sorted(entry['damage'] for entry in log.entries) == [390, 400]
        assert log.values()['damage'] == 790

    def test_rejects_an_unknown_outcome(self):
        assert not HitLog().add_result(TIGER, 'lucky', 1.0)

    def test_rejects_a_result_without_a_target(self):
        assert not HitLog().add_result(None, 'pen', 1.0)

    def test_rejects_zero_damage(self):
        assert not HitLog().add_damage(TIGER, 0, 1.0)

    def test_rejects_zero_crits(self):
        assert not HitLog().add_crits(TIGER, 0, 1.0)

    def test_rejects_health_that_is_not_a_number(self):
        assert not HitLog().set_health(TIGER, 'x', 1.0)

    def test_totals_count_hits_by_outcome(self):
        values = mixed_battle().values()

        assert values == {'hits': 4, 'pens': 2, 'no_pens': 1, 'ricochets': 1, 'damage': 800, 'crits': 0}

    def test_groups_are_newest_target_first(self):
        groups = mixed_battle().by_target(5)

        assert [group['vehicle'] for group in groups] == ['Tiger', 'IS']

    def test_a_group_sums_the_hits_of_its_target(self):
        tiger = mixed_battle().by_target(5)[0]

        assert tiger['hits'] == 3
        assert tiger['damage'] == 800
        assert tiger['hp'] == 300
        assert tiger['outcome'] == 'spaced'

    def test_zero_groups_is_empty(self):
        assert mixed_battle().by_target(0) == []

    def test_recent_is_newest_first(self):
        outcomes = [entry['outcome'] for entry in mixed_battle().recent(2)]

        assert outcomes == ['spaced', 'crit']


class OwnShotHealthTest(unittest.TestCase):

    def test_health_after_the_players_own_shot(self):
        assert own_shot_health((510, VehicleInfo(OWN_VEHICLE), 0), OWN_VEHICLE) == 510

    def test_nothing_after_an_allys_shot(self):
        assert own_shot_health((510, VehicleInfo(IS), 0), OWN_VEHICLE) is None

    def test_nothing_without_an_attacker(self):
        assert own_shot_health((510, None, 0), OWN_VEHICLE) is None

    def test_nothing_from_a_short_payload(self):
        assert own_shot_health((510,), OWN_VEHICLE) is None

    def test_nothing_from_a_bare_number(self):
        assert own_shot_health(510, OWN_VEHICLE) is None

    def test_nothing_before_the_own_vehicle_is_known(self):
        assert own_shot_health((510, VehicleInfo(OWN_VEHICLE), 0), None) is None


class FormatTest(unittest.TestCase):

    def test_header_counts_the_hits_and_the_damage(self):
        lines = format_hit_log(pen_and_ricochet(), Settings({}, SCHEMA), translator()).split('\n')

        assert 'Попаданий 2' in lines[0]
        assert 'Урон 390' in lines[0]

    def test_lines_are_newest_first_with_the_outcome_coloured(self):
        lines = format_hit_log(pen_and_ricochet(), Settings({}, SCHEMA), translator()).split('\n')

        assert '1. IS: <font color="#A3A3AD">рикошет</font>' in lines[1]
        assert '2. Tiger: <font color="#FF7A1A">пробитие</font> 390 БП' in lines[2]

    def test_every_palette_colours_every_outcome(self):
        for name, colors in OUTCOME_COLORS.items():
            assert len(colors) == len(OUTCOMES), name

    def test_palettes_colour_the_ricochet(self):
        for name, colors in OUTCOME_COLORS.items():
            settings = Settings({'palette': name}, SCHEMA)
            ricochet_color = colors[OUTCOMES.index('ricochet')]

            text = format_hit_log(pen_and_ricochet(), settings, translator())

            assert '<font color="%s">' % ricochet_color in text, name

    def test_an_unknown_outcome_is_muted_in_any_palette(self):
        assert outcome_color(None, 'graphite') == outcome_color('unknown', 'classic')

    def test_an_unknown_palette_falls_back_to_graphite(self):
        assert Settings({'palette': 'neon'}, SCHEMA).get('palette') == 'graphite'

    def test_custom_template_grouped_by_target(self):
        settings = Settings({
            'group_by_target': True,
            'show_header': False,
            'line_template': '{vehicle} {hits} {hp}',
        }, SCHEMA)

        text = format_hit_log(pen_and_ricochet(), settings, translator('en'))

        assert text.split('\n')[0].endswith('IS 1</font>')

    def test_grouped_line_counts_the_hits_on_a_target(self):
        settings = Settings({'group_by_target': True}, SCHEMA)

        text = format_hit_log(pen_and_ricochet(), settings, translator('en'))

        assert 'Tiger: x1 damage 390' in text

    def test_alt_mode_line_is_short_while_alt_is_up(self):
        settings = Settings({'alt_mode': True, 'show_header': False}, SCHEMA)

        lines = format_hit_log(pen_with_crits(), settings, translator()).splitlines()

        assert '<font color="#FF7A1A">пробитие</font> 390 Tiger' in lines[1]
        assert 'БП' not in lines[1]

    def test_alt_mode_line_is_full_while_alt_is_held(self):
        settings = Settings({'alt_mode': True, 'show_header': False}, SCHEMA)

        lines = format_hit_log(pen_with_crits(), settings, translator(), extended=True).splitlines()

        assert '2. Tiger: <font color="#FF7A1A">пробитие</font> 390 БП криты x2 осталось 1 110' in lines[1]

    def test_alt_mode_grouped_line_is_full_while_alt_is_held(self):
        settings = Settings({'alt_mode': True, 'group_by_target': True}, SCHEMA)

        text = format_hit_log(pen_with_crits(), settings, translator('en'), extended=True)

        assert 'Tiger: x1 damage 390 crits x2 1 110 HP left' in text

    def test_alt_line_template_is_the_line_while_alt_is_held(self):
        settings = Settings({'alt_mode': True, 'show_header': False, 'alt_line_template': '{vehicle}!'}, SCHEMA)

        lines = format_hit_log(pen_and_ricochet(), settings, translator(), extended=True).splitlines()

        assert lines[0].endswith('IS!</font>')

    def test_alt_keeps_the_regular_line_without_the_alt_mode(self):
        settings = Settings({'show_header': False, 'alt_line_template': '{vehicle}!'}, SCHEMA)

        lines = format_hit_log(pen_and_ricochet(), settings, translator(), extended=True).splitlines()

        assert '1. IS: <font color="#A3A3AD">рикошет</font>' in lines[0]

    def test_strings_in_sync(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])

    def test_preview_shows_the_sample_hits(self):
        text = preview_text(Settings({}, SCHEMA), translator('en'))

        assert 'Pz. IV' in text
        assert '390' in text
        assert 'T-34' in text


if __name__ == '__main__':
    unittest.main()
