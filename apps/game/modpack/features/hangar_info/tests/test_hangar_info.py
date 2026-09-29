# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import time
import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.hangar_info.i18n import STRINGS
from otmetki.features.hangar_info.model import armor_actions, format_info, layout_of, ping_color, tank_slug, valid_ping
from otmetki.features.hangar_info.model.constants import PING_BAD_COLOR, PING_GOOD_COLOR
from otmetki.features.hangar_info.settings import SCHEMA, SETTINGS

NOW = time.mktime((2026, 9, 27, 18, 5, 9, 0, 0, -1))
INFO = {'server': 'RU4', 'ping': 42, 'online': '81 234', 'region_online': None}


def translator(language='ru'):
    return _support.translator(STRINGS, language)


class HangarInfoTest(unittest.TestCase):

    def test_armour_link_uses_the_site_slug_of_the_tag(self):
        assert tank_slug('ussr:R45_IS-7') == 'r45-is-7'
        assert tank_slug(u'uk:GB83_FV4005') == 'gb83-fv4005'
        assert tank_slug('china:Ch41_WZ_111_5A') == 'ch41-wz-111-5a'
        assert tank_slug("usa:A13_T110E5'") == 'a13-t110e5'
        assert tank_slug('germany:G_Tiger&Co') == 'g-tiger-and-co'
        assert tank_slug('') is None and tank_slug(None) is None
        action = armor_actions('ussr:R04_T-34', translator())[0]
        assert action == {'id': 'armor', 'label': u'Броня на сайте', 'link': '/t/r04-t-34/armor', 'confirm': None}
        assert armor_actions(None, translator()) == []

    def test_default_panel(self):
        text = format_info(INFO, Settings({}, SCHEMA), translator(), NOW)
        assert '18:05:09' in text and '27.09.2026' in text
        assert 'RU4' in text and u'42 мс' in text and '81 234' in text
        assert PING_GOOD_COLOR in text

    def test_switches_and_missing_values(self):
        settings = Settings({'show_server': False, 'show_online': False, 'date_format': '', 'clock_format': '%H:%M'}, SCHEMA)
        text = format_info({'server': 'RU4', 'ping': -1}, settings, translator('en'), NOW)
        assert text.count('\n') == 0 and '18:05' in text and 'RU4' not in text and 'ms' not in text

    def test_template(self):
        settings = Settings({'template': '{time} {server} {ping} {{x}'}, SCHEMA)
        assert format_info(INFO, settings, translator('en'), NOW) == '18:05:09 RU4 42 ms {x}'

    def test_selected_vehicle_line(self):
        info = dict(INFO, vehicle=u'T-34', tiers=(5, 7), crew_xp=12400, crew_role=u'Наводчик', accelerated=True)
        text = format_info(info, Settings({}, SCHEMA), translator(), NOW)
        last = text.splitlines()[-1]
        assert u'T-34' in last and u'бои 5–7 ур.' in last and u'до навыка 12 400 опыта (Наводчик)' in last and u'ускоренное обучение' in last
        same = format_info(dict(info, tiers=[10, 10], crew_role=None, accelerated=False), Settings({}, SCHEMA), translator('en'), NOW)
        assert 'battles tier 10' in same and '12 400 XP to a skill' in same and 'no accelerated training' in same
        bare = format_info(dict(INFO, vehicle=u'T-34', tiers='x', crew_xp=None, accelerated=None), Settings({}, SCHEMA), translator(), NOW)
        assert u'T-34' not in bare
        custom = format_info(info, Settings({'template': '{vehicle} {tiers} | {crew}'}, SCHEMA), translator('en'), NOW)
        assert custom == u'T-34 battles tiers 5–7 | 12 400 XP to a skill (Наводчик)'

    def test_ping(self):
        assert valid_ping(-1) is None and valid_ping(None) is None and valid_ping(80.4) == 80
        assert ping_color(200) == PING_BAD_COLOR and ping_color(10) == PING_GOOD_COLOR

    def test_settings(self):
        settings = Settings({'clock_format': '%s', 'x': 99999, 'align_x': 'middle'}, SCHEMA)
        assert settings.get('clock_format') == '%H:%M:%S'
        assert layout_of(settings) == {'x': 4000, 'y': 120, 'alignX': 'right', 'alignY': 'top', 'scale': 1.0}
        assert SETTINGS == ('hangar_info',)

    def test_strings_in_sync(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
