"""The battle HUD layer: draggable text panels whose position and look persist, behind a backend adapter.

Pure (Python 2/3, no client imports); one concern per subpackage:

- `panel`: the per-panel settings schema (common layout keys + the panel's own) and renderer props;
- `config`: components.json, one schema-checked section per component;
- `backend`: the renderer interface (`HudBackend`), `NullBackend` and `BackendChain` (the runtime choice);
- `layer`: `HudLayer`, what features call (`register`, `show`, `hide`, `update_settings`);
- `edit`: `HudPreview`, a panel's side of the HUD edit protocol (`hud_edit`, `hud_describe` on the bus);
- `surface`: `HudSurface`, the labels as the Gameface HUD page's state and its messages back.

Panel text templates are `core/templates`.

The client side (the Gameface and GUIFlash backends, the shared layer instance) is `core/client/hud/`.
"""
from __future__ import absolute_import, division, print_function, unicode_literals

from .backend import BackendChain, HudBackend, NullBackend
from .config import ComponentConfig
from .edit import EVENT_DESCRIBE, EVENT_EDIT, HudPreview
from .layer import HudLayer
from .surface import HudSurface
from .panel import PANEL_DEFAULTS, alias_of, component_schema, hex_color, layout_props, matching, max_length, panel_schema, sound_event

__all__ = ('BackendChain', 'ComponentConfig', 'EVENT_DESCRIBE', 'EVENT_EDIT', 'HudBackend', 'HudLayer', 'HudPreview', 'HudSurface',
           'NullBackend', 'PANEL_DEFAULTS', 'alias_of', 'component_schema', 'hex_color', 'layout_props', 'matching', 'max_length',
           'panel_schema', 'sound_event')
