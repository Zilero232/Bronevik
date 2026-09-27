"""In-game settings window, behind a small interface so the window can be swapped.

The app creates the ModsSettingsAPI (izeberg) view; the ui package adds its Gameface window next to it
with `add_settings_view` when it attaches. Its ModsList dependency on current master needs the WG
client (2.4.1+), so on Lesta it works only with an older compatible release. A Gameface view
(openwg_gameface) can replace it by adding a class to VIEWS; the app only calls `register()` and
`refresh()`, and a view calls back `app.config`, `app.translate`, `app.status_text()`,
`app.save_config()` and `app.bind(code)`.
"""
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.log import log, safe
from .. import BIND_CODE_VAR, LINKAGE, build_template, settings_to_config

try:
    from gui.modsSettingsApi import g_modsSettingsApi
except ImportError:
    g_modsSettingsApi = None


class SettingsView(object):

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


VIEWS = (ModsSettingsApiView,)


def create_settings_ui(app, views=VIEWS):
    for view in views:
        if view.available():
            return view(app)
    return NoSettingsView(app)


class CompositeSettingsView(SettingsView):

    name = 'composite'

    def __init__(self, app, views):
        SettingsView.__init__(self, app)
        self.views = list(views)

    def register(self):
        return any([view.register() for view in self.views])

    def refresh(self):
        for view in self.views:
            view.refresh()


def add_settings_view(app, view):
    current = app.settings_ui
    if isinstance(current, CompositeSettingsView):
        views = current.views + [view]
    elif isinstance(current, NoSettingsView):
        views = [view]
    else:
        views = [current, view]
    app.settings_ui = CompositeSettingsView(app, views)
    view.register()
    return view
