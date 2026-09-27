"""Hangar panels and notifications for the companion and the hangar features: labels drawn through the
HUD backend (GUIFlash when installed), each placed by its own layout, and the game's system messages."""
from __future__ import absolute_import

from ...log import log, safe
from ..hud import create_backend


class Ui(object):

    def __init__(self, backend=None):
        self.backend = backend or create_backend(log_missing=False)
        self.components = set()
        if not self.has_panels:
            log('GUIFlash not installed: panels fall back to system messages')

    @property
    def has_panels(self):
        return bool(self.backend.available())

    @safe
    def show(self, alias, text, layout):
        if not self.has_panels:
            return False
        if alias in self.components:
            self.backend.update(alias, {'text': text, 'visible': True})
            return True
        props = dict(layout)
        props.update({'text': text, 'drag': True, 'border': True, 'visible': True})
        if not self.backend.create(alias, props):
            return False
        self.components.add(alias)
        return True

    @safe
    def hide(self, alias):
        if alias not in self.components:
            return
        self.backend.delete(alias)
        self.components.discard(alias)

    @safe
    def notify(self, text):
        from gui import SystemMessages
        SystemMessages.pushMessage(text, type=SystemMessages.SM_TYPE.Information)
