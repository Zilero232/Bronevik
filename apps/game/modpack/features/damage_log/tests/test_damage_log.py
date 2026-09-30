# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import io
import json
import os
import unittest

import _feedback as fb
import _support
from otmetki.core.battle_tally import EFFICIENCY_KEYS, efficiency_totals
from otmetki.core.client.game import values_by_name
from otmetki.core.settings import Settings
from otmetki.features.damage_log.i18n import STRINGS
from otmetki.features.damage_log.model import DamageLog, class_icon, format_damage_log, format_last_hit, kind_color, kind_icon
from otmetki.features.damage_log.model.constants import CLASS_GLYPHS, KINDS, PALETTES
from otmetki.features.damage_log.model.preview import preview_last_hit, preview_text
from otmetki.features.damage_log.settings import LAST_HIT_SCHEMA, SCHEMA, SETTINGS, SWITCH


def translator(language='ru'):
    return _support.translator(STRINGS, language)


def filled_log():
    log = DamageLog()
    log.add('damage', 390, 'Pz. IV', 'ap')
    log.add('damage', 410.6, 'Tiger', 'heat')
    log.add('radio', 120, 'Pz. IV')
    log.add('track', 80)
    log.add('stun', 40)
    log.add('blocked', 240, 'Tiger', 'ap')
    log.add('received', 310, 'Tiger', 'he')
    return log


class DamageLogTest(unittest.TestCase):

    def test_vanilla_efficiency_totals_are_a_floor(self):
        log = filled_log()
        kinds = values_by_name(fb.PERSONAL_EFFICIENCY_TYPE, EFFICIENCY_KEYS)
        types = fb.PERSONAL_EFFICIENCY_TYPE
        picked = efficiency_totals({types.DAMAGE: 1250, types.ASSIST_DAMAGE: 600, types.BLOCKED_DAMAGE: 100, types.STUN: 40}, kinds)
        assert log.apply_summary(picked.get('dealt'), picked.get('assist'), picked.get('blocked'), picked.get('stun'))
        values = log.values()
        assert (values['dealt'], values['blocked'], values['assisted']) == (1250, 240, 640)
        assert not log.apply_summary(None, None, None, None)

    def test_summary_event_shape(self):
        log = DamageLog()
        summary = fb.BattleSummaryFeedbackEvent(damage=900, trackAssist=100, radioAssist=200, tankings=300, stunAssist=50)
        log.apply_summary(summary.getTotalDamage(), summary.getTotalAssistDamage(), summary.getTotalBlockedDamage(), summary.getTotalStunDamage())
        assert (log.values()['dealt'], log.values()['assisted'], log.values()['blocked']) == (900, 350, 300)

    def test_totals(self):
        values = filled_log().values()
        assert values['dealt'] == 800
        assert values['assisted'] == 240
        assert (values['assist_radio'], values['assist_track'], values['assist_stun']) == (120, 80, 40)
        assert values['blocked'] == 240
        assert values['received'] == 310
        assert (values['hits'], values['blocked_hits'], values['received_hits']) == (2, 1, 1)

    def test_rejects_bad_events(self):
        log = DamageLog()
        assert not log.add('unknown', 10)
        assert not log.add('damage', 0)
        assert not log.add('damage', 'x')
        assert log.add('damage', 5, shell='weird')
        assert log.entries[0]['shell'] is None

    def test_summary_raises_totals(self):
        log = filled_log()
        assert log.apply_summary(damage=2150, assist=950, blocked=100, stun=None)
        assert not log.apply_summary(damage=2150, assist=950, blocked=100)
        values = log.values()
        assert values['dealt'] == 2150
        assert values['assisted'] == 950 + 40
        assert values['blocked'] == 240

    def test_recent_is_newest_first_and_filtered(self):
        log = filled_log()
        assert [entry['kind'] for entry in log.recent(3)] == ['received', 'blocked', 'stun']
        assert [entry['kind'] for entry in log.recent(5, ('received',))] == ['received']
        assert log.recent(0) == []

    def test_entries_are_capped(self):
        log = DamageLog()
        for index in range(80):
            log.add('damage', index + 1)
        assert len(log.entries) == 50
        assert log.values()['dealt'] == sum(range(1, 81))


