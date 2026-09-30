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
    matched = [name for name in names if _class_matches(name, class_name)]
    return matched or names


def _class_matches(name, class_name):
    marker = CLASS_MARKERS.get(name)
    return bool(marker) and marker in (class_name or '')


def hides(type_id, class_name, hidden, type_table):
    names = notification_names(type_id, class_name, type_table)
    return bool(names) and all(name in hidden for name in names)


def type_table_of(holder):
    table = {}
    for name, value in vars(holder).items():
        if not name.startswith('_') and is_int(value):
            table[name] = value
    return table
