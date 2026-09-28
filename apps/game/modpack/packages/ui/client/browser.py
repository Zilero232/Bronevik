from __future__ import absolute_import, division, print_function, unicode_literals

import BigWorld

from ...core.log import log, safe
from .constants import BROWSER_OPENERS


# RU 1.45 client source (gui/game_control/links_handlers/external.py): BigWorld.openWebBrowser(url); the
# WoT-era wg_openWebBrowser is kept for other clients, the system browser is the last resort.
@safe
def open_url(url):
    for name in BROWSER_OPENERS:
        opener = getattr(BigWorld, name, None)
        if opener is not None:
            opener(url)
            return True
    import webbrowser
    if webbrowser.open(url):
        return True
    log('ui: no browser for %s' % url)
    return False
