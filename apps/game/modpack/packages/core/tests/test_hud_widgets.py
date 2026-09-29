# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import io
import os
import re
import unittest

import _support
from otmetki.core.hud import ComponentConfig, HudBackend, HudLayer, panel_schema
from otmetki.core.hud.icons import (artefact_icon, class_icon, efficiency_icon, flag_icon, glyph, item_name, mark_icon, outcome_icon, resolve,
                                    shell_icon, shell_icon_of, split, tier_icon)
from otmetki.core.hud.stock import BATTLE_DAMAGE_LOG_PANEL, FRAG_CORRELATION_BAR, SIXTH_SENSE, StockSuppression
from otmetki.core.hud.surface import SPACE_BATTLE, HudSurface
from otmetki.core.hud.widget import TONES, WIDGET_VERSION, tone, widget
from otmetki.core.storage import MemoryFile

HUD_PROTOCOL_CONSTANTS = os.path.join(_support.MODPACK_DIR, 'ui-web', 'src', 'shared', 'api', 'hud-protocol', 'hud-protocol.constants.ts')


class Recorder(HudBackend):

    name = 'gameface'

    def __init__(self, widgets=True):
        self.calls = []
        self.widgets = widgets

    def available(self):
        return True

    def renders_widgets(self):
        return self.widgets

    def create(self, alias, props):
        self.calls.append(('create', dict(props)))
        return True

    def update(self, alias, props):
        self.calls.append(('update', dict(props)))
        return True

    def delete(self, alias):
        self.calls.append(('delete', alias))
        return True


class WidgetPayloadTest(unittest.TestCase):

    def test_payload_shape_and_tones(self):
        assert widget('team_hp', {'a': 1}) == {'kind': 'team_hp', 'v': WIDGET_VERSION, 'data': {'a': 1}}
        assert tone('accent') == 'accent' and tone('pink') == 'text' and tone(None, 'muted') == 'muted'

    def test_tones_and_version_match_the_page(self):
        with io.open(HUD_PROTOCOL_CONSTANTS, encoding='utf-8') as handle:
            source = handle.read()
        assert tuple(re.findall(r"'([a-z]+)'", re.search(r'tones: \[([^\]]*)\]', source).group(1))) == TONES
        assert re.search(r'widgetVersion: (\d+)', source).group(1) == str(WIDGET_VERSION)

    def test_layer_sends_the_widget_and_skips_an_unchanged_one(self):
        backend = Recorder()
        layer = HudLayer(backend, ComponentConfig(MemoryFile()))
        layer.register('panel', panel_schema({}))
        payload = widget('x', {'n': 1})
        layer.show('panel', 'text', payload)
        layer.show('panel', 'text', payload)
        layer.show('panel', 'text', widget('x', {'n': 2}))
        assert [call[0] for call in backend.calls] == ['create', 'update']
        assert backend.calls[0][1]['widget'] == payload and backend.calls[1][1]['widget']['data'] == {'n': 2}
        assert layer.renders_widgets()

    def test_hidden_gui_holds_text_and_widget(self):
        backend = Recorder()
        layer = HudLayer(backend, ComponentConfig(MemoryFile()))
        layer.register('panel', panel_schema({}))
        layer.show('panel', 'text', widget('x', {}))
        layer.set_gui_hidden(True)
        assert backend.calls[-1] == ('delete', 'otmetki.hud.panel')
        layer.show('panel', 'next', widget('x', {'n': 3}))
        layer.set_gui_hidden(False)
        assert backend.calls[-1][0] == 'create' and backend.calls[-1][1]['widget']['data'] == {'n': 3}

    def test_surface_keeps_only_a_dict_widget(self):
        surface = HudSurface()
        surface.create('a', {'text': 't', 'widget': widget('k', {})}, SPACE_BATTLE)
        surface.create('b', {'text': 't', 'widget': 'bad'}, SPACE_BATTLE)
        assert surface.panel('a')['widget']['kind'] == 'k' and surface.panel('b')['widget'] is None


