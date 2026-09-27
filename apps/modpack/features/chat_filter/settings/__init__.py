from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud import component_schema, max_length
from .constants import CHOICES, DEFAULTS, GROUP, LIMITS, MAX_WORDS, SECTION, SWITCH  # noqa: F401

SETTINGS = (SWITCH,)
SCHEMA = component_schema(DEFAULTS, choices=CHOICES, limits=LIMITS, normalizers={'block_words': max_length(MAX_WORDS)})
