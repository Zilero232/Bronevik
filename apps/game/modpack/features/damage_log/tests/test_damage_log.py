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
from otmetki.features.damage_log.model import (
    DamageLog,
    Hit,
    class_icon,
    format_damage_log,
    format_last_hit,
    kind_color,
    kind_icon,
)
from otmetki.features.damage_log.model.constants import CLASS_GLYPHS, KINDS, PALETTES
from otmetki.features.damage_log.model.preview import preview_last_hit, preview_text
from otmetki.features.damage_log.settings import LAST_HIT_SCHEMA, SCHEMA, SETTINGS, SWITCH


def translator(language='ru'):
    return _support.translator(STRINGS, language)


def filled_log():
    log = DamageLog()
    log.add('damage', 390, Hit(vehicle='Pz. IV', shell='ap'))
    log.add('damage', 410.6, Hit(vehicle='Tiger', shell='heat'))
    log.add('radio', 120, Hit(vehicle='Pz. IV'))
    log.add('track', 80)
    log.add('stun', 40)
    log.add('blocked', 240, Hit(vehicle='Tiger', shell='ap'))
    log.add('received', 310, Hit(vehicle='Tiger', shell='he'))
    return log


def add_received(log, amount, at, source='shot'):
    hit = Hit(vehicle='KV-1', shell='he', source=source, vehicle_class='heavyTank', at=at)
    return log.add('received', amount, hit)


def efficiency_of(damage, assist, blocked, stun):
    types = fb.PERSONAL_EFFICIENCY_TYPE
    totals = {types.DAMAGE: damage, types.ASSIST_DAMAGE: assist, types.BLOCKED_DAMAGE: blocked, types.STUN: stun}
    return efficiency_totals(totals, values_by_name(types, EFFICIENCY_KEYS))


def shipped_icons():
    assets = os.path.join(_support.MODPACK_DIR, 'assets')
    with io.open(os.path.join(assets, 'assets.json'), encoding='utf-8') as handle:
        sets = [item for item in json.load(handle)['sets'] if item['feature'] == 'damage_log']

    shipped = set()
    for item in sets:
        target = item['target'][len('res/'):]
        for name in os.listdir(os.path.join(assets, *item['files'].split('/'))):
            shipped.add(target + '/' + name)
    return shipped


def icon_path(markup):
    return markup.split('img://')[1].split('"')[0]


class DamageLogTest(unittest.TestCase):

    def test_totals_sum_the_events(self):
        values = filled_log().values()

        assert values == {
            'dealt': 800,
            'blocked': 240,
            'assisted': 240,
            'assist_radio': 120,
            'assist_track': 80,
            'assist_stun': 40,
            'received': 310,
            'hits': 2,
            'blocked_hits': 1,
            'received_hits': 1,
        }

    def test_vanilla_efficiency_totals_are_a_floor(self):
        log = filled_log()
        picked = efficiency_of(damage=1250, assist=600, blocked=100, stun=40)

        changed = log.apply_summary(
            picked.get('dealt'),
            picked.get('assist'),
            picked.get('blocked'),
            picked.get('stun'),
        )

        values = log.values()
        assert changed
        assert values['dealt'] == 1250
        assert values['blocked'] == 240
        assert values['assisted'] == 640

    def test_a_summary_without_numbers_changes_nothing(self):
        log = filled_log()

        assert not log.apply_summary(None, None, None, None)

    def test_summary_event_totals_raise_the_values(self):
        log = DamageLog()
        summary = fb.BattleSummaryFeedbackEvent(
            damage=900,
            trackAssist=100,
            radioAssist=200,
            tankings=300,
            stunAssist=50,
        )

        log.apply_summary(
            summary.getTotalDamage(),
            summary.getTotalAssistDamage(),
            summary.getTotalBlockedDamage(),
            summary.getTotalStunDamage(),
        )

        values = log.values()
        assert values['dealt'] == 900
        assert values['assisted'] == 350
        assert values['blocked'] == 300

    def test_summary_raises_totals_above_the_events(self):
        log = filled_log()

        changed = log.apply_summary(damage=2150, assist=950, blocked=100, stun=None)

        values = log.values()
        assert changed
        assert values['dealt'] == 2150
        assert values['assisted'] == 990
        assert values['blocked'] == 240

    def test_the_same_summary_again_changes_nothing(self):
        log = filled_log()
        log.apply_summary(damage=2150, assist=950, blocked=100, stun=None)

        assert not log.apply_summary(damage=2150, assist=950, blocked=100)

    def test_rejects_an_unknown_kind(self):
        assert not DamageLog().add('unknown', 10)

    def test_rejects_a_zero_amount(self):
        assert not DamageLog().add('damage', 0)

    def test_rejects_an_amount_that_is_not_a_number(self):
        assert not DamageLog().add('damage', 'x')

    def test_an_unknown_shell_is_dropped(self):
        log = DamageLog()

        added = log.add('damage', 5, Hit(shell='weird'))

        assert added
        assert log.entries[0]['shell'] is None

    def test_recent_is_newest_first(self):
        kinds = [entry['kind'] for entry in filled_log().recent(3)]

        assert kinds == ['received', 'blocked', 'stun']

    def test_recent_keeps_only_the_asked_kinds(self):
        kinds = [entry['kind'] for entry in filled_log().recent(5, ('received',))]

        assert kinds == ['received']

    def test_recent_of_zero_lines_is_empty(self):
        assert filled_log().recent(0) == []

    def test_entries_are_capped_but_totals_keep_counting(self):
        log = DamageLog()

        for index in range(80):
            log.add('damage', index + 1)

        assert len(log.entries) == 50
        assert log.values()['dealt'] == 3240


