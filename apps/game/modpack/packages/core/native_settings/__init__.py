"""Components that change the player's own standard client settings (the ones the game's settings window
offers), described as choices where 'native' keeps the game's value. Pure: the mapping from component
values to client setting names; `core/client/native` reads and writes them."""
from __future__ import absolute_import, division, print_function, unicode_literals

from .constants import NATIVE, OFF, ON, TRI_STATE
from .mapping import from_table, merge_value, native_values, setting_names, tri_state
from .write import write_settings

__all__ = (
    'NATIVE',
    'OFF',
    'ON',
    'TRI_STATE',
    'from_table',
    'merge_value',
    'native_values',
    'setting_names',
    'tri_state',
    'write_settings',
)
