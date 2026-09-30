# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import importlib
import sys
import types
import unittest

import _support  # noqa: F401
from otmetki.core.hud.panel import dock_layout

CLIENT_PREFIX = 'otmetki.core.client'


def load_ui():
    saved = sys.modules.get('BigWorld')
    sys.modules['BigWorld'] = types.ModuleType(str('BigWorld'))
    try:
        return importlib.import_module('otmetki.core.client.ui').Ui
    finally:
        if saved is None:
            sys.modules.pop('BigWorld', None)
        else:
            sys.modules['BigWorld'] = saved
        for name in [name for name in sys.modules if name.startswith(CLIENT_PREFIX)]:
            del sys.modules[name]


class Backend(object):

    def __init__(self):
        self.calls = []

    def available(self):
        return True

    def draws_buttons(self):
        return True

    def listen(self, callback):
        self.moved = callback

    def listen_press(self, callback):
        self.pressed = callback

    def create(self, alias, props):
        self.calls.append(('create', alias, dict(props)))
        return True

    def update(self, alias, props):
        self.calls.append(('update', alias, dict(props)))
        return True

    def delete(self, alias):
        self.calls.append(('delete', alias))
        return True


class Watch(object):

    def __init__(self):
        self.listeners = []

    def listen(self, callback):
        self.listeners.append(callback)
        callback(True)

    def change(self, visible):
        for listener in self.listeners:
            listener(visible)


class UiContextTest(unittest.TestCase):

    def setUp(self):
        self.backend = Backend()
        self.watch = Watch()
        self.ui = load_ui()(self.backend, self.watch)

    def test_labels_and_the_button_hide_off_the_plain_hangar_and_come_back(self):
        self.ui.show('otmetki.session', u'text', dock_layout('hangar_right'), widget={'kind': 'card'})
        self.ui.button('otmetki.ui.button', {'x': 1, 'y': 2}, lambda: None)
        self.watch.change(False)
        hidden = sorted(call[1] for call in self.backend.calls if call[0] == 'update' and call[2] == {'visible': False})
        assert hidden == ['otmetki.session', 'otmetki.ui.button']
        self.ui.show('otmetki.session', u'new', dock_layout('hangar_right'))
        assert self.backend.calls[-1][2]['visible'] is False
        self.watch.change(True)
        assert sorted(call[1] for call in self.backend.calls[-2:] if call[2] == {'visible': True}) == ['otmetki.session', 'otmetki.ui.button']

    def test_a_new_label_off_the_hangar_is_created_hidden(self):
        self.watch.listen(lambda visible: None)
        self.ui.show('otmetki.a', u'', {'x': 0, 'y': 0})
        self.watch.change(False)
        self.ui.show('otmetki.b', u'text', {'x': 0, 'y': 0})
        assert self.backend.calls[-1][0] == 'create' and self.backend.calls[-1][2]['visible'] is False

    def test_a_label_carries_its_widget_and_dock_and_leaves_the_column_when_moved(self):
        moved = []
        self.ui.show('otmetki.personal_missions', u'text', dock_layout('hangar_right'), moved.append, {'kind': 'card'})
        props = self.backend.calls[0][2]
        assert props['widget'] == {'kind': 'card'} and props['dock'] == {'group': 'hangar_right', 'order': 2, 'reserve': 190}
        self.backend.moved('otmetki.personal_missions', {'x': 5, 'y': 6})
        assert moved == [{'x': 5, 'y': 6}] and self.backend.calls[-1] == ('update', 'otmetki.personal_missions', {'dock': None})

    def test_muted_labels_come_back_with_their_widget(self):
        self.ui.show('otmetki.a', u'text', {'x': 0, 'y': 0}, widget={'kind': 'card'})
        self.ui.set_muted(True)
        self.ui.set_muted(False)
        assert self.backend.calls[-1][0] == 'create' and self.backend.calls[-1][2]['widget'] == {'kind': 'card'}


if __name__ == '__main__':
    unittest.main()
