"""The companion switch (config.json) and the manager's own section of components.json."""
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.settings import Schema
from .constants import DEFAULTS, GROUP, LIMITS, SWITCH  # noqa: F401

SETTINGS = (SWITCH,)
SCHEMA = Schema(DEFAULTS, limits=LIMITS)
