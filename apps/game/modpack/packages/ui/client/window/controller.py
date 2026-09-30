from __future__ import absolute_import, division, print_function, unicode_literals

import BigWorld

from ....core.log import log, safe
from ...escape import EscapeGuard, EscapeWatchdog
from .blur import WindowBlur
from .gameface import AVAILABLE, SettingsWindow, WindowStatus
from .input import game_input_manager


class WindowController(object):

    def __init__(self, on_message, current_state, on_escape):
        self.on_message_cb = on_message
        self.current_state = current_state
        self.on_escape = on_escape
        self.escape = EscapeGuard(game_input_manager, self.step_back)
        self.watchdog = EscapeWatchdog(BigWorld.callback, self._on_page_silent)
        self.blur = WindowBlur()
        self.window = None
        self.view = None
        self.pushed = None

    @staticmethod
    def available():
        return AVAILABLE

    @property
    def is_open(self):
        window = self.window
        if window is None:
            return False
        if WindowStatus is not None and window.windowStatus in (WindowStatus.DESTROYING, WindowStatus.DESTROYED):
            self._forget()
            return False
        return True

    @safe
    def open(self):
        if not AVAILABLE:
            return False
        if self.is_open:
            log('ui: settings window %s is already open, brought to the front' % self.window.uniqueID)
            self.window.show()
            return True
        self.window = SettingsWindow(self)
        self.window.onStatusChanged += self._on_status
        self.window.load()
        self.blur.show(self.window.layer)
        held = 'held' if self.escape.hold() else 'not held'
        log('ui: settings window %s created, Esc %s' % (self.window.uniqueID, held))
        return True

    @safe
    def close(self):
        window = self.window
        self._forget()
        if window is not None:
            log('ui: settings window %s closed' % window.uniqueID)
            window.destroy()

    @safe
    def step_back(self):
        if self.view is None:
            self.on_escape()
            return
        self.view.viewModel.set_escape(self.watchdog.ask())

    def answer_escape(self):
        self.watchdog.answer()

    @safe
    def push(self, text):
        if self.view is not None and text != self.pushed:
            self.pushed = text
            self.view.viewModel.set_state(text)

    @safe
    def push_feed(self, text):
        if self.view is not None:
            self.view.viewModel.set_feed(text)

    def on_loaded(self, view):
        self.view, self.pushed = view, None
        log('ui: settings page loading')
        self.push(self.current_state())

    def on_destroyed(self, view):
        if self.view is view or self.view is None:
            self._forget()

    @safe
    def on_message(self, raw):
        if raw is None:
            log('ui: send without a message')
            return
        self.on_message_cb(raw)

    def _forget(self):
        self.window, self.view, self.pushed = None, None, None
        self.watchdog.answer()
        self.escape.release()
        self.blur.hide()

    @safe
    def _on_page_silent(self):
        log('ui: the settings page did not answer Esc')
        self.on_escape()

    @safe
    def _on_status(self, status):
        window = self.window
        log('ui: settings window %s status %s' % (window.uniqueID if window is not None else '?', status))
