# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import io
import json
import os
import re
import types
import unittest

import _support  # noqa: F401
from otmetki.companion.config import FEATURES, Config
from otmetki.companion.i18n import STRINGS as COMPANION_STRINGS
from otmetki.core.events import EventBus
from otmetki.core.hud import ComponentConfig, HudLayer, NullBackend
from otmetki.core.i18n import Catalog
from otmetki.core.settings import Schema
from otmetki.core.storage import MemoryFile
from otmetki.ui.bridge import SettingsBridge, site_link, site_url
from otmetki.ui.components import COMPANION_ID, COMPANION_KEYS, FeatureInfo, load_features, root_package
from otmetki.ui.i18n import STRINGS
from otmetki.ui.profiles import ProfileStore
from otmetki.ui.protocol import COMMANDS, encode_state

UI_WEB = os.path.join(_support.MODPACK_DIR, 'ui-web', 'src', 'settings', 'model', 'protocol')
STATE_FIXTURE = os.path.join(UI_WEB, '_tests', 'fixtures', 'state.sample.json')


PANEL_SCHEMA = Schema(
    {'enabled': True, 'x': 10, 'y': 0, 'align_x': 'center', 'align_y': 'top', 'alpha': 100, 'font_size': 14, 'drag': True, 'border': False,
     'lines': 5},
    choices={'align_x': ('left', 'center', 'right'), 'align_y': ('top', 'center', 'bottom')},
    limits={'x': (-4000, 4000), 'y': (-4000, 4000), 'alpha': (0, 100), 'font_size': (8, 48), 'lines': (1, 20)},
)


class RecordingBackend(NullBackend):

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


def settings_module(**attrs):
    module = types.ModuleType(str('fake_settings'))
    module.__dict__.update(attrs)
    return module


class ReplayPage(object):

    def __init__(self):
        self.actions = []

    def ui_actions(self):
        return [{'id': 'refresh', 'label': 'Refresh', 'confirm': None}]

    def ui_page(self):
        return {'kind': 'list', 'empty': 'none', 'rows': [{'id': 'a.mtreplay', 'title': 'A', 'actions': [],
                                                           'details': [{'label': 'Map', 'value': 'Prokhorovka'}]}]}

    def ui_action(self, action, row, value):
        self.actions.append((action, row, value))
        return {'kind': 'info', 'text': 'done'}


class FakeContext(object):

    switch_keys = FEATURES

    def __init__(self):
        self.config = Config({})
        self.saved = 0
        self.bus = EventBus(on_error=self._raise)
        self.catalog = Catalog(COMPANION_STRINGS, STRINGS)
        self.current_language = 'ru'
        self.component_config = ComponentConfig(MemoryFile({'uninstalled': {'enabled': False}}))
        self.backend = RecordingBackend()
        self.layer = HudLayer(self.backend, self.component_config)
        self.profiles = ProfileStore(MemoryFile(), lambda: 1000.0, new_id=self._ids())
        self.events = []
        self.opened = []
        self.bound = []
        self.closed = 0
        self.editing = []
        self.actions = []
        self.refreshed = []
        self.page = ReplayPage()
        self.component_config.section('minimap', Schema({'enabled': True, 'zoom': 'native'}, choices={'zoom': ('native', 'x2')}))
        self.layer.register('damage_log', PANEL_SCHEMA)
        self.bus.on('component_settings', lambda component, changed: self.events.append((component, changed)))
        self.bus.on('hud_edit', lambda active: self.events.append(('hud_edit', active)))
        self.bus.on('hud_describe', lambda collect: collect('damage_log', preview='<font color="#fff">1 200</font>', width=300))

    @staticmethod
    def _raise(context):
        raise AssertionError(context)

    @staticmethod
    def _ids():
        counter = [0]

        def new_id():
            counter[0] += 1
            return 'p%d' % counter[0]
        return new_id

    def save_config(self):
        self.saved += 1

    def language(self):
        return self.current_language

    def features(self):
        return [
            FeatureInfo('marks_panel', settings_module(SETTINGS=('battle_moe_panel',), GROUP='battle')),
            FeatureInfo('session_stats', settings_module(SETTINGS=('hangar_session_panel', 'session_idle_minutes'), GROUP='hangar')),
            FeatureInfo('minimap', settings_module(SETTINGS=(), GROUP='battle')),
            FeatureInfo('replay_manager', settings_module(SETTINGS=()), instance=self.page),
            FeatureInfo('damage_log', settings_module(SETTINGS=('upload_replays',))),
        ]

    def status(self):
        return {'bound': False, 'auth_failed': False, 'account_id': None, 'text': 'not bound'}

    def set_language(self, language):
        self.config.update({'language': language})
        self.current_language = 'en' if language == 'en' else 'ru'

    def config_changed(self, keys):
        self.refreshed.append(keys)

    def companion_action(self, action):
        self.actions.append(action)

    def bind(self, code):
        self.bound.append(code)

    def open_url(self, url):
        self.opened.append(url)

    def close(self):
        self.closed += 1

    def hud_editing(self, active):
        self.editing.append(active)


