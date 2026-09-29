# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.damage_log.model import DamageLog
from otmetki.features.damage_log.model.preview import preview_last_hit_widget, preview_log, preview_widget
from otmetki.features.damage_log.model.widget import damage_log_widget, last_hit_widget
from otmetki.features.damage_log.settings import LAST_HIT_SCHEMA, SCHEMA


class DamageLogWidgetTest(unittest.TestCase):

    def test_totals_are_icon_and_number(self):
        data = damage_log_widget(preview_log(), Settings({}, SCHEMA))['data']
        keys = [item['key'] for item in data['totals']]
        assert keys == ['dealt', 'blocked', 'assisted', 'received']
        assert data['totals'][0] == {'key': 'dealt', 'icon': 'img://gui/maps/icons/library/efficiency/48x48/damage.png|otmetki:damage',
                                     'value': 710, 'tone': 'accent'}
        assert data['totals'][-1]['icon'] == 'otmetki:received'

    def test_rows_newest_first_with_shell_class_and_source(self):
        data = damage_log_widget(preview_log(), Settings({'log_lines': 3}, SCHEMA))['data']
        received, blocked, damage = data['rows']
        assert received['received'] and received['tone'] == 'received' and received['ammo_rack'] == 'otmetki:ammo_rack'
        assert received['icon'].startswith('img://gui/maps/icons/shell/small/HIGH_EXPLOSIVE_MODERN.png')
        assert received['cls'].startswith('img://gui/maps/icons/vehicleTypes/white/heavyTank.png')
        assert blocked['tone'] == 'blocked' and blocked['icon'].startswith('img://gui/maps/icons/shell/small/HOLLOW_CHARGE.png')
        assert damage['gold'] and damage['icon'].startswith('img://gui/maps/icons/shell/small/ARMOR_PIERCING_CR_PREMIUM.png')

    def test_assist_rows_use_our_glyphs_and_compact_has_no_rows(self):
        log = DamageLog()
        log.add('radio', 200, 'T-34')
        log.add('received', 50, 'KV-1', source='fire')
        data = damage_log_widget(log, Settings({}, SCHEMA))['data']
        assert data['rows'][1]['icon'] == 'otmetki:radio' and data['rows'][1]['cls'] is None
        assert data['rows'][0]['source'].startswith('img://gui/maps/icons/library/efficiency/48x48/fire.png')
        assert damage_log_widget(log, Settings({'style': 'compact'}, SCHEMA))['data']['rows'] == []
        assert damage_log_widget(log, Settings({'show_log': False}, SCHEMA))['data']['style'] == 'full'

    def test_last_hit_card(self):
        log = DamageLog()
        log.add('received', 390, 'Pz. IV', 'ap', 'shot', 'mediumTank', shell_name='ARMOR_PIERCING', gold=True)
        data = last_hit_widget(log.last('received'), Settings({}, LAST_HIT_SCHEMA))['data']
        assert data['amount'] == 390 and data['name'] == 'Pz. IV' and data['timeout_s'] == 5
        assert data['cls'].startswith('img://gui/maps/icons/vehicleTypes/red/mediumTank.png')
        assert data['shell'].startswith('img://gui/maps/icons/shell/small/ARMOR_PIERCING_PREMIUM.png')
        assert last_hit_widget(log.last('received'), Settings({'show_class': False}, LAST_HIT_SCHEMA))['data']['cls'] is None

    def test_fixtures_for_the_page(self):
        assert _support.widget_fixture('damage_log', preview_widget(Settings({}, SCHEMA), None))
        assert _support.widget_fixture('last_hit', preview_last_hit_widget(Settings({}, LAST_HIT_SCHEMA), None))


if __name__ == '__main__':
    unittest.main()
