# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.format import COLOR_UP, strip_tags
from otmetki.core.moe import ThresholdCurve
from otmetki.core.settings import Settings
from otmetki.features.marks_panel.i18n import STRINGS
from otmetki.features.marks_panel.model import BattleTotals, PanelView, format_panel, panel_state, percent_source
from otmetki.features.marks_panel.model.preview import preview_text
from otmetki.features.marks_panel.settings import SCHEMA, SETTINGS, SWITCH

API = {'tank_id': 1, 'thresholds': {'65': 2000, '85': 2600, '95': 3100, '100': 4200}}
SNAPSHOT = {'tank_id': 1, 'moving_avg_damage': 2500, 'damage_rating': 8150, 'marks_on_gun': 1}
UNRATED_SNAPSHOT = {'tank_id': 1, 'moving_avg_damage': 2500, 'damage_rating': 0, 'marks_on_gun': 1}


def translator(language='en'):
    return _support.translator(STRINGS, language)


def settings(**values):
    return Settings(values, SCHEMA)


def curve():
    return ThresholdCurve.from_api(API)


def state(combined=2100, has_curve=True, snapshot=SNAPSHOT, **values):
    return panel_state(snapshot, combined, curve() if has_curve else None, 3000, settings(**values))


def panel_text(combined=2100, snapshot=SNAPSHOT, held=False, language='en', **values):
    chosen = settings(**values)
    panel = panel_state(snapshot, combined, curve(), 3000, chosen)
    return strip_tags(format_panel(panel, PanelView(chosen, held), translator(language)))


def battle_totals():
    totals = BattleTotals()
    totals.add('damage', 1500)
    totals.add('radio', 400)
    totals.add('track', 600)
    return totals


class TotalsTest(unittest.TestCase):

    def test_add_counts_a_known_positive_amount(self):
        totals = BattleTotals()

        assert totals.add('damage', 1500) is True

    def test_add_ignores_an_unknown_kind(self):
        totals = BattleTotals()

        assert totals.add('unknown', 100) is False

    def test_add_ignores_a_negative_amount(self):
        totals = BattleTotals()

        assert totals.add('damage', -5) is False

    def test_add_ignores_a_missing_amount(self):
        totals = BattleTotals()

        assert totals.add('stun', None) is False

    def test_combined_takes_the_damage_and_the_best_assist(self):
        totals = battle_totals()

        assert totals.combined() == 2100

    def test_summary_raises_the_totals(self):
        totals = battle_totals()

        changed = totals.apply_summary(damage=1800, stun=700)

        assert changed is True
        assert totals.combined() == 2500

    def test_the_same_summary_twice_changes_nothing(self):
        totals = battle_totals()
        totals.apply_summary(damage=1800, stun=700)

        assert totals.apply_summary(damage=1800, stun=700) is False

    def test_summary_ignores_invalid_values(self):
        totals = battle_totals()

        assert totals.apply_summary(damage=-1, stun='x') is False


class PanelTest(unittest.TestCase):

    def test_extended_view(self):
        text = panel_text(combined=5000)

        assert text.split('\n') == [
            u'MoE 81.50% → 83.15% (+1.65)',
            u'damage 5 000 · average 2 500 → 2 550',
            u'65%: ✓   85%: 2 550   95%: 27 800',
            u'for 82%: ✓   +0.5%: ✓   to 85%: ~6 battles',
        ]

    def test_extended_view_of_a_weak_battle(self):
        lines = panel_text(combined=0).split('\n')

        assert lines[0] == u'MoE 81.50% → 79.85% (-1.65)'
        assert lines[3] == u'for 82%: 3 258   +0.5%: 3 258   to 85%: ~16 battles'

    def test_switches_leave_the_head_only(self):
        text = panel_text(show_battle=False, show_targets=False, show_step=False, show_battles=False, show_up=False)

        assert text == u'MoE 81.50% → 81.24% (-0.26)'

    def test_compact_shows_the_damage_for_the_next_whole_percent(self):
        text = panel_text(style='compact')

        assert text == u'81.24% (-0.26) · for 82%: 1 158'

    def test_compact_without_the_whole_percent_shows_the_next_mark(self):
        text = panel_text(style='compact', show_up=False)

        assert text == u'81.24% (-0.26) · 85%: 5 450'

    def test_minimal(self):
        text = panel_text(style='minimal')

        assert text == u'81.24% (-0.26)'

    def test_custom_template(self):
        text = panel_text(style='custom', template='{percent}>{projected} {need95} [{battles}] {up}:{need_up}')

        assert text == u'81.50>81.24 30 700 [12] 82:1 158'

    def test_empty_custom_template_shows_the_extended_view(self):
        text = panel_text(style='custom')

        assert text.split('\n')[0] == u'MoE 81.50% → 81.24% (-0.26)'

    def test_colour_follows_a_rise(self):
        text = format_panel(state(combined=6000), PanelView(settings()), translator())

        assert COLOR_UP in text

    def test_step_setting(self):
        text = panel_text(step='1')

        assert u'+1%: ' in text

    def test_unknown_values_fall_back_to_the_defaults(self):
        chosen = settings(step='2', color_mode='rainbow')

        assert chosen.get('step') == '0.5'
        assert chosen.get('color_mode') == 'delta'

    def test_without_curve(self):
        text = strip_tags(format_panel(state(has_curve=False), PanelView(settings()), translator('ru')))

        assert text == u'Отметка 81.50%: нет порогов'

    def test_preview(self):
        text = strip_tags(preview_text(settings(), translator()))

        assert text.split('\n')[0] == u'MoE 86.12% → 86.30% (+0.18)'

    def test_strings_in_both_languages(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])

    def test_settings_switch(self):
        assert SETTINGS == (SWITCH,)


