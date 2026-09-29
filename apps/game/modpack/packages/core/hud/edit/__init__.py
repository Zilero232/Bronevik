"""A panel's side of the HUD edit protocol (the ui package's editor drives it on `app.bus`).

`HudPreview(layer, panel_id, render_preview, ...).attach(bus)` answers `hud_describe(collect)` with the
panel's preview text and size (`collect(panel_id, preview, width, height, enabled)`), and on `hud_edit(True)` shows the panel with that preview text
and its preview widget (`render_widget`, for the Gameface page) (only
when its switch is on and the player is in the hangar) so it can be dragged into place; `hud_edit(False)`
or `end()` (the panel's own battle start) hides the preview again. `hud_reset_layout()` asks every hangar
label that keeps its own place (outside the layer) to go back to its default.
"""
from __future__ import absolute_import, division, print_function, unicode_literals

from .constants import EVENT_DESCRIBE, EVENT_EDIT, EVENT_RESET_LAYOUT

__all__ = ('EVENT_DESCRIBE', 'EVENT_EDIT', 'EVENT_RESET_LAYOUT', 'HudPreview')


def _always():
    return True


class HudPreview(object):

    def __init__(self, layer, panel_id, render_preview, is_enabled=_always, can_show=_always, size=(None, None), render_widget=None):
        self.layer = layer
        self.panel_id = panel_id
        self.render_preview = render_preview
        self.render_widget = render_widget
        self.is_enabled = is_enabled
        self.can_show = can_show
        self.size = size
        self.previewing = False

    def attach(self, bus):
        bus.on(EVENT_EDIT, self.on_edit)
        bus.on(EVENT_DESCRIBE, self.on_describe)
        return self

    def on_edit(self, active):
        if active and self.is_enabled() and self.can_show():
            widget = self.render_widget() if self.render_widget is not None else None
            self.previewing = bool(self.layer.show(self.panel_id, self.render_preview(), widget))
        else:
            self.end()

    def end(self):
        """Hide the preview (edit mode off, or the panel's real content is about to take over)."""
        if self.previewing:
            self.previewing = False
            self.layer.hide(self.panel_id)

    def on_describe(self, collect):
        width, height = self.size
        collect(self.panel_id, self.render_preview(), width, height, self.is_enabled())
