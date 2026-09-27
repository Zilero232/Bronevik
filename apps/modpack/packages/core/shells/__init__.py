"""Shell types as the battle feedback reports them (`extra.getShellType()`), mapped to short codes.

The client gives a `constants.BATTLE_LOG_SHELL_TYPES` IntEnum member (RU 1.45), None for a non-shell
hit; older clients gave the name string. `shell_code` accepts the member, its name or its int value.
"""
from __future__ import absolute_import, division, print_function, unicode_literals

from ..compat import is_int, string_types, to_text
from .constants import BATTLE_LOG_SHELL_NAMES, CODES, SHELL_CODES

__all__ = ('SHELL_CODES', 'shell_code', 'shell_name')


def shell_name(raw):
    if raw is None:
        return None
    name = getattr(raw, 'name', None)
    if isinstance(name, string_types):
        return to_text(name).upper()
    if isinstance(raw, string_types):
        return to_text(raw).upper()
    if is_int(raw) and 0 <= raw < len(BATTLE_LOG_SHELL_NAMES):
        return BATTLE_LOG_SHELL_NAMES[raw]
    return None


def shell_code(raw):
    """'ap', 'apcr', 'heat', 'he', 'smoke', 'flame', or None when unknown / not a shell."""
    return CODES.get(shell_name(raw))
