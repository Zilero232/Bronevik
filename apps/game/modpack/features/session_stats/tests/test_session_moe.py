# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.companion.i18n import STRINGS as COMPANION_STRINGS
from otmetki.companion.i18n import Translator
from otmetki.core.format import strip_tags
from otmetki.core.i18n import Catalog
from otmetki.core.settings import Settings
from otmetki.features.session_stats.i18n import STRINGS
from otmetki.features.session_stats.model import SessionMoe, SessionView, format_session_panel, session_widget
from otmetki.features.session_stats.settings import SCHEMA

SESSION = 'session-1'
SUMMARY = {'session_id': SESSION, 'battles': 3, 'win_rate': 66.67, 'avg_damage': 2400.0, 'recent': [], 'pending': 0}


def played(*battles):
    moe = SessionMoe()
    for tank_id, change, percent in battles:
        moe.add(SESSION, tank_id, change, percent)
    return moe


def translator(language='en'):
    return Translator(language, Catalog(COMPANION_STRINGS, STRINGS))


def view(moe):
    return SessionView(SUMMARY, moe=moe.rows(SESSION, 3), vehicle_names={1: u'T-34', 2: u'IS-7'})


class SessionMoeTest(unittest.TestCase):

    def test_the_changes_of_a_tank_add_up_to_the_hundredth(self):
        rows = played((1, 0.42, 86.54), (1, -0.11, 86.43)).rows(SESSION, 3)

        assert rows[0]['change'] == 0.31
        assert rows[0]['percent'] == 86.43
        assert rows[0]['battles'] == 2

    def test_the_last_played_tank_comes_first(self):
        rows = played((1, 0.42, 86.54), (2, 0.2, 40.0), (1, 0.1, 86.64)).rows(SESSION, 3)

        assert [row['tank_id'] for row in rows] == [1, 2]

    def test_a_battle_without_an_exact_change_is_not_counted(self):
        assert played((1, None, None)).rows(SESSION, 3) == []

    def test_a_new_session_starts_empty(self):
        moe = played((1, 0.42, 86.54))
        moe.add('session-2', 2, 0.1, 40.0)

        assert [row['tank_id'] for row in moe.rows('session-2', 3)] == [2]
        assert moe.rows(SESSION, 3) == []

    def test_the_state_survives_a_restart(self):
        moe = SessionMoe(played((1, 0.42, 86.54), (2, -0.2, 40.0)).to_dict())
        moe.add(SESSION, 1, 0.1, 86.64)

        assert [(row['tank_id'], row['change']) for row in moe.rows(SESSION, 3)] == [(1, 0.52), (2, -0.2)]

    def test_a_broken_state_is_dropped(self):
        moe = SessionMoe({'session_id': SESSION, 'tanks': {'1': {'change': 'x'}, '2': 'junk'}})

        assert moe.rows(SESSION, 3) == []

    def test_a_stored_wrong_scale_change_is_dropped(self):
        stored = {'battles': 3, 'change': -65.78, 'order': 3, 'percent': 0.69, 'tank_id': 7940641}

        moe = SessionMoe({'session_id': SESSION, 'tanks': {'7940641': stored}})

        assert moe.rows(SESSION, 3) == []


class SessionMoeCardTest(unittest.TestCase):

    def test_each_tank_row_shows_the_signed_change_and_the_percent(self):
        rows = session_widget(view(played((1, 0.42, 86.54))), Settings({}, SCHEMA), translator())['data']['rows']

        row = rows[0]

        assert (row['label'], row['text'], row['value'], row['note']) == (u'MoE', u'T-34', u'+0.42%', u'86.54%')
        assert row['tone'] == 'good'

    def test_a_drop_is_bad(self):
        rows = session_widget(view(played((2, -0.2, 40.0))), Settings({}, SCHEMA), translator())['data']['rows']

        assert (rows[0]['value'], rows[0]['tone']) == (u'-0.20%', 'bad')

    def test_the_text_card_has_the_same_line(self):
        text = strip_tags(format_session_panel(view(played((1, 0.42, 86.54))), Settings({}, SCHEMA), translator()))

        assert u'MoE T-34 +0.42%' in text


if __name__ == '__main__':
    unittest.main()
