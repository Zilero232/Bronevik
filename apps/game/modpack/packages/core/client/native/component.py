from __future__ import absolute_import, division, print_function, unicode_literals

from ...events import EVENT_COMPONENT_SETTINGS
from ..component import FeatureComponent
from .settings_core import apply_changed


class NativeSettingsComponent(FeatureComponent):
    """A component whose values become the player's client settings. They are written only when the
    player changes them (the settings window, a profile load: bus `component_settings`) and only in the
    hangar, so a later change in the game's own settings window is never overridden."""

    def __init__(self, app, component_id, schema, switch, strings, to_native):
        FeatureComponent.__init__(self, app, component_id, schema, switch, strings)
        self.to_native = to_native
        app.bus.on(EVENT_COMPONENT_SETTINGS, self._on_settings)

    def desired(self):
        return self.to_native(self.settings.to_dict())

    def _on_settings(self, component_id, changed):
        if component_id == self.component_id and self.enabled_in_hangar():
            self.apply()

    def apply(self):
        return apply_changed(self.desired())
