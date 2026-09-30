"""Vehicle classes as the player panels and the vanilla damage log name them (the vehicle type's `classTag`),
mapped to the short keys the features' strings use (`<feature>_class_<key>`)."""
from __future__ import absolute_import, division, print_function, unicode_literals

from .constants import CLASS_KEYS

__all__ = ('CLASS_KEYS', 'class_key', 'class_tag')


def class_key(tag):
    """'light', 'medium', 'heavy', 'td', 'spg', or None for an unknown tag."""
    return CLASS_KEYS.get(tag)


def class_tag(key):
    """The client's class tag of a short key ('medium' -> 'mediumTank'), or None."""
    for tag, known in CLASS_KEYS.items():
        if known == key:
            return tag
    return None
