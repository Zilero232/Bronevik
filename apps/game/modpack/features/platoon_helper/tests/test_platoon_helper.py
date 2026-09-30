# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.platoon_helper.i18n import STRINGS
from otmetki.features.platoon_helper.model import OwnSession, clean_members, format_hangar
from otmetki.features.platoon_helper.settings import SCHEMA, SETTINGS

MEMBERS = [{'name': u'Игрок', 'ready': True, 'self': True}, {'name': u'Напарник', 'ready': False}, {'name': ''}, None,
           {'name': u'Третий', 'ready': 1}]


def translator(language='ru'):
    return _support.translator(STRINGS, language)


def event(result='win', platoon=True, bonus_type=1, damage=2000):
    return {'result': result, 'platoon': {'size': 2} if platoon else None, 'bonus_type': bonus_type, 'stats': {'damage_dealt': damage}}


class PlatoonTest(unittest.TestCase):

    def test_members(self):
        members = clean_members(MEMBERS)
        assert [member['name'] for member in members] == [u'Игрок', u'Напарник', u'Третий']
        assert members[0]['self'] and not members[1]['ready']
        assert clean_members(None) == []

    def test_own_session(self):
        session = OwnSession(idle_s=100)
        assert session.add(event('win'), 0) and session.add(event('loss', damage=1000), 10)
        assert not session.add(event(platoon=False), 20)
        assert session.add(event('win', platoon=False, bonus_type=17, damage=3000), 30)
        assert session.platoon == {'battles': 2, 'wins': 1, 'damage': 3000}
        assert session.clan == {'battles': 1, 'wins': 1, 'damage': 3000}
        session.add(event(), 500)
        assert session.platoon['battles'] == 1 and session.clan['battles'] == 0

    def test_format(self):
        session = OwnSession()
        session.add(event('win'), 0)
        session.add(event('loss', damage=1000), 1)
        text = format_hangar(clean_members(MEMBERS), session, Settings({}, SCHEMA), translator())
        assert u'Взвод: готовы 2 из 3' in text and u'Напарник' in text and u'✓' in text
        assert u'Во взводе за сессию: 2 боя, 50% побед, урон 1 500' in text and u'Клановые' not in text
        only_session = format_hangar([], session, Settings({}, SCHEMA), translator('en'))
        assert 'Platoon:' not in only_session and 'In a platoon this session' in only_session
        assert format_hangar([], OwnSession(), Settings({}, SCHEMA), translator()) is None

    def test_settings_and_strings(self):
        assert SETTINGS == ('hangar_platoon_helper',)
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