class FormatTest(unittest.TestCase):

    def test_full_style_shows_the_totals_and_five_log_lines(self):
        text = format_damage_log(filled_log(), Settings({}, SCHEMA), translator())

        lines = text.split('\n')
        assert 'Урон 800' in lines[0]
        assert 'Получено 310' in lines[0]
        assert len(lines) == 6
        assert 'Получено 310 Tiger ОФ' in lines[1]

    def test_compact_style_is_one_line_of_totals(self):
        settings = Settings({'style': 'compact', 'show_log': False}, SCHEMA)

        text = format_damage_log(filled_log(), settings, translator('en'))

        assert '800 / 240 / 240 / 310' in text
        assert '\n' not in text

    def test_palettes_colour_the_full_line(self):
        for name, colors in PALETTES.items():
            settings = Settings({'palette': name, 'show_log': False}, SCHEMA)

            text = format_damage_log(filled_log(), settings, translator())

            for color in colors:
                assert '<font color="%s">' % color in text, (name, color)

    def test_an_unknown_palette_falls_back_to_graphite(self):
        assert Settings({'palette': 'rainbow'}, SCHEMA).get('palette') == 'graphite'

    def test_log_lines_carry_the_kind_icon(self):
        settings = Settings({'log_lines': 1}, SCHEMA)

        lines = format_damage_log(filled_log(), settings, translator()).split('\n')

        icon = '<img src="img://gui/maps/icons/otmetki/damage_log/icons/received_32.png" width="14" height="14"/>'
        assert icon in lines[1]

    def test_log_lines_without_kind_icons_are_plain_text(self):
        settings = Settings({'log_lines': 1, 'kind_icons': False}, SCHEMA)

        text = format_damage_log(filled_log(), settings, translator())

        assert '<img' not in text
        assert 'Получено 310 Tiger' in text

    def test_every_class_glyph_ships(self):
        shipped = shipped_icons()

        for vehicle_class in CLASS_GLYPHS:
            assert icon_path(class_icon(vehicle_class, 16)) in shipped, vehicle_class

    def test_an_unknown_class_has_no_icon(self):
        assert class_icon('warship', 16) == ''

    def test_a_class_without_a_size_has_no_icon(self):
        assert class_icon('heavyTank', None) == ''

    def test_every_kind_icon_ships(self):
        shipped = shipped_icons()

        for kind in KINDS:
            assert icon_path(kind_icon(kind, 16)) in shipped, kind

    def test_custom_templates_shape_the_totals_and_the_lines(self):
        settings = Settings({
            'style': 'custom',
            'template': 'D={dealt} R={received_hits}',
            'log_kinds': 'dealt',
            'log_lines': 1,
            'entry_template': '#{index} {amount} {vehicle}',
        }, SCHEMA)

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

        add_received(log, 120, 10.0, source='fire')

        assert log.entries[0]['source'] == 'fire'
        assert log.entries[0]['class'] == 'heavyTank'

    def test_dealt_damage_drops_the_source_and_an_unknown_class(self):
        log = DamageLog()
        hit = Hit(vehicle='Pz. IV', shell='ap', source='fire', vehicle_class='tank-destroyer', at=11.0)

        log.add('damage', 300, hit)

        assert log.entries[0]['source'] is None
        assert log.entries[0]['class'] is None

    def test_log_line_names_the_source_and_shows_the_class(self):
        log = DamageLog()
        add_received(log, 120, 10.0, source='fire')

        text = format_damage_log(log, Settings({'log_lines': 2}, SCHEMA), translator())

        assert u'пожар' in text
        assert 'class_heavy_32.png' in text

    def test_ammo_rack_after_the_hit_marks_that_hit(self):
        log = DamageLog()
        add_received(log, 310, 20.0)

        marked = log.ammo_rack_hit(20.4)

        assert marked
        assert log.entries[-1]['ammo_rack']

    def test_ammo_rack_without_a_hit_nearby_marks_nothing_yet(self):
        log = DamageLog()
        add_received(log, 310, 20.0)

        assert not log.ammo_rack_hit(40.0)

    def test_ammo_rack_before_the_hit_marks_the_next_hit(self):
        log = DamageLog()
        log.ammo_rack_hit(40.0)

        add_received(log, 200, 40.9)

        assert log.entries[-1]['ammo_rack']

    def test_a_hit_long_after_the_ammo_rack_is_not_marked(self):
        log = DamageLog()
        log.ammo_rack_hit(40.0)

        add_received(log, 150, 60.0)

        assert not log.entries[-1]['ammo_rack']

    def test_log_line_names_the_ammo_rack(self):
        log = DamageLog()
        add_received(log, 310, 20.0)
        log.ammo_rack_hit(20.4)

        text = format_damage_log(log, Settings({'log_lines': 3}, SCHEMA), translator())

        assert u'боеукладка' in text

    def test_the_players_own_kind_colour_wins_over_the_palette(self):
        settings = Settings({'palette': 'classic', 'color_received': '#123abc'}, SCHEMA)

        assert kind_color('received', settings) == '#123ABC'

    def test_an_invalid_kind_colour_falls_back_to_the_palette(self):
        settings = Settings({'palette': 'classic', 'color_damage': 'red'}, SCHEMA)

        assert kind_color('damage', settings) == '#E3564A'

    def test_assist_kinds_take_the_assisted_colour(self):
        settings = Settings({'palette': 'classic'}, SCHEMA)

        assert kind_color('stun', settings) == '#7CD35B'

    def test_log_lines_take_their_kind_colour(self):
        settings = Settings({'palette': 'classic', 'color_received': '#123abc'}, SCHEMA)

        lines = format_damage_log(filled_log(), settings, translator()).splitlines()

        assert '<font color="#123ABC"' in lines[1]

    def test_log_lines_are_muted_without_kind_colours(self):
        settings = Settings({'kind_colors': False, 'color_received': '#123abc'}, SCHEMA)

        lines = format_damage_log(filled_log(), settings, translator()).splitlines()

        assert '#123ABC' not in lines[1]
        assert '#A09A8B' in lines[1]


