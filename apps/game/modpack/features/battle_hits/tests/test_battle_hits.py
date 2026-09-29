# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.features.battle_hits.i18n import STRINGS
from otmetki.features.battle_hits.model import HitBook, build_page, decode_segment, figure_of, figure_point, impact, panel_text, side_of, summary
from otmetki.features.battle_hits.model.constants import FIGURE, MAX_HITS
from otmetki.features.battle_hits.settings import SCHEMA, SETTINGS


def translator(language='ru'):
    return _support.translator(STRINGS, language)


def segment(part, code, start, end):
    value = code | (part << 8)
    for shift, byte in zip((16, 24, 32, 40, 48, 56), tuple(start) + tuple(end)):
        value |= byte << shift
    return value


class MemoryStore(object):

    def __init__(self, data=None):
        self.data = data

    def read(self, default=None):
        return self.data if self.data is not None else default

    def write(self, data):
        self.data = data


FRONT_HULL_PEN = segment(1, 4, (120, 100, 250), (130, 110, 255))
LEFT_TURRET_RICOCHET = segment(2, 2, (0, 128, 120), (10, 128, 130))
TRACK_BLOCKED = segment(5, 3, (240, 20, 100), (250, 30, 110))


class PointsTest(unittest.TestCase):

    def test_decodes_the_part_the_effect_and_the_box_fractions(self):
        index, code, start, end = decode_segment(FRONT_HULL_PEN)
        assert (index, code) == (1, 4)
        assert round(start[2], 3) == round(250 / 255.0, 3) and end[2] == 1.0
        assert decode_segment(-1) is None and decode_segment('x') is None

    def test_takes_the_last_point_of_a_shot(self):
        assert impact([LEFT_TURRET_RICOCHET, FRONT_HULL_PEN])[:2] == ('hull', 'pen')
        assert impact([TRACK_BLOCKED])[0] == 'chassis'
        assert impact([segment(1, 4, (5, 5, 5), (5, 5, 5)), segment(1, 9, (1, 1, 1), (2, 2, 2))]) is None
        assert impact(None) is None

    def test_sides_of_the_hull_and_turret(self):
        assert side_of('hull', 0.5, 0.9) == 'front'
        assert side_of('hull', 0.5, 0.1) == 'rear'
        assert side_of('turret', 0.1, 0.5) == 'left' and side_of('turret', 0.9, 0.5) == 'right'
        assert side_of('chassis', 0.1, 0.9) is None


class BookTest(unittest.TestCase):

    def test_records_a_battle_with_the_damage_in_either_order(self):
        store = MemoryStore()
        book = HitBook(store, 10)
        assert not book.hit([FRONT_HULL_PEN], 'Pz. IV')
        book.start(123, u'T-34', 100.0)
        assert book.hit([FRONT_HULL_PEN], 'Pz. IV', 'mediumTank', 100.0)
        assert book.damage('Pz. IV', 390, 100.2)
        assert not book.damage('KV-1', 240, 101.0)
        assert book.hit([segment(2, 5, (100, 100, 100), (110, 110, 110))], 'KV-1', 'heavyTank', 101.1)
        assert book.hit([LEFT_TURRET_RICOCHET], 'KV-1', 'heavyTank', 110.0)
        battle = book.finish()
        assert [(hit['part'], hit['outcome'], hit['damage']) for hit in battle['hits']] == [('hull', 'pen', 390), ('turret', 'crit', 240),
                                                                                           ('turret', 'ricochet', 0)]
        assert battle['hits'][0]['class'] == 'medium' and 'at' not in battle['hits'][0]
        book.save()
        again = HitBook(store, 10)
        assert again.latest()['id'] == '123' and len(again.latest()['hits']) == 3

    def test_keeps_the_last_battles_and_skips_battles_without_hits(self):
        book = HitBook(MemoryStore(), 2)
        for index in range(4):
            book.start(index, 'T-34', float(index))
            book.hit([FRONT_HULL_PEN], 'x', None, float(index))
            book.finish()
        book.start(9, 'T-34', 9.0)
        assert book.finish() is None
        assert [battle['id'] for battle in book.ordered()] == ['3', '2']
        assert book.clear('3') and not book.clear('3')
        book.resize(1)
        assert len(book.battles) == 1

    def test_caps_the_hits_of_one_battle(self):
        book = HitBook(MemoryStore(), 5)
        book.start(1, 'T-34', 0.0)
        for index in range(MAX_HITS + 3):
            book.hit([FRONT_HULL_PEN], 'x', None, float(index))
        assert len(book.current['hits']) == MAX_HITS

    def test_reads_a_damaged_file_as_empty(self):
        assert HitBook(MemoryStore(['nonsense']), 5).battles == []
        assert HitBook(MemoryStore({'battles': [{'id': 'x'}, 'y']}), 5).battles == []


def sample_battle():
    book = HitBook(MemoryStore(), 5)
    book.start(77, u'T-34', 1790000000.0)
    book.hit([FRONT_HULL_PEN], 'Pz. IV', 'mediumTank', 1.0)
    book.damage('Pz. IV', 390, 1.1)
    book.hit([LEFT_TURRET_RICOCHET], 'KV-1', 'heavyTank', 5.0)
    book.hit([TRACK_BLOCKED], 'KV-1', 'heavyTank', 9.0)
    return book, book.finish()


class PageTest(unittest.TestCase):

    def test_summary_counts_parts_and_sides(self):
        _, battle = sample_battle()
        stats = summary(battle)
        assert stats['hits'] == 3 and stats['damage'] == 390
        assert stats['counts']['pen'] == 1 and stats['counts']['ricochet'] == 1 and stats['counts']['blocked'] == 1
        assert stats['sides']['hull']['front'] == 1 and stats['sides']['turret']['left'] == 1 and stats['parts']['chassis'] == 1

    def test_the_schematic_puts_each_hit_on_its_part(self):
        _, battle = sample_battle()
        figure = figure_of(battle)
        assert len(figure['shapes']) == len(FIGURE)
        hull_x, hull_y = figure_point(battle['hits'][0])
        left, top, width, height = FIGURE['hull']
        assert left <= hull_x <= left + width and top <= hull_y <= top + 0.1 * height
        track_x, _ = figure_point(battle['hits'][2])
        assert FIGURE['chassis_right'][0] <= track_x <= FIGURE['chassis_right'][0] + FIGURE['chassis_right'][2]
        assert [mark['tone'] for mark in figure['marks']] == ['pen', 'ricochet', 'blocked']

    def test_page_and_hangar_label(self):
        book, battle = sample_battle()
        page = build_page(book, translator(), True)
        row = page['rows'][0]
        assert row['id'] == '77' and row['title'] == u'T-34'
        assert u'Попаданий 3' in row['subtitle'] and u'пробитий 1' in row['subtitle']
        assert u'урон 390' in row['meta']
        assert u'Корпус: лоб 1' in row['details'][0]['value'] and u'Ходовая 1' in row['details'][0]['value']
        assert row['details'][1]['value'] == u'Корпус, лоб · пробитие · −390 · Pz. IV'
        assert u'Pz. IV' not in build_page(book, translator('en'), False)['rows'][0]['details'][1]['value']
        assert row['figure']['marks'] and row['actions'][0]['id'] == 'clear'
        text = panel_text(battle, translator())
        assert u'Боевые раны · T-34' in text and u'Башня: левый борт 1' in text

    def test_settings_and_strings(self):
        assert SETTINGS == ('hangar_battle_hits',)
        assert SCHEMA.defaults['keep_battles'] == 10
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
