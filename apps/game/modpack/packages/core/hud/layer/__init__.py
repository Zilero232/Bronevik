"""What features call: register a panel with its schema, show text in it, hide it.

When the backend reports a drag (`on_moved`), the new x/y (and the anchor, when the renderer sends one)
are saved into the panel's section of components.json, so the panel comes back where the player left it.
An unchanged text is not sent again (a Flash or Gameface re-layout per call is the cost).
"""
from __future__ import absolute_import, division, print_function, unicode_literals

from ...compat import is_number, string_types, to_text
from ..backend import NullBackend
from ..panel import LAYOUT_KEYS, MOVED_ALIGNS, alias_of, layout_props, panel_of


class HudLayer(object):

    def __init__(self, backend, config):
        self.backend = backend or NullBackend()
        self.config = config
        self.panels = {}
        self.schemas = {}
        self.shown = set()
        self.texts = {}
        self.places = {}
        self.backend.listen(self.on_moved)

    @property
    def has_panels(self):
        return bool(self.backend.available())

    @property
    def backend_name(self):
        return self.backend.name

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
            if self.texts.get(alias) != text:
                self.backend.update(alias, {'text': text, 'visible': True})
                self.texts[alias] = text
            return True
        if not self.backend.create(alias, self.props(panel_id, text)):
            return False
        self.shown.add(alias)
        self.texts[alias] = text
        return True

    def place(self, panel_id, x, y):
        """Move a shown panel for now (a mark that follows the crosshair); components.json keeps the player's
        own position. False when the panel is not shown."""
        alias = alias_of(panel_id)
        if alias not in self.shown or not is_number(x) or not is_number(y):
            return False
        position = (int(round(x)), int(round(y)))
        if self.places.get(alias) != position:
            self.backend.update(alias, {'x': position[0], 'y': position[1]})
            self.places[alias] = position
        return True

    def hide(self, panel_id):
        alias = alias_of(panel_id)
        self.texts.pop(alias, None)
        self.places.pop(alias, None)
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
            self.places.pop(alias, None)
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
            if is_number(value) and not isinstance(value, bool):
                values[key] = int(round(value))
        for prop, key in MOVED_ALIGNS:
            if isinstance(props.get(prop), string_types):
                values[key] = to_text(props[prop])
        return bool(self.config.update(panel_id, values))
