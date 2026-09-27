"""The per-panel settings schema: the layout keys every HUD panel has, plus the panel's own.

components.json stores (and a settings window edits) `x`, `y`, `align_x`, `align_y`,
`alpha` (0-100), `font_size`, `drag`, `border` for every panel. `layout_props` maps them to the
renderer props (GUIFlash label names). The panel's on/off switch stays in the companion config.
"""
from __future__ import absolute_import, division, print_function, unicode_literals

import re

from ...settings import Schema
from .constants import ALIAS_PREFIX, LAYOUT_KEYS, PANEL_CHOICES, PANEL_DEFAULTS, PANEL_LIMITS

__all__ = ('ALIAS_PREFIX', 'LAYOUT_KEYS', 'PANEL_DEFAULTS', 'alias_of', 'component_schema', 'hex_color', 'layout_props', 'matching',
           'max_length', 'panel_of', 'panel_schema')

HEX_COLOR = re.compile(r'^#[0-9A-Fa-f]{6}$')


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
    }
