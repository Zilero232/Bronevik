# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import copy
import os
import unittest

import _support
from otmetki.core.me import REFRESH_AFTER_BATTLE_S, tank_key, tank_rows
from otmetki.core.settings import Settings
from otmetki.features.hangar_ratings.i18n import STRINGS
from otmetki.features.hangar_ratings.model import (
    OVERVIEW_KEY,
    RatingsCache,
    layout_of,
    page_actions,
    panel_text,
    parse_overview,
    ratings_widget,
)
from otmetki.features.hangar_ratings.model.constants import TIER_COLORS
from otmetki.features.hangar_ratings.settings import SCHEMA, SETTINGS

ACCOUNT = 12345678
T0 = 1790000000.0
OVERVIEW_EXAMPLE = 'ratings-overview.example.json'
TANKS_EXAMPLE = 'ratings-tanks.example.json'


def example(name):
    return _support.load_json(os.path.join(_support.CONTRACT_DIR, 'examples', name))


def translator(language='ru'):
    return _support.translator(STRINGS, language)


def settings(**values):
    return Settings(values, SCHEMA)


def stored_cache():
    cache = RatingsCache(ACCOUNT)
    cache.store_overview({'account_id': ACCOUNT})
    return cache


class ParseTest(unittest.TestCase):

    def test_the_overview_example_matches_the_contract(self):
        validator = _support.schema_validator('ratings.schema.json', 'overview')
        if validator is None:
            self.skipTest('jsonschema not installed')

        validator.validate(example(OVERVIEW_EXAMPLE))

    def test_overview_example(self):
        overview = parse_overview(example(OVERVIEW_EXAMPLE), ACCOUNT)

        assert overview['nickname'] == 'Tanker_2026'
        assert overview['overall']['battles'] == 18432
        assert overview['overall']['win_rate'] == 53.41
        assert overview['overall']['wn8'] == {'value': 1850.4, 'tier': 'good'}
        assert overview['session']['is_live'] is True
        assert overview['session']['brone_index'] == {'value': None, 'tier': None}

    def test_an_overview_of_another_account_is_dropped(self):
        assert parse_overview(example(OVERVIEW_EXAMPLE), ACCOUNT + 1) is None

    def test_an_overview_without_a_bound_account_is_dropped(self):
        assert parse_overview(example(OVERVIEW_EXAMPLE), None) is None

    def test_an_overview_that_is_not_an_object_is_dropped(self):
        assert parse_overview(['not', 'an', 'object'], ACCOUNT) is None

    def test_overview_without_ratings_yet(self):
        data = {'account_id': ACCOUNT, 'nickname': None, 'overall': None, 'session': None}

        overview = parse_overview(data, ACCOUNT)

        assert overview == {'account_id': ACCOUNT, 'nickname': None, 'overall': None, 'session': None}


class CacheTest(unittest.TestCase):

    def test_a_new_cache_wants_the_overview(self):
        cache = RatingsCache(ACCOUNT)

        assert cache.wants(OVERVIEW_KEY, T0)

    def test_a_read_in_flight_is_not_wanted_again(self):
        cache = RatingsCache(ACCOUNT)

        cache.start([OVERVIEW_KEY])

        assert not cache.wants(OVERVIEW_KEY, T0)

    def test_a_stored_overview_is_kept_and_not_read_again(self):
        cache = RatingsCache(ACCOUNT)
        cache.start([OVERVIEW_KEY])

        cache.store_overview({'account_id': ACCOUNT})

        assert not cache.wants(OVERVIEW_KEY, T0 + 3600)
        assert cache.overview == {'account_id': ACCOUNT}

    def test_failure_waits_before_the_next_try(self):
        cache = RatingsCache(ACCOUNT)
        cache.start([tank_key(1)])

        cache.fail([tank_key(1)], T0, 60)

        assert not cache.wants(tank_key(1), T0 + 59)
        assert cache.wants(tank_key(1), T0 + 60)

    def test_a_battle_refreshes_the_overview_after_a_delay(self):
        cache = stored_cache()

        cache.after_battle(T0)

        assert not cache.wants(OVERVIEW_KEY, T0 + REFRESH_AFTER_BATTLE_S - 1)
        assert cache.wants(OVERVIEW_KEY, T0 + REFRESH_AFTER_BATTLE_S)
        assert cache.overview == {'account_id': ACCOUNT}

    def test_ingest_answer_expedites_a_stale_overview(self):
        cache = RatingsCache(ACCOUNT)
        cache.after_battle(T0)

        cache.expedite(OVERVIEW_KEY)

        assert cache.wants(OVERVIEW_KEY, T0)

    def test_ingest_answer_leaves_a_fresh_overview_alone(self):
        cache = RatingsCache(ACCOUNT)
        cache.store_overview(None)

        cache.expedite(OVERVIEW_KEY)

        assert not cache.wants(OVERVIEW_KEY, T0)

    def test_refresh_all_wants_the_overview_again(self):
        cache = stored_cache()

        cache.refresh_all()

        assert cache.wants(OVERVIEW_KEY, T0)

    def test_reset_clears_everything(self):
        cache = stored_cache()

        cache.reset(ACCOUNT + 1)

        assert cache.overview is None
        assert cache.account_id == ACCOUNT + 1
        assert cache.wants(OVERVIEW_KEY, T0)


