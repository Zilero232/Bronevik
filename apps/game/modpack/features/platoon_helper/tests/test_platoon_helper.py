# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.platoon_helper.i18n import STRINGS
from otmetki.features.platoon_helper.model import OwnSession, clean_members, format_hangar
from otmetki.features.platoon_helper.settings import SCHEMA, SETTINGS

MEMBERS = [
    {'name': u'Игрок', 'ready': True, 'self': True},
    {'name': u'Напарник', 'ready': False},
    {'name': ''},
    None,
    {'name': u'Третий', 'ready': 1},
]


def translator(language='ru'):
    return _support.translator(STRINGS, language)


def event(result='win', platoon=True, bonus_type=1, damage=2000):
    return {
        'result': result,
        'platoon': {'size': 2} if platoon else None,
        'bonus_type': bonus_type,
        'stats': {'damage_dealt': damage},
    }


def mixed_session():
    session = OwnSession(idle_s=100)
    session.add(event('win'), 0)
    session.add(event('loss', damage=1000), 10)
    session.add(event(platoon=False), 20)
    session.add(event('win', platoon=False, bonus_type=17, damage=3000), 30)
    return session


def platoon_session():
    session = OwnSession()
    session.add(event('win'), 0)
    session.add(event('loss', damage=1000), 1)
    return session


class MembersTest(unittest.TestCase):

    def test_members_without_a_name_are_dropped(self):
        members = clean_members(MEMBERS)

        assert [member['name'] for member in members] == [u'Игрок', u'Напарник', u'Третий']

    def test_the_own_member_is_marked(self):
        members = clean_members(MEMBERS)

        assert members[0]['self'] is True

    def test_a_waiting_member_is_not_ready(self):
        members = clean_members(MEMBERS)

        assert members[1]['ready'] is False

    def test_no_members(self):
        assert clean_members(None) == []


class OwnSessionTest(unittest.TestCase):

    def test_a_platoon_battle_counts(self):
        assert OwnSession().add(event('win'), 0) is True

    def test_a_solo_random_battle_does_not_count(self):
        assert OwnSession().add(event(platoon=False), 0) is False

    def test_platoon_totals(self):
        assert mixed_session().platoon == {'battles': 2, 'wins': 1, 'damage': 3000}

    def test_clan_totals(self):
        assert mixed_session().clan == {'battles': 1, 'wins': 1, 'damage': 3000}

    def test_a_long_pause_starts_a_new_session(self):
        session = mixed_session()

        session.add(event(), 500)

        assert session.platoon['battles'] == 1
        assert session.clan['battles'] == 0


class HangarTextTest(unittest.TestCase):

    def test_members_and_their_ready_marks(self):
        text = format_hangar(clean_members(MEMBERS), platoon_session(), Settings({}, SCHEMA), translator())

        assert u'Взвод: готовы 2 из 3' in text
        assert u'Напарник' in text
        assert u'✓' in text

    def test_the_platoon_session_line(self):
        text = format_hangar(clean_members(MEMBERS), platoon_session(), Settings({}, SCHEMA), translator())

        assert u'Во взводе за сессию: 2 боя, 50% побед, урон 1 500' in text
        assert u'Клановые' not in text

    def test_outside_a_platoon_only_the_session_line(self):
        text = format_hangar([], platoon_session(), Settings({}, SCHEMA), translator('en'))

        assert 'Platoon:' not in text
        assert 'In a platoon this session' in text

    def test_nothing_to_show(self):
        assert format_hangar([], OwnSession(), Settings({}, SCHEMA), translator()) is None


class SettingsTest(unittest.TestCase):

    def test_settings_switch(self):
        assert SETTINGS == ('hangar_platoon_helper',)

    def test_strings_in_both_languages(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