class AltTest(unittest.TestCase):

    def test_alt_mode_rests_in_the_compact_line(self):
        text = panel_text(alt_detail=True)

        assert text == u'81.24% (-0.26) · for 82%: 1 158'

    def test_alt_held_shows_every_line_whatever_the_switches(self):
        text = panel_text(held=True, alt_detail=True, show_targets=False, show_battle=False)

        assert text.split('\n') == [
            u'MoE 81.50% → 81.24% (-0.26)',
            u'damage 2 100 · average 2 500 → 2 492',
            u'65%: ✓   85%: 5 450   95%: 30 700',
            u'for 82%: 1 158   +0.5%: 1 158   to 85%: ~12 battles',
            u'verified   average for 85%: 2 600',
        ]

    def test_alt_held_changes_nothing_with_alt_mode_off(self):
        text = panel_text(held=True, style='compact')

        assert text == u'81.24% (-0.26) · for 82%: 1 158'

    def test_alt_mode_keeps_the_minimal_style_at_rest(self):
        text = panel_text(alt_detail=True, style='minimal')

        assert text == u'81.24% (-0.26)'

    def test_alt_mode_keeps_the_custom_template_at_rest(self):
        text = panel_text(alt_detail=True, style='custom', template='[{source}]')

        assert text == u'[verified]'

    def test_alt_held_replaces_the_custom_template_with_the_full_view(self):
        text = panel_text(held=True, alt_detail=True, style='custom', template='[{source}]')

        assert text.split('\n')[4] == u'verified   average for 85%: 2 600'


class SourceTest(unittest.TestCase):

    def test_dossier_rating_is_verified(self):
        assert percent_source(SNAPSHOT, curve()) == 'verified'

    def test_dossier_rating_is_verified_without_a_curve(self):
        assert percent_source(SNAPSHOT, None) == 'verified'

    def test_curve_percent_without_a_dossier_rating_is_estimated(self):
        assert percent_source(UNRATED_SNAPSHOT, curve()) == 'estimated'

    def test_nothing_to_show_without_both(self):
        assert percent_source(UNRATED_SNAPSHOT, None) is None

    def test_estimated_percent_comes_from_the_curve(self):
        estimated = state(snapshot=UNRATED_SNAPSHOT)

        assert estimated['source'] == 'estimated'
        assert estimated['percent'] == 81.67

    def test_estimated_percent_is_marked_approximate(self):
        text = panel_text(snapshot=UNRATED_SNAPSHOT)

        assert text.split('\n')[0] == u'MoE ~81.67% → 81.40% (-0.27)'

    def test_estimated_minimal_line_is_marked_approximate(self):
        text = panel_text(snapshot=UNRATED_SNAPSHOT, style='minimal')

        assert text == u'~81.40% (-0.27)'

    def test_source_macro(self):
        text = panel_text(snapshot=UNRATED_SNAPSHOT, style='custom', template='{source}', language='ru')

        assert text == u'оценка'


if __name__ == '__main__':
    unittest.main()
