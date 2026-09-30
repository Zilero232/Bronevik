from __future__ import absolute_import, division, print_function, unicode_literals

from ...core.compat import string_types
from .constants import MAX_USER_SET


def user_set_tokens(text):
    """The keys a `user_set` value names, in order and without repeats."""
    if not isinstance(text, string_types):
        return []
    tokens = []
    for token in text.split():
        if token not in tokens:
            tokens.append(token)
    return tokens


def normalize_user_set(text):
    joined = ' '.join(user_set_tokens(text))
    return joined if len(joined) <= MAX_USER_SET else None


def with_user_set(text, keys):
    """`text` with `keys` added (a config switch by name, a component value as `<section>.<key>`)."""
    tokens = user_set_tokens(text)
    tokens.extend(key for key in keys if key and key not in tokens)
    return ' '.join(tokens)
