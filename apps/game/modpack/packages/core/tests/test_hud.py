# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.core.events import EventBus
from otmetki.core.hud.modifier import is_held, modifier_keys
from otmetki.core.hud.panel import moved_values
from otmetki.core.hud import (EVENT_DESCRIBE, EVENT_EDIT, ComponentConfig, HudBackend, HudLayer, HudPreview, NullBackend, alias_of,
                              component_schema, hex_color, layout_props, matching, max_length, panel_schema)
from otmetki.core.templates import format_value, render
from otmetki.core.settings import Settings
from otmetki.core.shells import shell_code, shell_name
from otmetki.core.storage import MemoryFile


class FakeBackend(HudBackend):

    name = 'fake'

    def __init__(self, available=True):
        self.is_available = available
        self.labels = {}
        self.calls = []
        self.on_moved = None

    def available(self):
        return self.is_available

    def create(self, alias, props):
        self.calls.append(('create', alias))
        self.labels[alias] = dict(props)
        return True

    def update(self, alias, props):
        self.calls.append(('update', alias))
        self.labels[alias].update(props)
        return True

    def delete(self, alias):
        self.calls.append(('delete', alias))
        del self.labels[alias]
        return True

    def listen(self, on_moved):
        self.on_moved = on_moved


SCHEMA = panel_schema({'x': 10, 'style': 'a', 'template': ''}, choices={'style': ('a', 'b')}, normalizers={'template': max_length(5)})


class TemplateTest(unittest.TestCase):

    def test_render(self):
        assert render('{dealt} / {blocked}', {'dealt': 2150, 'blocked': 0}) == '2 150 / 0'
        assert render('{name}: {{literal}}', {'name': 'T-34'}) == 'T-34: {literal}}'
        assert render('{typo} {dealt}', {'dealt': 1}) == '{typo} 1'
        assert render('{a}{b}', {'a': None, 'b': True}) == '1'
        assert render(None, {}) == ''
        assert render('50% {x} $x ${x}', {'x': 3}) == '50% 3 $x $3'

    def test_format_value(self):
        assert format_value(1234567) == '1 234 567'
        assert format_value(False) == ''
        assert format_value('ББ') == 'ББ'


class PanelSchemaTest(unittest.TestCase):

    def test_panel_schema_merges_layout_keys(self):
        settings = Settings({'x': 99999, 'align_x': 'middle', 'alpha': 50, 'style': 'c', 'template': '1234567'}, SCHEMA)
        assert settings.get('x') == 4000
        assert settings.get('align_x') == 'center'
        assert settings.get('style') == 'a'
        assert settings.get('template') == '12345'
        assert 'enabled' not in settings.to_dict()
        props = layout_props(settings)
        assert props == {'x': 4000, 'y': 0, 'alignX': 'center', 'alignY': 'top', 'alpha': 0.5, 'drag': True, 'border': False, 'scale': 1.0}

    def test_normalizers(self):
        assert hex_color('#a0b1c2') == '#A0B1C2'
        assert hex_color('red') is None
        import re
        sound = matching(re.compile(r'^[a-z_]*$'), 5)
        assert sound('ab_c') == 'ab_c'
        assert sound('abcdef') is None
        assert sound('a-b') is None

    def test_component_schema_has_no_switch(self):
        schema = component_schema({'colored': True})
        assert schema.defaults == {'colored': True}


class ComponentConfigTest(unittest.TestCase):

    def test_sections_are_validated_and_saved(self):
        store = MemoryFile({'damage_log': {'x': 'bad', 'style': 'b'}, 'uninstalled': {'x': 1}, 'broken': 5})
        config = ComponentConfig(store)
        settings = config.section('damage_log', SCHEMA)
        assert settings.get('x') == 10
        assert settings.get('style') == 'b'
        assert config.section('damage_log', SCHEMA) is settings
        saved = store.read()
        assert saved['damage_log']['x'] == 10
        assert saved['uninstalled'] == {'x': 1}
        assert config.update('damage_log', {'y': 7, 'unknown': 1}) == ['y']
        assert store.read()['damage_log']['y'] == 7
        assert config.update('nothing', {'y': 1}) == []

    def test_unreadable_file(self):
        store = MemoryFile([1, 2])
        config = ComponentConfig(store)
        config.section('p', SCHEMA)
        assert list(store.read()) == ['p']


