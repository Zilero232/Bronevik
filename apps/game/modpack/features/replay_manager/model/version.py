from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import string_types, to_text
from .constants import VERSION_PARTS, VERSION_SPLIT


def version_key(text):
    """The numeric parts of a client version (`1.45.0.0`, `v.1.45.0.0 #2284`) the play check compares, or None."""
    if not isinstance(text, string_types):
        return None
    parts = [part for part in VERSION_SPLIT.split(to_text(text)) if part]
    return tuple(int(part) for part in parts[:VERSION_PARTS]) if len(parts) >= VERSION_PARTS else None


def compatible(replay_version, client_version):
    """Whether the running client can play a replay recorded by `replay_version`; unknown on either side is no."""
    replay_key, client_key = version_key(replay_version), version_key(client_version)
    return replay_key is not None and replay_key == client_key
