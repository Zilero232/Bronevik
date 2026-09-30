from __future__ import absolute_import, division, print_function, unicode_literals

from ..compat import is_number
from .constants import MASTERY_CLASSES


def mastery_from_api(data):
    """The base XP one battle needs for each mastery badge, `((dossier level, xp), ...)` from the third class up,
    or None when the answer has no complete `mastery` block."""
    block = data.get('mastery') if isinstance(data, dict) else None
    if not isinstance(block, dict):
        return None
    levels = []
    for key, level in MASTERY_CLASSES:
        xp = block.get(key)
        if not is_number(xp) or xp < 0:
            return None
        levels.append((level, int(round(xp))))
    return tuple(levels)


def mastery_state(levels, own_level):
    """Each badge with its XP and whether the player already holds it (the dossier's markOfMastery)."""
    own = int(own_level) if is_number(own_level) else 0
    return [{'level': level, 'xp': xp, 'reached': own >= level} for level, xp in levels or ()]
