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

TIGER = 202
IS = 303


class VehicleInfo(object):

    def __init__(self, vehicle_id):
        self.vehicleID = vehicle_id


def translator(language='ru'):
    return _support.translator(STRINGS, language)


class HitLogTest(unittest.TestCase):

    def test_result_then_damage_merge(self):
        log = HitLog()
        assert log.add_result(TIGER, 'pen', 10.0, 'Tiger')
        assert log.add_damage(TIGER, 390, 10.5, shell='ap')
        assert log.add_crits(TIGER, 2, 10.6)
        assert log.set_health(TIGER, 1110, 10.7)
        assert len(log.entries) == 1
        entry = log.entries[0]
        assert (entry['outcome'], entry['damage'], entry['crits'], entry['hp'], entry['shell']) == ('pen', 390, 2, 1110, 'ap')

    def test_damage_without_visual_result_makes_a_pen(self):
        log = HitLog()
        assert log.add_damage(TIGER, 200, 1.0, 'Tiger')
        assert log.entries[0]['outcome'] == 'pen'
        assert log.entries[0]['vehicle'] == 'Tiger'

    def test_window_and_targets(self):
        log = HitLog()
        log.add_result(TIGER, 'ricochet', 1.0, 'Tiger')
        log.add_result(IS, 'no_pen', 1.2, 'IS')
        log.add_damage(TIGER, 150, 5.0)
        assert [entry['outcome'] for entry in log.entries] == ['ricochet', 'no_pen', 'pen']
        assert log.entries[0]['damage'] is None
        assert not log.add_crits(IS, 1, 10.0)
        assert not log.set_health(IS, 5, 10.0)

    def test_no_pen_he_splash_keeps_outcome(self):
        log = HitLog()
        log.add_result(TIGER, 'no_pen', 1.0)
        log.add_damage(TIGER, 45, 1.3, shell='he')
        assert (log.entries[0]['outcome'], log.entries[0]['damage']) == ('no_pen', 45)

    def test_health_only_from_the_players_own_shot(self):
        own, ally = VehicleInfo(101), VehicleInfo(303)
        assert own_shot_health((510, own, 0), 101) == 510
        assert own_shot_health((510, ally, 0), 101) is None
        assert own_shot_health((510, None, 0), 101) is None
        assert own_shot_health((510,), 101) is None and own_shot_health(510, 101) is None
        assert own_shot_health((510, own, 0), None) is None

    def test_rejects(self):
        log = HitLog()
        assert not log.add_result(TIGER, 'lucky', 1.0)
        assert not log.add_result(None, 'pen', 1.0)
        assert not log.add_damage(TIGER, 0, 1.0)
        assert not log.add_crits(TIGER, 0, 1.0)
        assert not log.set_health(TIGER, 'x', 1.0)

    def test_totals_and_grouping(self):
        log = HitLog()
        log.add_result(TIGER, 'pen', 1.0, 'Tiger')
        log.add_damage(TIGER, 390, 1.1)
        log.add_result(IS, 'ricochet', 3.0, 'IS')
        log.add_result(TIGER, 'crit', 6.0, 'Tiger')
        log.add_damage(TIGER, 410, 6.1)
        log.set_health(TIGER, 300, 6.2)
        log.add_result(TIGER, 'spaced', 9.0, 'Tiger')
        values = log.values()
        assert (values['hits'], values['pens'], values['ricochets'], values['no_pens'], values['damage']) == (4, 2, 1, 1, 800)
        groups = log.by_target(5)
        assert [group['vehicle'] for group in groups] == ['Tiger', 'IS']
        assert (groups[0]['hits'], groups[0]['damage'], groups[0]['hp'], groups[0]['outcome']) == (3, 800, 300, 'spaced')
        assert log.by_target(0) == []
        assert [entry['outcome'] for entry in log.recent(2)] == ['spaced', 'crit']


class FormatTest(unittest.TestCase):

    def log(self):
        log = HitLog()
        log.add_result(TIGER, 'pen', 1.0, 'Tiger')
        log.add_damage(TIGER, 390, 1.1, shell='apcr')
        log.add_result(IS, 'ricochet', 2.0, 'IS')
        return log

    def test_lines(self):
        text = format_hit_log(self.log(), Settings({}, SCHEMA), translator())
        lines = text.split('\n')
        assert 'Попаданий 2' in lines[0]
        assert 'Урон 390' in lines[0]
        assert '1. IS: <font color="#A3A3AD">рикошет</font>' in lines[1]
        assert '2. Tiger: <font color="#FF7A1A">пробитие</font> 390 БП' in lines[2]

    def test_palettes(self):
        for name, colors in OUTCOME_COLORS.items():
            assert len(colors) == len(OUTCOMES), name
            text = format_hit_log(self.log(), Settings({'palette': name}, SCHEMA), translator())
            assert '<font color="%s">' % colors[OUTCOMES.index('ricochet')] in text, name
        assert outcome_color(None, 'graphite') == outcome_color('unknown', 'classic')
        assert Settings({'palette': 'neon'}, SCHEMA).get('palette') == 'graphite'

    def test_grouped_and_custom(self):
        settings = Settings({'group_by_target': True, 'show_header': False, 'line_template': '{vehicle} {hits} {hp}'}, SCHEMA)
        text = format_hit_log(self.log(), settings, translator('en'))
        assert text.split('\n')[0].endswith('IS 1</font>')
        grouped = format_hit_log(self.log(), Settings({'group_by_target': True}, SCHEMA), translator('en'))
        assert 'Tiger: x1 damage 390' in grouped

    def test_strings_in_sync(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])

    def test_preview(self):
        text = preview_text(Settings({}, SCHEMA), translator('en'))
        assert 'Pz. IV' in text and '390' in text and 'T-34' in text


if __name__ == '__main__':
    unittest.main()
