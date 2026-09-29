"""What every feature component starts from: its strings added to the shared catalog, its settings section
of components.json and its on/off switch in config.json."""
from __future__ import absolute_import, division, print_function, unicode_literals

from ...hud.panel import moved_values
from ..hud import component_config


class FeatureComponent(object):

    def __init__(self, app, component_id, schema, switch, strings):
        self.app = app
        self.component_id = component_id
        self.switch = switch
        app.translate.catalog.add(strings)
        self.settings = self.register(schema)

    def register(self, schema):
        return component_config(self.app).section(self.component_id, schema)

    def enabled(self):
        return bool(self.app.config.is_enabled(self.switch))

    def enabled_in_hangar(self):
        return self.enabled() and not self.app.in_battle

    def save_place(self, props):
        """Keep where the player dragged (or how far they scaled) the component's hangar label."""
        return component_config(self.app).update(self.component_id, moved_values(props))

    def reset_place(self, keys):
        """Put the keys `keys` of the component's section back to their defaults; returns the changed keys."""
        defaults = self.settings.schema.defaults
        return component_config(self.app).update(self.component_id, dict((key, defaults[key]) for key in keys if key in defaults))
