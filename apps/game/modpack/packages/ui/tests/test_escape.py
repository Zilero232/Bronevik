# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.ui.escape import EscapeGuard


class FakeInputManager(object):
    """The client's GameInputMgr: listeners on its onEscape event, the key held while any is registered."""

    def __init__(self):
        self.listeners = []

    def addEscapeListener(self, listener):
        self.listeners.append(listener)

    def removeEscapeListener(self, listener):
        self.listeners.remove(listener)

    def press_escape(self):
        for listener in list(self.listeners):
            listener()


class EscapeGuardTest(unittest.TestCase):

    def setUp(self):
        self.manager = FakeInputManager()
        self.closed = []
        self.guard = EscapeGuard(lambda: self.manager, lambda: self.closed.append(True))

    def test_esc_closes_the_open_window_instead_of_the_client_menu(self):
        assert self.guard.hold() and self.guard.held
        self.manager.press_escape()
        assert self.closed == [True]

    def test_holds_the_key_once_and_lets_it_go_on_close(self):
        self.guard.hold()
        self.guard.hold()
        assert len(self.manager.listeners) == 1
        self.guard.release()
        self.guard.release()
        assert self.manager.listeners == [] and not self.guard.held
        self.manager.press_escape()
        assert self.closed == []

    def test_a_closing_window_releases_the_key_from_its_own_listener(self):
        guard = EscapeGuard(lambda: self.manager, lambda: guard.release())
        guard.hold()
        self.manager.press_escape()
        assert self.manager.listeners == [] and not guard.held

    def test_without_the_client_input_manager_nothing_is_held(self):
        assert not EscapeGuard(lambda: None, lambda: None).hold()
        assert not EscapeGuard(lambda: object(), lambda: None).hold()


if __name__ == '__main__':
    unittest.main()
