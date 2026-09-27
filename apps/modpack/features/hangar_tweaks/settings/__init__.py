"""The companion switch (config.json) and the hangar tweaks' section of components.json."""
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.settings import Schema
from .constants import CHOICES, DEFAULTS, GROUP, SWITCH  # noqa: F401

SETTINGS = (SWITCH,)
SCHEMA = Schema(DEFAULTS, choices=CHOICES)
