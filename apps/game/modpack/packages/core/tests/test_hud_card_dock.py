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


def sample_card():
    return card(u'ЛБЗ', glyph('mission'), [
        card_row(u'Союз-4. Прорыв линии обороны', status='active', detail=u'Нанести 4000 урона и уничтожить 2 машины противника'),
        card_row(None, u'28 295', label=u'95%', status='idle', note=u'за бой'),
        card_row(u'Ср. урон 3 000', u'2 740', status='active', progress=0.72, progress_tone='gold'),
        card_row(u'Сессия', u'WN8 2 310', color='#4fc3b0', text_tone='muted'),
    ], value=u'79.53%', value_tone='gold', subtitle=u'EBR 105', rail='progress',
        chips=[card_chip(u'5', glyph('dot'), 'accent', u'в работе'), card_chip(u'1 850', None, 'text', u'WN8', '#5B9BF2')],
        footer=u'ср. урон 2 781', width=260)


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
        rows = [card_row(u'x' * 500, 12345, progress=7, status='nope', color='red', tone_name='blue') for _ in range(40)]
        data = card(u'T' * 200, rows=rows, chips=[card_chip(1)] * 20, width=5000)['data']
        assert len(data['rows']) == 12 and len(data['chips']) == 6 and len(data['title']) == 48 and data['width'] == 420
        row = data['rows'][0]
        assert len(row['text']) == 64 and row['value'] == u'12345' and row['progress'] == 1.0
        assert row['status'] is None and row['color'] is None and row['tone'] == 'text'
        assert card_row(u'a', color='#4fc3b0')['color'] == '#4FC3B0'
        assert card(rows=[None, card_row(u'a')])['data']['rows'][0]['text'] == u'a'


class DockTest(unittest.TestCase):

    def test_every_member_defaults_to_its_group_anchor(self):
        from otmetki.features.battle_loadout.settings import SCHEMA as BATTLE_LOADOUT
        from otmetki.features.consumables.settings import SCHEMA as CONSUMABLES
        from otmetki.features.damage_log.settings import LAST_HIT_SCHEMA
        from otmetki.features.hangar_marks.settings import SCHEMA as HANGAR_MARKS
        from otmetki.features.hit_log.settings import SCHEMA as HIT_LOG
        from otmetki.features.hangar_ratings.settings import SCHEMA as HANGAR_RATINGS
        from otmetki.features.marks_panel.settings import SCHEMA as MARKS_PANEL
        from otmetki.features.personal_best.settings import SCHEMA as PERSONAL_BEST
        from otmetki.features.received_hits.settings import SCHEMA as RECEIVED_HITS
        for alias, schema in (('otmetki.hud.hangar_marks', HANGAR_MARKS), ('otmetki.hangar_ratings', HANGAR_RATINGS),
                              ('otmetki.hud.marks_panel', MARKS_PANEL), ('otmetki.hud.personal_best', PERSONAL_BEST),
                              ('otmetki.hud.received_hits', RECEIVED_HITS), ('otmetki.hud.hit_log', HIT_LOG),
                              ('otmetki.hud.last_hit', LAST_HIT_SCHEMA), ('otmetki.hud.battle_loadout', BATTLE_LOADOUT),
                              ('otmetki.hud.consumables', CONSUMABLES)):
            group, order = DOCKS[alias]
            dock = dock_of(alias, schema.defaults)
            assert (dock['group'], dock['order'], dock['reserve']) == (group, order, DOCK_ANCHORS[group]['reserve']), alias
            assert dock.get('ceiling') == DOCK_ANCHORS[group].get('ceiling') and dock.get('stop_center') == DOCK_ANCHORS[group].get('stop_center'), alias
        assert set(group for group, _ in DOCKS.values()) == set(DOCK_ANCHORS)

    def test_the_team_hp_strip_sits_on_the_stock_score_strip(self):
        from otmetki.features.team_hp.settings import SCHEMA as TEAM_HP
        defaults = TEAM_HP.defaults
        assert (defaults['x'], defaults['y'], defaults['align_x'], defaults['align_y'], defaults['pinned']) == (0, 0, 'center', 'top', True)
        assert dock_of('otmetki.hud.team_hp', TEAM_HP.defaults) is None

    def test_a_moved_panel_leaves_its_column(self):
        layout = dock_layout('hangar_right')
        assert dock_of('otmetki.personal_missions', layout) == {'group': 'hangar_right', 'order': 2, 'reserve': 190}
        assert dock_of('otmetki.personal_missions', dict(layout, x=-40)) is None
        assert dock_of('otmetki.unknown', layout) is None and dock_of('otmetki.personal_missions', None) is None

    def test_layer_docks_at_the_anchor_and_undocks_after_a_move(self):
        backend = Recorder()
        layer = HudLayer(backend, ComponentConfig(MemoryFile()))
        layer.register('marks_panel', panel_schema(anchor_of('battle_left_top')))
        layer.show('marks_panel', u'text')
        anchor = DOCK_ANCHORS['battle_left_top']
        assert backend.calls[0][2]['dock'] == {'group': 'battle_left_top', 'order': 0, 'reserve': anchor['reserve'], 'ceiling': anchor['ceiling']}
        layer.on_moved('otmetki.hud.marks_panel', {'x': 300, 'y': -40})
        assert backend.calls[-1] == ('update', 'otmetki.hud.marks_panel', {'dock': None})

    def test_surface_keeps_only_a_valid_dock(self):
        surface = HudSurface()
        surface.create('a', {'dock': {'group': 'hangar_left', 'order': 2}}, SPACE_LOBBY)
        surface.create('b', {'dock': {'group': 5, 'order': 'x'}}, SPACE_LOBBY)
        assert surface.panel('a')['dock'] == {'group': 'hangar_left', 'order': 2}
        assert surface.panel('b')['dock'] is None


class LobbyViewTest(unittest.TestCase):

    def test_only_the_plain_hangar_counts(self):
        hangar = {'hangar': True, 'blocking': True, 'alive': True}
        assert plain_hangar([hangar, {'blocking': False, 'alive': True}])
        assert not plain_hangar([])
        assert not plain_hangar([{'blocking': True, 'alive': True}])
        assert not plain_hangar([hangar, {'blocking': True, 'alive': True}])
        assert plain_hangar([hangar, {'blocking': True, 'alive': False}])
        assert not plain_hangar([dict(hangar, alive=False), {'blocking': True, 'alive': True}])

    def test_our_own_windows_never_hide_the_labels(self):
        hangar = {'hangar': True, 'blocking': True, 'alive': True}
        settings_window = {'blocking': True, 'alive': True, 'own': True}
        assert plain_hangar([hangar, settings_window])
        assert not plain_hangar([hangar, settings_window, {'blocking': True, 'alive': True}])
        assert not plain_hangar([settings_window])


if __name__ == '__main__':
    unittest.main()
