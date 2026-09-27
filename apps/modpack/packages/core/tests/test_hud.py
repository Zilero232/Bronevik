# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.core.hud import (ComponentConfig, HudBackend, HudLayer, NullBackend, alias_of, component_schema, format_value, hex_color,
                              layout_props, matching, max_length, panel_schema, render)
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
        assert props == {'x': 4000, 'y': 0, 'alignX': 'center', 'alignY': 'top', 'alpha': 0.5, 'drag': True, 'border': False}

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

    def test_update_settings_moves_a_shown_panel(self):
        alias = alias_of('damage_log')
        self.layer.show('damage_log', 'text')
        assert self.layer.update_settings('damage_log', {'align_x': 'right', 'style': 'b'}) == ['align_x', 'style']
        assert self.backend.labels[alias]['alignX'] == 'right'
        self.layer.hide_all()
        assert self.backend.labels == {}


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
