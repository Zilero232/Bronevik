# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.team_hp.i18n import STRINGS
from otmetki.features.team_hp.model import TeamHp, bar, format_panel, format_team_hp, icon_row
from otmetki.features.team_hp.model.preview import preview_text
from otmetki.features.team_hp.settings import SCHEMA


def translator(language='ru'):
    return _support.translator(STRINGS, language)


def battle():
    teams = TeamHp(own_team=1)
    teams.add(1, 1, 1000)
    teams.add(2, 1, 1500)
    teams.add(3, 2, 1200)
    teams.add(4, 2, 800, alive=False)
    return teams


class TeamHpTest(unittest.TestCase):

    def test_totals(self):
        values = battle().values()
        assert (values['allies_hp'], values['allies_max'], values['allies_alive']) == (2500, 2500, 2)
        assert (values['enemies_hp'], values['enemies_max'], values['enemies_alive']) == (1200, 2000, 1)
        assert (values['allies_frags'], values['enemies_frags']) == (1, 0)
        assert values['diff'] == 1300

    def test_health_and_kills(self):
        teams = battle()
        assert teams.set_health(3, 400)
        assert not teams.set_health(3, 400)
        assert teams.set_health(1, -50)
        assert teams.vehicles[1]['hp'] == 0
        assert not teams.set_health(2, 99999)
        assert not teams.set_health(99, 10)
        assert teams.kill(2)
        assert not teams.kill(2)
        values = teams.values()
        assert (values['allies_hp'], values['enemies_hp'], values['enemies_frags']) == (0, 400, 1)

    def test_readd_keeps_known_hp(self):
        teams = battle()
        teams.set_health(3, 700)
        teams.add(3, 2, 1200)
        assert teams.vehicles[3]['hp'] == 700
        assert not teams.add(5, 2, 0)
        assert not teams.add('x', 2, 100)

    def test_bar(self):
        assert bar(50, 100, 10, '#FFFFFF').count('|') == 10
        assert '>|||||</font>' in bar(50, 100, 10, '#FFFFFF')
        assert '>||||||||||</font>' in bar(5, 0, 10, '#FFFFFF')


class FormatTest(unittest.TestCase):

    def test_full(self):
        text = format_team_hp(battle().values(), Settings({}, SCHEMA), translator())
        assert '2 500' in text
        assert '1 200' in text
        assert '1 : 0' in text
        assert 'разница +1 300' in text

    def test_styles(self):
        values = battle().values()
        compact = format_team_hp(values, Settings({'style': 'compact', 'show_score': False}, SCHEMA), translator('en'))
        assert '|' not in compact.replace('||', '')
        assert 'difference' not in compact
        bars = format_team_hp(values, Settings({'style': 'bars', 'show_diff': False}, SCHEMA), translator('en'))
        assert '2 500' not in bars
        custom = format_team_hp(values, Settings({'template': '{allies_hp}/{enemies_hp} ({diff})'}, SCHEMA), translator('en'))
        assert '2 500/1 200 (1 300)' in custom

    def test_icon_row_style(self):
        teams = battle()
        teams.set_health(3, 600)
        text = format_panel(teams, Settings({'style': 'icons', 'icon_width': 4}, SCHEMA), translator())
        allies, score, enemies = text.split('   ')
        assert allies.count('|') == 8 and enemies.count('|') == 8 and '1 : 0' in score
        assert u'разница' not in text
        assert [vehicle['max'] for vehicle in teams.team(False)] == [1200, 800]
        assert icon_row([], 3, '#FFFFFF') == ''
        assert '2 500' in format_panel(teams, Settings({'style': 'icons', 'template': '{allies_hp}'}, SCHEMA), translator())

    def test_classes_and_order_from_the_arena(self):
        teams = TeamHp(own_team=1)
        teams.add(9, 2, 1000, kind='heavyTank')
        teams.add(4, 2, 800, kind=5)
        assert [vehicle['kind'] for vehicle in teams.team(False)] == ['heavyTank', None]
        assert teams.is_ally(9) is False and teams.is_ally(77) is False

    def test_colors(self):
        settings = Settings({'ally_color': '#00ff00', 'enemy_color': 'blue'}, SCHEMA)
        assert settings.get('ally_color') == '#00FF00'
        assert settings.get('enemy_color') == '#E3564A'

    def test_strings_in_sync(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])

    def test_preview(self):
        text = preview_text(Settings({}, SCHEMA), translator('en'))
        assert '3 200' in text and '900' in text and '2 : 1' in text


if __name__ == '__main__':
    unittest.main()
