# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.damage_log.i18n import STRINGS
from otmetki.features.damage_log.model import DamageLog, Hit
from otmetki.features.damage_log.model.preview import preview_last_hit_widget, preview_log, preview_widget
from otmetki.features.damage_log.model.widget import damage_log_widget, last_hit_widget
from otmetki.features.damage_log.settings import LAST_HIT_SCHEMA, SCHEMA

TRANSLATE = _support.translator(STRINGS)


def assist_and_fire_log():
    log = DamageLog()
    log.add('radio', 200, Hit(vehicle='T-34'))
    log.add('received', 50, Hit(vehicle='KV-1', source='fire'))
    return log


def gold_hit():
    log = DamageLog()
    log.add('received', 390, Hit(
        vehicle='Pz. IV',
        shell='ap',
        source='shot',
        vehicle_class='mediumTank',
        shell_name='ARMOR_PIERCING',
        gold=True,
    ))
    return log.last('received')


def preview_rows(settings):
    return damage_log_widget(preview_log(), settings, TRANSLATE)['data']['rows']


class DamageLogWidgetTest(unittest.TestCase):

    def test_totals_are_keyed_in_order(self):
        data = damage_log_widget(preview_log(), Settings({}, SCHEMA), TRANSLATE)['data']

        assert [item['key'] for item in data['totals']] == ['dealt', 'blocked', 'assisted', 'received']

    def test_a_total_is_an_icon_a_number_and_a_tone(self):
        data = damage_log_widget(preview_log(), Settings({}, SCHEMA), TRANSLATE)['data']

        assert data['totals'][0] == {
            'key': 'dealt',
            'icon': 'img://gui/maps/icons/library/efficiency/48x48/damage.png|otmetki:damage',
            'value': 710,
            'tone': 'accent',
        }

    def test_the_received_total_takes_our_glyph(self):
        data = damage_log_widget(preview_log(), Settings({}, SCHEMA), TRANSLATE)['data']

        assert data['totals'][-1]['icon'] == 'otmetki:received'

    def test_received_row_carries_the_shell_class_and_ammo_rack(self):
        received = preview_rows(Settings({'log_lines': 3}, SCHEMA))[0]

        assert received['received']
        assert received['tone'] == 'received'
        assert received['ammo_rack'] == 'otmetki:ammo_rack'
        assert received['icon'].startswith('img://gui/maps/icons/shell/small/HIGH_EXPLOSIVE_MODERN.png')
        assert received['cls'].startswith('img://gui/maps/icons/vehicleTypes/white/heavyTank.png')

    def test_blocked_row_carries_its_shell(self):
        blocked = preview_rows(Settings({'log_lines': 3}, SCHEMA))[1]

        assert blocked['tone'] == 'blocked'
        assert blocked['icon'].startswith('img://gui/maps/icons/shell/small/HOLLOW_CHARGE.png')

    def test_damage_row_marks_a_gold_shell(self):
        damage = preview_rows(Settings({'log_lines': 3}, SCHEMA))[2]

        assert damage['gold']
        assert damage['icon'].startswith('img://gui/maps/icons/shell/small/ARMOR_PIERCING_CR_PREMIUM.png')

    def test_assist_row_uses_our_glyph_without_a_class(self):
        rows = damage_log_widget(assist_and_fire_log(), Settings({}, SCHEMA), TRANSLATE)['data']['rows']

        assert rows[1]['icon'] == 'otmetki:radio'
        assert rows[1]['cls'] is None

    def test_received_row_shows_the_fire_source(self):
        rows = damage_log_widget(assist_and_fire_log(), Settings({}, SCHEMA), TRANSLATE)['data']['rows']

        assert rows[0]['source'].startswith('img://gui/maps/icons/library/efficiency/48x48/fire.png')

    def test_compact_style_has_no_rows(self):
        data = damage_log_widget(assist_and_fire_log(), Settings({'style': 'compact'}, SCHEMA), TRANSLATE)['data']

        assert data['rows'] == []

    def test_hiding_the_log_keeps_the_full_style(self):
        data = damage_log_widget(assist_and_fire_log(), Settings({'show_log': False}, SCHEMA), TRANSLATE)['data']

        assert data['style'] == 'full'

    def test_rows_are_full_without_the_alt_mode(self):
        settings = Settings({'log_lines': 3}, SCHEMA)

        data = damage_log_widget(preview_log(), settings, TRANSLATE, extended=True)['data']

        assert data['detail'] == 'full'
        assert [item['note'] for item in data['rows']] == ['', '', '']

    def test_alt_mode_rows_are_short_while_alt_is_up(self):
        settings = Settings({'alt_mode': True, 'log_lines': 3}, SCHEMA)

        data = damage_log_widget(preview_log(), settings, TRANSLATE)['data']

        assert data['detail'] == 'short'
        assert [item['note'] for item in data['rows']] == ['', '', '']

    def test_alt_mode_rows_carry_the_note_while_alt_is_held(self):
        settings = Settings({'alt_mode': True, 'log_lines': 3}, SCHEMA)

        data = damage_log_widget(preview_log(), settings, TRANSLATE, extended=True)['data']

        assert data['detail'] == 'extended'
        assert [item['note'] for item in data['rows']] == [u'Получено ОФ боеукладка', u'Блок КС', u'Урон БП']

    def test_compact_style_has_no_rows_while_alt_is_up(self):
        settings = Settings({'alt_mode': True, 'style': 'compact'}, SCHEMA)

        data = damage_log_widget(preview_log(), settings, TRANSLATE)['data']

        assert data['rows'] == []

    def test_alt_shows_the_rows_the_compact_style_leaves_out(self):
        settings = Settings({'alt_mode': True, 'style': 'compact'}, SCHEMA)

        data = damage_log_widget(preview_log(), settings, TRANSLATE, extended=True)['data']

        assert len(data['rows']) == 5

    def test_edit_preview_is_the_short_one(self):
        settings = Settings({'alt_mode': True}, SCHEMA)

        data = preview_widget(settings, TRANSLATE)['data']

        assert data['detail'] == 'short'

    def test_last_hit_card_shows_the_hit(self):
        data = last_hit_widget(gold_hit(), Settings({}, LAST_HIT_SCHEMA))['data']

        assert data['amount'] == 390
        assert data['name'] == 'Pz. IV'
        assert data['timeout_s'] == 5
        assert data['cls'].startswith('img://gui/maps/icons/vehicleTypes/red/mediumTank.png')
        assert data['shell'].startswith('img://gui/maps/icons/shell/small/ARMOR_PIERCING_PREMIUM.png')

    def test_last_hit_card_leaves_the_class_out_when_switched_off(self):
        data = last_hit_widget(gold_hit(), Settings({'show_class': False}, LAST_HIT_SCHEMA))['data']

        assert data['cls'] is None

    def test_damage_log_fixture_for_the_page(self):
        assert _support.widget_fixture('damage_log', preview_widget(Settings({}, SCHEMA), None))

    def test_last_hit_fixture_for_the_page(self):
        assert _support.widget_fixture('last_hit', preview_last_hit_widget(Settings({}, LAST_HIT_SCHEMA), None))


if __name__ == '__main__':
    unittest.main()
