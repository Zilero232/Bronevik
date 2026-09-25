from __future__ import absolute_import

from ..settings_template import BIND_CODE_VAR, LINKAGE, build_template, settings_to_config
from .log import log, safe

try:
    from gui.modsSettingsApi import g_modsSettingsApi
except ImportError:
    g_modsSettingsApi = None


class SettingsUi(object):

    def __init__(self, app):
        self.app = app
        self.registered = False

    def _template(self):
        return build_template(self.app.config, self.app.translate, self.app.status_text())

    @safe
    def register(self):
        if g_modsSettingsApi is None:
            log('ModsSettingsAPI not installed: edit mods/configs/bronevik/config.json instead')
            return False
        template = self._template()
        saved = g_modsSettingsApi.getModSettings(LINKAGE, template)
        if saved:
            self._apply(saved)
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

    def _apply(self, values):
        if self.app.config.update(settings_to_config(values)):
            self.app.save_config()

    @safe
    def _on_changed(self, linkage, values):
        if linkage == LINKAGE:
            self._apply(values)

    @safe
    def _on_button(self, linkage, var_name, value):
        if linkage == LINKAGE and var_name == BIND_CODE_VAR:
            self.app.bind(value)