class FormatTest(unittest.TestCase):

    def test_styles(self):
        log = filled_log()
        text = format_damage_log(log, Settings({}, SCHEMA), translator())
        lines = text.split('\n')
        assert 'Урон 800' in lines[0]
        assert 'Получено 310' in lines[0]
        assert len(lines) == 6
        assert 'Получено 310 Tiger ОФ' in lines[1]
        compact = format_damage_log(log, Settings({'style': 'compact', 'show_log': False}, SCHEMA), translator('en'))
        assert '800 / 240 / 240 / 310' in compact
        assert '\n' not in compact

    def test_palettes_colour_the_full_line(self):
        for name, colors in PALETTES.items():
            text = format_damage_log(filled_log(), Settings({'palette': name, 'show_log': False}, SCHEMA), translator())
            for color in colors:
                assert '<font color="%s">' % color in text, (name, color)
        assert Settings({'palette': 'rainbow'}, SCHEMA).get('palette') == 'graphite'

    def test_kind_icons(self):
        lines = format_damage_log(filled_log(), Settings({'log_lines': 1}, SCHEMA), translator()).split('\n')
        assert '<img src="img://gui/maps/icons/otmetki/damage_log/icons/received_32.png" width="14" height="14"/>' in lines[1]
        plain = format_damage_log(filled_log(), Settings({'log_lines': 1, 'kind_icons': False}, SCHEMA), translator())
        assert '<img' not in plain and 'Получено 310 Tiger' in plain

    def test_every_class_glyph_ships(self):
        assets = os.path.join(_support.MODPACK_DIR, 'assets')
        with io.open(os.path.join(assets, 'assets.json'), encoding='utf-8') as handle:
            sets = [item for item in json.load(handle)['sets'] if item['feature'] == 'damage_log']
        shipped = set(item['target'][len('res/'):] + '/' + name for item in sets
                      for name in os.listdir(os.path.join(assets, *item['files'].split('/'))))
        for vehicle_class in CLASS_GLYPHS:
            assert class_icon(vehicle_class, 16).split('img://')[1].split('"')[0] in shipped, vehicle_class
        assert class_icon('warship', 16) == '' and class_icon('heavyTank', None) == ''

    def test_every_kind_icon_ships(self):
        assets = os.path.join(_support.MODPACK_DIR, 'assets')
        with io.open(os.path.join(assets, 'assets.json'), encoding='utf-8') as handle:
            sets = [item for item in json.load(handle)['sets'] if item['feature'] == 'damage_log']
        shipped = set(item['target'][len('res/'):] + '/' + name for item in sets
                      for name in os.listdir(os.path.join(assets, *item['files'].split('/'))))
        for kind in KINDS:
            assert kind_icon(kind, 16).split('img://')[1].split('"')[0] in shipped, kind

    def test_custom_templates(self):
        settings = Settings({'style': 'custom', 'template': 'D={dealt} R={received_hits}', 'log_kinds': 'dealt', 'log_lines': 1,
                             'entry_template': '#{index} {amount} {vehicle}'}, SCHEMA)
        text = format_damage_log(filled_log(), settings, translator('en'))
        assert 'D=800 R=1' in text
        assert '#1 240 Tiger' in text

    def test_alt_mode_line_is_short_while_alt_is_up(self):
        settings = Settings({'alt_mode': True, 'log_lines': 1, 'kind_icons': False}, SCHEMA)

        lines = format_damage_log(filled_log(), settings, translator()).splitlines()

        assert lines[1].endswith('>310</font>')
        assert 'Tiger' not in lines[1]

    def test_alt_mode_line_is_full_while_alt_is_held(self):
        settings = Settings({'alt_mode': True, 'log_lines': 1, 'kind_icons': False}, SCHEMA)

        lines = format_damage_log(filled_log(), settings, translator(), extended=True).splitlines()

        assert 'Получено 310 Tiger ОФ' in lines[1]

    def test_alt_keeps_the_regular_line_without_the_alt_mode(self):
        settings = Settings({'log_lines': 1, 'kind_icons': False, 'alt_entry_template': '#{index}'}, SCHEMA)

        lines = format_damage_log(filled_log(), settings, translator(), extended=True).splitlines()

        assert 'Получено 310 Tiger ОФ' in lines[1]

    def test_alt_shows_the_log_that_show_log_hides(self):
        settings = Settings({'alt_mode': True, 'show_log': False, 'log_lines': 1}, SCHEMA)

        lines = format_damage_log(filled_log(), settings, translator(), extended=True).splitlines()

        assert len(lines) == 2

    def test_alt_entry_template_is_the_line_while_alt_is_held(self):
        settings = Settings({'alt_mode': True, 'log_lines': 1, 'alt_entry_template': '#{index} {vehicle}'}, SCHEMA)

        text = format_damage_log(filled_log(), settings, translator(), extended=True)

        assert '#1 Tiger' in text