def send(bridge, **message):
    return bridge.handle(json.dumps(message))


def card(state, component_id):
    return [item for item in state['components'] if item['id'] == component_id][0]


class BridgeStateTest(unittest.TestCase):

    def setUp(self):
        self.context = FakeContext()
        self.bridge = SettingsBridge(self.context)

    def test_cards_in_order_with_their_sources(self):
        state = self.bridge.state()
        ids = [item['id'] for item in state['components']]
        assert ids == [COMPANION_ID, 'marks_panel', 'session_stats', 'minimap', 'replay_manager', 'damage_log']
        assert state['language'] == 'ru' and state['languages'] == ['ru', 'en']
        assert state['site'] == 'https://triotmetki.ru'

    def test_companion_card_lists_its_own_keys_only(self):
        companion = card(self.bridge.state(), COMPANION_ID)
        keys = [field['key'] for field in companion['fields']]
        assert companion['switch'] == {'key': 'enabled', 'value': True}
        assert set(keys) <= set(COMPANION_KEYS)
        assert 'server_url' not in keys and 'bind_code' not in keys and 'hangar_session_panel' not in keys
        assert [action['id'] for action in companion['actions']] == ['settings_export', 'settings_restore']

    def test_config_feature_card_uses_its_switch_and_schema_limits(self):
        session = card(self.bridge.state(), 'session_stats')
        assert session['switch'] == {'key': 'hangar_session_panel', 'value': True}
        idle = session['fields'][0]
        assert idle['key'] == 'session_idle_minutes' and idle['type'] == 'int'
        assert (idle['min'], idle['max']) == (10, 24 * 60)
        assert session['title'] == u'Сессия в ангаре'

    def test_section_card_renders_choices_with_labels(self):
        minimap = card(self.bridge.state(), 'minimap')
        assert minimap['group'] == 'battle'
        zoom = minimap['fields'][0]
        assert zoom['type'] == 'choice'
        assert zoom['choices'][0] == {'value': 'native', 'label': u'Как в игре'}

    def test_panel_card_hides_position_keys(self):
        damage = card(self.bridge.state(), 'damage_log')
        keys = [field['key'] for field in damage['fields']]
        assert damage['panel'] is True
        assert 'x' not in keys and 'align_x' not in keys and 'drag' not in keys
        assert 'lines' in keys and 'alpha' in keys and 'enabled' not in keys
        assert damage['switch'] == {'key': 'upload_replays', 'value': False}

    def test_page_and_actions_come_from_the_instance(self):
        replays = card(self.bridge.state(), 'replay_manager')
        assert replays['page']['kind'] == 'list'
        assert replays['actions'][0]['id'] == 'refresh'

    def test_hud_panels_carry_the_preview_without_markup(self):
        panels = self.bridge.state()['hud']['panels']
        assert panels[0]['id'] == 'damage_log'
        assert panels[0]['preview'] == '1 200'
        assert (panels[0]['width'], panels[0]['height'], panels[0]['x']) == (300, 40, 10)