class LastHitTest(unittest.TestCase):

    def last_hit(self):
        log = DamageLog()
        add_received(log, 310, 5.0, source='ram')
        return log.last('received')

    def test_names_the_attacker_the_damage_the_shell_and_the_source(self):
        text = format_last_hit(self.last_hit(), Settings({}, LAST_HIT_SCHEMA), translator())

        assert u'KV-1 −310 ОФ таран' in text
        assert 'class_heavy_32.png' in text

    def test_custom_template_without_the_class(self):
        settings = Settings({'show_class': False, 'template': '{vehicle}:{amount}'}, LAST_HIT_SCHEMA)

        text = format_last_hit(self.last_hit(), settings, translator('en'))

        assert 'KV-1:310' in text
        assert '<img' not in text

    def test_last_of_a_kind_never_seen_is_none(self):
        log = DamageLog()
        add_received(log, 310, 5.0)

        assert log.last('damage') is None

    def test_preview_names_the_attacker(self):
        text = preview_last_hit(Settings({}, LAST_HIT_SCHEMA), translator('en'))

        assert 'KV-1' in text

    def test_timeout_is_capped(self):
        assert Settings({'timeout_s': 99}, LAST_HIT_SCHEMA).get('timeout_s') == 15


class SettingsTest(unittest.TestCase):

    def test_the_switch_is_the_only_setting(self):
        assert SETTINGS == (SWITCH,)

    def test_an_unknown_style_falls_back_to_full(self):
        assert Settings({'style': 'fancy'}, SCHEMA).get('style') == 'full'

    def test_log_lines_are_capped(self):
        assert Settings({'log_lines': 100}, SCHEMA).get('log_lines') == 15

    def test_a_long_template_is_cut(self):
        settings = Settings({'template': 'x' * 900}, SCHEMA)

        assert len(settings.get('template')) == 600

    def test_strings_in_sync(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])

    def test_preview_shows_the_sample_totals(self):
        text = preview_text(Settings({}, SCHEMA), translator('en'))

        assert '710' in text
        assert '480' in text
        assert '310' in text


if __name__ == '__main__':
    unittest.main()
