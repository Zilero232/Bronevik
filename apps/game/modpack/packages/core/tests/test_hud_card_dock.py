# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.hud import ComponentConfig, HudBackend, HudLayer, panel_schema
from otmetki.core.hud.icons import glyph
from otmetki.core.hud.panel import DOCK_ANCHORS, DOCKS, anchor_of, dock_layout, dock_of
from otmetki.core.hud.surface import SPACE_LOBBY, HudSurface
from otmetki.core.hud.widget import CARD_KIND, card, card_chip, card_row
from otmetki.core.lobby_view import plain_hangar
from otmetki.core.storage import MemoryFile


def sample_rows():
    return [
        card_row(
            u'Союз-4. Прорыв линии обороны',
            status='active',
            detail=u'Нанести 4000 урона и уничтожить 2 машины противника',
        ),
        card_row(None, u'28 295', label=u'95%', status='idle', note=u'за бой'),
        card_row(u'Ср. урон 3 000', u'2 740', status='active', progress=0.72, progress_tone='gold'),
        card_row(u'Сессия', u'WN8 2 310', color='#4fc3b0', text_tone='muted'),
    ]


def sample_chips():
    return [
        card_chip(u'5', glyph('dot'), 'accent', u'в работе'),
        card_chip(u'1 850', None, 'text', u'WN8', '#5B9BF2'),
    ]


def sample_card():
    return card(
        u'ЛБЗ',
        glyph('mission'),
        sample_rows(),
        value=u'79.53%',
        value_tone='gold',
        subtitle=u'EBR 105',
        chips=sample_chips(),
        footer=u'ср. урон 2 781',
        width=260,
        strip=['good', 'bad', 'muted', 'good'],
    )


def oversized_row():
    return card_row(u'x' * 500, 12345, progress=7, status='nope', color='red', tone_name='blue')


def oversized_card_data():
    rows = [oversized_row() for _ in range(40)]
    return card(u'T' * 200, rows=rows, chips=[card_chip(1)] * 20, width=5000)['data']


def docked_feature_schemas():
    from otmetki.features.battle_loadout.settings import SCHEMA as BATTLE_LOADOUT
    from otmetki.features.damage_log.settings import SCHEMA as DAMAGE_LOG
    from otmetki.features.marks_panel.settings import CARD_SCHEMA as HANGAR_MARKS
    from otmetki.features.marks_panel.settings import SCHEMA as MARKS_PANEL
    return (
        ('otmetki.hud.hangar_marks', HANGAR_MARKS),
        ('otmetki.hud.marks_panel', MARKS_PANEL),
        ('otmetki.hud.damage_log', DAMAGE_LOG),
        ('otmetki.hud.battle_loadout', BATTLE_LOADOUT),
    )


def team_hp_defaults():
    from otmetki.features.team_hp.settings import SCHEMA as TEAM_HP
    return TEAM_HP.defaults


def hangar_view():
    return {'hangar': True, 'blocking': True, 'alive': True}


def blocking_window():
    return {'blocking': True, 'alive': True}


def own_settings_window():
    return {'blocking': True, 'alive': True, 'own': True}


class Recorder(HudBackend):

    name = 'gameface'

    def __init__(self):
        self.calls = []

    def available(self):
        return True

    def create(self, alias, props):
        self.calls.append(('create', alias, dict(props)))
        return True

    def update(self, alias, props):
        self.calls.append(('update', alias, dict(props)))
        return True

    def delete(self, alias):
        self.calls.append(('delete', alias))
        return True

    def listen(self, on_moved):
        self.on_moved = on_moved


class CardTest(unittest.TestCase):

    def test_card_payload_is_the_page_fixture(self):
        payload = sample_card()

        assert payload['kind'] == CARD_KIND
        assert _support.widget_fixture('card', payload)

    def test_card_keeps_its_limits(self):
        data = oversized_card_data()

        assert len(data['rows']) == 12
        assert len(data['chips']) == 6
        assert len(data['title']) == 48
        assert data['width'] == 420

    def test_card_row_keeps_its_limits(self):
        row = oversized_card_data()['rows'][0]

        assert len(row['text']) == 64
        assert row['value'] == u'12345'
        assert row['progress'] == 1.0
        assert row['status'] is None
        assert row['color'] is None
        assert row['tone'] == 'text'

    def test_card_row_color_is_upper_cased(self):
        row = card_row(u'a', color='#4fc3b0')

        assert row['color'] == '#4FC3B0'

    def test_card_skips_missing_rows(self):
        rows = card(rows=[None, card_row(u'a')])['data']['rows']

        assert rows[0]['text'] == u'a'

    def test_card_strip_keeps_the_newest_marks(self):
        marks = ['good'] + ['bad'] * 12

        strip = card(strip=marks)['data']['strip']

        assert strip == ['bad'] * 12

    def test_card_strip_mutes_an_unknown_tone(self):
        marks = ['good', 'nope']

        strip = card(strip=marks)['data']['strip']

        assert strip == ['good', 'muted']


