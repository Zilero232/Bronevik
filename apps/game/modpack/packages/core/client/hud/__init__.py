"""The process-wide HUD layer the features share, and the choice of its renderer.

`BACKENDS` in preference order: OpenWG Gameface (the ui package's HUD page), then GUIFlash. Every
installed one joins a `BackendChain`, which draws each label with the first backend available at that
moment (GUIFlash before 0.6 draws in battle only); with none, panels stay hidden and features fall back
to system messages. The layer and the hangar labels (`core.client.ui`) share one chain, so there is one
Gameface window.
"""
from __future__ import absolute_import, division, print_function, unicode_literals

from ...durable import open_config
from ...hud import BackendChain, ComponentConfig, HudLayer
from ...log import log
from .constants import CONFIG_NAME
from .gameface import GamefaceBackend
from .guiflash import GuiFlashBackend
from .stock import StockControl

BACKENDS = (GamefaceBackend, GuiFlashBackend)

_state = {'layer': None, 'config': None, 'backend': None, 'stock': None}


def build_backend(backends=BACKENDS, log_missing=True):
    installed = []
    for backend in backends:
        if backend.usable():
            installed.append(backend())
        elif log_missing:
            log('HUD: %s' % backend.missing_reason())
    chain = BackendChain(installed)
    if log_missing:
        log('HUD renderers: %s' % (', '.join(chain.names) or 'none, battle and hangar panels are off'))
    return chain


def create_backend(backends=BACKENDS):
    if _state['backend'] is None:
        _state['backend'] = build_backend(backends)
    return _state['backend']


def component_config(app):
    """components.json next to config.json, shared by every component (created on first use)."""
    if _state['config'] is None:
        _state['config'] = ComponentConfig(open_config(app.config_dir, CONFIG_NAME, pretty=True))
    return _state['config']


def hud_layer(app):
    """The process-wide HUD layer (created on first use, so features need no load order)."""
    if _state['layer'] is None:
        _state['layer'] = HudLayer(create_backend(), component_config(app), getattr(app, 'translate', None))
    return _state['layer']


def stock_control(app):
    if _state['stock'] is None:
        _state['stock'] = StockControl(hud_layer(app), app.bus)
        _state['stock'].install()
    return _state['stock']
