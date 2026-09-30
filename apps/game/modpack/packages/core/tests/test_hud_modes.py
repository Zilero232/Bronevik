# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.core.hud import ComponentConfig, HudBackend, HudLayer, panel_schema
from otmetki.core.hud.modes import (COMPACT_PANELS, MODES, PLACES_SECTION, ModePlaces, allowed_panels, battle_mode, clean_place, suppresses)
from otmetki.core.storage import MemoryFile


class Backend(HudBackend):

    def __init__(self):
        self.labels = {}
        self.on_moved = None

    def available(self):
        return True

    def create(self, alias, props):
        self.labels[alias] = dict(props)
        return True

    def update(self, alias, props):
        self.labels[alias].update(props)
        return True

    def delete(self, alias):
        del self.labels[alias]
        return True

    def listen(self, on_moved):
        self.on_moved = on_moved


def layer_with(*panel_ids):
    layer = HudLayer(Backend(), ComponentConfig(MemoryFile()))
    for panel_id in panel_ids:
        layer.register(panel_id, panel_schema({'x': 10, 'y': 20}))
    return layer


def compact_policy(mode):
    return (allowed_panels('compact') if mode == 'event' else None, True)


class BattleModeTest(unittest.TestCase):

    def test_gui_type_first(self):
        assert battle_mode(1, 1) == 'random'
        assert battle_mode(30, 43) == 'comp7'
        assert battle_mode(33, 47) == 'comp7'
        assert battle_mode(21, 27) == 'frontline'
        assert battle_mode(23, 29) == 'battle_royale'
        assert battle_mode(301, 52) == 'event'
        assert battle_mode(100) == 'event'

    def test_bonus_type_then_page_then_random(self):
        assert battle_mode(None, 43) == 'comp7'
        assert battle_mode(None, 52) == 'event'
        assert battle_mode(None, None, 'epicBattlePage') == 'frontline'
        assert battle_mode(999) == 'event'
        assert battle_mode(99) == 'random'
        assert battle_mode(None, None, None) == 'random'
        assert battle_mode(True, None) == 'random'

    def test_layouts(self):
        assert allowed_panels('full') is None
        assert allowed_panels('compact') == frozenset(COMPACT_PANELS)
        assert allowed_panels('off') == frozenset()

    def test_suppressing_modes(self):
        assert suppresses(None) and suppresses('random') and suppresses('comp7')
        assert not suppresses('event') and not suppresses('frontline') and not suppresses('battle_royale')

    def test_clean_place(self):
        assert clean_place({'x': 5.6, 'y': 99999, 'align_x': 'left', 'align_y': 'middle', 'scale': 10, 'alpha': 3}) == {
            'x': 6, 'y': 4000, 'align_x': 'left', 'scale': 50}
        assert clean_place(None) == {} and clean_place({'x': True}) == {}


class ModePlacesTest(unittest.TestCase):

    def test_saved_per_mode_and_never_for_random(self):
        config = ComponentConfig(MemoryFile())
        places = ModePlaces(config)
        assert places.save('comp7', 'damage_log', {'x': 1, 'y': 2}) == ['x', 'y']
        assert places.save('comp7', 'damage_log', {'x': 1}) == []
        assert places.save('random', 'damage_log', {'x': 1}) == []
        assert places.save('nowhere', 'damage_log', {'x': 1}) == []
        assert places.get('comp7', 'damage_log') == {'x': 1, 'y': 2}
        assert places.get('event', 'damage_log') == {}
        assert places.modes() == ['comp7']
        assert config.store.read({})[PLACES_SECTION] == {'comp7': {'damage_log': {'x': 1, 'y': 2}}}
        assert places.clear() and places.modes() == [] and not places.clear()

    def test_hand_edited_section_is_cleaned(self):
        config = ComponentConfig(MemoryFile())
        config.set_raw(PLACES_SECTION, {'comp7': {'damage_log': {'x': 'far', 'y': 3}}, 'bad': {}, 'event': []})
        places = ModePlaces(config)
        assert places.get('comp7', 'damage_log') == {'y': 3}
        assert places.modes() == ['comp7']
        assert set(MODES) >= set(places.modes())


class LayerModeTest(unittest.TestCase):

    def test_without_a_policy_every_panel_shows(self):
        layer = layer_with('damage_log', 'team_hp')
        layer.enter_mode('event')
        assert layer.show('team_hp', 'a') and 'otmetki.hud.team_hp' in layer.backend.labels

    def test_compact_event_layout_holds_other_panels(self):
        layer = layer_with('damage_log', 'team_hp')
        layer.set_policy(compact_policy)
        layer.show('team_hp', 'a')
        layer.enter_mode('event')
        assert not layer.allows('team_hp') and layer.allows('damage_log')
        assert 'otmetki.hud.team_hp' not in layer.backend.labels
        layer.leave_mode()
        assert layer.backend.labels['otmetki.hud.team_hp']['text'] == 'a'

    def test_a_drag_in_a_battle_type_is_kept_for_that_type(self):
        layer = layer_with('damage_log')
        layer.set_policy(compact_policy)
        layer.enter_mode('event')
        layer.show('damage_log', 'log')
        assert layer.on_moved('otmetki.hud.damage_log', {'x': 300, 'y': 40})
        assert layer.panels['damage_log'].get('x') == 10
        assert layer.mode_places.get('event', 'damage_log') == {'x': 300, 'y': 40}
        layer.leave_mode()
        assert layer.backend.labels['otmetki.hud.damage_log']['x'] == 10
        layer.enter_mode('event')
        assert layer.backend.labels['otmetki.hud.damage_log']['x'] == 300

    def test_random_keeps_the_panels_own_places(self):
        layer = layer_with('damage_log')
        layer.set_policy(compact_policy)
        layer.enter_mode('random')
        layer.show('damage_log', 'log')
        layer.on_moved('otmetki.hud.damage_log', {'x': 50, 'y': 60})
        assert layer.panels['damage_log'].get('x') == 50
        assert layer.mode_places.modes() == []

    def test_a_type_without_own_places_saves_into_the_settings(self):
        layer = layer_with('damage_log')
        layer.set_policy(lambda mode: (None, False))
        layer.enter_mode('comp7')
        layer.show('damage_log', 'log')
        layer.on_moved('otmetki.hud.damage_log', {'x': 70})
        assert layer.panels['damage_log'].get('x') == 70


if __name__ == '__main__':
    unittest.main()
