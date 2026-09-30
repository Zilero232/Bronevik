# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.received_hits.i18n import STRINGS
from otmetki.features.received_hits.model import Hit, ReceivedHits, format_panel
from otmetki.features.received_hits.model.constants import MAX_ENTRIES
from otmetki.features.received_hits.model.preview import preview_text
from otmetki.features.received_hits.model.shot import is_ricochet
from otmetki.features.received_hits.model.widget import panel_widget
from otmetki.features.received_hits.settings import SCHEMA, SETTINGS

KV_SOURCE = 17
T34_SOURCE = 18


def translator(language='ru'):
    return _support.translator(STRINGS, language)


def pz_pen(at=1.0, damage=390):
    return Hit('Pz. IV', 'mediumTank', 'ap', damage, 0, at)


def pz_crit(at, crits=1):
    return Hit('Pz. IV', 'mediumTank', None, 0, crits, at)


def kv_blocked(at=5.0, damage=240, shell='ap', source=KV_SOURCE):
    return Hit('KV-1', 'heavyTank', shell, damage, 0, at, source)


def hits_of(*outcomes_and_hits):
    hits = ReceivedHits()
    for outcome, hit in outcomes_and_hits:
        hits.add(outcome, hit)
    return hits


def three_outcomes():
    return hits_of(
        ('pen', pz_pen()),
        ('blocked', kv_blocked(shell='he', source=None)),
        ('ricochet', Hit('T-34', 'mediumTank', 'apcr', 0, 0, 9.0)),
    )


def pen_with_crit_then_blocked():
    return hits_of(
        ('pen', pz_pen()),
        ('crit', pz_crit(1.1)),
        ('blocked', kv_blocked(shell='he', source=None)),
    )


def segment(code, start=0x10, end=0x20):
    return code | (1 << 8) | (start << 16) | (end << 40)


class AddTest(unittest.TestCase):

    def test_every_known_outcome_is_counted(self):
        hits = three_outcomes()

        assert hits.totals == {
            'hits': 3,
            'pen': 1,
            'crit': 0,
            'blocked': 1,
            'ricochet': 1,
            'damage': 390,
            'blocked_damage': 240,
        }

    def test_an_unknown_outcome_is_not_added(self):
        hits = ReceivedHits()

        added = hits.add('miss', Hit('T-34', 'mediumTank', 'ap', 100, 0, 9.0))

        assert not added
        assert hits.entries == []

    def test_a_known_outcome_is_added(self):
        hits = ReceivedHits()

        added = hits.add('pen', pz_pen())

        assert added

    def test_the_attacker_class_is_kept_as_a_short_key(self):
        hits = three_outcomes()

        assert [entry['class'] for entry in hits.recent(5)] == ['medium', 'heavy', 'medium']

    def test_keeps_the_last_entries_and_counts_them_all(self):
        hits = ReceivedHits()

        for index in range(MAX_ENTRIES + 5):
            hits.add('pen', Hit('x', None, None, 1, 0, float(index)))

        assert len(hits.entries) == MAX_ENTRIES
        assert hits.totals['hits'] == MAX_ENTRIES + 5


class CritsTest(unittest.TestCase):

    def test_crits_right_after_a_pen_join_its_line(self):
        hits = hits_of(('pen', pz_pen()))

        joined = hits.add('crit', pz_crit(1.2, crits=2))

        assert joined
        assert len(hits.entries) == 1
        assert hits.entries[0]['crits'] == 2
        assert hits.totals['crit'] == 1

    def test_crits_long_after_the_pen_stand_as_their_own_line(self):
        hits = hits_of(('pen', pz_pen()), ('crit', pz_crit(1.2, crits=2)))

        hits.add('crit', pz_crit(5.0))

        assert len(hits.entries) == 2
        assert hits.entries[1]['outcome'] == 'crit'


class RicochetTest(unittest.TestCase):

    def test_a_drawn_ricochet_turns_the_blocked_line(self):
        hits = hits_of(('blocked', kv_blocked()))

        turned = hits.ricochet(KV_SOURCE, 'KV-1', 'heavyTank', 5.3)

        assert turned
        assert len(hits.entries) == 1
        assert hits.entries[0]['outcome'] == 'ricochet'

    def test_a_turned_line_moves_from_blocked_to_ricochet_and_keeps_its_damage(self):
        hits = hits_of(('blocked', kv_blocked()))

        hits.ricochet(KV_SOURCE, 'KV-1', 'heavyTank', 5.3)

        assert hits.totals['blocked'] == 0
        assert hits.totals['ricochet'] == 1
        assert hits.totals['blocked_damage'] == 240

    def test_a_drawn_ricochet_before_the_feedback_stands_as_its_own_line(self):
        hits = ReceivedHits()

        added = hits.ricochet(KV_SOURCE, 'KV-1', 'heavyTank', 5.0)

        assert added
        assert hits.entries[0]['outcome'] == 'ricochet'

    def test_blocked_damage_joins_an_earlier_ricochet(self):
        hits = ReceivedHits()
        hits.ricochet(KV_SOURCE, 'KV-1', 'heavyTank', 5.0)

        joined = hits.add('blocked', kv_blocked(at=5.2))

        assert joined
        assert len(hits.entries) == 1
        assert hits.entries[0]['damage'] == 240
        assert hits.entries[0]['shell'] == 'ap'

    def test_a_joined_ricochet_counts_one_hit_with_its_blocked_damage(self):
        hits = ReceivedHits()
        hits.ricochet(KV_SOURCE, 'KV-1', 'heavyTank', 5.0)

        hits.add('blocked', kv_blocked(at=5.2))

        assert hits.totals == {
            'hits': 1,
            'pen': 0,
            'crit': 0,
            'blocked': 0,
            'ricochet': 1,
            'damage': 0,
            'blocked_damage': 240,
        }

    def test_a_ricochet_takes_only_one_blocked_line(self):
        hits = ReceivedHits()
        hits.ricochet(KV_SOURCE, 'KV-1', 'heavyTank', 5.0)
        hits.add('blocked', kv_blocked(at=5.2))

        hits.add('blocked', kv_blocked(at=5.4, damage=100))

        assert len(hits.entries) == 2
        assert hits.entries[1]['outcome'] == 'blocked'

    def test_a_ricochet_from_another_attacker_does_not_turn_the_line(self):
        hits = hits_of(('blocked', kv_blocked()))

        hits.ricochet(T34_SOURCE, 'T-34', 'mediumTank', 5.1)

        assert [entry['outcome'] for entry in hits.entries] == ['blocked', 'ricochet']

    def test_a_late_ricochet_does_not_turn_the_line(self):
        hits = hits_of(('blocked', kv_blocked()))

        hits.ricochet(KV_SOURCE, 'KV-1', 'heavyTank', 9.0)

        assert [entry['outcome'] for entry in hits.entries] == ['blocked', 'ricochet']

    def test_a_ricochet_without_an_attacker_is_ignored(self):
        hits = ReceivedHits()

        added = hits.ricochet(None)

        assert not added
        assert hits.entries == []


