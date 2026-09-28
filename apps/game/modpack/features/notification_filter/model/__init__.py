from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_int
from .constants import CATEGORIES, CLASS_MARKERS, NEVER_HIDDEN

# Fair play: hangar only, it hides notifications the client would otherwise show; nothing else.


def hidden_names(values):
    hidden = set()
    for key, names in CATEGORIES.items():
        if values.get(key):
            hidden.update(names)
    return frozenset(hidden - set(NEVER_HIDDEN))


def notification_names(type_id, class_name, type_table):
    names = [name for name, value in type_table.items() if value == type_id]
    if len(names) < 2:
        return names
    matched = [name for name in names if CLASS_MARKERS.get(name) and CLASS_MARKERS[name] in (class_name or '')]
    return matched or names


def hides(type_id, class_name, hidden, type_table):
    names = notification_names(type_id, class_name, type_table)
    return bool(names) and all(name in hidden for name in names)


def type_table_of(holder):
    return dict((name, value) for name, value in vars(holder).items() if not name.startswith('_') and is_int(value))