class SourcesTest(unittest.TestCase):

    def test_received_damage_keeps_its_source_and_attacker_class(self):
        log = DamageLog()
        assert log.add('received', 120, 'KV-1', None, 'fire', 'heavyTank', 10.0)
        assert log.add('damage', 300, 'Pz. IV', 'ap', 'fire', 'tank-destroyer', 11.0)
        assert log.entries[0]['source'] == 'fire' and log.entries[0]['class'] == 'heavyTank'
        assert log.entries[1]['source'] is None and log.entries[1]['class'] is None
        text = format_damage_log(log, Settings({'log_lines': 2}, SCHEMA), translator())
        assert u'пожар' in text and 'class_heavy_32.png' in text

    def test_ammo_rack_marks_the_hit_of_that_moment_in_either_order(self):
        log = DamageLog()
        log.add('received', 310, 'KV-1', 'he', 'shot', 'heavyTank', 20.0)
        assert log.ammo_rack_hit(20.4) and log.entries[-1]['ammo_rack']
        assert not log.ammo_rack_hit(40.0)
        log.add('received', 200, 'IS', 'ap', 'shot', 'heavyTank', 40.9)
        assert log.entries[-1]['ammo_rack']
        log.add('received', 150, 'IS', 'ap', 'shot', 'heavyTank', 60.0)
        assert not log.entries[-1]['ammo_rack']
        assert u'боеукладка' in format_damage_log(log, Settings({'log_lines': 3}, SCHEMA), translator())

    def test_kind_colours(self):
        settings = Settings({'palette': 'classic', 'color_received': '#123abc', 'color_damage': 'red'}, SCHEMA)
        assert kind_color('received', settings) == '#123ABC'
        assert kind_color('damage', settings) == PALETTES['classic'][0]
        assert kind_color('stun', settings) == PALETTES['classic'][2]
        lines = format_damage_log(filled_log(), settings, translator()).splitlines()
        assert '<font color="#123ABC"' in lines[1]
        plain = format_damage_log(filled_log(), Settings({'kind_colors': False}, SCHEMA), translator()).splitlines()
        assert '#123ABC' not in plain[1] and '#A09A8B' in plain[1]

    def test_last_hit(self):
        log = DamageLog()
        log.add('received', 310, 'KV-1', 'he', 'ram', 'heavyTank', 5.0)
        text = format_last_hit(log.last('received'), Settings({}, LAST_HIT_SCHEMA), translator())
        assert u'KV-1 −310 ОФ таран' in text and 'class_heavy_32.png' in text
        plain = format_last_hit(log.last('received'), Settings({'show_class': False, 'template': '{vehicle}:{amount}'}, LAST_HIT_SCHEMA),
                                translator('en'))
        assert 'KV-1:310' in plain and '<img' not in plain
        assert log.last('damage') is None
        assert 'KV-1' in preview_last_hit(Settings({}, LAST_HIT_SCHEMA), translator('en'))
        assert Settings({'timeout_s': 99}, LAST_HIT_SCHEMA).get('timeout_s') == 15


class SettingsTest(unittest.TestCase):

    def test_switch_and_schema(self):
        assert SETTINGS == (SWITCH,)
        settings = Settings({'style': 'fancy', 'log_lines': 100, 'template': 'x' * 900}, SCHEMA)
        assert settings.get('style') == 'full'
        assert settings.get('log_lines') == 15
        assert len(settings.get('template')) == 600

    def test_strings_in_sync(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])

    def test_preview(self):
        text = preview_text(Settings({}, SCHEMA), translator('en'))
        assert '710' in text and '480' in text and '310' in text


if __name__ == '__main__':
    unittest.main()
