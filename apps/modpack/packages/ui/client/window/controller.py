from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.log import log, safe
from .gameface import AVAILABLE, SettingsWindow


class WindowController(object):
    """Opens and closes the settings window and moves JSON between it and the bridge."""

    def __init__(self, on_message, current_state):
        self.on_message_cb = on_message
        self.current_state = current_state
        self.window = None
        self.view = None

    @staticmethod
    def available():
        return AVAILABLE

    @property
    def is_open(self):
        return self.window is not None

    @safe
    def open(self):
        if not AVAILABLE:
            return False
        if self.window is None:
            self.window = SettingsWindow(self)
            self.window.load()
        return True

    @safe
    def close(self):
        window, self.window = self.window, None
        self.view = None
        if window is not None:
            window.destroy()

    @safe
    def push(self, text):
        if self.view is not None:
            self.view.viewModel.set_state(text)

    def on_loaded(self, view):
        self.view = view
        self.push(self.current_state())

    def on_destroyed(self, view):
        if self.view is view:
            self.view = None
            self.window = None

    @safe
    def on_message(self, raw):
        if raw is None:
            log('ui: send without a message')
            return
        self.on_message_cb(raw)