class HudLayerTest(unittest.TestCase):

    def setUp(self):
        self.backend = FakeBackend()
        self.store = MemoryFile()
        self.layer = HudLayer(self.backend, ComponentConfig(self.store))
        self.layer.register('damage_log', SCHEMA)

    def test_show_update_hide(self):
        alias = alias_of('damage_log')
        assert self.layer.show('damage_log', 'one')
        assert self.backend.labels[alias]['text'] == 'one'
        assert self.backend.labels[alias]['x'] == 10
        assert self.layer.show('damage_log', 'two')
        assert self.backend.calls == [('create', alias), ('update', alias)]
        assert self.backend.labels[alias]['text'] == 'two'
        self.layer.hide('damage_log')
        self.layer.hide('damage_log')
        assert alias not in self.backend.labels
        assert not self.layer.show('unknown', 'x')

    def test_without_renderer(self):
        layer = HudLayer(None, ComponentConfig(MemoryFile()))
        layer.register('p', SCHEMA)
        assert isinstance(layer.backend, NullBackend)
        assert not layer.has_panels
        assert not layer.show('p', 'text')
        self.backend.is_available = False
        assert not self.layer.show('damage_log', 'text')

    def test_drag_persists_position(self):
        self.layer.show('damage_log', 'text')
        assert self.backend.on_moved(alias_of('damage_log'), {'x': 120.4, 'y': -33, 'text': 'ignored'})
        assert self.store.read()['damage_log']['x'] == 120
        assert self.store.read()['damage_log']['y'] == -33
        assert not self.backend.on_moved(alias_of('other'), {'x': 1})
        assert not self.backend.on_moved('someone.else', {'x': 1})
        assert not self.backend.on_moved(alias_of('damage_log'), None)

    def test_a_panel_still_at_an_old_default_place_moves_to_the_new_one(self):
        schema = panel_schema({'x': 372, 'y': 60, 'align_x': 'left'}, retired=((208, 8, 'left', 'top'),))
        store = MemoryFile({'old': {'x': 208, 'y': 8, 'align_x': 'left', 'align_y': 'top'},
                            'moved': {'x': 500, 'y': 8, 'align_x': 'left', 'align_y': 'top'}})
        layer = HudLayer(FakeBackend(), ComponentConfig(store))
        assert layer.register('old', schema).get('x') == 372 and store.read()['old']['y'] == 60
        assert layer.register('moved', schema).get('x') == 500

    def test_a_pinned_panel_keeps_its_default_place_and_takes_no_drag(self):
        alias = alias_of('strip')
        schema = panel_schema({'y': 0, 'pinned': True}, retired=((0, 58, 'center', 'top'),))
        self.store.write({'strip': {'y': 58, 'x': 40, 'pinned': True}})
        layer = HudLayer(self.backend, ComponentConfig(self.store))
        layer.register('strip', schema)
        layer.show('strip', 'hp')
        assert (self.backend.labels[alias]['x'], self.backend.labels[alias]['y'], self.backend.labels[alias]['drag']) == (0, 0, False)
        assert not self.backend.on_moved(alias, {'x': 300, 'y': 90})
        layer.update_settings('strip', {'pinned': False})
        assert (self.backend.labels[alias]['x'], self.backend.labels[alias]['drag']) == (40, True)

    def test_update_settings_moves_a_shown_panel(self):
        alias = alias_of('damage_log')
        self.layer.show('damage_log', 'text')
        assert self.layer.update_settings('damage_log', {'align_x': 'right', 'style': 'b'}) == ['align_x', 'style']
        assert self.backend.labels[alias]['alignX'] == 'right'
        self.layer.hide_all()
        assert self.backend.labels == {}

    def test_muted_and_blocked_panels_come_back_with_their_latest_text(self):
        alias = alias_of('damage_log')
        self.layer.register('session', SCHEMA)
        self.layer.show('damage_log', 'one')
        self.layer.set_muted(True)
        assert self.backend.labels == {}
        assert self.layer.show('damage_log', 'two') and self.layer.show('session', 'mine')
        assert self.backend.labels == {}
        self.layer.set_blocked(['session'])
        self.layer.set_muted(False)
        assert self.backend.labels[alias]['text'] == 'two' and alias_of('session') not in self.backend.labels
        self.layer.hide('session')
        self.layer.set_blocked([])
        assert alias_of('session') not in self.backend.labels
        self.layer.set_blocked(['damage_log'])
        assert alias not in self.backend.labels
        self.layer.set_blocked([])
        assert self.backend.labels[alias]['text'] == 'two'


