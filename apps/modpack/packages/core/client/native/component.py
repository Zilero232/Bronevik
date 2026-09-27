from __future__ import absolute_import, division, print_function, unicode_literals

from ...log import safe
from ..hud import component_config
from .settings_core import apply_changed

COMPONENT_SETTINGS_EVENT = 'component_settings'


class NativeSettingsComponent(object):
    """A component whose values become the player's client settings. They are written only when the
    player changes them (the settings window, a profile load: bus `component_settings`) and only in the
    hangar, so a later change in the game's own settings window is never overridden."""

    def __init__(self, app, component_id, schema, switch, to_native):
        self.app = app
        self.component_id = component_id
        self.switch = switch
        self.to_native = to_native
        self.settings = component_config(app).section(component_id, schema)
        app.bus.on(COMPONENT_SETTINGS_EVENT, self._on_settings)

    def desired(self):
        return self.to_native(self.settings.to_dict())

    @safe
    def _on_settings(self, component_id, changed):
        if component_id != self.component_id or self.app.in_battle or not self.app.config.is_enabled(self.switch):
            return
        self.apply()

    def apply(self):
        return apply_changed(self.desired())
