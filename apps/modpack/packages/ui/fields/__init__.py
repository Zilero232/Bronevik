"""Settings as UI fields: every descriptor is derived from the component's own `Schema` (type from the
default, limits, choices), labels come from the shared string catalog."""
from __future__ import absolute_import, division, print_function, unicode_literals

from .constants import SWITCH_KEY, TYPE_BOOL, TYPE_CHOICE, TYPE_INT, TYPE_TEXT  # noqa: F401
from .describe import describe_field, describe_fields, field_type  # noqa: F401
from .labels import Labels  # noqa: F401
