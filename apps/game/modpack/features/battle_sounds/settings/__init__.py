from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud import component_schema, sound_event
from .constants import DEFAULTS, EVENTS, GROUP, LIMITS, SECTION, SWITCH  # noqa: F401

SETTINGS = (SWITCH,)

SCHEMA = component_schema(DEFAULTS, limits=LIMITS, normalizers=dict((event, sound_event) for event in EVENTS))
