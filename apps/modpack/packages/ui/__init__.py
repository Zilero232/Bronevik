"""Three Marks in-game UI: the Gameface settings window, its hangar entry points and the bridge between
the window's JavaScript and the mod (components, per-component settings, profiles, HUD edit mode).

Registers through core.registry like a feature, so it attaches in any load order. Without OpenWG
Gameface the window is off and the ModsSettingsAPI view stays the settings window.
"""
from __future__ import absolute_import, division, print_function, unicode_literals

UI_ID = 'ui'


def create(app):
    from .client import UiHost
    return UiHost(app)


def register():
    from ..core.registry import registry
    return registry().register(UI_ID, create)
