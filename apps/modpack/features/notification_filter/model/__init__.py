from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_int
from .constants import CATEGORIES, NEVER_HIDDEN

# Fair play: hangar only, it hides notifications the client would otherwise show; nothing else.


def hidden_types(values, type_table):
    never = set(type_table.get(name) for name in NEVER_HIDDEN)
    hidden = set()
    for key, names in CATEGORIES.items():
        if values.get(key):
            hidden.update(type_table[name] for name in names if is_int(type_table.get(name)))
    return frozenset(hidden - never)


def type_table_of(holder):
    return dict((name, value) for name, value in vars(holder).items() if not name.startswith('_') and is_int(value))
