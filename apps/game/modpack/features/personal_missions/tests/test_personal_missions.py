# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.personal_missions.i18n import STRINGS
from otmetki.features.personal_missions.model import build_page, clean_missions, counts, format_battle, format_hangar, in_progress
from otmetki.features.personal_missions.model.constants import MAX_MISSIONS, MAX_TEXT, PREVIEW_MISSIONS
from otmetki.features.personal_missions.model.preview import preview_text
from otmetki.features.personal_missions.settings import SCHEMA, SETTINGS


def translator(language='ru'):
    return _support.translator(STRINGS, language)


def missions():
    return clean_missions(PREVIEW_MISSIONS)[0]


class MissionsTest(unittest.TestCase):

    def test_clean(self):
        raw = list(PREVIEW_MISSIONS) + [{'id': 9, 'name': u'<b>X</b>  1', 'main': u'a' * 500, 'state': 'in_progress'},
                                        {'id': 10, 'name': u'Y', 'state': 'failed'}, {'id': 11, 'name': u'', 'state': 'done'}, 'junk']
        cleaned, totals = clean_missions(raw)
        assert [mission['id'] for mission in cleaned] == [1, 2, 9, 3]
        assert cleaned[2]['name'] == u'X 1' and len(cleaned[2]['main']) == MAX_TEXT and cleaned[2]['classes'] == []
        assert totals == {'active': 3, 'done': 1, 'honors': 1}

    def test_the_cap_keeps_the_missions_in_progress_and_the_totals_count_all(self):
        finished = [{'id': index, 'name': u'Done %d' % index, 'state': 'done'} for index in range(MAX_MISSIONS + 20)]
        active = {'id': 'last', 'name': u'Active', 'state': 'in_progress'}
        cleaned, totals = clean_missions(finished + [active])
        assert len(cleaned) == MAX_MISSIONS and cleaned[0]['id'] == 'last'
        assert totals == {'active': 1, 'done': MAX_MISSIONS + 20, 'honors': 0}
        text = format_hangar(cleaned, Settings({}, SCHEMA), translator('en'), totals)
        assert u'1 in progress, %d done' % (MAX_MISSIONS + 20) in text and u'Active' in text

    def test_in_progress_by_class_and_counts(self):
        assert [mission['id'] for mission in in_progress(missions())] == [1, 2]
        assert [mission['id'] for mission in in_progress(missions(), 'heavyTank')] == [2]
        assert in_progress(missions(), 'SPG') == []
        assert counts(missions()) == {'active': 2, 'done': 1, 'honors': 1}

    def test_in_progress_by_tier(self):
        raw = [{'id': 1, 'name': u'Альфа', 'state': 'in_progress', 'levels': [8, 4]},
               {'id': 2, 'name': u'Браво', 'state': 'in_progress', 'levels': (9, 10)},
               {'id': 3, 'name': u'Чарли', 'state': 'in_progress', 'levels': [None, 10]}]
        cleaned = clean_missions(raw)[0]
        assert [mission['levels'] for mission in cleaned] == [[4, 8], [9, 10], None]
        assert [mission['id'] for mission in in_progress(cleaned, None, 6)] == [1, 3]
        assert [mission['id'] for mission in in_progress(cleaned, None, 10)] == [2, 3]
        assert [mission['id'] for mission in in_progress(cleaned)] == [1, 2, 3]
        assert u'Браво' in format_battle(cleaned, 'heavyTank', Settings({}, SCHEMA), translator(), 9)
        assert u'Альфа' not in format_battle(cleaned, 'heavyTank', Settings({}, SCHEMA), translator(), 9)


class FormatTest(unittest.TestCase):

    def test_hangar_and_battle(self):
        hangar = format_hangar(missions(), Settings({}, SCHEMA), translator())
        assert u'ЛБЗ: в работе 2, выполнено 1, с отличием 1' in hangar
        assert u'Основное: Нанести 3000 урона' in hangar and u'С отличием: Не получить' in hangar
        short = format_hangar(missions(), Settings({'show_conditions': False, 'max_missions': 1}, SCHEMA), translator('en'))
        assert u'СТ-7' in short and u'ТТ-3' not in short and 'Main:' not in short
        done_only = [mission for mission in missions() if mission['state'] != 'in_progress']
        assert u'Нет задач в работе' in format_hangar(done_only, Settings({}, SCHEMA), translator())
        assert format_hangar([], Settings({}, SCHEMA), translator()) is None
        battle = format_battle(missions(), 'heavyTank', Settings({}, SCHEMA), translator())
        assert u'ТТ-3. Прорыв' in battle and u'СТ-7' not in battle
        assert format_battle(missions(), 'SPG', Settings({}, SCHEMA), translator()) is None

    def test_page(self):
        page = build_page(missions(), translator())
        assert [row['id'] for row in page['rows']] == ['1', '2', '3']
        assert page['rows'][2]['subtitle'] == u'Выполнена с отличием' and page['rows'][2]['badge'] == u'✓✓'
        assert page['rows'][0]['details'][0] == {'label': u'Основное условие', 'value': u'Нанести 3000 урона'}
        assert build_page([], translator())['rows'] == []

    def test_preview_settings_and_strings(self):
        assert u'СТ-7' in preview_text(Settings({}, SCHEMA), translator())
        assert SETTINGS == ('hangar_personal_missions',)
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