class ShotTest(unittest.TestCase):

    def test_a_shot_ending_in_a_ricochet_is_a_ricochet(self):
        assert is_ricochet([segment(4), segment(1)])

    def test_a_shot_ending_in_a_pen_is_not_a_ricochet(self):
        assert not is_ricochet([segment(1), segment(4)])

    def test_a_last_point_without_length_is_skipped(self):
        assert is_ricochet([segment(2), segment(4, 0x10, 0x10)])

    def test_no_points_is_not_a_ricochet(self):
        assert not is_ricochet([])

    def test_missing_points_is_not_a_ricochet(self):
        assert not is_ricochet(None)


class FormatPanelTest(unittest.TestCase):

    def test_the_header_sums_the_hits_pens_and_damage(self):
        text = format_panel(pen_with_crit_then_blocked(), Settings({}, SCHEMA), translator())

        assert u'По вам: 2, пробитий 1, урон 390' in text

    def test_a_line_shows_the_class_the_shell_and_the_damage_with_crits(self):
        text = format_panel(pen_with_crit_then_blocked(), Settings({}, SCHEMA), translator())

        assert u'СТ Pz. IV' in text
        assert u'ББ' in text
        assert u'−390 +1 крит.' in text

    def test_a_blocked_line_shows_the_blocked_damage(self):
        text = format_panel(pen_with_crit_then_blocked(), Settings({}, SCHEMA), translator())

        assert u'не пробил, заблокировано 240' in text

    def test_the_newest_line_comes_first_after_the_header(self):
        lines = format_panel(pen_with_crit_then_blocked(), Settings({}, SCHEMA), translator()).split('\n')

        assert u'KV-1' in lines[1]
        assert u'Pz. IV' in lines[2]

    def test_the_header_class_and_shell_can_be_hidden(self):
        settings = Settings({'show_header': False, 'show_class': False, 'show_shell': False}, SCHEMA)

        text = format_panel(pen_with_crit_then_blocked(), settings, translator('en'))

        assert 'On you' not in text
        assert 'MT' not in text
        assert 'AP' not in text

    def test_a_line_template_replaces_the_line(self):
        template = '{attacker}:{outcome}:{damage}'
        settings = Settings({'show_header': False, 'line_template': template, 'lines': 1}, SCHEMA)

        text = format_panel(pen_with_crit_then_blocked(), settings, translator('en'))

        assert 'KV-1:no pen:240' in text
        assert 'Pz. IV' not in text

    def test_no_hits_is_no_panel(self):
        assert format_panel(ReceivedHits(), Settings({}, SCHEMA), translator()) is None


class PanelWidgetTest(unittest.TestCase):

    def test_rows_show_the_newest_hit_first_with_its_value(self):
        data = panel_widget(pen_with_crit_then_blocked(), Settings({}, SCHEMA), translator())['data']

        assert [row['value'] for row in data['rows']] == [u'не пробил', u'−390']

    def test_a_crit_note_wins_over_the_shell(self):
        data = panel_widget(pen_with_crit_then_blocked(), Settings({}, SCHEMA), translator())['data']

        assert [row['note'] for row in data['rows']] == [u'ОФ', u'+1 крит.']

    def test_the_chips_count_hits_pens_and_blocked_damage(self):
        data = panel_widget(pen_with_crit_then_blocked(), Settings({}, SCHEMA), translator())['data']

        assert [chip['value'] for chip in data['chips']] == [u'2', u'1', u'240']

    def test_the_card_value_is_the_damage_taken(self):
        data = panel_widget(pen_with_crit_then_blocked(), Settings({}, SCHEMA), translator())['data']

        assert data['value'] == u'−390'

    def test_a_line_template_draws_no_card(self):
        settings = Settings({'line_template': '{attacker}'}, SCHEMA)

        assert panel_widget(pen_with_crit_then_blocked(), settings, translator()) is None


class PreviewAndSettingsTest(unittest.TestCase):

    def test_the_preview_shows_a_ricochet(self):
        assert u'рикошет' in preview_text(Settings({}, SCHEMA), translator())

    def test_the_switch_is_the_battle_one(self):
        assert SETTINGS == ('battle_received_hits',)

    def test_both_languages_have_the_same_strings(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
