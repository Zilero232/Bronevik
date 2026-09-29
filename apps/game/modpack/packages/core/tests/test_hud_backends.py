# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import io
import json
import os
import re
import unittest

import _support
from otmetki.core.hud import BackendChain, ComponentConfig, HudBackend, HudLayer, HudSurface, NullBackend, alias_of, panel_schema
from otmetki.core.hud.surface import HUD_COMMANDS, HUD_PROTOCOL_VERSION, SPACE_BATTLE, SPACE_LOBBY, decode_hud_message
from otmetki.core.storage import MemoryFile

HUD_PROTOCOL_DIR = os.path.join(_support.MODPACK_DIR, 'ui-web', 'src', 'shared', 'api', 'hud-protocol')
HUD_STATE_FIXTURE = os.path.join(HUD_PROTOCOL_DIR, '_tests', 'fixtures', 'hud-state.sample.json')


class Recorder(HudBackend):

    def __init__(self, name, available=True):
        self.name = name
        self.is_available = available
        self.labels = {}
        self.calls = []
        self.listeners = []

    def available(self):
        return self.is_available

    def create(self, alias, props):
        self.calls.append(('create', alias))
        self.labels[alias] = dict(props)
        return True

    def update(self, alias, props):
        self.calls.append(('update', alias, dict(props)))
        self.labels[alias].update(props)
        return True

    def delete(self, alias):
        self.calls.append(('delete', alias))
        del self.labels[alias]
        return True

    def listen(self, on_moved):
        self.listeners.append(on_moved)


class BackendChainTest(unittest.TestCase):

    def setUp(self):
        self.gameface = Recorder('gameface')
        self.guiflash = Recorder('guiflash')
        self.chain = BackendChain([self.gameface, self.guiflash])

    def test_first_available_wins(self):
        assert self.chain.name == 'gameface'
        assert self.chain.create('a', {'text': '1'})
        assert 'a' in self.gameface.labels and self.guiflash.labels == {}
        self.gameface.is_available = False
        assert self.chain.name == 'guiflash'
        assert self.chain.create('b', {'text': '2'})
        assert 'b' in self.guiflash.labels

    def test_a_label_stays_with_its_backend(self):
        self.chain.create('a', {'text': '1'})
        self.gameface.is_available = False
        assert self.chain.update('a', {'text': '2'})
        assert self.gameface.labels['a']['text'] == '2'
        assert self.chain.delete('a')
        assert not self.chain.delete('a')
        assert not self.chain.update('a', {})

    def test_none_available(self):
        self.gameface.is_available = self.guiflash.is_available = False
        assert not self.chain.available()
        assert self.chain.name == NullBackend.name
        assert not self.chain.create('a', {})
        assert BackendChain([]).names == [] and not BackendChain([]).available()

    def test_listen_reaches_every_backend(self):
        seen = []
        self.chain.listen(lambda alias, props: seen.append(alias))
        self.gameface.listeners[0]('x', {})
        self.guiflash.listeners[0]('y', {})
        assert seen == ['x', 'y'] and self.chain.names == ['gameface', 'guiflash']


class LayerTest(unittest.TestCase):

    def setUp(self):
        self.backend = Recorder('fake')
        self.store = MemoryFile()
        self.layer = HudLayer(self.backend, ComponentConfig(self.store))
        self.layer.register('panel', panel_schema({'x': 5}))
        self.alias = alias_of('panel')

    def test_unchanged_text_is_not_sent_again(self):
        self.layer.show('panel', 'one')
        self.layer.show('panel', 'one')
        self.layer.show('panel', 'two')
        self.layer.hide('panel')
        self.layer.show('panel', 'two')
        assert [call[0] for call in self.backend.calls] == ['create', 'update', 'delete', 'create']

    def test_place_is_transient(self):
        assert not self.layer.place('panel', 1, 2)
        self.layer.show('panel', 'mark')
        assert self.layer.place('panel', 10.4, -3)
        assert self.layer.place('panel', 10, -3)
        assert self.backend.calls[1:] == [('update', self.alias, {'x': 10, 'y': -3})]
        assert self.store.read()['panel']['x'] == 5
        assert not self.layer.place('panel', None, 1)
        self.layer.update_settings('panel', {'align_x': 'left'})
        assert self.layer.place('panel', 10, -3)
        assert self.backend.calls[-1] == ('update', self.alias, {'x': 10, 'y': -3})

    def test_drag_saves_the_anchor(self):
        self.layer.show('panel', 'text')
        assert self.backend.listeners[0](self.alias, {'x': 7, 'y': 8, 'alignX': 'right', 'alignY': 'bottom'})
        saved = self.store.read()['panel']
        assert (saved['x'], saved['y'], saved['align_x'], saved['align_y']) == (7, 8, 'right', 'bottom')
        assert not self.backend.listeners[0](self.alias, {'x': True, 'alignX': 'middle'})
        assert self.backend.listeners[0](self.alias, {'scale': 1.5})
        assert self.store.read()['panel']['scale'] == 150
        assert self.layer.backend_name == 'fake'


