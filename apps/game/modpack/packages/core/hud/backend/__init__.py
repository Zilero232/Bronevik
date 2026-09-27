"""The renderer interface of the HUD layer.

`core/client/hud/` implements it with GUIFlash today; a Gameface (openwg_gameface) backend can be added
there without touching the features. Props use the GUIFlash label names (x, y, alignX, alignY, alpha,
drag, border, text, visible); another backend maps them to its own.
"""
from __future__ import absolute_import, division, print_function, unicode_literals


class HudBackend(object):

    name = 'none'

    def available(self):
        return False

    def create(self, alias, props):
        """Create a label; a truthy return means it exists now."""
        return False

    def update(self, alias, props):
        return False

    def delete(self, alias):
        return False

    def listen(self, on_moved):
        """Call `on_moved(alias, props)` when the player drags a panel."""


class NullBackend(HudBackend):
    """No renderer installed: every panel stays hidden, features fall back to notifications."""
