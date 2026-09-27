"""The window bridge: the whole settings window as pure logic (state out, messages in); the client glue
only feeds it a context and moves the JSON between Python and the Gameface page."""
from __future__ import absolute_import, division, print_function, unicode_literals

from .bridge import SettingsBridge  # noqa: F401
from .constants import EVENT_COMPONENT_SETTINGS, EVENT_LANGUAGE, LANGUAGE_CHOICES, LANGUAGES  # noqa: F401
from .links import site_link, site_url  # noqa: F401
