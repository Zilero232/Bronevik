"""Whether a client image exists, checked once per path (`ResMgr.isFile`), so a widget never shows a broken client icon:
`core.hud.icons.resolve` swaps a missing one for our glyph."""
from __future__ import absolute_import, division, print_function, unicode_literals

from ....compat import to_native

_known = {}


def client_file_exists(path):
    if path not in _known:
        try:
            import ResMgr
            _known[path] = bool(ResMgr.isFile(to_native(path)))
        except Exception:
            _known[path] = True
    return _known[path]
