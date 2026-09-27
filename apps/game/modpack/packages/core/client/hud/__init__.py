"""The process-wide HUD layer the features share, and the choice of its renderer.

Backends are tried in `BACKENDS` order; the first usable wins, else `NullBackend` (panels stay hidden,
features fall back to system messages). Add a Gameface backend to BACKENDS when one exists.
"""
from __future__ import absolute_import, division, print_function, unicode_literals

from ...durable import open_config
from ...hud import ComponentConfig, HudLayer, NullBackend
from ...log import log
from .constants import CONFIG_NAME
from .guiflash import GuiFlashBackend

BACKENDS = (GuiFlashBackend,)

_state = {'layer': None, 'config': None}


def create_backend(backends=BACKENDS, log_missing=True):
    for backend in backends:
        if backend.usable():
            return backend()
    if log_missing:
        log('no HUD renderer (GUIFlash) installed: battle panels are off')
    return NullBackend()


def component_config(app):
    """components.json next to config.json, shared by every component (created on first use)."""
    if _state['config'] is None:
        _state['config'] = ComponentConfig(open_config(app.config_dir, CONFIG_NAME, pretty=True))
    return _state['config']


def hud_layer(app):
    """The process-wide HUD layer (created on first use, so features need no load order)."""
    if _state['layer'] is None:
        _state['layer'] = HudLayer(create_backend(), component_config(app))
    return _state['layer']