class IconTest(unittest.TestCase):

    def test_class_icons_follow_the_client_file_names(self):
        assert class_icon('AT-SPG') == 'img://gui/maps/icons/vehicleTypes/white/AT-SPG.png|otmetki:class_td'
        assert class_icon('AT-SPG', 'red').startswith('img://gui/maps/icons/vehicleTypes/red/at-spg.png')
        assert class_icon('SPG', 'green').startswith('img://gui/maps/icons/vehicleTypes/green/spg.png')
        assert class_icon('heavyTank', 'gold').startswith('img://gui/maps/icons/vehicleTypes/gold/heavyTank.png')
        assert class_icon('ufo') is None and class_icon('lightTank', 'blue').startswith('img://gui/maps/icons/vehicleTypes/white/')

    def test_shells_from_battle_log_names_codes_and_descriptor_stems(self):
        assert shell_icon('HE_LEGACY_STUN').startswith('img://gui/maps/icons/shell/small/HIGH_EXPLOSIVE_SPG_STUN.png')
        assert shell_icon('ARMOR_PIERCING_CR', premium=True).startswith('img://gui/maps/icons/shell/small/ARMOR_PIERCING_CR_PREMIUM.png')
        assert shell_icon('ARMOR_PIERCING_CR_PREMIUM.png', premium=True, kind='battle_ammo').startswith(
            'img://gui/maps/icons/ammopanel/battle_ammo/ARMOR_PIERCING_CR_PREMIUM.png')
        assert shell_icon_of('heat').startswith('img://gui/maps/icons/shell/small/HOLLOW_CHARGE.png')
        assert shell_icon('bad name') is None and shell_icon_of('smoke') is None and shell_icon(None) is None

    def test_other_client_icons(self):
        assert artefact_icon(('../maps/icons/artefact/largeRepairkit.png',)) == 'img://gui/maps/icons/artefact/largeRepairkit.png'
        assert artefact_icon('rammer') == 'img://gui/maps/icons/artefact/rammer.png' and artefact_icon(None) is None
        assert efficiency_icon('help').startswith('img://gui/maps/icons/library/efficiency/48x48/help.png') and efficiency_icon('x') is None
        assert outcome_icon('pen') == 'otmetki:damage' and outcome_icon('ricochet').endswith('hit_ricochet.png|otmetki:blocked')
        assert mark_icon(5).startswith('img://gui/maps/icons/library/marksOnGun/mark_3.png') and mark_icon(0) is None
        assert flag_icon('ussr') == 'img://gui/maps/icons/flags/25x17/ussr.png' and flag_icon('mars') is None
        assert tier_icon(10) == 'img://gui/maps/icons/levels/tank_level_small_10.png' and tier_icon(12) is None
        assert item_name('..\\x\\y.png') == 'y' and item_name('../..') is None and glyph('fire') == 'otmetki:fire'

    def test_missing_client_files_fall_back_to_our_glyph(self):
        payload = {'rows': [{'icon': class_icon('SPG'), 'shell': artefact_icon('gone'), 'name': 'img'}], 'plain': 'x'}
        resolved = resolve(payload, lambda path: 'vehicleTypes' not in path)
        assert resolved['rows'][0] == {'icon': 'otmetki:class_spg', 'shell': 'img://gui/maps/icons/artefact/gone.png', 'name': 'img'}
        assert resolve(payload, lambda path: False)['rows'][0]['shell'] is None
        assert split('img://a.png|otmetki:b') == ('a.png', 'otmetki:b') and split('otmetki:c') == (None, 'otmetki:c') and split(3) == (None, None)


class StockSuppressionTest(unittest.TestCase):

    def test_suppressed_aliases_never_come_back_while_wanted(self):
        stock = StockSuppression()
        assert stock.want('team_hp', (FRAG_CORRELATION_BAR, 'unknownAlias')) == (frozenset([FRAG_CORRELATION_BAR]), frozenset())
        visible, hidden = stock.filter({FRAG_CORRELATION_BAR, 'minimap'}, set())
        assert visible == {'minimap'} and hidden == {FRAG_CORRELATION_BAR}

    def test_shared_owners_and_release(self):
        stock = StockSuppression()
        stock.want('a', (SIXTH_SENSE,))
        stock.want('b', (SIXTH_SENSE, BATTLE_DAMAGE_LOG_PANEL))
        assert stock.want('a', ()) == (frozenset(), frozenset())
        assert stock.want('b', (SIXTH_SENSE,)) == (frozenset(), frozenset([BATTLE_DAMAGE_LOG_PANEL]))
        assert stock.release_all() == frozenset([SIXTH_SENSE]) and stock.aliases == frozenset()
        assert stock.filter(None, None) == (set(), set())


if __name__ == '__main__':
    unittest.main()
