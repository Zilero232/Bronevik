"""What features call: register a panel with its schema, show text in it, hide it.

When the backend reports a drag or a resize (`on_moved`), the new x/y (and the anchor, when the renderer sends
one) or scale are saved into the panel's section of components.json, so the panel comes back where the player left it.
An unchanged text is not sent again (a Flash or Gameface re-layout per call is the cost).

`set_muted(True)` (the streamer hotkey), `set_blocked(panel_ids)` (the streamer's private panels) and `set_gui_hidden(True)`
(the stock battle GUI hidden: V, full stats) take panels off the screen without the features knowing: their texts are
held and come back when the panel is allowed again.

`show(panel_id, text, widget)` also carries the panel's structured payload (`core.hud.widget`) for the Gameface page;
`renders_widgets()` says whether the renderer draws it (a feature replaces a stock element only then).
"""
from __future__ import absolute_import, division, print_function, unicode_literals

from ...compat import is_number, string_types
from ..backend import NullBackend
from ..panel import LAYOUT_KEYS, alias_of, dock_of, layout_props, moved_values, panel_of


class HudLayer(object):

    def __init__(self, backend, config):
        self.backend = backend or NullBackend()
        self.config = config
        self.panels = {}
        self.schemas = {}
        self.shown = set()
        self.texts = {}
        self.widgets = {}
        self.places = {}
        self.muted = False
        self.gui_hidden = False
        self.blocked = frozenset()
        self.held = {}
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

    def props(self, panel_id, text, widget=None):
        settings = self.panels[panel_id]
        props = layout_props(settings)
        props.update({'text': text, 'visible': True, 'widget': widget, 'dock': dock_of(alias_of(panel_id), settings)})
        return props

    def suppressed(self, panel_id):
        return self.muted or self.gui_hidden or panel_id in self.blocked

    def renders_widgets(self):
        """Whether the renderer in use draws the widget payloads (the Gameface page, once it answered)."""
        return bool(self.backend.renders_widgets())

    def show(self, panel_id, text, widget=None):
        """Show or update the panel; False when it is unknown or no renderer is installed. A muted or blocked panel
        keeps its text for later and counts as shown."""
        if not self.is_registered(panel_id) or not self.has_panels:
            self.hide(panel_id)
            return False
        if self.suppressed(panel_id):
            self._take_off(panel_id)
            self.held[panel_id] = (text, widget)
            return True
        alias = alias_of(panel_id)
        if alias in self.shown:
            if self.texts.get(alias) != text or self.widgets.get(alias) != widget:
                self.backend.update(alias, {'text': text, 'visible': True, 'widget': widget})
                self.texts[alias] = text
                self.widgets[alias] = widget
            return True
        if not self.backend.create(alias, self.props(panel_id, text, widget)):
            return False
        self.shown.add(alias)
        self.texts[alias] = text
        self.widgets[alias] = widget
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
        self.held.pop(panel_id, None)
        self._take_off(panel_id)

    def _take_off(self, panel_id):
        alias = alias_of(panel_id)
        self.texts.pop(alias, None)
        self.widgets.pop(alias, None)
        self.places.pop(alias, None)
        if alias in self.shown:
            self.shown.discard(alias)
            self.backend.delete(alias)

    def hide_all(self):
        for panel_id in list(self.panels):
            self.hide(panel_id)

    def set_muted(self, muted):
        """Take every panel off the screen (True) or bring back what the features show (False)."""
        self.muted = bool(muted)
        self._apply()

    def set_blocked(self, panel_ids):
        self.blocked = frozenset(panel_ids or ())
        self._apply()

    def set_gui_hidden(self, hidden):
        """Follow the stock battle GUI: hidden with V or behind the full stats (True), shown again (False)."""
        hidden = bool(hidden)
        if hidden != self.gui_hidden:
            self.gui_hidden = hidden
            self._apply()

    def _apply(self):
        for alias in list(self.shown):
            panel_id = panel_of(alias)
            if panel_id is not None and self.suppressed(panel_id):
                self.held[panel_id] = (self.texts.get(alias), self.widgets.get(alias))
                self._take_off(panel_id)
        for panel_id, (text, widget) in list(self.held.items()):
            if not self.suppressed(panel_id):
                del self.held[panel_id]
                if text is not None:
                    self.show(panel_id, text, widget)

    def update_settings(self, panel_id, values):
        """Apply new settings (a settings window, a preset); a shown panel is moved or restyled at once."""
        changed = self.config.update(panel_id, values)
        alias = alias_of(panel_id)
        if changed and alias in self.shown and set(changed) & set(LAYOUT_KEYS):
            self.places.pop(alias, None)
            props = layout_props(self.panels[panel_id])
            props['dock'] = dock_of(alias, self.panels[panel_id])
            self.backend.update(alias, props)
        return changed

    def on_moved(self, alias, props):
        if not isinstance(alias, string_types) or not isinstance(props, dict):
            return False
        panel_id = panel_of(alias)
        if panel_id not in self.panels:
            return False
        changed = bool(self.config.update(panel_id, moved_values(props)))
        if changed and alias in self.shown:
            self.backend.update(alias, {'dock': dock_of(alias, self.panels[panel_id])})
        return changed
