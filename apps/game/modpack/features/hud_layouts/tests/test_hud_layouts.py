# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.hud import ComponentConfig, HudBackend, HudLayer, panel_schema
from otmetki.core.hud.modes import COMPACT_PANELS, MODES
from otmetki.core.settings import Settings
from otmetki.core.storage import MemoryFile
from otmetki.features.hud_layouts.i18n import STRINGS
from otmetki.features.hud_layouts.model import layout_policy, place_actions
from otmetki.features.hud_layouts.settings import SCHEMA, SETTINGS


class Backend(HudBackend):

    def __init__(self):
        self.labels = {}

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


def translator(language='ru'):
    return _support.translator(STRINGS, language)


class HudLayoutsTest(unittest.TestCase):

    def test_default_policy_per_battle_type(self):
        policy = layout_policy(Settings({}, SCHEMA), lambda: True)
        assert policy('random') == (None, True)
        assert policy('comp7') == (None, True)
        assert policy('event') == (frozenset(COMPACT_PANELS), True)
        assert policy('frontline') == (frozenset(COMPACT_PANELS), True)
        assert policy('battle_royale') == (frozenset(), True)
        assert policy('unknown') == (None, False)

    def test_switched_off_shows_every_panel_at_its_own_place(self):
        policy = layout_policy(Settings({'event': 'off'}, SCHEMA), lambda: False)
        assert policy('event') == (None, False)

    def test_the_layer_follows_the_chosen_layout(self):
        layer = HudLayer(Backend(), ComponentConfig(MemoryFile()))
        for panel_id in ('damage_log', 'team_hp'):
            layer.register(panel_id, panel_schema({}))
        settings = Settings({'comp7': 'compact', 'own_places': False}, SCHEMA)
        layer.set_policy(layout_policy(settings, lambda: True))
        layer.enter_mode('comp7')
        assert layer.allows('damage_log') and not layer.allows('team_hp') and not layer.own_places

    def test_reset_places_action(self):
        translate = translator()
        assert place_actions([], translate) == []
        action = place_actions(['comp7', 'event'], translate)[0]
        assert action['id'] == 'reset_places' and u'Натиск, События' in action['confirm']

    def test_settings_and_strings(self):
        assert SETTINGS == ('battle_hud_layouts',)
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])
        for mode in MODES:
            assert 'hud_layouts_' + mode in STRINGS['ru']
            for layout in SCHEMA.choices[mode]:
                assert 'hud_layouts_%s_%s' % (mode, layout) in STRINGS['en']


if __name__ == '__main__':
    unittest.main()
