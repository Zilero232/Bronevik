# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.comp7_helper.i18n import STRINGS
from otmetki.features.comp7_helper.model import clean_state, format_hangar, next_text, progress, thresholds
from otmetki.features.comp7_helper.model.widget import hangar_widget
from otmetki.features.comp7_helper.settings import SCHEMA, SETTINGS


def translator(language='ru'):
    return _support.translator(STRINGS, language)


def division(rank, index, begin, elite_percent=0):
    return {'rank': rank, 'index': index, 'begin': begin, 'elite_percent': elite_percent}


DIVISIONS = [division(4, 1, 2000), division(5, 3, 2500), division(5, 2, 3000), division(5, 1, 3500), division(6, 3, 4000, 10),
             division(6, 2, 4000, 5), division(6, 1, 4000, 1), {'rank': 9, 'index': 1, 'begin': 0}, None]


def state(rating, current, **extra):
    raw = {'rating': rating, 'division': current, 'divisions': list(reversed(DIVISIONS)), 'skill': u'Точка сбора'}
    raw.update(extra)
    return clean_state(raw)


class Comp7HelperTest(unittest.TestCase):

    def test_clean_state_orders_and_drops_bad_divisions(self):
        found = state(3150, division(5, 2, 3000))
        assert [(item['rank'], item['index']) for item in found['divisions']] == [(4, 1), (5, 3), (5, 2), (5, 1), (6, 3), (6, 2), (6, 1)]
        assert clean_state(None) is None
        assert clean_state({'rating': True})['rating'] == 0

    def test_progress_to_the_next_division(self):
        target, left, share = progress(state(3150, division(5, 2, 3000)))
        assert (target['rank'], target['index'], left) == (5, 1, 350)
        assert round(share, 2) == 0.3
        assert next_text(state(3150, division(5, 2, 3000)), translator()) == u'До «Чемпион A»: 350 очков'
        assert next_text(state(4200, division(6, 2, 4000, 5)), translator()) == u'«Легенда A» — по месту в таблице лидеров'
        assert progress(state(4500, division(6, 1, 4000, 1))) is None
        assert progress(state(0, None, qualification=True)) is None

    def test_threshold_statuses(self):
        rows = thresholds(state(3150, division(5, 2, 3000)))
        assert [status for _, status in rows] == ['done', 'active', 'idle', 'idle', 'idle', 'idle']
        assert all(status == 'idle' for _, status in thresholds(state(0, None, qualification=True)))

    def test_format_and_widget(self):
        settings = Settings({}, SCHEMA)
        text = format_hangar(state(3150, division(5, 2, 3000)), settings, translator())
        assert u'Натиск: Чемпион B, 3 150 очков' in text
        assert u'Легенда A: от 4 000 · топ-1%' in text and u'Навык роли: Точка сбора' in text
        widget = hangar_widget(state(3150, division(5, 2, 3000)), settings, translator('en'))
        data = widget['data']
        assert widget['kind'] == 'card' and data['value'] == '3 150' and data['subtitle'] == 'Champion B' and data['rail'] == 'progress'
        assert data['rows'][0]['text'] == u'To «Champion A»: 350 points' and data['rows'][0]['progress'] == 0.3
        assert data['rows'][-1]['text'] == u'Точка сбора'
        assert format_hangar(None, settings, translator()) is None and hangar_widget(None, settings, translator()) is None

    def test_qualification(self):
        text = format_hangar(state(0, None, qualification=True, skill=None), Settings({'show_thresholds': False}, SCHEMA), translator())
        assert text.count('\n') == 0 and u'Квалификация' in text

    def test_settings_and_strings(self):
        assert SETTINGS == ('hangar_comp7_helper',)
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