class DockTest(unittest.TestCase):

    def test_every_member_defaults_to_its_group_anchor(self):
        for alias, schema in docked_feature_schemas():
            group, order = DOCKS[alias]
            anchor = DOCK_ANCHORS[group]

            dock = dock_of(alias, schema.defaults)

            assert dock['group'] == group, alias
            assert dock['order'] == order, alias
            assert dock['reserve'] == anchor['reserve'], alias
            assert dock.get('ceiling') == anchor.get('ceiling'), alias

    def test_every_dock_group_has_an_anchor(self):
        groups = set(group for group, _ in DOCKS.values())

        assert groups == set(DOCK_ANCHORS)

    def test_the_team_hp_strip_sits_on_the_stock_score_strip(self):
        defaults = team_hp_defaults()

        assert defaults['x'] == 0
        assert defaults['y'] == 0
        assert defaults['align_x'] == 'center'
        assert defaults['align_y'] == 'top'
        assert defaults['pinned'] is True

    def test_the_team_hp_strip_is_not_docked(self):
        assert dock_of('otmetki.hud.team_hp', team_hp_defaults()) is None

    def test_a_panel_at_its_anchor_is_docked(self):
        layout = dock_layout('hangar_right')

        dock = dock_of('otmetki.personal_missions', layout)

        assert dock == {'group': 'hangar_right', 'order': 1, 'reserve': 190}

    def test_a_moved_panel_leaves_its_column(self):
        moved = dict(dock_layout('hangar_right'), x=-40)

        assert dock_of('otmetki.personal_missions', moved) is None

    def test_an_unknown_panel_is_not_docked(self):
        assert dock_of('otmetki.unknown', dock_layout('hangar_right')) is None

    def test_a_panel_without_a_layout_is_not_docked(self):
        assert dock_of('otmetki.personal_missions', None) is None

    def test_layer_docks_at_the_anchor(self):
        backend = Recorder()
        layer = HudLayer(backend, ComponentConfig(MemoryFile()))
        layer.register('marks_panel', panel_schema(anchor_of('battle_left_top')))

        layer.show('marks_panel', u'text')

        expected = {'group': 'battle_left_top', 'order': 0, 'reserve': 290, 'ceiling': 60}
        assert backend.calls[0][2]['dock'] == expected

    def test_layer_undocks_a_panel_after_a_move(self):
        backend = Recorder()
        layer = HudLayer(backend, ComponentConfig(MemoryFile()))
        layer.register('marks_panel', panel_schema(anchor_of('battle_left_top')))
        layer.show('marks_panel', u'text')

        layer.on_moved('otmetki.hud.marks_panel', {'x': 300, 'y': -40})

        assert backend.calls[-1] == ('update', 'otmetki.hud.marks_panel', {'dock': None})

    def test_surface_keeps_a_valid_dock(self):
        surface = HudSurface()

        surface.create('a', {'dock': {'group': 'hangar_left', 'order': 2}}, SPACE_LOBBY)

        assert surface.panel('a')['dock'] == {'group': 'hangar_left', 'order': 2}

    def test_surface_drops_an_invalid_dock(self):
        surface = HudSurface()

        surface.create('b', {'dock': {'group': 5, 'order': 'x'}}, SPACE_LOBBY)

        assert surface.panel('b')['dock'] is None


class LobbyViewTest(unittest.TestCase):

    def test_the_hangar_under_a_non_blocking_window_counts(self):
        assert plain_hangar([hangar_view(), {'blocking': False, 'alive': True}])

    def test_no_views_is_not_the_hangar(self):
        assert not plain_hangar([])

    def test_a_blocking_window_alone_is_not_the_hangar(self):
        assert not plain_hangar([blocking_window()])

    def test_a_blocking_window_over_the_hangar_hides_it(self):
        assert not plain_hangar([hangar_view(), blocking_window()])

    def test_a_closed_blocking_window_does_not_count(self):
        closed_window = dict(blocking_window(), alive=False)

        assert plain_hangar([hangar_view(), closed_window])

    def test_a_dead_hangar_view_does_not_count(self):
        dead_hangar = dict(hangar_view(), alive=False)

        assert not plain_hangar([dead_hangar, blocking_window()])

    def test_our_own_windows_never_hide_the_labels(self):
        assert plain_hangar([hangar_view(), own_settings_window()])

    def test_a_foreign_window_over_our_own_still_hides_the_labels(self):
        assert not plain_hangar([hangar_view(), own_settings_window(), blocking_window()])

    def test_our_own_window_alone_is_not_the_hangar(self):
        assert not plain_hangar([own_settings_window()])


if __name__ == '__main__':
    unittest.main()