class SurfaceTest(unittest.TestCase):

    def setUp(self):
        self.surface = HudSurface()
        self.surface.create('otmetki.hud.damage_log', {'text': u'<font color="#F2EAD3">урон 1 200</font>', 'x': 20, 'y': -140,
                                                       'alignX': 'left', 'alignY': 'bottom', 'alpha': 0.9, 'drag': True,
                                                       'border': False, 'visible': True}, SPACE_BATTLE)
        self.surface.create('otmetki.hangar_info', {'text': '12:00', 'x': -10, 'y': 4, 'alignX': 'right', 'alignY': 'top'}, SPACE_LOBBY)

    def test_state_per_space(self):
        state = self.surface.state(SPACE_BATTLE, False)
        assert state['v'] == HUD_PROTOCOL_VERSION and state['cursor'] is False and state['edit'] is False
        assert [panel['id'] for panel in state['panels']] == ['otmetki.hud.damage_log']
        lobby = self.surface.state(SPACE_LOBBY, True)['panels'][0]
        assert lobby == {'id': 'otmetki.hangar_info', 'text': '12:00', 'x': -10, 'y': 4, 'align_x': 'right', 'align_y': 'top', 'alpha': 1.0,
                         'drag': False, 'border': False, 'visible': True, 'scale': 1.0, 'kind': 'label', 'widget': None}
        assert self.surface.state(SPACE_LOBBY, False, True)['edit'] is False
        assert self.surface.state(SPACE_LOBBY, True, True)['edit'] is True
        assert json.loads(self.surface.encode(SPACE_BATTLE, True))['panels'][0]['text'].endswith(u'урон 1 200</font>')

    def test_update_and_delete(self):
        assert self.surface.update('otmetki.hangar_info', {'text': '12:01', 'x': None})
        assert self.surface.panel('otmetki.hangar_info')['text'] == '12:01'
        assert self.surface.panel('otmetki.hangar_info')['x'] == 0
        assert not self.surface.update('missing', {})
        assert self.surface.delete('otmetki.hangar_info') and not self.surface.delete('otmetki.hangar_info')
        assert self.surface.aliases(SPACE_LOBBY) == []

    def test_messages(self):
        assert decode_hud_message('{"type": "ready"}') == ('ready', {})
        moved = self.surface.handle(json.dumps({'type': 'moved', 'id': 'otmetki.hud.damage_log', 'x': 30.6, 'y': 99999, 'align_x': 'center',
                                                'align_y': 'middle'}))
        assert moved == ('moved', {'id': 'otmetki.hud.damage_log', 'x': 31, 'y': 4000, 'alignX': 'center'})
        assert self.surface.panel('otmetki.hud.damage_log')['align_x'] == 'center'
        for raw in (None, 'not json', '[]', '{"type": "close"}', '{"type": "moved", "id": "x", "x": 1}',
                    '{"type": "moved", "id": 5, "x": 1, "y": 2}', '{"type": "moved", "id": "x", "x": true, "y": 2}', 'x' * 5000):
            assert decode_hud_message(raw) is None, raw
        assert self.surface.handle('{"type": "moved", "id": "unknown", "x": 1, "y": 2}') is None
        resized = self.surface.handle(json.dumps({'type': 'resized', 'id': 'otmetki.hud.damage_log', 'scale': 9}))
        assert resized == ('resized', {'id': 'otmetki.hud.damage_log', 'scale': 3.0})
        assert self.surface.panel('otmetki.hud.damage_log')['scale'] == 3.0
        assert self.surface.handle(json.dumps({'type': 'pressed', 'id': 'otmetki.hangar_info'})) == ('pressed', {'id': 'otmetki.hangar_info'})
        for raw in ('{"type": "resized", "id": "x", "scale": "big"}', '{"type": "pressed"}'):
            assert decode_hud_message(raw) is None, raw

    def test_state_fixture_is_current(self):
        state = self.surface.state(SPACE_BATTLE, True, True)
        if os.environ.get('OTMETKI_UPDATE_FIXTURES') == '1':
            with io.open(HUD_STATE_FIXTURE, 'w', encoding='utf-8', newline='\n') as handle:
                handle.write(json.dumps(state, sort_keys=True, indent=2, ensure_ascii=False) + '\n')
        with io.open(HUD_STATE_FIXTURE, 'r', encoding='utf-8') as handle:
            assert json.load(handle) == state

    def test_commands_match_the_page(self):
        with io.open(os.path.join(HUD_PROTOCOL_DIR, 'hud-protocol.constants.ts'), 'r', encoding='utf-8') as handle:
            source = handle.read()
        block = re.search(r'commands: \[([^\]]*)\]', source).group(1)
        assert tuple(re.findall(r"'([a-z_]+)'", block)) == HUD_COMMANDS
        assert re.search(r'version: (\d+)', source).group(1) == str(HUD_PROTOCOL_VERSION)


if __name__ == '__main__':
    unittest.main()