class PanelTest(unittest.TestCase):

    def setUp(self):
        self.overview = parse_overview(example(OVERVIEW_EXAMPLE), ACCOUNT)
        self.tank = tank_rows(example(TANKS_EXAMPLE), ACCOUNT)[1]

    def test_default_panel(self):
        text = panel_text(self.overview, self.tank, u'T-34', settings(), translator())

        assert u'Мои рейтинги' in text
        assert u'Аккаунт:' in text
        assert u'Сессия:' in text
        assert u'T-34' in text
        assert u'1 850' in text
        assert u'53.41% побед' in text
        assert u'18 432 боя' in text
        assert u'86.12% ★★' in text
        assert u'Мастер' in text
        assert TIER_COLORS['good'] in text
        assert TIER_COLORS['very_good'] in text
        assert u'ЭФФ' not in text

    def test_metric_switches(self):
        switches = settings(metric_wn8=False, metric_eff=True, colored=False, metric_mastery=False)

        text = panel_text(self.overview, self.tank, u'T-34', switches, translator('en'))

        assert 'WN8' not in text
        assert 'EFF' in text
        assert 'Ace Tanker' not in text
        assert TIER_COLORS['good'] not in text

    def test_the_tank_line_stays_when_the_other_lines_are_off(self):
        tank_only = settings(show_account=False, show_session=False)

        text = panel_text(self.overview, self.tank, u'T-34', tank_only, translator())

        assert u'Аккаунт:' not in text
        assert u'T-34' in text

    def test_no_panel_without_a_tank_when_the_other_lines_are_off(self):
        tank_only = settings(show_account=False, show_session=False)

        assert panel_text(self.overview, None, None, tank_only, translator()) is None

    def test_no_panel_before_anything_is_read(self):
        assert panel_text(None, None, None, settings(), translator()) is None

    def test_untracked_account_and_last_session(self):
        overview = copy.deepcopy(self.overview)
        overview['overall'] = None
        overview['session']['is_live'] = False

        text = panel_text(overview, None, None, settings(), translator('en'))

        assert 'appear after' in text
        assert 'Last session:' in text

    def test_empty_session_is_not_shown(self):
        overview = copy.deepcopy(self.overview)
        overview['session']['battles'] = 0

        text = panel_text(overview, None, None, settings(), translator())

        assert u'Сессия' not in text


class WidgetTest(unittest.TestCase):

    def setUp(self):
        self.overview = parse_overview(example(OVERVIEW_EXAMPLE), ACCOUNT)
        self.tank = tank_rows(example(TANKS_EXAMPLE), ACCOUNT)[1]

    def test_account_ratings_are_chips_in_their_tier_colours(self):
        widget = ratings_widget(self.overview, self.tank, u'T-34', settings(), translator())

        chips = widget['data']['chips']
        assert [chip['value'] for chip in chips] == [u'1 850', u'61']
        assert [chip['label'] for chip in chips] == [u'WN8', u'БИ']
        assert chips[0]['color'] == TIER_COLORS['good']

    def test_account_row_lists_the_facts(self):
        widget = ratings_widget(self.overview, self.tank, u'T-34', settings(), translator())

        row = widget['data']['rows'][0]
        assert row['label'] == u'Аккаунт'
        assert row['text'] == u'53.41% побед · 18 432 боя · ср. урон 1 654'

    def test_tank_row_carries_wn8_and_the_facts(self):
        widget = ratings_widget(self.overview, self.tank, u'T-34', settings(), translator())

        row = widget['data']['rows'][2]
        assert row['label'] == u'T-34'
        assert row['value'] == u'WN8 2 105'
        assert row['color'] == TIER_COLORS['very_good']
        assert row['detail'] == u'55.10% побед · 412 боёв · ср. урон 1 204 · 86.12% ★★ · Мастер'

    def test_uncoloured_rows_carry_no_tier_colour(self):
        widget = ratings_widget(self.overview, self.tank, u'T-34', settings(colored=False), translator())

        assert widget['data']['rows'][2].get('color') is None

    def test_no_card_before_anything_is_read(self):
        assert ratings_widget(None, None, None, settings(), translator()) is None


class PageTest(unittest.TestCase):

    def test_layout_follows_the_position_settings(self):
        assert layout_of(settings()) == {'x': 16, 'y': 440, 'alignX': 'left', 'alignY': 'top'}

    def test_page_offers_refresh_and_the_site(self):
        actions = page_actions(translator())

        assert [action['id'] for action in actions] == ['refresh', 'site']

    def test_the_config_switch(self):
        assert SETTINGS == ('hangar_ratings',)

    def test_both_languages_have_the_same_keys(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])

    def test_every_setting_has_a_label(self):
        for key in SCHEMA.defaults:
            assert 'hangar_ratings_' + key in STRINGS['ru'], key


if __name__ == '__main__':
    unittest.main()
