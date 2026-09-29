"""The per-panel settings schema: the layout keys every HUD panel has, plus the panel's own.

components.json stores (and a settings window edits) `x`, `y`, `align_x`, `align_y`, `alpha` (0-100), `font_size`,
`drag`, `border` and `scale` (percent, set with the edit modifier + wheel on the Gameface page) for every panel.
`layout_props` maps them to the renderer props (GUIFlash label names; `scale` and `kind` reach only the Gameface
page). The panel's on/off switch stays in the companion config.
"""
from __future__ import absolute_import, division, print_function, unicode_literals

from ...compat import is_number, string_types, to_text
from ...settings import Schema
from .constants import (ALIAS_PREFIX, GAMEFACE_PROPS, HEX_COLOR, LAYOUT_KEYS, MAX_SOUND_EVENT, MOVED_ALIGNS, PANEL_CHOICES, PANEL_DEFAULTS, PANEL_LIMITS,
                        SOUND_EVENT)

__all__ = ('ALIAS_PREFIX', 'GAMEFACE_PROPS', 'LAYOUT_KEYS', 'MOVED_ALIGNS', 'PANEL_DEFAULTS', 'alias_of', 'component_schema', 'hex_color', 'layout_props',
           'matching', 'max_length', 'moved_values', 'panel_of', 'panel_schema', 'sound_event')


def component_schema(defaults, choices=None, limits=None, normalizers=None):
    """A schema for a component section; a non-panel component (hangar notifications) uses it directly.
    The on/off switch of a component is not here: it stays in the companion config (config.json)."""
    return Schema(dict(defaults or {}), choices=choices, limits=limits, normalizers=normalizers)


def panel_schema(defaults=None, choices=None, limits=None, normalizers=None):
    """The common panel keys plus the panel's own; the panel's defaults win (its own x/y, alignment)."""
    merged = dict(PANEL_DEFAULTS)
    merged.update(defaults or {})
    all_choices = dict(PANEL_CHOICES)
    all_choices.update(choices or {})
    all_limits = dict(PANEL_LIMITS)
    all_limits.update(limits or {})
    return Schema(merged, choices=all_choices, limits=all_limits, normalizers=normalizers)


def max_length(limit):
    """A normalizer for free-text settings (templates): cut to `limit` characters."""
    def normalize(value):
        return value[:limit]
    return normalize


def matching(pattern, limit):
    """A normalizer for restricted text (sound event names, image paths): None unless `pattern` matches."""
    def normalize(value):
        return value if len(value) <= limit and pattern.match(value) else None
    return normalize


def hex_color(value):
    """A normalizer for `#RRGGBB` colours (upper-cased)."""
    return value.upper() if HEX_COLOR.match(value) else None


def sound_event(value):
    """A normalizer for Wwise event names (`core/client/sound` plays them): letters, digits, underscores."""
    return matching(SOUND_EVENT, MAX_SOUND_EVENT)(value)


def alias_of(panel_id):
    return ALIAS_PREFIX + panel_id


def panel_of(alias):
    return alias[len(ALIAS_PREFIX):] if alias.startswith(ALIAS_PREFIX) else None


def layout_props(settings):
    return {
        'x': settings.get('x'),
        'y': settings.get('y'),
        'alignX': settings.get('align_x'),
        'alignY': settings.get('align_y'),
        'alpha': round(settings.get('alpha') / 100, 2),
        'drag': bool(settings.get('drag')),
        'border': bool(settings.get('border')),
        'scale': round((settings.get('scale') or PANEL_DEFAULTS['scale']) / 100, 2),
    }


def moved_values(props):
    """The settings values of a renderer's drag or resize report (x, y, alignX, alignY, scale as a fraction)."""
    values = {}
    for key in ('x', 'y'):
        value = props.get(key)
        if is_number(value) and not isinstance(value, bool):
            values[key] = int(round(value))
    for prop, key in MOVED_ALIGNS:
        if isinstance(props.get(prop), string_types):
            values[key] = to_text(props[prop])
    scale = props.get('scale')
    if is_number(scale) and not isinstance(scale, bool):
        values['scale'] = int(round(scale * 100))
    return values
