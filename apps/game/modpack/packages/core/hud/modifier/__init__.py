"""The panel edit modifier: HUD panels take the mouse only while the player holds it (Alt by default).

`modifier_keys(mode)` is the key groups of a mode (an unknown mode falls back to Alt), `is_held(mode, is_down)`
whether every group has a key down (`is_down(key_name)` asks the client). The client side is
`core/client/hud/modifier`.
"""
from __future__ import absolute_import, division, print_function, unicode_literals

from .constants import DEFAULT_MODIFIER, MODIFIER_CHOICES, MODIFIERS

__all__ = ('DEFAULT_MODIFIER', 'MODIFIER_CHOICES', 'is_held', 'modifier_keys')


def modifier_keys(mode):
    """The key groups of `mode`; Alt for an unknown one."""
    return MODIFIERS.get(mode) or MODIFIERS[DEFAULT_MODIFIER]


def is_held(mode, is_down):
    """True while every key group of `mode` has one key down."""
    return all(any(is_down(key) for key in group) for group in modifier_keys(mode))
