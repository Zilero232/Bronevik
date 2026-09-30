# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import time
import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.hangar_info.i18n import STRINGS
from otmetki.features.hangar_info.model import armor_actions, format_info, format_widget, layout_of, tank_slug
from otmetki.features.hangar_info.model.constants import PING_BAD_COLOR, PING_GOOD_COLOR, PING_NORM_COLOR
from otmetki.features.hangar_info.model.ping import ping_color, ping_tone, valid_ping
from otmetki.features.hangar_info.settings import SCHEMA, SETTINGS

NOW = time.mktime((2026, 9, 27, 18, 5, 9, 0, 0, -1))
INFO = {'server': 'RU4', 'ping': 42, 'online': '81 234', 'region_online': None}


def translator(language='ru'):
    return _support.translator(STRINGS, language)


def settings(**values):
    return Settings(values, SCHEMA)


def vehicle_info(**values):
    info = dict(INFO, vehicle=u'T-34', tiers=(5, 7), crew_xp=12400, crew_role=u'Наводчик', accelerated=True)
    info.update(values)
    return info


def vehicle_line(info, language='ru'):
    return format_info(info, settings(), translator(language), NOW).splitlines()[-1]


class TankSlugTest(unittest.TestCase):

    def test_the_slug_is_the_lower_case_tag(self):
        assert tank_slug('ussr:R45_IS-7') == 'r45-is-7'
        assert tank_slug(u'uk:GB83_FV4005') == 'gb83-fv4005'

    def test_underscores_become_dashes(self):
        assert tank_slug('china:Ch41_WZ_111_5A') == 'ch41-wz-111-5a'

    def test_apostrophes_are_dropped(self):
        assert tank_slug("usa:A13_T110E5'") == 'a13-t110e5'

    def test_an_ampersand_becomes_and(self):
        assert tank_slug('germany:G_Tiger&Co') == 'g-tiger-and-co'

    def test_no_slug_without_a_tag(self):
        assert tank_slug('') is None
        assert tank_slug(None) is None


class ArmorActionTest(unittest.TestCase):

    def test_armour_link_uses_the_site_slug_of_the_tag(self):
        action = armor_actions('ussr:R04_T-34', translator())[0]

        assert action == {'id': 'armor', 'label': u'Броня на сайте', 'link': '/t/r04-t-34/armor', 'confirm': None}

    def test_no_armour_link_without_a_vehicle(self):
        assert armor_actions(None, translator()) == []


class PanelTest(unittest.TestCase):

    def test_default_panel(self):
        text = format_info(INFO, settings(), translator(), NOW)

        assert '18:05:09' in text
        assert '27.09.2026' in text
        assert 'RU4' in text
        assert u'42 мс' in text
        assert '81 234' in text
        assert PING_GOOD_COLOR in text

    def test_switches_and_missing_values(self):
        switches = settings(show_server=False, show_online=False, date_format='', clock_format='%H:%M')

        text = format_info({'server': 'RU4', 'ping': -1}, switches, translator('en'), NOW)

        assert text.count('\n') == 0
        assert '18:05' in text
        assert 'RU4' not in text
        assert 'ms' not in text

    def test_template(self):
        template = settings(template='{time} {server} {ping} {{x}')

        text = format_info(INFO, template, translator('en'), NOW)

        assert text == '18:05:09 RU4 42 ms {x}'


class VehicleLineTest(unittest.TestCase):

    def test_selected_vehicle_line(self):
        last = vehicle_line(vehicle_info())

        assert u'T-34' in last
        assert u'бои 5–7 ур.' in last
        assert u'до навыка 12 400 опыта (Наводчик)' in last
        assert u'ускоренное обучение' in last

    def test_one_tier_crew_without_a_role_and_no_training(self):
        info = vehicle_info(tiers=[10, 10], crew_role=None, accelerated=False)

        text = format_info(info, settings(), translator('en'), NOW)

        assert 'battles tier 10' in text
        assert '12 400 XP to a skill' in text
        assert 'no accelerated training' in text

    def test_no_vehicle_line_without_details(self):
        info = dict(INFO, vehicle=u'T-34', tiers='x', crew_xp=None, accelerated=None)

        text = format_info(info, settings(), translator(), NOW)

        assert u'T-34' not in text

    def test_vehicle_macros_in_a_template(self):
        template = settings(template='{vehicle} {tiers} | {crew}')

        text = format_info(vehicle_info(), template, translator('en'), NOW)

        assert text == u'T-34 battles tiers 5–7 | 12 400 XP to a skill (Наводчик)'


class WidgetTest(unittest.TestCase):

    def test_the_card_carries_the_time_and_the_date(self):
        data = format_widget(INFO, settings(), translator(), NOW)['data']

        assert data['value'] == '18:05:09'
        assert data['title'] == '27.09.2026'

    def test_the_ping_chip_takes_the_band_tone(self):
        data = format_widget(INFO, settings(), translator(), NOW)['data']

        assert [chip['tone'] for chip in data['chips']] == ['text', 'good', 'text']

    def test_the_vehicle_rows_carry_the_vehicle_as_subtitle(self):
        data = format_widget(vehicle_info(), settings(), translator(), NOW)['data']

        assert data['subtitle'] == u'T-34'
        assert len(data['rows']) == 3
        assert data['rows'][2]['status'] == 'done'

    def test_no_card_with_a_custom_template(self):
        assert format_widget(INFO, settings(template='{time}'), translator(), NOW) is None


class PingTest(unittest.TestCase):

    def test_a_negative_ping_is_invalid(self):
        assert valid_ping(-1) is None

    def test_no_ping_is_invalid(self):
        assert valid_ping(None) is None

    def test_a_valid_ping_is_whole_milliseconds(self):
        assert valid_ping(80.4) == 80

    def test_ping_colours_follow_the_client_bands(self):
        assert ping_color(10) == PING_GOOD_COLOR
        assert ping_color(59) == PING_GOOD_COLOR
        assert ping_color(119) == PING_NORM_COLOR
        assert ping_color(200) == PING_BAD_COLOR

    def test_ping_tones_follow_the_client_bands(self):
        assert ping_tone(None) == 'muted'
        assert ping_tone(59) == 'good'
        assert ping_tone(60) == 'warning'
        assert ping_tone(120) == 'bad'


class SettingsTest(unittest.TestCase):

    def test_an_unknown_clock_format_falls_back_to_the_default(self):
        assert settings(clock_format='%s').get('clock_format') == '%H:%M:%S'

    def test_layout_clamps_the_position(self):
        layout = layout_of(settings(x=99999, align_x='middle'))

        assert layout == {'x': 4000, 'y': 76, 'alignX': 'right', 'alignY': 'top', 'scale': 1.0}

    def test_the_config_switch(self):
        assert SETTINGS == ('hangar_info',)

    def test_strings_in_sync(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
