"""HUD edit mode: the window's editor drags miniatures of the HUD panels and writes x/y/aligns through
the HUD layer; the on-screen mode asks the panels (bus `hud_edit`) to show preview data in the hangar."""
from __future__ import absolute_import, division, print_function, unicode_literals

from ...core.hud import EVENT_DESCRIBE, EVENT_EDIT  # noqa: F401
from .editor import HudEditor, move_values, plain_preview  # noqa: F401
