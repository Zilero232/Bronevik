from __future__ import absolute_import

from ..log import log, safe

try:
    from gui.mods.gambiter import g_guiFlash
    from gui.mods.gambiter.flash import COMPONENT_TYPE
except ImportError:
    g_guiFlash = None
    COMPONENT_TYPE = None


class Ui(object):
    """On-screen labels through GUIFlash (optional) and system messages. Each panel brings its own layout."""

    def __init__(self):
        self.components = set()
        if g_guiFlash is None:
            log('GUIFlash not installed: panels fall back to system messages')

    @property
    def has_panels(self):
        return g_guiFlash is not None

    @safe
    def show(self, alias, text, layout):
        if g_guiFlash is None:
            return False
        if alias in self.components:
            g_guiFlash.updateComponent(alias, {'text': text, 'visible': True})
            return True
        props = dict(layout)
        props.update({'text': text, 'drag': True, 'border': True, 'visible': True})
        g_guiFlash.createComponent(alias, COMPONENT_TYPE.LABEL, props)
        self.components.add(alias)
        return True

    @safe
    def hide(self, alias):
        if g_guiFlash is None or alias not in self.components:
            return
        g_guiFlash.deleteComponent(alias)
        self.components.discard(alias)

    @safe
    def notify(self, text):
        from gui import SystemMessages
        SystemMessages.pushMessage(text, type=SystemMessages.SM_TYPE.Information)