class BridgeMessageTest(unittest.TestCase):

    def setUp(self):
        self.context = FakeContext()
        self.bridge = SettingsBridge(self.context)

    def test_set_a_companion_switch(self):
        send(self.bridge, type='set', component=COMPANION_ID, key='send_shots', value=False)
        assert self.context.config.get('send_shots') is False
        assert self.context.saved == 1
        assert self.context.events == [(COMPANION_ID, ['send_shots'])]
        assert self.context.refreshed == [['send_shots']]

    def test_set_a_section_value_through_its_schema(self):
        send(self.bridge, type='set', component='minimap', key='zoom', value='x2')
        assert self.context.component_config.get('minimap').get('zoom') == 'x2'
        send(self.bridge, type='set', component='minimap', key='zoom', value='x99')
        assert self.bridge.notice['kind'] == 'error'
        assert self.context.component_config.get('minimap').get('zoom') == 'x2'

    def test_panel_switch_lives_in_config(self):
        send(self.bridge, type='set', component='damage_log', key='upload_replays', value=True)
        assert self.context.config.get('upload_replays') is True
        assert self.context.refreshed == [['upload_replays']]

    def test_keys_outside_the_card_are_refused(self):
        send(self.bridge, type='set', component=COMPANION_ID, key='server_url', value='https://evil.example')
        assert self.context.config.get('server_url') == 'https://api.triotmetki.ru'
        assert self.bridge.notice['kind'] == 'error'
        send(self.bridge, type='set', component='damage_log', key='x', value=5)
        assert self.context.component_config.get('damage_log').get('x') == 10

    def test_bad_messages_become_notices(self):
        for raw in ('not json', '[]', json.dumps({'type': 'nope'}), json.dumps({'type': 'set'}), 42):
            assert self.bridge.handle(raw) is True
            assert self.bridge.notice['kind'] == 'error', raw

    def test_actions(self):
        send(self.bridge, type='action', component=COMPANION_ID, action='settings_export')
        assert self.context.actions == ['settings_export']
        send(self.bridge, type='action', component='replay_manager', action='rename', row='a.mtreplay', value='B')
        assert self.context.page.actions == [('rename', 'a.mtreplay', 'B')]
        assert self.bridge.notice == {'kind': 'info', 'text': 'done', 'code': None}
        send(self.bridge, type='action', component='minimap', action='rename')
        assert self.bridge.notice['kind'] == 'error'

    def test_language_bind_close(self):
        send(self.bridge, type='language', language='en')
        assert self.bridge.state()['language'] == 'en'
        send(self.bridge, type='language', language='de')
        assert self.bridge.notice['kind'] == 'error'
        send(self.bridge, type='bind', code='  ABCDEFGH23 ')
        assert self.context.bound == ['ABCDEFGH23']
        send(self.bridge, type='close')
        assert self.context.closed == 1

    def test_only_site_relative_links_open(self):
        send(self.bridge, type='open', path='/replays/7b0c')
        assert self.context.opened == ['https://triotmetki.ru/replays/7b0c']
        for path in ('https://evil.example', '//evil.example/x', 'javascript:alert(1)', '/a b'):
            send(self.bridge, type='open', path=path)
        assert self.context.opened == ['https://triotmetki.ru/replays/7b0c']

    def test_hud_move_is_live_and_clamped(self):
        self.context.layer.show('damage_log', 'text')
        send(self.bridge, type='hud_move', panel='damage_log', x=120.6, y=99999, align_x='right')
        section = self.context.component_config.get('damage_log')
        assert (section.get('x'), section.get('y'), section.get('align_x')) == (121, 4000, 'right')
        assert self.context.backend.calls[-1][0] == 'update'
        assert self.context.events[-1] == ('damage_log', ['align_x', 'x', 'y'])
        send(self.bridge, type='hud_reset', panel='damage_log')
        assert (section.get('x'), section.get('align_x')) == (10, 'center')

    def test_hud_edit_mode_on_the_bus(self):
        send(self.bridge, type='hud_edit', active=True)
        send(self.bridge, type='hud_edit', active=True)
        send(self.bridge, type='close')
        assert self.context.events == [('hud_edit', True), ('hud_edit', False)]
        assert self.context.editing == [True]


