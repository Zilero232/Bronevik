# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ..compat import is_number, to_text
from .constants import FORMS, PLURAL_SEPARATOR
from .number import format_number


def plural_index(count, forms):
    """The form of `count` among `forms`: three forms follow the Russian rule (1 бой, 2 боя, 5 боёв, 21 бой,
    11 боёв), two the English one (1 battle, 2 battles)."""
    number = abs(int(count)) if is_number(count) else 0
    if forms == 2:
        return 0 if number == 1 else 1
    last, tens = number % 10, number % 100
    if last == 1 and tens != 11:
        return 0
    if 2 <= last <= 4 and not 12 <= tens <= 14:
        return 1
    return 2


def plural(count, forms):
    """The word for `count` out of `forms`, `бой|боя|боёв` or `battle|battles` (one text, so a catalog string or a
    FORMS entry carries all forms of its language)."""
    words = to_text(forms).split(PLURAL_SEPARATOR)
    if len(words) < 2:
        return words[0]
    return words[min(plural_index(count, len(words)), len(words) - 1)]


def count_phrase(count, forms):
    """`5 боёв`: the number with the thousands separator and its word."""
    return u'%s %s' % (format_number(count), plural(count, forms))


def forms_of(words, translate):
    """The forms of `words` (a FORMS entry: language -> forms) in the translator's language, Russian by default."""
    language = getattr(translate, 'language', None)
    return words.get(language) or words.get('ru') or u''


def counted(count, key, translate):
    """`count_phrase` with the FORMS entry `key` in the translator's language: `counted(2, 'battles', t)` -> `2 боя`."""
    return count_phrase(count, forms_of(FORMS[key], translate))
