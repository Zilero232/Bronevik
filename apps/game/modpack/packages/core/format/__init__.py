"""Text for panels and pages: the GUIFlash HTML subset (`font`, the shared colours), numbers, times and plural forms."""
from __future__ import absolute_import, division, print_function, unicode_literals

from .clock import format_epoch, format_moment, format_timer
from .constants import (
    COLOR_DOWN,
    COLOR_MUTED,
    COLOR_NEUTRAL,
    COLOR_UP,
    COLOR_WARN,
    DATE_TIME_FORMAT,
    FORMS,
    MARK_COLORS,
)
from .markup import font, single_spaces, strip_tags
from .number import format_number, format_percent
from .plural import count_phrase, counted, forms_of, plural, plural_index

__all__ = (
    'COLOR_DOWN',
    'COLOR_MUTED',
    'COLOR_NEUTRAL',
    'COLOR_UP',
    'COLOR_WARN',
    'DATE_TIME_FORMAT',
    'FORMS',
    'MARK_COLORS',
    'count_phrase',
    'counted',
    'font',
    'format_epoch',
    'format_moment',
    'format_number',
    'format_percent',
    'format_timer',
    'forms_of',
    'plural',
    'plural_index',
    'single_spaces',
    'strip_tags',
)
