# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.hit_log.i18n import STRINGS
from otmetki.features.hit_log.model import HitLog
from otmetki.features.hit_log.model.preview import preview_log, preview_widget
from otmetki.features.hit_log.model.widget import hit_log_widget
from otmetki.features.hit_log.settings import SCHEMA

TRANSLATE = _support.translator(STRINGS)


def crit_log():
    log = HitLog()
    log.describe(5, 'heavyTank', 1500)
    log.add_damage(5, 390, 0.0, 'KV-1', 'apcr')
    log.add_crits(5, 2, 0.1)
    return log


class HitLogWidgetTest(unittest.TestCase):

    def test_rows_carry_outcome_icon_class_and_hp_left(self):
        data = hit_log_widget(preview_log(), Settings({}, SCHEMA), TRANSLATE)['data']
        assert data['header'] == {'hits': 3, 'pens': 2, 'damage': 670}
        newest, ricochet, first = data['rows']
        assert newest['icon'] == 'otmetki:damage' and newest['tone'] == 'success'
        assert (newest['damage'], newest['hp'], newest['max']) == (280, 360, 1500)
        assert newest['cls'].startswith('img://gui/maps/icons/vehicleTypes/red/heavyTank.png')
        assert ricochet['icon'].startswith('img://gui/maps/icons/library/critical_damage/hit_ricochet.png') and ricochet['damage'] is None
        assert first['name'] == 'Pz. IV'

    def test_grouped_by_target_and_no_header(self):
        log = HitLog()
        log.describe(5, 'lightTank', 700)
        log.add_damage(5, 100, 0.0, 'M24')
        log.add_damage(5, 150, 10.0, 'M24')
        data = hit_log_widget(log, Settings({'group_by_target': True, 'show_header': False}, SCHEMA), TRANSLATE)['data']
        assert data['header'] is None and data['grouped'] is True
        assert [(item['hits'], item['damage']) for item in data['rows']] == [(2, 250)]
        assert not log.describe('x')

    def test_rows_are_full_without_the_alt_mode(self):
        settings = Settings({}, SCHEMA)

        data = hit_log_widget(crit_log(), settings, TRANSLATE, extended=True)['data']

        assert data['detail'] == 'full'
        assert data['rows'][0]['note'] == ''

    def test_alt_mode_rows_are_short_while_alt_is_up(self):
        settings = Settings({'alt_mode': True}, SCHEMA)

        data = hit_log_widget(crit_log(), settings, TRANSLATE)['data']

        assert data['detail'] == 'short'
        assert data['rows'][0]['note'] == ''

    def test_alt_mode_rows_carry_the_note_while_alt_is_held(self):
        settings = Settings({'alt_mode': True}, SCHEMA)

        data = hit_log_widget(crit_log(), settings, TRANSLATE, extended=True)['data']

        assert data['detail'] == 'extended'
        assert data['rows'][0]['note'] == u'БП криты x2'

    def test_edit_preview_is_the_short_one(self):
        settings = Settings({'alt_mode': True}, SCHEMA)

        data = preview_widget(settings, TRANSLATE)['data']

        assert data['detail'] == 'short'

    def test_fixture_for_the_page(self):
        assert _support.widget_fixture('hit_log', preview_widget(Settings({}, SCHEMA), None))


if __name__ == '__main__':
    unittest.main()