class HudPreviewTest(unittest.TestCase):

    def setUp(self):
        self.backend = FakeBackend()
        self.layer = HudLayer(self.backend, ComponentConfig(MemoryFile()))
        self.layer.register('damage_log', SCHEMA)
        self.bus = EventBus()
        self.state = {'enabled': True, 'hangar': True}
        self.preview = HudPreview(self.layer, 'damage_log', lambda: u'<font color="#FFFFFF">390</font>', lambda: self.state['enabled'],
                                  lambda: self.state['hangar'], (260, 120)).attach(self.bus)
        self.alias = alias_of('damage_log')

    def test_edit_mode_shows_and_hides_the_preview(self):
        self.bus.emit(EVENT_EDIT, True)
        assert self.backend.labels[self.alias]['text'] == u'<font color="#FFFFFF">390</font>'
        assert self.preview.previewing
        self.bus.emit(EVENT_EDIT, False)
        assert self.alias not in self.backend.labels
        assert not self.preview.previewing

    def test_switched_off_or_in_battle_shows_nothing(self):
        self.state['enabled'] = False
        self.bus.emit(EVENT_EDIT, True)
        assert self.alias not in self.backend.labels
        self.state.update({'enabled': True, 'hangar': False})
        self.bus.emit(EVENT_EDIT, True)
        assert self.alias not in self.backend.labels

    def test_leaving_edit_mode_keeps_a_real_panel(self):
        self.layer.show('damage_log', 'real')
        self.bus.emit(EVENT_EDIT, False)
        assert self.backend.labels[self.alias]['text'] == 'real'

    def test_end_hides_only_a_preview(self):
        self.bus.emit(EVENT_EDIT, True)
        self.preview.end()
        assert self.alias not in self.backend.labels
        self.bus.emit(EVENT_EDIT, False)
        assert self.backend.calls.count(('delete', self.alias)) == 1

    def test_describe(self):
        found = []
        self.bus.emit(EVENT_DESCRIBE, lambda *args: found.append(args))
        assert found == [('damage_log', u'<font color="#FFFFFF">390</font>', 260, 120, True)]

    def test_without_renderer_nothing_is_previewing(self):
        layer = HudLayer(FakeBackend(available=False), ComponentConfig(MemoryFile()))
        layer.register('damage_log', SCHEMA)
        preview = HudPreview(layer, 'damage_log', lambda: 'x')
        preview.on_edit(True)
        assert not preview.previewing


class ModifierTest(unittest.TestCase):

    def test_alt_is_the_default_and_either_side_counts(self):
        assert modifier_keys('unknown') == modifier_keys('alt')
        assert is_held('alt', lambda key: key == 'KEY_RALT')
        assert not is_held('alt', lambda key: key == 'KEY_LCONTROL')

    def test_ctrl_alt_needs_both_groups(self):
        assert not is_held('ctrl_alt', lambda key: key == 'KEY_LALT')
        assert is_held('ctrl_alt', lambda key: key in ('KEY_LALT', 'KEY_RCONTROL'))

    def test_moved_values_map_renderer_props_to_settings(self):
        assert moved_values({'x': 1.6, 'y': -2, 'alignX': 'right', 'alignY': 'bottom', 'scale': 1.25}) == {
            'x': 2, 'y': -2, 'align_x': 'right', 'align_y': 'bottom', 'scale': 125}
        assert moved_values({'x': True, 'scale': 'big'}) == {}


class ShellTest(unittest.TestCase):

    def test_codes(self):
        class Member(object):
            name = 'ARMOR_PIERCING_CR'
        assert shell_code(Member()) == 'apcr'
        assert shell_code('hollow_charge') == 'heat'
        assert shell_code(5) == 'he'
        assert shell_code(None) is None
        assert shell_code(99) is None
        assert shell_name(1) == 'ARMOR_PIERCING'


if __name__ == '__main__':
    unittest.main()
