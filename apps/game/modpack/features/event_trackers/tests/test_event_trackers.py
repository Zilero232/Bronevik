# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.event_trackers.i18n import STRINGS
from otmetki.features.event_trackers.model import clean_caravan, format_caravan, format_triathlon, remaining, triathlon_view
from otmetki.features.event_trackers.model.triathlon import TriathlonRounds, clean_event, counts, left_s, score
from otmetki.features.event_trackers.model.widget import caravan_widget, triathlon_widget
from otmetki.features.event_trackers.settings import SCHEMA, SETTINGS

START = 1790000000


def translator(language='ru'):
    return _support.translator(STRINGS, language)


def battle(arena, at, xp, tier=8, bonus_type=1, name=u'Т-34'):
    return {'arena_unique_id': str(arena), 'arena_created_at': at, 'bonus_type': bonus_type, 'vehicle': {'tier': tier, 'name': name},
            'stats': {'original_xp': xp}}


def filled_rounds():
    rounds = TriathlonRounds()
    for arena, offset, xp in ((1, 0, 900), (2, 600, 1500), (3, 1200, 400), (4, 2400, 1200)):
        rounds.add(battle(arena, START + offset, xp))
    return rounds


class TriathlonTest(unittest.TestCase):

    def test_only_random_battles_on_tier_six_and_up_count(self):
        assert counts(battle(1, START, 100))
        assert not counts(battle(1, START, 100, tier=5))
        assert not counts(battle(1, START, 100, bonus_type=43))
        assert not counts(None)
        assert counts(battle(1, START, 100, tier=5), min_tier=5)

    def test_a_round_is_sixty_minutes_from_its_first_battle(self):
        rounds = filled_rounds()
        assert len(rounds.rounds) == 1 and score(rounds.last(), 3) == 3600
        assert not rounds.add(battle(4, START + 2500, 5000))
        assert rounds.add(battle(5, START + 3600, 700))
        assert len(rounds.rounds) == 2 and score(rounds.last(), 3) == 700
        assert rounds.best_score(3) == 3600 and rounds.best_score(3, since=START + 1) == 700

    def test_rounds_survive_a_reload_and_drop_garbage(self):
        data = filled_rounds().dump()
        data['rounds'].append({'start': 'x'})
        data['rounds'][0]['battles'].append({'at': START, 'xp': -1})
        rounds = TriathlonRounds(data)
        assert len(rounds.rounds) == 1 and len(rounds.last()['battles']) == 4
        assert TriathlonRounds(None).rounds == [] and TriathlonRounds({'rounds': 'x'}).rounds == []

    def test_time_left(self):
        rounds = filled_rounds()
        assert left_s(rounds.last(), START + 600) == 3000 and left_s(rounds.last(), START + 9999) == 0
        assert remaining(3000, translator()) == u'50 минут'
        assert remaining(90000, translator()) == u'1 день 1 час'
        assert remaining(7200, translator('en')) == u'2 hours'
        assert remaining(10, translator()) == u'1 минута'

    def test_clean_event(self):
        event = clean_event({'name': u' Триатлон ', 'cardinality': 3, 'start': START, 'end': START + 10, 'min_tier': 6})
        assert event == {'name': u'Триатлон', 'cardinality': 3, 'start': START, 'end': START + 10, 'min_tier': 6}
        assert clean_event({'cardinality': 0, 'min_tier': 99})['cardinality'] == 3
        assert clean_event(None) is None

    def test_view_text_and_widget(self):
        event = clean_event({'name': None, 'start': START})
        translate = translator()
        view = triathlon_view(filled_rounds(), event, START + 2400, translate)
        assert view['running'] and view['score'] == 3600 and view['count'] == 4
        assert [item['xp'] for item in view['battles']] == [1500, 1200, 900]
        text = format_triathlon(view, Settings({}, SCHEMA), translate)
        assert u'Триатлон: 3 600' in text and u'Раунд: осталось 20 минут' in text and u'В раунде: 4 боя' in text
        data = triathlon_widget(view, translate)['data']
        assert data['value'] == u'3 600' and data['rows'][0]['label'] == u'1.' and data['rows'][0]['value'] == u'1 500'
        assert data['footer'] == u'Сумма 3 лучших боёв по чистому опыту за 60 минут · случайные бои, VI+'
        empty = triathlon_view(TriathlonRounds(), event, START, translator('en'))
        assert empty['score'] is None and empty['state'] == u'The round starts with the first battle'
        assert triathlon_widget(empty, translator('en'))['data']['value'] is None


class CaravanTest(unittest.TestCase):

    def test_caravan_card(self):
        found = clean_caravan({'coins': 12, 'finish': START + 3 * 86400})
        text = format_caravan(found, START, Settings({}, SCHEMA), translator())
        assert u'Торговый караван: 12 жетонов' in text and u'До конца: 3 дня' in text
        data = caravan_widget(found, START, translator('en'))['data']
        assert data['value'] == u'12 tokens' and data['rows'][0]['value'] == u'3 days'
        assert clean_caravan({'coins': 'x', 'finish': 0}) == {'coins': 0, 'finish': None}
        assert clean_caravan(None) is None
        assert caravan_widget(clean_caravan({'coins': 1}), START, translator())['data']['rows'] == []

    def test_settings_and_strings(self):
        assert SETTINGS == ('hangar_event_trackers',)
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
