# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.received_hits.i18n import STRINGS
from otmetki.features.received_hits.model import ReceivedHits, format_panel
from otmetki.features.received_hits.model.constants import MAX_ENTRIES
from otmetki.features.received_hits.model.preview import preview_text
from otmetki.features.received_hits.model.shot import hit_code, is_ricochet
from otmetki.features.received_hits.settings import SCHEMA, SETTINGS


def translator(language='ru'):
    return _support.translator(STRINGS, language)


class ReceivedHitsTest(unittest.TestCase):

    def test_counts_every_outcome(self):
        hits = ReceivedHits()
        assert hits.add('pen', 'Pz. IV', 'mediumTank', 'ap', 390, 0, 1.0)
        assert hits.add('blocked', 'KV-1', 'heavyTank', 'he', 240, 0, 5.0)
        assert hits.add('ricochet', 'T-34', 'mediumTank', 'apcr', 0, 0, 9.0)
        assert not hits.add('miss', 'T-34', 'mediumTank', 'ap', 100, 0, 9.0)
        assert hits.totals == {'hits': 3, 'pen': 1, 'crit': 0, 'blocked': 1, 'ricochet': 1, 'damage': 390, 'blocked_damage': 240}
        assert [entry['class'] for entry in hits.recent(5)] == ['medium', 'heavy', 'medium']

    def test_crits_join_the_shot_that_caused_them(self):
        hits = ReceivedHits()
        hits.add('pen', 'Pz. IV', 'mediumTank', 'ap', 390, 0, 1.0)
        assert hits.add('crit', 'Pz. IV', 'mediumTank', None, 0, 2, 1.2)
        assert len(hits.entries) == 1 and hits.entries[0]['crits'] == 2 and hits.totals['crit'] == 1
        hits.add('crit', 'Pz. IV', 'mediumTank', None, 0, 1, 5.0)
        assert len(hits.entries) == 2 and hits.entries[1]['outcome'] == 'crit'

    def test_ricochet_turns_the_blocked_line(self):
        hits = ReceivedHits()
        hits.add('blocked', 'KV-1', 'heavyTank', 'ap', 240, 0, 5.0, 17)
        assert hits.ricochet(17, 'KV-1', 'heavyTank', 5.3)
        assert len(hits.entries) == 1 and hits.entries[0]['outcome'] == 'ricochet'
        assert hits.totals['blocked'] == 0 and hits.totals['ricochet'] == 1 and hits.totals['blocked_damage'] == 240

    def test_blocked_damage_joins_an_earlier_ricochet(self):
        hits = ReceivedHits()
        assert hits.ricochet(17, 'KV-1', 'heavyTank', 5.0)
        assert hits.add('blocked', 'KV-1', 'heavyTank', 'ap', 240, 0, 5.2, 17)
        assert len(hits.entries) == 1 and hits.entries[0]['damage'] == 240 and hits.entries[0]['shell'] == 'ap'
        assert hits.totals == {'hits': 1, 'pen': 0, 'crit': 0, 'blocked': 0, 'ricochet': 1, 'damage': 0, 'blocked_damage': 240}
        hits.add('blocked', 'KV-1', 'heavyTank', 'ap', 100, 0, 5.4, 17)
        assert len(hits.entries) == 2 and hits.entries[1]['outcome'] == 'blocked'

    def test_ricochet_only_matches_its_attacker_and_time(self):
        hits = ReceivedHits()
        hits.add('blocked', 'KV-1', 'heavyTank', 'ap', 240, 0, 5.0, 17)
        hits.ricochet(18, 'T-34', 'mediumTank', 5.1)
        hits.ricochet(17, 'KV-1', 'heavyTank', 9.0)
        assert [entry['outcome'] for entry in hits.entries] == ['blocked', 'ricochet', 'ricochet']
        assert not hits.ricochet(None)

    def test_ricochet_from_the_last_point(self):
        def segment(code, start=0x10, end=0x20):
            return code | (1 << 8) | (start << 16) | (end << 40)
        assert hit_code(segment(2)) == 2 and hit_code(segment(4, 0x10, 0x10)) is None and hit_code(-1) is None
        assert is_ricochet([segment(4), segment(1)])
        assert not is_ricochet([segment(1), segment(4)])
        assert is_ricochet([segment(2), segment(4, 0x10, 0x10)])
        assert not is_ricochet([]) and not is_ricochet(None)

    def test_is_capped(self):
        hits = ReceivedHits()
        for index in range(MAX_ENTRIES + 5):
            hits.add('pen', 'x', None, None, 1, 0, float(index))
        assert len(hits.entries) == MAX_ENTRIES and hits.totals['hits'] == MAX_ENTRIES + 5

    def test_format(self):
        hits = ReceivedHits()
        hits.add('pen', 'Pz. IV', 'mediumTank', 'ap', 390, 0, 1.0)
        hits.add('crit', 'Pz. IV', 'mediumTank', None, 0, 1, 1.1)
        hits.add('blocked', 'KV-1', 'heavyTank', 'he', 240, 0, 5.0)
        text = format_panel(hits, Settings({}, SCHEMA), translator())
        assert u'По вам: 2, пробитий 1, урон 390' in text
        assert u'СТ Pz. IV' in text and u'ББ' in text and u'−390 +1 крит.' in text
        assert u'не пробил, заблокировано 240' in text
        lines = text.split('\n')
        assert u'KV-1' in lines[1] and u'Pz. IV' in lines[2]
        plain = format_panel(hits, Settings({'show_header': False, 'show_class': False, 'show_shell': False}, SCHEMA), translator('en'))
        assert 'On you' not in plain and 'MT' not in plain and 'AP' not in plain
        custom = format_panel(hits, Settings({'show_header': False, 'line_template': '{attacker}:{outcome}:{damage}', 'lines': 1}, SCHEMA),
                              translator('en'))
        assert 'KV-1:no pen:240' in custom and 'Pz. IV' not in custom
        assert format_panel(ReceivedHits(), Settings({}, SCHEMA), translator()) is None

    def test_preview_settings_and_strings(self):
        assert u'рикошет' in preview_text(Settings({}, SCHEMA), translator())
        assert SETTINGS == ('battle_received_hits',)
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
