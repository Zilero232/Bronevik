"""What features call: register a panel with its schema, show text in it, hide it.

When the backend reports a drag (`on_moved`), the new x/y are saved into the panel's section of
components.json, so the panel comes back where the player left it.
"""
from __future__ import absolute_import, division, print_function, unicode_literals

from ...compat import is_number, string_types
from ..backend import NullBackend
from ..panel import LAYOUT_KEYS, alias_of, layout_props, panel_of


class HudLayer(object):

    def __init__(self, backend, config):
        self.backend = backend or NullBackend()
        self.config = config
        self.panels = {}
        self.schemas = {}
        self.shown = set()
        self.backend.listen(self.on_moved)

    @property
    def has_panels(self):
        return bool(self.backend.available())

    def register(self, panel_id, schema):
        """Declare a panel; returns its settings (a `Settings` over `schema`, stored in components.json)."""
        settings = self.config.section(panel_id, schema)
        self.panels[panel_id] = settings
        self.schemas[panel_id] = schema
        return settings

    def settings(self, panel_id):
        return self.panels.get(panel_id)

    def is_registered(self, panel_id):
        return panel_id in self.panels

    def props(self, panel_id, text):
        props = layout_props(self.panels[panel_id])
        props.update({'text': text, 'visible': True})
        return props

    def show(self, panel_id, text):
        """Show or update the panel; False when it is unknown or no renderer is installed."""
        if not self.is_registered(panel_id) or not self.has_panels:
            self.hide(panel_id)
            return False
        alias = alias_of(panel_id)
        if alias in self.shown:
            self.backend.update(alias, {'text': text, 'visible': True})
            return True
        if not self.backend.create(alias, self.props(panel_id, text)):
            return False
        self.shown.add(alias)
        return True

    def hide(self, panel_id):
        alias = alias_of(panel_id)
        if alias in self.shown:
            self.shown.discard(alias)
            self.backend.delete(alias)

    def hide_all(self):
        for panel_id in list(self.panels):
            self.hide(panel_id)

    def update_settings(self, panel_id, values):
        """Apply new settings (a settings window, a preset); a shown panel is moved or restyled at once."""
        changed = self.config.update(panel_id, values)
        alias = alias_of(panel_id)
        if changed and alias in self.shown and set(changed) & set(LAYOUT_KEYS):
            self.backend.update(alias, layout_props(self.panels[panel_id]))
        return changed

    def on_moved(self, alias, props):
        if not isinstance(alias, string_types) or not isinstance(props, dict):
            return False
        panel_id = panel_of(alias)
        if panel_id not in self.panels:
            return False
        values = {}
        for key in ('x', 'y'):
            value = props.get(key)
            if is_number(value):
                values[key] = int(round(value))
        return bool(self.config.update(panel_id, values))
