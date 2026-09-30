# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.core.hud import EVENT_RESET_LAYOUT, HangarLabel
from otmetki.core.hud.label import hangar_places

LAYOUT = {'x': 1, 'y': 2, 'alignX': 'left', 'alignY': 'top'}
DRAGGED_LAYOUT = {'x': 40, 'y': -50, 'alignX': 'right', 'alignY': 'bottom'}
SAVED_PLACE = {'x': 40, 'y': -50, 'align_x': 'right', 'align_y': 'bottom', 'scale': 150}


class Ui(object):

    def __init__(self, draws=True):
        self.draws = draws
        self.calls = []

    def show(self, alias, text, layout, on_moved=None, widget=None):
        self.calls.append(('show', alias, text, on_moved, layout, widget))
        return self.draws

    def hide(self, alias):
        self.calls.append(('hide', alias))

    def place(self, alias, layout):
        self.calls.append(('place', alias, layout))


class Bus(object):

    def __init__(self):
        self.handlers = {}

    def on(self, event, handler):
        self.handlers.setdefault(event, []).append(handler)

    def emit(self, event):
        for handler in self.handlers.get(event, []):
            handler()


class App(object):

    def __init__(self, ui, state=None):
        self.ui = ui
        self.bus = Bus()
        self.state = state if state is not None else {}
        self.parts = {}
        self.saved = 0

    def register_state(self, key, dump):
        self.parts[key] = dump

    def save_state(self):
        self.saved += 1


class HangarLabelTest(unittest.TestCase):

    def setUp(self):
        self.ui = Ui()
        self.app = App(self.ui)
        self.label = HangarLabel(self.app, 'otmetki.test')

    def shows(self):
        return [call for call in self.ui.calls if call[0] == 'show']

    def call_names(self):
        return [call[0] for call in self.ui.calls]

    def drag_the_shown_label(self):
        self.label.show('one', LAYOUT)
        save = self.shows()[0][3]
        save(DRAGGED_LAYOUT)
        save({'scale': 1.5})

    def test_draws_only_a_changed_text_or_widget(self):
        self.label.show('one', LAYOUT)
        self.label.show('one', LAYOUT)
        self.label.show('two', LAYOUT, len)
        self.label.show('two', LAYOUT, len, widget={'kind': 'card'})

        drawn = [(call[2], call[5]) for call in self.shows()]
        self.assertEqual(drawn, [('one', None), ('two', None), ('two', {'kind': 'card'})])
        self.assertEqual(self.label.text, 'two')

    def test_the_feature_move_handler_reaches_the_ui(self):
        self.label.show('two', LAYOUT, len)

        self.assertIs(self.shows()[0][3], len)

    def test_nothing_to_show_on_a_hidden_label_draws_nothing(self):
        self.label.show(None, LAYOUT)

        self.assertEqual(self.ui.calls, [])

    def test_nothing_to_show_takes_a_shown_label_off_once(self):
        self.label.show('one', LAYOUT)

        self.label.show(None, LAYOUT)
        self.label.clear()

        self.assertEqual(self.call_names(), ['show', 'hide'])
        self.assertIsNone(self.label.text)

    def test_a_widget_alone_is_drawn(self):
        self.label.show(None, LAYOUT, widget={'kind': 'card'})

        self.assertEqual(self.shows()[0][2], '')

    def test_hide_always_reaches_the_ui_and_forgets_the_text(self):
        self.label.hide()
        self.label.show('one', LAYOUT)
        self.label.hide()
        self.label.show('one', LAYOUT)

        self.assertEqual(self.call_names(), ['hide', 'show', 'hide', 'show'])

    def test_a_label_the_ui_did_not_draw_has_no_text(self):
        self.ui.draws = False

        self.label.show('one', LAYOUT)

        self.assertIsNone(self.label.text)

    def test_a_label_the_ui_did_not_draw_is_tried_again(self):
        self.ui.draws = False
        self.label.show('one', LAYOUT)
        self.ui.draws = True

        self.label.show('one', LAYOUT)

        self.assertEqual(self.label.text, 'one')
        self.assertEqual(len(self.ui.calls), 2)

    def test_remembers_a_drag_for_a_label_without_a_place_of_its_own(self):
        self.drag_the_shown_label()

        places = self.app.parts['hangar_places']()

        self.assertEqual(places['otmetki.test'], SAVED_PLACE)
        self.assertEqual(self.app.saved, 2)

    def test_a_dragged_label_comes_back_at_its_new_place(self):
        self.drag_the_shown_label()
        self.label.hide()

        self.label.show('one', LAYOUT)

        self.assertEqual(self.shows()[-1][4], dict(DRAGGED_LAYOUT, scale=1.5))

    def test_a_saved_place_comes_back_from_the_app_state(self):
        app = App(Ui(), {'hangar_places': {'otmetki.test': {'x': 5, 'y': 6}}})

        HangarLabel(app, 'otmetki.test').show('one', LAYOUT)

        self.assertEqual(app.ui.calls[0][4], {'x': 5, 'y': 6, 'alignX': 'left', 'alignY': 'top'})

    def test_a_feature_place_wins_over_the_saved_one(self):
        hangar_places(self.app)['otmetki.test'] = {'x': 99}

        self.label.show('one', LAYOUT, len)

        self.assertEqual(self.shows()[0][4], LAYOUT)

    def test_reset_puts_the_label_back_at_its_default(self):
        self.label.show('one', LAYOUT)
        self.shows()[0][3]({'x': 40, 'y': 50})

        self.app.bus.emit(EVENT_RESET_LAYOUT)

        self.assertNotIn('otmetki.test', hangar_places(self.app))
        self.assertEqual(self.ui.calls[-1], ('place', 'otmetki.test', LAYOUT))


if __name__ == '__main__':
    unittest.main()
