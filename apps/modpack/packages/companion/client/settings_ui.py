"""In-game settings window, behind a small interface so the window can be swapped.

Today the only view is ModsSettingsAPI (izeberg). Its ModsList dependency on current master needs the WG
client (2.4.1+), so on Lesta it works only with an older compatible release. A Gameface view
(openwg_gameface) can replace it by adding a class to VIEWS; the app only calls `register()` and
`refresh()`, and a view calls back `app.config`, `app.translate`, `app.status_text()`,
`app.save_config()` and `app.bind(code)`.
"""
from __future__ import absolute_import

from ...core.log import log, safe
from ..settings_template import BIND_CODE_VAR, LINKAGE, build_template, settings_to_config

try:
    from gui.modsSettingsApi import g_modsSettingsApi
except ImportError:
    g_modsSettingsApi = None


class SettingsView(object):
    """The interface: a settings window the app registers once and refreshes when its status changes."""

    name = 'none'

    def __init__(self, app):
        self.app = app

    @classmethod
    def available(cls):
        return True

    def register(self):
        return False

    def refresh(self):
        pass

    def apply(self, values):
        """Merge values from the window into config.json (unknown keys and bad values are ignored)."""
        if self.app.config.update(settings_to_config(values)):
            self.app.save_config()


class NoSettingsView(SettingsView):

    @safe
    def register(self):
        log('ModsSettingsAPI not installed: edit mods/configs/otmetki/config.json instead')
        return False


class ModsSettingsApiView(SettingsView):

    name = 'modsSettingsApi'

    def __init__(self, app):
        SettingsView.__init__(self, app)
        self.registered = False

    @classmethod
    def available(cls):
        return g_modsSettingsApi is not None

    def _template(self):
        return build_template(self.app.config, self.app.translate, self.app.status_text())

    @safe
    def register(self):
        template = self._template()
        saved = g_modsSettingsApi.getModSettings(LINKAGE, template)
        if saved:
            self.apply(saved)
            g_modsSettingsApi.registerCallback(LINKAGE, self._on_changed, self._on_button)
        else:
            g_modsSettingsApi.setModTemplate(LINKAGE, template, self._on_changed, self._on_button)
        self.registered = True
        return True

    @safe
    def refresh(self):
        if not self.registered:
            return
        g_modsSettingsApi.setModTemplate(LINKAGE, self._template(), self._on_changed, self._on_button)

    @safe
    def _on_changed(self, linkage, values):
        if linkage == LINKAGE:
            self.apply(values)

    @safe
    def _on_button(self, linkage, var_name, value):
        if linkage == LINKAGE and var_name == BIND_CODE_VAR:
            self.app.bind(value)


# Tried in order; the first available view wins.
VIEWS = (ModsSettingsApiView,)


def create_settings_ui(app, views=VIEWS):
    for view in views:
        if view.available():
            return view(app)
    return NoSettingsView(app)
