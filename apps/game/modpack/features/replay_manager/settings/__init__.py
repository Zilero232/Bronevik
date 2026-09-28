from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud import max_length
from ....core.settings import Schema
from ..model.constants import PERIODS, RESULTS, SORTS
from .constants import DEFAULTS, GROUP, LIMITS, MAX_SEARCH, MAX_TEMPLATE, SWITCH  # noqa: F401

SETTINGS = (SWITCH,)
SCHEMA = Schema(DEFAULTS, choices={'filter_result': RESULTS, 'period': PERIODS, 'sort': SORTS}, limits=LIMITS,
                normalizers={'name_template': max_length(MAX_TEMPLATE), 'search': max_length(MAX_SEARCH)})