class BridgeProfilesTest(unittest.TestCase):

    def setUp(self):
        self.context = FakeContext()
        self.bridge = SettingsBridge(self.context)

    def test_save_change_load(self):
        send(self.bridge, type='profile_save', name='  Streamer   setup ')
        profiles = self.bridge.state()['profiles']
        assert profiles == {'active': 'p1', 'items': [{'id': 'p1', 'name': 'Streamer setup', 'updated': 1000.0}]}
        send(self.bridge, type='set', component=COMPANION_ID, key='send_shots', value=False)
        send(self.bridge, type='set', component='minimap', key='zoom', value='x2')
        send(self.bridge, type='hud_move', panel='damage_log', x=50, y=60)
        del self.context.events[:]
        send(self.bridge, type='profile_load', id='p1')
        assert self.context.config.get('send_shots') is True
        assert self.context.component_config.get('minimap').get('zoom') == 'native'
        assert self.context.component_config.get('damage_log').get('x') == 10
        assert sorted(event[0] for event in self.context.events) == ['config', 'damage_log', 'minimap']

    def test_profile_never_carries_the_connection(self):
        send(self.bridge, type='profile_save', name='A')
        data = self.context.profiles.get('p1')['data']
        assert 'server_url' not in data['config'] and 'bind_code' not in data['config']
        assert data['components']['uninstalled'] == {'enabled': False}

    def test_rename_delete_limit(self):
        send(self.bridge, type='profile_save', name='A')
        send(self.bridge, type='profile_rename', id='p1', name='B')
        assert self.context.profiles.get('p1')['name'] == 'B'
        send(self.bridge, type='profile_rename', id='p1', name='   ')
        assert self.bridge.notice['kind'] == 'error'
        for index in range(11):
            send(self.bridge, type='profile_save', name='N%d' % index)
        send(self.bridge, type='profile_save', name='too many')
        assert self.bridge.notice['text'] == STRINGS['ru']['error_profile_limit']
        send(self.bridge, type='profile_delete', id='p1')
        assert self.context.profiles.get('p1') is None and len(self.context.profiles.items()) == 11

    def test_export_import_round_trip(self):
        send(self.bridge, type='set', component='minimap', key='zoom', value='x2')
        send(self.bridge, type='profile_save', name=u'Мой')
        send(self.bridge, type='profile_export', id='p1')
        code = self.bridge.notice['code']
        assert self.bridge.notice['kind'] == 'code' and code.startswith('TM1.')
        send(self.bridge, type='profile_import', code=code)
        imported = self.context.profiles.get('p2')
        assert imported['name'] == u'Мой'
        assert imported['data']['components']['minimap']['zoom'] == 'x2'
        send(self.bridge, type='profile_import', code='TM1.garbage')
        assert self.bridge.notice['kind'] == 'error'


class DiscoveryAndLinksTest(unittest.TestCase):

    def test_root_package(self):
        assert root_package('gui.mods.otmetki.ui.client.context') == 'gui.mods.otmetki'
        assert root_package('otmetki.ui.client.context') == 'otmetki'

    def test_load_features_reads_settings_modules(self):
        features = load_features('otmetki', {'ui': object(), 'session_stats': object(), 'missing_one': object()}, skip=('ui',))
        assert [feature.id for feature in features] == ['missing_one', 'session_stats']
        assert features[0].settings_module is None
        assert features[1].config_keys() == ('hangar_session_panel', 'session_idle_minutes')
        assert features[1].title == 'Three Marks: session stats'

    def test_site_url(self):
        assert site_url('https://api.triotmetki.ru') == 'https://triotmetki.ru'
        assert site_url('http://localhost:4000') == 'http://localhost:3000'
        assert site_url('https://other.example') == 'https://triotmetki.ru'
        assert site_link('https://api.triotmetki.ru', '/profile/mod?tab=replays') == 'https://triotmetki.ru/profile/mod?tab=replays'
        assert site_link('https://api.triotmetki.ru', 'relative') is None

    def test_companion_keys_are_real_and_unclaimed(self):
        from otmetki.companion.config import DEFAULTS
        import importlib
        claimed = set()
        for feature_id in _support.feature_ids():
            try:
                claimed.update(getattr(importlib.import_module('otmetki.features.%s.settings' % feature_id), 'SETTINGS', ()))
            except ImportError:
                continue
        for key in COMPANION_KEYS:
            assert key in DEFAULTS and key not in claimed, key


class PageContractTest(unittest.TestCase):

    def sample_state(self):
        context = FakeContext()
        bridge = SettingsBridge(context)
        send(bridge, type='profile_save', name=u'Стример')
        return json.loads(encode_state(bridge.state()))

    def test_state_fixture_is_current(self):
        state = self.sample_state()
        if os.environ.get('OTMETKI_UPDATE_FIXTURES') == '1':
            with io.open(STATE_FIXTURE, 'w', encoding='utf-8', newline='\n') as handle:
                handle.write(json.dumps(state, sort_keys=True, indent=2, ensure_ascii=False) + '\n')
        with io.open(STATE_FIXTURE, 'r', encoding='utf-8') as handle:
            assert json.load(handle) == state

    def test_commands_match_the_page(self):
        with io.open(os.path.join(UI_WEB, 'protocol.constants.ts'), 'r', encoding='utf-8') as handle:
            source = handle.read()
        block = re.search(r'commands: \[([^\]]*)\]', source).group(1)
        assert tuple(re.findall(r"'([a-z_]+)'", block)) == COMMANDS


if __name__ == '__main__':
    unittest.main()
