"""What every feature component starts from: its strings added to the shared catalog, its settings section
of components.json and its on/off switch in config.json."""
from __future__ import absolute_import, division, print_function, unicode_literals

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
